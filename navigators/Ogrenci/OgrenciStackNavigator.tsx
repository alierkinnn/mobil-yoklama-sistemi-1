import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OgrenciAnaSayfa from '../../screens/OgrenciEkranlari/OgrenciAnaSayfa/OgrenciAnaSayfa';
import OgrenciDerseGirisEkrani from '../../screens/OgrenciEkranlari/OgrenciDerseGirisEkrani/OgrenciDerseGirisEkrani';
import OgrenciDevamsizlikDetayEkrani from '../../screens/OgrenciEkranlari/OgrenciDevamsizlikDetayEkrani/OgrenciDevamsizlikDetayEkrani';

export type  OgrenciRootStackParamsList={
    OgrenciAnaSayfa: any,
    OgrenciDerseGiris: any,
    OgrenciDevamsizlikDetay: any,
}

const Stack = createStackNavigator<OgrenciRootStackParamsList>()

export default function OgrenciStackNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="OgrenciAnaSayfa" component={OgrenciAnaSayfa} />
        <Stack.Screen options={{headerShown:false}} name="OgrenciDerseGiris" component={OgrenciDerseGirisEkrani}/>
        <Stack.Screen options={{headerShown:false}} name="OgrenciDevamsizlikDetay" component={OgrenciDevamsizlikDetayEkrani}/>
      </Stack.Navigator>
    </NavigationContainer>
  );

}
