import { Link, useNavigate } from 'react-router-dom';
import useValue from '../hooks/useValue.js';
import CategoryCard from '../components/common/CategoryCard.jsx';
import StateView from '../components/common/StateView.jsx';
import Icon from '../components/common/Icon.jsx';

const STEPS = [
  ['user', 'สมัครสมาชิก', 'เลือกบทบาทนักกีฬาหรือผู้เชี่ยวชาญ ใช้เวลาไม่ถึงนาที'],
  ['plus', 'เลือกหมวดหมู่และตั้งคำถาม', 'บอกเรื่องที่อยากปรึกษา เช่น กังวลก่อนแข่ง หรือเสียสมาธิ'],
  ['chat', 'แชทกับผู้เชี่ยวชาญ', 'ผู้เชี่ยวชาญรับคำถามจากคิว แล้วคุยกันแบบเรียลไทม์'],
  ['check', 'ให้คะแนนและติดตามผล', 'ให้คะแนนความพึงพอใจ และทำแบบประเมินเพื่อดูพัฒนาการ'],
];

export default function LandingPage() {
  const nav = useNavigate();
  const cats = useValue('categories');
  const faqs = useValue('faqs');
  const catList = Object.entries(cats.data || {}).sort((a, b) => a[1].sort_order - b[1].sort_order);
  const faqList = Object.values(faqs.data || {}).sort((a, b) => b.view_count - a.view_count);
  const toLogin = (from) => nav('/login', { state: { from, reason: 'ask' } });
  const ask = (id, sub) => toLogin(`/ask/${id}${sub ? `?sub=${encodeURIComponent(sub)}` : ''}`);

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <span className="eyebrow">Real-time Sports Psychology Q&amp;A</span>
          <h1>ปรึกษานักจิตวิทยาการกีฬา<br />ได้ทันที ก่อนลงสนาม</h1>
          <p>แพลตฟอร์มถาม-ตอบแบบเรียลไทม์ระหว่างนักกีฬากับผู้เชี่ยวชาญ พร้อมคลังความรู้และแบบประเมินสภาพจิตใจ ช่วยรับมือความกังวล เพิ่มสมาธิ และสร้างความมั่นใจ</p>
          <div className="hero-cta">
            <button type="button" className="btn-primary" onClick={() => toLogin('/')}>เริ่มปรึกษาผู้เชี่ยวชาญ</button>
            <Link to="/faq" className="btn-secondary">อ่านคลังความรู้</Link>
          </div>
          <ul className="hero-stats">
            <li><strong>{catList.length || 3}</strong><span>หมวดหมู่</span></li>
            <li><strong>{faqList.length || '30+'}</strong><span>หัวข้อความรู้</span></li>
            <li><strong>20</strong><span>ข้อแบบประเมิน</span></li>
          </ul>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="mock-chat">
            <div className="mock-head"><span className="msg-avatar expert">ด</span><span><strong>ผู้เชี่ยวชาญ</strong><small>ออนไลน์</small></span></div>
            <div className="bubble me">รู้สึกกังวลก่อนแข่งพรุ่งนี้ ควรทำอย่างไรดี</div>
            <div className="bubble other">ลองหายใจแบบ 4-7-8 ก่อนนอน และตั้งเป้าหมายที่ควบคุมได้ครับ</div>
          </div>
          <span className="float f1">🧠</span><span className="float f2">🎯</span><span className="float f3">🏆</span>
        </div>
      </section>

      <p className="public-note"><Icon name="bulb" size={18} /> ดูหมวดหมู่และคลังความรู้ได้เลยโดยไม่ต้องเข้าสู่ระบบ ต้องเข้าสู่ระบบเมื่อต้องการตั้งคำถาม แชท หรือทำแบบประเมิน</p>

      <section className="land-section">
        <div className="section-title"><h2>เลือกประเภทระบบตอบคำถาม</h2><p>กดหมวดหมู่หรือหัวข้อย่อยที่ตรงกับคุณเพื่อเริ่มปรึกษา</p></div>
        <StateView loading={cats.loading} error={cats.error} empty={catList.length === 0}>
          <div className="cards-grid">
            {catList.map(([id, c]) => (
              <CategoryCard key={id} badgeNum={c.sort_order} title={c.category_name_th} description={c.description}
                subItems={c.sub_items} buttonColor={c.button_color} icon={c.icon_emoji}
                actionLabel="เข้าสู่ระบบเพื่อเริ่มถาม >" onSelect={(sub) => ask(id, sub)} />
            ))}
          </div>
        </StateView>
      </section>

      <section className="land-section">
        <div className="section-title"><h2>ใช้งานอย่างไร</h2><p>4 ขั้นตอนง่ายๆ</p></div>
        <div className="steps">
          {STEPS.map(([icon, title, text], i) => (
            <div key={title} className="step">
              <span className="step-no">{i + 1}</span>
              <span className="stat-ico" style={{ '--accent': '#1e88e5' }}><Icon name={icon} size={22} /></span>
              <strong>{title}</strong><p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="land-section">
        <div className="section-title"><h2>ความรู้ยอดนิยม</h2><p>อ่านได้ทันที ไม่ต้องล็อกอิน</p></div>
        <StateView loading={faqs.loading} error={faqs.error} empty={faqList.length === 0}>
          <div className="faq-mini">
            {faqList.slice(0, 4).map((f) => (
              <Link key={f.question_summary} to="/faq" className="faq-mini-item">
                <span className="faq-ico"><Icon name="bulb" size={18} /></span>
                <span className="faq-text">{f.question_summary}</span>
                <Icon name="arrowRight" size={16} />
              </Link>
            ))}
          </div>
          <Link to="/faq" className="btn-secondary pill inline">ดูคลังความรู้ทั้งหมด</Link>
        </StateView>
      </section>

      <section className="cta-band">
        <div><h2>พร้อมเตรียมใจให้แข็งแกร่งแล้วหรือยัง</h2><p>สมัครสมาชิกฟรี แล้วเริ่มถามผู้เชี่ยวชาญหรือทำแบบประเมินได้ทันที</p></div>
        <Link to="/login?mode=register" className="btn-primary pill white">สมัครสมาชิก</Link>
      </section>

      <footer className="site-footer">
        <p>โครงงาน: เว็บแอปพลิเคชันถาม-ตอบจิตวิทยาการกีฬาสำหรับนักกีฬา แบบระบบตอบโต้เรียลไทม์</p>
        <p>จัดทำโดย ภูริทัต ทรัพย์เสถียร (67122250028) · ธัญศรัณ รัตนกำเนิด (67122250101)</p>
      </footer>
    </>
  );
}
