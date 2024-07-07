import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import styles from './OgretmenAnaSayfaStyle';
import { Ionicons } from '@expo/vector-icons'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { get, onValue, orderByChild, query, ref } from 'firebase/database';
import { OgretmenRootStackParamsList } from '../../../navigators/Ogretmen/OgretmenStackNavigator';
import { DersGetir } from '../../../services/GetTypeService';
import { YoklamaIdBul1 } from '../../../services/YoklamaService';


interface OgretmenaSayfaProps{
  navigation : StackNavigationProp<OgretmenRootStackParamsList,'OgretmenAnaSayfa'>
}


const OgretmenAnaSayfa = ({navigation}:OgretmenaSayfaProps) => {

  const [dersIdListesi, setDersIdListesi] = useState<string[]>([]);
  const [yoklamaId, setYoklamaId] = useState<string>();

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      const ogretmenUID = user.uid;
      const derslerRef = ref(FIREBASE_DB, `Ogretmenler/${ogretmenUID}/VerdigiDersler`);

      onValue(derslerRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setDersIdListesi(data);
        } else {
          console.log("Verilen dersler bulunamadı.");
        }
      }, (error) => {
        console.error("Verilen dersler alınırken bir hata oluştu:", error);
      });

      
    }

    
  }, []);

  const OgretmenDerseGiris = (dersId: string) =>{
    if(FIREBASE_AUTH.currentUser){
      fetchYoklamaId(FIREBASE_AUTH.currentUser.uid, dersId);
    }
    

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
                     console.log("Bugün için yoklama kaydı bulundu:", gunlukYoklama);
                     if(gunlukYoklama.Kod !== '' && !gunlukYoklama.BittiMi){
                      console.log("OgretmenDers sayfasi aciliyor");
                      navigation.navigate("OgretmenDers",{yoklamaId:yoklamaId, gunlukYoklamaId:childSnapshot.key});
                     }
                     else{
                      navigation.navigate("OgretmenDerseGiris",{dersId:dersId});
                     }                 
                 }
                 else{
                  navigation.navigate("OgretmenDerseGiris",{dersId:dersId});
                 }
             });
         } else {
             console.log("Bugün için yoklama kaydı bulunamadı.");
         }
     }).catch((error) => {
         console.error("Yoklama kaydı kontrol edilirken bir hata oluştu:", error);
     });

    

  };

  const fetchYoklamaId = async (ogretmenId: string, dersId: string) => {
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


  const renderItem = ({ item }: { item: string }) => {
    const ders = DersGetir(item);
    return(
      <View style={styles.card}>
        <View style={styles.row}>
          <View>
            <Text style={styles.cardItem}>Ders:</Text>
            <Text style={styles.cardItem1}>{ders.DersAdi}</Text>
          </View>
          <View style={{display:'flex', flexDirection:'row'}}>
            <TouchableOpacity style={{marginHorizontal:5}} onPress={() => OgretmenDerseGiris(ders.DersId)}>
              <Ionicons name="log-in-outline" size={30} style={styles.ikon} />
            </TouchableOpacity>
            <TouchableOpacity style={{marginHorizontal:5}} onPress={() => navigation.navigate("OgretmenYoklamaTakip",{dersId:ders.DersId})}>
              <Ionicons name="eye-outline" size={30} style={styles.ikon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
       <FlatList
        data={dersIdListesi}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        />
    </View>
  );

};

export default OgretmenAnaSayfa;



