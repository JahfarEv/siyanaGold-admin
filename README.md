# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Admin image uploads

The admin app uploads product, category, offer, and home carousel images through
the Cloudflare Worker in `upload-worker/`. The Worker verifies the Firebase ID
token and restricts uploads to the emails in its `ADMIN_EMAILS` allowlist before
writing to the `siyana-images` R2 bucket.

1. Configure `upload-worker/wrangler.toml` with the admin site's origin(s), the
   Firebase Web API key, the allowed admin email addresses, and the public R2
   custom-domain base URL. Configure that domain to serve the `siyana-images`
   bucket. The Worker reads `ALLOWED_ORIGINS`, `FIREBASE_API_KEY`,
   `ADMIN_EMAILS`, and `PUBLIC_BASE` from this file. `FIREBASE_API_KEY` must
   match `VITE_FIREBASE_API_KEY` from the admin app's `.env`, and `ADMIN_EMAILS`
   must include the exact email address used to sign in to the admin app.
2. Deploy the Worker from `admin/upload-worker` with `npx wrangler deploy`.
3. Set `VITE_R2_UPLOAD_URL` in `admin/.env` to the deployed Worker URL, with
   `/upload` appended, then rebuild the admin app. See `.env.example`.

Uploads are limited to supported image formats and 10 MB per file.

For a 401, make sure the deployed Worker is running the current
`upload-worker/src/index.js`, `FIREBASE_API_KEY` belongs to the same Firebase
project as the admin app, and the signed-in session is valid; then redeploy the
Worker and sign out and back in. A Firebase API key configuration problem
returns 500. A 403 means the request origin is not in `ALLOWED_ORIGINS`, or the
signed-in account email is not in `ADMIN_EMAILS`.

The admin app's `.env` variables do not configure the deployed Worker. Update
the Worker variables in `wrangler.toml` (replace all example placeholders),
then deploy again. To set the Firebase Web API key as a Worker secret instead
of storing it in `wrangler.toml`, run `npx wrangler secret put FIREBASE_API_KEY`
from `admin/upload-worker` and provide the key for the same Firebase project as
the admin app; remove the `FIREBASE_API_KEY` entry from `[vars]` in
`wrangler.toml` when using the secret.
