import { Link, useSearchParams } from 'react-router-dom';
import useValue from '../hooks/useValue.js';
import FAQSearchList from '../components/features/FAQSearchList.jsx';
import StateView from '../components/common/StateView.jsx';
import Icon from '../components/common/Icon.jsx';

export default function FAQPage() {
  const [sp] = useSearchParams();
  const faqs = useValue('faqs');
  const cats = useValue('categories');
  return (
    <>
      <div className="section-title"><h2>ความรู้จิตวิทยาการกีฬา</h2><p>ค้นหาคำถามที่พบบ่อยและคำแนะนำจากผู้เชี่ยวชาญ</p></div>
      <Link to="/assessment" className="banner">
        <span className="banner-ico">🧠</span>
        <span className="banner-text"><strong>แบบประเมินสภาพจิตใจนักกีฬา</strong><small>20 ข้อ · ความเครียด วิตกกังวล ความมั่นใจ สมาธิ · ดูผลและคำแนะนำทันที</small></span>
        <span className="banner-btn">เริ่มทำแบบประเมิน <Icon name="arrowRight" size={16} /></span>
      </Link>
      <StateView loading={faqs.loading || cats.loading} error={faqs.error || cats.error}>
        <FAQSearchList categoryId={sp.get('cat') || ''} faqs={faqs.data} categories={cats.data} />
      </StateView>
    </>
  );
}
