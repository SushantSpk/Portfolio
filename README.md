# Portfolio Fullstack

Full-stack portfolio CMS with a React/Vite frontend and Node.js/Express backend.

## Project Structure

```text
client/  React + Vite frontend
server/  Express API, Supabase, Resend
```

## Setup

Install the root tooling first:

```bash
npm install
```

Install frontend and backend dependencies:

```bash
npm run install:all
```

Start the full project from the root:

```bash
npm run dev
```

This runs both:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

## Useful Commands

```bash
npm run build
npm run lint
npm run start
```

Keep your environment values in `client/.env` and `server/.env`. Use the `.env.example` files as templates.
