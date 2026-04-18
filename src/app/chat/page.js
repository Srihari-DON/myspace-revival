'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const { user, profile, loading, getMessages, sendMessage, getFriends, getProfile } = useAuth();
  const router = useRouter();
  const [input, setInput] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [chatTab, setChatTab] = useState('all');
  const messagesEndRef = useRef(null);

  const messages = getMessages('room-1');
  const friends = user ? getFriends(user.id) : [];

  // Default to first friend
  useEffect(() => {
    if (friends.length > 0 && !activeChat) {
      setActiveChat(friends[0].id);
    }
  }, [friends, activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) return <div className="loading-container"><div className="loading-spinner" /><div className="loading-text">Loading...</div></div>;
  if (!user) { router.push('/'); return null; }

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input, 'room-1');
    setInput('');
  };

  const activeFriend = activeChat ? getProfile(activeChat) : null;

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    const days = Math.floor(diff / 86400);
    if (days === 0) return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="page-container">
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        <Link href="/">« Back to MySpacerR</Link>
      </div>

      <div className="chat-container">
        {/* LEFT SIDEBAR */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="chat-friend-item-avatar">👤</div>
              <div>
                <div className="chat-sidebar-username">{profile?.username || 'User'}</div>
              </div>
            </div>
            <div className="chat-sidebar-status">{profile?.mood || 'Online'}</div>
          </div>

          <div className="chat-tabs">
            <button className={`chat-tab ${chatTab === 'all' ? 'active' : ''}`} onClick={() => setChatTab('all')}>All Chats</button>
            <button className={`chat-tab ${chatTab === 'favs' ? 'active' : ''}`} onClick={() => setChatTab('favs')}>Favs</button>
          </div>

          <div className="chat-friend-list">
            {friends.map(f => (
              <div
                key={f.id}
                className={`chat-friend-item ${activeChat === f.id ? 'active' : ''}`}
                onClick={() => setActiveChat(f.id)}
              >
                <div className="chat-friend-item-avatar">
                  {f.avatar_url ? <img src={f.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{f.display_name || f.username}</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)' }}>»</span>
              </div>
            ))}
            {friends.length === 0 && (
              <div style={{ padding: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                No friends yet. <Link href="/browse">Browse users</Link> to add friends!
              </div>
            )}
          </div>

          <div className="chat-connection">
            <span>Connection</span>
            <span style={{ color: '#2e7d32', fontWeight: 700 }}>Online 🟢</span>
          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="chat-main">
          <div className="chat-header">
            {activeFriend && (
              <>
                <div className="chat-header-avatar">
                  {activeFriend.avatar_url ? <img src={activeFriend.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                </div>
                {activeFriend.display_name || activeFriend.username}
              </>
            )}
            {!activeFriend && 'Select a friend to chat'}
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40, fontSize: 13 }}>
                No messages yet. Start the conversation!
              </div>
            )}
            {messages.map(msg => {
              const isOwn = msg.sender_id === user.id;
              const sender = getProfile(msg.sender_id);
              return (
                <div key={msg.id} className={`chat-message ${isOwn ? 'own' : 'other'}`}>
                  <div className="chat-msg-bubble">{msg.content}</div>
                  <div className="chat-msg-time">{formatTime(msg.created_at)}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-bar" onSubmit={handleSend}>
            <input
              className="form-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              autoFocus
            />
            <button type="submit" className="btn btn-primary btn-sm">📨</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Link({ href, children, ...props }) {
  const NextLink = require('next/link').default;
  return <NextLink href={href} {...props}>{children}</NextLink>;
}
