import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getWalletTransactions } from '@/lib/solana';
import { sendTradeNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletId } = body;

    if (!walletId) {
      return NextResponse.json(
        { error: 'Wallet ID required' },
        { status: 400 }
      );
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
      include: { user: true },
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Get recent transactions
    const signatures = await getWalletTransactions(wallet.address, 20);

    let newTradesFound = 0;

    for (const sig of signatures) {
      // Check if trade already exists
      const existingTrade = await prisma.trade.findUnique({
        where: { signature: sig.signature },
      });

      if (existingTrade) {
        continue; // Already processed
      }

      // Parse transaction for trade info
      // (In a real implementation, you'd fetch and parse the actual transaction)
      const tradeInfo = {
        tokenSymbol: undefined,
        amount: undefined,
        direction: 'buy' as const,
      };

      if (tradeInfo) {
        // Create trade record
        const trade = await prisma.trade.create({
          data: {
            walletId: wallet.id,
            signature: sig.signature,
            tokenSymbol: tradeInfo.tokenSymbol,
            amount: tradeInfo.amount,
            direction: tradeInfo.direction,
            timestamp: new Date(sig.blockTime ? sig.blockTime * 1000 : Date.now()),
          },
        });

        // Send email notification
        const emailResult = await sendTradeNotificationEmail({
          userEmail: wallet.user.email,
          walletAddress: wallet.address,
          tokenSymbol: tradeInfo.tokenSymbol,
          amount: tradeInfo.amount,
          direction: tradeInfo.direction,
          timestamp: trade.timestamp,
          signature: trade.signature,
        });

        if (emailResult.success) {
          await prisma.trade.update({
            where: { id: trade.id },
            data: { emailSent: true },
          });
        } else {
          await prisma.trade.update({
            where: { id: trade.id },
            data: { 
              emailError: emailResult.error 
            },
          });
        }

        newTradesFound++;
      }
    }

    // Update last checked time
    await prisma.wallet.update({
      where: { id: walletId },
      data: { lastChecked: new Date() },
    });

    return NextResponse.json(
      { 
        success: true, 
        tradesFound: newTradesFound,
        message: `Found ${newTradesFound} new trades` 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Monitoring error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
