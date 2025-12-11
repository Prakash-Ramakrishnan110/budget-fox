import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PAYLATER_DUE, WALLETS } from "@/lib/mockData";
import { AlertCircle, Calendar, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PayLaterPage() {
  const wallet = WALLETS.find(w => w.id === 'paylater');
  const used = wallet ? wallet.limit! - wallet.balance : 0;
  const percentage = wallet ? (used / wallet.limit!) * 100 : 0;

  return (
    <div className="p-6 pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <Zap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-display">PayLater</h1>
      </div>

      {/* Credit Limit Card */}
      <Card className="border-none shadow-xl bg-linear-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">Available Limit</p>
                    <h2 className="text-4xl font-bold font-display">₹{wallet?.balance.toLocaleString()}</h2>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/10">
                    Total: ₹{wallet?.limit?.toLocaleString()}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-xs text-purple-200">
                    <span>Used: ₹{used.toLocaleString()}</span>
                    <span>{percentage.toFixed(0)}% Utilized</span>
                </div>
                <Progress value={percentage} className="h-2 bg-black/20" indicatorClassName="bg-white" />
            </div>
        </CardContent>
      </Card>

      {/* Credit Score Teaser */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                720
            </div>
            <div>
                <h3 className="font-semibold text-sm">Excellent Score</h3>
                <p className="text-xs text-zinc-500">You're eligible for a limit increase!</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-400" />
      </div>

      {/* Repayments */}
      <div>
        <h3 className="text-lg font-bold font-display mb-4">Upcoming Repayments</h3>
        <div className="space-y-3">
            {PAYLATER_DUE.map((due) => (
                <div key={due.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-zinc-800 flex items-center justify-center text-orange-600 dark:text-zinc-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">{due.merchant}</h4>
                            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {due.dueDate}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-sm">₹{due.amount}</p>
                        <Button size="sm" variant="outline" className="h-7 text-xs mt-1 border-purple-200 text-purple-700 hover:bg-purple-50">
                            Pay Now
                        </Button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
        <p className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Pay your bills by the 5th of every month to avoid late fees and keep your credit score high.
        </p>
      </div>
    </div>
  );
}
