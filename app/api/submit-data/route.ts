import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, addDoc, serverTimestamp, collection, doc, updateDoc, increment } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Ensure Firebase is initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

export async function POST(request: NextRequest) {
  const { q } = await request.json();

  if (!q) {
    return new NextResponse('Missing tracking token.', { status: 400 });
  }

  try {
    const decodedString = atob(q);
    const { a: adminId, c: campaignId, e: emailId } = JSON.parse(decodedString);

    if (!adminId || !campaignId || !emailId) {
      return new NextResponse('Invalid tracking token.', { status: 400 });
    }

    // 1. Log the submission interaction
    const interactionRef = collection(db, 'admins', adminId, 'phishingCampaigns', campaignId, 'phishingEmails', emailId, 'userInteractions');
    await addDoc(interactionRef, {
      adminId: adminId,
      interactionType: 'submitted data',
      interactionTime: serverTimestamp(),
      phishingEmailId: emailId,
      phishingCampaignId: campaignId,
    });

    // 2. Increment the campaign's submitted counter (denormalized stat)
    const campaignRef = doc(db, 'admins', adminId, 'phishingCampaigns', campaignId);
    await updateDoc(campaignRef, {
      submitted: increment(1),
    });

    // 3. Return the URL for the final educational landing page
    return NextResponse.json({ redirectUrl: `/landing/${campaignId}` });

  } catch (error) {
    console.error('Data submission tracking failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}