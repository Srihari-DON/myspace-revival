'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id;
  const router = useRouter();
  const { user, loading, getProfile, getFriends, getBlogs, isFriend, addFriend, removeFriend } = useAuth();

  if (loading) return <div className="loading-container"><div className="loading-spinner" /><div className="loading-text">Loading...</div></div>;
  if (!user) { router.push('/'); return null; }

  const profile = getProfile(userId);
  if (!profile) return <div className="page-container"><div className="section-box"><div className="section-body" style={{ textAlign: 'center', padding: 40 }}><h2>User not found</h2><Link href="/browse" className="btn btn-primary" style={{ marginTop: 12 }}>Browse Users</Link></div></div></div>;

  const friends = getFriends(userId);
  const blogs = getBlogs(userId);
  const isOwn = user.id === userId;
  const isFriendStatus = isFriend(userId);
  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="page-container">
      <div className="profile-layout">
        {/* LEFT SIDEBAR */}
        <div className="profile-sidebar">
          <div className="section-box">
            <div className="profile-name-bar">
              {profile.display_name || profile.username}
              <span className="online-status">{profile.online ? '● Online Now' : ''}</span>
            </div>
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : '👤'}
              </div>
              {profile.mood && <div className="profile-mood">Mood: {profile.mood}</div>}
              <div className="profile-actions">
                {isOwn ? (
                  <Link href="/edit-profile" className="btn btn-primary btn-sm">Edit Profile</Link>
                ) : (
                  <>
                    {isFriendStatus ? (
                      <button className="btn btn-danger btn-sm" onClick={() => removeFriend(userId)}>Remove Friend</button>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => addFriend(userId)}>Add to Friends</button>
                    )}
                    <Link href="/chat" className="btn btn-secondary btn-sm">Send Message</Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Song */}
          {profile.song_title && (
            <div className="section-box">
              <div className="section-header">🎵 {profile.display_name}&apos;s Song</div>
              <div className="section-body">
                <div className="song-player">
                  <div className="song-icon">▶️</div>
                  <div>
                    <div className="song-title-text">{profile.song_title}</div>
                    <div className="song-artist-text">{profile.song_artist}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details */}
          <div className="section-box">
            <div className="section-header">Details</div>
            <div className="section-body">
              <dl className="profile-details">
                <dt>Username:</dt><dd>@{profile.username}</dd>
                <dt>Joined:</dt><dd>{joinDate}</dd>
                <dt>Status:</dt><dd>{profile.online ? '🟢 Online' : '⚫ Offline'}</dd>
              </dl>
            </div>
          </div>

          {/* Friends */}
          <div className="section-box">
            <div className="section-header">
              {isOwn ? 'My' : `${profile.display_name}'s`} Friends ({friends.length})
              <Link href="/browse">[view all]</Link>
            </div>
            <div className="section-body">
              {friends.length > 0 ? (
                <div className="friends-grid">
                  {friends.slice(0, 8).map(f => (
                    <Link href={`/profile/${f.id}`} key={f.id} className="friend-card">
                      <div className="friend-card-avatar">
                        {f.avatar_url ? <img src={f.avatar_url} alt="" /> : '👤'}
                      </div>
                      <div className="friend-card-name">{f.display_name || f.username}</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>No friends yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT MAIN */}
        <div className="profile-main">
          {/* About Me / Custom HTML */}
          <div className="section-box">
            <div className="section-header">About {profile.display_name}</div>
            <div className="section-body">
              {profile.bio && <p style={{ marginBottom: 12 }}>{profile.bio}</p>}
              {profile.custom_html ? (
                <div className="profile-custom-html" dangerouslySetInnerHTML={{ __html: profile.custom_html }} />
              ) : (
                !profile.bio && <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>This user hasn&apos;t written anything yet.</p>
              )}
            </div>
          </div>

          {/* Blog Posts */}
          <div className="section-box">
            <div className="section-header">
              {profile.display_name}&apos;s Blog Entries ({blogs.length})
              {isOwn && <Link href="/blogs">[New Entry]</Link>}
            </div>
            <div className="section-body">
              {blogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No blog entries yet.</p>
              ) : (
                blogs.map(blog => (
                  <div key={blog.id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{blog.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {new Date(blog.created_at).toLocaleDateString()} {blog.mood && `— ${blog.mood}`}
                    </div>
                    <div style={{ fontSize: 13 }} dangerouslySetInnerHTML={{ __html: blog.body }} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
