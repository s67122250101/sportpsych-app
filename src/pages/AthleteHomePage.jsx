import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import useValue from '../hooks/useValue.js';
import CategoryCard from '../components/common/CategoryCard.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import StateView from '../components/common/StateView.jsx';
import { StatTile, ShortcutTile } from '../components/common/Tiles.jsx';

export default function AthleteHomePage() {
  const nav = useNavigate();
  const { user } = useAuth();
  const cats = useValue('categories');
  const qs = useValue('questions');
  const [filter, setFilter] = useState('all');
  const catRef = useRef(null);
  const listRef = useRef(null);

  const list = Object.entries(cats.data || {}).sort((a, b) => a[1].sort_order - b[1].sort_order);
  const mine = Object.values(qs.data || {}).filter((q) => q.athlete_id === user.uid).sort((a, b) => b.created_at - a.created_at);
  const count = (s) => mine.filter((q) => q.status === s).length;
  const shown = filter === 'all' ? mine : mine.filter((q) => q.status === filter);
  const scrollTo = (r) => r.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const pick = (f) => { setFilter(f); scrollTo(listRef); };
  const go = (id, sub) => nav(`/ask/${id}${sub ? `?sub=${encodeURIComponent(sub)}` : ''}`);

  return (
    <>
      <div className="stats">
        <StatTile icon="clock" value={count('waiting')} label="รอผู้เชี่ยวชาญ" color="#fb8c00" active={filter === 'waiting'} onClick={() => pick('waiting')} />
        <StatTile icon="check" value={count('answered')} label="ตอบแล้ว" color="#00897b" active={filter === 'answered'} onClick={() => pick('answered')} />
        <StatTile icon="chat" value={mine.length} label="คำถามทั้งหมด" color="#1e88e5" active={filter === 'all'} onClick={() => pick('all')} />
      </div>

      <div className="section-title" ref={catRef}>
        <h2>เลือกประเภทระบบตอบคำถาม</h2>
        <p>เลือกหมวดหมู่ที่ตรงกับความต้องการของคุณ หรือกดหัวข้อย่อยเพื่อเริ่มถามเรื่องนั้นได้ทันที</p>
      </div>
      <StateView loading={cats.loading} error={cats.error} empty={list.length === 0}>
        <div className="cards-grid">
          {list.map(([id, c]) => (
            <CategoryCard key={id} badgeNum={c.sort_order} title={c.category_name_th} description={c.description}
              subItems={c.sub_items} buttonColor={c.button_color} icon={c.icon_emoji} onSelect={(sub) => go(id, sub)} />
          ))}
        </div>
      </StateView>

      <div className="shortcuts">
        <ShortcutTile icon="clipboard" label="แบบประเมินจิตใจ" hint="20 ข้อ ดูผลทันที" color="#e64a19" onClick={() => nav('/assessment')} />
        <ShortcutTile icon="book" label="คลังความรู้" hint="ค้นหาคำถามที่พบบ่อย" color="#7e57c2" onClick={() => nav('/faq')} />
        <ShortcutTile icon="chat" label="แชทล่าสุด" hint={mine[0] ? 'กลับไปคุยต่อ' : 'ยังไม่มีแชท'} color="#00897b" disabled={!mine[0]} onClick={() => nav(`/chat/${mine[0].session_id}`)} />
        <ShortcutTile icon="plus" label="ถามคำถามใหม่" hint="เลือกหมวดหมู่ด้านบน" color="#1e88e5" onClick={() => scrollTo(catRef)} />
      </div>

      <h3 className="sub-head" ref={listRef}>คำถามของฉัน {filter !== 'all' && <button type="button" className="link-btn" onClick={() => setFilter('all')}>แสดงทั้งหมด</button>}</h3>
      <StateView loading={qs.loading} error={qs.error} empty={shown.length === 0} emptyText="ไม่มีคำถามในรายการนี้ เลือกหมวดหมู่ด้านบนเพื่อเริ่มปรึกษา">
        {shown.map((q) => (
          <Link key={q.session_id} to={`/chat/${q.session_id}`} className="row">
            <span>{q.content.slice(0, 70)}</span><StatusBadge type={q.status} />
          </Link>
        ))}
      </StateView>
    </>
  );
}
