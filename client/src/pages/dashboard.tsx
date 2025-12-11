import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Bell, Search, Plus, ArrowUpRight, ArrowDownLeft, ScanLine } from "lucide-react";
import { walletAPI, transactionAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import cardBg from "@assets/generated_images/abstract_orange_and_green_pattern_for_virtual_card_background.png";
import { useAuth } from "@/hooks/useAuth";
import { Coffee, BookOpen, Bus, Wallet, Film } from "lucide-react";

const ICONS: Record<string, any> = {
  food: Coffee,
  education: BookOpen,
  transport: Bus,
  income: Wallet,
  entertainment: Film,
  shopping: Wallet,
  bills: Wallet,
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: walletsData } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletAPI.getAll,
  });

  const { data: transactionsData } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionAPI.getAll(10),
  });

  const wallets = walletsData?.wallets || [];
  const transactions = transactionsData?.transactions || [];
  const mainWallet = wallets.find((w: any) => w.walletType === "e-atm");
  const paylaterWallet = wallets.find((w: any) => w.walletType === "paylater");

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 bg-orange-100">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                {user?.name?.[0] || "U"}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Welcome back,</h2>
            <h1 className="text-xl font-bold font-display text-zinc-900 dark:text-white">
              {user?.name?.split(" ")[0] || "User"}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 dark:border-zinc-800">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-zinc-200 dark:border-zinc-800 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </Button>
        </div>
      </header>

      {/* Main Card */}
      <div className="relative w-full aspect-[1.6/1] rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20 group">
        <img src={cardBg} alt="Card Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 font-medium text-sm mb-1">Total Balance</p>
              <h2 className="text-3xl font-bold font-display">
                ₹{mainWallet ? parseFloat(mainWallet.balance).toLocaleString() : "0"}
              </h2>
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold border border-white/10">
              E-ATM
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-1.5 w-8 bg-white/40 rounded-full"></div>
              <div className="h-1.5 w-1.5 bg-white/20 rounded-full"></div>
              <div className="h-1.5 w-1.5 bg-white/20 rounded-full"></div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/60 mb-1">Card Number</p>
                <p className="font-mono tracking-wider text-sm">•••• •••• •••• {Math.floor(1000 + Math.random() * 9000)}</p>
              </div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Plus, label: "Add", color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400", path: "/expenses" },
          { icon: ScanLine, label: "Scan", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", path: "/expenses" },
          { icon: ArrowUpRight, label: "Send", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", path: "/wallets" },
          { icon: ArrowDownLeft, label: "Request", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", path: "/wallets" }
        ].map((action, i) => (
          <Link key={i} href={action.path}>
            <button className="flex flex-col items-center gap-2 group w-full">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-active:scale-95", action.color)}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{action.label}</span>
            </button>
          </Link>
        ))}
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold font-display">Recent Activity</h3>
          <Link href="/expenses" className="text-sm text-primary font-medium hover:underline">See All</Link>
        </div>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <p>No transactions yet</p>
              <Link href="/expenses">
                <Button className="mt-4">Add Your First Expense</Button>
              </Link>
            </div>
          ) : (
            transactions.slice(0, 4).map((tx: any) => {
              const Icon = ICONS[tx.category] || Wallet;
              return (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      tx.type === "credit" ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{tx.merchant}</h4>
                      <p className="text-xs text-zinc-500">{tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold text-sm",
                      tx.type === "credit" ? "text-emerald-600" : "text-zinc-900 dark:text-white"
                    )}>
                      {tx.type === "credit" ? "+" : "-"}₹{parseFloat(tx.amount)}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PayLater Teaser */}
      {paylaterWallet && (
        <Link href="/paylater">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-purple-500/20 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-purple-200 font-medium mb-1">PayLater Available</p>
                <h3 className="text-lg font-bold">
                  ₹{parseFloat(paylaterWallet.balance).toLocaleString()} / ₹{paylaterWallet.limit ? parseFloat(paylaterWallet.limit).toLocaleString() : "0"}
                </h3>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold">
                Use Now
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
