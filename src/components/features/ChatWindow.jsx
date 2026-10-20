import { useEffect, useRef, useState } from 'react';
import useRealtimeChat from '../../hooks/useRealtimeChat.js';
import { sendMessage } from '../../services/chatService.js';
import StateView from '../common/StateView.jsx';
import Icon from '../common/Icon.jsx';

export default function ChatWindow({ sessionId, currentUserId, disabled, people = {} }) {
  const { messages, loading, error } = useRealtimeChat(sessionId, currentUserId);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const send = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isSending) return;
    setIsSending(true);
    try { await sendMessage(sessionId, currentUserId, text); setInputText(''); }
    finally { setIsSending(false); }
  };

  return (
    <div className="chat">
      <div className="chat-list">
        <StateView loading={loading} error={error} empty={messages.length === 0} emptyText="ยังไม่มีข้อความ เริ่มพิมพ์ได้เลย">
          {messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            const p = people[m.sender_id] || {};
            const expert = p.role === 'expert';
            return (
              <div key={m.id} className={`msg ${mine ? 'me' : 'other'}`}>
                <span className={`msg-avatar${expert ? ' expert' : ''}`} title={p.full_name}>{(p.full_name || '?').trim().charAt(0)}</span>
                <div className="msg-body">
                  <span className="msg-name">{mine ? 'คุณ' : p.full_name || 'ผู้ใช้'}{expert && <em>ผู้เชี่ยวชาญ</em>}</span>
                  <div className={`bubble ${mine ? 'me' : 'other'}`}>
                    {m.content}
                    <small>{new Date(m.sent_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}{mine && m.is_read ? ' · อ่านแล้ว' : ''}</small>
                  </div>
                </div>
              </div>
            );
          })}
        </StateView>
        <div ref={endRef} />
      </div>
      <form className="chat-input" onSubmit={send}>
        <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={disabled ? 'ปิดการสนทนาแล้ว' : 'พิมพ์ข้อความ...'} disabled={disabled} maxLength={1000} />
        <button type="submit" className="send-btn" disabled={disabled || isSending} aria-label="ส่งข้อความ" title="ส่งข้อความ"><Icon name="send" size={18} /></button>
      </form>
    </div>
  );
}
