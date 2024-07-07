import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { FIREBASE_DB } from '../../../firebaseConfig';
import { equalTo, get, onValue, orderByChild, push, query, ref, set } from 'firebase/database';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'; 
import { Ders } from '../../../types/Ders';
import { Ogretmen } from '../../../types/Ogretmen';
import styles from './AdminGunlukYoklamaUretmeEkraniStyle';
import { Yoklama } from '../../../types/Yoklama';
import { DersGetir, OgretmenGetir } from '../../../services/GetTypeService';
import moment from 'moment';
import { GunlukYoklama } from '../../../types/GunlukYoklama';
import { YoklamaBul, YoklamaIdBul1 } from '../../../services/YoklamaService';


interface AdminGunlukYoklamaUretmeEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminGunlukYoklamaUretme'>,
  route : any;
}

const AdminGunlukYoklamaUretEkrani = ({navigation,route}:AdminGunlukYoklamaUretmeEkraniProps) => {

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  const officialHolidays = [
    '01.01', // 1 Ocak
    '23.04', // 23 Nisan
    '01.05', // 1 Mayıs
    '19.05', // 19 Mayıs
    '15.07', // 15 Temmuz
    '30.08', // 30 Ağustos
    '29.10'  // 29 Ekim
  ];

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [yoklamaId, setYoklamaId] = useState<string>();
  const [yoklama, setYoklama] = useState<Yoklama>();
  const [generatedDates, setGeneratedDates] = useState<string[]>([]);
  const [ders, setDers] = useState<Ders>();
  const [ogretmen, setOgretmen] = useState<Ogretmen>();

  const {ogretmenId, dersId} = route.params;


 useEffect(() => {

  setDers(DersGetir(dersId));
  setOgretmen(OgretmenGetir(ogretmenId));
  fetchYoklama();

  const yoklamaRef = ref(FIREBASE_DB, 'Yoklama');

  const yoklamaQuery = query(
    yoklamaRef,
    orderByChild('OgretmenId'),
    equalTo(ogretmenId)
  );

  get(yoklamaQuery).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const yoklama: Yoklama = childSnapshot.val();
          if (yoklama.DersId === dersId) {
            setYoklamaId(yoklama.Id);
          }
        });

      } else {
        console.log("Belirtilen öğretmene ait yoklama verisi bulunamadı.");
      }
    }).catch((error) => {
      console.error("Yoklama verileri alınırken bir hata oluştu:", error);
    });

  

},[]);

const fetchYoklama = async () => {

  try {
    const id = await YoklamaIdBul1(dersId, ogretmenId);
    if (id) {
      const yoklama = await YoklamaBul(id);
      setYoklama(yoklama !== null ? yoklama : undefined);
    }
  } catch (error) {
    console.error("Yoklama verileri alınırken bir hata oluştu:", error);
  }
  
};

const toggleDay = (day : string) => {
    if (selectedDays.includes(day)) {
        setSelectedDays(selectedDays.filter(item => item !== day));
    } else {
        setSelectedDays([...selectedDays, day]);
    }
};

const generateDates = () => {
  // Set the locale to Turkey for Monday week start
  moment.locale('tr');

  // Set the starting date as Monday, October 2nd, 2023
  const startDate = moment('2024-02-12').startOf('week'); // Now uses Monday as week start

  const generatedDates = [];
  for (let week = 0; week < 14; week++) {
    // Loop through each day in the selected days array
    for (const day of selectedDays) {
      const dayIndex = days.indexOf(day) + 1; // Get the index of the day (0-based)

      // Calculate the date for the current day within the current week
      const date = startDate.clone().add(week, 'weeks').add(dayIndex, 'days');

      // Check if the date is an official holiday
      const formattedDate = date.format('DD.MM');
      if (!officialHolidays.includes(formattedDate)) {
        // Ensure the date falls within the 14-week period
        if (date.isBefore(startDate.clone().add(14, 'weeks'))) {
          generatedDates.push(date.format('DD.MM.YYYY')); // Format the date (DD.MM.YYYY weekday)
        }
      }
    }
  }

  setGeneratedDates(generatedDates);
  console.log('Generated Dates:', generatedDates); // For debugging purposes
  GunlukYoklamalariOlustur(generatedDates);
};

const GunlukYoklamalariOlustur = (generatedDates: string[]) => {

  generatedDates.forEach((generateDate) => {
    const newGunlukYoklamaKey = push(ref(FIREBASE_DB, 'GunlukYoklama')).key;
    if (newGunlukYoklamaKey) {

      if(yoklama){
        const yoklama1: { [ogrenciId: string]: boolean } = {};
        yoklama.DersiAlanOgrenciler.forEach((ogrenciId) => {
            yoklama1[ogrenciId] = false;
        });
      
        // Veritabanına yeni kaydı ekle
        set(ref(FIREBASE_DB, `GunlukYoklama/${newGunlukYoklamaKey}`), {
          Id: newGunlukYoklamaKey,
          YoklamaId: yoklamaId,
          Kod: "",
          Tarih: generateDate,
          BittiMi: false,
          Yoklama: yoklama1,
        }).then(() => {
          console.log('Gunluk yoklama eklendi:', generateDate);
        }).catch((error) => {
          console.error('Gunluk yoklama eklenirken hata oluştu:', error);
        });

      }

    }
  });
  
};


const renderDays = () => {
  return days.map((day, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => toggleDay(day)}
        style={[
          styles.day,
          { backgroundColor: selectedDays.includes(day) ? '#eef0b4' : 'white' }
        ]}
      >
          <Text style={{textAlign:'center'}}>{day}</Text>
      </TouchableOpacity>
  ));
};

const renderItem = ({ item }: { item: string }) => (
  <View style={styles.row}>
    <Text style={styles.cell}>{item}</Text>
  </View>
);



  return (
    <View style={styles.container}>
      <View style={styles.headerTopBar}>
        <Text style={styles.headerTopBarText}>Günlük Yoklama Üret</Text>
      </View>
      <View style={{alignItems:'center'}}>
        <Text style={{margin:7}}>
          Bu sayfada 14 haftalık dönem boyunca {ogretmen ? `${ogretmen.Ad} ${ogretmen.Soyad}` : ''} adlı öğretmenin 
          {ders ? ` ${ders.DersAdi}` : ''} dersinin hangi günler olacağını seçip yoklamaları oluşturabilirsiniz.
        </Text>
        <View style={styles.days}>
          {renderDays()}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={generateDates}
        >
            <Text style={{textAlign:'center'}}>14 haftalık yoklamayı oluştur.</Text>
        </TouchableOpacity>
      </View>

        <FlatList style={{marginVertical:30}}
        data={generatedDates}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        />  

    </View>
  );

};

export default AdminGunlukYoklamaUretEkrani;



