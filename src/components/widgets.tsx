import { useState } from 'react';
import { ArrowRight, CalendarDays, Check, Copy, KeyRound, Sparkles, TrendingUp } from 'lucide-react';
import { newsEvents, weekDays } from '../lib/data';
import { money, pct } from '../lib/format';
import { Badge, Button, Chip, Segmented, Sparkline } from './ui';

const impactTone = {
  high: 'danger',
  medium: 'warn',
  low: 'muted',
} as const;

export function NewsCalendarWidget() {
  const [day, setDay] = useState(12);

  return (
    <section className="card p-3 sm:p-4" aria-labelledby="news-widget-title">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-brand-ink size-4" />
          <h2 id="news-widget-title" className="text-[13.5px] font-semibold">
            Economic calendar
          </h2>
        </div>
        <Badge tone="brand">+{newsEvents.length} upcoming</Badge>
      </div>

      <div className="rail mt-3">
        {weekDays.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={item.date === day}
            onClick={() => setDay(item.date)}
            className={`flex h-14 w-11 shrink-0 flex-col items-center justify-center rounded-xl border text-[11px] font-medium transition-colors ${
              item.date === day
                ? 'border-brand/50 bg-brand/12 text-ink'
                : 'border-line bg-elevated text-muted hover:text-ink'
            }`}
          >
            <span className="text-faint text-[10px] tracking-wide uppercase">{item.label}</span>
            <span className="num text-[14px] font-semibold">{item.date}</span>
            <span className={`mt-0.5 size-1 rounded-full ${item.events ? 'bg-brand' : 'bg-transparent'}`} />
          </button>
        ))}
      </div>

      <ul className="mt-3 flex flex-col divide-y divide-[color:var(--fn-line)]/70">
        {newsEvents.slice(0, 5).map((event) => (
          <li key={event.title} className="flex items-center gap-3 py-2">
            <span className="num text-faint w-11 shrink-0 text-[11.5px]">{event.time}</span>
            <span className="bg-elevated text-muted w-9 shrink-0 rounded px-1 py-0.5 text-center text-[10.5px] font-semibold">
              {event.currency}
            </span>
            <span className="min-w-0 flex-1 truncate text-[12.5px]">{event.title}</span>
            <Badge tone={impactTone[event.impact]} className="hidden sm:inline-flex">
              {event.impact}
            </Badge>
          </li>
        ))}
      </ul>

      <Button tone="ghost" size="sm" block className="mt-2" icon={<ArrowRight className="size-4" />}>
        Open full calendar
      </Button>
    </section>
  );
}

const calculators = {
  margin: {
    fields: [
      { label: 'Instrument', value: 'EURUSD', hint: '1.0842' },
      { label: 'Lot size', value: '1.00', hint: 'standard lots' },
      { label: 'Leverage', value: '1:100', hint: 'account' },
    ],
    resultLabel: 'Required margin',
    result: 1084.2,
  },
  'profit-loss': {
    fields: [
      { label: 'Entry price', value: '1.08420', hint: 'long' },
      { label: 'Exit price', value: '1.08910', hint: 'target' },
      { label: 'Lot size', value: '1.00', hint: 'standard lots' },
    ],
    resultLabel: 'Estimated profit',
    result: 490.0,
  },
  'lot-size': {
    fields: [
      { label: 'Account balance', value: '$42,860', hint: 'live equity' },
      { label: 'Risk per trade', value: '1.0%', hint: 'of balance' },
      { label: 'Stop loss', value: '24 pips', hint: 'EURUSD' },
    ],
    resultLabel: 'Position size',
    result: 1.79,
  },
  swap: {
    fields: [
      { label: 'Position', value: 'Buy 1.00', hint: 'EURUSD' },
      { label: 'Nights held', value: '3', hint: 'rollovers' },
      { label: 'Swap rate', value: '-7.40', hint: 'points / night' },
    ],
    resultLabel: 'Total swap',
    result: -22.2,
  },
} as const;

type CalculatorTab = keyof typeof calculators;

