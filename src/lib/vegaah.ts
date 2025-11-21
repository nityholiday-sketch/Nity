
import crypto from 'crypto';

export function generateVegaahSignature(
  trackId: string,
  terminalId: string,
  password: string,
  merchantKey: string,
  amount: string,
  currency: string
): string {
  // Format: trackId|terminalId|password|merchantKey|amount|currency
  const pipeSeperatedString = `${trackId}|${terminalId}|${password}|${merchantKey}|${amount}|${currency}`;
  
  return crypto
    .createHash('sha256')
    .update(pipeSeperatedString)
    .digest('hex');
}

export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

export function generateTrackId(orderId: string): string {
  const timestamp = Date.now();
  return `${orderId}_${timestamp}`;
}
