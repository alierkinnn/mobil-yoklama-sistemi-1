import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OgretmenAnaSayfa from '../../screens/OgretmenEkranlari/OgretmenAnaSayfa/OgretmenAnaSayfa';
import OgretmenDerseGirisEkrani from '../../screens/OgretmenEkranlari/OgretmenDerseGirisEkrani/OgretmenDerseGirisEkrani';
import OgretmenYoklamaTakipEkrani from '../../screens/OgretmenEkranlari/OgretmenYoklamaTakipEkrani/OgretmenYoklamaTakipEkrani';
import OgretmenDersEkrani from '../../screens/OgretmenEkranlari/OgretmenDersEkrani/OgretmenDersEkrani';

export type  OgretmenRootStackParamsList={
    OgretmenAnaSayfa: any,
    OgretmenDerseGiris: any,
    OgretmenYoklamaTakip: any,
    OgretmenDers: any,
}

const Stack = createStackNavigator<OgretmenRootStackParamsList>()

export default function OgretmenStackNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="OgretmenAnaSayfa" component={OgretmenAnaSayfa} />
        <Stack.Screen options={{headerShown:false}} name="OgretmenDerseGiris" component={OgretmenDerseGirisEkrani} />
        <Stack.Screen options={{headerShown:false}} name="OgretmenYoklamaTakip" component={OgretmenYoklamaTakipEkrani} />
        <Stack.Screen options={{headerShown:false}} name="OgretmenDers" component={OgretmenDersEkrani} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}