export function CalculatorWidget() {
  const [tab, setTab] = useState<CalculatorTab>('margin');
  const active = calculators[tab];

  return (
    <section className="card p-3 sm:p-4" aria-labelledby="calc-widget-title">
      <div className="flex items-center gap-2">
        <TrendingUp className="text-brand-ink size-4" />
        <h2 id="calc-widget-title" className="text-[13.5px] font-semibold">
          Calculator
        </h2>
      </div>

      <div className="rail mt-3">
        {(
          [
            ['margin', 'Margin'],
            ['profit-loss', 'Profit/loss'],
            ['lot-size', 'Lot size'],
            ['swap', 'Swap'],
          ] as [CalculatorTab, string][]
        ).map(([value, label]) => (
          <Chip key={value} active={tab === value} onClick={() => setTab(value)}>
            {label}
          </Chip>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {active.fields.map((field) => (
          <div
            key={field.label}
            className="border-line bg-elevated/60 flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
          >
            <span className="text-muted text-[12px]">{field.label}</span>
            <span className="flex items-baseline gap-1.5">
              <span className="num text-[13px] font-medium">{field.value}</span>
              <span className="text-faint text-[11px]">{field.hint}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="border-line bg-elevated mt-3 flex items-center justify-between rounded-lg border px-3 py-2.5">
        <span className="label-xs">{active.resultLabel}</span>
        <span
          className={`num text-[15px] font-semibold ${
            active.result < 0 ? 'text-danger' : 'text-success'
          }`}
        >
          {active.result < 0 ? money(active.result) : money(active.result)}
        </span>
      </div>
    </section>
  );
}

export function McpTokenWidget() {
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const random = Array.from({ length: 4 }, () =>
      Math.random().toString(36).slice(2, 8),
    ).join('-');
    setToken(`pe_live_${random}`);
    setCopied(false);
  };

  return (
    <section className="card p-3 sm:p-4" aria-labelledby="mcp-widget-title">
      <div className="flex items-center gap-2">
        <KeyRound className="text-brand-ink size-4" />
        <h2 id="mcp-widget-title" className="text-[13.5px] font-semibold">
          Connect PrimeEdge MCP
        </h2>
      </div>
      <p className="text-muted mt-1.5 text-[12.5px] leading-relaxed">
        Generate a scoped token so your trading assistant can read account stats and payout status.
      </p>

      {token ? (
        <div className="border-line bg-elevated mt-3 flex items-center gap-2 rounded-lg border px-2.5 py-2">
          <code className="text-ink min-w-0 flex-1 truncate text-[12px]">{token}</code>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(token);
              setCopied(true);
            }}
            className="text-muted hover:text-ink grid size-7 shrink-0 place-items-center rounded-md"
            aria-label="Copy token"
          >
            {copied ? <Check className="text-success size-4" /> : <Copy className="size-4" />}
          </button>
        </div>
      ) : (
        <Button tone="neutral" size="sm" block className="mt-3" onClick={generate}>
          Generate token
        </Button>
      )}
    </section>
  );
}

export function RapidBanner() {
  return (
    <section className="border-brand/35 from-brand/25 via-brand/10 to-transparent relative overflow-hidden rounded-xl border bg-gradient-to-r p-4">
      <div
        aria-hidden="true"
        className="border-brand/25 absolute -top-10 -right-8 size-32 rounded-full border"
      />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-brand-ink flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.14em] uppercase">
            <Sparkles className="size-3.5" /> Rapid
          </span>
          <h2 className="text-[16px] font-semibold tracking-tight">
            Start Rapid Pro &amp; Daily from {money(64.99)}
          </h2>
          <p className="text-muted max-w-md text-[12.5px]">
            No minimum trading days on Rapid Daily. Scale your allocation by 20% on every payout.
          </p>
        </div>
        <Button tone="brand" className="w-full sm:w-auto" icon={<ArrowRight className="size-4" />}>
          Discover
        </Button>
      </div>
    </section>
  );
}

export function MiniEquityCard({
  title,
  series,
  delta,
  tone = 'brand',
}: {
  title: string;
  series: number[];
  delta: number;
  tone?: 'brand' | 'mint' | 'success';
}) {
  return (
    <div className="tile flex flex-col gap-2 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="label-xs">{title}</span>
        <Badge tone={delta >= 0 ? 'success' : 'danger'}>{pct(delta, 1)}</Badge>
      </div>
      <Sparkline values={series} tone={tone} height={40} />
    </div>
  );
}

export function WidgetTabs({ tabs }: { tabs: string[] }) {
  const [value, setValue] = useState(tabs[0]);
  return (
    <Segmented
      options={tabs.map((tab) => ({ value: tab, label: tab }))}
      value={value}
      onChange={setValue}
      size="sm"
    />
  );
}
