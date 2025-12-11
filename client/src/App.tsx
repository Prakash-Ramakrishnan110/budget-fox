import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import ExpensesPage from "@/pages/expenses";
import WalletsPage from "@/pages/wallets";
import ChatPage from "@/pages/chat";
import AppShell from "@/components/layout/AppShell";
import PayLaterPage from "@/pages/paylater";
import SubscriptionsPage from "@/pages/subscriptions";

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={AuthPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/expenses" component={ExpensesPage} />
        <Route path="/wallets" component={WalletsPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/paylater" component={PayLaterPage} />
        <Route path="/subscriptions" component={SubscriptionsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
