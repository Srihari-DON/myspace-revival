'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isDemoMode } from '@/lib/supabase';

// Demo data for when Supabase isn't configured
const DEMO_USERS = [
  {
    id: 'demo-user-1',
    email: 'tom@myspacer.com',
    username: 'Tom',
    display_name: '✨ Tom ✨',
    bio: 'Welcome to MySpacerR! I\'m your first friend. 🎸',
    mood: '🎵 Rocking out',
    avatar_url: null,
    custom_html: '<marquee><b>Thanks for joining MySpacerR!</b></marquee>',
    custom_css: '',
    song_title: 'Welcome to the Black Parade',
    song_artist: 'My Chemical Romance',
    online: true,
    created_at: '2005-08-01T00:00:00Z',
  },
  {
    id: 'demo-user-2',
    email: 'scene_queen@myspacer.com',
    username: 'xX_SceneQueen_Xx',
    display_name: '♡ SceneQueen ♡',
    bio: 'rawr XD means I love u in dinosaur!! 🦕💕 PC4PC? add me!',
    mood: '💀 feeling emo',
    avatar_url: null,
    custom_html: '<div style="text-align:center"><h2 style="color:#ff69b4">♡ About Me ♡</h2><p>music is my life!! 🎶</p><p>bands: MCR, FOB, P!ATD, BMTH</p></div>',
    custom_css: '',
    song_title: 'Sugar We\'re Going Down',
    song_artist: 'Fall Out Boy',
    online: true,
    created_at: '2006-03-15T00:00:00Z',
  },
  {
    id: 'demo-user-3',
    email: 'sk8rboi@myspacer.com',
    username: 'sk8r_boi_2005',
    display_name: '🛹 Sk8r Boi',
    bio: 'He was a sk8r boi, she said see ya later boi 🤘',
    mood: '🛹 shredding',
    avatar_url: null,
    custom_html: '<div style="background:linear-gradient(45deg,#000,#333);padding:20px;border-radius:10px"><p style="color:#0f0;font-family:monospace">// skateboarding is not a crime</p></div>',
    custom_css: '',
    song_title: 'All The Small Things',
    song_artist: 'Blink-182',
    online: false,
    created_at: '2005-11-20T00:00:00Z',
  },
];

const DEMO_BLOGS = [
  {
    id: 'blog-1',
    author_id: 'demo-user-1',
    title: 'Welcome to MySpacerR!! 🎉',
    body: `<p>Hey everyone!</p>
<p>Welcome to the BEST social network EVER! I'm Tom, and I'm here to be your first friend.</p>
<p>Here's what you can do:</p>
<ul>
<li>✨ Customize your profile with HTML!</li>
<li>📝 Write blog posts</li>
<li>💬 Chat with friends</li>
<li>🤝 Add friends to your Top 8</li>
</ul>
<p>Have fun and <b>stay scene!</b> 🎸</p>`,
    mood: '🎉 excited',
    created_at: '2005-08-01T12:00:00Z',
    comments: [
      { id: 'c1', author_id: 'demo-user-2', body: 'OMG this is so cool!! tysm Tom!! 💕', created_at: '2005-08-01T13:00:00Z' },
      { id: 'c2', author_id: 'demo-user-3', body: 'sick!! this place rules 🤘', created_at: '2005-08-01T14:00:00Z' },
    ],
  },
  {
    id: 'blog-2',
    author_id: 'demo-user-2',
    title: 'new hair who dis?? 💇‍♀️✨',
    body: `<p>Just got my hair done!! It's like half black half pink and I got the SICKEST side bangs ever.</p>
<p>My mom said I look like a raccoon but whatever she doesn't understand the scene lifestyle 😤</p>
<p>Anyway if anyone wants to trade graphics or PC4PC hmu!! ♡</p>
<p style="color:#ff69b4"><i>~ rawr means I love u in dinosaur ~</i></p>`,
    mood: '💅 fabulous',
    created_at: '2006-03-20T15:00:00Z',
    comments: [
      { id: 'c3', author_id: 'demo-user-1', body: 'Looks awesome! 🎸', created_at: '2006-03-20T16:00:00Z' },
    ],
  },
  {
    id: 'blog-3',
    author_id: 'demo-user-3',
    title: 'LANDED MY FIRST KICKFLIP!!! 🛹🔥',
    body: `<p>DUDE. I finally landed a kickflip today at the skate park.</p>
<p>Been trying for like 3 MONTHS and today it just clicked.</p>
<p>Tony Hawk would be proud. 😎</p>
<p>Also went to Hot Topic after and got a sick new belt with studs on it.</p>`,
    mood: '🔥 stoked',
    created_at: '2005-12-01T18:00:00Z',
    comments: [],
  },
];

