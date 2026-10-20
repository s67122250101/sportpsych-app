import { Link } from 'react-router-dom';
import { DIMENSIONS, ORDER, STATUS, statusOf } from '../../data/assessment.js';

export default function AssessmentResult({ scores, prevScores, createdAt }) {
  const rows = ORDER.map((d) => ({ d, pct: scores[d], status: statusOf(d, scores[d]) }));
  const attention = rows.filter((r) => r.status === 'attention');
  const mid = rows.filter((r) => r.status === 'mid');
  const headline = attention.length
    ? `มี ${attention.length} ด้านที่ควรให้ความสำคัญ: ${attention.map((r) => DIMENSIONS[r.d].name).join(', ')}`
    : mid.length ? 'โดยรวมอยู่ในเกณฑ์ดี มีบางด้านที่ควรเฝ้าสังเกต' : 'ภาพรวมสภาพจิตใจอยู่ในเกณฑ์ดีทุกด้าน';

  return (
    <div className="result">
      <div className="result-head">
        <h3>{headline}</h3>
        <p className="muted">ทำเมื่อ {new Date(createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</p>
      </div>
      {rows.map(({ d, pct, status }) => {
        const dim = DIMENSIONS[d];
        const st = STATUS[status];
        const delta = prevScores ? pct - prevScores[d] : null;
        return (
          <section key={d} className="dim-card" style={{ '--accent': st.color }}>
            <div className="dim-top">
              <span className="dim-icon">{dim.icon}</span>
              <div className="dim-title">
                <strong>ระดับ{dim.name}</strong>
                <span className="dim-status">{st.label}</span>
              </div>
              <span className="dim-pct">{pct}%{delta !== null && delta !== 0 && <small>{delta > 0 ? '▲' : '▼'} {Math.abs(delta)}</small>}</span>
            </div>
            <div className="bar" role="img" aria-label={`ระดับ${dim.name} ${pct} เปอร์เซ็นต์`}><span style={{ width: `${pct}%` }} /></div>
            <p className="dim-tip">{dim.tips[status]}</p>
            <div className="dim-actions">
              <Link className="btn-sm" to="/faq?cat=C01">อ่านความรู้</Link>
              {status !== 'good' && <Link className="btn-sm ghost" to={`/ask/C01?sub=${encodeURIComponent(dim.name)}`}>ปรึกษาผู้เชี่ยวชาญ</Link>}
            </div>
          </section>
        );
      })}
      <p className="disclaimer">
        แบบประเมินนี้ใช้เพื่อสะท้อนตนเองเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ หากรู้สึกแย่ต่อเนื่องหรือมีความคิดทำร้ายตัวเอง
        ติดต่อสายด่วนสุขภาพจิต 1323 (24 ชั่วโมง) หรือบอกคนที่ไว้ใจทันที
      </p>
    </div>
  );
}
