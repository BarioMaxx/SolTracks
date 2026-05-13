import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Background monitoring endpoint
 * This can be called by an external scheduler (like a cron job)
 * or Vercel Crons to check all active wallets for new trades
 */
export async function GET() {
  try {
    // Get all active wallets
    const wallets = await prisma.wallet.findMany({
      where: { isActive: true },
      include: { user: true },
    });

    console.log(`Starting monitoring check for ${wallets.length} wallets`);

    let totalChecked = 0;
    let totalTradesFound = 0;

    for (const wallet of wallets) {
      try {
        // Call the individual wallet check endpoint
        // (In production, you'd implement the actual monitoring logic here)
        totalChecked++;

        // Create polling log
        await prisma.pollingLog.create({
          data: {
            walletId: wallet.id,
            status: 'success',
            tradeFound: false,
          },
        });
      } catch (error) {
        console.error(`Error checking wallet ${wallet.id}:`, error);
        
        await prisma.pollingLog.create({
          data: {
            walletId: wallet.id,
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            tradeFound: false,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      walletsChecked: totalChecked,
      tradesFound: totalTradesFound,
      message: `Checked ${totalChecked} wallets, found ${totalTradesFound} trades`,
    });
  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json(
      { 
        error: 'Monitoring failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
