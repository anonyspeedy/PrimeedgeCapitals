import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Filter,
  LayoutGrid,
  LineChart,
  Plus,
  Server,
  Trash2,
  X,
} from 'lucide-react';
import type { AccountStatus, Market, Plan, TradingAccount } from '../../lib/types';
import { accounts as allAccounts, plans } from '../../lib/data';
import { clamp, money, pct } from '../../lib/format';
import {
  Badge,
  Button,
  Chip,
  EmptyState,
  Progress,
  Ring,
  Segmented,
  Stat,
} from '../ui';

const marketLabels: Record<Market, string> = { cfds: 'CFDs', futures: 'Futures' };
const statusLabels: Record<AccountStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  breached: 'Breached',
};
const sorts = ['Oldest', 'Newest', 'Balance high', 'Profit high'] as const;
type Sort = (typeof sorts)[number];

function statusTone(status: AccountStatus) {
  return status === 'active' ? 'success' : status === 'breached' ? 'danger' : 'muted';
}

function AccountCard({
  account,
  onOpen,
  onDelete,
}: {
  account: TradingAccount;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const targetProgress = account.target ? clamp((account.profit / account.target) * 100) : 100;
  const lossProgress = clamp((account.lossUsed / account.maxLoss) * 100);
  const benchmark = account.benchmarkTotal
    ? clamp((account.benchmarkDone / account.benchmarkTotal) * 100)
    : 100;

  return (
    <article className="card anim-in flex flex-col gap-3 p-3 sm:p-4">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-lg ${
              account.market === 'futures' ? 'bg-brand/15 text-brand-ink' : 'bg-success/12 text-success'
            }`}
          >
            {account.market === 'futures' ? (
              <LineChart className="size-[18px]" />
            ) : (
              <LayoutGrid className="size-[18px]" />
            )}
          </span>
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-[14px] font-semibold">{account.plan}</h3>
              <Badge tone={statusTone(account.status)}>{statusLabels[account.status]}</Badge>
            </div>
            <span className="text-faint num truncate text-[11.5px]">
              {account.login} · {account.step} · {account.platform}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button tone="ghost" size="sm" aria-label="Duplicate account" title="Duplicate">
            <Copy className="size-4" />
          </Button>
          <Button
            tone="ghost"
            size="sm"
            aria-label="Delete account"
            title="Delete"
            onClick={onDelete}
            className="hover:text-danger"
          >
            <Trash2 className="size-4" />
          </Button>
          <Button tone="neutral" size="sm" onClick={onOpen}>
            View details
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Balance" value={money(account.balance)} />
        <Stat label="Equity" value={money(account.equity)} />
        <Stat
          label="Profit"
          value={money(account.profit)}
          tone={account.profit >= 0 ? 'success' : 'danger'}
          hint={`${account.trades} trades · ${pct(account.winRate)} win`}
        />
        <Stat
          label="Start size"
          value={money(account.size, 0)}
          hint={account.market === marketLabels.cfds ? 'CFDs' : 'Futures'}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-muted">
              Profit target{' '}
              {account.target ? `${money(account.profit, 0)} / ${money(account.target, 0)}` : 'Funded'}
            </span>
            <span className="num text-faint">{account.target ? pct(targetProgress) : '—'}</span>
          </div>
          <Progress value={targetProgress} tone="success" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-muted">
              Max loss used {money(account.lossUsed, 0)} / {money(account.maxLoss, 0)}
            </span>
            <span className="num text-faint">{pct(lossProgress)}</span>
          </div>
          <Progress value={lossProgress} tone={lossProgress > 75 ? 'danger' : 'warn'} />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="text-muted">
              Benchmark days {account.benchmarkDone} / {account.benchmarkTotal}
            </span>
            <span className="num text-faint">{pct(benchmark)}</span>
          </div>
          <Progress value={benchmark} tone="brand" />
        </div>
      </div>

      <footer className="border-line/70 text-faint flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-2.5 text-[11.5px]">
        <span>
          Consistency <span className="num text-muted">{pct(account.consistency, 1)}</span>
        </span>
        <span className="flex items-center gap-1">
          <Server className="size-3.5" /> {account.server}
        </span>
        <span>Opened {account.openedAt}</span>
      </footer>
    </article>
  );
}

function AccountDetail({
  account,
  onClose,
}: {
  account: TradingAccount;
  onClose: () => void;
}) {
  const tabs = ['Overview', 'Calendar', 'History', 'Reset', 'Platform', 'Login info'] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview');
  const targetProgress = account.target ? clamp((account.profit / account.target) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex xl:items-stretch" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="anim-fade bg-overlay absolute inset-0"
      />
      <div className="anim-in bg-surface border-line relative mt-auto max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border p-4 sm:mt-0 sm:ml-auto sm:h-full sm:max-h-none sm:max-w-md sm:rounded-none sm:rounded-l-2xl xl:max-w-lg">
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="label-xs">{statusLabels[account.status]} account</span>
            <h2 className="text-[16px] font-semibold tracking-tight">{account.plan}</h2>
            <span className="text-faint num text-[11.5px]">
              {account.login} · {account.step}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted hover:text-ink hover:bg-elevated grid size-8 place-items-center rounded-lg"
          >
            <X className="size-[18px]" />
          </button>
        </header>

        <div className="rail mt-3">
          {tabs.map((item) => (
            <Chip key={item} active={tab === item} onClick={() => setTab(item)}>
              {item}
            </Chip>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="tile flex items-center gap-4 p-3">
            <Ring
              value={targetProgress}
              label={account.target ? pct(targetProgress) : '100%'}
              sub={account.target ? 'to target' : 'funded'}
              tone="#635bff"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-col">
                <span className="label-xs">Current balance</span>
                <span className="num text-[18px] font-semibold">{money(account.balance)}</span>
              </div>
              <div className="flex flex-col">
                <span className="label-xs">Equity</span>
                <span className="num text-[13.5px] font-medium">{money(account.equity)}</span>
              </div>
              <Badge tone={account.profit >= 0 ? 'success' : 'danger'}>
                {money(account.profit)} open P/L
              </Badge>
            </div>
          </div>

          {tab === 'Overview' && (
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Profit target" value={account.target ? money(account.target, 0) : 'Funded'} />
              <Stat label="Max loss limit" value={money(account.maxLoss, 0)} />
              <Stat label="Consistency" value={pct(account.consistency, 1)} tone="success" />
              <Stat
                label="Benchmark days"
                value={`${account.benchmarkDone}/${account.benchmarkTotal}`}
                tone="success"
              />
            </div>
          )}

          {tab === 'Calendar' && (
            <div className="tile p-3">
              <span className="label-xs">Trading days this cycle</span>
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 28 }).map((_, index) => {
                  const traded = [1, 2, 3, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 21, 22, 23].includes(
                    index,
                  );
                  return (
                    <span
                      key={index}
                      className={`grid aspect-square place-items-center rounded-md text-[10.5px] num ${
                        traded ? 'bg-success/20 text-success' : 'bg-elevated text-faint'
                      }`}
                    >
                      {index + 1}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'History' && (
            <ul className="flex flex-col divide-y divide-[color:var(--fn-line)]">
              {[
                ['Nov 08', 'EURUSD buy 1.20', '+$184.20'],
                ['Nov 08', 'XAUUSD sell 0.80', '-$96.40'],
                ['Nov 07', 'GBPJPY buy 1.00', '+$262.10'],
                ['Nov 06', 'US30 buy 0.50', '+$128.75'],
              ].map(([date, trade, result]) => (
                <li key={`${date}-${trade}`} className="flex items-center justify-between gap-3 py-2">
                  <div className="flex flex-col">
                    <span className="text-[12.5px]">{trade}</span>
                    <span className="text-faint text-[11px]">{date}</span>
                  </div>
                  <span
                    className={`num text-[12.5px] font-medium ${
                      result.startsWith('+') ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {result}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {tab === 'Reset' && (
            <div className="tile flex flex-col gap-2 p-3">
              <span className="text-[13px] font-medium">Reset this evaluation</span>
              <p className="text-muted text-[12px] leading-relaxed">
                Resetting restores the balance to {money(account.size, 0)} and restarts the profit
                target. Your trade history is archived.
              </p>
              <Button tone="neutral" size="sm" className="self-start">
                Reset for {money(account.size * 0.006)}
              </Button>
            </div>
          )}

          {tab === 'Platform' && (
            <div className="grid grid-cols-2 gap-2">
              <Stat label="Platform" value={account.platform} />
              <Stat label="Server" value={account.server} />
              <Stat label="Type" value={marketLabels[account.market]} />
              <Stat label="Leverage" value="1:100" />
            </div>
          )}

          {tab === 'Login info' && (
            <div className="tile flex flex-col gap-3 p-3">
              {[
                ['Login', account.login],
                ['Password', '••••••••••'],
                ['Investor password', '••••••••••'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="text-muted text-[12px]">{label}</span>
                  <span className="flex items-center gap-2">
                    <code className="num text-[12.5px]">{value}</code>
                    <button
                      type="button"
                      aria-label={`Copy ${label}`}
                      className="text-muted hover:text-ink"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlanCarousel() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(plans.length / perPage);
  const visible = useMemo(
    () => plans.slice(page * perPage, page * perPage + perPage),
    [page],
  );

  return (
    <section className="card p-3 sm:p-4" aria-labelledby="recommended-plans">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="recommended-plans" className="text-[14.5px] font-semibold tracking-tight">
            Recommended CFDs plans
          </h2>
          <p className="text-muted text-[12px]">Matched to your trading history and risk profile.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="num text-faint text-[11.5px]">
            {page + 1}/{pages}
          </span>
          <Button
            tone="neutral"
            size="sm"
            aria-label="Previous plans"
            disabled={page === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            tone="neutral"
            size="sm"
            aria-label="Next plans"
            disabled={page >= pages - 1}
            onClick={() => setPage((value) => Math.min(pages - 1, value + 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((plan: Plan) => (
          <article
            key={plan.id}
            className="border-line bg-elevated hover:border-brand/40 flex flex-col gap-2 rounded-xl border p-3 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[13.5px] font-semibold">{plan.name}</span>
                <span className="text-faint text-[11.5px]">
                  {plan.step} · {money(plan.size, 0)} account
                </span>
              </div>
              {plan.badge && <Badge tone="brand">{plan.badge}</Badge>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="num text-[19px] font-semibold">{money(plan.price)}</span>
              <span className="text-faint text-[11.5px]">one-time</span>
            </div>
            <Button tone="brand" size="sm" block icon={<ArrowRight className="size-4" />}>
              Start now
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AccountsPage({ onNavigate }: { onNavigate: (id: 'payout' | 'calendar') => void }) {
  const [market, setMarket] = useState<Market>('cfds');
  const [status, setStatus] = useState<AccountStatus>('active');
  const [sort, setSort] = useState<Sort>('Oldest');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<TradingAccount | null>(null);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [showEmptyPreview, setShowEmptyPreview] = useState(false);

  const list = useMemo(() => {
    const filtered = allAccounts.filter(
      (account) =>
        account.market === market && account.status === status && !deleted.includes(account.id),
    );
    const sorted = [...filtered];
    if (sort === 'Newest') sorted.sort((a, b) => b.openedAt.localeCompare(a.openedAt));
    if (sort === 'Oldest') sorted.sort((a, b) => a.openedAt.localeCompare(b.openedAt));
    if (sort === 'Balance high') sorted.sort((a, b) => b.balance - a.balance);
    if (sort === 'Profit high') sorted.sort((a, b) => b.profit - a.profit);
    return sorted;
  }, [market, status, sort, deleted]);

  const counts = useMemo(
    () => ({
      active: allAccounts.filter(
        (account) => account.market === market && account.status === 'active' && !deleted.includes(account.id),
      ).length,
      inactive: allAccounts.filter(
        (account) =>
          account.market === market && account.status === 'inactive' && !deleted.includes(account.id),
      ).length,
      breached: allAccounts.filter(
        (account) =>
          account.market === market && account.status === 'breached' && !deleted.includes(account.id),
      ).length,
    }),
    [market, deleted],
  );

  return (
    <div className="flex flex-col gap-4">
      <section className="card p-3 sm:p-4" aria-label="Account filters">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              options={[
                { value: 'cfds', label: 'CFDs' },
                { value: 'futures', label: 'Futures' },
              ]}
              value={market}
              onChange={(value) => {
                setMarket(value);
                setStatus('active');
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-expanded={showFilters}
                onClick={() => setShowFilters((value) => !value)}
                className="border-line bg-elevated text-muted hover:text-ink inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[12.5px] font-medium"
              >
                <Filter className="size-3.5" />
                Filters
              </button>
              <div className="relative">
                <label className="sr-only" htmlFor="sort-accounts">
                  Sort accounts
                </label>
                <select
                  id="sort-accounts"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as Sort)}
                  className="border-line bg-elevated text-muted hover:text-ink h-8 appearance-none rounded-lg border pr-8 pl-3 text-[12.5px] font-medium outline-none"
                >
                  {sorts.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-faint pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="rail sm:flex-wrap">
            {(['active', 'inactive', 'breached'] as AccountStatus[]).map((item) => (
              <Chip
                key={item}
                active={status === item}
                count={counts[item]}
                onClick={() => setStatus(item)}
              >
                {statusLabels[item]}
              </Chip>
            ))}
          </div>

          {showFilters && (
            <div className="anim-in border-line bg-elevated/60 grid grid-cols-1 gap-3 rounded-xl border p-3 sm:grid-cols-3">
              {[
                { label: 'Account size', options: ['Any', '$25K', '$50K', '$100K+'] },
                { label: 'Platform', options: ['Any', 'MT5', 'MT4', 'cTrader', 'Tradovate'] },
                { label: 'Phase', options: ['Any', 'Phase 1', 'Phase 2', 'Funded'] },
              ].map((group) => (
                <div key={group.label} className="flex flex-col gap-1.5">
                  <span className="label-xs">{group.label}</span>
                  <div className="rail sm:flex-wrap">
                    {group.options.map((option) => (
                      <Chip key={option} active={option === 'Any'}>
                        {option}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-line/70 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
            <p className="text-muted text-[12.5px]">
              {list.length} {statusLabels[status]} {marketLabels[market]} account
              {list.length === 1 ? '' : 's'}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                tone="ghost"
                size="sm"
                onClick={() => setShowEmptyPreview((value) => !value)}
                icon={<ArrowUpDown className="size-3.5" />}
              >
                {showEmptyPreview ? 'Show accounts' : 'Preview empty state'}
              </Button>
              <Button tone="brand" size="sm" icon={<Plus className="size-4" />}>
                New account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {showEmptyPreview || list.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid className="size-6" />}
          title="You don't have any accounts yet"
          body="Show your trading skills and get funded. Pick a plan, pass the evaluation and trade our capital while keeping up to 95% of the profit."
          actions={
            <>
              <Button tone="brand" block>
                Explore pricing plans
              </Button>
              <Button tone="neutral" block>
                Start free trial
              </Button>
            </>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onOpen={() => setSelected(account)}
              onDelete={() => setDeleted((value) => [...value, account.id])}
            />
          ))}
        </div>
      )}

      <PlanCarousel />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Quick links">
        <button
          type="button"
          onClick={() => onNavigate('payout')}
          className="card hover:border-brand/40 flex flex-col gap-1 p-3 text-left transition-colors"
        >
          <span className="label-xs">Payout</span>
          <span className="text-[14px] font-semibold">{money(4280)} disbursed</span>
          <span className="text-muted text-[12px]">Next request window opens in 4 days.</span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('calendar')}
          className="card hover:border-brand/40 flex flex-col gap-1 p-3 text-left transition-colors"
        >
          <span className="label-xs">Calendar</span>
          <span className="text-[14px] font-semibold">7 events today</span>
          <span className="text-muted text-[12px]">FOMC rate decision at 13:15 server time.</span>
        </button>
        <div className="card flex flex-col gap-1 p-3">
          <span className="label-xs">Benchmark days</span>
          <span className="text-[14px] font-semibold">3 of 5 complete</span>
          <Progress value={60} tone="success" className="mt-1" />
        </div>
      </section>

      {selected && <AccountDetail account={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
