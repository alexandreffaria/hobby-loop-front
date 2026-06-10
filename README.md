# hobby-loop-front

React 19 + TypeScript frontend for HobbyLoop.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

Create `.env.local` in the project root:

```
VITE_API_URL=http://localhost:3001
```

> Adjust the URL if the core API runs on a different port.

## Run

```bash
npm run dev      # dev server → http://localhost:5173
npm run build    # production build
npm run preview  # preview production build locally
npm run lint     # ESLint
```

## Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · TanStack Query v5 · React Router v7 · Axios
