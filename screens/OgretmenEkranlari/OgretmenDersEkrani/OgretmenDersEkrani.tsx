import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, Button, ActivityIndicator, Modal } from 'react-native';
import { OgretmenRootStackParamsList } from '../../../navigators/Ogretmen/OgretmenStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from './OgretmenDersEkraniStyle';
import { Ogretmen } from '../../../types/Ogretmen';
import { Ders } from '../../../types/Ders';
import { GunlukYoklamaBul, YoklamaBul } from '../../../services/YoklamaService';
import { Yoklama } from '../../../types/Yoklama';
import { DersGetir, OgrenciGetir, OgretmenGetir } from '../../../services/GetTypeService';
import { Ogrenci } from '../../../types/Ogrenci';
import { GunlukYoklama } from '../../../types/GunlukYoklama';
import { Ionicons } from '@expo/vector-icons'; 
import { get, onValue, push, ref, set } from 'firebase/database';
import { FIREBASE_DB } from '../../../firebaseConfig';
import Toast from "react-native-toast-message";
import { DevamsizlikDetay } from '../../../types/DevamsizlikDetay';


interface OgretmenDerseGirisEkraniProps{
  navigation : StackNavigationProp<OgretmenRootStackParamsList,'OgretmenDerseGiris'>,
  route: any;
}


