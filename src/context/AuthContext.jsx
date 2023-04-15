import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut, sendSignInLinkToEmail} from "firebase/auth";
import { auth, db } from '../firebase'
import { collection, query, onSnapshot, where, addDoc, serverTimestamp, limit, getDoc, getDocs } from "firebase/firestore";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleSignin = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    }

    const addUserDoc = async (user) => {
        try {
            await addDoc(collection(db, "users"), {
                name: user.displayName || null,
                avatar: user.photoURL || null,
                createdAt: serverTimestamp(),
                email: user.email,
                uid: user.uid,
            });
        } catch (error) {
            console.log(error);
        }
    }

    const logout = () => signOut(auth);

    const value = {
        currentUser,
        setCurrentUser,
        googleSignin,
        logout,
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (currentUser) {
            const q = query(
                collection(db, "users"),
                where("uid", "==", currentUser.uid)
            );
            onSnapshot(q, (querySnapshot) => {
                const users = [];
                querySnapshot.forEach((doc) => {
                    users.push({ ...doc.data(), id: doc.id });
                });
                if (users.length === 0) {
                    addUserDoc(currentUser);
                }
            });
        }
    }, [currentUser])

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const UserAuth = () => {
    return useContext(AuthContext);
}