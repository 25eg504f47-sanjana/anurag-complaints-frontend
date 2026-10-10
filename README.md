# Anurag University Complaint Management System: Frontend

React 18 + Vite, plain CSS. Talks to the Spring Boot API in the `anurag-complaints-backend` repository.

Students register, file complaints and read replies. Administrators filter, search, set status and reply.

## Configuration

One variable, read at build time:

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://your-backend.up.railway.app` (no trailing slash) |

For local development `.env.development` already points to `http://localhost:8080`.

## Run locally

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. Start the backend first (its default CORS setting allows this origin).

## Deploy

### Vercel (recommended)

1. Vercel > Add New > Project > import this GitHub repo. Framework preset: Vite (auto-detected).
2. Settings > Environment Variables: add `VITE_API_URL` with your Railway backend URL.
3. Deploy. `vercel.json` rewrites all paths to `index.html`, so refreshing on `/admin` works.

### Netlify (alternative)

1. Add new site > Import from Git > pick this repo. Build command `npm run build`, publish directory `dist` (already in `netlify.toml`).
2. Site settings > Environment variables: add `VITE_API_URL`.
3. Deploy. `public/_redirects` handles client-side routing.

### After deploying

Copy the frontend URL into the backend's `CORS_ORIGINS` variable on Railway. Without this the browser blocks every API call.

Changing `VITE_API_URL` requires a redeploy, because Vite inlines it at build time.
