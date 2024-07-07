import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import AdminAnaSayfaDropdown from '../../../components/Admin/AdminAnaSayfaDropdown/AdminAnaSayfaDropdown';
import styles from './AdminAnaSayfaStyle';

import { StackNavigationProp } from '@react-navigation/stack';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';

interface AdminAnaSayfaProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminAnaSayfa'>
}

const AdminAnaSayfa = ({navigation}:AdminAnaSayfaProps) => {

  const handleOptionSelect = (item: { label: string; value: string }) => {
    console.log(`Seçilen işlem: ${item.value}`);
    if (item.value === 'AdminDersEkle') {
      navigation.navigate('AdminDersEkle');
    }
    else if (item.value === 'AdminOgrenciListele') {
      navigation.navigate('AdminOgrenciListele');
    }
    else if (item.value === 'AdminOgrenciEkle') {
      navigation.navigate('AdminOgrenciEkle');
    }
    else if (item.value === 'AdminOgretmenListele') {
      navigation.navigate('AdminOgretmenListele');
    }
    else if (item.value === 'AdminOgretmenEkle') {
      navigation.navigate('AdminOgretmenEkle');
    }
    else if (item.value === 'AdminDersListele') {
      navigation.navigate('AdminDersListele');
    }
    else if (item.value === 'AdminYoklamaIslemleri'){
      navigation.navigate('AdminYoklamaIslemleri');
    }
  };

  const teacherOptions = [
    { label: 'Öğretmen Ekle', value: 'AdminOgretmenEkle' },
    { label: 'Öğretmenleri Listele', value: 'AdminOgretmenListele' },
  ];

  const studentOptions = [
    { label: 'Öğrenci Ekle', value: 'AdminOgrenciEkle' },
    { label: 'Öğrencileri Listele', value: 'AdminOgrenciListele' },
  ];

  const dersOptions = [
    { label: 'Ders Ekle', value: 'AdminDersEkle' },
    { label: 'Dersleri Listele', value: 'AdminDersListele' },
  ];

  const yoklamaOptions = [
    { label: 'Yoklama İşlemleri', value: 'AdminYoklamaIslemleri' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <AdminAnaSayfaDropdown title="Öğretmen İşlemleri" options={teacherOptions} onSelect={handleOptionSelect} />
        <AdminAnaSayfaDropdown title="Öğrenci İşlemleri" options={studentOptions} onSelect={handleOptionSelect}   />
        <AdminAnaSayfaDropdown title="Ders İşlemleri" options={dersOptions} onSelect={handleOptionSelect}  />
        <AdminAnaSayfaDropdown title="Yoklama İşlemleri" options={yoklamaOptions} onSelect={handleOptionSelect}></AdminAnaSayfaDropdown>
      </View>
    </View>
  );

};

export default AdminAnaSayfa;


