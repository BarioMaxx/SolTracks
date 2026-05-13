'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Wallet {
  id: string;
  address: string;
  lastChecked: string;
  trades: any[];
}

export default function Dashboard() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addingWallet, setAddingWallet] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchWallets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchWallets() {
    try {
      setLoading(true);
      const response = await fetch('/api/wallets');
      
      if (response.status === 401) {
        router.push('/auth/signin');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch wallets');
      }

      const data = await response.json();
      setWallets(data.wallets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddWallet(e: React.FormEvent) {
    e.preventDefault();
    setAddingWallet(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: newAddress }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add wallet');
      }

      setNewAddress('');
      setSuccess('Wallet added successfully!');
      await fetchWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setAddingWallet(false);
    }
  }

  async function handleDeleteWallet(walletId: string) {
    if (!confirm('Are you sure you want to remove this wallet?')) return;

    try {
      const response = await fetch(`/api/wallets/${walletId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete wallet');
      }

      await fetchWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  async function handleCheckTrades(walletId: string) {
    try {
      const response = await fetch('/api/monitoring/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletId }),
      });

      if (!response.ok) {
        throw new Error('Failed to check trades');
      }

      const data = await response.json();
      setSuccess(data.message || 'Check complete');
      await fetchWallets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  return (
    <main className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Monitor your Solana wallets</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Wallet</h2>
        <form onSubmit={handleAddWallet} className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Paste Solana wallet address..."
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={addingWallet}
          >
            {addingWallet ? 'Adding...' : 'Add Wallet'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="card">
          <p className="text-gray-400">Loading wallets...</p>
        </div>
      ) : wallets.length === 0 ? (
        <div className="card">
          <p className="text-gray-400">
            No wallets yet. Add one above to get started monitoring trades.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Wallet Address</p>
                  <p className="font-mono text-sm break-all mb-4">
                    {wallet.address}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last checked: {new Date(wallet.lastChecked).toLocaleString()}
                  </p>
                  {wallet.trades.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        Recent trades ({wallet.trades.length}):
                      </p>
                      <div className="space-y-1">
                        {wallet.trades.map((trade) => (
                          <div key={trade.id} className="text-xs text-gray-400">
                            {trade.direction.toUpperCase()}{' '}
                            {trade.tokenSymbol || 'Unknown'} -{' '}
                            {new Date(trade.timestamp).toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleCheckTrades(wallet.id)}
                    className="btn btn-secondary text-sm"
                  >
                    Check Now
                  </button>
                  <button
                    onClick={() => handleDeleteWallet(wallet.id)}
                    className="btn btn-danger text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
