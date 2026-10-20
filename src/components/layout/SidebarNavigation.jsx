import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import Icon from '../common/Icon.jsx';

export default function SidebarNavigation() {
  const { profile, logout } = useAuth();
  const expert = profile?.role === 'expert';
  const home = expert ? '/expert/dashboard' : '/';
  const items = [[home, expert ? 'queue' : 'home', expert ? 'คิวคำถาม' : 'หน้าหลัก'],
    ...(expert ? [] : [['/assessment', 'clipboard', 'แบบประเมินสภาพจิตใจ']]),
    ['/faq', 'book', 'ความรู้จิตวิทยาการกีฬา']];
  return (
    <aside className="sidebar">
      <div>
        <Link to={home} className="sidebar-brand" title="กลับหน้าหลัก">
          <span className="logo-tile">🧠</span>
          <span>จิตวิทยาการกีฬา<br />สำหรับนักกีฬา</span>
        </Link>
        <nav>
          {items.map(([to, icon, label]) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-ico"><Icon name={icon} size={18} /></span>{label}
            </NavLink>
          ))}
          <button type="button" className="nav-item" onClick={logout}>
            <span className="nav-ico"><Icon name="logout" size={18} /></span>ออกจากระบบ
          </button>
        </nav>
      </div>
      <Link to="/faq" className="quote-box" title="เปิดคลังความรู้">
        <Icon name="bulb" size={18} />
        <span>"จิตใจที่แข็งแกร่ง สร้างชัยชนะที่ยิ่งใหญ่ได้เสมอ"</span>
      </Link>
    </aside>
  );
}
