import { useLocation } from "wouter";
import BottomNav from "./BottomNav";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAuth = location === "/" || location === "/auth";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans text-foreground pb-24 md:pb-0">
      <div className="max-w-md mx-auto bg-white dark:bg-zinc-950 min-h-screen shadow-2xl overflow-hidden relative">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
