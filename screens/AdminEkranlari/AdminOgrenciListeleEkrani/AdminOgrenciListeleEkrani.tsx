import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../../../App';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { onValue, ref, set } from 'firebase/database';
import { sendEmailVerification, updateEmail, updatePassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import AdminDersListeleEkraniDersComponent from '../../../components/Admin/AdminDersListeleEkraniDersComponent/AdminDersListeleEkraniDersComponent';
import styles from './AdminOgrenciListeleEkraniStyle';
import AdminOgrenciListeleEkraniOgrenciComponent from '../../../components/Admin/AdminOgrenciListeleEkraniOgrenciComponent/AdminOgrenciListeleEkraniOgrenciComponent';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';

interface AdminOgrenciListeleEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminOgrenciListele'>
}


const AdminOgrenciListeleEkrani = ({navigation}:AdminOgrenciListeleEkraniProps) => {

  return (
    <View style={styles.container}>
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Öğrenciler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminOgrenciEkle')}>
              <Text style={styles.headerTopBarText1}>Ögrenci ekle </Text>
            </TouchableOpacity>
        </View>
        <View style={styles.basliklar}>
            <Text style={styles.baslik}>Öğrenci numarası</Text>
            <Text style={styles.baslik}>İsim</Text>
            <Text style={styles.baslik}>İşlemler</Text>
        </View>
        <AdminOgrenciListeleEkraniOgrenciComponent></AdminOgrenciListeleEkraniOgrenciComponent>
        <Toast/>
    </View>
  );

};

export default AdminOgrenciListeleEkrani;


