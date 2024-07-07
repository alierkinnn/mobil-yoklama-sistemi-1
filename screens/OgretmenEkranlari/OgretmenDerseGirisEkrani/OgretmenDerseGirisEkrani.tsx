import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { child, equalTo, get, onValue, orderByChild, query, ref, set, update } from 'firebase/database';
import styles from './OgretmenDerseGirisEkraniStyle';
import { Ogretmen } from '../../../types/Ogretmen';
import { Ders } from '../../../types/Ders';
import { Yoklama } from '../../../types/Yoklama';
import { Image } from "react-native";
import { OgretmenRootStackParamsList } from '../../../navigators/Ogretmen/OgretmenStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { DersGetir, OgretmenGetir } from '../../../services/GetTypeService';
import { YoklamaIdBul1 } from '../../../services/YoklamaService';
import Toast from 'react-native-toast-message';


interface OgretmenDerseGirisEkraniProps{
  navigation : StackNavigationProp<OgretmenRootStackParamsList,'OgretmenDerseGiris'>,
  route: any;
}


const OgretmenDerseGirisEkrani = ({navigation, route}: OgretmenDerseGirisEkraniProps) => { 
  
  const {dersId} = route.params;

  const [ogretmen, setOgretmen] = useState<Ogretmen>();
  const [ders, setDers] = useState<Ders>();
  const [yoklamaId, setYoklamaId] = useState<string>();  
  const [gunlukYoklamaId, setGunlukYoklamaId] = useState<string>();
  const [dersVarmi,setDersVarmi] = useState<boolean>(false);
  const [dersBittiMi, setDersBittiMi] = useState<boolean>(false);
  const [kod,setKod] = useState<string>();

  useEffect(() => {

    setDers(DersGetir(dersId));
    const ogretmenId = FIREBASE_AUTH.currentUser?.uid;
    if(ogretmenId){
      fetchYoklamaId(ogretmenId);

    }
    
    BugunDersVarmiKontrol();

  },[yoklamaId]);

  const fetchYoklamaId = async (ogretmenId: string) => {
    try {
      const yoklamaId = await YoklamaIdBul1(dersId, ogretmenId);
      if (yoklamaId !== null) {
        setYoklamaId(yoklamaId);
      } else {
        console.log("Belirtilen öğretmene ait yoklama verisi bulunamadı.");
      }
    } catch (error) {
      console.error("Yoklama verileri alınırken bir hata oluştu:", error);
    }
  };


  const BugunDersVarmiKontrol = () => {
    // Bugünün tarihini al
    const today = new Date().toLocaleDateString('tr-TR');

    //GunlukYoklama tablosundan tüm kayıtları al
    const gunlukYoklamaRef = ref(FIREBASE_DB, 'GunlukYoklama');
    const gunlukYoklamaQuery = query(
        gunlukYoklamaRef,
        orderByChild('YoklamaId')
    );

    get(gunlukYoklamaQuery).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const gunlukYoklama = childSnapshot.val();
                if (gunlukYoklama.YoklamaId === yoklamaId  && gunlukYoklama.Tarih === today) {             
                    if(gunlukYoklama.BittiMi){
                      setDersBittiMi(true);
                    }
                    setDersVarmi(true);
                    setGunlukYoklamaId(childSnapshot.key);
                }
            });
        } else {
            console.log("Bugün için yoklama kaydı bulunamadı.");
        }
    }).catch((error) => {
        console.error("Yoklama kaydı kontrol edilirken bir hata oluştu:", error);
    });

  };

  const KodUret = (): string =>{
    let kod: string = '';
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length: number = 6;
  
    for (let i: number = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * characters.length);
      kod += characters.charAt(randomIndex);
    }

    return kod;
  }

  const KodOlustur = (): void =>{

    // Firebase veritabanı bağlantısı
    const yoklamaRef = ref(FIREBASE_DB, 'GunlukYoklama');

    // Bugünün tarihini al
    const today = new Date().toLocaleDateString('tr-TR');

    const yoklamaQuery = query(
      yoklamaRef,
      orderByChild('YoklamaId'), // YoklamaId'ye göre sırala
    );
  
    // Sorguyu gerçekleştir ve sonucu al
    get(yoklamaQuery).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const yoklama = childSnapshot.val();
        if (yoklama.YoklamaId === yoklamaId && yoklama.Tarih === today) {
          if(yoklama.Kod === ""){
              var kod = KodUret();
              const key = childSnapshot.key;
              // Kod özelliğini güncelle
              update(ref(FIREBASE_DB, `GunlukYoklama/${key}`), { Kod: kod })
                .then(() => console.log("Kod başarıyla güncellendi."))
                .catch((error) => console.error("Kod güncellenirken bir hata oluştu:", error));
                setKod(kod);
            }
            else{
              setKod(yoklama.Kod);
            }
          }


      });
    }).catch((error) => {
      console.error("Sorgulama yapılırken bir hata oluştu:", error);
    });
    
    
  };

  const DersEkraninaGit = () =>{
    if(kod){
      navigation.navigate("OgretmenDers",{yoklamaId:yoklamaId, gunlukYoklamaId:gunlukYoklamaId});
    }
    else{
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lütfen dersi başlatmak için kod üretin',
        visibilityTime:2500,
      });
    }
    
  }


  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
        <Image style= {styles.logo} source={require('../../../assets/koulogo.png')}/>
      </View>

      {dersVarmi ? (
        
        <>{dersBittiMi ? (
          <Text style={{fontSize:18, marginHorizontal:10, marginVertical:30}}>Bu ders sonlanmıştır.</Text>
        ) : (
          <View style={{paddingTop:10, alignItems:'center'}}>
            <TouchableOpacity style={styles.button} onPress={KodOlustur}>
              <Text style={styles.buttonText}>Kod Oluştur</Text>
            </TouchableOpacity>
            <Text style={{fontSize:28}}>{kod}</Text>
            <TouchableOpacity style={styles.buttonOutline} onPress={() => DersEkraninaGit()}>
              <Text style={styles.buttonOutlineText}>Dersi başlat</Text>
            </TouchableOpacity>
          </View>
        )}</>
      ) : (
        <>
          <Text style={styles.hataTxt}>Bugün dersiniz yoktur.</Text>
        </>
      )}


        <Toast></Toast>
    </View>
  );

};

export default OgretmenDerseGirisEkrani;



