import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, FlatList, Modal } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons'; 
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';
import styles from './AdminOgretmenDetayEkraniStyle';
import { Ogretmen } from '../../../types/Ogretmen';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import { Yoklama } from '../../../types/Yoklama';
import { DersGetir, OgrenciGetir } from '../../../services/GetTypeService';

interface AdminOgretmenDetayEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminOgretmenDetay'>,
  route: any;
}


const AdminOgretmenDetayEkrani = ({navigation, route}:AdminOgretmenDetayEkraniProps) => {

  const {ogretmenId} = route.params;
  const [isOpen, setIsOpen] = useState(false);
  const [ogretmen, setOgretmen] = useState<Ogretmen>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDersAdi, setSelectedDersAdi] = useState('');
  const [ogrenciIdListesi, setOgrenciIdListesi] = useState<string[]>([]);
  
  const handleSelect = () => {
    setIsOpen(false);
  };

  const openModal = (dersId: string) => {
    const ders = DersGetir(dersId);
    setSelectedDersAdi(ders.DersAdi);
    OgrencileriGetir(dersId);

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {

    console.log(ogretmenId);

    const ogretmenRef = ref(FIREBASE_DB, 'Ogretmenler/' + ogretmenId);
    onValue(ogretmenRef, (snapshot) => {
      const ogretmenData = snapshot.val();
      if (ogretmenData) {
        setOgretmen(ogretmenData);
      } else {
        console.log("?");
      }
    });
  },[]);


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
        setOgrenciIdListesi(ogrenciler);
      } else {
        console.log("Veri bulunamadı.");
      }
    }).catch((error: any) => {
      console.error('Veri çekme hatası:', error);
    });

  }

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.dropdownItemText}>{DersGetir(item).DersAdi}</Text>
      <TouchableOpacity 
      style={{alignItems:'center'}}
      onPress={() => openModal(item)}
      >
        <Text>Öğrencileri göster</Text>
        <Ionicons name="people-outline" size={20} color="black" style={{paddingHorizontal:10}} /> 
      </TouchableOpacity>
    </View>
  );

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
    <KeyboardAvoidingView
    style={styles.container}
    behavior= "height"
    >
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>{ogretmen?.Ad}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminOgretmenListele')}>
              <Text style={styles.headerTopBarText1}>Öğretmenleri listeleme sayfası </Text>
            </TouchableOpacity>
        </View>

        <View style={styles.container1}>

            <View style={styles.inputContainer}>
              <View style={styles.input1}>
                <Ionicons name="information-outline" size={20} color="#1E9D4C" style={{paddingHorizontal:10}} /> 
                <Text style={{fontSize:16}}>{ogretmen?.OgretmenNumarasi}</Text>
              </View>
              <View style={styles.input1}>
                <Ionicons name="person-outline" size={20} color="#1E9D4C" style={{paddingHorizontal:10}} /> 
                <Text style={{fontSize:16}}>{ogretmen?.Ad} {ogretmen?.Soyad}</Text>
              </View>
              <View style={styles.input1}>
                <Ionicons name="mail-outline" size={20} color="#1E9D4C" style={{paddingHorizontal:10}} /> 
                <Text style={{fontSize:16}}>{ogretmen?.Eposta}</Text>
              </View>
            </View>

            <View style={styles.dropdownContainer}>
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
            data={ogrenciIdListesi}
            keyExtractor={(item) => item}
            renderItem={renderItem1}
            />
          </View>
        </View>
      </Modal>


      <Toast></Toast>
    </KeyboardAvoidingView>
  );

};

export default AdminOgretmenDetayEkrani;


