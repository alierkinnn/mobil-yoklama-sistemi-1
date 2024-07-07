import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AdminAnaSayfa from '../../screens/AdminEkranlari/AdminAnaSayfa/AdminAnaSayfa';
import AdminDersEkleEkrani from '../../screens/AdminEkranlari/AdminDersEkleEkrani/AdminDersEkleEkrani';
import AdminDersListeleEkrani from '../../screens/AdminEkranlari/AdminDersListeleEkrani/AdminDersListeleEkrani';
import AdminOgrenciEkleEkrani from '../../screens/AdminEkranlari/AdminOgrenciEkleEkrani/AdminOgrenciEkleEkrani';
import AdminOgrenciListeleEkrani from '../../screens/AdminEkranlari/AdminOgrenciListeleEkrani/AdminOgrenciListeleEkrani';
import AdminOgretmenEkleEkrani from '../../screens/AdminEkranlari/AdminOgretmenEkleEkrani/AdminOgretmenEkleEkrani';
import AdminProfilEkrani from '../../screens/AdminEkranlari/AdminProfilEkrani/AdminProfilEkrani';

import AdminOgretmenListeleEkrani from '../../screens/AdminEkranlari/AdminOgretmenListeleEkrani/AdminOgretmenListeleEkrani';

import AdminOgretmenDetayEkrani from '../../screens/AdminEkranlari/AdminOgretmenDetayEkrani/AdminOgretmenDetayEkrani';
import AdminOgrenciDetayEkrani from '../../screens/AdminEkranlari/AdminOgrenciDetayEkrani/AdminOgrenciDetayEkrani';
import AdminYoklamaDetayEkrani from '../../screens/AdminEkranlari/AdminYoklamaDetay/AdminYoklamaDetay';
import AdminYoklamaUretmeEkrani from '../../screens/AdminEkranlari/AdminYoklamaIslemleriEkrani/AdminYoklamaIslemleriEkrani';
import AdminGunlukYoklamaUretmeEkrani from '../../screens/AdminEkranlari/AdminGunlukYoklamaUretEkrani/AdminGunlukYoklamaUretmeEkrani';
import AdminYoklamaIslemleriEkrani from '../../screens/AdminEkranlari/AdminYoklamaIslemleriEkrani/AdminYoklamaIslemleriEkrani';



export type  AdminRootStackParamsList={
  AdminAnaSayfa: any,
  AdminDersEkle: any,
  AdminDersListele: any,
  AdminOgrenciEkle: any,
  AdminOgrenciListele: any,
  AdminOgrenciDetay: any,
  AdminOgretmenEkle: any,
  AdminOgretmenListele: any,
  AdminProfil: any,
  AdminYoklamaIslemleri: any,
  AdminOgretmenDetay: any,
  AdminYoklamaDetay: any
  AdminGunlukYoklamaUretme: any,
}

const Stack = createStackNavigator<AdminRootStackParamsList>()

export default function AdminStackNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='AdminAnaSayfa'>
        <Stack.Screen options={{headerShown:false}} name="AdminAnaSayfa" component={AdminAnaSayfa} />
        <Stack.Screen options={{headerShown:false}} name="AdminDersEkle" component={AdminDersEkleEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminDersListele" component={AdminDersListeleEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminOgrenciEkle" component={AdminOgrenciEkleEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminOgrenciListele" component={AdminOgrenciListeleEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminOgrenciDetay" component={AdminOgrenciDetayEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminOgretmenEkle" component={AdminOgretmenEkleEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminOgretmenListele" component={AdminOgretmenListeleEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminOgretmenDetay" component={AdminOgretmenDetayEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminProfil" component={AdminProfilEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminYoklamaIslemleri" component={AdminYoklamaIslemleriEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminYoklamaDetay" component={AdminYoklamaDetayEkrani} />
        <Stack.Screen options={{headerShown:false}} name="AdminGunlukYoklamaUretme" component={AdminGunlukYoklamaUretmeEkrani} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}
