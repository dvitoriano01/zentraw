import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Newspaper, Video, ChevronRight, ArrowRight } from "lucide-react";

export default function RecentProjects() {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'biography':
        return <Music className="text-blue-600 h-4 w-4" />;
      case 'press-release':
        return <Newspaper className="text-emerald-600 h-4 w-4" />;
      case 'video':
        return <Video className="text-purple-600 h-4 w-4" />;
      default:
        return <Music className="text-gray-600 h-4 w-4" />;
    }
  };

  const getProjectBgColor = (type: string) => {
    switch (type) {
      case 'biography':
        return 'bg-blue-100 dark:bg-blue-900/20';
      case 'press-release':
        return 'bg-emerald-100 dark:bg-emerald-900/20';
      case 'video':
        return 'bg-purple-100 dark:bg-purple-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const projectDate = new Date(date);
    const diffMs = now.getTime() - projectDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <Card className="shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
          <p className="text-sm text-gray-600">Quick access to your work</p>
        </div>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No projects saved yet</p>
            <p className="text-sm text-gray-400">Your saved biographies, press releases, and videos will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm bg-white/10 backdrop-blur-md border border-white/20">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
        <p className="text-sm text-gray-300">Quick access to your work</p>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          {projects.map((project: any) => (
            <div 
              key={project.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getProjectBgColor(project.type)} rounded-lg flex items-center justify-center`}>
                  {getProjectIcon(project.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{project.name}</p>
                  <p className="text-xs text-gray-400">{formatTimeAgo(project.createdAt)}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        <Button variant="ghost" className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 hover:bg-white/5">
          View All Projects <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
