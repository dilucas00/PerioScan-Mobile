import React, { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";

interface AppBarHeaderProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

interface UserData {
  name: string;
  role: string;
}

const AppBarHeader: React.FC<AppBarHeaderProps> = ({
  showBack = false,
  actions,
}) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem("name");
        const role = await AsyncStorage.getItem("role");

        if (name && role) {
          setUserData({ name, role });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace("/Login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <Appbar.Header
      style={{
        backgroundColor: "#000",
        elevation: 0,
        shadowOpacity: 0,
        height: 70,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
      }}
    >
      {showBack && (
        <Appbar.BackAction color="#FFF" onPress={() => router.back()} />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        {userData ? (
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: "#FFF",
                fontSize: 12,
                textAlign: "left",
              }}
            >
              ({userData.role})
            </Text>
            <Text
              style={{
                color: "#FFF",
                fontSize: 16,
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              {userData.name}
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#FFF" }}>Carregando usuário...</Text>
        )}
      </View>

      {actions}

      <Appbar.Action icon="logout" color="#FFF" onPress={handleLogout} />
    </Appbar.Header>
  );
};

export default AppBarHeader;
