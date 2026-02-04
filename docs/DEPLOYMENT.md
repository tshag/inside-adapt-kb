# Deployment Guide

This guide covers deploying the Adapt Psychiatry Knowledge Base to production.

## Prerequisites

- Google OAuth credentials configured
- Domain name (optional but recommended)
- Hosting platform account (Vercel recommended)

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Configure consent screen:
   - User Type: Internal
   - App name: "Adapt Psychiatry KB"
   - User support email: your admin email
   - Authorized domains: `adaptwny.com`
6. Create OAuth client ID:
   - Application type: Web application
   - Name: "Adapt KB Production"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-domain.com/api/auth/callback/google` (production)
7. Save Client ID and Client Secret

## Vercel Deployment (Recommended)

### 1. Prepare Repository

```bash
# Initialize git if not already
git init
git add .
git commit -m "Initial commit"

# Push to GitHub/GitLab/Bitbucket
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click **Add New Project**
3. Import your Git repository
4. Configure project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: (leave default)
5. Add Environment Variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your production URL)
6. Click **Deploy**

### 3. Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings > Domains**
2. Add your domain (e.g., `kb.adaptwny.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` with your custom domain
5. Add custom domain to Google OAuth redirect URIs

## Alternative: Self-Hosted

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t adapt-kb .
docker run -p 3000:3000 \
  -e GOOGLE_CLIENT_ID=xxx \
  -e GOOGLE_CLIENT_SECRET=xxx \
  -e NEXTAUTH_SECRET=xxx \
  -e NEXTAUTH_URL=http://localhost:3000 \
  adapt-kb
```

## Environment-Specific Configuration

### Development

```env
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Staging

```env
NEXTAUTH_URL=https://staging.adaptwny.com
NODE_ENV=production
```

### Production

```env
NEXTAUTH_URL=https://kb.adaptwny.com
NODE_ENV=production
```

## Post-Deployment Checklist

- [ ] Verify Google OAuth sign-in works
- [ ] Test domain restriction (non-@adaptwny.com should be blocked)
- [ ] Test billing access (billing team can access billing content)
- [ ] Verify non-billing users cannot access billing content
- [ ] Test search functionality
- [ ] Verify navigation works correctly
- [ ] Check that 403/404 pages display correctly
- [ ] Confirm CSP headers are set
- [ ] Verify robots.txt blocks indexing

## Troubleshooting

### OAuth Redirect Errors

1. Verify redirect URI in Google Cloud Console matches exactly
2. Check `NEXTAUTH_URL` is set correctly
3. Ensure no trailing slashes in URLs

### Database Errors

1. Run `npx prisma generate`
2. Run `npx prisma db push`
3. Check `DATABASE_URL` is correct

### Build Failures

1. Clear `.next` directory: `rm -rf .next`
2. Delete `node_modules`: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

## Updates and Maintenance

### Deploying Updates

1. Make changes locally
2. Test in development
3. Commit and push to repository
4. Vercel will auto-deploy

### Rolling Back

In Vercel dashboard:
1. Go to **Deployments**
2. Find previous working deployment
3. Click **...** > **Promote to Production**

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] Google OAuth credentials are production-specific
- [ ] Environment variables are not in code
- [ ] Custom domain uses HTTPS
- [ ] `NODE_ENV=production` in production
- [ ] Database is backed up regularly
