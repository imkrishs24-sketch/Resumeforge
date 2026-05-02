import { Switch, Route, Router as WouterRouter } from "wouter";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-foreground text-xl">Page not found</p>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
