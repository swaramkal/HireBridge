import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRealtime } from "@/hooks/use-realtime";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import CandidateLoginPage from "@/pages/candidate-login";
import CandidateRegisterPage from "@/pages/candidate-register";
import CandidateDashboardPage from "@/pages/candidate-dashboard";
import CompanyLoginPage from "@/pages/company-login";
import CompanyRegisterPage from "@/pages/company-register";
import CompanyDashboardPage from "@/pages/company-dashboard";
import AdminLoginPage from "@/pages/admin-login";
import AdminDashboardPage from "@/pages/admin-dashboard";
import JobsPage from "@/pages/jobs";

const queryClient = new QueryClient();

function RealtimeBridge() {
  useRealtime();
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/candidate/login" component={CandidateLoginPage} />
      <Route path="/candidate/register" component={CandidateRegisterPage} />
      <Route path="/candidate/dashboard" component={CandidateDashboardPage} />
      <Route path="/company/login" component={CompanyLoginPage} />
      <Route path="/company/register" component={CompanyRegisterPage} />
      <Route path="/company/dashboard" component={CompanyDashboardPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/jobs" component={JobsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <RealtimeBridge />
          <Router />
        </WouterRouter>
        <Toaster />
        <SonnerToaster position="bottom-right" richColors closeButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
