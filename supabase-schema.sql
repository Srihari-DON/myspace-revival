-- ============================================
-- MySpacerR Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text default 'New to MySpacerR! ✨',
  mood text default '😊 happy',
  avatar_url text,
  custom_html text default '',
  custom_css text default '',
  song_title text default '',
  song_artist text default '',
  online boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ============================================
-- FRIENDSHIPS
-- ============================================
create table public.friendships (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  addressee_id uuid references public.profiles(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamptz default now(),
  unique(requester_id, addressee_id)
);

alter table public.friendships enable row level security;

create policy "Friendships viewable by involved users"
  on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can create friend requests"
  on public.friendships for insert
  with check (auth.uid() = requester_id);

create policy "Addressee can update friendship status"
  on public.friendships for update
  using (auth.uid() = addressee_id or auth.uid() = requester_id);

create policy "Users can delete their friendships"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- ============================================
-- BLOG POSTS
-- ============================================
create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  mood text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.blog_posts enable row level security;

create policy "Blog posts are viewable by everyone"
  on public.blog_posts for select using (true);

create policy "Users can create their own posts"
  on public.blog_posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update their own posts"
  on public.blog_posts for update
  using (auth.uid() = author_id);

create policy "Users can delete their own posts"
  on public.blog_posts for delete
  using (auth.uid() = author_id);

-- ============================================
-- BLOG COMMENTS
-- ============================================
create table public.blog_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.blog_posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now()
);

alter table public.blog_comments enable row level security;

create policy "Comments are viewable by everyone"
  on public.blog_comments for select using (true);

create policy "Users can create comments"
  on public.blog_comments for insert
  with check (auth.uid() = author_id);

create policy "Users can delete their own comments"
  on public.blog_comments for delete
  using (auth.uid() = author_id);

-- ============================================
-- CHAT ROOMS
-- ============================================
create table public.chat_rooms (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text default '',
  created_at timestamptz default now()
);

alter table public.chat_rooms enable row level security;

create policy "Chat rooms are viewable by everyone"
  on public.chat_rooms for select using (true);

-- Insert default rooms
insert into public.chat_rooms (name, description) values
  ('🌐 General Lounge', 'Hang out with everyone'),
  ('🎵 Music Talk', 'Share your fav bands'),
  ('🎮 Gaming', 'LFG and game chat'),
  ('📸 Scene/Emo', 'Rawr XD');

-- ============================================
-- CHAT MESSAGES
-- ============================================
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.chat_rooms(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

alter table public.chat_messages enable row level security;

create policy "Chat messages are viewable by everyone"
  on public.chat_messages for select using (true);

create policy "Authenticated users can send messages"
  on public.chat_messages for insert
  with check (auth.uid() = sender_id);

-- ============================================
-- Enable Realtime for chat
-- ============================================
alter publication supabase_realtime add table public.chat_messages;

-- ============================================
-- Auto-create profile on signup (trigger)
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
