import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StateView from '../common/StateView.jsx';
import Icon from '../common/Icon.jsx';

export default function FAQSearchList({ categoryId, faqs, categories }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cat, setCat] = useState(categoryId || '');
  const [openId, setOpenId] = useState(null);

  const filteredFaqs = useMemo(() => {
    const t = searchTerm.trim().toLowerCase();
    return Object.entries(faqs || {}).map(([id, f]) => ({ id, ...f }))
      .filter((f) => (!cat || f.category_id === cat)
        && (!t || f.question_summary.toLowerCase().includes(t) || f.answer_summary.toLowerCase().includes(t) || (f.keywords || '').toLowerCase().includes(t)))
      .sort((a, b) => b.view_count - a.view_count);
  }, [faqs, searchTerm, cat]);

  return (
    <div>
      <input className="search" type="search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ค้นหาคำถาม เช่น วิตกกังวล สมาธิ" aria-label="ค้นหา FAQ" />
      <div className="chips">
        <button type="button" className={`chip${cat === '' ? ' on' : ''}`} onClick={() => setCat('')}>ทั้งหมด</button>
        {Object.entries(categories || {}).map(([id, c]) => (
          <button type="button" key={id} className={`chip${cat === id ? ' on' : ''}`} onClick={() => setCat(id)}>{c.icon_emoji} {c.category_name_th}</button>
        ))}
      </div>
      <StateView empty={filteredFaqs.length === 0} emptyText="ไม่พบคำถามที่ตรงกับการค้นหา">
        {filteredFaqs.map((f) => (
          <div key={f.id} className="faq">
            <button type="button" className="faq-q" aria-expanded={openId === f.id} onClick={() => setOpenId(openId === f.id ? null : f.id)}>
              <span className="faq-ico"><Icon name="bulb" size={18} /></span><span className="faq-text">{f.question_summary}</span><span className="muted">{f.view_count} ครั้ง</span>
            </button>
            {openId === f.id && (
              <div className="faq-a">
                <p>{f.answer_summary}</p>
                <Link className="faq-more" to={`/ask/${f.category_id}`}>ถามผู้เชี่ยวชาญเพิ่มเติม →</Link>
              </div>
            )}
          </div>
        ))}
      </StateView>
    </div>
  );
}
