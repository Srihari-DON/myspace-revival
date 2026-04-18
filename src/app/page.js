'use client';

import { useAuth } from '@/context/AuthContext';
import AuthPage from '@/components/AuthPage';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-container"><div className="loading-spinner" /><div className="loading-text">Loading...</div></div>;
  if (!user) return <AuthPage />;
  return <HomeFeed />;
}

function HomeFeed() {
  const { user, profile, getFeedBlogs, getProfile, addComment, getFriends, getAllProfiles } = useAuth();
  const feedBlogs = getFeedBlogs();
  const friends = getFriends(user.id);
  const allProfiles = getAllProfiles().filter(p => p.id !== user.id);
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="page-container">
      <div className="home-layout">
        {/* LEFT SIDEBAR */}
        <div className="home-sidebar">
          {/* Profile Card */}
          <div className="section-box">
            <div className="mini-profile">
              <div className="mini-profile-greeting">Hello, {profile?.username || 'User'}!</div>
              <div className="mini-profile-content">
                <div className="mini-profile-avatar">
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : '👤'}
                </div>
                <div className="mini-profile-links">
                  <Link href="/edit-profile">Edit Profile</Link>
                  <Link href="/edit-profile">Edit Status</Link>
                  <Link href="/edit-profile">Add/Edit Photo</Link>
                  <Link href="/blogs">Manage Blog</Link>
                  <Link href="/edit-profile">Account Settings</Link>
                </div>
              </div>
              <div className="mini-profile-viewmy">
                <strong>View My: </strong>
                <Link href={`/profile/${user.id}`}>Profile</Link> |{' '}
                <Link href="/blogs">Blog</Link> |{' '}
                <Link href="/browse">Friends</Link>
              </div>
              <div className="mini-profile-url">
                <strong>My URL:</strong> myspacerr.vercel.app/profile/{user.id.slice(0, 8)}
              </div>
            </div>
          </div>

          {/* My Mail */}
          <div className="section-box">
            <div className="section-header">My Mail</div>
            <div className="mail-box">
              <Link href="/chat">✉️ instant messages</Link>
              <Link href="/chat">📧 send message</Link>
              <Link href="/blogs">📋 bulletins</Link>
              <Link href="/blogs">📝 post bulletin</Link>
            </div>
          </div>

          {/* View Your Profile */}
          <div className="section-box">
            <div className="section-body" style={{ textAlign: 'center' }}>
              <Link href={`/profile/${user.id}`} className="btn btn-secondary btn-block">View Your Profile</Link>
            </div>
          </div>
        </div>

        {/* RIGHT MAIN */}
        <div className="home-main">
          {/* Latest Blog Entries */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: 16 }}>
            <div className="section-box">
              <div className="section-header">
                Your Latest Blog Entries
                <Link href="/blogs">[New Entry]</Link>
              </div>
              <div className="section-body">
                {feedBlogs.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>There are no Blog Entries yet.</p>
                ) : (
                  feedBlogs.slice(0, 3).map(blog => {
                    const author = getProfile(blog.author_id);
                    return (
                      <div key={blog.id} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ fontWeight: 700 }}>{blog.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          by <Link href={`/profile/${blog.author_id}`}>{author?.display_name || 'Unknown'}</Link> — {new Date(blog.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="stats-box">
              <div className="stats-date">{today}</div>
              <div className="stats-row">Your Friends:<span className="stats-value">{friends.length}</span></div>
              <div className="stats-row">Profile Views:<span className="stats-value">{Math.floor(Math.random() * 200) + 10}</span></div>
              <div className="stats-row">Joined:<span className="stats-value">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Today'}</span></div>
            </div>
          </div>

          {/* Cool New People */}
          <div className="section-box">
            <div className="section-header">
              Cool New People
              <Link href="/browse">[view more]</Link>
            </div>
            <div className="cool-people-grid">
              {allProfiles.slice(0, 6).map(p => (
                <Link href={`/profile/${p.id}`} key={p.id} className="cool-person">
                  <div className="cool-person-avatar">
                    {p.avatar_url ? <img src={p.avatar_url} alt="" /> : '👤'}
                  </div>
                  <div className="cool-person-name">{p.display_name || p.username}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Friend's Bulletins */}
          <div className="section-box">
            <div className="section-header">
              Your Friend&apos;s Bulletins
              <Link href="/blogs">[view all]</Link>
            </div>
            <div className="section-body">
              <table className="bulletin-table">
                <thead>
                  <tr><th>From</th><th>Subject</th></tr>
                </thead>
                <tbody>
                  {feedBlogs.length === 0 ? (
                    <tr><td colSpan={2} className="bulletin-empty">
                      No bulletins - <Link href="/blogs">post a bulletin</Link>
                    </td></tr>
                  ) : (
                    feedBlogs.slice(0, 5).map(b => {
                      const author = getProfile(b.author_id);
                      return (
                        <tr key={b.id}>
                          <td><Link href={`/profile/${b.author_id}`}>{author?.display_name || 'Unknown'}</Link></td>
                          <td><Link href="/blogs">{b.title}</Link></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Blog Subscriptions */}
          <div className="section-box">
            <div className="section-header">
              Your Blog Subscriptions
              <Link href="/blogs">[view all]</Link>
            </div>
            <div className="section-body">
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Start subscribing to Blogs to view new Blog Entries <Link href="/blogs">here</Link>.
              </p>
            </div>
          </div>

          {/* Friend Requests */}
          <div className="section-box">
            <div className="friend-requests-header">Friend Requests</div>
            <div className="section-body">
              <p style={{ fontSize: 12 }}><strong>0</strong> Open Friend Requests</p>
              <Link href="/browse" className="btn btn-secondary btn-sm" style={{ marginTop: 6 }}>View All Requests</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
