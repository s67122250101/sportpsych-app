import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import SidebarNavigation from './SidebarNavigation.jsx';
import TopHeader from './TopHeader.jsx';
import PublicHeader from './PublicHeader.jsx';

export default function AppLayout() {
  const { user, profile } = useAuth();
  if (!(user && profile)) {
    return (
      <div className="public-shell">
        <PublicHeader />
        <main className="public-main"><Outlet /></main>
      </div>
    );
  }
  return (
    <div className="shell">
      <SidebarNavigation />
      <main className="main-content">
        <TopHeader />
        <Outlet />
      </main>
    </div>
  );
}
