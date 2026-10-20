import Icon from './Icon.jsx';

// ป้ายสถิติที่กดได้ (ใช้กรองรายการ / เลื่อนไปยังส่วนที่เกี่ยวข้อง)
export function StatTile({ icon, value, label, color, active, onClick }) {
  return (
    <button type="button" className={`stat${active ? ' on' : ''}`} style={{ '--accent': color }} onClick={onClick}>
      <span className="stat-ico"><Icon name={icon} size={22} /></span>
      <span className="stat-val">{value}</span>
      <span className="stat-lab">{label}</span>
    </button>
  );
}

// ทางลัดพร้อมไอคอน
export function ShortcutTile({ icon, label, hint, color, onClick, disabled }) {
  return (
    <button type="button" className="shortcut" style={{ '--accent': color }} onClick={onClick} disabled={disabled}>
      <span className="stat-ico"><Icon name={icon} size={22} /></span>
      <span className="shortcut-text"><strong>{label}</strong><small>{hint}</small></span>
      <Icon name="arrowRight" size={18} />
    </button>
  );
}
