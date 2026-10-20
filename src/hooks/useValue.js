import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../services/firebaseConfig';

// อ่านข้อมูลแบบเรียลไทม์จาก path พร้อมสถานะ loading / error
export default function useValue(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    if (!path) return undefined;
    setState({ data: null, loading: true, error: null });
    return onValue(ref(db, path),
      (s) => setState({ data: s.val(), loading: false, error: null }),
      (error) => setState({ data: null, loading: false, error }));
  }, [path]);
  return state;
}
