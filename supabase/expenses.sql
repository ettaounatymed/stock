create table if not exists public.expenses (
  id uuid primary key,
  description text not null,
  category text not null check (category in ('Import', 'Transport', 'Delivery', 'Packaging', 'Customs', 'Other')),
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null check (currency in ('EUR', 'MAD')),
  date date not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  allocation_method text not null default 'equal' check (allocation_method in ('equal', 'manual'))
);

create table if not exists public.expense_allocations (
  id uuid primary key,
  expense_id uuid not null references public.expenses(id) on delete cascade,
  product_id text not null references public.stock_records(id) on delete cascade,
  amount numeric(12, 2) not null check (amount >= 0),
  unique (expense_id, product_id)
);

-- Run this migration only if expense_allocations already existed with product_id uuid.
-- drop constraint first because PostgreSQL cannot alter a referenced foreign-key column in place.
-- alter table public.expense_allocations drop constraint if exists expense_allocations_product_id_fkey;
-- alter table public.expense_allocations alter column product_id type text using product_id::text;
-- alter table public.expense_allocations add constraint expense_allocations_product_id_fkey
--   foreign key (product_id) references public.stock_records(id) on delete cascade;

alter table public.expenses enable row level security;
alter table public.expense_allocations enable row level security;

create policy "Owner can manage expenses" on public.expenses
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "Owner can manage expense allocations" on public.expense_allocations
  for all using (auth.uid() is not null) with check (auth.uid() is not null);
