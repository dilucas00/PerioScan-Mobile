import React from "react";
import { Tabs, usePathname } from "expo-router"; // Alterado de useSegments para usePathname
import { Image, StyleSheet, View } from "react-native";
import AppBarHeader from "../Components/AppBarHeader";

export default function AppLayout() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname); // Adicionado para depuração

  // Não renderizar o AppBarHeader na tela de Login
  const isLoginScreen = pathname === "/Login";
  const showHeader = !isLoginScreen;

  return (
    <>
      {showHeader && <AppBarHeader />}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: isLoginScreen ? { display: 'none' } : styles.tabBar,
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="Login/index" // Adicionado para a tela de Login
          options={{
            href: null, // Oculta da TabBar
          }}
        />

        <Tabs.Screen
          name="Cases/(cases)/[id]"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="DashboardAdmin/index"
          options={{
            title: "",
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <Image
                  source={require("../../assets/DashboardIcon.png")}
                  tintColor={focused ? "#fff" : "rgba(255, 255, 255, 0.5)"}
                  style={styles.iconDashboard}
                  resizeMode="contain"
                />
                {focused && <View style={styles.indicator} />}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="Cases/index"
          options={{
            title: "",
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <Image
                  source={require("../../assets/CasosIcon.png")}
                  tintColor={focused ? "#fff" : "rgba(255, 255, 255, 0.5)"}
                  style={styles.icon}
                  resizeMode="contain"
                />
                {focused && <View style={styles.indicator} />}
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="UserManagement/index"
          options={{
            title: "",
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                <Image
                  source={require("../../assets/userManagementIcon.png")}
                  tintColor={focused ? "#fff" : "rgba(255, 255, 255, 0.5)"}
                  style={styles.icon}
                  resizeMode="contain"
                />
                {focused && <View style={styles.indicator} />}
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000",
    height: 60,
    borderRadius: 20,
    margin: 10,
    marginBottom: 40,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    paddingHorizontal: 0,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "white",
  },
  iconDashboard: {
    width: 40,
    height: 40,
    tintColor: "white",
  },
  indicator: {
    display: "none",
  },
});
