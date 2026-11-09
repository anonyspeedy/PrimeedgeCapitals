import { useState, type ReactNode } from 'react';
import {
  Award,
  BadgeCheck,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Gift,
  Link2,
  Lock,
  Plus,
  Share2,
  Sparkles,
  Trophy,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react';
import {
  certificates as allCertificates,
  competitions,
  equitySeries,
  offers,
  payoutSeries,
  payouts as allPayouts,
  profileFields,
  referralSeries,
  referrals,
  transactions,
  user,
  weekDays,
} from '../../lib/data';
import { money, moneyCompact, pct } from '../../lib/format';
import {
  Badge,
  Button,
  Chip,
  Progress,
  Ring,
  SectionTitle,
  Segmented,
  Sparkline,
  Stat,
} from '../ui';

function PageWrap({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

function TableShell({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <thead>
            <tr className="border-line border-b">
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="text-faint px-3 py-2.5 text-[11px] font-semibold tracking-wide uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

const payoutStatusTone = {
  Disbursed: 'success',
  Requested: 'brand',
  Processing: 'warn',
  Rejected: 'danger',
} as const;

export function PayoutPage() {
  const [tab, setTab] = useState<'list' | 'requested' | 'disbursed'>('list');
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('4280');

  const rows = allPayouts.filter((payout) => {
    if (tab === 'requested') return payout.status === 'Requested' || payout.status === 'Processing';
    if (tab === 'disbursed') return payout.status === 'Disbursed';
    return true;
  });

  const disbursed = allPayouts
    .filter((payout) => payout.status === 'Disbursed')
    .reduce((sum, payout) => sum + payout.amount, 0);
  const requested = allPayouts
    .filter((payout) => payout.status === 'Requested' || payout.status === 'Processing')
    .reduce((sum, payout) => sum + payout.amount, 0);

  return (
    <PageWrap>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-3 sm:p-4">
          <Ring value={72} label={moneyCompact(22410)} sub="lifetime" tone="#635bff" />
          <div className="flex flex-col gap-0.5">
            <span className="label-xs">Total paid out</span>
            <span className="num text-[16px] font-semibold">{money(22410)}</span>
            <Badge tone="success">
              <TrendingUp className="size-3" /> +{pct(11.2, 1)} vs last cycle
            </Badge>
          </div>
        </div>
        <Stat
          label="Disbursed amount"
          value={money(disbursed)}
          hint="3 payouts completed"
          tone="success"
        />
        <Stat label="Requested amount" value={money(requested)} hint="2 awaiting review" />
      </section>

      <section className="card p-3 sm:p-4">
        <SectionTitle
          title="Payout volume"
          hint="Cycle-over-cycle disbursement growth"
          action={<Badge tone="brand">Last 10 cycles</Badge>}
        />
        <div className="mt-3">
          <Sparkline values={payoutSeries} tone="brand" height={72} />
        </div>
        <div className="text-faint mt-1 flex justify-between text-[11px]">
          <span>{moneyCompact(payoutSeries[0])}</span>
          <span>{moneyCompact(payoutSeries[payoutSeries.length - 1])}</span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented
            options={[
              { value: 'list', label: 'Payout list' },
              { value: 'requested', label: 'Requested payouts' },
              { value: 'disbursed', label: 'Disbursed amount' },
            ]}
            value={tab}
            onChange={setTab}
          />
          <Button tone="brand" size="md" icon={<Banknote className="size-4" />} onClick={() => setOpen(true)}>
            Request payout
          </Button>
        </div>

        <TableShell headers={['Account', 'Requested', 'Method', 'Amount', 'Status']}>
          {rows.map((payout) => (
            <tr key={payout.id} className="border-line/60 border-b last:border-0">
              <td className="num px-3 py-3 text-[12.5px]">{payout.account}</td>
              <td className="text-muted px-3 py-3 text-[12.5px]">{payout.requested}</td>
              <td className="text-muted px-3 py-3 text-[12.5px]">{payout.method}</td>
              <td className="num px-3 py-3 text-[12.5px] font-medium">{money(payout.amount)}</td>
              <td className="px-3 py-3">
                <Badge tone={payoutStatusTone[payout.status]}>{payout.status}</Badge>
              </td>
            </tr>
          ))}
        </TableShell>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="card flex flex-col gap-2 p-3 sm:p-4">
          <SectionTitle title="Payout methods" hint="Where profits are sent" />
          {[
            ['Rise / Crypto', 'USDT · TRC20', true],
            ['Bank transfer', '•••• 8842 · Chase', true],
            ['Wise', 'Not connected', false],
          ].map(([name, detail, connected]) => (
            <div
              key={name as string}
              className="border-line bg-elevated/60 flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5"
            >
              <div className="flex flex-col">
                <span className="text-[12.5px] font-medium">{name as string}</span>
                <span className="text-faint text-[11.5px]">{detail as string}</span>
              </div>
              {connected ? (
                <Badge tone="success">
                  <CheckCircle2 className="size-3" /> Active
                </Badge>
              ) : (
                <Button tone="neutral" size="sm" icon={<Plus className="size-3.5" />}>
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="card flex flex-col gap-2 p-3 sm:p-4">
          <SectionTitle title="Payout rules" hint="What unlocks a withdrawal" />
          <ul className="flex flex-col gap-2">
            {[
              ['Minimum 3 benchmark days', true],
              ['Positive balance above the max loss buffer', true],
              ['Consistency rule under 45%', true],
              ['KYC verification complete', false],
            ].map(([rule, done]) => (
              <li key={rule as string} className="flex items-center gap-2.5 text-[12.5px]">
                {done ? (
                  <CheckCircle2 className="text-success size-4 shrink-0" />
                ) : (
                  <Clock3 className="text-warn size-4 shrink-0" />
                )}
                <span className={done ? 'text-muted' : ''}>{rule as string}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close payout request"
            onClick={() => setOpen(false)}
            className="anim-fade bg-overlay absolute inset-0"
          />
          <div className="anim-in border-line bg-surface relative w-full max-w-sm rounded-2xl border p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[15px] font-semibold">Request payout</h3>
                <p className="text-muted text-[12.5px]">
                  Available from account 81450237: {money(320.4)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-muted hover:text-ink"
              >
                <XCircle className="size-[18px]" />
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="label-xs">Amount</span>
                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputMode="decimal"
                  className="border-line bg-elevated focus:border-brand/60 h-10 rounded-lg border px-3 text-[13.5px] outline-none"
                />
              </label>
              <div className="rail">
                {[25, 50, 100].map((percent) => (
                  <Chip key={percent} onClick={() => setAmount(String(percent))}>
                    {percent}%
                  </Chip>
                ))}
              </div>
              <div className="text-muted flex justify-between text-[12px]">
                <span>Method</span>
                <span>Rise / Crypto · USDT</span>
              </div>
              <div className="text-muted flex justify-between text-[12px]">
                <span>Arrives in</span>
                <span>up to 24 hours</span>
              </div>
              <Button tone="brand" block onClick={() => setOpen(false)}>
                Submit request
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrap>
  );
}

export function CertificatesPage() {
  const unlockedCount = allCertificates.filter((certificate) => certificate.unlocked).length;

  return (
    <PageWrap>
      <section className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="label-xs">Recognition</span>
          <h2 className="text-[17px] font-semibold tracking-tight">
            {unlockedCount} of {allCertificates.length} certificates unlocked
          </h2>
          <p className="text-muted max-w-lg text-[12.5px]">
            Certificates are issued automatically once you run the required number of funded accounts at
            the same time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Ring value={(unlockedCount / allCertificates.length) * 100} label={`${unlockedCount}/${allCertificates.length}`} sub="unlocked" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allCertificates.map((certificate) => (
          <article
            key={certificate.id}
            className={`card anim-in relative overflow-hidden p-4 ${
              certificate.unlocked ? '' : 'opacity-90'
            }`}
          >
            <div
              aria-hidden="true"
              className="absolute -top-12 -right-10 size-32 rounded-full opacity-20 blur-2xl"
              style={{ background: certificate.accent }}
            />
            <div className="relative flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="grid size-11 place-items-center rounded-xl"
                  style={{ background: `${certificate.accent}22`, color: certificate.accent }}
                >
                  {certificate.unlocked ? <Award className="size-5" /> : <Lock className="size-5" />}
                </span>
                <Badge tone={certificate.unlocked ? 'success' : 'muted'}>
                  {certificate.unlocked ? 'Unlocked' : 'Locked'}
                </Badge>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[14.5px] font-semibold">{certificate.tier}</h3>
                <p className="text-muted text-[12.5px] leading-relaxed">{certificate.note}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11.5px]">
                  <span className="text-muted">
                    {certificate.accounts} / {certificate.requirement} funded accounts
                  </span>
                  <span className="num text-faint">
                    {pct((certificate.accounts / certificate.requirement) * 100)}
                  </span>
                </div>
                <Progress
                  value={(certificate.accounts / certificate.requirement) * 100}
                  tone={certificate.unlocked ? 'success' : 'brand'}
                />
              </div>
              <Button
                tone={certificate.unlocked ? 'neutral' : 'ghost'}
                size="sm"
                block
                disabled={!certificate.unlocked}
              >
                {certificate.unlocked ? 'Download certificate' : 'Keep trading to unlock'}
              </Button>
            </div>
          </article>
        ))}
      </section>
    </PageWrap>
  );
}

const transactionTone = {
  Completed: 'success',
  Pending: 'warn',
  Failed: 'danger',
} as const;

export function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'credits' | 'debits'>('all');
  const rows = transactions.filter((transaction) => {
    if (filter === 'credits') return transaction.amount > 0;
    if (filter === 'debits') return transaction.amount < 0;
    return true;
  });

  return (
    <PageWrap>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Total credits" value={money(6260.75)} tone="success" hint="Payouts received" />
        <Stat label="Total debits" value={money(-1657)} tone="danger" hint="Fees, resets, reversals" />
        <Stat label="Net position" value={money(4603.75)} hint="Across 6 transactions" />
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          options={[
            { value: 'all', label: 'All' },
            { value: 'credits', label: 'Credits' },
            { value: 'debits', label: 'Debits' },
          ]}
          value={filter}
          onChange={setFilter}
        />
        <Button tone="neutral" size="md">
          Export CSV
        </Button>
      </section>

      <TableShell headers={['Date', 'Description', 'Method', 'Amount', 'Status']}>
        {rows.map((transaction) => (
          <tr key={transaction.id} className="border-line/60 border-b last:border-0">
            <td className="num text-muted px-3 py-3 text-[12.5px]">{transaction.date}</td>
            <td className="px-3 py-3 text-[12.5px]">{transaction.description}</td>
            <td className="text-muted px-3 py-3 text-[12.5px]">{transaction.method}</td>
            <td
              className={`num px-3 py-3 text-[12.5px] font-medium ${
                transaction.amount > 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {money(transaction.amount)}
            </td>
            <td className="px-3 py-3">
              <Badge tone={transactionTone[transaction.status]}>{transaction.status}</Badge>
            </td>
          </tr>
        ))}
      </TableShell>
    </PageWrap>
  );
}

export function CompetitionsPage() {
  const [joined, setJoined] = useState<string[]>(
    competitions.filter((competition) => competition.joined).map((competition) => competition.id),
  );

  return (
    <PageWrap>
      <section className="bg-surface border-brand/35 from-brand/12 to-transparent rounded-xl border bg-gradient-to-r p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-brand-ink flex items-center gap-1.5 text-[11.5px] font-semibold tracking-[0.14em] uppercase">
              <Trophy className="size-3.5" /> Live now
            </span>
            <h2 className="text-[16px] font-semibold tracking-tight">
              Weekly Trader League · {money(25000, 0)} prize pool
            </h2>
            <p className="text-muted max-w-md text-[12.5px]">
              You are ranked #412 of 4,820. Highest return with a consistency score under 45% wins.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Ring value={62} label="#412" sub="rank" tone="#05e594" />
            <Button tone="brand">View leaderboard</Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {competitions.map((competition) => {
          const isJoined = joined.includes(competition.id);
          return (
            <article key={competition.id} className="card anim-in flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[14.5px] font-semibold">{competition.name}</h3>
                  <span className="text-faint text-[11.5px]">
                    {competition.entrants.toLocaleString()} entrants · ends {competition.ends}
                  </span>
                </div>
                <Badge tone="brand">{money(competition.prize, 0)}</Badge>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="text-muted flex items-center justify-between text-[11.5px]">
                  <span>{isJoined ? 'Your progress' : 'Not joined'}</span>
                  <span className="num text-faint">{pct(competition.progress)}</span>
                </div>
                <Progress value={competition.progress} tone="mint" />
              </div>
              <Button
                tone={isJoined ? 'neutral' : 'brand'}
                size="sm"
                block
                onClick={() =>
                  setJoined((value) =>
                    isJoined
                      ? value.filter((id) => id !== competition.id)
                      : [...value, competition.id],
                  )
                }
              >
                {isJoined ? 'Leave competition' : 'Join competition'}
              </Button>
            </article>
          );
        })}
      </section>
    </PageWrap>
  );
}

export function ReferPage() {
  const [copied, setCopied] = useState(false);
  const link = 'https://primeedge.example.com/r/mina-mt81';

  const totals = referrals.reduce((sum, referral) => sum + referral.earned, 0);

  return (
    <PageWrap>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total earned" value={money(totals)} tone="success" hint="Lifetime revenue share" />
        <Stat label="Referred traders" value={String(referrals.length)} hint="2 active, 1 pending" />
        <Stat label="Conversion rate" value={pct(68)} hint="Signup to first purchase" />
        <Stat label="Revenue share" value="20%" hint="On every evaluation fee" />
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1.1fr_1fr]">
        <div className="card flex flex-col gap-3 p-4">
          <SectionTitle
            title="Your referral link"
            hint="Share it anywhere — attribution lasts 90 days"
            action={
              <Badge tone="brand">
                <Sparkles className="size-3" /> Tier 2
              </Badge>
            }
          />
          <div className="border-line bg-elevated flex items-center gap-2 rounded-lg border px-3 py-2.5">
            <Link2 className="text-faint size-4 shrink-0" />
            <code className="min-w-0 flex-1 truncate text-[12.5px]">{link}</code>
            <Button
              tone="neutral"
              size="sm"
              icon={<Copy className="size-3.5" />}
              onClick={() => {
                void navigator.clipboard?.writeText(link);
                setCopied(true);
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="rail sm:flex-wrap">
            {['X', 'WhatsApp', 'Telegram', 'LinkedIn', 'Email'].map((channel) => (
              <Chip key={channel}>
                <Share2 className="size-3.5" /> {channel}
              </Chip>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="label-xs">Earnings growth</span>
              <span className="num text-success text-[12.5px] font-medium">
                {money(referralSeries[referralSeries.length - 1])}
              </span>
            </div>
            <Sparkline values={referralSeries} tone="mint" height={56} />
          </div>
        </div>

        <div className="card flex flex-col gap-3 p-4">
          <SectionTitle title="Reward tiers" hint="Unlock higher revenue share as you refer" />
          {[
            ['Tier 1', '5 referrals', '15%', false],
            ['Tier 2', '15 referrals', '20%', true],
            ['Tier 3', '40 referrals', '25%', false],
          ].map(([tier, requirement, share, active]) => (
            <div
              key={tier as string}
              className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 ${
                active ? 'border-brand/45 bg-brand/10' : 'border-line bg-elevated/60'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[12.5px] font-medium">{tier as string}</span>
                <span className="text-faint text-[11.5px]">{requirement as string}</span>
              </div>
              <span className="num text-[13.5px] font-semibold">{share as string}</span>
            </div>
          ))}
          <Button tone="neutral" size="sm" block icon={<Users className="size-4" />}>
            Invite via email
          </Button>
        </div>
      </section>

      <TableShell headers={['Trader', 'Joined', 'Status', 'Earned']}>
        {referrals.map((referral) => (
          <tr key={referral.id} className="border-line/60 border-b last:border-0">
            <td className="px-3 py-3 text-[12.5px]">{referral.name}</td>
            <td className="num text-muted px-3 py-3 text-[12.5px]">{referral.joinedAt}</td>
            <td className="px-3 py-3">
              <Badge
                tone={
                  referral.status === 'Active'
                    ? 'success'
                    : referral.status === 'Pending'
                      ? 'warn'
                      : 'muted'
                }
              >
                {referral.status}
              </Badge>
            </td>
            <td className="num px-3 py-3 text-[12.5px] font-medium">{money(referral.earned)}</td>
          </tr>
        ))}
      </TableShell>
    </PageWrap>
  );
}

export function OffersPage() {
  const tones = {
    brand: 'from-brand/12 border-brand/40',
    mint: 'from-mint/12 border-mint/35',
    warn: 'from-warn/12 border-warn/35',
  } as const;

  return (
    <PageWrap>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <article
            key={offer.id}
            className={`bg-surface relative overflow-hidden rounded-xl border bg-gradient-to-br to-transparent p-4 ${tones[offer.tone]}`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <span className="bg-elevated text-brand-ink grid size-10 place-items-center rounded-xl">
                  <Gift className="size-5" />
                </span>
                <Badge tone="brand">{offer.discount}</Badge>
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight">{offer.title}</h3>
              <p className="text-muted text-[12.5px]">Expires {offer.expires}</p>
              <div className="border-line bg-surface/70 mt-1 flex items-center justify-between rounded-lg border border-dashed px-3 py-2">
                <code className="num text-[13px] font-semibold tracking-wider">{offer.code}</code>
                <button
                  type="button"
                  aria-label={`Copy ${offer.code}`}
                  onClick={() => void navigator.clipboard?.writeText(offer.code)}
                  className="text-muted hover:text-ink"
                >
                  <Copy className="size-4" />
                </button>
              </div>
              <Button tone="brand" size="sm" block>
                Apply to next purchase
              </Button>
            </div>
          </article>
        ))}
      </section>

      <section className="card flex flex-col gap-2 p-4">
        <SectionTitle title="Have a coupon code?" hint="Codes stack with tier rewards" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            placeholder="Enter coupon code"
            className="border-line bg-elevated focus:border-brand/60 h-10 flex-1 rounded-lg border px-3 text-[13.5px] outline-none"
          />
          <Button tone="neutral" size="md">
            Validate code
          </Button>
        </div>
      </section>
    </PageWrap>
  );
}

export function PartnerPage() {
  const tiers = [
    {
      name: 'Affiliate',
      payout: '20% revenue share',
      perks: ['Unique tracking link', 'Monthly payouts', 'Marketing toolkit'],
      icon: Share2,
    },
    {
      name: 'White label',
      payout: 'Custom spread share',
      perks: ['Own branded portal', 'Dedicated manager', 'Custom risk rules'],
      icon: BadgeCheck,
      featured: true,
    },
    {
      name: 'Institutional',
      payout: 'Volume based',
      perks: ['API liquidity', 'Sub-account tree', 'Priority support'],
      icon: Users,
    },
  ];

  return (
    <PageWrap>
      <section className="card p-4">
        <div className="flex flex-col gap-1">
          <span className="label-xs">Partnership</span>
          <h2 className="text-[17px] font-semibold tracking-tight">
            Grow with the PrimeEdge partner program
          </h2>
          <p className="text-muted max-w-2xl text-[12.5px]">
            Choose the tier that matches how you work. Applications are reviewed within two business
            days, and every tier includes real-time reporting on referred accounts.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`card anim-in flex flex-col gap-3 p-4 ${
              tier.featured ? 'border-brand/45' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="bg-elevated text-brand-ink grid size-10 place-items-center rounded-xl">
                <tier.icon className="size-5" />
              </span>
              {tier.featured && <Badge tone="brand">Most popular</Badge>}
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-[15px] font-semibold">{tier.name}</h3>
              <span className="text-muted text-[12.5px]">{tier.payout}</span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {tier.perks.map((perk) => (
                <li key={perk} className="text-muted flex items-center gap-2 text-[12.5px]">
                  <CheckCircle2 className="text-success size-3.5 shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
            <Button tone={tier.featured ? 'brand' : 'neutral'} block>
              Apply now
            </Button>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Partner payouts" value={money(1840000, 0)} hint="Paid to partners in 2026" />
        <Stat label="Active partners" value="1,240" hint="Across 38 countries" />
        <Stat label="Avg. approval time" value="1.8 days" hint="From application to live link" />
      </section>
    </PageWrap>
  );
}

export function ProfilePage() {
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <PageWrap>
      <section className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="from-brand to-brand-deep grid size-14 place-items-center rounded-2xl bg-gradient-to-br text-[18px] font-semibold text-white">
            {user.initials}
          </span>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[16px] font-semibold tracking-tight">{user.name}</h2>
            <span className="text-muted text-[12.5px]">{user.email}</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <Badge tone="brand">{user.tier}</Badge>
              <Badge tone="success">
                <BadgeCheck className="size-3" /> KYC verified
              </Badge>
            </div>
          </div>
        </div>
        <Button tone="neutral" icon={<Award className="size-4" />}>
          Account statement
        </Button>
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="card flex flex-col gap-3 p-4">
          <SectionTitle title="Personal details" hint="Used for KYC and payouts" />
          <ul className="flex flex-col divide-y divide-[color:var(--fn-line)]">
            {profileFields.map((field) => (
              <li key={field.label} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex flex-col">
                  <span className="text-faint text-[11px]">{field.label}</span>
                  <span className="text-[12.5px]">{field.value}</span>
                </div>
                <Badge tone={field.verified ? 'success' : 'warn'}>
                  {field.verified ? 'Verified' : 'Pending'}
                </Badge>
              </li>
            ))}
          </ul>
          <Button tone="neutral" size="sm" className="self-start">
            Update details
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="card flex flex-col gap-3 p-4">
            <SectionTitle title="Security" hint="Protect your account and payouts" />
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--fn-line)] bg-elevated/60 px-3 py-2.5">
              <div className="flex flex-col">
                <span className="text-[12.5px] font-medium">Two-factor authentication</span>
                <span className="text-faint text-[11.5px]">Authenticator app</span>
              </div>
              <Button
                tone={twoFactor ? 'success' : 'neutral'}
                size="sm"
                onClick={() => setTwoFactor((value) => !value)}
              >
                {twoFactor ? 'Enabled' : 'Enable'}
              </Button>
            </div>
            {[
              ['Password', 'Last changed 42 days ago'],
              ['Active sessions', 'This device · Chrome on Linux'],
              ['Withdrawal whitelist', '2 addresses (' + '••••' + '8842)'],
            ].map(([label, detail]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--fn-line)] bg-elevated/60 px-3 py-2.5"
              >
                <div className="flex flex-col">
                  <span className="text-[12.5px] font-medium">{label}</span>
                  <span className="text-faint text-[11.5px]">{detail}</span>
                </div>
                <Button tone="ghost" size="sm">
                  Manage
                </Button>
              </div>
            ))}
          </div>

          <div className="card flex flex-col gap-2 p-4">
            <SectionTitle title="Equity snapshot" hint="Across your live accounts" />
            <Sparkline values={equitySeries} tone="brand" height={64} />
            <div className="text-muted flex items-center justify-between text-[12px]">
              <span>Start {money(40120.5)}</span>
              <span className="num text-success font-medium">{money(42860.4)}</span>
            </div>
          </div>
        </div>
      </section>
    </PageWrap>
  );
}

export function CalendarPage() {
  const [scope, setScope] = useState<'today' | 'week'>('today');

  return (
    <PageWrap>
      <section className="card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This week' },
            ]}
            value={scope}
            onChange={setScope}
          />
          <Badge tone="brand">
            <CalendarDays className="size-3" /> November 2026
          </Badge>
        </div>

        <div className="rail mt-4 sm:flex-wrap">
          {weekDays.map((day) => (
            <div
              key={day.label}
              className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border ${
                day.today ? 'border-brand/50 bg-brand/12' : 'border-line bg-elevated'
              }`}
            >
              <span className="text-faint text-[10.5px] tracking-wide uppercase">{day.label}</span>
              <span className="num text-[16px] font-semibold">{day.date}</span>
              <span className="text-faint text-[10px]">{day.events} events</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="border-line border-b">
                {['Time', 'Currency', 'Event', 'Impact', 'Actual'].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="text-faint px-3 py-2.5 text-[11px] font-semibold tracking-wide uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(scope === 'today' ? 7 : 12)].map((_, index) => {
                const hours = 8 + index;
                return (
                  <tr key={index} className="border-line/60 border-b last:border-0">
                    <td className="num text-muted px-3 py-2.5 text-[12.5px]">
                      {String(hours).padStart(2, '0')}:30
                    </td>
                    <td className="px-3 py-2.5 text-[12.5px]">
                      {['USD', 'EUR', 'GBP', 'JPY', 'AUD'][index % 5]}
                    </td>
                    <td className="px-3 py-2.5 text-[12.5px]">
                      {
                        [
                          'Initial jobless claims',
                          'ECB governing council speech',
                          'FOMC rate decision',
                          'BoE minutes',
                          'Tokyo core CPI',
                          'Retail sales MoM',
                        ][index % 6]
                      }
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge
                        tone={(['danger', 'warn', 'muted'] as const)[index % 3]}
                      >
                        {['high', 'medium', 'low'][index % 3]}
                      </Badge>
                    </td>
                    <td className="num text-faint px-3 py-2.5 text-[12.5px]">—</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </PageWrap>
  );
}

export function CalculatorPage() {
  const [tab, setTab] = useState<'margin' | 'profit' | 'lot' | 'swap'>('margin');
  const [balance, setBalance] = useState('42860');
  const [risk, setRisk] = useState('1');
  const [stop, setStop] = useState('24');

  const riskUsd = (Number(balance || 0) * Number(risk || 0)) / 100;
  const lotSize = Number(stop || 1) ? riskUsd / (Number(stop || 1) * 10) : 0;

  return (
    <PageWrap>
      <section className="card p-4">
        <Segmented
          options={[
            { value: 'margin', label: 'Margin', icon: <Wallet className="size-3.5" /> },
            { value: 'profit', label: 'Profit / loss', icon: <TrendingUp className="size-3.5" /> },
            { value: 'lot', label: 'Lot size', icon: <Users className="size-3.5" /> },
            { value: 'swap', label: 'Swap', icon: <Clock3 className="size-3.5" /> },
          ]}
          value={tab}
          onChange={setTab}
        />
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.1fr]">
        <div className="card flex flex-col gap-3 p-4">
          <SectionTitle title="Inputs" hint="Values update instantly" />
          {tab === 'lot' ? (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="label-xs">Account balance (USD)</span>
                <input
                  value={balance}
                  onChange={(event) => setBalance(event.target.value)}
                  inputMode="numeric"
                  className="border-line bg-elevated focus:border-brand/60 h-10 rounded-lg border px-3 text-[13.5px] outline-none"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="label-xs">Risk per trade (%)</span>
                <input
                  value={risk}
                  onChange={(event) => setRisk(event.target.value)}
                  inputMode="decimal"
                  className="border-line bg-elevated focus:border-brand/60 h-10 rounded-lg border px-3 text-[13.5px] outline-none"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="label-xs">Stop loss (pips)</span>
                <input
                  value={stop}
                  onChange={(event) => setStop(event.target.value)}
                  inputMode="numeric"
                  className="border-line bg-elevated focus:border-brand/60 h-10 rounded-lg border px-3 text-[13.5px] outline-none"
                />
              </label>
            </>
          ) : (
            <>
              {[
                ['Instrument', 'EURUSD'],
                ['Lot size', '1.00'],
                ['Leverage', '1:100'],
              ].map(([label, value]) => (
                <label key={label} className="flex flex-col gap-1.5">
                  <span className="label-xs">{label}</span>
                  <input
                    defaultValue={value}
                    className="border-line bg-elevated focus:border-brand/60 h-10 rounded-lg border px-3 text-[13.5px] outline-none"
                  />
                </label>
              ))}
            </>
          )}
        </div>

        <div className="card flex flex-col gap-3 p-4">
          <SectionTitle title="Result" hint="Indicative values for planning only" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat
              label={tab === 'lot' ? 'Suggested lot size' : 'Required margin'}
              value={tab === 'lot' ? lotSize.toFixed(2) : money(1084.2)}
              tone="success"
            />
            <Stat label="Risk in dollars" value={money(riskUsd)} hint={`${risk}% of balance`} />
            <Stat label="Pip value" value={money(10)} hint="per standard lot" />
            <Stat label="Margin level" value={pct(1180, 0)} hint="healthy above 100%" />
          </div>
          <div className="tile p-3">
            <span className="label-xs">How it is calculated</span>
            <p className="text-muted mt-1 text-[12.5px] leading-relaxed">
              Position size = (balance × risk %) ÷ (stop loss in pips × pip value). Keep the result
              inside your plan&apos;s consistency rule before sizing up.
            </p>
          </div>
        </div>
      </section>
    </PageWrap>
  );
}
