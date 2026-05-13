<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# SolTracks Development Guidelines

## Project Overview
SolTracks is a Next.js full-stack application for monitoring Solana wallet trades and sending email notifications.

## Tech Stack
- **Frontend**: React 18 + Next.js 15+ (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Blockchain**: Solana Web3.js
- **Email**: Resend
- **Authentication**: JWT + bcryptjs
- **Styling**: Tailwind CSS

## Development Standards

### Code Organization
- Keep API routes in `/src/app/api/`
- Store utilities in `/src/lib/`
- Place React components in `/src/components/`
- Use TypeScript for type safety

### Authentication
- Use JWT tokens stored in httpOnly cookies
- Verify tokens in all protected API routes
- Hash passwords with bcryptjs before storing

### Database
- Use Prisma ORM exclusively
- Keep schema normalized
- Add migrations for schema changes

### Styling
- Use Tailwind CSS utility classes
- Follow the color scheme: dark background (#0f0f0f) with white text
- Keep consistent spacing and sizing

### API Design
- Return JSON responses
- Use proper HTTP status codes (200, 201, 400, 401, 404, 409, 500)
- Include error messages in responses
- Validate input data

### Error Handling
- Catch errors in try-catch blocks
- Log errors to console for debugging
- Return user-friendly error messages

## Common Tasks

### Adding a new feature
1. Create database schema if needed in `schema.prisma`
2. Run `npm run db:push` to update database
3. Create API route in `/src/app/api/`
4. Add frontend component if needed
5. Test thoroughly

### Debugging
1. Check console logs in terminal
2. Use Prisma Studio: `npm run db:studio`
3. Verify `.env.local` configuration
4. Check network tab in browser DevTools

### Database Changes
```bash
npm run db:migrate    # Interactive migration
npm run db:push       # Sync schema
npm run db:generate   # Regenerate Prisma client
```

## File Structure
- API routes should be in `/src/app/api/` with route segments like `/api/auth/`, `/api/wallets/`
- Utilities should be in `/src/lib/` organized by concern (auth, email, database, etc.)
- Page components should be in `/src/app/` with descriptive names
- Configuration files at root level

## Key Files and Their Purpose
- `src/lib/auth.ts` - JWT and password utilities
- `src/lib/prisma.ts` - Database client setup
- `src/lib/email.ts` - Resend email integration
- `src/lib/solana.ts` - Solana blockchain interaction
- `prisma/schema.prisma` - Database schema definition
- `.env.example` - Environment variables template

## Running the Project
- Development: `npm run dev`
- Build: `npm run build`
- Production: `npm start`
- Database management: `npm run db:studio`

## Important Notes
- Always verify Solana addresses before storing
- Send emails asynchronously to avoid blocking requests
- Keep sensitive data in environment variables
- Never log user passwords or tokens
- Test API endpoints with proper authentication
