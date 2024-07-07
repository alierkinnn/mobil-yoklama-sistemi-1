import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import styles from "./KayitOlEkraniStyle";
import { View,TextInput,TouchableOpacity,Text,Image,KeyboardAvoidingView, Modal, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from "../../App";
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";
import { ref, set } from "firebase/database";
import * as ImagePicker from 'expo-image-picker';
import { ref as storageRef, uploadString, getDownloadURL, uploadBytesResumable, uploadBytes } from 'firebase/storage';
import storage from '@react-native-firebase/storage';
import * as FaceDetector from 'expo-face-detector';


interface KayitOlEkraniProps{
  navigation : StackNavigationProp<RootStackParamsList,'KayitOl'>
}

const KayitOlEkrani = ({navigation}:KayitOlEkraniProps) => {

  const [modalVisible, setModalVisible] = useState(false);
  //const [selectedImage, setSelectedImage] = useState<string>();

  const [numara, setNumara] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifre2, setSifre2] = useState('');
  const [rol, setRol] = useState('');



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
  
const imageFromCamera = async () => {
  try {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
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
  

  const closeModal = () => {
    setModalVisible(false);
  };

  const kayitOlFirebase = (imageUri: string) => {
    createUserWithEmailAndPassword(FIREBASE_AUTH, eposta, sifre)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: rol,
        })
        .then(() => {
          // Profil başarıyla güncellendi
          const user = userCredential.user;
          if (user.displayName === 'ogrenci') {
            saveImage(user.uid, imageUri); 
            set(ref(FIREBASE_DB, 'Ogrenciler/' + user.uid), {
              Id: user.uid,
              OgrenciNumarasi: numara,
              Ad: ad,
              Soyad: soyad,
              Eposta: eposta,
              Sifre: sifre,
              Devamsizlik: "0",
            }).then(() => {
              Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Öğrenci kayıt işleminiz başarılı',
                visibilityTime: 3000,
              });
              setNumara('');
              setAd('');
              setSoyad('');
              setEposta('');
              setSifre('');
              setSifre2('');
              setTimeout(() => {
                navigation.navigate('GirisYap');
              }, 3200);
            }).catch((error1) => {
              console.log("Database hatası: " + error1.errorMessage);
            });
          } else if (user.displayName === 'ogretmen') {
            set(ref(FIREBASE_DB, 'Ogretmenler/' + user.uid), {
              Id: user.uid,
              OgretmenNumarasi: numara,
              Ad: ad,
              Soyad: soyad,
              Eposta: eposta,
              Sifre: sifre,
            }).then(() => {
              sendEmailVerification(user);
              Toast.show({
                type: 'success',
                position: 'top',
                text1: 'Öğretmen kayıt işleminiz başarılı',
                text2: 'Lütfen e-posta adresinize gönderilen linkten hesabınızı doğrulayın',
                visibilityTime: 3000,
              });
              setNumara('');
              setAd('');
              setSoyad('');
              setEposta('');
              setSifre('');
              setSifre2('');
              setTimeout(() => {
                navigation.navigate('GirisYap');
              }, 3300);
            }).catch((error1) => {
              console.log("Database hatası: " + error1.errorMessage);
            });
          }
        })
        .catch((profileError) => {
          console.error('Profil güncelleme hatası:', profileError);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      if(errorMessage === "Password should be at least 6 characters (auth/weak-password)."){
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Şifre en az 6 karakter olmalı',
          visibilityTime:3000,
        });
      }
      
      // ..
    });
  }
  


  const kayitOl = () => {
    if (!sifre || !eposta || !numara || !sifre2 || !rol) {
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

    if(rol === 'ogrenci'){
      setModalVisible(true);
    }
    else {
      kayitOlFirebase("");
    }
  
    
  };
 
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior= "height"
    >
      <View style={styles.logoContainer}>
      <Image style= {styles.logo} source={require('../../assets/koulogo.png')}/>
      </View>

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

      <View style={styles.rolContainer}>
        {/* Rol seçimi için bir mekanizma ekleyin, düğmeleri, radyo düğmelerini vb. kullanabilirsiniz */}
        <TouchableOpacity
          onPress={() => setRol('ogrenci')}
          style={[styles.rolButton, rol === 'ogrenci' && styles.seciliRol]}
        >
          <Text style={styles.rolButtonText}>Öğrenci</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRol('ogretmen')}
          style={[styles.rolButton, rol === 'ogretmen' && styles.seciliRol]}
        >
          <Text style={styles.rolButtonText}>Öğretmen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={kayitOl}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Kayıt Ol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('GirisYap')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Giriş yap sayfasına geri dön</Text>
        </TouchableOpacity>
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
            <TouchableOpacity onPress={imageFromCamera} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text>Kameradan Çek</Text>
            </TouchableOpacity>
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

export default KayitOlEkrani

