import { NextResponse } from 'next/server';
import { db } from '../../../utils/firebase'; // Adjust the path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function GET(req) {
  const userId = req.headers.get('user-id'); // Replace this with your actual method of retrieving the user ID
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
