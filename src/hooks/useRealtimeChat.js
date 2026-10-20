import { useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../services/firebaseConfig';

export default function useRealtimeChat(sessionId, currentUserId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return undefined;
    setLoading(true);
    return onValue(ref(db, `chat_messages/${sessionId}`), (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val).map(([id, m]) => ({ id, ...m })).sort((a, b) => a.sent_at - b.sent_at);
      setMessages(list);
      setLoading(false);
      const unread = {};
      list.forEach((m) => { if (m.sender_id !== currentUserId && !m.is_read) unread[`${m.id}/is_read`] = true; });
      if (Object.keys(unread).length) update(ref(db, `chat_messages/${sessionId}`), unread).catch(() => {});
    }, (e) => { setError(e); setLoading(false); });
  }, [sessionId, currentUserId]);

  return { messages, loading, error };
}
