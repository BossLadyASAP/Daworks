import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import SplashScreen from "./pages/SplashScreen";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Catalogue from "./pages/Catalogue";
import Reports from "./pages/Reports";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Stock from "./pages/Stock";
import Settings from "./pages/Settings";
import Share from "./pages/Share";
import Payment from "./pages/Payment";
import OTP from "./pages/OTP";
import Onboarding from "./pages/Onboarding";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import OrderDetail from "./pages/OrderDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/dashboard" component={() => <DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/catalogue" component={Catalogue} />
      <Route path="/reports" component={Reports} />
      <Route path="/orders" component={() => <DashboardLayout><Orders /></DashboardLayout>} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/stock" component={Stock} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={() => <DashboardLayout><Settings /></DashboardLayout>} />
      <Route path="/share" component={() => <DashboardLayout><Share /></DashboardLayout>} />
      <Route path="/payment" component={Payment} />
      <Route path="/otp" component={OTP} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/add-product" component={() => <DashboardLayout><AddProduct /></DashboardLayout>} />
      <Route path="/product/:id" component={() => <DashboardLayout><ProductDetail /></DashboardLayout>} />
      <Route path="/order/:id" component={() => <DashboardLayout><OrderDetail /></DashboardLayout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
