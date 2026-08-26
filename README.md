This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase setup

1. Create a Supabase project and open the SQL editor.
2. Create two tables:
   - `stock_records(id text primary key, productName text, category text, sourceCountry text, purchaseDate text, saleDate text, buyPriceEUR text, euroRate text, salePriceMAD text, notes text, imei text, status text)`
   - `euro_purchases(id text primary key, purchaseDate text, euroAmount text, euroPriceMAD text, notes text)`
3. Copy the project URL and anon key into `.env.local` using `.env.example` as the template.
4. Add the owner email to `.env.local` so the existing owner account keeps edit access:

    ```env
    NEXT_PUBLIC_OWNER_EMAIL=owner@example.com
    ```

5. In Supabase, open the owner user and set its `app_metadata` to `{"role":"owner"}`. Create the second user from **Authentication > Users > Add user** with the email and password they will use on the iPhone. Do not give this second account the `owner` app metadata role.
6. Execute these policies in the SQL editor. They allow every signed-in account to read, while only the owner can write:

    ```sql
    alter table public.stock_records enable row level security;
    alter table public.euro_purchases enable row level security;

    create policy "authenticated users can read products"
       on public.stock_records for select to authenticated using (true);
    create policy "authenticated users can read euro purchases"
       on public.euro_purchases for select to authenticated using (true);

    create policy "owner can write products"
       on public.stock_records for all to authenticated
       using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
       with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
    create policy "owner can write euro purchases"
       on public.euro_purchases for all to authenticated
       using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner')
       with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner');
    ```

7. Sign in once with the owner account to confirm editing, then sign in on the iPhone with the new account. The reader will see only Products, Statistics, and Purchase History.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
