import { Link, useLocation } from "wouter";
import { Home, CreditCard, PieChart, MessageSquare, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: PieChart, label: "Expenses", path: "/expenses" },
    { icon: Wallet, label: "Wallets", path: "/wallets" },
    { icon: MessageSquare, label: "Foxy AI", path: "/chat" },
  ];

  if (location === "/" || location === "/auth") return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe pt-2 px-6 h-20 md:hidden z-50">
      <div className="flex justify-between items-center h-full pb-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 transition-all duration-200",
                isActive ? "text-primary" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              )}>
                <div className={cn(
                  "p-1.5 rounded-xl transition-all",
                  isActive && "bg-primary/10"
                )}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
