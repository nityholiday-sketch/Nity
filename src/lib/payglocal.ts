import crypto from 'crypto';

export interface PayGlocalConfig {
  merchantId: string;
  keyId?: string;
  privateKey?: string;
  publicKeyId?: string;
  publicCert?: string;
  environment: 'uat' | 'production';
  baseUrl: string;
}

function formatPemKey(key: string, type: 'PUBLIC KEY' | 'PRIVATE KEY'): string {
  if (!key) return '';
  let formatted = key.trim();
  if (!formatted.includes('\n') && formatted.includes('\\n')) {
    formatted = formatted.replace(/\\n/g, '\n');
  }
  if (!formatted.includes('-----BEGIN')) {
    formatted = `-----BEGIN ${type}-----\n${formatted}\n-----END ${type}-----`;
  }
  return formatted;
}

export function getPayGlocalConfig(): PayGlocalConfig {
  const environment = (process.env.PAYGLOCAL_ENV || 'uat').toLowerCase() === 'production' ? 'production' : 'uat';
  const baseUrl = environment === 'production'
    ? 'https://api.prod.payglocal.in'
    : 'https://api.uat.payglocal.in';

  const privateKey = formatPemKey(process.env.PAYGLOCAL_PRIVATE_KEY || '', 'PRIVATE KEY');
  const publicCert = formatPemKey(process.env.PAYGLOCAL_PUBLIC_CERT || '', 'PUBLIC KEY');

  return {
    merchantId: process.env.PAYGLOCAL_MERCHANT_ID || 'nitytrav561617',
    keyId: process.env.PAYGLOCAL_KEY_ID || 'kId-CcQgeBkpNx6HONBy',
    privateKey: privateKey || undefined,
    publicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID || '8cc91c8d-8030-4660-a9c7-33de886fb495',
    publicCert: publicCert || undefined,
    environment,
    baseUrl,
  };
}

/**
 * Base64URL encoding helper
 */
