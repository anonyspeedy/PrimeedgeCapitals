export type Market = 'cfds' | 'futures';
export type AccountStatus = 'active' | 'inactive' | 'breached';

export interface TradingAccount {
  id: string;
  login: string;
  plan: string;
  market: Market;
  step: string;
  size: number;
  balance: number;
  equity: number;
  profit: number;
  target: number;
  maxLoss: number;
  lossUsed: number;
  consistency: number;
  benchmarkTotal: number;
  benchmarkDone: number;
  winRate: number;
  trades: number;
  status: AccountStatus;
  platform: string;
  server: string;
  openedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  step: string;
  size: number;
  price: number;
  badge?: string;
}

export interface NewsEvent {
  time: string;
  currency: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
}

export interface Payout {
  id: string;
  account: string;
  requested: string;
  amount: number;
  method: string;
  status: 'Disbursed' | 'Requested' | 'Processing' | 'Rejected';
}

export interface Certificate {
  id: string;
  tier: string;
  accounts: number;
  requirement: number;
  unlocked: boolean;
  accent: string;
  note: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  method: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Offer {
  id: string;
  title: string;
  code: string;
  discount: string;
  expires: string;
  tone: 'brand' | 'mint' | 'warn';
}

export interface Competition {
  id: string;
  name: string;
  prize: number;
  entrants: number;
  ends: string;
  joined: boolean;
  progress: number;
}

export interface Referral {
  id: string;
  name: string;
  joinedAt: string;
  status: 'Active' | 'Pending' | 'Inactive';
  earned: number;
}

export interface CalendarDay {
  label: string;
  date: number;
  today: boolean;
  events: number;
}

export interface ProfileField {
  label: string;
  value: string;
  verified: boolean;
}
