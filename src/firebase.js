import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDabKWDpgrnnQYpzbRixgKU0WVmN0pHN2M",
  authDomain: "mindbee-journal.firebaseapp.com",
  projectId: "mindbee-journal",
  storageBucket: "mindbee-journal.appspot.com",
  messagingSenderId: "137642433481",
  appId: "1:137642433481:web:a523fa90e4613696b6a618",
  measurementId: "G-LMCTBLC0JG"
};


export const app = initializeApp(firebaseConfig);
export const initFirebase = () => {
    return app;
}
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);

