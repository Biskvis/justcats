"use client";
import { useEffect, useState } from "react";
import { MyContext } from "../MyContext";
import { redirect, useRouter } from "next/navigation";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/app/firebase/config'
import { getFirestore, doc } from 'firebase/firestore';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';


export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter()

    const docRef = user ? doc(db, "users", user.uid) : null;
    const [userData, firestoreLoading, firestoreError, snapshot, reload] = useDocumentDataOnce(docRef);

    
    if (loading) {
      return (
        <div>
          <p>Initialising User...</p>
        </div>
      )
    }
      if (!user) {
        return router.push("/sign-in");
      }
    


    if (!user) {
      return null;
    }

    return (

      <MyContext.Provider value={userData!}>
        <Component {...props} />
      </MyContext.Provider>

    )
  };
}