import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../../../App';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../firebaseConfig';
import { onValue, ref, set } from 'firebase/database';
import { sendEmailVerification, updateEmail, updatePassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import styles from './AdminOgretmenListeleEkraniStyle';
import AdminOgretmenListeleEkraniComponent from '../../../components/Admin/AdminOgretmenListeleEkraniComponent/AdminOgretmenListeleEkraniComponent';
import { AdminRootStackParamsList } from '../../../navigators/Admin/AdminStackNavigator';

interface AdminOgretmenListeleEkraniProps{
  navigation : StackNavigationProp<AdminRootStackParamsList,'AdminOgretmenListele'>
}


const AdminOgrenciListeleEkrani = ({navigation}:AdminOgretmenListeleEkraniProps) => {

  return (
    <View style={styles.container}>
        <View style={styles.headerTopBar}>
            <Text style={styles.headerTopBarText}>Öğretmenler</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AdminOgretmenEkle')}>
              <Text style={styles.headerTopBarText1}>Ögretmen ekle </Text>
            </TouchableOpacity>
        </View>
        <View style={styles.basliklar}>
            <Text style={styles.baslik}>Öğretmen numarası</Text>
            <Text style={styles.baslik}>İsim</Text>
            <Text style={styles.baslik}>İşlemler</Text>
        </View>
        <AdminOgretmenListeleEkraniComponent></AdminOgretmenListeleEkraniComponent>
        <Toast/>
    </View>
  );

};

export default AdminOgrenciListeleEkrani;


