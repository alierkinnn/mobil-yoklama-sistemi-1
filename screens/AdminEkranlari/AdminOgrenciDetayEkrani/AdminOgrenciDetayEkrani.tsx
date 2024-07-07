import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList, ActivityIndicator, LogBox } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons'; 
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../firebaseConfig';
import { equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import styles from './AdminOgrenciDetayEkraniStyle';
import { Ogrenci } from '../../../types/Ogrenci';
import { OgrenciOgretmenDers } from '../../../types/OgrenciOgretmenDers';
import { OgrenciGetir } from '../../../services/GetTypeService';
import { ref as storageRef,getDownloadURL } from 'firebase/storage';
import { Image } from "react-native";
import { getImage } from '../../../services/ImageService';

interface AdminOgrenciDetayEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminOgrenciDetay'>
  route: any,
}

type OgretmenDers = {
  DersAdi: string;
  OgretmenAdi: string;
}

const AdminOgrenciDetayEkrani = ({navigation, route}:AdminOgrenciDetayEkraniProps) => {

  const {ogrenciId} = route.params;
  const [isOpen, setIsOpen] = useState(false);
  const [ogrenci, setOgrenci] = useState<Ogrenci>();
  const [ogretmenDersListesi, setOgretmenDersListesi] = useState<OgretmenDers[]>([]);
  const [imageUri, setImageUri] = useState<string>();

  const handleSelect = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
    
    fetchOgrenciResmi();
    setOgrenci(OgrenciGetir(ogrenciId));

    const ogrenciogretmendersRef = ref(FIREBASE_DB, 'OgrenciOgretmenDers');

    // ogrenciId'ye eşit olan düğümleri dersIdListesi'nde sakla
    const ogrenciogretmendersQuery = query(
      ogrenciogretmendersRef,
      orderByChild('OgrenciId'),
      equalTo(ogrenciId)
    );

    get(ogrenciogretmendersQuery).then((snapshot) => {
      if (snapshot.exists()) {
       const dersList: OgretmenDers[] = [];

       snapshot.forEach((childSnapshot) => {
         const ogrenciOgretmenDers: OgrenciOgretmenDers = childSnapshot.val();
         const dersId = ogrenciOgretmenDers.DersId;
         // Ders adını çek
         const dersRef = ref(FIREBASE_DB, 'Dersler/' + dersId);
         onValue(dersRef, (dersSnapshot) => {
           const dersData = dersSnapshot.val();

           if (dersData) {
             // Öğretmen adını çek
             const ogretmenId = ogrenciOgretmenDers.OgretmenId;
             const ogretmenRef = ref(FIREBASE_DB, 'Ogretmenler/' + ogretmenId);
             onValue(ogretmenRef, (ogretmenSnapshot) => {
               const ogretmenData = ogretmenSnapshot.val();
               if (ogretmenData) {
                 const ogretmenDers: OgretmenDers = {
                   DersAdi: dersData.DersAdi,
                   OgretmenAdi: ogretmenData.Ad + " " + ogretmenData.Soyad,
                 };
                 dersList.push(ogretmenDers);
                 setOgretmenDersListesi(dersList);
               } else {
                 console.log("Öğretmen bilgisi bulunamadı");
               }
             });
           } else {
             console.log("Ders bilgisi bulunamadı");
           }
         });
       });
     } else {
       console.log('Veri bulunamadı.');
     }
   }).catch((error: any) => {
     console.error('Veri çekme hatası:', error);
   });



  },[]);

  const fetchOgrenciResmi = async () => {
    try {
      const url = await getImage(ogrenciId);
      if (url) {
        setImageUri(url);
      }
    } catch (error) {
      console.error("Öğrenci resmi alınamadı:", error);
    }
  };



  const renderItem1 = ({ item }: { item: OgretmenDers }) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.dropdownItemText}>{item.DersAdi}</Text>
      <Text>{item.OgretmenAdi}</Text>
    </View>
  );

  return (
    <ScrollView
    style={styles.container}
    >
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>{ogrenci?.Ad}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminOgrenciListele')}>
              <Text style={styles.headerTopBarText1}>Öğrencileri listeleme sayfası </Text>
            </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <ActivityIndicator size="large" color="black"/>
          )}
        </View>

        <View style={styles.container1}>

            <View style={styles.inputContainer}>
              <View style={styles.input1}>
                <Text style={{color:'#1E9D4C', fontSize:16, paddingHorizontal:10}}>Devamsızlık:</Text>
                <Text style={{fontSize:16}}>{ogrenci?.Devamsizlik}</Text>
              </View>
              <View style={styles.input1}>
                <Ionicons name="information-outline" size={20} color="#1E9D4C" style={{paddingHorizontal:10}} /> 
                <Text style={{fontSize:16}}>{ogrenci?.OgrenciNumarasi}</Text>
              </View>
              <View style={styles.input1}>
                <Ionicons name="person-outline" size={20} color="#1E9D4C" style={{paddingHorizontal:10}} /> 
                <Text style={{fontSize:16}}>{ogrenci?.Ad} {ogrenci?.Soyad}</Text>
              </View>
              <View style={styles.input1}>
                <Ionicons name="mail-outline" size={20} color="#1E9D4C" style={{paddingHorizontal:10}} /> 
                <Text style={{fontSize:16}}>{ogrenci?.Eposta}</Text>
              </View>
            </View>

            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(!isOpen)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                  <View  style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <Ionicons style={{color: 'white', paddingHorizontal:10}} name='book-outline' size={20} />
                    <Text style={styles.dropdownText}>Aldığı Dersler</Text>
                  </View>
                  <Ionicons style={{color: 'white'}} name={isOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} />
                </View>
              </TouchableOpacity>

              {isOpen && (
                <FlatList style={{marginBottom:125}}
                  data={ogretmenDersListesi}
                  renderItem={renderItem1}
                />
              )}
            </View>

        </View>
        



      <Toast></Toast>
    </ScrollView>
  );

};

export default AdminOgrenciDetayEkrani;





