# WHITE DENTAL CLINIC

The official website and digital platform for WHITE DENTAL CLINIC. The site presents clinic services and supports appointment requests, booking management, customer questions, and online deposits.

## Features

- Clinic homepage with services, gallery media, FAQs, and social links.
- Appointment booking with service and appointment details.
- Booking status lookup and customer booking tickets/receipts.
- PayPal deposit checkout with server-side payment verification.
- Admin sign-in and dashboard for bookings, services, media, visitor questions, and social links.
- Email confirmations, payment receipts, and admin replies.
- Supabase database and storage integration for online deployments.

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Supabase JavaScript client
- PayPal checkout integration
- Nodemailer for SMTP email
- ESLint 9

Third-party packages and services remain the property of their respective authors and are subject to their own terms and licences. Their inclusion does not imply ownership by WHITE DENTAL CLINIC.

## Requirements

- Node.js compatible with the installed Next.js version
- npm
- Supabase project for online booking, questions, and gallery storage
- PayPal account for online deposits
- SMTP account for email delivery

## Installation and development

1. Clone the repository and enter its directory:

   ```bash
   git clone https://github.com/whitedentalclinic69/WhiteDentalcClinic.git
   cd WhiteDentalcClinic
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a local environment file from the template:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env.local`.

4. Set the required values described in [Environment variables](#environment-variables). Never commit `.env.local` or put server secrets in a `NEXT_PUBLIC_` variable.

5. Start the development server:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000).

## Environment variables

Use `.env.example` as the variable-name template. Replace its placeholders with credentials from your own services; do not commit real credentials.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. `SUPABASE_URL` is also accepted by server-side code. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key used by the browser-facing gallery integration. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase key for protected database and storage operations. `SUPABASE_SECRET_KEY` is also accepted. |
| `SUPABASE_STORAGE_BUCKET` | Optional storage bucket override; defaults to `gallery-media`. |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID used by the browser checkout. |
| `PAYPAL_CLIENT_ID` | PayPal client ID for server-side API calls; the public client ID is a fallback. |
| `PAYPAL_CLIENT_SECRET` | Server-only PayPal secret. |
| `PAYPAL_BASE_URL` | PayPal API URL. Defaults to the sandbox endpoint; use `https://api-m.paypal.com` for live payments. `PAYPAL_API_BASE` is also accepted. |
| `SMTP_HOST`, `SMTP_PORT` | SMTP server and port for outgoing email. The port defaults to `587`. |
| `SMTP_USER`, `SMTP_PASS` | SMTP account credentials. |
| `EMAIL_FROM` | Optional sender identity; defaults to `SMTP_USER`. |
| `APP_URL` | Optional public base URL used in email links. Configure it for the production domain. |
| `ADMIN_ACCESS_KEY` | Required high-entropy secret protecting the admin dashboard and APIs. |

Keep Supabase service/secret keys, PayPal secrets, SMTP credentials, and the admin access key on the server only. Add production values in your hosting provider's environment-variable settings rather than in source control.

## Supabase setup

Apply the SQL files in `supabase/migrations/` in timestamp order to your Supabase project. The migrations create and secure the booking, visitor-question, social-link, and gallery storage resources. Configure the Supabase variables above before using online booking or admin features.

## Checks and production build

Run linting and create a production build:

```bash
npm run lint
npm run build
```

Run the production server locally after a successful build:

```bash
npm run start
```

## Deployment

The project can be deployed to a Next.js-compatible host such as Vercel:

1. Import the GitHub repository into the hosting provider.
2. Configure all required production environment variables in the provider's project settings.
3. Apply the Supabase migrations and configure PayPal for the desired sandbox or live environment.
4. Build with `npm run build` and serve with `npm run start` (Vercel detects the Next.js app automatically).
5. Set `APP_URL` to the public HTTPS site URL so customer email links use the production domain.

Gallery uploads on hosted deployments use Supabase Storage. Local files and local JSON-backed data should not be treated as persistent production storage.

## Repository

[https://github.com/whitedentalclinic69/WhiteDentalcClinic](https://github.com/whitedentalclinic69/WhiteDentalcClinic)

## Copyright and licence

Copyright (c) 2026 WHITE DENTAL CLINIC.

This project is distributed under the MIT License. See [LICENSE](./LICENSE) for the full licence text. The MIT licence for this project does not replace or alter the licences of third-party dependencies.
