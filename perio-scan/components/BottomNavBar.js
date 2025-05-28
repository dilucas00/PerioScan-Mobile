import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BottomNavBar = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <MaterialCommunityIcons name="chart-bar" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Cases')}>
        <MaterialCommunityIcons name="file-document" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
        <MaterialCommunityIcons name="chart-line" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <MaterialCommunityIcons name="cog" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default BottomNavBar;