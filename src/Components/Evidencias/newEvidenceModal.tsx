"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import {
  Text,
  Modal,
  Portal,
  TextInput,
  SegmentedButtons,
  Button,
} from "react-native-paper";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

interface NewEvidenceModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmitText: (data: {
    description: string;
    content: string;
    contentType: string;
    location: string;
  }) => Promise<void>;
  onSubmitImage: (data: {
    description: string;
    imageType: string;
    location: string;
    cloudinary: {
      url: string;
      public_id: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
    };
  }) => Promise<void>;
}

const NewEvidenceModal: React.FC<NewEvidenceModalProps> = ({
  visible,
  onDismiss,
  onSubmitText,
  onSubmitImage,
}) => {
  const [evidenceType, setEvidenceType] = useState("text");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState("relato");
  const [imageType, setImageType] = useState("fotografia");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<any>(null);

  const resetForm = () => {
    setDescription("");
    setContent("");
    setContentType("relato");
    setImageType("fotografia");
    setSelectedImage(null);
    setImageInfo(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!description.trim()) newErrors.description = "Descrição é obrigatória";

    if (evidenceType === "text" && !content.trim()) {
      newErrors.content = "Conteúdo do texto é obrigatório";
    }

    if (evidenceType === "image" && !selectedImage) {
      newErrors.image = "É necessário tirar uma foto";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCurrentLocation = async (): Promise<string> => {
    try {
      setLocationLoading(true);

      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permissão de localização negada");
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const locationString = `${latitude},${longitude}`;

      console.log("Localização obtida:", locationString);
      return locationString;
    } catch (error: any) {
      console.error("Erro ao obter localização:", error);
      throw new Error(error.message || "Erro ao obter localização");
    } finally {
      setLocationLoading(false);
    }
  };

  const uploadToCloudinary = async (imageUri: string) => {
    try {
      console.log("Iniciando upload para Cloudinary...");
      console.log("URI da imagem:", imageUri);

      // Criar FormData
      const formData = new FormData();

      // Para React Native Web, precisamos tratar a imagem diferente
      if (Platform.OS === "web") {
        // Para web, converter a URI em blob
        const response = await fetch(imageUri);
        const blob = await response.blob();

        formData.append("file", blob, "evidence.jpg");
      } else {
        // Para mobile, usar a URI diretamente
        const filename = imageUri.split("/").pop() || "evidence.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("file", {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      // Configurações do Cloudinary
      formData.append("upload_preset", "perioscan_mobile"); // Upload preset específico para o PerioScan
      formData.append("folder", "perioscan/evidences");
      formData.append("resource_type", "image");

      console.log("Enviando para Cloudinary...");
      console.log("FormData preparado com arquivo e configurações");

      const cloudinaryUrl =
        "https://api.cloudinary.com/v1_1/perioscan-nuvem/image/upload";
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
        headers: {
          // Não definir Content-Type para FormData - o browser define automaticamente
        },
      });

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro do Cloudinary:", errorText);

        // Tentar fazer parse do JSON de erro
        try {
          const errorJson = JSON.parse(errorText);
          const errorMessage =
            errorJson.error?.message || "Erro no upload da imagem";
          console.error("Mensagem de erro detalhada:", errorMessage);

          if (errorMessage.includes("Upload preset must be whitelisted")) {
            throw new Error(
              "Erro de configuração do Cloudinary: O upload preset não está configurado corretamente. Entre em contato com o administrador do sistema."
            );
          } else {
            throw new Error(errorMessage);
          }
        } catch (parseError) {
          console.error("Erro ao analisar resposta:", parseError);
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
      }

      const result = await response.json();
      console.log("Upload para Cloudinary concluído:", result);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
      };
    } catch (error: any) {
      console.error("Erro detalhado no upload:", error);
      throw new Error(error.message || "Erro ao fazer upload da imagem");
    }
  };

  const takePhoto = async () => {
    try {
      setImageLoading(true);

      // Solicitar permissão da câmera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Erro",
          "Permissão da câmera é necessária para tirar fotos"
        );
        return;
      }

      // Abrir câmera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false, // Não precisamos de base64
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        setImageInfo({
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        });

        if (errors.image) {
          setErrors({ ...errors, image: "" });
        }

        console.log("Foto capturada:", {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        });
      }
    } catch (error: any) {
      console.error("Erro ao tirar foto:", error);
      Alert.alert("Erro", "Erro ao tirar foto: " + error.message);
    } finally {
      setImageLoading(false);
    }
  };

  const selectFromGallery = async () => {
    try {
      setImageLoading(true);

      // Solicitar permissão da galeria
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Erro",
          "Permissão da galeria é necessária para selecionar fotos"
        );
        return;
      }

      // Abrir galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedImage(asset.uri);
        setImageInfo({
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        });

        if (errors.image) {
          setErrors({ ...errors, image: "" });
        }

        console.log("Imagem selecionada:", {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        });
      }
    } catch (error: any) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Erro ao selecionar imagem: " + error.message);
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Obter localização
      const location = await getCurrentLocation();

      if (evidenceType === "text") {
        await onSubmitText({
          description: description.trim(),
          content: content.trim(),
          contentType,
          location,
        });
      } else {
        if (!selectedImage) {
          throw new Error("Nenhuma imagem selecionada");
        }

        // Upload da imagem para Cloudinary
        console.log("Iniciando processo de upload...");
        const cloudinaryData = await uploadToCloudinary(selectedImage);
        console.log("Upload concluído, dados:", cloudinaryData);

        await onSubmitImage({
          description: description.trim(),
          imageType,
          location,
          cloudinary: cloudinaryData,
        });
      }

      resetForm();
      onDismiss();
    } catch (error: any) {
      console.error("Erro ao registrar evidência:", error);
      Alert.alert("Erro", error.message || "Erro ao registrar evidência");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Text style={styles.modalTitle}>Registrar Evidência</Text>

        <Text style={styles.segmentedLabel}>Tipo de Evidência:</Text>
        <SegmentedButtons
          value={evidenceType}
          onValueChange={(value) => {
            setEvidenceType(value);
            resetForm();
          }}
          buttons={[
            {
              value: "text",
              label: "Texto",
              style: {
                backgroundColor: evidenceType === "text" ? "#000" : "#fff",
                borderColor: "#000",
              },
              checkedColor: "#fff",
              uncheckedColor: "#000",
            },
            {
              value: "image",
              label: "Imagem",
              style: {
                backgroundColor: evidenceType === "image" ? "#000" : "#fff",
                borderColor: "#000",
              },
              checkedColor: "#fff",
              uncheckedColor: "#000",
            },
          ]}
          style={styles.segmentedButtons}
        />

        <TextInput
          label="Descrição *"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description) {
              setErrors({ ...errors, description: "" });
            }
          }}
          mode="outlined"
          style={styles.input}
          error={!!errors.description}
          outlineColor="#DDD"
          activeOutlineColor="#000"
          theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
        />
        {errors.description ? (
          <Text style={styles.errorText}>{errors.description}</Text>
        ) : null}

        {evidenceType === "text" ? (
          <>
            <TextInput
              label="Conteúdo do Texto *"
              value={content}
              onChangeText={(text) => {
                setContent(text);
                if (errors.content) {
                  setErrors({ ...errors, content: "" });
                }
              }}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={styles.input}
              error={!!errors.content}
              outlineColor="#DDD"
              activeOutlineColor="#000"
              theme={{ colors: { primary: "#000", onSurfaceVariant: "#666" } }}
            />
            {errors.content ? (
              <Text style={styles.errorText}>{errors.content}</Text>
            ) : null}

            <Text style={styles.segmentedLabel}>Tipo de Conteúdo:</Text>
            <SegmentedButtons
              value={contentType}
              onValueChange={setContentType}
              buttons={[
                {
                  value: "relato",
                  label: "Relato",
                  style: {
                    backgroundColor: contentType === "relato" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "observacao",
                  label: "Observação",
                  style: {
                    backgroundColor:
                      contentType === "observacao" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "depoimento",
                  label: "Depoimento",
                  style: {
                    backgroundColor:
                      contentType === "depoimento" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
              ]}
              style={styles.segmentedButtons}
            />
          </>
        ) : (
          <>
            <View style={styles.imageSection}>
              <View style={styles.imageButtons}>
                <Button
                  mode="contained"
                  onPress={takePhoto}
                  style={[styles.photoButton, { flex: 1, marginRight: 8 }]}
                  buttonColor="#000"
                  textColor="#FFF"
                  icon="camera"
                  disabled={imageLoading}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  {imageLoading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    "Câmera"
                  )}
                </Button>

                <Button
                  mode="outlined"
                  onPress={selectFromGallery}
                  style={[styles.galleryButton, { flex: 1, marginLeft: 8 }]}
                  textColor="#000"
                  icon="image"
                  disabled={imageLoading}
                  labelStyle={{ fontWeight: "bold" }}
                >
                  Galeria
                </Button>
              </View>

              {selectedImage && (
                <View style={styles.imagePreview}>
                  <Text style={styles.imageSelectedText}>
                    ✓ Imagem selecionada
                  </Text>
                  {imageInfo && (
                    <Text style={styles.imageInfoText}>
                      {imageInfo.width} x {imageInfo.height}
                      {imageInfo.fileSize &&
                        ` • ${Math.round(imageInfo.fileSize / 1024)} KB`}
                    </Text>
                  )}
                </View>
              )}

              {errors.image ? (
                <Text style={styles.errorText}>{errors.image}</Text>
              ) : null}
            </View>

            <Text style={styles.segmentedLabel}>Tipo de Imagem:</Text>
            <SegmentedButtons
              value={imageType}
              onValueChange={setImageType}
              buttons={[
                {
                  value: "fotografia",
                  label: "Fotografia",
                  style: {
                    backgroundColor:
                      imageType === "fotografia" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "documento",
                  label: "Documento",
                  style: {
                    backgroundColor:
                      imageType === "documento" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
                {
                  value: "evidencia",
                  label: "Evidência",
                  style: {
                    backgroundColor:
                      imageType === "evidencia" ? "#000" : "#fff",
                    borderColor: "#000",
                  },
                  checkedColor: "#fff",
                  uncheckedColor: "#000",
                },
              ]}
              style={styles.segmentedButtons}
            />
          </>
        )}

        <View style={styles.buttons}>
          <Button
            mode="outlined"
            onPress={() => {
              resetForm();
              onDismiss();
            }}
            style={styles.cancelButton}
            textColor="#000"
            labelStyle={{ fontWeight: "bold" }}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.confirmButton}
            buttonColor="#000"
            textColor="#FFF"
            disabled={loading || locationLoading}
            labelStyle={{ fontWeight: "bold" }}
          >
            {loading || locationLoading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              "Registrar"
            )}
          </Button>
        </View>

        {(loading || locationLoading) && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>
              {locationLoading
                ? "Obtendo localização..."
                : "Registrando evidência..."}
            </Text>
          </View>
        )}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
  },
  segmentedLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageButtons: {
    flexDirection: "row",
    marginBottom: 16,
  },
  photoButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
  galleryButton: {
    borderRadius: 8,
    paddingVertical: 4,
    borderColor: "#000",
    borderWidth: 1,
  },
  imagePreview: {
    backgroundColor: "#F0F8FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  imageSelectedText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  imageInfoText: {
    color: "#666",
    fontSize: 12,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 8,
  },
  loadingOverlay: {
    marginTop: 16,
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default NewEvidenceModal;
