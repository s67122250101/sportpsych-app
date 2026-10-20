import { ref, push, set } from 'firebase/database';
import { db } from './firebaseConfig';

export const saveAssessmentResult = (uid, payload) => set(push(ref(db, `assessment_results/${uid}`)), payload);
