import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import AthleteHomePage from '../pages/AthleteHomePage.jsx';
import QuestionPage from '../pages/QuestionPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import FAQPage from '../pages/FAQPage.jsx';
import AssessmentPage from '../pages/AssessmentPage.jsx';
import ExpertDashboardPage from '../pages/ExpertDashboardPage.jsx';

function Protected({ roles, children }) {
  const { user, profile, loading } = useAuth();
  const loc = useLocation();
  if (loading || (user && !profile)) return <div className="state" role="status">กำลังตรวจสอบสิทธิ์...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname + loc.search, reason: 'protected' }} />;
  if (!roles.includes(profile.role)) return <Navigate to={profile.role === 'expert' ? '/expert/dashboard' : '/'} replace />;
  return children;
}

// หน้าแรก: ผู้เยี่ยมชม = Landing (สาธารณะ) / นักกีฬา = แดชบอร์ด / ผู้เชี่ยวชาญ = คิวคำถาม
function Home() {
  const { user, profile, loading } = useAuth();
  if (loading || (user && !profile)) return <div className="state" role="status">กำลังโหลด...</div>;
  if (!user) return <LandingPage />;
  return profile.role === 'expert' ? <Navigate to="/expert/dashboard" replace /> : <AthleteHomePage />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/ask/:categoryId" element={<Protected roles={['athlete']}><QuestionPage /></Protected>} />
        <Route path="/assessment" element={<Protected roles={['athlete']}><AssessmentPage /></Protected>} />
        <Route path="/chat/:sessionId" element={<Protected roles={['athlete', 'expert']}><ChatPage /></Protected>} />
        <Route path="/expert/dashboard" element={<Protected roles={['expert']}><ExpertDashboardPage /></Protected>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
