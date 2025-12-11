import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRANSACTIONS } from "@/lib/mockData";
import { Plus, Search, Filter, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Slider } from "@/components/ui/slider";

const SPENDING_DATA = [
  { name: 'M', amount: 400 },
  { name: 'T', amount: 300 },
  { name: 'W', amount: 800 },
  { name: 'T', amount: 200 },
  { name: 'F', amount: 950 },
  { name: 'S', amount: 1200 },
  { name: 'S', amount: 600 },
];

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTxForEmi, setSelectedTxForEmi] = useState<typeof TRANSACTIONS[0] | null>(null);
  const [emiTenure, setEmiTenure] = useState([3]);

  return (
    <div className="p-6 pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-display">Expenses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full h-10 w-10 shadow-lg shadow-primary/25">
              <Plus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500 font-bold">₹</span>
                  <Input className="pl-8 text-lg font-bold" placeholder="0.00" type="number" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Merchant / Description</Label>
                <Input placeholder="e.g. Starbucks, Uber" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Drink</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="bills">Bills</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4">
                <Button className="w-full h-12 text-lg">Add Expense</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-zinc-500">This Week</p>
            <h3 className="text-2xl font-bold font-display">₹4,450</h3>
          </div>
          <div className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
            +12% vs last week
          </div>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SPENDING_DATA}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#71717a' }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-zinc-900 text-white text-xs py-1 px-2 rounded-md shadow-xl">
                        ₹{payload[0].value}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 4, 4]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Food", "Transport", "Shopping", "Bills"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.toLowerCase()
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "bg-white text-zinc-600 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  tx.type === 'credit' ? "bg-emerald-100 text-emerald-600" : "bg-orange-50 text-orange-600 dark:bg-zinc-800 dark:text-zinc-400"
                )}>
                  <tx.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-base">{tx.merchant}</h4>
                  <p className="text-xs text-zinc-500">{tx.category} • {tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-bold text-base",
                  tx.type === 'credit' ? "text-emerald-600" : "text-zinc-900 dark:text-white"
                )}>
                  {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                </p>
                {tx.wallet === 'paylater' && (
                  <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-sm">BNPL</span>
                )}
              </div>
            </div>
            
            {/* EMI Option for large transactions */}
            {tx.amount > 1000 && tx.type === 'debit' && (
               <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-2 flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        className="text-xs text-orange-600 font-medium flex items-center gap-1 hover:underline"
                        onClick={() => setSelectedTxForEmi(tx)}
                      >
                        <Calculator className="w-3 h-3" /> Convert to EMI
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Convert to EMI</DialogTitle>
                        <DialogDescription>
                          Pay for {tx.merchant} in easy installments.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-6">
                        <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl">
                          <span className="text-sm font-medium">Total Amount</span>
                          <span className="text-xl font-bold">₹{tx.amount}</span>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between">
                             <Label>Tenure: {emiTenure[0]} Months</Label>
                             <span className="text-xs text-zinc-500">15% Interest p.a.</span>
                          </div>
                          <Slider 
                            value={emiTenure} 
                            onValueChange={setEmiTenure} 
                            max={12} 
                            min={3} 
                            step={3} 
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-zinc-400 px-1">
                             <span>3 Mo</span>
                             <span>6 Mo</span>
                             <span>9 Mo</span>
                             <span>12 Mo</span>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl space-y-2">
                           <div className="flex justify-between text-sm">
                              <span className="text-zinc-600 dark:text-zinc-400">Monthly EMI</span>
                              <span className="font-bold">₹{Math.ceil((tx.amount + (tx.amount * 0.15 * (emiTenure[0]/12))) / emiTenure[0])}</span>
                           </div>
                           <div className="flex justify-between text-xs text-zinc-500">
                              <span>Total Interest</span>
                              <span>+₹{Math.ceil(tx.amount * 0.15 * (emiTenure[0]/12))}</span>
                           </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-full">Confirm Conversion</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
