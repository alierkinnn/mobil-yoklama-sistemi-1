import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View,TextInput,TouchableOpacity,Text,Image,KeyboardAvoidingView, Modal } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";
import styles from "./AdminOgrenciEkleEkraniStyle";
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from "../../../firebaseConfig";
import { ref, set } from "firebase/database";
import { AdminRootStackParamsList } from "../../../navigators/Admin/AdminStackNavigator";
import { Ionicons } from '@expo/vector-icons'; 
import * as FaceDetector from 'expo-face-detector';
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadString, getDownloadURL, uploadBytesResumable, uploadBytes } from 'firebase/storage';

interface AdminOgrenciEkleEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminOgrenciEkle'>
}

const AdminOgrenciEkleEkrani = ({navigation}:AdminOgrenciEkleEkraniProps) => {

  const [modalVisible, setModalVisible] = useState(false);

  const [numara, setNumara] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifre2, setSifre2] = useState('');

  const closeModal = () => {
    setModalVisible(false);
  };

  const detectFaces = async (imageUri: string) => {

    const faces = await FaceDetector.detectFacesAsync(imageUri);

    if (faces.faces.length == 1) {
      // Resimde en az bir yüz bulundu
      console.log('Resimde yüz tespit edildi.');
      // Yüz tespiti yapılan resmi işlemek için başka bir fonksiyon çağrılabilir
      closeModal();
      kayitOlFirebase(imageUri);
    }
    else if (faces.faces.length > 1) {
      closeModal();
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Tekrar deneyiniz',
        text2: 'Resimde birden fazla yüz tespit edildi',
        visibilityTime: 4000,
      });
      console.log("Resimde birden fazla yüz tespit edildi");
    }
    else {
      closeModal();
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Tekrar deneyiniz',
        text2: 'Resimde yüz bulunamadı.',
        visibilityTime: 4000,
      });
      console.log('Resimde yüz bulunamadı.');
    }
  };
  
  const imageFromGallery = async () => {
    try {
      await ImagePicker.getMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled) {
        detectFaces(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const saveImage = async (userUid: string, imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const ref = storageRef(FIREBASE_STORAGE, "images/" + userUid + ".jpg");
      await uploadBytes(ref, blob);
      
      console.log("Başarılı: Resim yüklendi");
    } catch (error) {
      console.error("Hata: ", error);
    }
  };
  

  const kayitOlFirebase = (imageUri:string) => {

    createUserWithEmailAndPassword(FIREBASE_AUTH, eposta, sifre)
       .then((userCredential) => {
          updateProfile(userCredential.user, {
            displayName: 'ogrenci',
          })
          .then(() => {
            const user = userCredential.user;
            saveImage(user.uid, imageUri); 
            set(ref(FIREBASE_DB, 'Ogrenciler/' + user.uid), {
                Id: user.uid,
                OgrenciNumarasi: numara,
                Ad: ad,
                Soyad: soyad,
                Eposta: eposta,
                Sifre: sifre,
                Devamsizlik: "0",
              }).then(() =>{

                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Öğrenci ekleme işleminiz başarılı',
                    visibilityTime: 3000,
                  });
                  setNumara('');
                  setAd('');
                  setSoyad('');
                  setEposta('');
                  setSifre('');
                  setSifre2('');
                  
              }).catch((error) => {
                console.log("Database hatası: "+error.errorMessage);
              });


          })
          .catch((profileError) => {
            console.error('Profil güncelleme hatası:', profileError);
          });
      })
         
      .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log(errorMessage);
         // ..
      });

  }

  const ogrenciEkle = () => {
    if (!sifre || !eposta || !numara || !sifre2 ) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lütfen tüm alanları doldurunuz',
        visibilityTime:3000,
      });
      console.log("hata");
      return;
    }
    else if (sifre !== sifre2) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Hata !',
        text2: 'Şifreler eşleşmiyor.',
      });
      console.log("hata");
      return;
    }
    setModalVisible(true);

  };
 
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior= "height"
    >
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Öğrenci Ekle</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminOgrenciListele')}>
              <Text style={styles.headerTopBarText1}>Öğrencileri listele </Text>
            </TouchableOpacity>
        </View>

        <View style={styles.container1}>
            <View style={styles.inputContainer}>
                <TextInput
                placeholder="Numara"
                value={numara}
                onChangeText={text => setNumara(text)}
                style={styles.input}
                />
                <TextInput
                placeholder="Ad"
                value={ad}
                onChangeText={text => setAd(text)}
                style={styles.input}
                />
                <TextInput
                placeholder="Soyad"
                value={soyad}
                onChangeText={text => setSoyad(text)}
                style={styles.input}
                />
                <TextInput
                placeholder="E-posta"
                value={eposta}
                onChangeText={text => setEposta(text)}
                style={styles.input}
                />
                <TextInput
                placeholder="Şifre"
                value={sifre}
                onChangeText={text => setSifre(text)}
                style={styles.input}
                secureTextEntry
                />
                <TextInput
                placeholder="Şifreyi tekrardan giriniz"
                value={sifre2}
                onChangeText={text => setSifre2(text)}
                style={styles.input}
                secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={ogrenciEkle}
                style={[styles.button, styles.buttonOutline]}
                >
                  <Text style={styles.buttonOutlineText}>Ekle</Text>
                  <Ionicons name="add-outline" size={24} color="#1E9D4C" style={{ marginHorizontal:5 }} />
                </TouchableOpacity>
            </View>
        </View>

        <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 20 }}>Resim Seç</Text>
            <TouchableOpacity onPress={imageFromGallery} style={{ padding: 10 }}>
              <Text>Galeriden Seç</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={{ marginTop: 20 }}>
              <Text style={{ color: 'red' }}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Toast></Toast>
    </KeyboardAvoidingView>
  );
}

export default AdminOgrenciEkleEkrani

