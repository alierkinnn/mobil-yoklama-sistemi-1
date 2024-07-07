import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; 
import styles from './AdminOgretmenListeleEkraniComponentStyle';
import { useNavigation } from '@react-navigation/native';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ogretmen } from '../../../types/Ogretmen';



const AdminOgretmenListeleEkraniOgrenciComponent = () => {

  const navigation = useNavigation<StackNavigationProp<AdminRootStackParamsList>>();

  const [ogretmenListesi, setOgretmenListesi] = useState<Ogretmen[]>([]);

  useEffect(() =>{

    const ogrencilerRef = ref(FIREBASE_DB, 'Ogretmenler');
    onValue(ogrencilerRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          ogretmenListesi.push({
            Id: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setOgretmenListesi(ogretmenListesi);
      });

  }, []);

  const ogretmeniSil = (Id: string) => {
    Alert.alert(
      'Öğretmeni Sil',
      'Öğretmeni silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: () => {
            // Kullanıcı "Sil"e tıklarsa, silme işlemine devam edin
            const dersRef = ref(FIREBASE_DB, `Ogretmenler/${Id}`);
            remove(dersRef)
              .then(() => {
                console.log('Öğretmen silindi');
                // Dersler tekrar yüklenebilir veya başka bir işlem yapılabilir
              })
              .catch((error) => {
                console.error('Öğretmen silme hatası:', error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Ogretmen }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.OgretmenNumarasi}</Text>
      <Text style={styles.cell}>{item.Ad} {item.Soyad}</Text>
      <View style={[styles.cell]}>
      <TouchableOpacity onPress={() => ogretmeniSil(item.Id)} >
            <Ionicons name="trash-outline" size={24} color="red" style={{textAlign:'right'}} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AdminOgretmenDetay',{ogretmenId : item.Id})}>
            <Ionicons name="eye-outline" size={24} color="blue" style={{textAlign:'right'}} />
        </TouchableOpacity>
      </View>

    </View>
  );

  return (
    <View>
        <FlatList style={{marginBottom:135}}
        data={ogretmenListesi}
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
        />
    </View>
  );

};

export default AdminOgretmenListeleEkraniOgrenciComponent;
