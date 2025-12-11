import { 
  CreditCard, 
  Wallet, 
  ShoppingBag, 
  Coffee, 
  BookOpen, 
  Bus, 
  Zap, 
  Film,
  Smartphone
} from "lucide-react";

export const USER = {
  name: "Alex Johnson",
  email: "alex.j@college.edu",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  college: "Tech Institute of Technology",
  year: "3rd Year",
  creditScore: 720,
};

export const WALLETS = [
  {
    id: "cash",
    name: "Cash Wallet",
    balance: 1250,
    color: "bg-emerald-500",
    icon: Wallet
  },
  {
    id: "e-atm",
    name: "E-ATM Card",
    balance: 5400,
    color: "bg-orange-500",
    icon: CreditCard
  },
  {
    id: "paylater",
    name: "PayLater",
    balance: 2000,
    limit: 5000,
    color: "bg-purple-600",
    icon: Zap
  },
  {
    id: "rewards",
    name: "Rewards",
    balance: 450,
    unit: "pts",
    color: "bg-yellow-500",
    icon: Wallet
  }
];

export const TRANSACTIONS = [
  {
    id: 1,
    merchant: "Starbucks",
    amount: 250,
    date: "Today, 10:30 AM",
    category: "Food & Drink",
    icon: Coffee,
    wallet: "e-atm",
    type: "debit"
  },
  {
    id: 2,
    merchant: "College Bookstore",
    amount: 1200,
    date: "Yesterday, 4:15 PM",
    category: "Education",
    icon: BookOpen,
    wallet: "paylater",
    type: "debit"
  },
  {
    id: 3,
    merchant: "Uber",
    amount: 180,
    date: "Yesterday, 9:00 AM",
    category: "Transport",
    icon: Bus,
    wallet: "e-atm",
    type: "debit"
  },
  {
    id: 4,
    merchant: "Pocket Money",
    amount: 5000,
    date: "Oct 25, 2023",
    category: "Income",
    icon: Wallet,
    wallet: "cash",
    type: "credit"
  },
  {
    id: 5,
    merchant: "Netflix",
    amount: 199,
    date: "Oct 24, 2023",
    category: "Entertainment",
    icon: Film,
    wallet: "e-atm",
    type: "debit"
  }
];

export const SUBSCRIPTIONS = [
  {
    id: 1,
    name: "Netflix Premium",
    amount: 649,
    cycle: "Monthly",
    nextDue: "Nov 15, 2023",
    icon: Film,
    logo: "N"
  },
  {
    id: 2,
    name: "Spotify Student",
    amount: 59,
    cycle: "Monthly",
    nextDue: "Nov 20, 2023",
    icon: Smartphone,
    logo: "S"
  },
  {
    id: 3,
    name: "Amazon Prime",
    amount: 1499,
    cycle: "Yearly",
    nextDue: "Jan 10, 2024",
    icon: ShoppingBag,
    logo: "A"
  }
];

export const PAYLATER_DUE = [
  {
    id: 101,
    merchant: "Myntra Fashion",
    amount: 1499,
    dueDate: "Due in 5 days",
    status: "Due"
  },
  {
    id: 102,
    merchant: "Swiggy",
    amount: 450,
    dueDate: "Due in 12 days",
    status: "Upcoming"
  }
];

export const SPENDING_DATA = [
  { name: 'Mon', amount: 400 },
  { name: 'Tue', amount: 300 },
  { name: 'Wed', amount: 800 },
  { name: 'Thu', amount: 200 },
  { name: 'Fri', amount: 950 },
  { name: 'Sat', amount: 1200 },
  { name: 'Sun', amount: 600 },
];
