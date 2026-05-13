import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set in environment variables');
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export interface TradeEmailData {
  userEmail: string;
  walletAddress: string;
  tokenSymbol?: string;
  amount?: number;
  direction: 'buy' | 'sell';
  timestamp: Date;
  signature: string;
}

export async function sendTradeNotificationEmail(
  data: TradeEmailData
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailContent = `
      <h2>Trade Detected on Your Monitored Wallet 🚀</h2>
      <p><strong>Wallet:</strong> ${data.walletAddress}</p>
      <p><strong>Direction:</strong> ${data.direction.toUpperCase()}</p>
      ${data.tokenSymbol ? `<p><strong>Token:</strong> ${data.tokenSymbol}</p>` : ''}
      ${data.amount ? `<p><strong>Amount:</strong> ${data.amount}</p>` : ''}
      <p><strong>Time:</strong> ${data.timestamp.toLocaleString()}</p>
      <p><strong>Transaction:</strong> <a href="https://solscan.io/tx/${data.signature}">View on Solscan</a></p>
    `;

    const result = await getResendClient().emails.send({
      from: 'SolTracks <noreply@soltracks.com>',
      to: data.userEmail,
      subject: `Trade Alert: ${data.direction.toUpperCase()} on ${data.walletAddress}`,
      html: emailContent,
    });

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function sendWelcomeEmail(userEmail: string) {
  try {
    await getResendClient().emails.send({
      from: 'SolTracks <noreply@soltracks.com>',
      to: userEmail,
      subject: 'Welcome to SolTracks!',
      html: `
        <h2>Welcome to SolTracks 👋</h2>
        <p>Your account has been created successfully.</p>
        <p>Start monitoring your favorite Solana wallets and receive instant email alerts when they trade.</p>
        <p>Visit your dashboard to add wallets to monitor.</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false };
  }
}
