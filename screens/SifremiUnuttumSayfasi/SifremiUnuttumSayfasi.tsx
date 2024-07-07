import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View,TextInput,TouchableOpacity,Text,Image,KeyboardAvoidingView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from "../../App";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import styles from "./SifremiUnuttumSayfasiStyle";
import { sendPasswordResetEmail } from "firebase/auth";
import Toast from "react-native-toast-message";

interface SifremiUnuttumSayfasiProps{
  navigation : StackNavigationProp<RootStackParamsList,'SifremiUnuttum'>
}

const SifremiUnuttumSayfasi = ({navigation}:SifremiUnuttumSayfasiProps) => {

  const [eposta, setEposta] = useState('');

  const gonder = () => {
    sendPasswordResetEmail(FIREBASE_AUTH, eposta)
    .then(() => {
      Toast.show({
        type: 'success',
        text1: 'Şifre sıfırlama e-postası gönderildi.',
        text2: 'E-postanızı kontrol ediniz',
        position: 'top',
      });
      console.log("Şifre sıfırlama epostası gönderildi.");
    })
    .catch((error) => {
      const errorMessage = error.message;
      if(errorMessage === 'Firebase: Error (auth/missing-email).'){
        Toast.show({
          type: 'error',
          text1: 'Lütfen e-postanızı giriniz',
          position: 'top',
        });
      }
      else{
        console.log(errorMessage)
        Toast.show({
          type: 'error',
          text1:'Böyle bir kullanıcı bulunamadı',
          text2: 'Lütfen geçerli bir e-posta giriniz',
          position: 'top',
        });
      }
    });
  }
  
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior= "height"
    >
      <View style={styles.logoContainer}>
      <Image style= {styles.logo} source={require('../../assets/koulogo.png')}/>
      </View>

      
      <Text style={{color:'#4d594c', fontSize:14, textAlign:'center', marginHorizontal:15, marginVertical:10}}>E-postanızı girip göndere bastıktan sonra e-postanıza gelen link ile şifrenizi sıfırlayabilirsiniz.</Text>

      <View style={styles.inputContainer}>

        <TextInput
          placeholder="E-posta"
          value={eposta}
          onChangeText={text => setEposta(text)}
          style={styles.input}
        />

      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={gonder}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Gönder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('GirisYap')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Giriş yap sayfasına geri dön</Text>
        </TouchableOpacity>
      </View>

      <Toast/>
    </KeyboardAvoidingView>
  );
}

export default SifremiUnuttumSayfasi

