import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerNavigationProp, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { RootStackParamsList } from '../../../App';
import { onValue, ref } from 'firebase/database';
import OgretmenAnaSayfa from '../../../screens/OgretmenEkranlari/OgretmenAnaSayfa/OgretmenAnaSayfa';
import OgretmenProfilEkrani from '../../../screens/OgretmenEkranlari/OgretmenProfilEkrani/OgretmenProfilEkrani';
import styles from './OgretmenDrawerStyle';
import OgretmenStackNavigator from '../OgretmenStackNavigator';



export type  OgretmenDrawerParamsList={
    OgretmenAnaSayfa: any,
    OgretmenProfil: any,
}
  
const Drawer = createDrawerNavigator<OgretmenDrawerParamsList>();

interface OgrenciDrawerProps{
  navigation : DrawerNavigationProp<RootStackParamsList,'OgretmenDrawer'>
}

const OgretmenDrawer= ({navigation}:OgrenciDrawerProps) => {

  const [kullanici, setKullanici] = useState('');
  const [devamsizlik, setDevamsizlik] = useState('');
  
  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      var uid = user.uid;
      const ogrenciRef = ref(FIREBASE_DB, 'Ogretmenler/' + uid);
      onValue(ogrenciRef, (snapshot) => {
        const ogrenciData = snapshot.val();
        if (ogrenciData) {
          setKullanici(ogrenciData.Ad + ' ' + ogrenciData.Soyad);
          setDevamsizlik(ogrenciData.Devamsizlik);
        } else {
          console.log("Öğretmen bilgisi bulunamadı");
        }
      });

    } else {
    // No user is signed in.
    }

  });

  const cikisYap = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('GirisYap')
    } catch (error) {
      
    }
  };

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="OgretmenAnaSayfa" drawerContent={props => {
        return (
          <DrawerContentScrollView {...props} style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{kullanici}</Text>

            </View>
            <DrawerItemList {...props} />
            <TouchableOpacity onPress={cikisYap} style={styles.logoutItem}>
              <Text style={styles.logoutItemText}>Çıkış yap <Ionicons name="exit-outline" size={24} color="white" /> </Text>
            </TouchableOpacity>
          </DrawerContentScrollView>
        );
      }}>
        <Drawer.Screen name="OgretmenAnaSayfa" component={OgretmenStackNavigator} 
        options={({ navigation }) => ({
          drawerLabel: 'Ana Sayfa',
          headerShown: true,
          headerTitle: '',
          headerShadowVisible:false,
          headerStyle: { backgroundColor: '#ddebe1' },
          headerLeft: () => (
            <Ionicons
              style={{margin:15}}
              name="md-menu"
              size={24}
              color="black"
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          drawerActiveBackgroundColor: '#a6adaa',
          drawerActiveTintColor: '#101211',
        })}
        />
        <Drawer.Screen name="OgretmenProfil" component={OgretmenProfilEkrani} 
        options={({ navigation }) => ({
          drawerLabel: 'Profil',
          headerShown: true,
          headerTitle: '',
          headerShadowVisible:false,
          headerStyle: { backgroundColor: '#ddebe1' },
          headerLeft: () => (
            <Ionicons
              style={{margin:15}}
              name="md-menu"
              size={24}
              color="black"
              onPress={() => navigation.toggleDrawer()}
            />
          ),
          drawerActiveBackgroundColor: '#a6adaa',
          drawerActiveTintColor: '#101211',
        })}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default OgretmenDrawer;
