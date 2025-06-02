import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import DashboardScreen from './src/screens/DashboardAdmin';


export default function App() {
  return (
    <View >
      <DashboardScreen/>
      <StatusBar style="auto" />
    </View>
  );
}

