alter table public.stock_records
  add column if not exists "buyCurrency" text not null default 'EUR'
    check ("buyCurrency" in ('EUR', 'MAD')),
  add column if not exists "buyPriceMAD" text not null default '0';