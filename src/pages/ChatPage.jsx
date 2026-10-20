import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import useValue from '../hooks/useValue.js';
import useRealtimeChat from '../hooks/useRealtimeChat.js';
import { answerQuestion, submitRating } from '../services/chatService.js';
import ChatWindow from '../components/features/ChatWindow.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import StateView from '../components/common/StateView.jsx';
import IconButton from '../components/common/IconButton.jsx';

function Person({ user, role, empty }) {
  const expert = role === 'ผู้เชี่ยวชาญ';
  const online = user?.expert_profile?.is_online;
  return (
    <div className={`person${user ? '' : ' empty'}`}>
      <span className={`msg-avatar${expert ? ' expert' : ''}`}>{user ? user.full_name.trim().charAt(0) : '?'}</span>
      <span className="person-text">
        <strong>{user ? user.full_name : empty}</strong>
        <small>{role}{user?.expert_profile?.specialty ? ` · ${user.expert_profile.specialty}` : ''}</small>
      </span>
      {expert && user && <StatusBadge type={online ? 'online' : 'offline'} />}
    </div>
  );
}

export default function ChatPage() {
  const { sessionId } = useParams();
  const { user, profile } = useAuth();
  const qs = useValue('questions');
  const ans = useValue('answers');
  const users = useValue('users');
  const rt = useRealtimeChat(sessionId, user.uid);
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [rated, setRated] = useState(false);

  const entry = Object.entries(qs.data || {}).find(([, q]) => q.session_id === sessionId);
  const [qid, q] = entry || [];
  const answer = Object.entries(ans.data || {}).find(([, a]) => a.question_id === qid);
  const isExpert = profile.role === 'expert';
  const allowed = q && (isExpert || q.athlete_id === user.uid);

  const finish = async () => {
    const last = [...rt.messages].reverse().find((m) => m.sender_id === user.uid);
    if (!last) { alert('กรุณาพิมพ์คำแนะนำในแชทก่อนปิดคำถาม'); return; }
    await answerQuestion(qid, q, user.uid, last.content);
  };
  const rate = async () => {
    if (!score || !answer) return;
    await submitRating({ answerId: answer[0], athleteId: user.uid, expertId: answer[1].expert_id, score, comment });
    setRated(true);
  };

  return (
    <StateView loading={qs.loading} error={qs.error} empty={!allowed} emptyText="ไม่พบห้องสนทนา หรือคุณไม่มีสิทธิ์เข้าถึง">
      {allowed && (
        <>
          <div className="section-title with-back">
            <IconButton name="back" label="กลับ" to={isExpert ? '/expert/dashboard' : '/'} />
            <div><h2>ห้องสนทนา <StatusBadge type={q.status} /></h2>
            <p>{q.sub_topic ? `${q.sub_topic} · ` : ''}{q.status === 'waiting' && !q.assigned_expert_id ? 'รอผู้เชี่ยวชาญรับคำถาม คุณสามารถพิมพ์ข้อมูลเพิ่มเติมได้' : 'พูดคุยกับผู้เชี่ยวชาญได้แบบเรียลไทม์'}</p></div>
          </div>
          <div className="people">
            <Person user={users.data?.[q.athlete_id]} role="นักกีฬา" empty="นักกีฬา" />
            <Person user={users.data?.[q.assigned_expert_id]} role="ผู้เชี่ยวชาญ" empty="รอผู้เชี่ยวชาญรับคำถาม" />
          </div>
          <ChatWindow sessionId={sessionId} currentUserId={user.uid} disabled={q.status !== 'waiting'} people={users.data || {}} />
          {isExpert && q.status === 'waiting' && q.assigned_expert_id === user.uid && (
            <button type="button" className="btn-primary fit" onClick={finish}>บันทึกคำตอบล่าสุดและปิดคำถาม</button>
          )}
          {!isExpert && q.status === 'answered' && answer && !rated && (
            <div className="panel">
              <p className="label">ให้คะแนนความพึงพอใจ</p>
              <div className="chips">{[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} className={`chip${score === n ? ' on' : ''}`} onClick={() => setScore(n)}>{n} ★</button>))}</div>
              <textarea rows="2" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="ความคิดเห็นเพิ่มเติม (ไม่บังคับ)" />
              <button type="button" className="btn-primary fit" disabled={!score} onClick={rate}>ส่งคะแนน</button>
            </div>
          )}
          {rated && <p className="state">ขอบคุณสำหรับคะแนนของคุณ</p>}
        </>
      )}
    </StateView>
  );
}
