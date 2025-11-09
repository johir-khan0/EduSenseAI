# EduSense AI — Developer Setup

This repository is a React + Vite frontend that uses AI providers (Gemini by default) to power tutoring and content generation features.

This README explhains how to run te project locally, keep secrets safe, and prepare the repository for publishing to GitHub.

## Quick links

- Development: http://localhost:3000/

## Prerequisites

- Node.js 
- npm (or your preferred package manager)

## Setup (local development)

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Create your local env file by copying the example and filling in secrets:

   ```bash
   cp .env.example .env.local
   # then edit .env.local and add your real keys
   ```

   - The repository includes `.env.example` and `.env.local.example` showing the variables used by the app. Never commit `.env.local` to Git.

3. Run the dev server:

   ```powershell
   npm.cmd run dev
   ```

   > Note for Windows PowerShell: if you get an error about `npm.ps1` execution policy, use `npm.cmd run dev` or run PowerShell as administrator and set an appropriate ExecutionPolicy.

## What to do before pushing to GitHub (security)

1. Confirm `.gitignore` contains entries for environment files (this repo already ignores `.env` and `.env.local`).
2. Do NOT commit real API keys. Use `.env.local` locally and add any necessary CI/deployment secrets through GitHub Secrets.
3. If you need server-side calls to AI providers (recommended), keep keys on the server and use a server-side proxy endpoint. See "Recommended production setup" below.

## Recommended production setup (secure)

- Move any direct AI provider calls out of client-side code into a small server API (Express, serverless function, etc.). The server holds the API key and performs requests to the AI provider.
- Protect the server endpoint with authentication/ratelimiting if it will be publicly accessible.
- Store the server's API keys in environment variables or your cloud provider's secrets manager (do not commit them).

## GitHub Actions — CI (included)

The repository contains a basic CI workflow (`.github/workflows/ci.yml`) that runs `npm ci` and builds the app to catch build errors before merging.

If your workflow needs access to secrets for integration tests, add them to the repository or organization Secrets in GitHub and reference them in the workflow.

## Mocking and local development without keys

- If you want to run the UI without a real provider key, use the mock provider (for local dev). See `lib/ai` for a mock provider implementation.

## Deploying

- Build the project:

  ```powershell
  npm run build
  ```

- Deploy the `dist/` output to your hosting platform (Netlify, Vercel, GitHub Pages, etc.). If you rely on server-side AI calls, deploy that server separately (or as serverless functions) so it can keep secrets private.

## Troubleshooting

- If AI features don't work in the browser: check the browser DevTools Console and Network tab for errors (CORS/401/403). This is usually because the app is attempting to use a server-side SDK from the client or the key is missing/exposed incorrectly. Prefer a server-side proxy.
- If TypeScript reports missing types for `@google/genai`, install types or rely on the included ambient declaration file at `types/google-genai.d.ts`.

## Contributing

- Create a branch, make changes, run `npm install` and `npm run build` to ensure no errors, then open a PR.

## Questions or help

If you'd like, I can:

- Add a minimal server proxy (`/server` or Express app) that forwards AI requests securely.
- Add more CI steps (lint, test) to the GitHub Actions workflow.

---

_This README was generated and updated to help prepare the repository for GitHub while keeping secrets secure._
