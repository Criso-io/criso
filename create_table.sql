-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends GitHub auth)
create table public.users (
    id uuid references auth.users primary key,
    email text unique not null,
    full_name text,
    github_username text,
    avatar_url text,
    stripe_customer_id text,
    stripe_subscription_id text,
    plan_type text default 'free' check (plan_type in ('free', 'pro')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Monitors table
create table public.monitors (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users not null,
    name text not null,
    url text not null,
    frequency integer not null check (frequency in (1, 5, 10, 15)), -- in minutes
    is_active boolean default true,
    last_check_at timestamp with time zone,
    last_status boolean,
    last_response_time integer, -- in milliseconds
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Monitor Checks table
create table public.monitor_checks (
    id uuid default uuid_generate_v4() primary key,
    monitor_id uuid references public.monitors not null,
    status boolean not null,
    response_time integer, -- in milliseconds
    status_code integer,
    error_message text,
    checked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Alerts table
create table public.alerts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users not null,
    monitor_id uuid references public.monitors not null,
    type text not null check (type in ('email', 'sms')),
    contact text not null, -- email or phone number
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.monitors enable row level security;
alter table public.monitor_checks enable row level security;
alter table public.alerts enable row level security;

-- Create RLS Policies
create policy "Users can view own data"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update own data"
    on public.users for update
    using (auth.uid() = id);

create policy "Users can view own monitors"
    on public.monitors for select
    using (auth.uid() = user_id);

create policy "Users can insert own monitors"
    on public.monitors for insert
    with check (auth.uid() = user_id);

create policy "Users can update own monitors"
    on public.monitors for update
    using (auth.uid() = user_id);

create policy "Users can delete own monitors"
    on public.monitors for delete
    using (auth.uid() = user_id);

-- Functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, full_name, avatar_url)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();