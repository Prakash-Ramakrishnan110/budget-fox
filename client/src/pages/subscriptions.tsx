import { SUBSCRIPTIONS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Calendar, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionsPage() {
  return (
    <div className="p-6 pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display">Subscriptions</h1>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
          ₹{SUBSCRIPTIONS.reduce((acc, curr) => acc + curr.amount, 0)}/mo
        </div>
      </div>

      <div className="space-y-4">
        {SUBSCRIPTIONS.map((sub) => (
          <div key={sub.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-700 dark:text-zinc-300">
                  {sub.logo}
                </div>
                <div>
                  <h3 className="font-bold text-base">{sub.name}</h3>
                  <p className="text-xs text-zinc-500">{sub.cycle} • ₹{sub.amount}</p>
                </div>
              </div>
              <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-full">
                <Check className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs text-orange-600 font-medium">
                <Calendar className="w-4 h-4" />
                Next: {sub.nextDue}
              </div>
              <Button variant="link" className="h-auto p-0 text-xs text-zinc-400 hover:text-primary">
                Manage
              </Button>
            </div>
          </div>
        ))}

        {/* Add New Subscription */}
        <button className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 font-medium text-sm hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center gap-2">
            + Add New Subscription
        </button>
      </div>

      {/* Insight */}
      <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-2xl flex gap-3">
        <div className="bg-white dark:bg-zinc-700 p-2 rounded-lg h-fit">
            <AlertCircle className="w-5 h-5 text-zinc-500" />
        </div>
        <div>
            <h4 className="font-semibold text-sm mb-1">Budget Insight</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
                You're spending 15% of your monthly allowance on subscriptions. Consider sharing a family plan to save ₹300/mo.
            </p>
        </div>
      </div>
    </div>
  );
}
