import { LogOut, Sparkles, X } from 'lucide-react';
import { navigation, secondaryNav, type NavItem, type RouteId } from '../lib/nav';
import { user } from '../lib/data';
import { Button, Logo } from './ui';

interface SidebarProps {
  open: boolean;
  active: RouteId;
  onClose: () => void;
  onNavigate: (id: RouteId) => void;
  variant?: 'sheet' | 'static';
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  const className = `group relative flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-[13.5px] font-medium transition-colors ${
    active ? 'bg-brand/15 text-ink' : 'text-muted hover:bg-elevated hover:text-ink'
  }`;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`bg-brand absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full transition-opacity ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <Icon className={`size-[18px] shrink-0 ${active ? 'text-brand-ink' : ''}`} />
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span className="bg-brand/15 text-brand-ink num ml-auto rounded-full px-1.5 py-px text-[11px] font-semibold">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noreferrer' : undefined}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className={className}
    >
      {inner}
    </button>
  );
}

function SidebarBody({
  active,
  onNavigate,
  onClose,
  showClose,
}: {
  active: RouteId;
  onNavigate: (id: RouteId) => void;
  onClose: () => void;
  showClose: boolean;
}) {
  return (
    <div className="border-line bg-surface/95 flex h-full flex-col overflow-y-auto border-r p-3 backdrop-blur-xl">
      <div className="flex h-11 shrink-0 items-center justify-between px-1">
        <Logo />
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="text-muted hover:text-ink hover:bg-elevated grid size-8 place-items-center rounded-lg"
          >
            <X className="size-[18px]" />
          </button>
        )}
      </div>

      <div className="bg-elevated/60 border-line/70 mt-1 flex shrink-0 flex-col gap-0.5 rounded-xl border px-3 py-2.5">
        <span className="label-xs">Trader</span>
        <span className="truncate text-[13px] font-medium">{user.name}</span>
        <span className="text-faint truncate text-[11.5px]">Stellar Challenge · ID 81450000</span>
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-1">
        {navigation.map((section) => (
          <nav key={section.title} aria-label={section.title} className="flex flex-col gap-0.5 pt-2">
            <span className="text-faint px-3 pb-1 text-[10.5px] font-semibold tracking-[0.14em] uppercase">
              {section.title}
            </span>
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                active={!item.href && item.id === active}
                onClick={() => {
                  onNavigate(item.id);
                  if (!item.href) onClose();
                }}
              />
            ))}
          </nav>
        ))}
      </div>

      <nav aria-label="Account" className="border-line mt-2 flex shrink-0 flex-col gap-0.5 border-t pt-3">
        {secondaryNav.map((item) => (
          <NavLink
            key={item.label}
            item={item}
            active={!item.href && item.id === active}
            onClick={() => {
              if (item.href) return;
              onNavigate(item.id);
              onClose();
            }}
          />
        ))}
        <button
          type="button"
          className="text-muted hover:bg-elevated hover:text-ink flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-[13.5px] font-medium transition-colors"
        >
          <LogOut className="size-[18px] shrink-0" />
          Log out
        </button>
      </nav>

      <div className="from-brand/12 to-brand/5 border-line mt-3 shrink-0 overflow-hidden rounded-xl border bg-gradient-to-br to-60% p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-brand-ink size-4" />
          <span className="text-[13px] font-semibold">PrimeEdge Markets</span>
        </div>
        <p className="text-muted mt-1 text-[12px] leading-relaxed">
          Raw spreads from 0.0 pips with same-day withdrawals.
        </p>
        <Button tone="brand" size="sm" block className="mt-3">
          Explore
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ open, active, onClose, onNavigate, variant = 'sheet' }: SidebarProps) {
  if (variant === 'static') {
    return (
      <aside className="fixed top-0 bottom-0 left-0 z-30 hidden w-[272px] xl:block">
        <SidebarBody
          active={active}
          onNavigate={onNavigate}
          onClose={() => undefined}
          showClose={false}
        />
      </aside>
    );
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 xl:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={onClose}
        className="anim-fade bg-overlay absolute inset-0 backdrop-blur-[2px]"
      />
      <div className="anim-sheet absolute inset-y-0 left-0 w-3/4 max-w-[19rem] p-2 sm:max-w-sm">
        <div className="border-line h-full overflow-hidden rounded-2xl border shadow-2xl">
          <SidebarBody active={active} onNavigate={onNavigate} onClose={onClose} showClose />
        </div>
      </div>
    </div>
  );
}
