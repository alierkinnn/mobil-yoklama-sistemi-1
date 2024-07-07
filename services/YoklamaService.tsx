import { equalTo, get, onValue, orderByChild, query, ref } from "firebase/database";
import { FIREBASE_DB } from "../firebaseConfig";
import { Yoklama } from "../types/Yoklama";
import { Ogrenci } from "../types/Ogrenci";
import { GunlukYoklama } from "../types/GunlukYoklama";

export const YoklamaIdBul = (dersId: string, ogretmenId:string): string[] =>{

    const ogrenciIdList: string[] = [];

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
              yoklama.DersiAlanOgrenciler.forEach(ogrenciId => {
                ogrenciIdList.push(ogrenciId);
              });
            }
          });
          
          return ogrenciIdList;
        } else {
          console.log("Belirtilen öğretmene ait yoklama verisi bulunamadı.");
        }
      }).catch((error) => {
        console.error("Yoklama verileri alınırken bir hata oluştu:", error);
      });

      return ogrenciIdList;
}

export const YoklamaIdBul1 = async (dersId: string, ogretmenId: string): Promise<string | null> => {
  const yoklamaRef = ref(FIREBASE_DB, 'Yoklama');

  const yoklamaQuery = query(
    yoklamaRef,
    orderByChild('OgretmenId'),
    equalTo(ogretmenId)
  );

  try {
    const snapshot = await get(yoklamaQuery);
    if (snapshot.exists()) {
      let yoklamaId: string | null = null;
      snapshot.forEach((childSnapshot) => {
        const yoklama: Yoklama = childSnapshot.val();
        if (yoklama.DersId === dersId) {
          yoklamaId = yoklama.Id;
        }
      });
      return yoklamaId;
    } else {
      console.log("Belirtilen öğretmene ait yoklama verisi bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Yoklama verileri alınırken bir hata oluştu:", error);
    return null;
  }
};

export const YoklamaBul = async (yoklamaId: string): Promise<Yoklama | null> => {
  const yoklamaRef = ref(FIREBASE_DB, `Yoklama/${yoklamaId}`);
  const yoklamaQuery = query(yoklamaRef);

  try {
    const snapshot = await get(yoklamaQuery);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Belirtilen öğretmene ait yoklama verisi bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Yoklama verileri alınırken bir hata oluştu:", error);
    return null;
  }
};

export const GunlukYoklamaBul = async (gunlukYoklamaId: string): Promise<GunlukYoklama | null> => {
  
  const gunlukYoklamaRef = ref(FIREBASE_DB, "GunlukYoklama/" + gunlukYoklamaId);
  const gunlukYoklamaQuery = query(gunlukYoklamaRef);

  try {
    const snapshot = await get(gunlukYoklamaQuery);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Belirtilen öğretmene ait günlük yoklama verisi bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Günlük Yoklama verileri alınırken bir hata oluştu:", error);
    return null;
  }
};


