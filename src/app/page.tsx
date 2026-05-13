'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-12 md:py-20">
      <header className="mb-12 md:mb-20">
        <h1 className="text-4xl md:text-6xl font-bold  mb-4">SolTracks</h1>
        <p className="text-xl text-gray-400">
          Monitor Solana wallets and receive instant email alerts on trades
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">🚀 Get Started</h2>
          <p className="text-gray-400 mb-6">
            Track your favorite Solana traders. Get notified instantly when they make a move.
          </p>
          <div className="space-y-3">
            <Link href="/auth/signup" className="btn btn-primary w-full text-center block">
              Create Account
            </Link>
            <Link href="/auth/signin" className="btn btn-secondary w-full text-center block">
              Sign In
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">✨ Features</h2>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Real-time Solana wallet monitoring</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Instant email notifications</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Track multiple wallets</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✓</span>
              <span>Admin dashboard</span>
            </li>
          </ul>
        </div>
      </div>

      <footer className="text-center text-gray-500 text-sm">
        <p>&copy; 2024 SolTracks. Monitor Solana trades efficiently.</p>
      </footer>
    </main>
  );
}
