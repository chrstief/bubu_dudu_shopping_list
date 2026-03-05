# Bubu Dudu Shopping List

A shared shopping list built with Next.js and Upstash Redis.

## Features

- Shared list stored in Redis set (`shoppingList`)
- Optimistic add/remove interactions in the client
- Automatic revalidation to keep all sessions in sync
- Mobile-friendly UI with haptic feedback support

## Tech Stack

- Next.js
- Component Library https://github.com/ekmas/neobrutalism-components
- Upstash Redis (`@upstash/redis`)
- haptic feedback https://github.com/lochie/web-haptics

## Prerequisites

- Upstash Redis database

## Local Development

Install dependencies:

```bash
npm install
```

Set up environment variables:

If your project is deployed on Vercel, you can pull the env vars with `vercel-cli` instead of copying them manually:

```bash
vercel login
vercel link
vercel env pull .env.local --environment=development
```

Otherwise, create a `.env.local` file in the project root:

```bash
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

Run the development server:

```bash
npm run dev
```

## Architecture Notes

- `app/page.tsx`: server component that loads and sorts items from Redis
- `app/items.tsx`: client component with optimistic updates and item actions
- `app/actions.ts`: server actions for add/remove/revalidate
- `app/Polling.tsx`: periodic revalidation (5s)
- `lib/redis.ts`: Redis client initialization
- `app/foodEmojis.ts`: static emoji data for placeholder rotation

## Data Model

The shopping list is stored as a Redis set under key `shoppingList`:

- Duplicates are prevented by set semantics
- Items are sorted alphabetically in the UI before render