const DEMO_FRIENDSHIPS = [
  { id: 'f1', requester_id: 'demo-user-1', addressee_id: 'demo-user-2', status: 'accepted' },
  { id: 'f2', requester_id: 'demo-user-1', addressee_id: 'demo-user-3', status: 'accepted' },
  { id: 'f3', requester_id: 'demo-user-2', addressee_id: 'demo-user-3', status: 'accepted' },
];

const DEMO_MESSAGES = [
  { id: 'm1', room_id: 'room-1', sender_id: 'demo-user-1', content: 'Hey everyone! Welcome to MySpacerR chat! 🎉', created_at: '2005-08-01T12:00:00Z' },
  { id: 'm2', room_id: 'room-1', sender_id: 'demo-user-2', content: 'omg hiii!! this is so cool rawr XD 💕', created_at: '2005-08-01T12:01:00Z' },
  { id: 'm3', room_id: 'room-1', sender_id: 'demo-user-3', content: 'yo whats up!! 🤘', created_at: '2005-08-01T12:02:00Z' },
  { id: 'm4', room_id: 'room-1', sender_id: 'demo-user-1', content: 'Not much! Just setting up profiles. Have you customized yours yet?', created_at: '2005-08-01T12:03:00Z' },
  { id: 'm5', room_id: 'room-1', sender_id: 'demo-user-2', content: 'YES!! I added a marquee and everything!! check it out!!! ✨', created_at: '2005-08-01T12:04:00Z' },
];

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProfiles, setAllProfiles] = useState(DEMO_USERS);
  const [blogs, setBlogs] = useState(DEMO_BLOGS);
  const [friendships, setFriendships] = useState(DEMO_FRIENDSHIPS);
  const [messages, setMessages] = useState(DEMO_MESSAGES);

  useEffect(() => {
    if (isDemoMode) {
      // Auto-login as Tom in demo mode
      const demoUser = DEMO_USERS[0];
      setUser({ id: demoUser.id, email: demoUser.email });
      setProfile(demoUser);
      setLoading(false);
      return;
    }

    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    if (isDemoMode) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data);
  };

  const signUp = async (email, password, username) => {
    if (isDemoMode) {
      const newUser = {
        id: `demo-user-${Date.now()}`,
        email,
        username,
        display_name: username,
        bio: 'New to MySpacerR! ✨',
        mood: '😊 happy',
        avatar_url: null,
        custom_html: '',
        custom_css: '',
        song_title: '',
        song_artist: '',
        online: true,
        created_at: new Date().toISOString(),
      };
      setAllProfiles(prev => [...prev, newUser]);
      setUser({ id: newUser.id, email });
      setProfile(newUser);
      // Auto-friend with Tom
      setFriendships(prev => [...prev, {
        id: `f-${Date.now()}`,
        requester_id: 'demo-user-1',
        addressee_id: newUser.id,
        status: 'accepted'
      }]);
      return { error: null };
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    if (data?.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: username,
        bio: 'New to MySpacerR! ✨',
        mood: '😊 happy',
      });
      if (profileError) return { error: profileError };
    }
    return { error: null };
  };

  const signIn = async (email, password) => {
    if (isDemoMode) {
      const found = allProfiles.find(p => p.email === email);
      if (found) {
        setUser({ id: found.id, email: found.email });
        setProfile(found);
        return { error: null };
      }
      return { error: { message: 'User not found. Try signing up!' } };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    if (isDemoMode) {
      setUser(null);
      setProfile(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    if (isDemoMode) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      setAllProfiles(prev => prev.map(p => p.id === user.id ? updated : p));
      return { error: null };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    if (!error) {
      setProfile(prev => ({ ...prev, ...updates }));
    }
    return { error };
  };

  const getProfile = useCallback((userId) => {
    if (isDemoMode) {
      return allProfiles.find(p => p.id === userId) || null;
    }
    return null; // Will be fetched from supabase directly
  }, [allProfiles]);

  const getAllProfiles = useCallback(() => {
    return allProfiles;
  }, [allProfiles]);

  const getFriends = useCallback((userId) => {
    const userFriendships = friendships.filter(
      f => f.status === 'accepted' && (f.requester_id === userId || f.addressee_id === userId)
    );
    return userFriendships.map(f => {
      const friendId = f.requester_id === userId ? f.addressee_id : f.requester_id;
      return allProfiles.find(p => p.id === friendId);
    }).filter(Boolean);
  }, [friendships, allProfiles]);

  const addFriend = useCallback((targetId) => {
    if (!user) return;
    const existing = friendships.find(
      f => (f.requester_id === user.id && f.addressee_id === targetId) ||
           (f.requester_id === targetId && f.addressee_id === user.id)
    );
    if (existing) return;
    setFriendships(prev => [...prev, {
      id: `f-${Date.now()}`,
      requester_id: user.id,
      addressee_id: targetId,
      status: 'accepted'
    }]);
  }, [user, friendships]);

  const removeFriend = useCallback((targetId) => {
    if (!user) return;
    setFriendships(prev => prev.filter(
      f => !((f.requester_id === user.id && f.addressee_id === targetId) ||
             (f.requester_id === targetId && f.addressee_id === user.id))
    ));
  }, [user]);

  const isFriend = useCallback((targetId) => {
    if (!user) return false;
    return friendships.some(
      f => f.status === 'accepted' &&
        ((f.requester_id === user.id && f.addressee_id === targetId) ||
         (f.requester_id === targetId && f.addressee_id === user.id))
    );
  }, [user, friendships]);

  // Blog functions
  const getBlogs = useCallback((userId) => {
    if (userId) {
      return blogs.filter(b => b.author_id === userId);
    }
    return blogs;
  }, [blogs]);

  const getFeedBlogs = useCallback(() => {
    if (!user) return [];
    const friends = getFriends(user.id);
    const friendIds = friends.map(f => f.id);
    return blogs
      .filter(b => friendIds.includes(b.author_id) || b.author_id === user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [user, blogs, getFriends]);

  const createBlog = useCallback((title, body, mood) => {
    if (!user) return;
    const newBlog = {
      id: `blog-${Date.now()}`,
      author_id: user.id,
      title,
      body,
      mood: mood || '',
      created_at: new Date().toISOString(),
      comments: [],
    };
    setBlogs(prev => [newBlog, ...prev]);
    return newBlog;
  }, [user]);

  const addComment = useCallback((blogId, body) => {
    if (!user) return;
    setBlogs(prev => prev.map(b => {
      if (b.id === blogId) {
        return {
          ...b,
          comments: [...(b.comments || []), {
            id: `c-${Date.now()}`,
            author_id: user.id,
            body,
            created_at: new Date().toISOString(),
          }]
        };
      }
      return b;
    }));
  }, [user]);

  // Chat functions
  const getMessages = useCallback((roomId) => {
    return messages.filter(m => m.room_id === (roomId || 'room-1'));
  }, [messages]);

  const sendMessage = useCallback((content, roomId) => {
    if (!user) return;
    const newMsg = {
      id: `m-${Date.now()}`,
      room_id: roomId || 'room-1',
      sender_id: user.id,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  }, [user]);

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    getProfile,
    getAllProfiles,
    getFriends,
    addFriend,
    removeFriend,
    isFriend,
    getBlogs,
    getFeedBlogs,
    createBlog,
    addComment,
    getMessages,
    sendMessage,
    isDemoMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
