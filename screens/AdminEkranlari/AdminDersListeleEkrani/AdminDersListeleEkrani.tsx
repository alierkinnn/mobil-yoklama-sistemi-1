import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../../../App';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { onValue, ref, set } from 'firebase/database';
import { sendEmailVerification, updateEmail, updatePassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import styles from './AdminDersListeleEkraniStyle';
import AdminDersListeleEkraniDersComponent from '../../../components/Admin/AdminDersListeleEkraniDersComponent/AdminDersListeleEkraniDersComponent';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';

interface AdminDersListeleEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminDersListele'>
}


const AdminDersListeleEkrani = ({navigation}:AdminDersListeleEkraniProps) => {

  return (
    <View style={styles.container}>
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Dersler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminDersEkle')}>
              <Text style={styles.headerTopBarText1}>Ders ekleme sayfası </Text>
            </TouchableOpacity>
        </View>
        <View style={styles.basliklar}>
            <Text style={styles.baslik}>Ders Adı</Text>
            <Text style={styles.baslik}>Öğretim Türü</Text>
            <Text style={styles.baslik}>İşlemler</Text>
        </View>
        <AdminDersListeleEkraniDersComponent></AdminDersListeleEkraniDersComponent>
        <Toast/>
    </View>
  );

};

export default AdminDersListeleEkrani;


