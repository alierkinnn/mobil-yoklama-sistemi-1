import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import styles from './OgretmenProfilEkraniStyle';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { get, onValue, ref, set } from 'firebase/database';
import Toast from 'react-native-toast-message';
import { sendEmailVerification, updateEmail, updatePassword } from 'firebase/auth';
import { Ogretmen } from '../../../types/Ogretmen';
import { DersGetir, OgrenciGetir, OgretmenGetir } from '../../../services/GetTypeService';
import { Ionicons } from '@expo/vector-icons'; 
import { YoklamaBul, YoklamaIdBul1 } from '../../../services/YoklamaService';
import { Yoklama } from '../../../types/Yoklama';


const OgretmenProfilEkrani = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDersAdi, setSelectedDersAdi] = useState('');

  const [ogretmen, setOgretmen] = useState<Ogretmen>();

  const [numara, setNumara] = useState('');
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [eposta, setEposta] = useState('');
  const [sifre, setSifre] = useState('');

  const [ogrenciListesi, setOgrenciListesi] = useState<string[]|null>([]);

  const openModal = (dersId: string) => {
    const ders = DersGetir(dersId);
    setSelectedDersAdi(ders.DersAdi);
    OgrencileriGetir(dersId);

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };


  const OgrencileriGetir = (dersId: string): void =>{
    const ogretmenId = ogretmen?.Id;

    if (!ogretmenId) {
      console.error("Öğretmen bilgisi bulunamadı.");
      return;
    }
  
    const yoklamaRef = ref(FIREBASE_DB, 'Yoklama');
    
    get(yoklamaRef).then((snapshot) => {
      const ogrenciler: any[] = [];
  
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const yoklama: Yoklama = childSnapshot.val();
          if (yoklama.OgretmenId === ogretmenId && yoklama.DersId === dersId) {
            ogrenciler.push(...yoklama.DersiAlanOgrenciler);
          }
        });
        setOgrenciListesi(ogrenciler);
      } else {
        console.log("Veri bulunamadı.");
      }
    }).catch((error: any) => {
      console.error('Veri çekme hatası:', error);
    });

  }

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;

    if (user) {
      var uid = user.uid;
      setOgretmen(OgretmenGetir(uid));

      const ogretmenRef = ref(FIREBASE_DB, 'Ogretmenler/' + uid);
      onValue(ogretmenRef, (snapshot) => {
        const ogretmenData = snapshot.val();
        if (ogretmenData) {
          setNumara(ogretmenData.OgretmenNumarasi);
          setAd(ogretmenData.Ad);
          setSoyad(ogretmenData.Soyad);
          setEposta(ogretmenData.Eposta);
        } else {
          console.log("Öğrenci bilgisi bulunamadı");
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
          // Firebase Realtime Database'i güncelleme
          const ogrenciRef = ref(FIREBASE_DB, 'Ogrenciler/' + uid);
          try {
            set(ogrenciRef, {
              Ad: ad,
              Soyad: soyad,
              Eposta: eposta,
            });

            // Realtime Database güncelleme başarılı olduysa
            // Firebase Authentication'da e-posta güncelleme işlemini gerçekleştir
            updateEmail(user, eposta)
              .then(() => {
                // Firebase Authentication güncelleme başarılı olduysa
                Toast.show({
                  type: 'success',
                  position: 'top',
                  text1: 'Profiliniz başarıyla güncellenmiştir',
                  visibilityTime: 2500,
                });
              })
              .catch((authError) => {
                // Firebase Authentication güncelleme hatası
                console.log('Authentication güncelleme hatası:', authError);
              });
          } catch (dbError) {
            // Realtime Database güncelleme hatası
            console.log('Veritabanı güncelleme hatası:', dbError);
          }
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
          const ogrenciRef1 = ref(FIREBASE_DB, 'Ogrenciler/' + uid);
          set(ogrenciRef1, {
            Sifre:sifre,
          });
        }

      }

    } else {
      console.log("Kullanıcı bulunamadı");
    }

  };

  const renderItem = ({ item }: { item: string }) => {
    const ders = DersGetir(item);
    return (
      <View style={styles.dropdownItem}>
        <Text style={styles.dropdownItemText}>{ders.DersAdi}</Text>
        <TouchableOpacity 
        style={{alignItems:'center'}}
        onPress={() => openModal(item)}
        >
          <Text>Öğrencileri göster</Text>
          <Ionicons name="people-outline" size={20} color="black" style={{paddingHorizontal:10}} /> 
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem1 = ({ item }: { item: string }) => {
    const ogrenci = OgrenciGetir(item);
    return(
      <View style={styles.row}>
        <Text>{ogrenci.OgrenciNumarasi}</Text>
        <Text>{ogrenci.Ad} {ogrenci.Soyad}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>

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

        <TouchableOpacity style={styles.dropdown} onPress={() => setIsOpen(!isOpen)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <View  style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons style={{color: 'white', paddingHorizontal:10}} name='book-outline' size={20} />
              <Text style={styles.dropdownText}>Verdiği Dersler</Text>
            </View>
            <Ionicons style={{color: 'white'}} name={isOpen ? 'chevron-down-outline' : 'chevron-forward-outline'} size={20} />
          </View>
        </TouchableOpacity>

        {isOpen && (
          <FlatList
            data={ogretmen?.VerdigiDersler}
            keyExtractor={(item) => item}
            renderItem={renderItem}
          />
        )}

      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={kaydet}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Kaydet</Text>
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
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.dersAdi}>{selectedDersAdi}</Text>
            <FlatList
            data={ogrenciListesi}
            keyExtractor={(item) => item}
            renderItem={renderItem1}
            />
          </View>
        </View>
      </Modal>


      <Toast/>
    </View>
  );

};

export default OgretmenProfilEkrani;


