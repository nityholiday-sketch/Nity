import crypto from 'crypto';
import { CompactEncrypt, CompactSign, importSPKI, importPKCS8 } from 'jose';

const JWE_ALGORITHM = 'RSA-OAEP-256';
const JWS_ALGORITHM = 'RS256';
const DIGEST_ALGORITHM = 'SHA-256';
const JWE_ENCRYPTION_METHOD = 'A128CBC-HS256';
const TOKEN_EXPIRY_TIME_IN_MILLISECONDS = 300000;

export interface PayGlocalConfig {
  merchantId: string;
  apiKey?: string;
  privateKey?: string;
  privateKeyId?: string;
  publicKey?: string;
  publicKeyId?: string;
  environment: 'uat' | 'production';
  baseUrl: string;
  allowSandboxFallback: boolean;
}

function formatPemKey(key: string, type: 'PUBLIC KEY' | 'PRIVATE KEY'): string {
  if (!key) return '';
  let formatted = key.trim();
  if ((formatted.startsWith('"') && formatted.endsWith('"')) || (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }
  formatted = formatted.replace(/\\n/g, '\n').trim();
  if (!formatted.includes('-----BEGIN')) {
    formatted = `-----BEGIN ${type}-----\n${formatted}\n-----END ${type}-----`;
  }
  return formatted;
}

export function getPayGlocalConfig(): PayGlocalConfig {
  const environment = (process.env.PAYGLOCAL_ENV || 'production').toLowerCase() === 'production' ? 'production' : 'uat';
  const baseUrl = environment === 'production'
    ? 'https://api.prod.payglocal.in'
    : 'https://api.uat.payglocal.in';

  return {
    merchantId: process.env.PAYGLOCAL_MERCHANT_ID || 'ptplnitytrav5607',
    apiKey: process.env.PAYGLOCAL_API_KEY || undefined,
    privateKey: formatPemKey(process.env.PAYGLOCAL_PRIVATE_KEY || '', 'PRIVATE KEY') || undefined,
    privateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID || process.env.PAYGLOCAL_KEY_ID || 'kId-CcQgeBkpNx6HONBy',
    publicKey: formatPemKey(process.env.PAYGLOCAL_PUBLIC_KEY || process.env.PAYGLOCAL_PUBLIC_CERT || '', 'PUBLIC KEY') || undefined,
    publicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID || '8cc91c8d-8030-4660-a9c7-33de886fb495',
    environment,
    baseUrl,
    allowSandboxFallback: (process.env.PAYGLOCAL_ALLOW_SANDBOX_FALLBACK || '').toLowerCase() === 'true',
  };
}

function hasJweJwsCreds(config: PayGlocalConfig): boolean {
  return !!(config.privateKey && config.privateKeyId && config.publicKey && config.publicKeyId);
}

function assertUsableConfig(config: PayGlocalConfig): void {
  if (!config.merchantId) {
    throw new Error('PAYGLOCAL_MERCHANT_ID is not set.');
  }
  if (!config.apiKey && !hasJweJwsCreds(config)) {
    throw new Error(
      'No PayGlocal auth configured. Set PAYGLOCAL_API_KEY for simple mode, or ' +
      'PAYGLOCAL_PRIVATE_KEY + PAYGLOCAL_PRIVATE_KEY_ID + PAYGLOCAL_PUBLIC_KEY + ' +
      'PAYGLOCAL_PUBLIC_KEY_ID for JWE/JWS mode.'
    );
  }
}

function generateDigestObject(payload: string) {
  return {
    digest: crypto.createHash('sha256').update(payload).digest('base64'),
    digestAlgorithm: DIGEST_ALGORITHM,
    exp: TOKEN_EXPIRY_TIME_IN_MILLISECONDS,
    iat: `${Date.now()}`,
  };
}

function generateJWSHeaderObject(merchantId: string, kid?: string) {
  return {
    alg: JWS_ALGORITHM,
    kid,
    'x-gl-merchantId': merchantId,
    'issued-by': merchantId,
    'is-digested': 'true',
    'x-gl-enc': 'true',
  };
}

function generateJWEHeaderObject(merchantId: string, kid?: string) {
  return {
    'issued-by': merchantId,
    enc: JWE_ENCRYPTION_METHOD,
    exp: TOKEN_EXPIRY_TIME_IN_MILLISECONDS,
    iat: `${Date.now()}`,
    alg: JWE_ALGORITHM,
    kid,
  };
}

async function generateJWE(payload: Record<string, any>, publicKey: string, merchantId: string, publicKeyId?: string): Promise<string> {
  const cryptoPublicKey = await importSPKI(publicKey, JWE_ALGORITHM);
  const headerObject = generateJWEHeaderObject(merchantId, publicKeyId);
  return new CompactEncrypt(new TextEncoder().encode(JSON.stringify(payload)))
    .setProtectedHeader(headerObject)
    .encrypt(cryptoPublicKey);
}

async function generateJWS(payload: string, privateKey: string, merchantId: string, privateKeyId?: string): Promise<string> {
  let pkcs8Pem = privateKey;
  try {
    const k = crypto.createPrivateKey(privateKey);
    pkcs8Pem = k.export({ format: 'pem', type: 'pkcs8' }) as string;
  } catch (err) {
    // If already PKCS8, use as is
  }
  const cryptoPrivateKey = await importPKCS8(pkcs8Pem, JWS_ALGORITHM);
  const digestObject = generateDigestObject(payload);
  const headerObject = generateJWSHeaderObject(merchantId, privateKeyId);
  return new CompactSign(new TextEncoder().encode(JSON.stringify(digestObject)))
    .setProtectedHeader(headerObject)
    .sign(cryptoPrivateKey);
}

async function generateJWEAndJWS(
  payload: Record<string, any>,
  config: PayGlocalConfig
): Promise<{ jweToken: string; jwsToken: string }> {
  if (!config.publicKey || !config.privateKey) {
    throw new Error('JWE/JWS mode requires PAYGLOCAL_PUBLIC_KEY and PAYGLOCAL_PRIVATE_KEY.');
  }
  const jweToken = await generateJWE(payload, config.publicKey, config.merchantId, config.publicKeyId);
  const jwsToken = await generateJWS(jweToken, config.privateKey, config.merchantId, config.privateKeyId);
  return { jweToken, jwsToken };
}

export function parsePayGlocalToken(token: string): {
  header?: Record<string, any>;
  payload?: Record<string, any>;
  valid: boolean;
} {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      try {
        return { payload: JSON.parse(token), valid: true };
      } catch {
        return { valid: false };
      }
    }

    const decode = (seg: string) => {
      let base64 = seg.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      return Buffer.from(base64, 'base64').toString('utf8');
    };

    const header = JSON.parse(decode(parts[0]));
    const payload = JSON.parse(decode(parts[1]));

    const config = getPayGlocalConfig();
    let valid = false;

    if (parts.length === 3 && config.publicKey) {
      try {
        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(`${parts[0]}.${parts[1]}`);
        const sigBuf = Buffer.from(parts[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64');
        valid = verifier.verify(config.publicKey, sigBuf);
      } catch (verifyErr) {
        console.warn('PayGlocal signature verification warning:', verifyErr);
        valid = false;
      }
    }

    return { header, payload, valid };
  } catch (error) {
    console.error('Error parsing PayGlocal token:', error);
    return { valid: false };
  }
}

export interface PayCollectInitiateParams {
  merchantTxnId: string;
  merchantUniqueId?: string;
  amount: number | string;
  currency?: string;
  customer: {
    name: string;
    email: string;
    mobile: string;
    ipAddress?: string;
    userAgent?: string;
    httpAccept?: string;
  };
  billing?: {
    addressStreet1?: string;
    addressCity?: string;
    addressState?: string;
    addressPostalCode?: string;
    addressCountry?: string;
    callingCode?: string;
  };
  product?: {
    name: string;
    sku?: string;
    type?: string;
    quantity?: number;
    price?: number | string;
  };
  merchantCallbackURL: string;
}

export interface PayCollectInitiateResponse {
  success: boolean;
  gid?: string;
  status?: string;
  message?: string;
  redirectUrl?: string;
  statusUrl?: string;
  error?: string;
  rawResponse?: any;
}

function buildTransactionPayload(params: PayCollectInitiateParams): Record<string, any> {
  const currency = (params.currency || 'INR').toUpperCase();
  const billing = params.billing || {};
  const nameParts = (params.customer.name || '').trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || 'Guest';
  const lastName = nameParts.slice(1).join(' ') || 'Customer';
  let phone = (params.customer.mobile || '').replace(/\D/g, '');

  let callingCode = billing.callingCode || '+91';
  let countryCode = billing.addressCountry || (currency === 'USD' ? 'US' : 'IN');

  if (currency === 'USD') {
    callingCode = '+1';
  } else if (phone.length > 10 && phone.startsWith('91')) {
    phone = phone.slice(-10);
  }

  const payload: Record<string, any> = {
    merchantTxnId: params.merchantTxnId,
    paymentData: {
      totalAmount: Number(params.amount).toFixed(2),
      txnCurrency: currency,
      billingData: {
        firstName,
        lastName,
        emailId: params.customer.email,
        callingCode,
        phoneNumber: phone || '9876543210',
        addressStreet1: billing.addressStreet1 || (currency === 'USD' ? 'Main Street' : 'Sector 1'),
        addressCity: billing.addressCity || (currency === 'USD' ? 'New York' : 'Delhi'),
        addressState: billing.addressState || (currency === 'USD' ? 'NY' : 'DL'),
        addressPostalCode: billing.addressPostalCode || (currency === 'USD' ? '10001' : '110001'),
        addressCountry: countryCode,
      },
    },
    merchantCallbackURL: params.merchantCallbackURL,
  };

  if (params.merchantUniqueId) {
    payload.merchantUniqueId = params.merchantUniqueId;
  }

  if (params.product) {
    payload.riskData = {
      orderData: [
        {
          productDescription: params.product.name,
          productSKU: params.product.sku || 'NITY_PKG_1',
          productType: params.product.type || 'Travel',
          itemUnitPrice: Number(params.product.price ?? params.amount).toFixed(2),
          itemQuantity: String(params.product.quantity || 1),
        },
      ],
      customerData: {
        merchantAssignedCustomerId: `CUST_${phone || Date.now()}`,
        customerAccountType: '0',
        ipAddress: params.customer.ipAddress || '127.0.0.1',
        httpAccept: params.customer.httpAccept || '*/*',
        httpUserAgent: params.customer.userAgent || 'Mozilla/5.0',
      },
    };
  }

  return payload;
}

export async function initiatePayCollectPayment(
  params: PayCollectInitiateParams
): Promise<PayCollectInitiateResponse> {
  const config = getPayGlocalConfig();

  try {
    assertUsableConfig(config);
  } catch (err: any) {
    if (config.allowSandboxFallback) {
      return buildSandboxResponse(params, err.message);
    }
    return { success: false, error: err.message };
  }

  const payload = buildTransactionPayload(params);
  const endpoint = `${config.baseUrl}/gl/v1/payments/initiate/paycollect`;

  let body: string;
  let headers: Record<string, string>;

  if (hasJweJwsCreds(config)) {
    const { jweToken, jwsToken } = await generateJWEAndJWS(payload, config);
    body = jweToken;
    headers = {
      'Content-Type': 'text/plain',
      'x-gl-merchant-id': config.merchantId,
      'x-gl-token-external': jwsToken,
    };
  } else {
    body = JSON.stringify(payload);
    headers = {
      'Content-Type': 'application/json',
      'x-gl-merchant-id': config.merchantId,
      'x-gl-auth': config.apiKey as string,
    };
  }

  try {
    const response = await fetch(endpoint, { method: 'POST', headers, body });
    const data = await response.json().catch(() => ({} as any));

    const isSuccess =
      response.ok &&
      (data.status === 'CREATED' || data.status === 'SUCCESS' || data.status === 'INPROGRESS') &&
      data.data?.redirectUrl;

    if (isSuccess) {
      return {
        success: true,
        gid: data.gid,
        status: data.status,
        message: data.message,
        redirectUrl: data.data.redirectUrl,
        statusUrl: data.data.statusUrl,
        rawResponse: data,
      };
    }

    const errorMessage =
      data.message ||
      (Array.isArray(data.errors) && data.errors.length > 0 ? data.errors.join(', ') : null) ||
      `PayGlocal responded with status ${data.status || response.status}`;

    return {
      success: false,
      gid: data.gid,
      status: data.status,
      error: errorMessage,
      rawResponse: data,
    };
  } catch (error: any) {
    console.error('PayGlocal API network error:', error);
    return { success: false, error: error.message || 'Failed to communicate with PayGlocal server.' };
  }
}

function buildSandboxResponse(params: PayCollectInitiateParams, reason: string): PayCollectInitiateResponse {
  const sandboxGid = `gl_sim_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const query = new URLSearchParams({
    amount: String(params.amount),
    currency: (params.currency || 'INR').toUpperCase(),
    merchantTxnId: params.merchantTxnId,
    gid: sandboxGid,
    callbackUrl: params.merchantCallbackURL,
  });

  return {
    success: true,
    gid: sandboxGid,
    status: 'CREATED',
    message: `PayGlocal sandbox fallback active (${reason}). This is a simulated transaction, not a real one.`,
    redirectUrl: `/payments/payglocal/sandbox?${query.toString()}`,
  };
}

export interface PayGlocalStatusResponse {
  success: boolean;
  status?: string;
  data?: any;
  rawResponse?: any;
  error?: string;
}

export async function getPayGlocalPaymentStatus(gid: string): Promise<PayGlocalStatusResponse> {
  const config = getPayGlocalConfig();
  try {
    assertUsableConfig(config);
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  const endpoint = `${config.baseUrl}/gl/v1/payments/${encodeURIComponent(gid)}/status`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-gl-merchant-id': config.merchantId,
  };

  if (config.apiKey) {
    headers['x-gl-auth'] = config.apiKey;
  }

  try {
    const response = await fetch(endpoint, { method: 'GET', headers });
    const data = await response.json().catch(() => ({} as any));

    if (!response.ok) {
      return { success: false, status: data.status, data: data.data || data, rawResponse: data, error: data.message || `PayGlocal responded with status ${response.status}` };
    }

    return { success: true, status: data.status, data: data.data || data, rawResponse: data };
  } catch (error: any) {
    console.error('Error fetching PayGlocal payment status:', error);
    return { success: false, error: error.message || 'Failed to communicate with PayGlocal server.' };
  }
}
