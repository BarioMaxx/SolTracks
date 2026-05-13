import { Connection, PublicKey } from '@solana/web3.js';

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

export const connection = new Connection(RPC_URL, 'confirmed');

export async function getWalletTransactions(
  walletAddress: string,
  limit: number = 10
) {
  try {
    const pubkey = new PublicKey(walletAddress);
    const signatures = await connection.getSignaturesForAddress(pubkey, {
      limit,
    });
    return signatures;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function getTransaction(signature: string) {
  try {
    const tx = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });
    return tx;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
}

export async function isValidSolanaAddress(address: string): Promise<boolean> {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey);
  } catch {
    return false;
  }
}

export function parseTradeFromTransaction(tx: any): {
  tokenSymbol?: string;
  amount?: number;
  direction?: string;
} | null {
  // This is a simplified version. Real implementation would parse the transaction data
  // to extract trade information from DEX programs (like Raydium, Orca, etc.)
  
  if (!tx || !tx.transaction) return null;

  // Check for common DEX program IDs
  const dexPrograms = [
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1xF', // Raydium
    'whirLbMiicVdio4KfQ7QohjZQJMWQnCHcqAL3UwrZh', // Orca
  ];

  // Check if transaction involves any DEX program
  const message = tx.transaction.message;
  const involvesDex = message?.accountKeys?.some((key: any) =>
    dexPrograms.includes(key.toString())
  );

  return {
    direction: involvesDex ? 'trade' : 'unknown',
    amount: 0,
  };
}
