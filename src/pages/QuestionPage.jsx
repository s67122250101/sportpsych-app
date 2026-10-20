import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import useValue from '../hooks/useValue.js';
import { createQuestion } from '../services/chatService.js';
import QuestionForm from '../components/features/QuestionForm.jsx';
import StateView from '../components/common/StateView.jsx';
import IconButton from '../components/common/IconButton.jsx';

export default function QuestionPage() {
  const { categoryId } = useParams();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const { user } = useAuth();
  const { data, loading, error } = useValue(`categories/${categoryId}`);

  const onSubmit = async ({ subTopic, content }) => {
    const sessionId = await createQuestion({ athleteId: user.uid, categoryId, subTopic, content });
    nav(`/chat/${sessionId}`);
  };

  return (
    <StateView loading={loading} error={error} empty={!data} emptyText="ไม่พบหมวดหมู่นี้">
      {data && (
        <>
          <div className="section-title with-back">
            <IconButton name="back" label="กลับหน้าหลัก" to="/" />
            <div><h2>{data.icon_emoji} {data.category_name_th}</h2><p>{data.description}</p></div>
          </div>
          <QuestionForm category={data} initialSubTopic={sp.get('sub') || ''} onSubmit={onSubmit} />
        </>
      )}
    </StateView>
  );
}
