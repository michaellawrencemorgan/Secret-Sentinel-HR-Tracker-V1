<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6cbe20ff-1f8f-40b8-871c-78251d4dccb4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy with the Express API

This app must be deployed as a Node backend, not as a static Firebase Hosting
site. The tracker calls `/api/*` routes from `server.ts`; if those routes are
served by the static web fallback, login will fail because the browser receives
`index.html` instead of JSON.

Use Firebase App Hosting:

```bash
npm run deploy:apphosting
```

After deploying, verify the backend is active:

```bash
curl https://YOUR_DEPLOYED_DOMAIN/api/health
```

Expected response:

```json
{"ok":true,"service":"sentinel-express-api",...}
```

If `/api/health` returns HTML, you are viewing a static Firebase Hosting deploy
or the wrong deployed URL. Redeploy the App Hosting backend and use the App
Hosting domain/custom domain connected to that backend.
