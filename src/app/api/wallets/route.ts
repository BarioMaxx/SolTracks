import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isValidSolanaAddress } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 400 }
      );
    }

    // Validate Solana address
    const isValid = await isValidSolanaAddress(address);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid Solana address' },
        { status: 400 }
      );
    }

    // Check if wallet already exists for this user
    const existing = await prisma.wallet.findUnique({
      where: {
        address_userId: {
          address,
          userId: payload.userId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Wallet already being monitored' },
        { status: 409 }
      );
    }

    // Create wallet record
    const wallet = await prisma.wallet.create({
      data: {
        address,
        userId: payload.userId,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        wallet: { id: wallet.id, address: wallet.address } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add wallet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all wallets for user
    const wallets = await prisma.wallet.findMany({
      where: { userId: payload.userId },
      include: { 
        trades: { 
          orderBy: { createdAt: 'desc' },
          take: 5 
        } 
      },
    });

    return NextResponse.json({ wallets }, { status: 200 });
  } catch (error) {
    console.error('Get wallets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
