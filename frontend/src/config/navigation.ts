// config/navigation.ts
import {
 LayoutDashboard,
 CreditCard,
 TrendingUp,
 Settings
} from 'lucide-react';

export const mainNavigation = [
 { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
 { name: 'Transactions', href: '/transactions', icon: CreditCard },
 { name: 'Analytics', href: '/analytics', icon: TrendingUp },
 { name: 'Settings', href: '/settings', icon: Settings }
];