import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { ref, onValue, query, orderByChild, equalTo, get } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import styles from './OgretmenYoklamaTakipEkraniStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import { OgretmenRootStackParamsList } from '../../../navigators/Ogretmen/OgretmenStackNavigator';
import { Ogrenci } from '../../../types/Ogrenci';
import { YoklamaBul, YoklamaIdBul, YoklamaIdBul1 } from '../../../services/YoklamaService';
import { OgrenciGetir } from '../../../services/GetTypeService';
import { Yoklama } from '../../../types/Yoklama';

interface YoklamaDevamsizlik{
  OgrenciId: string;
  Devamsizlik: string;
};

interface OgretmenYoklamaTakipEkraniProps {
  navigation: StackNavigationProp<OgretmenRootStackParamsList, 'OgretmenYoklamaTakip'>,
  route: any;
}

const OgretmenYoklamaTakipEkrani = ({ navigation, route }: OgretmenYoklamaTakipEkraniProps) => {
  const { dersId } = route.params;

  const [yoklamaId, setYoklamaId] = useState<string>(); 
  const [yoklama, setYoklama] = useState<Yoklama>(); 
  const [ogrenciIdListesi, setOgrenciIdListesi] = useState<string[]>([]);

  useEffect(() => {

    const ogretmenId = FIREBASE_AUTH.currentUser?.uid;

    if(ogretmenId){
      fetchYoklama();
    }


  }, []);

  const fetchYoklama = async () => {
    const ogretmenId = FIREBASE_AUTH.currentUser?.uid;
    if (ogretmenId) {
      try {
        const id = await YoklamaIdBul1(dersId, ogretmenId);
        if (id) {
          const yoklama = await YoklamaBul(id);
          setYoklama(yoklama !== null ? yoklama : undefined);
        }
      } catch (error) {
        console.error("Yoklama verileri alınırken bir hata oluştu:", error);
      }
    }
  };

  const DevamsizlikSayisiHesapla = (ogrenciId:string):number => {
    var devamsizlikSayisi = 0;
    const ogretmenId = FIREBASE_AUTH.currentUser?.uid;
    const devamsizlikRef = ref(FIREBASE_DB, 'DevamsizlikDetay');
    onValue(devamsizlikRef, (snapshot) => {
      if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                if(childSnapshot.val().DersId == dersId && childSnapshot.val().OgretmenId == ogretmenId && childSnapshot.val().OgrenciId == ogrenciId){
                  devamsizlikSayisi++;
                }
              });
              return devamsizlikSayisi;
            } else {
              console.log('Öğrenciye ait devamsızlık detayları bulunamadı.');
              return 0;
            }
      })
      return devamsizlikSayisi;
  };
  
    
  const renderItem = ({ item }: { item: string }) => {
    const ogrenci = OgrenciGetir(item);
    const devamsizlikSayisi = DevamsizlikSayisiHesapla(item);
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{ogrenci.OgrenciNumarasi}</Text>
        <Text style={styles.cell}>{ogrenci.Ad} {ogrenci.Soyad}</Text>
        <Text style={styles.cell}>{devamsizlikSayisi}</Text>
      </View>
    );
  };
  


  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Yoklama Takip</Text>
        </View>
        <View style={styles.basliklar}>
            <Text style={styles.baslik}>Öğrenci numarası</Text>
            <Text style={styles.baslik}>İsim</Text>
            <Text style={styles.baslik}>Devamsızlık</Text>
        </View>
        <FlatList 
          data={yoklama?.DersiAlanOgrenciler}
          keyExtractor={item => item}
          renderItem={ renderItem }
        />
    </View> 
    </View>
  );
};

export default OgretmenYoklamaTakipEkrani;

