# Deployment Guide for infogra.tech

## Option 1: Vercel (Recommended)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository: `C0deAlchemist17/infogra`
4. Vercel will automatically detect Next.js
5. Click "Deploy"

### Step 2: Configure Custom Domain
1. After deployment, go to Project Settings → Domains
2. Add domain: `infogra.tech`
3. Vercel will provide DNS records to add

### Step 3: Update DNS Records
Add these records to your domain registrar (where you bought infogra.tech):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 4: Environment Variables
In Vercel Project Settings → Environment Variables:
```
NEXT_PUBLIC_SITE_URL = https://infogra.tech
```

## Option 2: Netlify

### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. "Add new site" → "Import an existing project"
3. Connect to GitHub and select `C0deAlchemist17/infogra`
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Install command: `npm install`

### Step 2: Configure Custom Domain
1. Site settings → Domain management
2. Add `infogra.tech`
3. Update DNS records as provided by Netlify

## Option 3: VPS/Server Deployment

### Prerequisites
- Node.js 18+ installed
- Nginx or Apache
- PM2 for process management

### Steps
```bash
# Clone repository
git clone https://github.com/C0deAlchemist17/infogra.git
cd infogra

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "infogra" -- start

# Configure Nginx reverse proxy
# Point domain to server IP
```

## Post-Deployment Checklist

- [ ] Website loads at https://infogra.tech
- [ ] SSL certificate is active
- [ ] All pages are accessible
- [ ] Three.js animations work
- [ ] PC Builder functions correctly
- [ ] AI Assistant responds
- [ ] Contact form submits
- [ ] Images load properly
- [ ] Mobile responsive design works

## Environment Variables

Create `.env.production`:
```
NEXT_PUBLIC_SITE_URL=https://infogra.tech
```

## Build Command

```bash
npm run build
```

## Start Command (Production)

```bash
npm start
```

## Troubleshooting

### Build Errors
- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check Node.js version: `node -v` (should be 18+)

### Deployment Issues
- Check build logs in deployment platform
- Verify environment variables are set
- Ensure all dependencies are in package.json

### Domain Issues
- DNS propagation can take 24-48 hours
- Verify DNS records are correct
- Check SSL certificate status
