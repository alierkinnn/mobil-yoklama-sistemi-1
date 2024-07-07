import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import styles from './AdminDersEkleEkraniStyle';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';
import { push, ref, set } from 'firebase/database';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';

interface AdminDersEkleEkraniProps{
    navigation : StackNavigationProp<AdminRootStackParamsList,'AdminDersEkle'>
  }

const AdminDersEkleEkrani = ({navigation}:AdminDersEkleEkraniProps) => {

  const [ders, setDers] = useState('');
  const [ogretimTuru, setOgretimTuru] = useState('');

  const dersEkle = () => {
    if (!ders || !ogretimTuru) {
      //bos alan kontrolu yaptik
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lütfen tüm alanları doldurunuz',
        visibilityTime: 2500,
      });
    } else {
      // Yeni bir key (id) oluştur
      const newDersKey = push(ref(FIREBASE_DB, 'Dersler')).key;
  
      // Veritabanına yeni kaydı ekle
      set(ref(FIREBASE_DB, `Dersler/${newDersKey}`), {
        DersAdi: ders,
        OgretimTuru: ogretimTuru,
        DersId: newDersKey,
      }).then(() => {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Ders başarıyla eklendi',
          visibilityTime: 2500,
        });
  
        // Ekledikten sonra gerekli temizleme işlemleri yapabilirsiniz
        setDers('');
        setOgretimTuru('');
        
      }).catch((error) => {
        console.error('Ders ekleme hatası:', error);
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Ders eklenirken bir hata oluştu',
          visibilityTime: 2500,
        });
      });

    }

  };

  return (
    <View style={styles.container}>

       <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Ders ekle</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminDersListele')}>
              <Text style={styles.headerTopBarText1}>Ders listeleme sayfası </Text>
            </TouchableOpacity>
      </View>

      <View style={styles.container1}>
        <View style={styles.logoContainer}>
        <Image style= {styles.logo} source={require('../../../assets/koulogo.png')}/>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.text}>Eklemek istediğiniz dersi giriniz:</Text>
          <TextInput
            placeholder="Ders"
            value={ders}
            onChangeText={text => setDers(text)}
            style={styles.input}
          />
          
          <Text style={styles.text}>Öğretim türünü seçiniz:</Text>
          <View style={styles.ogretimTuruContainer}>
          {/* Rol seçimi için bir mekanizma ekleyin, düğmeleri, radyo düğmelerini vb. kullanabilirsiniz */}
          <TouchableOpacity
            onPress={() => setOgretimTuru('Birinci Öğretim')}
            style={[styles.ogretimTuruButton, ogretimTuru === 'birinciOgretim' && styles.seciliOgretimTuru]}
          >
            <Text>Birinci Öğretim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOgretimTuru('İkinci Öğretim')}
            style={[styles.ogretimTuruButton, ogretimTuru === 'ikinciOgretim' && styles.seciliOgretimTuru]}
          >
            <Text>İkinci Öğretim</Text>
          </TouchableOpacity>
        </View>

          
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={dersEkle}
            style={[styles.button , styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Ekle</Text>
            <Ionicons name="add-outline" size={24} color="#1E9D4C" style={{ marginHorizontal:5 }} />
          </TouchableOpacity>
        </View>
      </View>
      

    <Toast></Toast>
    </View>
  );

};

export default AdminDersEkleEkrani;


