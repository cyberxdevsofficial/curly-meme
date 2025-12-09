import { useState } from 'react';
import Navbar from '../components/Navbar';
import { auth } from '../lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const router = useRouter();

  const handle = async (e)=>{
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    }catch(err){ alert(err.message) }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Login</h2>
        <form onSubmit={handle}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="claimBtn" type="submit">Login</button>
        </form>
      </div>
    </>
  );
}