


// export const compareFaces =  async (imageUri1: string, imageUri2: string) : boolean => {
//     try {
//         const base64Image2 = await getImageBase64(imageUri2);
        
//         const requestData = {
//           img1_path: imageUri1,
//           img2_path: base64Image2,
//           model_name: "Facenet",
//           detector_backend: "mtcnn",
//           distance_metric: "euclidean"
//         };

//         fetch("http://192.168.1.159:8000/verify", {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(requestData),
//         })
//         .then(response => response.json())
//         .then(data => {
//           console.log('Response:', data);
//           return data.verified;
//         })
//         .catch(error => {
//           console.error('Error:', error);
//           return false;
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         return false;
//     }
//     return false;
// };

export const compareFaces = async (imageUri1: string, imageUri2: string): Promise<boolean> => {
  try {
      const base64Image2 = await getImageBase64(imageUri2);
      
      const requestData = {
        img1_path: imageUri1,
        img2_path: base64Image2,
        model_name: "Facenet",
        detector_backend: "mtcnn",
        distance_metric: "euclidean"
      };

      return fetch("http://192.168.1.124:8000/verify", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data);
        return data.verified;
      })
      .catch(error => {
        console.error('Error:', error);
        return false;
      });
  } catch (error) {
      console.error('Error:', error);
      return false;
  }
};

const getImageBase64 = async (imageUri:string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return base64;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  };
