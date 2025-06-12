"use client";

import type React from "react";
import { View, StyleSheet, ScrollView, Image, Linking } from "react-native";
import { Text, Modal, Portal, Button, IconButton } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

interface Evidence {
  id: string;
  type: string;
  description: string;
  content?: string;
  contentType?: string;
  imageType?: string;
  cloudinary?: {
    url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  };
  location: string;
  createdAt: string;
  updatedAt?: string;
}

interface EvidenceViewModalProps {
  visible: boolean;
  onDismiss: () => void;
  evidence: Evidence | null;
  onEdit?: () => void;
}

const EvidenceViewModal: React.FC<EvidenceViewModalProps> = ({
  visible,
  onDismiss,
  evidence,
  onEdit,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLocation = (location: string) => {
    if (!location) return "Localização não disponível";

    const coords = location.split(",");
    if (coords.length === 2) {
      const lat = Number.parseFloat(coords[0]).toFixed(6);
      const lng = Number.parseFloat(coords[1]).toFixed(6);
      return `${lat}, ${lng}`;
    }
    return location;
  };

  const openLocationInMaps = () => {
    if (!evidence?.location) return;

    const coords = evidence.location.split(",");
    if (coords.length === 2) {
      const lat = coords[0];
      const lng = coords[1];
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      Linking.openURL(url);
    }
  };

  const getTypeInfo = () => {
    if (!evidence) return { label: "", icon: "inventory", color: "#666" };

    if (evidence.type === "text") {
      return {
        label: evidence.contentType || "Texto",
        icon: "description",
        color: "#1976D2",
      };
    } else if (evidence.type === "image") {
      return {
        label: evidence.imageType || "Imagem",
        icon: "photo-camera",
        color: "#388E3C",
      };
    }

    return { label: evidence.type, icon: "inventory", color: "#666" };
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  if (!evidence) return null;

  const typeInfo = getTypeInfo();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialIcons
                name={typeInfo.icon as keyof typeof MaterialIcons.glyphMap}
                size={24}
                color="#000"
              />
              <Text style={styles.modalTitle}>Visualizar Evidência</Text>
            </View>
            <View style={styles.headerRight}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: `${typeInfo.color}15` },
                ]}
              >
                <MaterialIcons
                  name={typeInfo.icon as keyof typeof MaterialIcons.glyphMap}
                  size={16}
                  color={typeInfo.color}
                />
                <Text style={[styles.typeText, { color: typeInfo.color }]}>
                  {typeInfo.label}
                </Text>
              </View>
              <IconButton
                icon="close"
                size={20}
                iconColor="#666"
                onPress={onDismiss}
                style={styles.closeButton}
              />
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Descrição</Text>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{evidence.description}</Text>
            </View>
          </View>

          {/* Conteúdo específico por tipo */}
          {evidence.type === "text" && evidence.content && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Conteúdo do Texto</Text>
              <View style={[styles.contentBox, styles.multilineBox]}>
                <Text style={styles.contentText}>{evidence.content}</Text>
              </View>
            </View>
          )}

          {evidence.type === "image" && evidence.cloudinary && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Imagem</Text>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: evidence.cloudinary.url }}
                  style={styles.evidenceImage}
                  resizeMode="contain"
                />
                <View style={styles.imageInfo}>
                  <Text style={styles.imageInfoText}>
                    Dimensões: {evidence.cloudinary.width} x{" "}
                    {evidence.cloudinary.height}
                  </Text>
                  <Text style={styles.imageInfoText}>
                    Tamanho: {formatFileSize(evidence.cloudinary.bytes)}
                  </Text>
                  <Text style={styles.imageInfoText}>
                    Formato: {evidence.cloudinary.format.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Localização */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Localização</Text>
            <View style={styles.locationBox}>
              <View style={styles.locationInfo}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                <Text style={styles.locationText}>
                  {formatLocation(evidence.location)}
                </Text>
              </View>
              {evidence.location && (
                <Button
                  mode="outlined"
                  onPress={openLocationInMaps}
                  style={styles.mapsButton}
                  textColor="#000"
                  icon="map"
                  compact
                >
                  Ver no Mapa
                </Button>
              )}
            </View>
          </View>

          {/* Informações de Data */}
          <View style={styles.dateSection}>
            <View style={styles.dateItem}>
              <MaterialIcons name="schedule" size={16} color="#666" />
              <Text style={styles.dateLabel}>Registrada em:</Text>
              <Text style={styles.dateText}>
                {formatDate(evidence.createdAt)}
              </Text>
            </View>
            {evidence.updatedAt &&
              evidence.updatedAt !== evidence.createdAt && (
                <View style={styles.dateItem}>
                  <MaterialIcons name="update" size={16} color="#666" />
                  <Text style={styles.dateLabel}>Atualizada em:</Text>
                  <Text style={styles.dateText}>
                    {formatDate(evidence.updatedAt)}
                  </Text>
                </View>
              )}
          </View>

          {/* Botões */}
          <View style={styles.buttons}>
            {onEdit && (
              <Button
                mode="outlined"
                onPress={onEdit}
                style={styles.editButton}
                textColor="#000"
                icon="edit"
                labelStyle={{ fontWeight: "bold" }}
              >
                Editar
              </Button>
            )}

            <Button
              mode="contained"
              onPress={onDismiss}
              style={styles.closeButtonBottom}
              buttonColor="#000"
              textColor="#FFF"
              icon="close"
              labelStyle={{ fontWeight: "bold" }}
            >
              Fechar
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 8,
  },
  closeButton: {
    margin: 0,
    backgroundColor: "#F5F5F5",
    width: 32,
    height: 32,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  contentBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  multilineBox: {
    minHeight: 80,
  },
  contentText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  imageContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  evidenceImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageInfo: {
    gap: 4,
  },
  imageInfoText: {
    fontSize: 12,
    color: "#666",
  },
  locationBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  mapsButton: {
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
  },
  dateSection: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
    marginRight: 8,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 8,
  },
  closeButtonBottom: {
    flex: 1,
    borderRadius: 8,
  },
});

export default EvidenceViewModal;
