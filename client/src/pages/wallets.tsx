import { WALLETS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Plus, CreditCard, Lock, RotateCw, Wallet as WalletIcon } from "lucide-react";
import cardBg from "@assets/generated_images/abstract_orange_and_green_pattern_for_virtual_card_background.png";
import { Button } from "@/components/ui/button";

export default function WalletsPage() {
  return (
    <div className="p-6 pb-24 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display">My Wallets</h1>
        <Button size="icon" variant="ghost">
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Cards Scroll Area */}
      <div className="relative w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20 group perspective-1000">
        <img src={cardBg} alt="Card Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
              <WalletIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <h3 className="font-display font-bold text-lg tracking-widest">BUDGETFOX</h3>
              <p className="text-[10px] opacity-70 uppercase tracking-widest">Student Platinum</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
               <div className="text-2xl font-mono tracking-widest drop-shadow-md">
                 •••• •••• •••• 4589
               </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-white/60 mb-1">Card Holder</p>
                <p className="font-medium text-sm tracking-wide">ALEX JOHNSON</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60 mb-1">Expires</p>
                <p className="font-medium text-sm">12/28</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Lock, label: "Freeze", bg: "bg-red-50 text-red-600 dark:bg-red-900/20" },
          { icon: RotateCw, label: "Flip", bg: "bg-zinc-50 text-zinc-600 dark:bg-zinc-800" },
          { icon: CreditCard, label: "Details", bg: "bg-zinc-50 text-zinc-600 dark:bg-zinc-800" },
        ].map((action, i) => (
          <button key={i} className={cn("flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-transform active:scale-95", action.bg)}>
            <action.icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Other Wallets */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-display">Your Pockets</h3>
        <div className="grid grid-cols-1 gap-4">
          {WALLETS.filter(w => w.id !== 'e-atm').map((wallet) => (
            <div key={wallet.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 dark:shadow-none", wallet.color)}>
                  <wallet.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-base">{wallet.name}</h4>
                  <p className="text-xs text-zinc-500">
                    {wallet.id === 'paylater' ? `Limit: ₹${wallet.limit}` : 'Available'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">₹{wallet.balance}</p>
                {wallet.unit && <span className="text-xs text-zinc-400">{wallet.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
