import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

// ปุ่มไอคอนที่กดได้ทุกแบบ: ลิงก์ (to) หรือปุ่ม (onClick) พร้อม tooltip และ aria-label
export default function IconButton({ name, label, to, onClick, badge = 0, className = '', children }) {
  const cls = `icon-btn ${className}`;
  const inner = <>{children || <Icon name={name} />}{badge > 0 && <span className="bell-count">{badge}</span>}</>;
  return to
    ? <Link to={to} className={cls} aria-label={label} title={label}>{inner}</Link>
    : <button type="button" className={cls} aria-label={label} title={label} onClick={onClick}>{inner}</button>;
}
