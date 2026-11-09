import { useCallback, useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { AccountsPage } from './components/pages/AccountsPage';
import {
  CalculatorPage,
  CalendarPage,
  CertificatesPage,
  CompetitionsPage,
  OffersPage,
  PartnerPage,
  PayoutPage,
  ProfilePage,
  ReferPage,
  TransactionsPage,
} from './components/pages/sections';
import { routeMeta, type RouteId } from './lib/nav';

const THEME_KEY = 'primeedge:theme';

function initialTheme(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light') return false;
  if (stored === 'dark') return true;
  return !window.matchMedia('(prefers-color-scheme: light)').matches;
}

export default function App() {
  const [route, setRoute] = useState<RouteId>('accounts');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    window.localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [sidebarOpen]);

  const navigate = useCallback((id: RouteId) => {
    setRoute(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const meta = routeMeta[route];

  return (
    <div className="bg-page text-ink min-h-dvh">
      <Sidebar
        variant="static"
        open={false}
        active={route}
        onClose={() => undefined}
        onNavigate={navigate}
      />
      <Sidebar
        variant="sheet"
        open={sidebarOpen}
        active={route}
        onClose={() => setSidebarOpen(false)}
        onNavigate={navigate}
      />

      <div className="xl:pl-[272px]">
        <Topbar
          active={route}
          dark={dark}
          onToggleTheme={setDark}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNavigate={navigate}
        />

        <main className="mx-auto w-full max-w-[1360px] px-3 pt-4 pb-10 sm:px-4 lg:px-6">
          <div className="pb-4 xl:hidden">
            <h1 className="text-[20px] font-semibold tracking-tight sm:text-[22px]">{meta.title}</h1>
            <p className="text-muted mt-1 max-w-2xl text-[12.5px] sm:text-[13px]">
              {meta.subtitle}
            </p>
          </div>

          <div key={route} className="anim-in">
            {route === 'accounts' && <AccountsPage onNavigate={navigate} />}
            {route === 'payout' && <PayoutPage />}
            {route === 'refer' && <ReferPage />}
            {route === 'partner' && <PartnerPage />}
            {route === 'offers' && <OffersPage />}
            {route === 'competitions' && <CompetitionsPage />}
            {route === 'certificates' && <CertificatesPage />}
            {route === 'transactions' && <TransactionsPage />}
            {route === 'profile' && <ProfilePage />}
            {route === 'calendar' && <CalendarPage />}
            {route === 'calculator' && <CalculatorPage />}
          </div>
        </main>
      </div>
    </div>
  );
}
