import { NextResponse } from 'next/server';
import { parsePayGlocalToken, getPayGlocalPaymentStatus } from '@/lib/payglocal';

export async function POST(req: Request) {
  try {
    let token = '';
    let directParams: Record<string, string> = {};

    const contentType = req.headers.get('content-type') || '';
    if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await req.formData();
      token = (formData.get('x-gl-token') as string) || (formData.get('token') as string) || '';
      formData.forEach((value, key) => {
        if (typeof value === 'string') directParams[key] = value;
      });
    } else if (contentType.includes('application/json')) {
      const jsonBody = await req.json();
      token = jsonBody['x-gl-token'] || jsonBody['token'] || '';
      directParams = jsonBody;
    } else {
      const rawText = await req.text();
      const params = new URLSearchParams(rawText);
      token = params.get('x-gl-token') || params.get('token') || '';
      params.forEach((val, key) => {
        directParams[key] = val;
      });
    }

    let status = directParams.status || '';
    let gid = directParams.gid || '';
    let merchantTxnId = directParams.merchantTxnId || directParams.merchantUniqueId || '';
    let amount = directParams.amount || '';
    let currency = directParams.currency || directParams.txnCurrency || 'INR';
    let packageName = directParams.package || directParams.packageName || '';
    let reasonCode = directParams.reasonCode || '';
    let message = directParams.message || '';

    // If x-gl-token is provided, parse and extract payload details
    if (token) {
      const { payload } = parsePayGlocalToken(token);
      if (payload) {
        status = payload.status || status;
        gid = payload.gid || gid;
        merchantTxnId = payload.merchantTxnId || payload.merchantUniqueId || merchantTxnId;
        amount = payload.amount || payload.totalAmount || amount;
        currency = payload.currency || payload.txnCurrency || currency;
        packageName = payload.package || payload.packageName || packageName;
        reasonCode = payload.reasonCode || reasonCode;
        message = payload.message || message;
      }
    }

    // If status is still ambiguous or CREATED/INPROGRESS and is a real PayGlocal GID
    if (gid && !gid.startsWith('gl_sim_') && (!status || status === 'CREATED' || status === 'INPROGRESS')) {
      const statusRes = await getPayGlocalPaymentStatus(gid);
      if (statusRes?.data?.status) {
        status = statusRes.data.status;
        amount = statusRes.data.Amount || amount;
        currency = statusRes.data.currency || statusRes.data.txnCurrency || currency;
        merchantTxnId = statusRes.data.merchantTxnId || merchantTxnId;
        message = statusRes.data.detailedMessage || message;
      } else if (statusRes?.status) {
        status = statusRes.status;
      }
    }

    // PayGlocal successful statuses: SENT_FOR_CAPTURE, AUTHORIZED, CAPTURED, SUCCESS, COMPLETED
    const isSuccess =
      status === 'SENT_FOR_CAPTURE' ||
      status === 'AUTHORIZED' ||
      status === 'CAPTURED' ||
      status === 'SUCCESS' ||
      status === 'COMPLETED';

    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (host ? `${protocol}://${host}` : 'https://www.nityholiday.com');

    const redirectUrl = new URL('/payment-status', baseUrl);
    redirectUrl.searchParams.set('status', isSuccess ? 'SUCCESS' : 'FAILURE');

    if (gid) redirectUrl.searchParams.set('gid', gid);
    if (merchantTxnId) redirectUrl.searchParams.set('order_id', merchantTxnId);
    if (amount) redirectUrl.searchParams.set('amount', amount);
    if (currency) redirectUrl.searchParams.set('currency', currency);
    if (packageName) redirectUrl.searchParams.set('package', packageName);
    if (reasonCode) redirectUrl.searchParams.set('reason', reasonCode);

    if (!isSuccess) {
      const failureMsg =
        message ||
        (status === 'CUSTOMER_CANCELLED'
          ? 'Payment was cancelled by the user.'
          : status === 'ISSUER_DECLINE'
          ? 'Payment was declined by the card issuer/bank.'
          : status === 'AUTHENTICATION_TIMEOUT'
          ? 'Payment authentication timed out. Please try again.'
          : status === 'ABANDONED'
          ? 'Payment was abandoned before completion.'
          : `Payment failed with status: ${status || 'DECLINED'}`);
      redirectUrl.searchParams.set('msg', failureMsg);
    }

    return NextResponse.redirect(redirectUrl.toString(), 303);
  } catch (error: any) {
    console.error('Error handling PayGlocal callback:', error);
    return NextResponse.redirect(
      new URL('/payment-status?status=FAILURE&msg=Callback+Processing+Error', req.url),
      303
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('x-gl-token') || searchParams.get('token');
    const gid = searchParams.get('gid');
    const statusParam = searchParams.get('status');

    if (token || gid || statusParam) {
      let status = statusParam || '';
      let extractedGid = gid || '';
      let orderId = searchParams.get('merchantTxnId') || searchParams.get('order_id') || '';
      let amount = searchParams.get('amount') || '';
      let currency = searchParams.get('currency') || searchParams.get('txnCurrency') || 'INR';
      let packageName = searchParams.get('package') || searchParams.get('packageName') || '';
      let message = searchParams.get('message') || '';

      if (token) {
        const { payload } = parsePayGlocalToken(token);
        if (payload) {
          status = payload.status || status;
          extractedGid = payload.gid || extractedGid;
          orderId = payload.merchantTxnId || payload.merchantUniqueId || orderId;
          amount = payload.amount || amount;
          currency = payload.currency || payload.txnCurrency || currency;
          packageName = payload.package || payload.packageName || packageName;
          message = payload.message || message;
        }
      }

      if (extractedGid && !extractedGid.startsWith('gl_sim_') && (!status || status === 'CREATED' || status === 'INPROGRESS')) {
        const statusRes = await getPayGlocalPaymentStatus(extractedGid);
        if (statusRes?.data?.status) {
          status = statusRes.data.status;
          amount = statusRes.data.Amount || amount;
          currency = statusRes.data.currency || statusRes.data.txnCurrency || currency;
          orderId = statusRes.data.merchantTxnId || orderId;
        }
      }

      const isSuccess =
        status === 'SENT_FOR_CAPTURE' ||
        status === 'AUTHORIZED' ||
        status === 'CAPTURED' ||
        status === 'SUCCESS' ||
        status === 'COMPLETED';

      const host = req.headers.get('host');
      const protocol = req.headers.get('x-forwarded-proto') || 'https';
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (host ? `${protocol}://${host}` : 'https://www.nityholiday.com');

      const redirectUrl = new URL('/payment-status', baseUrl);
      redirectUrl.searchParams.set('status', isSuccess ? 'SUCCESS' : 'FAILURE');
      if (extractedGid) redirectUrl.searchParams.set('gid', extractedGid);
      if (orderId) redirectUrl.searchParams.set('order_id', orderId);
      if (amount) redirectUrl.searchParams.set('amount', amount);
      if (currency) redirectUrl.searchParams.set('currency', currency);
      if (packageName) redirectUrl.searchParams.set('package', packageName);
      if (!isSuccess && message) redirectUrl.searchParams.set('msg', message);

      return NextResponse.redirect(redirectUrl.toString(), 303);
    }

    return NextResponse.redirect(new URL('/packages', req.url), 303);
  } catch (error: any) {
    console.error('Error handling PayGlocal GET callback:', error);
    return NextResponse.redirect(
      new URL('/payment-status?status=FAILURE&msg=Callback+Error', req.url),
      303
    );
  }
}
