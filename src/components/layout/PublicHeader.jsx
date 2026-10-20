import { Link, NavLink } from 'react-router-dom';

// แถบเมนูสำหรับผู้เยี่ยมชมที่ยังไม่ล็อกอิน
export default function PublicHeader() {
  return (
    <header className="public-header">
      <Link to="/" className="public-brand" title="หน้าแรก">
        <span className="logo-tile sm">🧠</span>
        <span>จิตวิทยาการกีฬา<small>สำหรับนักกีฬา</small></span>
      </Link>
      <nav className="public-nav" aria-label="เมนูหลัก">
        <NavLink to="/" end>หน้าแรก</NavLink>
        <NavLink to="/faq">คลังความรู้</NavLink>
      </nav>
      <div className="public-actions">
        <Link to="/login" className="btn-secondary pill">เข้าสู่ระบบ</Link>
        <Link to="/login?mode=register" className="btn-primary pill">สมัครสมาชิก</Link>
      </div>
    </header>
  );
}
