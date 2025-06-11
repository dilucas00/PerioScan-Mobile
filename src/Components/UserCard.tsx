import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface UserCardProps {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  nome,
  email,
  cargo,
  ativo,
  onEdit,
  onDelete,
}) => {
  const handleDelete = () => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o usuário ${nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: onDelete,
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View style={styles.userIcon}>
            <MaterialIcons name="person" size={24} color="#000" />
          </View>
          <Text style={styles.nome}>{nome}</Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={16} color="#666" />
            <Text style={styles.info}>{email}</Text>
          </View>
          <View style={styles.detailsRow}>
            <View style={styles.cargoContainer}>
              <MaterialIcons name="work" size={16} color="#666" />
              <Text style={styles.cargo}>{cargo}</Text>
            </View>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: ativo ? "#E8F5E9" : "#FFEBEE" },
              ]}
            >
              <MaterialIcons
                name={ativo ? "check-circle" : "cancel"}
                size={16}
                color={ativo ? "#2E7D32" : "#C62828"}
              />
              <Text
                style={[
                  styles.status,
                  { color: ativo ? "#2E7D32" : "#C62828" },
                ]}
              >
                {ativo ? "Ativo" : "Inativo"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <MaterialIcons name="edit" size={16} color="#FFF" />
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <MaterialIcons name="delete" size={16} color="#FFF" />
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  infoContainer: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userIcon: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  contentContainer: {
    paddingLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cargoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 1,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: "auto",
    width: "auto",
  },
  cargo: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 80,
    justifyContent: "center",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  editButton: {
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteButton: {
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "500",
  },
});
