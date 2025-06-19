import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Workspace from "@/components/workspace";
import ZentrawCanvasWorkspace from "@/components/ZentrawCanvasWorkspace";
import ZentrawWorkspaceLayout from "@/components/ZentrawWorkspaceLayout";
import ZentrawWorkspaceFull from "@/components/ZentrawWorkspaceFull";
import ZentrawStudio from "@/pages/zentraw-studio";
import LayerTestPreview from "@/components/LayerTestPreview";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/workspace" component={Workspace} />
      <Route path="/canvas" component={() => <ZentrawCanvasWorkspace onExport={(img) => console.log('Imagem exportada:', img)} />} />
      <Route path="/editor" component={ZentrawWorkspaceLayout} />
      <Route path="/studio" component={ZentrawWorkspaceFull} />
      <Route path="/studio-pro" component={ZentrawStudio} />
      <Route path="/layer-test" component={LayerTestPreview} />
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
