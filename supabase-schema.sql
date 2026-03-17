-- Run this entire file in your Supabase SQL Editor

-- Profiles (auto-created when user signs up)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  avatar_url text,
  status text,
  updated_at timestamptz default now()
);

-- Circles (friend groups)
create table public.circles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_by uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- Circle members
create table public.circle_members (
  circle_id uuid references public.circles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (circle_id, user_id)
);

-- Moments (micro-updates)
create table public.moments (
  id uuid primary key default gen_random_uuid(),
  circle_id uuid references public.circles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

-- Nudges (gentle pings)
create table public.nudges (
  id uuid primary key default gen_random_uuid(),
  from_user uuid references public.profiles(id) on delete cascade,
  to_user uuid references public.profiles(id) on delete cascade,
  circle_id uuid references public.circles(id) on delete cascade,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security (keeps data private)
alter table public.profiles enable row level security;
alter table public.circles enable row level security;
alter table public.circle_members enable row level security;
alter table public.moments enable row level security;
alter table public.nudges enable row level security;

-- Profiles: visible to all logged-in users
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select using (auth.role() = 'authenticated');

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Circles: only members can see
create policy "Circle members can view their circles"
  on public.circles for select using (
    exists (
      select 1 from public.circle_members
      where circle_id = circles.id and user_id = auth.uid()
    )
  );

create policy "Authenticated users can create circles"
  on public.circles for insert with check (auth.role() = 'authenticated');

-- Circle members: members can see other members
create policy "Members can view circle membership"
  on public.circle_members for select using (
    exists (
      select 1 from public.circle_members cm
      where cm.circle_id = circle_members.circle_id and cm.user_id = auth.uid()
    )
  );

create policy "Authenticated users can join circles"
  on public.circle_members for insert with check (auth.role() = 'authenticated');

-- Moments: only circle members can see
create policy "Circle members can view moments"
  on public.moments for select using (
    exists (
      select 1 from public.circle_members
      where circle_id = moments.circle_id and user_id = auth.uid()
    )
  );

create policy "Circle members can post moments"
  on public.moments for insert with check (
    exists (
      select 1 from public.circle_members
      where circle_id = moments.circle_id and user_id = auth.uid()
    )
  );

-- Nudges: users can send and receive
create policy "Users can send nudges"
  on public.nudges for insert with check (auth.uid() = from_user);

create policy "Users can view their nudges"
  on public.nudges for select using (
    auth.uid() = from_user or auth.uid() = to_user
  );
