'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/blogs', label: 'Blog' },
    { href: '/chat', label: 'Messages' },
    { href: `/profile/${user.id}`, label: 'Profile' },
    { href: '/edit-profile', label: 'Settings' },
  ];

  return (
    <>
      <header className="site-header">
        <div className="header-top">
          <Link href="/" className="header-logo">
            <span className="header-logo-icon">🌐</span>
            <div>
              <span className="header-logo-text">MySpacerR</span>
              <span className="header-logo-sub">a space for friends</span>
            </div>
          </Link>
          <div className="header-search">
            <label>Search Users:</label>
            <input type="text" placeholder="" />
            <button>Search</button>
          </div>
          <div className="header-right">
            <Link href="/edit-profile">Help</Link>
            <span>|</span>
            <button onClick={signOut} style={{ background: 'none', border: 'none', color: '#c8daf0', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
              LogOut
            </button>
          </div>
        </div>
      </header>
      <nav className="navbar">
        <div className="navbar-inner">
          {links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && <span className="nav-sep">|</span>}
              <Link href={l.href} className={pathname === l.href ? 'active' : ''}>
                {l.label}
              </Link>
            </span>
          ))}
          <span className="nav-sep">|</span>
          <button onClick={signOut}>LogOut</button>
        </div>
      </nav>
    </>
  );
}
