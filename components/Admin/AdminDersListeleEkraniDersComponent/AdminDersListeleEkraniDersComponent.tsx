import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ref, onValue, remove } from 'firebase/database';
import { FIREBASE_DB } from '../../../firebaseConfig';
import styles from './AdminDersListeleEkraniDersComponentStyle';
import { Ionicons } from '@expo/vector-icons'; 
import { Ders } from '../../../types/Ders';


const AdminDersListeleEkraniDersComponent = () => {

  const [dersListesi, setDersListesi] = useState<Ders[]>([]);

  useEffect(() =>{

    const derslerRef = ref(FIREBASE_DB, 'Dersler');
    onValue(derslerRef, (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          dersListesi.push({
            dersId: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setDersListesi(dersListesi);
      });

  }, []);

  const dersiSil = (dersId: string) => {
    Alert.alert(
      'Dersi Sil',
      'Dersi silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: () => {
            // Kullanıcı "Sil"e tıklarsa, silme işlemine devam edin
            const dersRef = ref(FIREBASE_DB, `Dersler/${dersId}`);
            remove(dersRef)
              .then(() => {
                console.log('Ders silindi');
                // Dersler tekrar yüklenebilir veya başka bir işlem yapılabilir
              })
              .catch((error) => {
                console.error('Ders silme hatası:', error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }: { item: Ders }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.DersAdi}</Text>
      <Text style={styles.cell}>{item.OgretimTuru}</Text>
        <TouchableOpacity onPress={() => dersiSil(item.DersId)} style={styles.cell}>
            <Ionicons name="trash-outline" size={24} color="red" style={{textAlign:'right'}} />
        </TouchableOpacity>

    </View>
  );

  return (
    <View>
        <FlatList style={{marginBottom:35}}
        data={dersListesi}
        keyExtractor={(item) => item.DersId}
        renderItem={renderItem}
        />
    </View>
  );

};

export default AdminDersListeleEkraniDersComponent;
