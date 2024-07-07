import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import styles from './OgrenciAnaSayfaStyle';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { child, equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { OgrenciRootStackParamsList } from '../../../navigators/Ogrenci/OgrenciStackNavigator';
import { OgrenciOgretmenDers } from '../../../types/OgrenciOgretmenDers';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';

type Coords = {
  latitude: number;
  longitude: number;
};

type OgretmenDers = {
  DersId: string;
  DersAdi: string;
  OgretmenId: string;
  OgretmenAdi: string;
}

interface OgrenciAnaSayfaProps{
  navigation : StackNavigationProp<OgrenciRootStackParamsList,'OgrenciAnaSayfa'>
}



const OgrenciAnaSayfa = ({navigation}:OgrenciAnaSayfaProps) => {

  const [location, setLocation] = useState<Coords | null>(null);
  const [dersListesi, setDersListesi] = useState<OgrenciOgretmenDers[]>([]);
  const [ogretmenDersListesi, setOgretmenDersListesi] = useState<OgretmenDers[]>([]);
  const [isWithinArea, setIsWithinArea] = useState<boolean>(false);

  useEffect(() => {

    getLocation();
    console.log(isWithinArea);

    const user = FIREBASE_AUTH.currentUser;

    if (user) {
       // Firebase Realtime Database'den ogrenciogretmenders tablosundaki verileri al
       const ogrenciogretmendersRef = ref(FIREBASE_DB, 'OgrenciOgretmenDers');
       const ogrenciId = user.uid;
 
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
                      DersId: dersData.DersId,
                      DersAdi: dersData.DersAdi,
                      OgretmenId: ogretmenId,
                      OgretmenAdi: ogretmenData.Ad + " " + ogretmenData.Soyad,
                    };
                    dersList.push(ogretmenDers);
                    setOgretmenDersListesi(dersList);
                    console.log(dersList);
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
    } else {
      console.log('Kullanıcı girişi yapılmamış.');
    }

  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const userCoords: Coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    console.log(userCoords);
    setLocation(userCoords);
    
    const targetLocation: Coords = { latitude: 40.78003, longitude: 29.94647}; // Hedef konum
    const radius = 3; 
    
    if (isWithinRadius(userCoords, targetLocation, radius)) {
      setIsWithinArea(true);
    } else {
      setIsWithinArea(false);
    }
  };

  const isWithinRadius = (userLocation: Coords, targetLocation: Coords, radius: number): boolean => {
    const distance = haversineDistance(userLocation, targetLocation);
    console.log(distance);
    return distance <= radius;
  };


  const haversineDistance = (coords1: Coords, coords2: Coords): number => {
    const toRad = (value: number): number => (value * Math.PI) / 180;
    const R = 6371; // Dünyanın yarıçapı (kilometre cinsinden)

    const dLat = toRad(coords2.latitude - coords1.latitude);
    const dLon = toRad(coords2.longitude - coords1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coords1.latitude)) *
      Math.cos(toRad(coords2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Mesafe kilometre cinsinden
  };

  const renderItem = ({ item }: { item: OgretmenDers }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.cardItem}>Ders:</Text>
          <Text style={styles.cardItem1}>{item.DersAdi}</Text>
        </View>
        <View>
          <Text style={styles.cardItem}>Öğretmen:</Text>
          <Text style={styles.cardItem1}>{item.OgretmenAdi}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={()=> navigation.push("OgrenciDerseGiris",{ogretmenId:item.OgretmenId, dersId:item.DersId})}>
        <Ionicons name="log-in-outline" size={30} style={styles.ikon} />
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
        <FlatList
        data={ogretmenDersListesi}
        renderItem={renderItem}
        />
    </View>
  );

};

export default OgrenciAnaSayfa;


