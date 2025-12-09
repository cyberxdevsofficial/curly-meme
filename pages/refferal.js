import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Refferal(){
  const router = useRouter();
  useEffect(()=> {
    const q = router.asPath.split('?=')[1];
    if(q){
      router.replace(`/signup?ref=${q}`);
    } else router.replace('/');
  },[]);
  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Redirecting...</h2>
        <p className="small">If not redirected, <Link href="/"><a>click here</a></Link></p>
      </div>
    </>
  );
}