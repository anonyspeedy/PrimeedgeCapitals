import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  Menu,
  MessageCircleQuestion,
  Moon,
  Search,
  Settings,
  Sun,
  UserRound,
} from 'lucide-react';
import { routeMeta, type RouteId } from '../lib/nav';
import { user } from '../lib/data';
import { Button, IconButton, Logo, Switch } from './ui';

interface TopbarProps {
  active: RouteId;
  onOpenSidebar: () => void;
  onNavigate: (id: RouteId) => void;
  dark: boolean;
  onToggleTheme: (value: boolean) => void;
}

const notificationItems = [
  { title: 'Payout #2 is being reviewed', time: '12m ago', tone: 'brand' },
  { title: 'Benchmark day 3 of 5 completed', time: '2h ago', tone: 'success' },
  { title: 'New competition: Futures Sprint', time: 'Yesterday', tone: 'warn' },
  { title: 'Proof of address needs updating', time: '2d ago', tone: 'danger' },
] as const;

const toneDots = {
  brand: 'bg-brand',
  success: 'bg-success',
  warn: 'bg-warn',
  danger: 'bg-danger',
} as const;

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="anim-in border-line bg-surface absolute top-11 right-0 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-2xl">
      <div className="border-line flex items-center justify-between border-b px-3 py-2.5">
        <span className="text-[13px] font-semibold">Notifications</span>
        <button type="button" onClick={onClose} className="text-brand-ink text-[12px] font-medium">
          Mark all read
        </button>
      </div>
      <ul className="max-h-72 overflow-y-auto">
        {notificationItems.map((item) => (
          <li
            key={item.title}
            className="border-line/60 flex gap-2.5 border-b px-3 py-2.5 last:border-0"
          >
            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${toneDots[item.tone]}`} />
            <div className="flex min-w-0 flex-col">
              <span className="text-[12.5px] leading-snug">{item.title}</span>
              <span className="text-faint text-[11px]">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfileMenu({
  onClose,
  onNavigate,
  dark,
  onToggleTheme,
}: {
  onClose: () => void;
  onNavigate: (id: RouteId) => void;
  dark: boolean;
  onToggleTheme: (value: boolean) => void;
}) {
  return (
    <div className="anim-in border-line bg-surface absolute top-11 right-0 z-50 w-[min(17rem,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-2xl">
      <div className="border-line border-b px-3 py-3">
        <p className="text-[13px] font-semibold">{user.name}</p>
        <p className="text-faint truncate text-[11.5px]">{user.email}</p>
      </div>
      <div className="p-1">
        <button
          type="button"
          onClick={() => {
            onNavigate('profile');
            onClose();
          }}
          className="text-muted hover:bg-elevated hover:text-ink flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-[13px]"
        >
          <UserRound className="size-4" />
          Profile &amp; KYC
        </button>
        <button
          type="button"
          className="text-muted hover:bg-elevated hover:text-ink flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-[13px]"
        >
          <Settings className="size-4" />
          Preferences
        </button>
        <div className="flex h-9 items-center justify-between rounded-lg px-2.5">
          <span className="text-muted flex items-center gap-2 text-[13px]">
            {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            Dark mode
          </span>
          <Switch checked={dark} onChange={onToggleTheme} label="Toggle dark mode" />
        </div>
      </div>
    </div>
  );
}

export function Topbar({ active, onOpenSidebar, onNavigate, dark, onToggleTheme }: TopbarProps) {
  const [panel, setPanel] = useState<'none' | 'bell' | 'user'>('none');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panel === 'none') return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setPanel('none');
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanel('none');
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [panel]);

  const meta = routeMeta[active];

  return (
    <header className="border-line/70 bg-page/85 sticky top-0 z-40 border-b backdrop-blur-xl xl:border-b-0 xl:bg-transparent xl:backdrop-blur-0">
      <div
        ref={rootRef}
        className="relative flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-4 xl:px-6"
      >
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Toggle sidebar"
          className="text-muted hover:text-ink -ml-1 grid size-9 shrink-0 place-items-center rounded-lg xl:hidden"
        >
          <Menu className="size-[22px]" />
        </button>

        <div className="xl:hidden">
          <Logo compactMode />
        </div>

        <div className="hidden min-w-0 flex-col xl:flex">
          <h1 className="text-[17px] leading-tight font-semibold tracking-tight">{meta.title}</h1>
          <p className="text-muted truncate text-[12.5px]">{meta.subtitle}</p>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <label className="border-line bg-surface/70 focus-within:border-brand/60 text-faint hidden h-9 items-center gap-2 rounded-lg border px-2.5 lg:flex">
            <Search className="size-4" />
            <input
              type="search"
              placeholder="Search accounts, payouts…"
              className="text-ink placeholder:text-faint h-full w-36 bg-transparent text-[13px] outline-none xl:w-48"
            />
          </label>

          <div className="hidden items-center gap-1.5 sm:flex sm:gap-2">
            <Button
              tone="neutral"
              size="sm"
              icon={<MessageCircleQuestion className="size-4" />}
            >
              Ask Prime
            </Button>

            <Button tone="brand" size="sm">
              Start Challenge
            </Button>
          </div>

          <div className="relative">
            <IconButton
              label="Notifications"
              badge={user.unreadNotifications}
              aria-expanded={panel === 'bell'}
              onClick={() => setPanel(panel === 'bell' ? 'none' : 'bell')}
            >
              <Bell className="size-[19px]" />
            </IconButton>
            {panel === 'bell' && <NotificationsPanel onClose={() => setPanel('none')} />}
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={panel === 'user'}
              onClick={() => setPanel(panel === 'user' ? 'none' : 'user')}
              className="border-line hover:border-line-strong flex items-center gap-1.5 rounded-full border p-0.5 pr-1.5 transition-colors"
            >
              <span className="from-brand to-brand-deep grid size-7 place-items-center rounded-full bg-gradient-to-br text-[11.5px] font-semibold text-white">
                {user.initials}
              </span>
              <ChevronDown className="text-muted size-3.5" />
            </button>
            {panel === 'user' && (
              <ProfileMenu
                onClose={() => setPanel('none')}
                onNavigate={onNavigate}
                dark={dark}
                onToggleTheme={onToggleTheme}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
