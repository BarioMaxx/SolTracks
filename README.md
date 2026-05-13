# SolTracks - Solana Wallet Trade Monitor

A platform to monitor Solana wallet addresses and receive instant email notifications whenever a monitored wallet makes a trade.

## Features

- ✅ User authentication with secure passwords
- ✅ Add and manage multiple wallet addresses
- ✅ Real-time Solana blockchain monitoring via polling
- ✅ Instant email notifications via Resend
- ✅ Trade history tracking
- ✅ Responsive web UI
- ✅ Admin dashboard

## Tech Stack

- **Frontend**: React 18 + Next.js 15+ (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Blockchain**: Solana Web3.js
- **Email**: Resend
- **Authentication**: JWT + bcryptjs
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Resend account (for email notifications)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/soltracks"
RESEND_API_KEY="your-resend-api-key"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret"
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
```

4. Set up the database:

```bash
npm run db:push
```

This will create the necessary tables in your PostgreSQL database.

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Database Management

- **View data**: `npm run db:studio` (opens Prisma Studio)
- **Run migrations**: `npm run db:migrate`
- **Generate Prisma client**: `npm run db:generate`

## Usage

### User Registration

1. Visit the homepage
2. Click "Create Account"
3. Enter email, password, and optional name
4. You'll receive a welcome email

### Add Wallet to Monitor

1. Sign in to your dashboard
2. Paste a Solana wallet address in the "Add New Wallet" form
3. Click "Add Wallet"
4. The system will start monitoring this wallet

### Monitor Trades

- The system polls monitored wallets periodically
- When a trade is detected, an email notification is sent
- View recent trades in the dashboard

### Background Monitoring

To set up automatic periodic monitoring (e.g., every 5 minutes):

**Option 1: Vercel Crons (if deployed on Vercel)**

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/monitoring/run",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**Option 2: External Cron Service**

Set up a service like [EasyCron](https://www.easycron.com/) to call:
```
GET https://your-domain.com/api/monitoring/run
```

**Option 3: Manual Testing**

Visit `http://localhost:3000/api/monitoring/run` in development.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user
- `POST /api/auth/signin` - Sign in with email and password

### Wallets

- `GET /api/wallets` - Get all wallets for authenticated user
- `POST /api/wallets` - Add a new wallet to monitor
- `DELETE /api/wallets/[id]` - Remove a wallet

### Monitoring

- `POST /api/monitoring/check` - Check a specific wallet for trades
- `GET /api/monitoring/run` - Run full monitoring cycle on all wallets

## Database Schema

### Users Table
- id: Unique identifier
- email: User email (unique)
- password: Hashed password
- name: Optional user name
- timestamps

### Wallets Table
- id: Unique identifier
- address: Solana wallet address
- userId: Reference to user
- isActive: Monitoring status
- lastChecked: Last polling time
- timestamps

### Trades Table
- id: Unique identifier
- walletId: Reference to wallet
- signature: Transaction signature (unique)
- direction: "buy" or "sell"
- tokenSymbol: Token being traded
- amount: Trade amount
- emailSent: Whether notification was sent
- timestamps

### PollingLogs Table
- Audit trail of monitoring operations

## Architecture

```
SolTracks/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── auth/         # Auth pages
│   │   ├── dashboard/    # User dashboard
│   │   ├── page.tsx      # Landing page
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   ├── lib/
│   │   ├── auth.ts       # JWT & password utilities
│   │   ├── prisma.ts     # Prisma client
│   │   ├── email.ts      # Email service
│   │   └── solana.ts     # Solana utilities
│   └── globals.css       # Global styles
├── prisma/
│   └── schema.prisma     # Database schema
├── .env.example          # Environment variables template
└── package.json          # Dependencies
```

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Advanced trade filtering
- [ ] Multi-token monitoring
- [ ] Trade history export
- [ ] Mobile app
- [ ] Discord/Telegram notifications
- [ ] Custom notification preferences
- [ ] Portfolio tracking
- [ ] Backtesting tools

## Troubleshooting

### Database connection issues

Ensure your PostgreSQL is running and the `DATABASE_URL` is correct.

```bash
psql $DATABASE_URL -c "SELECT 1;"
```

### Email not sending

- Check your `RESEND_API_KEY` is valid
- Verify sender domain is configured in Resend
- Check spam folder

### Wallet address validation failing

Ensure the Solana wallet address is in base58 format and valid.

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens are httpOnly cookies
- All API routes verify authentication
- Never commit `.env.local` to version control

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Support

For questions or issues, please create a GitHub issue.
