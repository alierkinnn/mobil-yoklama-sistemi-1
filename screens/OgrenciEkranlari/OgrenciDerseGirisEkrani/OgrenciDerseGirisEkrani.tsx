import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, Button, Modal, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { child, equalTo, get, onValue, orderByChild, push, query, ref, set } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons'; 
import styles from './OgrenciDerseGirisEkraniStyle';
import { Ogretmen } from '../../../types/Ogretmen';
import { Ders } from '../../../types/Ders';
import { Ogrenci } from '../../../types/Ogrenci';
import { OgrenciRootStackParamsList } from '../../../navigators/Ogrenci/OgrenciStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Yoklama } from '../../../types/Yoklama';
import { Image } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { DersGetir, OgrenciGetir, OgretmenGetir } from '../../../services/GetTypeService';
import { GunlukYoklama } from '../../../types/GunlukYoklama';
import Toast from 'react-native-toast-message';
import { getImage, imageFromCamera, imageFromGallery } from '../../../services/ImageService';
import { compareFaces } from '../../../services/FaceService';

interface OgrenciDerseGirisEkraniProps{
  navigation : StackNavigationProp<OgrenciRootStackParamsList,'OgrenciDerseGiris'>,
  route: any;
}

const OgrenciDerseGirisEkrani = ({navigation, route}: OgrenciDerseGirisEkraniProps) => {  

  const {ogretmenId, dersId} = route.params;
  
  const [isLoading, setIsLoading] = useState(false);
  const [derseGirdimi, setDerseGirdimi] = useState(false);
  const [dersBittiMi, setDersBittiMi] = useState<boolean>(false);
  
  const [ogrenci, setOgrenci] = useState<Ogrenci>();
  // const [imageUri, setImageUri] = useState<string>();
  // const [newImageUri, setNewImageUri] =useState<string>();
  const [ogretmen, setOgretmen] = useState<Ogretmen>();
  const [ders, setDers] = useState<Ders>();
  const [dersVarmi,setDersVarmi] = useState<boolean>(false);
  const [gunlukYoklama, setGunlukYoklama] = useState<GunlukYoklama>();
  const [kod, setKod] = useState<string>();

  useEffect(() => {

    const ogrenciId = FIREBASE_AUTH.currentUser?.uid;
    if(ogrenciId){
      setOgrenci(OgrenciGetir(ogrenciId));
    }
    setDers(DersGetir(dersId));
    setOgretmen(OgretmenGetir(ogretmenId));
    const yoklamaRef = ref(FIREBASE_DB, 'Yoklama');

    const yoklamaQuery = query(
      yoklamaRef,
      orderByChild('OgretmenId'),
      equalTo(ogretmenId)
    );
      
    get(yoklamaQuery).then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const yoklama: Yoklama = childSnapshot.val();
            if (yoklama.DersId === dersId) {
              const yoklamaId = childSnapshot.key;
              BugunDersVarmiKontrol(yoklamaId);
              
            }
          });
          
        } else {
          console.log("Belirtilen öğretmene ait yoklama verisi bulunamadı.");
        }
      }).catch((error) => {
        console.error("Yoklama verileri alınırken bir hata oluştu:", error);
      });


  },[]);

  const BugunDersVarmiKontrol = (yoklamaId: string | null | undefined) => {
    // Check if yoklamaId is defined
    if (yoklamaId) {
        // Bugünün tarihini al
        const today = new Date().toLocaleDateString('tr-TR');

        // GunlukYoklama tablosundan tüm kayıtları al
        const gunlukYoklamaRef = ref(FIREBASE_DB, 'GunlukYoklama');
        const gunlukYoklamaQuery = query(
            gunlukYoklamaRef,
            orderByChild('YoklamaId'),
            equalTo(yoklamaId),
        );

        get(gunlukYoklamaQuery)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const gunlukYoklama = childSnapshot.val();
                        if (gunlukYoklama.Tarih === today) {
                            console.log("Bugün için yoklama kaydı bulundu:", gunlukYoklama);
                            setGunlukYoklama(gunlukYoklama);
                            
                            if(gunlukYoklama.BittiMi){
                              console.log("bitti")
                              setDersBittiMi(true);
                            }

                            if(ogrenci){
                              console.log(gunlukYoklama.Yoklama[ogrenci.Id]);
                              if(gunlukYoklama.Yoklama[ogrenci.Id]){
                                console.log("derse girdi")
                                setDerseGirdimi(true);
                              }
                            }
                            setDersVarmi(true);
                        }
                    });
                } else {
                    console.log("Bugün için yoklama kaydı bulunamadı.");
                }
            })
            .catch((error) => {
                console.error("Yoklama kaydı kontrol edilirken bir hata oluştu:", error);
            });
    } else {
        console.log("Yoklama ID bulunamadı.");
    }
};

  const DerseGir = () =>{
    if(!kod){
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lütfen kod giriniz',
        visibilityTime:2500,
      });
    }
    else if(gunlukYoklama?.Kod === ""){
      Toast.show({
        type: 'info',
        position: 'top',
        text1: 'Öğretmeniniz daha dersi başlatmadı',
        visibilityTime:2500,
      });
    }
    else if(gunlukYoklama?.Kod !== kod){
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Girdiğiniz kod yanlış',
        visibilityTime:2500,
      });
    }
    else{

      if(ogrenci){
        DerseGirisKontrolleri(ogrenci.Id);
      }

    }

  }



  const DerseGirisKontrolleri = async(ogrenciId: string) => {

    var url1 = "";
    var url2 = "";

    try {
      const url = await getImage(ogrenciId);
      if (url) {
        url1 = url;
      }
    } catch (error) {
      console.error("Öğrenci resmi alınamadı:", error);
      return;
    }

    try {
      const url = await imageFromGallery();
      if (url) {
        url2 = url
      }
    } catch (error) {
      console.error("Kamera resmi alınamadı:", error);
    }

    if(!url1 || !url2){
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Resim seçiniz.',
        visibilityTime: 2500,
      });
      setIsLoading(false);
    }
    else{
      setIsLoading(true);

      compareFaces(url1, url2)
      .then((yuzKontrol) => {
        if (yuzKontrol) {
          // const yoklamaRef = ref(FIREBASE_DB, `GunlukYoklama/${gunlukYoklama?.Id}/DerseGelenOgrenciler`);

          // // Yeni öğrenci eklemek için bir referans oluştur ve öğrenci ID'sini set et
          // push(yoklamaRef, ogrenci?.Id)
          //   .then(() => {
          //     Toast.show({
          //       type: 'success',
          //       position: 'top',
          //       text1: 'Derse başarıyla giriş yaptınız',
          //       visibilityTime: 2500,
          //     });
          //   })
          //   .catch((error) => {
          //     console.error('Öğrenci eklenirken bir hata oluştu:', error);
          //   });
          const yoklamaRef = ref(FIREBASE_DB, `GunlukYoklama/${gunlukYoklama?.Id}/Yoklama/${ogrenci?.Id}`);
          set(yoklamaRef, true)
          .then(() =>{
            setDerseGirdimi(true);
          })
          .catch((error) => {
            console.error('Öğrenci eklenirken bir hata oluştu:', error);
          });
          
        } else {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Derse giriş işlemi başarısız lütfen tekrar deneyin.',
            visibilityTime: 2500,
          });
        }
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Yüz karşılaştırma sırasında bir hata oluştu lütfen tekrar deneyin.',
          visibilityTime: 2500,
        });
        console.error('Yüz karşılaştırma sırasında bir hata oluştu:', error);
      })
      .finally(() => {
        setIsLoading(false); 
      });

    }

  }


  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
        <Image style= {styles.logo} source={require('../../../assets/koulogo.png')}/>
      </View>


      {derseGirdimi ? (
        <Text style={{fontSize:14, marginHorizontal:10, marginVertical:30}}>Derse başarıyla giriş yaptınız, uygulamayı kapatabilirsiniz.</Text>
      ) : (
        <>
          {dersVarmi ? (
            <>
              {dersBittiMi ? (
                <Text style={styles.hataTxt}>Bu ders sonlanmıştır.</Text>
              ) : (
                <View style={{ paddingTop: 20, alignItems: 'center' }}>
                <TextInput
                  style={styles.input}
                  placeholder="Giriş Kodu"
                  onChangeText={text => setKod(text)}
                />
                <TouchableOpacity style={styles.button} onPress={() => DerseGir()}>
                  <Text style={{ color: 'white' }}>Derse Gir</Text>
                </TouchableOpacity>
              </View>
              )}
            </>
          ) : (
            <Text style={styles.hataTxt}>Bugün dersiniz yoktur.</Text>
          )}
        </>
      )}

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

export default OgrenciDerseGirisEkrani;


