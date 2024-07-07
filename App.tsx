import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GirisYapEkrani from './screens/GirisYapEkrani/GirisYapEkrani';
import KayitOlEkrani from './screens/KayitOlEkrani/KayitOlEkrani';
import SifremiUnuttumSayfasi from './screens/SifremiUnuttumSayfasi/SifremiUnuttumSayfasi';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import AdminDrawer from './navigators/Admin/AdminDrawer/AdminDrawer';
import OgrenciDrawer from './navigators/Ogrenci/OgrenciDrawer/OgrenciDrawer';
import OgretmenDrawer from './navigators/Ogretmen/OgretmenDrawer/OgretmenDrawer';
import OgrenciDevamsizlikDetayEkrani from './screens/OgrenciEkranlari/OgrenciDevamsizlikDetayEkrani/OgrenciDevamsizlikDetayEkrani';



export type  RootStackParamsList={
  GirisYap: any,
  KayitOl: any,
  SifremiUnuttum: any,
  AdminDrawer: any,
  OgrenciDrawer: any,
  OgretmenDrawer: any,
}

const Stack = createStackNavigator<RootStackParamsList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="GirisYap" component={GirisYapEkrani} />
        <Stack.Screen options={{headerShown:false}} name="KayitOl" component={KayitOlEkrani} />
        <Stack.Screen options={{headerShown:false}} name="SifremiUnuttum" component={SifremiUnuttumSayfasi} />
        <Stack.Screen options={{headerShown:false}}  name="AdminDrawer" component={AdminDrawer} />
        <Stack.Screen options={{headerShown:false}}  name="OgrenciDrawer" component={OgrenciDrawer} />
        {/* <Stack.Screen options={{headerShown:false}} name="AdminAnaSayfa" component={AdminAnaSayfa} ></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name="AdminDersEkle" component={AdminDersEkleEkrani}></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name='AdminDersListele' component={AdminDersListeleEkrani}></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name="AdminOgrenciEkle" component={AdminOgrenciEkleEkrani}></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name='AdminOgrenciListele' component={AdminOgrenciListeleEkrani}></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name="AdminOgretmenEkle" component={AdminOgretmenEkleEkrani}></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name='AdminOgretmenListele' component={AdminOgretmenListeleEkrani}></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name="AdminYoklamaUretme" component={AdminYoklamaUretmeEkrani}></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name="OgrenciAnaSayfa" component={OgrenciAnaSayfa} ></Stack.Screen>
        <Stack.Screen options={{headerShown:false}} name="OgrenciDerseGiris" component={OgrenciDerseGirisEkrani} ></Stack.Screen> */}
        <Stack.Screen options={{headerShown:false}} name='OgretmenDrawer' component={OgretmenDrawer}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );

}
