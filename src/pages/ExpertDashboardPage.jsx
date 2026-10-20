import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import useValue from '../hooks/useValue.js';
import { acceptQuestion } from '../services/chatService.js';
import StatusBadge from '../components/common/StatusBadge.jsx';
import StateView from '../components/common/StateView.jsx';
import { StatTile } from '../components/common/Tiles.jsx';

export default function ExpertDashboardPage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const qs = useValue('questions');
  const users = useValue('users');
  const cats = useValue('categories');
  const all = Object.entries(qs.data || {}).map(([id, q]) => ({ id, ...q })).sort((a, b) => a.created_at - b.created_at);
  const queue = all.filter((q) => q.status === 'waiting' && !q.assigned_expert_id);
  const mine = all.filter((q) => q.assigned_expert_id === user.uid).reverse();
  const queueRef = useRef(null);
  const mineRef = useRef(null);
  const go = (r) => r.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const name = (id) => users.data?.[id]?.full_name || 'นักกีฬา';

  const accept = async (q) => { await acceptQuestion(q.id, q, user.uid); nav(`/chat/${q.session_id}`); };
  const Row = ({ q, action }) => (
    <div className="row">
      <span><strong>{name(q.athlete_id)}</strong> · {cats.data?.[q.category_id]?.category_name_th}<br />{q.content.slice(0, 80)}</span>
      <span className="row-act"><StatusBadge type={q.status} />{action}</span>
    </div>
  );

  return (
    <>
      <div className="section-title"><h2>คิวคำถาม</h2><p>รับคำถามจากนักกีฬาและตอบกลับผ่านห้องแชท</p></div>
      <div className="stats">
        <StatTile icon="clock" value={queue.length} label="รอรับคำถาม" color="#fb8c00" onClick={() => go(queueRef)} />
        <StatTile icon="chat" value={mine.filter((q) => q.status === 'waiting').length} label="กำลังสนทนา" color="#1e88e5" onClick={() => go(mineRef)} />
        <StatTile icon="check" value={mine.filter((q) => q.status === 'answered').length} label="ตอบแล้ว" color="#00897b" onClick={() => go(mineRef)} />
      </div>
      <StateView loading={qs.loading} error={qs.error}>
        <h3 className="sub-head" ref={queueRef}>รอรับคำถาม ({queue.length})</h3>
        {queue.length === 0 ? <div className="state">ไม่มีคำถามค้างในคิว</div>
          : queue.map((q) => <Row key={q.id} q={q} action={<button type="button" className="btn-sm" onClick={() => accept(q)}>รับคำถาม</button>} />)}
        <h3 className="sub-head" ref={mineRef}>คำถามที่ฉันรับ ({mine.length})</h3>
        {mine.length === 0 ? <div className="state">ยังไม่มีคำถามที่รับไว้</div>
          : mine.map((q) => <Row key={q.id} q={q} action={<button type="button" className="btn-sm" onClick={() => nav(`/chat/${q.session_id}`)}>เปิดแชท</button>} />)}
      </StateView>
    </>
  );
}
