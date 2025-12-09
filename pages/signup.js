import { useState } from 'react';
import Navbar from '../components/Navbar';
import { auth, db } from '../lib/firebaseClient';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Signup(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [username,setUsername]=useState('');
  const [loading,setLoading]=useState(false);
  const router = useRouter();
  const { ref } = router.query;

  const handleSignup = async (e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: username });
      await setDoc(doc(db,'users',res.user.uid), {
        username,
        email,
        coins: 0,
        createdAt: serverTimestamp(),
        lastDailyClaim: null,
        referredBy: ref ?? null
      });
      if(ref){
        await fetch('/api/credit-referral', {
          method:'POST',
          headers:{'content-type':'application/json'},
          body: JSON.stringify({ referrerUsername: ref, newUserUid: res.user.uid })
        });
      }
      router.push('/dashboard');
    }catch(err){
      alert(err.message);
    }finally{ setLoading(false) }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Sign up</h2>
        <form onSubmit={handleSignup}>
          <label className="small">Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} className="input" placeholder="username (public)" required />
          <label className="small">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="input" placeholder="you@domain.com" type="email" required />
          <label className="small">Password</label>
          <input value={password} onChange={e=>setPassword(e.target.value)} className="input" type="password" required />
          <button className="claimBtn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
      </div>
    </>
  );
}