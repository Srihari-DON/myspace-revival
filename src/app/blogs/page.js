'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BlogsPage() {
  const { user, loading, getBlogs, getProfile, createBlog, addComment, getFriends } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState('top');
  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState('');

  if (loading) return <div className="loading-container"><div className="loading-spinner" /><div className="loading-text">Loading...</div></div>;
  if (!user) { router.push('/'); return null; }

  const allBlogs = getBlogs();
  const myBlogs = getBlogs(user.id);
  const friends = getFriends(user.id);
  const friendIds = friends.map(f => f.id);
  const feedBlogs = allBlogs.filter(b => friendIds.includes(b.author_id) || b.author_id === user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const displayBlogs = activeView === 'subscriptions' ? feedBlogs : activeView === 'mine' ? myBlogs : allBlogs;

  const handlePost = () => {
    if (!title.trim() || !body.trim()) return;
    createBlog(title, body, mood);
    setTitle(''); setBody(''); setMood(''); setShowCompose(false);
  };

  const timeAgo = (dateStr) => {
    const d = new Date(dateStr);
    const diff = Math.floor((new Date() - d) / 1000);
    const days = Math.floor(diff / 86400);
    if (days === 0) return 'today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  return (
    <div className="page-container">
      <div className="blogs-layout">
        {/* SIDEBAR */}
        <div className="blogs-sidebar">
          <button className="btn btn-primary btn-block" onClick={() => setShowCompose(!showCompose)} style={{ marginBottom: 12 }}>
            ✏️ New Blog Entry
          </button>

          <div className="blogs-sidebar-title">View:</div>
          <a href="#" onClick={e => { e.preventDefault(); setActiveView('top'); }} style={{ fontWeight: activeView === 'top' ? 700 : 400 }}>⭐ Top Entries</a>
          <a href="#" onClick={e => { e.preventDefault(); setActiveView('subscriptions'); }} style={{ fontWeight: activeView === 'subscriptions' ? 700 : 400 }}>📰 Subscriptions</a>
          <a href="#" onClick={e => { e.preventDefault(); setActiveView('mine'); }} style={{ fontWeight: activeView === 'mine' ? 700 : 400 }}>👤 My Entries</a>

          <div className="blogs-sidebar-title" style={{ marginTop: 16 }}>Categories:</div>
          {['Life', 'Music', 'Friends', 'Games', 'Art', 'Movies, TV', 'News', 'School', 'Fashion', 'Food', 'Dreams', 'Goals'].map(cat => (
            <a key={cat} href="#" onClick={e => e.preventDefault()}>{cat}</a>
          ))}
        </div>

        {/* MAIN */}
        <div className="blogs-main">
          {/* Search */}
          <div className="section-box" style={{ marginBottom: 16 }}>
            <div className="section-body" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Search Blog Entries:</span>
              <input className="form-input" style={{ flex: 1 }} placeholder="" />
              <button className="btn btn-secondary btn-sm">Search</button>
            </div>
          </div>

          <h1 className="page-title">Blogs</h1>

          {/* Compose */}
          {showCompose && (
            <div className="section-box" style={{ marginBottom: 16 }}>
              <div className="section-header">New Blog Entry</div>
              <div className="section-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Blog post title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Body (HTML supported)</label>
                  <textarea className="form-textarea" style={{ minHeight: 160 }} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your blog post..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Category/Mood (optional)</label>
                  <input className="form-input" value={mood} onChange={e => setMood(e.target.value)} placeholder="e.g. Life, Music" />
                </div>
                {body && (
                  <div style={{ marginBottom: 12 }}>
                    <label className="form-label">Preview:</label>
                    <div className="preview-pane" dangerouslySetInnerHTML={{ __html: body }} />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={handlePost}>Publish</button>
                  <button className="btn btn-secondary" onClick={() => setShowCompose(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Top Blog Entries header */}
          <div className="section-box" style={{ marginBottom: 4 }}>
            <div className="section-header">
              {activeView === 'top' ? 'Top Blog Entries' : activeView === 'subscriptions' ? 'Your Subscriptions' : 'My Entries'}
            </div>
          </div>

          {/* Blog Entries */}
          {displayBlogs.length === 0 && (
            <div className="section-box">
              <div className="section-body" style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {activeView === 'mine' ? 'You haven\'t written any entries yet.' : 'No entries found.'}
              </div>
            </div>
          )}

          {displayBlogs.map(blog => (
            <BlogEntry key={blog.id} blog={blog} getProfile={getProfile} addComment={addComment} userId={user.id} timeAgo={timeAgo} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogEntry({ blog, getProfile, addComment, userId, timeAgo }) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const author = getProfile(blog.author_id);
  const comments = blog.comments || [];

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(blog.id, commentText);
    setCommentText('');
  };

  return (
    <div className="blog-entry">
      <div className="blog-entry-header">
        <span>{timeAgo(blog.created_at)}</span>
        <span>— by <strong><Link href={`/profile/${blog.author_id}`}>{author?.display_name || 'Unknown'}</Link></strong></span>
        {comments.length > 0 && <span>— {comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>}
        {blog.mood && <span>— {blog.mood}</span>}
      </div>
      <div className="blog-entry-body">
        <div className="blog-entry-title">{blog.title}</div>
        {blog.mood && <div className="blog-entry-category">Category: <Link href="#">{blog.mood}</Link></div>}
        <div className="blog-entry-content" dangerouslySetInnerHTML={{ __html: blog.body }} />
      </div>
      <div className="blog-entry-footer">
        <a href="#" onClick={e => { e.preventDefault(); setShowComments(!showComments); }}>
          💬 {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </a>
        <span>» <Link href={`/profile/${blog.author_id}`}>View Blog Entry</Link></span>
      </div>
      {showComments && (
        <div>
          {comments.map(c => {
            const commenter = getProfile(c.author_id);
            return (
              <div key={c.id} className="blog-comment">
                <div className="friend-card-avatar" style={{ width: 28, height: 28, fontSize: 12 }}>👤</div>
                <div>
                  <strong style={{ color: 'var(--text-link)', fontSize: 11 }}>{commenter?.display_name || 'Anon'}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}> — {timeAgo(c.created_at)}</span>
                  <div style={{ fontSize: 12 }}>{c.body}</div>
                </div>
              </div>
            );
          })}
          <form className="comment-form" onSubmit={handleComment}>
            <input className="form-input" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Write a comment..." />
            <button type="submit" className="btn btn-primary btn-sm">Post</button>
          </form>
        </div>
      )}
    </div>
  );
}
