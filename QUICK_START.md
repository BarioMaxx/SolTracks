# Quick Start - Deploy SolTracks to bario.me

## 1. Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Initial SolTracks setup"
git push origin main
```

## 2. Quick Deployment Steps

### Using Vercel CLI (Fastest):
```bash
npm install -g vercel
vercel
# Follow prompts, select production when asked
```

### Using GitHub (Automatic):
1. Visit https://vercel.com/new
2. Select your SolTracks repository
3. Click "Import"
4. Vercel auto-detects Next.js - just click "Deploy"

## 3. Add Environment Variables to Vercel

After first deployment, add these in **Vercel Dashboard > Settings > Environment Variables**:

```
DATABASE_URL=postgresql://...
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
RESEND_API_KEY=re_...
JWT_SECRET=your-strong-secret-here
```

Then redeploy:
```bash
vercel --prod
```

## 4. Connect bario.me Domain

In **Vercel Dashboard > Project Settings > Domains**:
1. Add custom domain: `bario.me`
2. Update your domain's nameservers to Vercel's (instructions provided)
3. Wait 5-30 minutes for DNS to propagate

## 5. Done! 🎉

Your app is now live at **https://soltracks.bario.me**

- Homepage: https://soltracks.bario.me
- Sign up: https://soltracks.bario.me/auth/signup
- Dashboard: https://soltracks.bario.me/dashboard

## Features Ready to Use

✅ User authentication (sign up/sign in)
✅ Add Solana wallet addresses to monitor
✅ Receive email alerts when wallets trade
✅ Automatic monitoring every 5 minutes (Cron jobs)
✅ SSL/HTTPS secured connection
✅ Free tier on Vercel

## Troubleshooting

- **Build failing?** Check `npm run build` locally first
- **Domain not working?** Wait 24 hours for DNS propagation
- **Emails not sending?** Verify RESEND_API_KEY in Vercel
- **Database not connecting?** Ensure DATABASE_URL is set in Vercel

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed troubleshooting.

## Local Development

```bash
npm run dev
# Visit http://localhost:3000
```

## Monitoring Production

```bash
# View live logs
vercel logs

# Check status
vercel status

# View deployments
vercel deployments
```

That's it! Your SolTracks platform is live on your custom domain! 🚀
