import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerNavigationProp, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { RootStackParamsList } from '../../../App';
import { onValue, ref } from 'firebase/database';
import styles from './OgrenciDrawerStyle';
import OgrenciAnaSayfa from '../../../screens/OgrenciEkranlari/OgrenciAnaSayfa/OgrenciAnaSayfa';
import OgrenciProfilEkrani from '../../../screens/OgrenciEkranlari/OgrenciProfilEkrani/OgrenciProfilEkrani';
import OgrenciStackNavigator, { OgrenciRootStackParamsList } from '../OgrenciStackNavigator';
import { getImage } from '../../../services/ImageService';
import { Image } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import OgrenciDevamsizlikDetayEkrani from '../../../screens/OgrenciEkranlari/OgrenciDevamsizlikDetayEkrani/OgrenciDevamsizlikDetayEkrani';


export type  OgrenciDrawerParamsList={
    OgrenciAnaSayfa: any,
    OgrenciProfil: any,
    OgrenciDevamsizlik: any,
}
  
const Drawer = createDrawerNavigator<OgrenciDrawerParamsList>();

interface OgrenciDrawerProps{
  navigation : DrawerNavigationProp<RootStackParamsList,'OgrenciDrawer'>
}

const OgrenciDrawer= ({navigation}:OgrenciDrawerProps) => {

  const [imageUri, setImageUri] = useState<string>();
  const [kullanici, setKullanici] = useState('');
  const [devamsizlik, setDevamsizlik] = useState('');
  
  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    const userId = user?.uid;
    
    if(userId){
      fetchOgrenciResmi(userId);
    }

    if (user) {
      var uid = user.uid;
      const ogrenciRef = ref(FIREBASE_DB, 'Ogrenciler/' + uid);
      onValue(ogrenciRef, (snapshot) => {
        const ogrenciData = snapshot.val();
        if (ogrenciData) {
          setKullanici(ogrenciData.Ad + ' ' + ogrenciData.Soyad);
          setDevamsizlik(ogrenciData.Devamsizlik);
        } else {
          console.log("Öğrenci bilgisi bulunamadı");
        }
      });

    } else {
    // No user is signed in.
    }

  });

  const fetchOgrenciResmi = async (userId: string) => {
    try {
      const url = await getImage(userId);
      if (url) {
        setImageUri(url);
      }
    } catch (error) {
      console.error("Öğrenci resmi alınamadı:", error);
    }
  };


  const cikisYap = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('GirisYap')
    } catch (error) {
      
    }
  };

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator initialRouteName="OgrenciAnaSayfa" drawerContent={props => {
        return (
          <DrawerContentScrollView {...props} style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>{kullanici}</Text>
              <Text style={styles.headerText1}>Devamsızlık : {devamsizlik}</Text>
              <View style={styles.imageContainer}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <ActivityIndicator size="large" color="black"/>
              )}
            </View>
            </View>
            <DrawerItemList {...props} />
            <TouchableOpacity onPress={cikisYap} style={styles.logoutItem}>
              <Text style={styles.logoutItemText}>Çıkış yap <Ionicons name="exit-outline" size={24} color="white" /> </Text>
            </TouchableOpacity>
          </DrawerContentScrollView>
        );
      }}>
        <Drawer.Screen name="OgrenciAnaSayfa" component={OgrenciStackNavigator} 
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
        <Drawer.Screen name="OgrenciProfil" component={OgrenciProfilEkrani} 
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
        <Drawer.Screen name="OgrenciDevamsizlik" component={OgrenciDevamsizlikDetayEkrani} 
        options={({ navigation }) => ({
          drawerLabel: 'Devamsızlık Detay',
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

export default OgrenciDrawer;
