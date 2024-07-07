import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { OgrenciRootStackParamsList } from '../../../navigators/Ogrenci/OgrenciStackNavigator';
import { OgrenciOgretmenDers } from '../../../types/OgrenciOgretmenDers';
import styles from './OgrenciDevamsizlikDetayEkraniStyle';
import { Ders } from '../../../types/Ders';
import { Ogretmen } from '../../../types/Ogretmen';
import { DevamsizlikDetay } from '../../../types/DevamsizlikDetay';
import { DersGetir, GunlukYoklamaGetir, OgrenciGetir, OgretmenGetir } from '../../../services/GetTypeService';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import { GunlukYoklamaBul } from '../../../services/YoklamaService';


interface OgrenciDevamsizlikDetayEkraniProps{
  navigation : StackNavigationProp<OgrenciRootStackParamsList,'OgrenciDevamsizlikDetay'>
}


const OgrenciDevamsizlikDetayEkrani = ({navigation}:OgrenciDevamsizlikDetayEkraniProps) => {

  const [gunlukYoklama,SetGunlukYoklama] = useState<Ders>();
  const [devamsizlikDetayListesi, setDevamsizlikDetayListesi] = useState<DevamsizlikDetay[]>([]);
  const [ogretmenDersListesi, setOgretmenDersListesi] = useState<OgrenciOgretmenDers[]>([]);
  const [sayfa, setSayfa] = useState<boolean>(true);   

  useEffect(() => {
    const ogrenciId = FIREBASE_AUTH.currentUser?.uid;
    if(ogrenciId){
        DevamsizlikDetaylariniGetir(ogrenciId);
        DevamsizlikDetaylariGetir2(ogrenciId);
    }

  }, []);

  const DevamsizlikDetaylariniGetir = (ogrenciId: string) => {
    // Firebase Realtime Database'den referans oluşturun
  const devamsizlikRef = ref(FIREBASE_DB, 'DevamsizlikDetay');

  // Sadece belirli bir öğrenciye ait olanları filtrelemek için sorgu oluşturun
  const ogrenciyeAitSorgu = query(devamsizlikRef, orderByChild('OgrenciId'), equalTo(ogrenciId));

  // Sorguyu çalıştırın ve verileri alın
  get(ogrenciyeAitSorgu)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const devamsizlikDetayListesi: DevamsizlikDetay[] = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          // Dönüştürülen veriyi listeye ekleyin
          devamsizlikDetayListesi.push(childSnapshot.val());
        });
        setDevamsizlikDetayListesi(devamsizlikDetayListesi);
      } else {
        console.log('Öğrenciye ait devamsızlık detayları bulunamadı.');
      }
    })
    .catch((error) => {
      console.error('Öğrenciye ait devamsızlık detayları alınırken hata oluştu:', error);
    });
  }


  const DevamsizlikDetaylariGetir2 = (ogrenciId:string) => {

    const ogrenciogretmendersRef = ref(FIREBASE_DB, 'OgrenciOgretmenDers');

    const ogrenciogretmendersQuery = query(
      ogrenciogretmendersRef,
      orderByChild('OgrenciId'),
      equalTo(ogrenciId)
    );

    get(ogrenciogretmendersQuery).then((snapshot) => {
      if (snapshot.exists()) {
      const list: OgrenciOgretmenDers[] = [];

      snapshot.forEach((childSnapshot) => {
        const ogrenciOgretmenDers: OgrenciOgretmenDers = childSnapshot.val();
        if(ogrenciOgretmenDers.OgrenciId == ogrenciId){
          list.push(ogrenciOgretmenDers);
        }

      });
      setOgretmenDersListesi(list);

    } else {
      console.log('Veri bulunamadı.');
    }
    }).catch((error: any) => {
      console.error('Veri çekme hatası:', error);
    });

  }

  const DevamsizlikSayisiHesapla = (ogrenciId:string, dersId:string, ogretmenId:string):number => {
  var devamsizlikSayisi = 0;

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

  

  const renderItem = ({ item }: { item: DevamsizlikDetay }) => {

    const ogretmen = OgretmenGetir(item.OgretmenId);
    const ders = DersGetir(item.DersId);
    const gunlukYoklama = GunlukYoklamaGetir(item.GunlukYoklamaId);
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{ogretmen.Ad} {ogretmen.Soyad}</Text>
        <Text style={styles.cell}>{ders.DersAdi}</Text>
        <Text style={styles.cell}>{gunlukYoklama.Tarih}</Text>
      </View>
    );
  };

  const renderItem1 = ({ item }: { item: OgrenciOgretmenDers}) => {
    const ogretmen = OgretmenGetir(item.OgretmenId);
    const ders = DersGetir(item.DersId);
    const devamsizlik = DevamsizlikSayisiHesapla(item.OgrenciId, item.DersId, item.OgretmenId);
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{ogretmen.Ad} {ogretmen.Soyad}</Text>
        <Text style={styles.cell}>{ders.DersAdi}</Text>
        <Text style={styles.cell}>{devamsizlik}</Text>
      </View>
    );
    

  };
  

  return (
        
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { borderColor: sayfa ? 'yellow' : 'transparent' }]}
          onPress={() => setSayfa(true)}
        >
          <Text style={styles.buttonText}>Tarihe göre listele</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { borderColor: !sayfa ? 'yellow' : 'transparent' }]}
          onPress={() => setSayfa(false)}
        >
          <Text style={styles.buttonText}>Derse göre listele</Text>
        </TouchableOpacity>
      </View>
      {sayfa ? (
          <View>
            <View style={styles.headerTopBar}>
                <Text style={styles.headerTopBarText}>Devamsızlık Detay</Text>
            </View>
            <View style={styles.basliklar}>
                <Text style={styles.baslik}>Öğretmen</Text>
                <Text style={styles.baslik}>Ders</Text>
                <Text style={styles.baslik}>Tarih</Text>
            </View>
            <FlatList 
              data={devamsizlikDetayListesi}
              renderItem={ renderItem }
            />
          </View> 
        ):(
          <View>
            <View style={styles.headerTopBar}>
                <Text style={styles.headerTopBarText}>Devamsızlık Detay</Text>
            </View>
            <View style={styles.basliklar}>
                <Text style={styles.baslik}>Öğretmen</Text>
                <Text style={styles.baslik}>Ders</Text>
                <Text style={styles.baslik}>Devamsızlık sayısı</Text>
            </View>
            <FlatList 
              data={ogretmenDersListesi}
              renderItem={renderItem1}
            />
         </View> 
        )
      }
    </View>
  );

};

export default OgrenciDevamsizlikDetayEkrani;


