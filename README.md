# Nithi Collection - Unified Full-Stack Next.js 16 Application

A unified full-stack e-commerce web application with customer storefront and advanced admin management console, fully deployable on **Vercel**.

---

## 🚀 Features

- **Next.js 16 App Router & Serverless API Routes**: Unified backend and frontend in a single repository.
- **Mongoose / MongoDB Integration**: Cached singleton pattern designed for serverless environments (e.g. MongoDB Atlas on Vercel).
- **Storefront & Customer Flow**:
  - Catalogue browsing, category filters, product details, interactive image galleries.
  - Cart, wishlist, and checkout with support for COD, Free Shipping thresholds, and combos.
- **Admin Management Console**:
  - Live inventory tracking, audit logs, order status management.
  - Storage usage monitoring (90% capacity warnings and email alerts).
  - Excel backup export and import validation.
  - Category, combo offer, and COD rule configurations.

---

## 🛠️ Environment Variables

Create a `.env.local` file (or configure environment variables in your Vercel Project Settings):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nithi_collection?retryWrites=true&w=majority
JWT_SECRET=super_secret_nithi_key_2026
ADMIN_EMAIL=admin@nithicollection.com
ADMIN_PASSWORD=adminpassword123
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@nithicollection.com
SMTP_PASS=your_app_password
SMTP_FROM=no-reply@nithicollection.com
```

---

## 📦 Deployment to Vercel

1. Push this repository to GitHub/GitLab.
2. Import the project in [Vercel](https://vercel.com).
3. Set the Root Directory to `nithi-nextjs` (or leave default if the repository root is this folder).
4. Add the environment variables specified above in the Vercel Dashboard under **Project Settings > Environment Variables**.
5. Deploy! Vercel will automatically build the Next.js app and deploy all API routes as Serverless Functions.

---

## 💻 Local Development

```bash
cd nithi-nextjs
npm install
npm run dev
```

Visit `http://localhost:3000` to access the application.
