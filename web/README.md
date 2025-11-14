This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js >= 20.9
- Access to a WordPress installation with GraphQL enabled

### Installation

1. Install dependencies:

```bash
cd web
npm ci
```

2. Create a `.env.local` file in the `web/` directory with the following variables:

```bash
# Public GraphQL endpoint
NEXT_PUBLIC_WORDPRESS_GRAPHQL=https://your-wordpress-site.com/graphql

# Preview mode credentials (server-side only, not exposed to browser)
PREVIEW_USER=your-wp-username
PREVIEW_APP_PASSWORD=your-wp-application-password
PREVIEW_SECRET=your-random-secret-string
```

**Important:** Do not commit the `.env.local` file to version control.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Preview Mode

This project includes server-side preview helpers for WordPress draft content:

- **Enable preview mode:** Visit `http://localhost:3000/api/preview?secret=<PREVIEW_SECRET>&slug=/`
  - Replace `<PREVIEW_SECRET>` with your `PREVIEW_SECRET` from `.env.local`
  - The `slug` parameter is optional and defaults to `/`
  
- **Preview proxy API:** Use `/api/preview-proxy` to make authenticated GraphQL requests from the browser without exposing credentials

The preview functionality uses Next.js Draft Mode (App Router) to securely access draft content from WordPress.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
