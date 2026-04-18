'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
  const { user, profile, loading, updateProfile } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [form, setForm] = useState({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    mood: profile?.mood || '',
    song_title: profile?.song_title || '',
    song_artist: profile?.song_artist || '',
    custom_html: profile?.custom_html || '',
  });

  if (loading) return <div className="loading-container"><div className="loading-spinner" /><div className="loading-text">Loading...</div></div>;
  if (!user) { router.push('/'); return null; }

  const handleChange = (field, value) => { setForm(prev => ({ ...prev, [field]: value })); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Account Settings</h1>

      <div className="tabs">
        {[['basic', 'Basic Info'], ['customize', 'Customize Profile'], ['song', 'Profile Song']].map(([key, label]) => (
          <button key={key} className={`tab ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </div>

      {activeTab === 'basic' && (
        <div className="section-box" style={{ borderTop: 'none', borderRadius: '0 0 4px 4px' }}>
          <div className="section-header">Edit Basic Info</div>
          <div className="section-body">
            <div className="form-group"><label className="form-label">Display Name</label><input className="form-input" value={form.display_name} onChange={e => handleChange('display_name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Username</label><input className="form-input" value={form.username} onChange={e => handleChange('username', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Bio / About Me</label><textarea className="form-textarea" value={form.bio} onChange={e => handleChange('bio', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Current Mood / Status</label><input className="form-input" value={form.mood} onChange={e => handleChange('mood', e.target.value)} placeholder="What are you up to?" /></div>
          </div>
        </div>
      )}

      {activeTab === 'customize' && (
        <div className="section-box" style={{ borderTop: 'none', borderRadius: '0 0 4px 4px' }}>
          <div className="section-header">Customize Your Profile</div>
          <div className="section-body">
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
              Use HTML to customize your profile page. Add images, colors, marquees — whatever you want!
            </p>
            <div className="editor-preview-container">
              <div>
                <label className="form-label">Custom HTML</label>
                <textarea className="form-textarea" style={{ minHeight: 260, fontFamily: 'monospace', fontSize: 12 }} value={form.custom_html} onChange={e => handleChange('custom_html', e.target.value)}
                  placeholder={'<marquee><b>Welcome to my page!</b></marquee>\n<div style="text-align:center">\n  <h2 style="color:#336699">About Me</h2>\n  <p>I love music and coding!</p>\n</div>'}
                />
              </div>
              <div>
                <label className="form-label">Preview</label>
                <div className="preview-pane" dangerouslySetInnerHTML={{ __html: form.custom_html }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'song' && (
        <div className="section-box" style={{ borderTop: 'none', borderRadius: '0 0 4px 4px' }}>
          <div className="section-header">Profile Song</div>
          <div className="section-body">
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Set the song that plays on your profile page.</p>
            <div className="form-group"><label className="form-label">Song Title</label><input className="form-input" value={form.song_title} onChange={e => handleChange('song_title', e.target.value)} placeholder="Song name" /></div>
            <div className="form-group"><label className="form-label">Artist</label><input className="form-input" value={form.song_artist} onChange={e => handleChange('song_artist', e.target.value)} placeholder="Artist name" /></div>
            {form.song_title && (
              <div className="song-player" style={{ marginTop: 12 }}>
                <div className="song-icon">▶️</div>
                <div><div className="song-title-text">{form.song_title}</div><div className="song-artist-text">{form.song_artist}</div></div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        <Link href={`/profile/${user.id}`} className="btn btn-secondary">View Profile</Link>
        {saved && <span style={{ color: '#2e7d32', fontSize: 12, fontWeight: 700 }}>✓ Changes saved!</span>}
      </div>
    </div>
  );
}
