'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BrowsePage() {
  const { user, loading, getAllProfiles, isFriend, addFriend, removeFriend } = useAuth();
  const router = useRouter();

  if (loading) return <div className="loading-container"><div className="loading-spinner" /><div className="loading-text">Loading...</div></div>;
  if (!user) { router.push('/'); return null; }

  const otherProfiles = getAllProfiles().filter(p => p.id !== user.id);

  return (
    <div className="page-container">
      <h1 className="page-title">Browse Users</h1>

      <div className="section-box" style={{ marginBottom: 16 }}>
        <div className="section-body" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Search Users:</span>
          <input className="form-input" style={{ flex: 1 }} placeholder="" />
          <button className="btn btn-secondary btn-sm">Search</button>
        </div>
      </div>

      <div className="section-box">
        <div className="section-header">All Users ({otherProfiles.length})</div>
        <div className="section-body">
          <div className="users-grid">
            {otherProfiles.map(p => {
              const friendStatus = isFriend(p.id);
              return (
                <div key={p.id} className="user-card">
                  <Link href={`/profile/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="user-card-avatar">
                      {p.avatar_url ? <img src={p.avatar_url} alt="" /> : '👤'}
                    </div>
                    <div className="user-card-name">{p.display_name || p.username}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{p.username}</div>
                    {p.mood && <div className="user-card-mood">{p.mood}</div>}
                    <div className="user-card-bio">{p.bio}</div>
                  </Link>
                  <div style={{ marginTop: 8, display: 'flex', gap: 4, justifyContent: 'center' }}>
                    {friendStatus ? (
                      <button className="btn btn-danger btn-sm" onClick={() => removeFriend(p.id)}>Remove</button>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => addFriend(p.id)}>Add Friend</button>
                    )}
                  </div>
                  <div style={{ marginTop: 4, fontSize: 11 }}>
                    {p.online ? <><span className="online-dot" /> Online</> : <><span className="offline-dot" /> Offline</>}
                  </div>
                </div>
              );
            })}
          </div>
          {otherProfiles.length === 0 && (
            <p style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>No other users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
