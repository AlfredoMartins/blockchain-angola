/* eslint-disable @typescript-eslint/no-explicit-any */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSANGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// console.log("firebaseConfig: ", firebaseConfig);

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);

// Create a storage reference from our storage service
// const storageRef = ref(storage, 'images');

export const loadImages = async (setImageList: any) => {
  const imageListRef = ref(storage, 'images');
  await listAll(imageListRef).then(res => {
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

export const uploadImage = async (file: any, filename: string, setImageList: any) => {
  if (file === null || file === undefined || filename == '') return;

  const imageRef = ref(storage, `images/${filename}`);
  await uploadBytes(imageRef, file).then((snapshot) => {
    // alert('File uploaded!');
    getDownloadURL(snapshot.ref).then((url) => {
      setImageList((prev: any) => {
        return { ...prev, [url]: url };
      });
    });
  })
};

export const loadSpeech = async (setSpeechList: any) => {
  const audioRef = ref(storage, 'audio');
  await listAll(audioRef).then(res => {
    res.items.forEach((item) => {
      getDownloadURL(item).then((url) => {
        const speech = item._location.path_.split('/')[1];
        setSpeechList((prev: any) => {
          return { ...prev, [speech]: url };
        });
      })
    })
  });
}

export const uploadSpeech = async (file: any, filename: string, setSpeechList: any) => {
  if (file === null || file === undefined || filename == '') return;

  const imageRef = ref(storage, `audio/${filename}`);
  await uploadBytes(imageRef, file).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((url) => {
      setSpeechList((prev: any) => {
        return { ...prev, [url]: url };
      });
    });
  })
};