import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View,TextInput,TouchableOpacity,Text,Image,KeyboardAvoidingView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Toast from "react-native-toast-message";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import { ref, set } from "firebase/database";
import styles from "./AdminOgretmenEkleEkraniStyle";
import { AdminRootStackParamsList } from "../../../navigators/Admin/AdminStackNavigator";
import { Ionicons } from '@expo/vector-icons'; 

interface AdminOgretmenEkleEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminOgretmenEkle'>
}

const AdminOgretmenEkleEkrani = ({navigation}:AdminOgretmenEkleEkraniProps) => {

  const [numara, setNumara] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifre2, setSifre2] = useState('');
  


  const ogretmenEkle = () => {
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
    createUserWithEmailAndPassword(FIREBASE_AUTH, eposta, sifre)
       .then((userCredential) => {
          updateProfile(userCredential.user, {
            displayName: 'ogretmen',
          })
          .then(() => {
            const user = userCredential.user;
            set(ref(FIREBASE_DB, 'Ogretmenler/' + user.uid), {
                Id: user.uid,
                OgretmenNumarasi: numara,
                Ad: ad,
                Soyad: soyad,
                Eposta: eposta,
                Sifre: sifre,
              }).then(() =>{

                Toast.show({
                    type: 'success',
                    position: 'top',
                    text1: 'Öğretmen ekleme işleminiz başarılı',
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

  };
 
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior= "height"
    >
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Öğretmen Ekle</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminOgretmenListele')}>
              <Text style={styles.headerTopBarText1}>Öğretmenleri listele </Text>
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
                onPress={ogretmenEkle}
                style={[styles.button, styles.buttonOutline]}
                >
                  <Text style={styles.buttonOutlineText}>Ekle</Text>
                  <Ionicons name="add-outline" size={24} color="#1E9D4C" style={{ marginHorizontal:5 }} />
                </TouchableOpacity>
            </View>
        </View>



      <Toast></Toast>
    </KeyboardAvoidingView>
  );
}

export default AdminOgretmenEkleEkrani

