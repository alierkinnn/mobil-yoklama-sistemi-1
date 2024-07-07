import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import AdminAnaSayfa from '../../../screens/AdminEkranlari/AdminAnaSayfa/AdminAnaSayfa';
import AdminProfilEkrani from '../../../screens/AdminEkranlari/AdminProfilEkrani/AdminProfilEkrani';
import { DrawerContentScrollView, DrawerItem, DrawerItemList, DrawerNavigationProp, createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { RootStackParamsList } from '../../../App';
import styles from './AdminDrawerStyle';
import { onValue, ref } from 'firebase/database';
import AdminStackNavigator from '../AdminStackNavigator';


export type  AdminDrawerParamsList={
    AdminAnaSayfa: any,
    AdminProfil: any,
    AdminDersEkle: any,
}
  
const Drawer = createDrawerNavigator<AdminDrawerParamsList>();

interface AdminDrawerProps{
  navigation : DrawerNavigationProp<RootStackParamsList,'AdminDrawer'>
  route:any;
}

const AdminDrawer= ({navigation}:AdminDrawerProps) => {

  const [kullanici, setKullanici] = useState('');
  
  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      var uid = user.uid;
      const adminRef = ref(FIREBASE_DB, 'Adminler/' + uid);
      onValue(adminRef, (snapshot) => {
        const adminData = snapshot.val();
        if (adminData) {
          setKullanici(adminData.Ad + ' ' + adminData.Soyad);
        } else {
          console.log("Admin bilgisi bulunamadı");
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
      <Drawer.Navigator initialRouteName="AdminAnaSayfa" drawerContent={props => {
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
        <Drawer.Screen name="AdminAnaSayfa" component={AdminStackNavigator} 
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
        <Drawer.Screen name="AdminProfil" component={AdminProfilEkrani} 
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


export default AdminDrawer;
