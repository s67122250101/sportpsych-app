import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { ref, onValue, set } from 'firebase/database';
import { auth, db } from '../services/firebaseConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let offProfile = () => {};
    const offAuth = onAuthStateChanged(auth, (u) => {
      offProfile();
      setUser(u);
      if (!u) { setProfile(null); setLoading(false); return; }
      offProfile = onValue(ref(db, `users/${u.uid}`),
        (s) => { setProfile(s.val()); setLoading(false); },
        () => setLoading(false));
    });
    return () => { offProfile(); offAuth(); };
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const register = async ({ email, password, full_name, role, sport_type, specialty, credential }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const base = { full_name, email, role, profile_image: '', created_at: new Date().toISOString() };
    const extra = role === 'expert'
      ? { expert_profile: { specialty: specialty || '', is_online: true, credential: credential || '', rating_avg: 0 } }
      : { athlete_profile: { sport_type: sport_type || '', competition_level: '', age: 0 } };
    await set(ref(db, `users/${cred.user.uid}`), { ...base, ...extra });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