const OgretmenDerseGirisEkrani = ({navigation, route}: OgretmenDerseGirisEkraniProps) => { 
  
  const {yoklamaId, gunlukYoklamaId} = route.params;

  const [ogretmen, setOgretmen] = useState<Ogretmen>();
  const [ders, setDers] = useState<Ders>();
  const [yoklama, setYoklama] = useState<Yoklama>();
  const [gunlukYoklama, setGunlukYoklama] = useState<GunlukYoklama>();
  const [isLoading, setIsLoading] = useState<boolean>(false);


  useEffect(() => {
    
    fetchYoklama(yoklamaId);
    fetchGunlukYoklama(gunlukYoklamaId);
    GunlukYoklamaVerileriniDinle(gunlukYoklamaId);
  },[]);



  const fetchYoklama = async (yoklamaId: string) => {
    try {
      const yoklama = await YoklamaBul(yoklamaId);
      if (yoklama !== null) {
        setYoklama(yoklama);
        setDers(DersGetir(yoklama.DersId));
        setOgretmen(OgretmenGetir(yoklama.OgretmenId));
      } else {
        console.log("Belirtilen öğretmene ait yoklama verisi bulunamadı.");
      }
    } catch (error) {
      console.error("Yoklama verileri alınırken bir hata oluştu:", error);
    }
  };
  
  const fetchGunlukYoklama = async (gunlukYoklamaId: string) => {
    try {
      const gunlukYoklama = await GunlukYoklamaBul(gunlukYoklamaId);
      if (gunlukYoklama !== null) {
        setGunlukYoklama(gunlukYoklama);
      } else {
        console.log("Belirtilen öğretmene ait günlük yoklama verisi bulunamadı.");
      }
    } catch (error) {
      console.error("Günlük Yoklama verileri alınırken bir hata oluştu:", error);
    }
  };

  const DevamsizlikArttir = (ogrenciId:string) => {
    const devamsizlikRef = ref(FIREBASE_DB, `Ogrenciler/${ogrenciId}/Devamsizlik`);
    get(devamsizlikRef)
      .then((snapshot) => {
        // Snapshot'tan değeri alın
        const currentDevamsizlik = snapshot.val();
        
        // Mevcut devamsızlık değerini bir tamsayıya çevirin (varsayılan olarak 0 olarak kabul edin)
        const currentCount = parseInt(currentDevamsizlik || "0", 10);
        
        // Devamsızlık değerini artırın
        const newCount = currentCount + 1;
        
        // Yeni devamsızlık değerini veritabanına geri yükleyin
        set(devamsizlikRef, newCount.toString())
          .then(() => {
            console.log('Devamsızlık değeri başarıyla güncellendi:', newCount);
          })
          .catch((error) => {
            console.error('Devamsızlık değeri güncellenirken bir hata oluştu:', error);
          });
      })
      .catch((error) => {
        console.error('Devamsızlık değeri alınırken bir hata oluştu:', error);
      });
  }

  const GunlukYoklamaVerileriniDinle = (gunlukYoklamaId: string) => {
    const gunlukYoklamaRef = ref(FIREBASE_DB, 'GunlukYoklama' + gunlukYoklamaId);
  
    // Veritabanındaki herhangi bir değişiklikte tetiklenecek dinleyiciyi oluşturun
    onValue(gunlukYoklamaRef, (snapshot) => {
      // Verilerde herhangi bir değişiklik olduğunda burası çalışır
      const data = snapshot.val();
    
      // Verilerin null olup olmadığını kontrol et
      if (data !== null) {
        // Veriler null değilse setGunlukYoklama fonksiyonunu çağır
        setGunlukYoklama(data);
        console.log(data);
        console.log('GunlukYoklama verilerinde değişiklik oldu:', data);
        renderItem(data);
      }
    });
  };

  const DersiBitir = () => {
    setIsLoading(true);

    const bittiMiRef = ref(FIREBASE_DB, `GunlukYoklama/${gunlukYoklama?.Id}/BittiMi`);
      set(bittiMiRef, true)
      .then(() =>{
        const devamsizlikDetaylar: DevamsizlikDetay[] = [];

        // Yoklama verisine bakarak false olan öğrencilerin OgrenciId'lerini bulun
        if (gunlukYoklama && yoklama) {
          Object.entries(gunlukYoklama.Yoklama).forEach(([ogrenciId, yoklamaDurumu]) => {
            if (!yoklamaDurumu) {
              devamsizlikDetaylar.push({
                OgrenciId: ogrenciId,
                GunlukYoklamaId: gunlukYoklama.Id,
                DersId: yoklama.DersId,
                OgretmenId: yoklama.OgretmenId,
              });
            }
          });
        }
         // devamsizlikDetaylar dizisini kullanarak veritabanına kayıt atabilirsiniz
        devamsizlikDetaylar.forEach((detay) => {
          // Veritabanına kayıt atma işlemi için referans oluşturun
          const devamsizlikDetayRef = ref(FIREBASE_DB, `DevamsizlikDetay`);

          // Oluşturulan detayı veritabanına ekleyin
          push(devamsizlikDetayRef, detay)
            .then((newRef) => {
              console.log('Devamsızlık detayı başarıyla kaydedildi:', newRef.key);
            })
            .catch((error) => {
              console.error('Kayıt atılırken bir hata oluştu:', error);
            })
            DevamsizlikArttir(detay.OgrenciId);
        });

        setIsLoading(false);
        navigation.navigate("OgretmenAnaSayfa");

      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Ders bitirilirken bir hata oluştu',
        });
        console.error('Ders bitirilirken bir hata oluştu:', error);
        setIsLoading(false);
      });
  }

  const renderItem = ({ item }: { item: string }) => {
    const ogrenci = OgrenciGetir(item);
    const yoklamaDurumu = gunlukYoklama?.Yoklama[item];
    
    return (
      <View style={styles.row}>
        <Text style={styles.cell}>{ogrenci.OgrenciNumarasi}</Text>
        <Text style={styles.cell}>{ogrenci.Ad} {ogrenci.Soyad}</Text>
        <View style={styles.cell}>
          {yoklamaDurumu === true ? (
            // Öğrenci derse geldiyse bir tik işareti göster
            <Ionicons style={{textAlign:'center'}} name="checkmark-done-outline" size={24} color="green" />
          ) : (
            // Öğrenci derse gelmediyse activity indicator göster
            <ActivityIndicator size="small" color="#0000ff" />
          )}
        </View>
      </View>
    );
  };


  return (
    <View style={styles.container}>

        <View style={{alignItems:'flex-end'}}>
          <TouchableOpacity style={styles.dersBitirButton} onPress={()=> DersiBitir()}>
            <Text style={{color:'white', fontSize:15,}}>Yoklamayı kapat</Text>
            <Ionicons style={{marginHorizontal:5}} name="power-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>{ogretmen?.Ad} {ogretmen?.Soyad}</Text>
            <Text style={styles.headerTopBarText1}>{ders?.DersAdi} </Text>
        </View>

        <View>
          <FlatList
            data={gunlukYoklama ? Object.keys(gunlukYoklama.Yoklama) : []}
            keyExtractor={(item) => item}
            renderItem={renderItem}
          />
        </View>

        <Modal
        animationType="slide"
        transparent={true}
        visible={isLoading}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </View>
        </Modal>

        <Toast></Toast>
    </View>
  );

};

export default OgretmenDerseGirisEkrani;



