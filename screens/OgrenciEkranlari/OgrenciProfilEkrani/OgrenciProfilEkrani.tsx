import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { onValue, ref, set } from 'firebase/database';
import { sendEmailVerification, updateEmail, updatePassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import styles from './OgrenciProfilEkraniStyle';
import { Image } from "react-native";
import { getImage } from '../../../services/ImageService';



const OgrenciProfilEkrani = () => {

  const [numara, setNumara] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [imageUri, setImageUri] = useState<string>();

  useEffect(() => {
    
    const user = FIREBASE_AUTH.currentUser;
    const userId = user?.uid;
    
    if(userId){
      fetchOgrenciResmi(userId);
    }


    if (user) {
      var uid = user.uid;
      const ogrenciRef = ref(FIREBASE_DB, 'Ogrenciler/' + uid);
      onValue(ogrenciRef, (snapshot) => {
        const ogrenciData = snapshot.val();
        if (ogrenciData) {
          setNumara(ogrenciData.OgrenciNumarasi);
          setAd(ogrenciData.Ad);
          setSoyad(ogrenciData.Soyad);
          setEposta(ogrenciData.Eposta);
        } else {
          console.log("Öğrenci bilgisi bulunamadı");
        }
      });

    } else {
    // No user is signed in.
    }

  }, []);

  const fetchOgrenciResmi = async (userId: string) => {
    try {
      const url = await getImage(userId);
      if (url) {
        setImageUri(url);
      }
    } catch (error) {
      console.error("Öğrenci resmi alınamadı:", error);
    }
  };

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

            const ogrenciRef = ref(FIREBASE_DB, 'Ogrenciler/' + uid);
            try {
              set(ogrenciRef, {
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

      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <ActivityIndicator size="large" color="black"/>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.input1}>{numara}</Text>
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

export default OgrenciProfilEkrani;


