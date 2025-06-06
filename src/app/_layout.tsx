import React from "react";
import { Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
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
        name="Relatorios/index"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Image
                source={require("../../assets/RelatoriosIcon.png")}
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
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000",
    height: 60,
    borderRadius: 20,
    margin: 10,
    marginBottom: 8,
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
