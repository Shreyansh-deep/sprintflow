# Deployment Guide

This guide will help you deploy SprintFlow to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. **MongoDB Database** - Either:
   - Local MongoDB instance
   - MongoDB Atlas (cloud) - [Get free cluster](https://www.mongodb.com/cloud/atlas)
   
2. **Environment Variables**:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A strong secret key (32+ characters)

## Generate JWT Secret

You can generate a secure JWT secret using:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Platform-Specific Deployment

### 🚀 Vercel (Recommended for Next.js)

Vercel is the recommended platform for Next.js applications.

#### Option 1: GitHub Integration (Easiest)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add:
     - `MONGODB_URI` = Your MongoDB connection string
     - `JWT_SECRET` = Your generated secret key
   - Select environment: Production, Preview, Development
   - Click "Save"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# Deploy to production
vercel --prod
```

### 🌐 Netlify

1. **Build settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment variables**
   - Add in Netlify dashboard → Site settings → Environment variables

3. **Deploy**
   - Connect GitHub repository
   - Netlify will auto-deploy on push

### 🚂 Railway

1. **Create new project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure**
   - Select your repository
   - Add environment variables in project settings

3. **Deploy**
   - Railway will auto-detect and deploy

### 🐳 Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

Update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
};
```

## CI/CD with GitHub Actions

The repository includes GitHub Actions workflows:

### Continuous Integration (`.github/workflows/ci.yml`)

- Runs on every push and pull request
- Tests build on Node.js 18.x and 20.x
- Runs linting and type checking
- Verifies successful build

### Deployment (`.github/workflows/deploy.yml`)

- Runs on push to main/master branch
- Builds the application
- Deploys to Vercel (if configured)

### Setup GitHub Secrets

For automated deployment, add these secrets in GitHub repository settings:

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Add:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `VERCEL_TOKEN` - (Optional) For Vercel deployment
   - `VERCEL_ORG_ID` - (Optional) For Vercel deployment
   - `VERCEL_PROJECT_ID` - (Optional) For Vercel deployment

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test user registration
- [ ] Test user login
- [ ] Create a test project
- [ ] Create a test issue
- [ ] Verify MongoDB connection is working
- [ ] Check application logs for errors
- [ ] Test on mobile devices (responsive design)

## Troubleshooting

### Build Fails

- Check that all environment variables are set
- Verify Node.js version (requires 18.x or higher)
- Check build logs for specific errors

### Database Connection Issues

- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (if using Atlas)
- Ensure MongoDB is accessible from your deployment platform

### Authentication Not Working

- Verify `JWT_SECRET` is set
- Check cookie settings in production
- Ensure HTTPS is enabled (cookies require secure in production)

### Environment Variables Not Loading

- Restart the application after adding variables
- Verify variable names match exactly (case-sensitive)
- Check platform-specific documentation for variable injection

## Monitoring

Consider setting up:

- **Application Logs** - Monitor errors and performance
- **Database Monitoring** - Track MongoDB performance
- **Error Tracking** - Use services like Sentry
- **Analytics** - Track user engagement (optional)

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use strong JWT_SECRET** - minimum 32 characters
3. **Enable HTTPS** - always use HTTPS in production
4. **MongoDB Security**:
   - Use strong database passwords
   - Enable IP whitelisting in MongoDB Atlas
   - Use connection string with authentication
5. **Keep dependencies updated** - regularly run `npm audit`

## Support

For deployment issues, check:
- Platform-specific documentation
- Next.js deployment docs: https://nextjs.org/docs/deployment
- MongoDB Atlas connection guide

