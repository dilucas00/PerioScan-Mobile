import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';

const icons = [
  { name: 'Dashboard', source: require('../../assets/DashboardIcon.png'), route: '/DashboardAdmin' },
  { name: 'Casos', source: require('../../assets/CasosIcon.png'), route: '/Cases' },
  { name: 'Relatorios', source: require('../../assets/RelatoriosIcon.png'), route: '/Relatorios' },
  { name: 'Config', source: require('../../assets/ConfigIcon.png'), route: '/Config' },
];

export default function CustomTabBar() {
  const router = useRouter();
  const segments = useSegments();

  return (
    <View style={styles.container}>
      {icons.map((icon) => (
        <TouchableOpacity
          key={icon.name}
          onPress={() => router.replace(icon.route)}
          style={styles.tabButton}
        >
          <Image
            source={icon.source}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    tintColor: '#fff',
  },
}); 