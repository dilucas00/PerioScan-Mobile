"use client";
import { Tabs, usePathname } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import AppBarHeader from "../Components/AppBarHeader";
import { PaperProvider } from "react-native-paper";

export default function AppLayout() {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  // Não renderizar o AppBarHeader na tela de Login ou na tela inicial
  const isLoginScreen = pathname === "/Login" || pathname === "/";
  const showHeader = !isLoginScreen;

  return (
    <PaperProvider>
      {showHeader && <AppBarHeader />}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: isLoginScreen ? { display: "none" } : styles.tabBar,
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
          name="Login/index"
          options={{
            href: null,
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
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000",
    height: 60,
    borderRadius: 20,
    margin: 10,
    marginBottom: 30,
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