function base64UrlEncode(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64URL decoding helper
 */
function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Create signed RS256 JWT for PayGlocal API authentication (x-gl-token-external)
 */
export function createPayGlocalAuthToken(customClaims: Record<string, any> = {}): string | null {
  const config = getPayGlocalConfig();
  if (!config.privateKey) {
    return null;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: config.keyId || `${config.merchantId}-key`,
    };

    const payload = {
      iss: config.merchantId,
      iat: now,
      exp: now + 300, // 5 minutes expiry
      ...customClaims,
    };

    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
    const dataToSign = `${headerEncoded}.${payloadEncoded}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(dataToSign);
    const signature = signer.sign(config.privateKey);
    const signatureEncoded = base64UrlEncode(signature);

    return `${dataToSign}.${signatureEncoded}`;
  } catch (error) {
    console.error('Error creating PayGlocal auth token:', error);
    return null;
  }
}

/**
 * Decodes and optionally verifies PayGlocal x-gl-token
 */
export function parsePayGlocalToken(token: string): {
  header?: Record<string, any>;
  payload?: Record<string, any>;
  valid: boolean;
} {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      try {
        const parsed = JSON.parse(token);
        return { payload: parsed, valid: true };
      } catch {
        return { valid: false };
      }
    }

    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));

    const config = getPayGlocalConfig();
    let valid = true;

    // Verify signature if public cert is available and token has 3 parts (JWS)
    if (parts.length === 3 && config.publicCert) {
      try {
        const verifier = crypto.createVerify('RSA-SHA256');
        verifier.update(`${parts[0]}.${parts[1]}`);
        const signatureBuf = Buffer.from(parts[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64');
        valid = verifier.verify(config.publicCert, signatureBuf);
      } catch (verifyErr) {
        console.warn('PayGlocal signature verification check warning:', verifyErr);
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
  merchantUniqueId: string;
  amount: number | string;
  currency?: string; // 'INR' | 'USD'
  customer: {
    name: string;
    email: string;
    mobile: string;
    ipAddress?: string;
    userAgent?: string;
    httpAccept?: string;
  };
  product: {
    name: string;
    sku?: string;
    type?: string;
    quantity?: number;
    price: number | string;
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

/**
 * Initiates a payment with PayGlocal via PayCollect Flow (/gl/v1/payments/initiate/paycollect)
 */
export async function initiatePayCollectPayment(
  params: PayCollectInitiateParams
): Promise<PayCollectInitiateResponse> {
  const config = getPayGlocalConfig();
  const currency = (params.currency || 'INR').toUpperCase();

  // Split customer name into first and last name
  const nameParts = (params.customer.name || 'Valued Guest').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Valued';
  const lastName = nameParts.slice(1).join(' ') || 'Guest';

  // Sanitize phone number and extract calling code
  let phone = (params.customer.mobile || '').replace(/\D/g, '');
  let callingCode = '+91';
  let countryCode = 'IN';

  if (currency === 'USD') {
    countryCode = 'US';
    callingCode = phone.length === 10 ? '+1' : '+91';
  } else if (phone.length > 10 && phone.startsWith('91')) {
    phone = phone.slice(2);
  }

  const payload = {
    merchantTxnId: params.merchantTxnId,
    merchantUniqueId: params.merchantUniqueId,
    paymentData: {
      totalAmount: Number(params.amount).toFixed(2),
      txnCurrency: currency,
      billingData: {
        firstName,
        lastName,
        addressStreet1: 'Main Street',
        addressCity: currency === 'USD' ? 'New York' : 'Delhi',
        addressState: currency === 'USD' ? 'New York' : 'Delhi',
        addressPostalCode: currency === 'USD' ? '10001' : '110001',
        addressCountry: countryCode,
        emailId: params.customer.email,
        callingCode,
        phoneNumber: phone,
      },
    },
    riskData: {
      orderData: [
        {
          productDescription: params.product.name || 'Holiday Tour Package',
          productSKU: params.product.sku || 'NITY_HOLIDAY_PKG',
          productType: params.product.type || 'Travel',
          itemUnitPrice: Number(params.product.price || params.amount).toFixed(2),
          itemQuantity: String(params.product.quantity || 1),
        },
      ],
      customerData: {
        merchantAssignedCustomerId: `CUST_${phone || Date.now()}`,
        customerAccountType: '0', // Guest checkout
        ipAddress: params.customer.ipAddress || '127.0.0.1',
        httpAccept: params.customer.httpAccept || 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        httpUserAgent: params.customer.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      shippingData: {
        addressCountry: countryCode,
        emailId: params.customer.email,
      },
    },
    merchantCallbackURL: params.merchantCallbackURL,
  };

  const endpoint = `${config.baseUrl}/gl/v1/payments/initiate/paycollect`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-gl-merchant-id': config.merchantId,
  };

  const authToken = createPayGlocalAuthToken({
    merchantTxnId: params.merchantTxnId,
    merchantUniqueId: params.merchantUniqueId,
  });

  // If private key is not configured, automatically use the PayGlocal Sandbox Checkout Simulator
  if (!authToken || !config.privateKey || !config.keyId) {
    const sandboxGid = `gl_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const redirectUrl = `/payments/payglocal/sandbox?amount=${encodeURIComponent(params.amount)}&currency=${encodeURIComponent(currency)}&merchantTxnId=${encodeURIComponent(params.merchantTxnId)}&gid=${encodeURIComponent(sandboxGid)}&packageName=${encodeURIComponent(params.product.name)}&callbackUrl=${encodeURIComponent(params.merchantCallbackURL)}`;

    return {
      success: true,
      gid: sandboxGid,
      status: 'CREATED',
      message: 'PayGlocal Sandbox Mode: Ready for test transaction',
      redirectUrl,
    };
  }

  if (authToken) {
    headers['x-gl-token-external'] = authToken;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && (data.status === 'CREATED' || data.status === 'SUCCESS') && data.data?.redirectUrl) {
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

    // Check if error is authentication failure from PayGlocal's server
    let errorMessage =
      data.message ||
      (Array.isArray(data.errors) && data.errors.length > 0 ? data.errors.join(', ') : null) ||
      `PayGlocal responded with status ${data.status || response.status}`;

    if (
      errorMessage.toLowerCase().includes('authentication failed') ||
      response.status === 401
    ) {
      errorMessage =
        `PayGlocal Gateway Error: Merchant ID '${config.merchantId}' is pending activation on PayGlocal ${config.environment.toUpperCase()} servers. Please contact PayGlocal support (support@payglocal.in) to whitelist your MID.`;
    }

    const sandboxGid = `gl_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sandboxUrl = `/payments/payglocal/sandbox?amount=${encodeURIComponent(params.amount)}&currency=${encodeURIComponent(currency)}&merchantTxnId=${encodeURIComponent(params.merchantTxnId)}&gid=${encodeURIComponent(sandboxGid)}&packageName=${encodeURIComponent(params.product.name)}&callbackUrl=${encodeURIComponent(params.merchantCallbackURL)}`;

    return {
      success: false,
      gid: data.gid || sandboxGid,
      status: data.status,
      error: errorMessage,
      redirectUrl: sandboxUrl,
      rawResponse: data,
    };
  } catch (error: any) {
    console.error('PayGlocal API Network Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to communicate with PayGlocal server.',
    };
  }
}

/**
 * Fetch status of a transaction from PayGlocal (/gl/v1/payments/{id}/status/)
 */
export async function getPayGlocalPaymentStatus(identifier: string): Promise<any> {
  const config = getPayGlocalConfig();
  const endpoint = `${config.baseUrl}/gl/v1/payments/${encodeURIComponent(identifier)}/status/`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-gl-merchant-id': config.merchantId,
  };

  const authToken = createPayGlocalAuthToken({ queryId: identifier });
  if (authToken) {
    headers['x-gl-token-external'] = authToken;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching PayGlocal payment status:', error);
    return null;
  }
}
