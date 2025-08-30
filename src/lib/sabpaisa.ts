import crypto from 'crypto';

const AES_KEY_BASE64 = process.env.SABPAISA_AUTH_KEY!;
const HMAC_KEY_BASE64 = process.env.SABPAISA_AUTH_IV!; // Note: SabPaisa calls this IV, but it's used as the HMAC key.

// Convert Base64 keys to HEX for the encryption functions
const aesKeyHex = Buffer.from(AES_KEY_BASE64, 'base64').toString('hex');
const hmacKeyHex = Buffer.from(HMAC_KEY_BASE64, 'base64').toString('hex');

// Convert HEX string to Buffer
const hexToBuffer = (hex: string) => Buffer.from(hex, 'hex');

// Convert Buffer to HEX
const bufferToHex = (buffer: Buffer) => buffer.toString('hex');

/**
 * Encrypts plaintext using AES-256-GCM with HMAC-SHA384.
 * The implementation follows the Node.js sample provided in the Sabpaisa documentation.
 * @param plaintext The string to encrypt.
 * @returns The HEX-encoded encrypted string.
 */
export function encrypt(plaintext: string): string {
  const aesKey = hexToBuffer(aesKeyHex);
  const hmacKey = hexToBuffer(hmacKeyHex);

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);

  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const tag = cipher.getAuthTag();
  
  // Per documentation: HMAC is calculated over (IV + Ciphertext + Tag)
  const dataToHmac = Buffer.concat([iv, encrypted, tag]);
  const hmac = crypto.createHmac('sha384', hmacKey).update(dataToHmac).digest();

  // Final payload is HMAC + IV + Ciphertext + Tag
  const finalBuffer = Buffer.concat([hmac, iv, encrypted, tag]);

  return bufferToHex(finalBuffer);
}

/**
 * Decrypts a HEX-encoded string using AES-256-GCM with HMAC-SHA384.
 * The implementation follows the Node.js sample provided in the Sabpaisa documentation.
 * @param encryptedHex The HEX-encoded string to decrypt.
 * @returns The original plaintext string.
 */
export function decrypt(encryptedHex: string): string {
    const aesKey = hexToBuffer(aesKeyHex);
    const hmacKey = hexToBuffer(hmacKeyHex);

    const fullMessage = hexToBuffer(encryptedHex);

    const hmacSize = 48;
    const ivSize = 12;
    const tagSize = 16;
    
    if (fullMessage.length < hmacSize + ivSize + tagSize) {
        throw new Error("Invalid encrypted message length.");
    }

    const hmacReceived = fullMessage.slice(0, hmacSize);
    const encryptedDataWithIvAndTag = fullMessage.slice(hmacSize);

    // Verify HMAC
    const computedHmac = crypto.createHmac('sha384', hmacKey).update(encryptedDataWithIvAndTag).digest();

    if (!crypto.timingSafeEqual(hmacReceived, computedHmac)) {
        throw new Error("HMAC verification failed! Data integrity compromised.");
    }

    const iv = encryptedDataWithIvAndTag.slice(0, ivSize);
    const ciphertext = encryptedDataWithIvAndTag.slice(ivSize, encryptedDataWithIvAndTag.length - tagSize);
    const tag = encryptedDataWithIvAndTag.slice(encryptedDataWithIvAndTag.length - tagSize);

    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
}