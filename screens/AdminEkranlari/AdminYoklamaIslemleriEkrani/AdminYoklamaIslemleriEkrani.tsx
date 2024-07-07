import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import styles from './AdminYoklamaIslemleriEkraniStyle';
import Toast from 'react-native-toast-message';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; 
import { Ders } from '../../../types/Ders';
import { Ogretmen } from '../../../types/Ogretmen';
import { DersGetir } from '../../../services/GetTypeService';


interface AdminYoklamaIslemleriEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminYoklamaIslemleri'>
}

const AdminYoklamaIslemleriEkrani = ({navigation}:AdminYoklamaIslemleriEkraniProps) => {


  const [ogretmenListesi, setOgretmenListesi] = useState<Ogretmen[]>([]);
  
  const [seciliDersler, setSeciliDersler] = useState<{ [key: string]: string }>({});

  useEffect(() =>{

    const ogretmenlerRef = ref(FIREBASE_DB, 'Ogretmenler');
    onValue(ogretmenlerRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          ogretmenListesi.push({
            Id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setOgretmenListesi(ogretmenListesi);
      });

  }, []);



  const YoklamaDetaySayfasinaGit = (dersId: string, ogretmenId:string) =>{

    if(dersId !== '0'){
      navigation.navigate("AdminYoklamaDetay", {ogretmenId:ogretmenId, dersId:dersId});
    }
    else{
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lütfen ders seçiniz',
        visibilityTime:2500,
      });
    }

  };

  const GunlukYoklamaUretmeSayfasinaGit = (dersId: string, ogretmenId:string) =>{

    if(dersId !== '0'){
      navigation.navigate("AdminGunlukYoklamaUretme", {ogretmenId:ogretmenId, dersId:dersId});
    }
    else{
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lütfen ders seçiniz',
        visibilityTime:2500,
      });
    }

  };

  const renderItem = ({ item }: { item: Ogretmen }) => (
  <View style={styles.row}>
      <Text style={styles.cell}>{item.Ad} {item.Soyad}</Text>
     
      {item.VerdigiDersler ? (
         <View style={styles.cell}>
          <Picker 
          selectedValue={seciliDersler[item.Id] || ''}
          onValueChange={(value) => {
            setSeciliDersler(prevState => ({
              ...prevState,
              [item.Id]: value
            }));
          }}
          style={styles.picker}>
            <Picker.Item style={styles.pickerItem} label='Ders seçiniz' value='0' />
            {item.VerdigiDersler.map((dersId) => {
              const ders = DersGetir(dersId);
              return (
                <Picker.Item
                  style={styles.pickerItem}
                  label={ders.DersAdi}
                  value={ders.DersId}
                />
              );
            })} 
          </Picker>
        </View>
      ) : (
        <Text style={styles.cell}>Ders bulunamadı</Text>
      )}
      

      <View style={[styles.cell]}>
        <TouchableOpacity
          onPress={() => {
            const selectedDersId = seciliDersler[item.Id] || '0';
            YoklamaDetaySayfasinaGit(selectedDersId, item.Id);
          }}
        >
              <Ionicons name="eye-outline" size={24} color="blue" style={{textAlign:'right'}} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const selectedDersId = seciliDersler[item.Id] || '0';
            GunlukYoklamaUretmeSayfasinaGit(selectedDersId, item.Id);
          }}
        >
              <Ionicons name="create-outline" size={24} color="blue" style={{textAlign:'right'}} />
        </TouchableOpacity>
      </View>

    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Yoklama İşlemleri</Text>
        </View>
        <View style={styles.basliklar}>
            <Text style={styles.baslik}>İsim</Text>
            <Text style={styles.baslik}>Dersler</Text>
            <Text style={styles.baslik}>İşlemler</Text>
        </View>
        <View>
          <FlatList
          data={ogretmenListesi}
          keyExtractor={(item) => item.Id}
          renderItem={renderItem}
          />
        </View>

        <Toast/>
    </View>
  );

};

export default AdminYoklamaIslemleriEkrani;


