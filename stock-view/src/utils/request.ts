import { db } from '@/firebase.config';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
export const AddSingleDoc = async (collections: string, body: any) => {
  try {
    const docRef = await addDoc(collection(db, collections), body);
    await updateDoc(doc(db, collections, docRef.id), {
      id: docRef.id,
    });
    return docRef.id;
  } catch (error) {
    console.log('error ', error);
    throw error;
  }
};
