import { useEffect, useState, useLayoutEffect } from "react";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/router";
import { initFirebase } from "../firebase";
import { UserAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { Gradient } from "@/components/GradientBG";

export default function Home() {
  // initFirebase();
  const router = useRouter();
  const { currentUser, googleSignin, guestSignin } = UserAuth();

  useLayoutEffect(() => {
    const gradient = new Gradient()
    gradient.initGradient('#gradient-canvas')
  }, []);

  const [linkSent, setLinkSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await googleSignin();
    } catch (error) {
      console.log(error);
    }
  }

  const handlePasswordlessLogin = async (e) => {
    e.preventDefault();
    sendSignInLinkToEmail(auth, email, {
      // this is the URL that we will redirect back to after clicking on the link in mailbox
      url: 'https://mindbee-journal.vercel.app',
      handleCodeInApp: true,
    }).then(() => {
      window.localStorage.setItem('email', email);
      setLinkSent(true);
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, localStorage.getItem('email'), window.location.href)
        .then((result) => {
          localStorage.removeItem('email');
        }).catch((err) => {
          console.log(err);
          router.push('/');
        })
    }
  }, [currentUser]);

  return (
    <div className="h-[100dvh] overflow-hidden w-full flex bg-gray-300 flex-row justify-center items-center">
      <div className="w-12 bg-gray-600 h-[70dvh] rounded-tl rounded-bl drop-shadow-lg" />
      <div className="w-4/6 bg-green-800 h-[70dvh] rounded-tr rounded-br p-2 drop-shadow-lg overflow-hidden">
        {window.innerWidth < 600 ? <></> : <canvas className="w-full h-full" id="gradient-canvas" data-transition-in></canvas>}
        <h1 className="text-2xl font-bold mt-7 text-gray-200">MindBee Journal</h1>
        <h2 className="text-xs text-gray-200">A mental health journal & therapist powered by ai</h2>
        <a onClick={handleGoogleLogin} className="btn btn-xs bg-gray-700 mt-6 text-gray-400 normal-case">
          <img src="./GoogleLogo.svg" style={{ height: '15px', marginRight: '5px' }} /> Login with Google
        </a>
        {linkSent ? (
          <div className="mt-5 text-xs">Login link has been sent to your email, please verify to continue.</div>
        ) : (
          <div className="mt-5 containerWrap flex flex-col justify-center">
            <label className="text-left text-xs text-gray-200">Passwordless Email Login</label>
            <div className="flex">
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input input-xs w-20 w-40 focus:outline-none bg-gray-700 rounded-r-none text-gray-500"
              />
              <button
                className="w-auto btn-xs text-[7px] bg-gray-500 text-gray-400 rounded-r-lg px-5 normal-case"
                onClick={handlePasswordlessLogin}
              >
                Send Link
              </button>
            </div>
          </div>
        )}
        <a onClick={() => guestSignin()} className="btn btn-xs bg-gray-700 mt-6 text-gray-400 normal-case">
          Continue as Guest
        </a>
        <img className=" w-full h-full" src="wasp.svg" />
      </div> 
    </div>
  );
}