import crypto from 'crypto';

/**
 * CCAvenue AES-128-CBC encryption standard
 * Key is generated from MD5 hash of the 32-character working key.
 * IV is a standard fixed 16-byte buffer (0x00 to 0x0f).
 */
const CCAVENUE_IV = Buffer.from([
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
  0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
]);

export function encryptCCAvenue(plainText: string, workingKey: string): string {
  const m = crypto.createHash('md5');
  m.update(workingKey);
  const key = m.digest();
  const cipher = crypto.createCipheriv('aes-128-cbc', key, CCAVENUE_IV);
  let encoded = cipher.update(plainText, 'utf8', 'hex');
  encoded += cipher.final('hex');
  return encoded;
}

export function decryptCCAvenue(encText: string, workingKey: string): string {
  const m = crypto.createHash('md5');
  m.update(workingKey);
  const key = m.digest();
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, CCAVENUE_IV);
  let decoded = decipher.update(encText, 'hex', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
}

export const CCAVENUE_ACTION_URL =
  'https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction';
