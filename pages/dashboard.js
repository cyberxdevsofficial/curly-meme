import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { auth, db } from '../lib/firebaseClient';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Dashboard(){
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  const router = useRouter();

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      if(!u){ router.push('/login'); return; }
      const d = doc(db,'users',u.uid);
      const snap = await getDoc(d);
      setUser({ uid:u.uid, ...(snap.exists() ? snap.data() : {}) });
      setLoading(false);
    });
    return ()=> unsub();
  },[]);

  const handleLogout = ()=> signOut(auth);

  const claimDaily = async ()=>{
    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch('https://us-central1-' + process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + '.cloudfunctions.net/claimDaily', {
      method:'POST',
      headers:{ 'content-type':'application/json', 'Authorization': 'Bearer ' + idToken }
    });
    const j = await res.json();
    if(!res.ok) return alert(j.error || 'Claim failed');
    const d = doc(db,'users',user.uid);
    const snap = await getDoc(d);
    setUser({...user, ...snap.data()});
    alert('Claim success: +20 coins');
  };

  if(loading) return <div className="container">Loading...</div>;
  return (
    <>
      <Navbar user={user} onLogout={handleLogout}/>
      <div className="container">
        <h2>Dashboard</h2>
        <div className="card">
          <p className="small">Username: <strong>{user.username}</strong></p>
          <p className="small">Email: <strong>{user.email}</strong></p>
          <p className="small">Coins: <strong>{user.coins ?? 0}</strong></p>
          <div style={{marginTop:12}}>
            <button className="claimBtn" onClick={claimDaily}>Claim Daily Bonus (+20)</button>
            <p className="small">Referral link: <code>https://apihub-darktech.zone.id/refferal?={user.username}</code></p>
          </div>
        </div>
      </div>
    </>
  );
}