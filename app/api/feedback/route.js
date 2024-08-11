import { NextResponse } from 'next/server';
import { db } from '../../../utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { rating, feedback } = await request.json();

    console.log('Received feedback:', { rating, feedback });

    if (rating === undefined || rating === null) {
      console.log('Rating is missing');
      return NextResponse.json({ error: 'Rating is required.' }, { status: 400 });
    }

    const feedbackRef = collection(db, 'feedbacks');
    console.log('Adding document to collection:', feedbackRef);

    await addDoc(feedbackRef, {
      rating,
      feedback,
      timestamp: new Date(),
    });

    return NextResponse.json({ message: 'Feedback submitted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
