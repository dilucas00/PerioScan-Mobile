import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface UserCardProps {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  ativo: boolean;
  onEdit?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  nome,
  email,
  cargo,
  ativo,
  onEdit,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.idText}>ID: {id.toString().padStart(7, "0")}</Text>
        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.info}>Email: {email}</Text>
        <Text style={styles.info}>Cargo: {cargo}</Text>
        <Text style={styles.status}>{ativo ? "Ativo" : "Inativo"}</Text>
      </View>

      {onEdit && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.button} onPress={onEdit}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        </View>
      )}
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
    alignItems: "center",
  },
  infoContainer: {
    marginBottom: 12,
    alignItems: "center",
  },
  idText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  info: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  status: {
    fontSize: 14,
    color: "#007F00",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    backgroundColor: "#4C9EEB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
