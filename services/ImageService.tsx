import * as FaceDetector from 'expo-face-detector';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../firebaseConfig';
import * as ImageManipulator from 'expo-image-manipulator';



export const detectFaces = async (imageUri: string): Promise<number>  => {
    const faces = await FaceDetector.detectFacesAsync(imageUri);
    const numFaces = faces.faces.length;

    if (numFaces === 1) {
      console.log('Resimde yüz tespit edildi.');
    }
    else if (numFaces > 1) {
      console.log("Resimde birden fazla yüz tespit edildi");
    }
    else {
      console.log('Resimde yüz bulunamadı.');
    }

    return numFaces;
};
  
  export const imageFromCamera = async (): Promise<string | null> => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        return result.assets[0].uri;
      } else {
        return null; // İptal edildi veya resim seçilmedi
      }
    } catch (error) {
      console.log(error);
      return null; // Hata oluştu
    }
  };
  
  

  export const imageFromGallery = async (): Promise<string | null> => {
    try {
      await ImagePicker.getMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        return result.assets[0].uri;
      } else {
        return null; // İptal edildi veya resim seçilmedi
      }
    } catch (error) {
      console.log(error);
      return null; // Hata oluştu
    }
  };
  

  export const saveImage = async (userUid: string, imageUri: string): Promise<boolean> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      const ref = storageRef(FIREBASE_STORAGE, "images/" + userUid + ".jpg");
      await uploadBytes(ref, blob);
      
      console.log("Başarılı: Resim yüklendi");
      return true;
    } catch (error) {
      console.error("Hata: ", error);
      return false;
    }
  };

  export const getImage = async (userId:string): Promise<string | null> => {
    try {
      // Öğrencinin UID'sini kullanarak storage'dan resmi al
      const storageReference = storageRef(FIREBASE_STORAGE, `images/${userId}.jpg`);
      const url = await getDownloadURL(storageReference);
      return url;
    } catch (error) {
      console.error("Öğrenci resmi alınamadı:", error);
      return null;
    }
  };




  // const processImage = async (imageUrl:string) => {
  //   try {
  //     // Resmi işle
  //     const manipResult = await ImageManipulator.manipulateAsync(
  //       imageUrl,
  //       [], // Hiçbir işlem yapmayın, yalnızca orijinal resmi almak için
  //       { compress: 1, base64: false }
  //     );
  
  //     // İşlenmiş resmin URI'sini döndür
  //     return manipResult.uri;
  //   } catch (error) {
  //     console.error('Hata:', error);
  //     return null;
  //   }
  // };
  