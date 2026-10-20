import { useState } from 'react';

export default function QuestionForm({ category, initialSubTopic = '', onSubmit }) {
  const [subTopic, setSubTopic] = useState(initialSubTopic);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (text.length < 10) { setError('กรุณาพิมพ์รายละเอียดอย่างน้อย 10 ตัวอักษร'); return; }
    if (text.length > 1000) { setError('ข้อความยาวเกิน 1,000 ตัวอักษร'); return; }
    setError(''); setIsSending(true);
    try { await onSubmit({ subTopic, content: text }); }
    catch { setError('ส่งคำถามไม่สำเร็จ โปรดลองใหม่อีกครั้ง'); setIsSending(false); }
  };

  return (
    <form className="panel" onSubmit={handle}>
      <p className="label">เลือกหัวข้อย่อย</p>
      <div className="chips">
        {(category.sub_items || []).map((s) => (
          <button type="button" key={s} className={`chip${subTopic === s ? ' on' : ''}`} onClick={() => setSubTopic(subTopic === s ? '' : s)}>{s}</button>
        ))}
      </div>
      <label className="label" htmlFor="q">รายละเอียดที่ต้องการปรึกษา</label>
      <textarea id="q" rows="6" value={content} onChange={(e) => setContent(e.target.value)} placeholder="เช่น รู้สึกกังวลมากก่อนแข่งพรุ่งนี้ หัวใจเต้นเร็ว ควรทำอย่างไรดี" />
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit" className="btn-primary" disabled={isSending}>{isSending ? 'กำลังส่ง...' : 'ส่งคำถาม'}</button>
    </form>
  );
}
