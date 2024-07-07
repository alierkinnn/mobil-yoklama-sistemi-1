import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; 
import styles from './AdminOgrenciListeleEkraniOgrenciComponentStyle';
import { User, deleteUser, getAuth } from 'firebase/auth';
import { Ogrenci } from '../../../types/Ogrenci';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';



const AdminOgrenciListeleEkraniOgrenciComponent = () => {

  const navigation = useNavigation<StackNavigationProp<AdminRootStackParamsList>>();

  const [ogrenciListesi, setOgrenciListesi] = useState<Ogrenci[]>([]);

  useEffect(() =>{

    const ogrencilerRef = ref(FIREBASE_DB, 'Ogrenciler');
    onValue(ogrencilerRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          ogrenciListesi.push({
            Id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setOgrenciListesi(ogrenciListesi);
      });

  }, []);

  const ogrenciyiSil = (Id: string) => {
    Alert.alert(
      'Öğrenciyi Sil',
      'Öğrenciyi silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              // Öğrenciyi Firestore'dan silme 
              const dersRef = ref(FIREBASE_DB, `Ogrenciler/${Id}`);
              await remove(dersRef);
              console.log('Öğrenci Firestore\'dan silindi');
              
              // Kullanıcının Authentication'dan silinmesi
              console.log('Authentication\'dan kullanıcı silindi');
              
  
              // Dersler tekrar yüklenebilir veya başka bir işlem yapılabilir
            } catch (error) {
              console.error('Öğrenci silme hatası:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Ogrenci }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.OgrenciNumarasi}</Text>
      <Text style={styles.cell}>{item.Ad} {item.Soyad}</Text>
      <View style={styles.buttons}>
      <TouchableOpacity onPress={() => ogrenciyiSil(item.Id)} >
            <Ionicons name="trash-outline" size={24} color="red" style={{textAlign:'right'}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminOgrenciDetay', {ogrenciId : item.Id})}>
            <Ionicons name="eye-outline" size={24} color="blue" style={{textAlign:'right'}} />
        </TouchableOpacity>
      </View>


    </View>
  );

  return (
    <View>
        <FlatList style={{marginBottom:150}}
        data={ogrenciListesi}
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
        />
    </View>
  );

};

export default AdminOgrenciListeleEkraniOgrenciComponent;
