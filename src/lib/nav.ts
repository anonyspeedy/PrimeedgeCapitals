import {
  Award,
  BadgePercent,
  BookOpen,
  CalendarDays,
  Gift,
  LayoutGrid,
  LifeBuoy,
  LineChart,
  Share2,
  Users,
  Wallet,
} from 'lucide-react';
import type { ComponentType } from 'react';

export type RouteId =
  | 'accounts'
  | 'payout'
  | 'refer'
  | 'partner'
  | 'offers'
  | 'competitions'
  | 'certificates'
  | 'transactions'
  | 'profile'
  | 'calendar'
  | 'calculator';

export interface NavItem {
  id: RouteId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: number;
  href?: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: 'Trading',
    items: [
      { id: 'accounts', label: 'Accounts', icon: LayoutGrid },
      { id: 'payout', label: 'Payout', icon: Wallet },
      { id: 'competitions', label: 'Competitions', icon: LineChart, badge: 3 },
      { id: 'certificates', label: 'Certificates', icon: Award },
      { id: 'transactions', label: 'Transactions', icon: BookOpen },
    ],
  },
  {
    title: 'Growth',
    items: [
      { id: 'refer', label: 'Refer & Earn', icon: Share2 },
      {
        id: 'partner',
        label: 'Become a Partner',
        icon: Users,
        href: 'https://partner.example.com/apply',
        external: true,
      },
      { id: 'offers', label: 'My Offers', icon: Gift, badge: 2 },
      { id: 'calendar', label: 'Economic Calendar', icon: CalendarDays },
      { id: 'calculator', label: 'Calculator', icon: BadgePercent },
    ],
  },
];

export const secondaryNav: NavItem[] = [
  { id: 'profile', label: 'Profile & KYC', icon: Users },
  {
    id: 'accounts',
    label: 'Help & Support',
    icon: LifeBuoy,
    href: 'https://help.example.com/trader',
    external: true,
  },
];

export const routeMeta: Record<RouteId, { title: string; subtitle: string }> = {
  accounts: {
    title: 'Accounts',
    subtitle: 'Track every evaluation, funded account and benchmark day in one place.',
  },
  payout: {
    title: 'Payout',
    subtitle: 'Request profit splits and follow each disbursement end to end.',
  },
  refer: {
    title: 'Refer & Earn',
    subtitle: 'Share your link and earn a revenue share for every trader who joins.',
  },
  partner: {
    title: 'Become a Partner',
    subtitle: 'Scale with white-label, affiliate and institutional partnership tiers.',
  },
  offers: {
    title: 'My Offers',
    subtitle: 'Personal discounts and coupons applied to your next purchase.',
  },
  competitions: {
    title: 'Competitions',
    subtitle: 'Compete for cash prizes and climb the leaderboard.',
  },
  certificates: {
    title: 'Certificates',
    subtitle: 'Unlock recognition tiers by running multiple funded accounts.',
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'Every fee, reset, payout and reversal on your account.',
  },
  profile: {
    title: 'Profile & KYC',
    subtitle: 'Keep your identity, payout and security details up to date.',
  },
  calendar: {
    title: 'Economic Calendar',
    subtitle: 'Plan around market-moving events across every session.',
  },
  calculator: {
    title: 'Calculator',
    subtitle: 'Model margin, position size, swap and profit targets before you trade.',
  },
};
