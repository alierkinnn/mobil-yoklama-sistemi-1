import { onValue, ref } from "firebase/database";
import { FIREBASE_DB } from "../firebaseConfig";
import { Ders } from "../types/Ders";
import { Ogretmen } from "../types/Ogretmen";
import { Ogrenci } from "../types/Ogrenci";
import { GunlukYoklama } from "../types/GunlukYoklama";


export const DersGetir = (dersId: string): Ders => {
    let ders: Ders = {
      DersId: '',
      DersAdi: '',
      OgretimTuru: ''
    };
  
    const dersRef = ref(FIREBASE_DB, 'Dersler/' + dersId);
    onValue(dersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        ders = data; 
      }
    });
  
    return ders;
};


export const OgretmenGetir = (ogretmenId: string): Ogretmen =>{
    let ogretmen : Ogretmen = {
        Id: '',
        OgretmenNumarasi: '', 
        Ad: '',
        Soyad: '',
        Eposta: '',
        Sifre: '',
        VerdigiDersler: [],
    };

    const ogretmenRef = ref(FIREBASE_DB, 'Ogretmenler/' + ogretmenId);
    onValue(ogretmenRef, (snapshot) => {
      const ogretmenData = snapshot.val();
      if (ogretmenData) {
        ogretmen = ogretmenData;
      } 
    });
    return ogretmen;
};

export const OgrenciGetir = (ogrenciId: string): Ogrenci =>{
  let ogrenci : Ogrenci = {
      Id: '',
      OgrenciNumarasi: '', 
      Ad: '',
      Soyad: '',
      Eposta: '',
      Sifre: '',
      AldigiDersler: [],
      Devamsizlik: '',
  };

  const ogrenciRef = ref(FIREBASE_DB, 'Ogrenciler/' + ogrenciId);
  onValue(ogrenciRef, (snapshot) => {
    const ogrenciData = snapshot.val();
    if (ogrenciData) {
      ogrenci = ogrenciData;
    } 
  });
  return ogrenci;
};

export const GunlukYoklamaGetir = (gunlukYoklamaId: string): GunlukYoklama =>{
  let gunlukYoklama : GunlukYoklama = {
    Id: '',
    YoklamaId: '',
    Kod: '',
    Tarih: '',
    Yoklama: { },
    BittiMi: false,
  };

  const gunlukYoklamaRef = ref(FIREBASE_DB, 'GunlukYoklama/' + gunlukYoklamaId);
  onValue(gunlukYoklamaRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      gunlukYoklama = data;
      console.log(gunlukYoklama);
    } 
  });
  return gunlukYoklama;
};

