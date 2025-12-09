import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { auth, db } from '../lib/firebaseClient';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function Home(){
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if(u){
        const d = doc(db,'users', u.uid);
        const snap = await getDoc(d);
        setUser(snap.exists() ? {...snap.data(), uid:u.uid} : {email:u.email});
      } else setUser(null);
    });
    return ()=> unsub();
  }, []);
  const handleLogout = ()=> signOut(auth);
  return (
    <>
      <Navbar user={user} onLogout={handleLogout}/>
      <div className="container">
        <h1>Welcome to DTZ API HUB</h1>
        <p className="small">APIs, credits, and developer tools — built for convenience.</p>

        <div className="card">
          <h3>Your referral link</h3>
          {user ? (
            <div>
              <code>https://apihub-darktech.zone.id/refferal?={user.username || user.email.split('@')[0]}</code>
              <p className="small">Balance: <strong>{user.coins ?? 0}</strong> coins</p>
              <Link href="/dashboard"><a className="button">Go to Dashboard</a></Link>
            </div>
          ) : (
            <div>
              <Link href="/signup"><a className="button">Create account</a></Link>
              <Link href="/login"><a className="button" style={{marginLeft:8}}>Login</a></Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}