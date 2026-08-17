import { NextResponse } from 'next/server';
import { decryptCCAvenue } from '@/lib/ccavenue';

export async function POST(req: Request) {
  try {
    const workingKey = process.env.CCAVENUE_WORKING_KEY;
    if (!workingKey) {
      console.error('CCAVENUE_WORKING_KEY missing');
      return NextResponse.redirect(new URL('/payment-status?status=FAILURE&msg=Gateway+Config+Error', req.url), 303);
    }

    let encResp = '';

    // Handle application/x-www-form-urlencoded or multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      encResp = (formData.get('encResp') as string) || '';
    } else {
      const rawText = await req.text();
      const params = new URLSearchParams(rawText);
      encResp = params.get('encResp') || '';
    }

    if (!encResp) {
      console.error('No encResp found in CCAvenue callback');
      return NextResponse.redirect(new URL('/payment-status?status=FAILURE&msg=Missing+Payment+Response', req.url), 303);
    }

    const decrypted = decryptCCAvenue(encResp, workingKey);
    const parsedParams = new URLSearchParams(decrypted);

    const orderStatus = parsedParams.get('order_status'); // 'Success', 'Failure', 'Aborted'
    const orderId = parsedParams.get('order_id') || '';
    const trackingId = parsedParams.get('tracking_id') || '';
    const amount = parsedParams.get('amount') || '';
    const packageName = parsedParams.get('merchant_param1') || '';
    const travelDate = parsedParams.get('merchant_param2') || '';
    const guests = parsedParams.get('merchant_param3') || '';
    const failureMsg = parsedParams.get('failure_message') || parsedParams.get('status_message') || '';

    console.log('CCAvenue Callback Decrypted:', {
      orderStatus,
      orderId,
      trackingId,
      amount,
      packageName,
      failureMsg,
    });

    const host = req.headers.get('host');
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}` || 'https://www.nityholiday.com';

    const statusParam = (orderStatus || '').toLowerCase() === 'success' ? 'SUCCESS' : 'FAILURE';
    const redirectUrl = new URL('/payment-status', baseUrl);
    redirectUrl.searchParams.set('status', statusParam);
    if (orderId) redirectUrl.searchParams.set('order_id', orderId);
    if (trackingId) redirectUrl.searchParams.set('tracking_id', trackingId);
    if (amount) redirectUrl.searchParams.set('amount', amount);
    if (packageName) redirectUrl.searchParams.set('package', packageName);
    if (travelDate) redirectUrl.searchParams.set('date', travelDate);
    if (guests) redirectUrl.searchParams.set('guests', guests);
    if (failureMsg && statusParam === 'FAILURE') redirectUrl.searchParams.set('msg', failureMsg);

    return NextResponse.redirect(redirectUrl.toString(), 303);
  } catch (error: any) {
    console.error('Error handling CCAvenue response callback:', error);
    return NextResponse.redirect(new URL('/payment-status?status=FAILURE&msg=Response+Processing+Error', req.url), 303);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const encResp = searchParams.get('encResp');
    const workingKey = process.env.CCAVENUE_WORKING_KEY;

    if (encResp && workingKey) {
      const decrypted = decryptCCAvenue(encResp, workingKey);
      const parsedParams = new URLSearchParams(decrypted);

      const orderStatus = parsedParams.get('order_status');
      const orderId = parsedParams.get('order_id') || '';
      const trackingId = parsedParams.get('tracking_id') || '';
      const amount = parsedParams.get('amount') || '';
      const packageName = parsedParams.get('merchant_param1') || '';
      const failureMsg = parsedParams.get('failure_message') || parsedParams.get('status_message') || '';

      const host = req.headers.get('host');
      const protocol = req.headers.get('x-forwarded-proto') || 'https';
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}` || 'https://www.nityholiday.com';

      const statusParam = (orderStatus || '').toLowerCase() === 'success' ? 'SUCCESS' : 'FAILURE';
      const redirectUrl = new URL('/payment-status', baseUrl);
      redirectUrl.searchParams.set('status', statusParam);
      if (orderId) redirectUrl.searchParams.set('order_id', orderId);
      if (trackingId) redirectUrl.searchParams.set('tracking_id', trackingId);
      if (amount) redirectUrl.searchParams.set('amount', amount);
      if (packageName) redirectUrl.searchParams.set('package', packageName);
      if (failureMsg && statusParam === 'FAILURE') redirectUrl.searchParams.set('msg', failureMsg);

      return NextResponse.redirect(redirectUrl.toString(), 303);
    }

    // Default redirect to home/packages if visited with no data
    return NextResponse.redirect(new URL('/packages', req.url), 303);
  } catch (error: any) {
    console.error('Error handling CCAvenue GET response:', error);
    return NextResponse.redirect(new URL('/payment-status?status=FAILURE', req.url), 303);
  }
}

