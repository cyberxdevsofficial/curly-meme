import Link from 'next/link';
export default function Navbar({ user, onLogout }){
  return (
    <div className="nav container">
      <div className="brand">DTZ API HUB</div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <Link href="/"><a className="small">Home</a></Link>
        {user ? (
          <>
            <Link href="/dashboard"><a className="small">Dashboard</a></Link>
            <button onClick={onLogout} className="button">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login"><a className="button">Login</a></Link>
            <Link href="/signup"><a className="button">Signup</a></Link>
          </>
        )}
      </div>
    </div>
  )
}
