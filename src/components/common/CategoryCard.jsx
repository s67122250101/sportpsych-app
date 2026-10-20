import { useState } from 'react';

// ทุกส่วนที่เป็นไอคอน/ตัวเลข/ชื่อ/หัวข้อย่อย กดเพื่อเลือกหมวดหมู่ได้
export default function CategoryCard({ badgeNum, title, description, subItems = [], buttonColor, icon, onSelect, actionLabel = 'เลือก >' }) {
  const [isHovered, setIsHovered] = useState(false);
  const label = `เลือก ${title}`;
  return (
    <article className={`card${isHovered ? ' hover' : ''}`} style={{ '--accent': buttonColor }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button type="button" className="card-number" onClick={() => onSelect()} aria-label={label} title={label}>{badgeNum}</button>
      <button type="button" className="card-icon" onClick={() => onSelect()} aria-label={label} title={label}><span>{icon}</span></button>
      <h3 className="card-title"><button type="button" onClick={() => onSelect()}>{title}</button></h3>
      <p className="card-desc">{description}</p>
      <ul className="card-list">
        {subItems.map((s) => (
          <li key={s}><button type="button" onClick={() => onSelect(s)} title={`ถามเรื่อง ${s}`}>{s}</button></li>
        ))}
      </ul>
      <button type="button" className="btn-select" onClick={() => onSelect()}>{actionLabel}</button>
    </article>
  );
}
