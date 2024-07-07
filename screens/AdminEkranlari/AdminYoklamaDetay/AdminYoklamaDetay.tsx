import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons'; 
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';
import { Ogretmen } from '../../../types/Ogretmen';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import { Ders } from '../../../types/Ders';
import { OgrenciOgretmenDers } from '../../../types/OgrenciOgretmenDers';
import styles from './AdminYoklamaDetayStyle';
import { Yoklama } from '../../../types/Yoklama';
import { DersGetir, OgrenciGetir, OgretmenGetir } from '../../../services/GetTypeService';
import { YoklamaBul, YoklamaIdBul1 } from '../../../services/YoklamaService';

interface AdminYoklamaDetayEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminYoklamaDetay'>,
  route : any;
}


const AdminYoklamaDetayEkrani = ({navigation, route}:AdminYoklamaDetayEkraniProps) => {

    const {ogretmenId, dersId} = route.params

    const [ogretmen, setOgretmen] = useState<Ogretmen>();
    const [ders, setDers] = useState<Ders>();  
    const [ogrenciIdList, setOgrenciIdList] = useState<string[]>([]);
    const [yoklama, setYoklama] = useState<Yoklama>(); 

  useEffect(() => {

    setDers(DersGetir(dersId));
    setOgretmen(OgretmenGetir(ogretmenId));
    fetchYoklama();

    const yoklamaRef = ref(FIREBASE_DB, 'Yoklama');

    const yoklamaQuery = query(
      yoklamaRef,
      orderByChild('OgretmenId'),
      equalTo(ogretmenId)
    );

    get(yoklamaQuery).then((snapshot) => {
        if (snapshot.exists()) {
          const ogrenciIdList: string[] = [];
          snapshot.forEach((childSnapshot) => {
            const yoklama: Yoklama = childSnapshot.val();

            if (yoklama.DersId === dersId) {
              yoklama.DersiAlanOgrenciler.forEach(ogrenciId => {
                ogrenciIdList.push(ogrenciId);
              });
            }
          });
          setOgrenciIdList(ogrenciIdList);
        } else {
          console.log("Belirtilen öğretmene ait yoklama verisi bulunamadı.");
        }
      }).catch((error) => {
        console.error("Yoklama verileri alınırken bir hata oluştu:", error);
      });

    

  },[]);

  const fetchYoklama = async () => {

    try {
      const id = await YoklamaIdBul1(dersId, ogretmenId);
      if (id) {
        const yoklama = await YoklamaBul(id);
        setYoklama(yoklama !== null ? yoklama : undefined);
      }
    } catch (error) {
      console.error("Yoklama verileri alınırken bir hata oluştu:", error);
    }
    
  };

  const DevamsizlikSayisiHesapla = (ogrenciId:string):number => {
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


  const renderItem = ({ item }: { item: string }) => {
    const ogrenci = OgrenciGetir(item);
    const devamsizlikSayisi = DevamsizlikSayisiHesapla(item);
    return(
      <View style={styles.row}>
        <Text style={styles.cell}>{ogrenci.OgrenciNumarasi}</Text>
        <Text style={styles.cell}>{ogrenci.Ad} {ogrenci.Soyad}</Text>
        <Text style={styles.cell}>{devamsizlikSayisi}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior= "height"
    >
         <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>{ders?.DersAdi}</Text>
            <Text style={styles.headerTopBarText1}>{ogretmen?.Ad} {ogretmen?.Soyad} </Text>
        </View>

        {ogrenciIdList.length === 0 ? (
          <View>
            <Text style={{textAlign:'center', fontSize:18, marginVertical:10}}>Bu dersi alan öğrenci bulunmuyor.</Text>
          </View>
        ):(
          <View>
            <View style={styles.basliklar}>
              <Text style={styles.baslik}>Öğrenci numarası</Text>
              <Text style={styles.baslik}>İsim</Text>
              <Text style={styles.baslik}>Devamsızlık</Text>
            </View>
            <FlatList
            data={yoklama?.DersiAlanOgrenciler}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            />
        </View>   
      )}
        


      <Toast></Toast>
    </KeyboardAvoidingView>
  );

};

export default AdminYoklamaDetayEkrani;





