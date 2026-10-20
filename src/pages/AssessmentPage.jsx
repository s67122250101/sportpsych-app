import { useMemo, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import useValue from '../hooks/useValue.js';
import { saveAssessmentResult } from '../services/assessmentService.js';
import { SCALE, ORDER, DIMENSIONS, buildQuestions, scoreDimension, statusOf, STATUS } from '../data/assessment.js';
import AssessmentResult from '../components/features/AssessmentResult.jsx';
import IconButton from '../components/common/IconButton.jsx';
import Icon from '../components/common/Icon.jsx';

export default function AssessmentPage() {
  const { user } = useAuth();
  const history = useValue(`assessment_results/${user.uid}`);
  const questions = useMemo(buildQuestions, []);
  const last = questions.length - 1;
  const [phase, setPhase] = useState('intro'); // intro | quiz | result
  const [answers, setAnswers] = useState({});
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');
  const timer = useRef(null);

  const list = Object.entries(history.data || {}).map(([id, r]) => ({ id, ...r })).sort((a, b) => b.created_at - a.created_at);

  const start = () => { setAnswers({}); setIdx(0); setSaveMsg(''); setPhase('quiz'); };
  const choose = (v) => {
    setAnswers((a) => ({ ...a, [idx]: v }));
    clearTimeout(timer.current);
    if (idx < last) timer.current = setTimeout(() => setIdx((i) => Math.min(i + 1, last)), 220);
  };
  const finish = async () => {
    const byDim = {};
    ORDER.forEach((d) => { byDim[d] = []; });
    questions.forEach((q, i) => byDim[q.dim].push(answers[i]));
    const scores = {};
    ORDER.forEach((d) => { scores[d] = scoreDimension(byDim[d]); });
    const payload = { created_at: Date.now(), scores, answers: byDim };
    setResult({ ...payload, prev: list[0]?.scores || null });
    setPhase('result');
    try { await saveAssessmentResult(user.uid, payload); setSaveMsg('บันทึกผลลงประวัติของคุณแล้ว'); }
    catch { setSaveMsg('บันทึกผลไม่สำเร็จ (ผลด้านบนยังใช้ดูได้)'); }
  };
  const open = (r, i) => { setResult({ ...r, prev: list[i + 1]?.scores || null }); setSaveMsg(''); setPhase('result'); };

  const q = questions[idx];
  const done = Object.keys(answers).length;

  return (
    <>
      <div className="section-title with-back">
        <IconButton name="back" label={phase === 'intro' ? 'ไปคลังความรู้' : 'กลับ'} to={phase === 'intro' ? '/faq' : undefined}
          onClick={phase === 'intro' ? undefined : () => setPhase('intro')} />
        <div><h2>🧠 แบบประเมินสภาพจิตใจนักกีฬา</h2><p>20 ข้อ · ความเครียด ความวิตกกังวล ความมั่นใจ และสมาธิ</p></div>
      </div>

      {phase === 'intro' && (
        <>
          <div className="panel">
            <p>ตอบตามความรู้สึกจริงของคุณ <strong>ในช่วง 2 สัปดาห์ที่ผ่านมา</strong> ไม่มีคำตอบถูกหรือผิด ใช้เวลาประมาณ 5 นาที ผลจะแสดงทันทีพร้อมคำแนะนำรายด้าน และบันทึกไว้ให้เปรียบเทียบกับครั้งถัดไป</p>
            <p className="muted">แบบประเมินนี้ใช้เพื่อสะท้อนตนเอง ไม่ใช่การวินิจฉัยทางการแพทย์</p>
            <button type="button" className="btn-primary fit" onClick={start}>เริ่มทำแบบประเมิน</button>
          </div>
          <h3 className="sub-head">ประวัติการประเมิน</h3>
          {list.length === 0 ? <div className="state">ยังไม่เคยทำแบบประเมิน</div> : list.slice(0, 5).map((r, i) => (
            <button type="button" key={r.id} className="row hist" onClick={() => open(r, i)}>
              <span>{new Date(r.created_at).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <span className="hist-chips">{ORDER.map((d) => (
                <span key={d} className="hist-chip" style={{ '--accent': STATUS[statusOf(d, r.scores[d])].color }} title={`${DIMENSIONS[d].name} ${r.scores[d]}%`}>{DIMENSIONS[d].icon} {r.scores[d]}%</span>
              ))}</span>
            </button>
          ))}
        </>
      )}

      {phase === 'quiz' && (
        <div className="panel quiz">
          <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax={questions.length} aria-valuenow={done}><span style={{ width: `${(done / questions.length) * 100}%` }} /></div>
          <div className="quiz-meta"><span>ข้อ {idx + 1} / {questions.length}</span><span className="dim-chip">{DIMENSIONS[q.dim].icon} {DIMENSIONS[q.dim].name}</span></div>
          <p className="quiz-q">{q.text}</p>
          <p className="muted">ในช่วง 2 สัปดาห์ที่ผ่านมา ข้อความนี้ตรงกับคุณบ่อยแค่ไหน</p>
          <div className="likert" role="radiogroup" aria-label="ระดับความถี่">
            {SCALE.map((label, i) => (
              <button type="button" key={label} role="radio" aria-checked={answers[idx] === i + 1}
                className={answers[idx] === i + 1 ? 'on' : ''} onClick={() => choose(i + 1)}>
                <b>{i + 1}</b><span>{label}</span>
              </button>
            ))}
          </div>
          <div className="quiz-nav">
            <button type="button" className="btn-secondary" disabled={idx === 0} onClick={() => setIdx(idx - 1)}><Icon name="back" size={16} /> ข้อก่อนหน้า</button>
            {idx < last
              ? <button type="button" className="btn-secondary" disabled={!answers[idx]} onClick={() => setIdx(idx + 1)}>ข้อถัดไป <Icon name="arrowRight" size={16} /></button>
              : <button type="button" className="btn-primary" disabled={done < questions.length} onClick={finish}>ดูผลการประเมิน</button>}
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <>
          <AssessmentResult scores={result.scores} prevScores={result.prev} createdAt={result.created_at} />
          {saveMsg && <p className="muted center">{saveMsg}</p>}
          <button type="button" className="btn-primary fit" onClick={start}>ทำแบบประเมินอีกครั้ง</button>
        </>
      )}
    </>
  );
}
