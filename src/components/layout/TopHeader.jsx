import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import useValue from '../../hooks/useValue.js';
import { markAllRead } from '../../services/chatService.js';
import Icon from '../common/Icon.jsx';
import IconButton from '../common/IconButton.jsx';

export default function TopHeader() {
  const { user, profile, logout } = useAuth();
  const { data } = useValue(user ? `notifications/${user.uid}` : null);
  const [open, setOpen] = useState(null); // 'bell' | 'user' | null
  const wrap = useRef(null);

  const list = Object.entries(data || {}).map(([id, n]) => ({ id, ...n })).sort((a, b) => b.created_at - a.created_at);
  const unread = list.filter((n) => !n.is_read).length;
  const expert = profile?.role === 'expert';

  useEffect(() => {
    const close = (e) => { if (e.type === 'keydown' ? e.key === 'Escape' : !wrap.current?.contains(e.target)) setOpen(null); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, []);

  const toggleBell = () => {
    if (open === 'bell' && unread) markAllRead(user.uid, data).catch(() => {});
    setOpen(open === 'bell' ? null : 'bell');
  };

  return (
    <header className="header-bar">
      <span className="hello">ยินดีต้อนรับกลับ, <strong>{profile?.full_name}</strong></span>
      <div className="header-actions" ref={wrap}>
        <div className="menu-wrap">
          <IconButton name="bell" label="การแจ้งเตือน" badge={unread} onClick={toggleBell} />
          {open === 'bell' && (
            <div className="menu" role="menu">
              <p className="menu-title">การแจ้งเตือน</p>
              {list.length === 0 ? <p className="muted pad">ยังไม่มีการแจ้งเตือน</p>
                : list.slice(0, 8).map((n) => (
                  <p key={n.id} className={`notice${n.is_read ? ' muted' : ''}`}><Icon name="bell" size={14} />{n.message}</p>
                ))}
            </div>
          )}
        </div>
        <div className="menu-wrap">
          <button type="button" className="avatar" onClick={() => setOpen(open === 'user' ? null : 'user')} aria-label="เมนูผู้ใช้" title="เมนูผู้ใช้">
            {(profile?.full_name || '?').trim().charAt(0)}
          </button>
          {open === 'user' && (
            <div className="menu" role="menu">
              <p className="menu-title">{profile?.full_name}<small>{expert ? 'ผู้เชี่ยวชาญ' : 'นักกีฬา'}</small></p>
              <Link className="menu-item" to={expert ? '/expert/dashboard' : '/'} onClick={() => setOpen(null)}><Icon name="home" size={16} />หน้าหลัก</Link>
              <Link className="menu-item" to="/faq" onClick={() => setOpen(null)}><Icon name="book" size={16} />คลังความรู้</Link>
              <button type="button" className="menu-item" onClick={logout}><Icon name="logout" size={16} />ออกจากระบบ</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
