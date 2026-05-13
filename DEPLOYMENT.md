# Deployment Guide - SolTracks on Vercel with bario.me Domain

## Prerequisites
- GitHub account with the SolTracks repository pushed
- Vercel account (free at https://vercel.com)
- Domain bario.me with access to DNS settings

## Step 1: Deploy to Vercel

### Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts and select your project.

### Option B: Using GitHub
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select your GitHub repository (SolTracks)
4. Vercel will auto-detect Next.js configuration
5. Click "Deploy"

## Step 2: Configure Environment Variables on Vercel

After initial deployment, add these environment variables in Vercel dashboard:

1. Go to **Settings > Environment Variables**
2. Add the following (Get values from your .env.local):

```
DATABASE_URL=postgresql://user:password@host:5432/soltracks
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
RESEND_API_KEY=re_xxxxxxxxxxxxx
JWT_SECRET=your-secret-key-here
```

**Important:** Click "Save" after adding all variables, then redeploy:
```bash
vercel --prod
```

## Step 3: Connect Your Subdomain (soltracks.bario.me)

1. **In Vercel Dashboard:**
   - Go to Project Settings > Domains
   - Click "Add Custom Domain"
   - Enter: `soltracks.bario.me`
   - Click "Add"

2. **In your Domain Registrar DNS Settings (Namecheap, GoDaddy, etc.):**
   - Add a CNAME record:
     - Host/Name: `soltracks`
     - Value: `cname.vercel-dns.com`
   - Or follow Vercel's specific instructions shown in the dashboard

3. **Verification:**
   - Wait 5-30 minutes for DNS propagation
   - Vercel will show green checkmark when verified

## Step 4: Set Up SSL Certificate (Automatic)
Vercel automatically provides free SSL certificates from Let's Encrypt. Your site will be accessible at:
- `https://soltracks.bario.me`

## Step 5: Verify Cron Jobs

The monitoring system runs every 5 minutes via Vercel Crons:
- Endpoint: `https://soltracks.bario.me/api/monitoring/run`
- Schedule: Every 5 minutes (`*/5 * * * *`)

Check logs in Vercel Dashboard > Deployments > Logs

## Troubleshooting

### Domain not connecting after DNS change?
- Wait 24-48 hours for full propagation
- Check DNS propagation: https://dnschecker.org
- Verify nameservers are correct

### Environment variables not loading?
- Ensure all variables are set in Vercel dashboard
- Redeploy after adding variables: `vercel --prod`
- Check deployment logs for errors

### Database connection failing?
- Verify DATABASE_URL is correct in Vercel environment
- Ensure PostgreSQL allows connections from Vercel (add Vercel IPs to allowlist)
- Check database credentials

### Emails not sending?
- Verify RESEND_API_KEY is correct
- Test with `curl` or Postman to /api/auth/signup
- Check Resend dashboard for failed emails

## Local Testing Before Production

To test locally with your domain:
```bash
npm run dev
# Then visit http://localhost:3000
```

## Production Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# Check status
vercel status
```

## Security Reminders

- ✅ All environment variables are secure on Vercel
- ✅ Enable "Protect Draft Deployments" in Vercel settings
- ✅ Keep JWT_SECRET strong and unique
- ✅ Regularly rotate RESEND_API_KEY
- ✅ Monitor API logs for suspicious activity

## Next Steps

1. Initialize git and push to GitHub:
   ```bash
   git add .
   git commit -m "Initial SolTracks deployment setup"
   git push origin main
   ```

2. Deploy to Vercel

3. Configure domain

4. Add environment variables

5. Test at https://bario.me

6. Start monitoring wallets!
