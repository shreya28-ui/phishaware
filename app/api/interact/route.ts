import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, addDoc, serverTimestamp, collection, doc, updateDoc, increment } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Ensure Firebase is initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return new NextResponse('Missing tracking token.', { status: 400 });
  }

  try {
    const decodedString = atob(q);
    const { a: adminId, c: campaignId, e: emailId } = JSON.parse(decodedString);

    if (!adminId || !campaignId || !emailId) {
      return new NextResponse('Invalid tracking token.', { status: 400 });
    }

    // 1. Log the interaction
    const interactionRef = collection(db, 'admins', adminId, 'phishingCampaigns', campaignId, 'phishingEmails', emailId, 'userInteractions');
    await addDoc(interactionRef, {
      adminId: adminId,
      interactionType: 'link click',
      interactionTime: serverTimestamp(),
      phishingEmailId: emailId,
      phishingCampaignId: campaignId,
    });

    // 2. Increment the campaign's clicked counter (denormalized stat)
    const campaignRef = doc(db, 'admins', adminId, 'phishingCampaigns', campaignId);
    await updateDoc(campaignRef, {
      clicked: increment(1),
    });

    // 3. Redirect to the fake login page, passing the token
    const redirectUrl = new URL(`/login-simulation`, request.url);
    redirectUrl.searchParams.set('q', q);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Interaction tracking failed:', error);
    // Redirect to a generic error page or home page as a fallback
    const fallbackUrl = new URL('/', request.url);
    return NextResponse.redirect(fallbackUrl);
  }
}