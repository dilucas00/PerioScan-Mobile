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
    height: 65,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "white",
  },
  iconDashboard: {
    width: 47,
    height: 47,
    tintColor: "white",
  },
  indicator: {
    position: "absolute",
    bottom: -10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#fff",
  },
});
