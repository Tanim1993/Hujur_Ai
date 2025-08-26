import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/home";
import Landing from "./pages/landing";
import Chapter from "./pages/chapter";
import Lesson from "./pages/lesson";
import AdvancedVoice from "./pages/advanced-voice";
import NooraniQaida from "./pages/noorani-qaida";
import Analytics from "./pages/analytics";
import HelpCenter from "./pages/help-center";
import ParentGuide from "./pages/parent-guide";
import Contact from "./pages/contact";
import NotFound from "./pages/not-found";
import { useAuth } from "./hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/chapter/:chapterId" component={Chapter} />
          <Route path="/lesson/:lessonId" component={Lesson} />
          <Route path="/advanced-voice" component={AdvancedVoice} />
          <Route path="/noorani-qaida" component={NooraniQaida} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/help-center" component={HelpCenter} />
          <Route path="/parent-guide" component={ParentGuide} />
          <Route path="/contact" component={Contact} />
        </>
      )}
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
