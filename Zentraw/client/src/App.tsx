import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Content from "@/pages/content-fixed";
import AdminPanel from "@/pages/admin-fixed";
import AdminComplete from "@/pages/admin-complete";
import AdminEnhanced from "@/pages/admin-enhanced";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/content" component={Content} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/admin-complete" component={AdminComplete} />
      <Route path="/admin-enhanced" component={AdminComplete} />
      <Route path="/charts" component={() => <div className="flex items-center justify-center h-screen"><p>Página de Charts em desenvolvimento</p></div>} />
      <Route path="/schedule" component={() => <div className="flex items-center justify-center h-screen"><p>Página de Agendamento em desenvolvimento</p></div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
