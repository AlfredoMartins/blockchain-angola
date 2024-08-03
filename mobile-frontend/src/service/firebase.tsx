/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSANGING_SENDER_ID, APP_ID } from "@env"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSANGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);

// Create a storage reference from our storage service
// const storageRef = ref(storage, 'images');

export const loadImages = (setImageList: any) => {
  const imageListRef = ref(storage, 'images');
  listAll(imageListRef).then(res => {
    res.items.forEach((item) => {
      getDownloadURL(item).then((url) => {
        const username = item._location.path_.split('/')[1];
        setImageList((prev: any) => {
          return { ...prev, [username]: url };
        });
      })
    })
  });
}


export const uploadImage = (file: any, filename: string, setImageList: any) => {
  if (file === null) return;

  const imageRef = ref(storage, `images/${filename}`);
  uploadBytes(imageRef, file).then((snapshot) => {
    // alert('File uploaded!');
    getDownloadURL(snapshot.ref).then((url) => {
      setImageList((prev: any) => {
        return { ...prev, [url]: url };
      });
    });
  })
};