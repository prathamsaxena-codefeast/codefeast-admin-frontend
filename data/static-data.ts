import { LayoutDashboard, Users, Building2, ShieldCheck, CircleDotDashed, ListTodo, ContactRound, UserCheck, IndianRupee, HandCoins, Newspaper, NewspaperIcon } from 'lucide-react';

export const sidebarData = {
    loan: [
        {
            title: 'All Loans',
            icon: ListTodo,
            url: '/loan'
        },
        {
            title: 'Active Loans',
            icon: ShieldCheck,
            url: '/loan/active'
        },
        {
            title: 'Pending Loans',
            icon: CircleDotDashed,
            url: '/loan/pending'
        }
    ],
    platform: [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            url: '/dashboard'
        }
    ],
    members: [
        {
            title: 'Team ',
            icon: UserCheck,
            url: '/team'
        },
        {
            title: 'Branch ',
            icon: Building2,
            url: '/branch'
        },
        {
            title: 'Clients',
            icon: Users,
            url: '/clients'
        }
    ],
    investments: [
        {
            title: 'Investors',
            icon: HandCoins,
            url: '/investors'
        },
    ],
    lead: [
        {
            title: 'Inquiries',
            icon: ContactRound,
            url: '/inquiries'
        },
        {
            title: 'Newsletter',
            icon: NewspaperIcon,
            url: '/newsletter'
        },
    ]
};

export const userProfile = {
    name: 'Divyanshi Admin',
    email: 'admin@divyanshi.com',
    role: 'Administrator',
    avatarUrl: '/assets/avatar.png'
};
