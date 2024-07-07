import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../../../App';
import styles from './AdminProfilEkraniStyle';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { onValue, ref, set } from 'firebase/database';
import { sendEmailVerification, updateEmail, updatePassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';



const AdminProfilEkrani = () => {

  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      var uid = user.uid;
      const adminRef = ref(FIREBASE_DB, 'Adminler/' + uid);
      onValue(adminRef, (snapshot) => {
        const adminData = snapshot.val();
        if (adminData) {
          setAd(adminData.Ad);
          setSoyad(adminData.Soyad);
          setEposta(adminData.Eposta);
        } else {
          console.log("Admin bilgisi bulunamadı");
        }
      });

    } else {
    // No user is signed in.
    }

  }, []);

  const kaydet = () => {

    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      var uid = user.uid;

      if(!user.emailVerified){
        Toast.show({
          type: 'info',
          position: 'top',
          text1: 'E-posta adresinizi doğrulamadınız.',
          text2: 'E-postanızı doğrulama için kontrol ediniz',
          visibilityTime: 5000,
        });
        sendEmailVerification(user);
        return;
      }
      else{
        if(eposta !== ''){
          updateEmail(user, eposta).then(() =>{

            const adminRef = ref(FIREBASE_DB, 'Adminler/' + uid);
            try {
              set(adminRef, {
                Ad: ad,
                Soyad: soyad,
                Eposta: eposta,
              });
              
              Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Profiliniz başarıyla güncellenmiştir',
                visibilityTime: 2500,
              });
            } catch (error) {
              console.log('Veritabanı güncelleme hatası:', error);
            }

            }).catch((error) =>{
              console.log(error);
              return;
            });
        }

        else{
          //eposta boş ise hata ver
          Toast.show({
            type:'error',
            position:'top',
            text1:'E-posta alanını lütfen doldurunuz',
            visibilityTime:2500,
          });
        }

        if (sifre !== '') {
          updatePassword(user, sifre);
        }

      }

    } else {
      console.log("Kullanıcı bulunamadı");
    }

  };

  return (
    <View style={styles.container}>

      <View style={styles.inputContainer}>
        <Text style={styles.input1}>{ad}</Text>
        <Text style={styles.input1}>{soyad}</Text>
        <TextInput
          placeholder="E-posta"
          value={eposta}
          onChangeText={text => setEposta(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="***************"
          value={sifre}
          onChangeText={text => setSifre(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={kaydet}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      <Toast/>

    </View>
  );

};

export default AdminProfilEkrani;


