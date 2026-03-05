# Bubu Dudu Shopping List

A shared shopping list built with Next.js App Router, React 19, and Upstash Redis.

## Features

- Shared list stored in Redis set (`shoppingList`)
- Optimistic add/remove interactions in the client
- Automatic revalidation to keep all sessions in sync
- Mobile-friendly UI with haptic feedback support

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 + shadcn/ui components
- Upstash Redis (`@upstash/redis`)

## Prerequisites

- Node.js 20+
- npm
- Upstash Redis database

## Environment Variables

Create a `.env.local` file in the project root:

```bash
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

`lib/redis.ts` uses `Redis.fromEnv()`, so both variables are required for local and deployed environments.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

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

## Deployment

Deploy on any platform that supports Next.js and environment variables. Ensure the two Upstash Redis env vars are configured in the deployment target.
