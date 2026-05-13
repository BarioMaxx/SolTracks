# SolTracks Deployment Checklist

## Pre-Deployment Setup

- [ ] Code pushed to GitHub repository
- [ ] All dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] `.env.local` configured with all values
- [ ] Prisma database setup and migrations applied
- [ ] Resend account created and API key obtained

## Vercel Setup

- [ ] Vercel account created
- [ ] Project connected from GitHub
- [ ] Initial deployment successful
- [ ] Environment variables added to Vercel:
  - [ ] DATABASE_URL
  - [ ] SOLANA_RPC_URL
  - [ ] RESEND_API_KEY
  - [ ] JWT_SECRET

## Domain Configuration

- [ ] Domain bario.me access confirmed
- [ ] Domain added to Vercel in Project Settings > Domains
- [ ] DNS records updated (nameservers or CNAME)
- [ ] DNS propagation verified (https://dnschecker.org)
- [ ] Domain resolves to deployment
- [ ] SSL certificate automatically provisioned (should show green lock)

## Testing

- [ ] Homepage loads at https://bario.me
- [ ] Sign up page accessible at https://bario.me/auth/signup
- [ ] Can create new user account
- [ ] Welcome email sends successfully
- [ ] Dashboard loads after signin
- [ ] Can add wallet address
- [ ] Wallet validation works
- [ ] Cron job logs visible in Vercel dashboard

## Monitoring

- [ ] View logs: `vercel logs`
- [ ] Check deployment status in Vercel dashboard
- [ ] Monitor email delivery in Resend dashboard
- [ ] Test trade detection with sample wallet
- [ ] Verify email notifications arrive

## Security

- [ ] JWT_SECRET is strong and unique
- [ ] Passwords are hashed (never store plaintext)
- [ ] Sensitive data only in environment variables
- [ ] RESEND_API_KEY rotated regularly
- [ ] Database credentials secured
- [ ] No secrets committed to GitHub

## Performance

- [ ] Initial page load < 3 seconds
- [ ] API responses < 1 second
- [ ] Database queries optimized
- [ ] Cron jobs complete within 60 seconds
- [ ] Memory usage within Vercel limits

## Post-Deployment

- [ ] Monitor uptime
- [ ] Check error logs daily
- [ ] Test wallet monitoring regularly
- [ ] Review email delivery metrics
- [ ] Plan scaling if needed
