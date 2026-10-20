import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import Icon from '../components/common/Icon.jsx';
import IconButton from '../components/common/IconButton.jsx';

const ERR = {
  'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
  'auth/email-already-in-use': 'อีเมลนี้ถูกใช้สมัครแล้ว',
  'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
  'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
};
const FEATURES = [['🧠', 'เสริมสร้างสมาธิ'], ['🎯', 'พัฒนาจิตใจ'], ['📈', 'เพิ่มศักยภาพ']];

export default function LoginPage() {
  const { user, profile, login, register } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [sp] = useSearchParams();
  const from = loc.state?.from || '/';
  const [mode, setMode] = useState(sp.get('mode') === 'register' ? 'register' : 'login');
  const [f, setF] = useState({ email: '', password: '', full_name: '', role: 'athlete', sport_type: '', specialty: '', credential: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (user && profile) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (mode === 'register' && !f.full_name.trim()) { setError('กรุณากรอกชื่อ-นามสกุล'); return; }
    setBusy(true); setError('');
    try {
      if (mode === 'login') await login(f.email, f.password);
      else await register({ ...f, full_name: f.full_name.trim() });
    } catch (err) { setError(ERR[err.code] || 'เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง'); }
    finally { setBusy(false); }
  };

  return (
    <div className="login-wrap">
      <div className="login-container">
        <div className="login-banner">
          <span className="logo-tile big">🧠</span>
          <h1>จิตวิทยาการกีฬาสำหรับนักกีฬา</h1>
          <p>พัฒนาจิตใจ เสริมศักยภาพทางกีฬา สู่ความสำเร็จ<br />"จิตใจที่แข็งแกร่ง คือ กุญแจสู่ชัยชนะ"</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          <Link to="/" className="back-link"><Icon name="back" size={16} />กลับหน้าแรก</Link>
          {loc.state?.reason && <p className="login-note">กรุณาเข้าสู่ระบบหรือสมัครสมาชิกก่อน เพื่อตั้งคำถาม แชท หรือทำแบบประเมิน</p>}
          <h2>{mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
          {mode === 'register' && (
            <>
              <input placeholder="ชื่อ-นามสกุล" value={f.full_name} onChange={set('full_name')} required />
              <select value={f.role} onChange={set('role')} aria-label="บทบาท">
                <option value="athlete">นักกีฬา</option>
                <option value="expert">ผู้เชี่ยวชาญ</option>
              </select>
              {f.role === 'athlete' && <input placeholder="ประเภทกีฬา (ไม่บังคับ)" value={f.sport_type} onChange={set('sport_type')} />}
              {f.role === 'expert' && (
                <>
                  <input placeholder="สาขาที่เชี่ยวชาญ เช่น ความวิตกกังวลก่อนแข่งขัน" value={f.specialty} onChange={set('specialty')} />
                  <input placeholder="วุฒิ/ประสบการณ์ เช่น ปริญญาโทจิตวิทยาการกีฬา" value={f.credential} onChange={set('credential')} />
                </>
              )}
            </>
          )}
          <input type="email" placeholder="อีเมล" value={f.email} onChange={set('email')} required />
          <div className="field">
            <input type={show ? 'text' : 'password'} placeholder="รหัสผ่าน" value={f.password} onChange={set('password')} required minLength={6} />
            <IconButton className="field-btn" name={show ? 'eyeOff' : 'eye'} label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'} onClick={() => setShow(!show)} />
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'กรุณารอสักครู่...' : mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</button>
          <button type="button" className="btn-secondary" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'สมัครสมาชิก' : 'มีบัญชีแล้ว? เข้าสู่ระบบ'}
          </button>
          <div className="features">
            {FEATURES.map(([emoji, label]) => (
              <button type="button" key={label} className="feat" onClick={() => nav('/faq')} title="ดูคลังความรู้">
                <span>{emoji}</span>{label}
              </button>
            ))}
          </div>
          <Link className="muted center" to="/faq"><Icon name="book" size={14} /> ดูคลังความรู้โดยไม่ต้องเข้าสู่ระบบ</Link>
        </form>
      </div>
    </div>
  );
}
