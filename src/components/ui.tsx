import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { sparkPath } from '../lib/format';

type Tone = 'brand' | 'neutral' | 'ghost' | 'success' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const toneStyles: Record<Tone, string> = {
  brand:
    'bg-brand text-white border-transparent hover:bg-brand-deep shadow-[0_8px_24px_-12px_rgba(99,91,255,0.9)]',
  neutral: 'bg-elevated text-ink border-line hover:border-line-strong hover:bg-elevated-2',
  ghost: 'bg-transparent text-muted border-transparent hover:text-ink hover:bg-elevated',
  success: 'bg-success/15 text-success border-success/30 hover:bg-success/20',
  danger: 'bg-danger/12 text-danger border-danger/25 hover:bg-danger/20',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-[12.5px] gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-5 text-[15px] gap-2 rounded-xl',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  size?: Size;
  block?: boolean;
  icon?: ReactNode;
}

export function Button({
  tone = 'neutral',
  size = 'md',
  block,
  icon,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center border font-medium whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
        toneStyles[tone]
      } ${sizeStyles[size]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  className = '',
}: {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  size?: Size;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`bg-elevated border-line inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-lg border p-1 [scrollbar-width:none] ${className}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              size === 'sm' ? 'h-7 px-2.5 text-[12.5px]' : 'h-8 px-3.5 text-[13px]'
            } ${
              selected
                ? 'bg-brand text-white shadow-[0_6px_18px_-10px_rgba(99,91,255,0.95)]'
                : 'text-muted hover:text-ink'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Chip({
  active,
  children,
  count,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors ${
        active
          ? 'border-brand/40 bg-brand/15 text-ink'
          : 'border-line bg-surface text-muted hover:text-ink'
      }`}
      {...rest}
    >
      {children}
      {typeof count === 'number' && (
        <span className="bg-chip text-faint rounded-full px-1.5 py-px text-[11px] num">{count}</span>
      )}
    </button>
  );
}

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: 'neutral' | 'success' | 'danger' | 'warn' | 'brand' | 'muted';
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: 'bg-elevated text-muted border-line',
    muted: 'bg-transparent text-faint border-line',
    success: 'bg-success/12 text-success border-success/25',
    danger: 'bg-danger/12 text-danger border-danger/25',
    warn: 'bg-warn/12 text-warn border-warn/25',
    brand: 'bg-brand/12 text-brand-ink border-brand/25',
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Progress({
  value,
  tone = 'brand',
  className = '',
  height = 6,
}: {
  value: number;
  tone?: 'brand' | 'success' | 'danger' | 'warn' | 'mint';
  className?: string;
  height?: number;
}) {
  const tones = {
    brand: 'bg-brand',
    success: 'bg-success',
    danger: 'bg-danger',
    warn: 'bg-warn',
    mint: 'bg-mint',
  } as const;
  const width = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`bg-elevated-2 w-full overflow-hidden rounded-full ${className}`}
      style={{ height }}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${tones[tone]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export function Sparkline({
  values,
  tone = 'brand',
  width = 120,
  height = 36,
  className = '',
}: {
  values: number[];
  tone?: 'brand' | 'success' | 'mint' | 'danger';
  width?: number;
  height?: number;
  className?: string;
}) {
  const colors = {
    brand: '#635bff',
    success: '#23d72d',
    mint: '#05e594',
    danger: '#ff5f5f',
  } as const;
  const id = `spark-${tone}-${values.length}-${Math.round(values[values.length - 1] ?? 0)}`;
  const path = sparkPath(values, width, height);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ height }}
      className={`w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors[tone]} stopOpacity="0.32" />
          <stop offset="100%" stopColor={colors[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${path} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={colors[tone]} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Ring({
  value,
  size = 96,
  stroke = 8,
  tone = '#635bff',
  label,
  sub,
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: string;
  label: string;
  sub?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--fn-elevated-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-[17px] font-semibold">{label}</span>
        {sub && <span className="text-faint text-[11px]">{sub}</span>}
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
  className = '',
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: 'default' | 'success' | 'danger';
  className?: string;
}) {
  const valueTone =
    tone === 'success' ? 'text-success' : tone === 'danger' ? 'text-danger' : 'text-ink';
  return (
    <div className={`tile flex flex-col gap-1 p-3 sm:p-4 ${className}`}>
      <span className="label-xs">{label}</span>
      <span className={`num text-[17px] font-semibold sm:text-[19px] ${valueTone}`}>{value}</span>
      {hint && <span className="text-faint text-[11.5px]">{hint}</span>}
    </div>
  );
}

export function IconButton({
  label,
  badge,
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; badge?: number }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`text-muted hover:text-ink hover:bg-elevated relative inline-flex size-9 items-center justify-center rounded-lg transition-colors ${className}`}
      {...rest}
    >
      {children}
      {badge ? (
        <span className="bg-danger absolute -top-0.5 -right-0.5 inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-4 font-semibold text-on-danger">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </button>
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
        checked ? 'bg-brand border-brand' : 'bg-elevated border-line'
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export function SectionTitle({
  title,
  action,
  hint,
}: {
  title: string;
  action?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {hint && <p className="text-muted text-[12.5px]">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  actions,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  actions?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-5 py-10 text-center sm:py-14">
      <div className="bg-elevated text-brand-ink grid size-14 place-items-center rounded-2xl">{icon}</div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[15px] font-semibold">{title}</h3>
        <p className="text-muted mx-auto max-w-md text-[13px]">{body}</p>
      </div>
      {actions && <div className="mt-1 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">{actions}</div>}
    </div>
  );
}

export function Logo({ compactMode = false }: { compactMode?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="shrink-0">
        <rect width="26" height="26" rx="7" fill="#635bff" />
        <path
          d="M7 17.5 11 8.2l3.1 6.1 2-3.4 2.9 6.6"
          fill="none"
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!compactMode && (
        <span className="text-[15px] leading-none font-semibold tracking-tight">
          Prime<span className="text-brand-ink">Edge</span>
        </span>
      )}
    </span>
  );
}
