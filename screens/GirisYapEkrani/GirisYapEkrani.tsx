import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import styles from "./GirisYapEkraniStyle";
import SignupScreen from '../KayitOlEkrani/KayitOlEkrani';
import { KeyboardAvoidingView } from "react-native";
import { View,TextInput,TouchableOpacity,Text } from "react-native";
import { Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from "../../App";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";

interface GirisYapEkraniProps{
  navigation : StackNavigationProp<RootStackParamsList,'GirisYap'>
}

const GirisYapEkrani = ({navigation}:GirisYapEkraniProps) => {

  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');


  const girisYap = () => {
    if (!sifre || !eposta) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Lütfen tüm alanları doldurunuz',
        visibilityTime:2500,
      });
      console.log("hata");
      return;
    }
    signInWithEmailAndPassword(FIREBASE_AUTH, eposta, sifre)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      const displayName = user.displayName;

      if (displayName === 'ogrenci') {
        navigation.navigate('OgrenciDrawer');
      } else if (displayName === 'ogretmen') {
        navigation.navigate('OgretmenDrawer');

      } else {
        // Diğer durumlar için yapılacak işlemler
        navigation.navigate('AdminDrawer');
      }
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      if(errorMessage === 'Firebase: Error (auth/invalid-credential).' || 'Firebase: Error (auth/wrong-password).'){
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Girdiğiniz e-posta veya şifre yanlış',
          visibilityTime:2500,
        });
      }


    });
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
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={girisYap}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('KayitOl')}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={{marginTop:20}}
        onPress={() => navigation.navigate('SifremiUnuttum')}>
        <Text style={{color:'#4d594c'}}>Şifremi unuttum</Text>
      </TouchableOpacity>

      <Toast></Toast>
    </KeyboardAvoidingView>
  );
}

export default GirisYapEkrani

