import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Editor from '@/pages/Editor';
import PhotoEditor from '@/pages/PhotoEditorFixed';
import AdminDashboard from '@/pages/AdminDashboard';
import BlenderVisualizerPage from '@/pages/blender-visualizer';

function Router() {
  return (
    <Switch>
      <Route path="/" component={PhotoEditor} />
      <Route path="/editor" component={Editor} />
      <Route path="/photo-editor" component={PhotoEditor} />
      <Route path="/blender" component={BlenderVisualizerPage} />
      <Route path="/admin" component={AdminDashboard} />
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
