import crypto from 'crypto';

const AES_KEY = process.env.SABPAISA_AUTH_KEY!;
const IV = process.env.SABPAISA_AUTH_IV!;

// Sabpaisa's sample code uses AES-128-CBC.
// The key and IV must be of specific lengths for this algorithm.
// Key should be 16 bytes (128 bits)
const key = Buffer.alloc(16, 0); // Create a 16-byte buffer
const keyBuffer = Buffer.from(AES_KEY, 'utf8');
keyBuffer.copy(key, 0, 0, Math.min(keyBuffer.length, 16));

// IV should be 16 bytes (128 bits)
const iv = Buffer.alloc(16, 0); // Create a 16-byte buffer
const ivBuffer = Buffer.from(IV, 'utf8');
ivBuffer.copy(iv, 0, 0, Math.min(ivBuffer.length, 16));


export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encryptedHex: string): string {
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
