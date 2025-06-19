import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Music, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Sparkles,
  Image,
  Users,
  BarChart3
} from "lucide-react";
import { type ArtistProfile, type GeneratedContent } from "@shared/schema";

export default function Dashboard() {
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showCreateContent, setShowCreateContent] = useState(false);

  // Queries for ZENTRAW music platform data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: content = [], isLoading: contentLoading } = useQuery({
    queryKey: ["/api/content", 1], // Demo user ID
  });

  const { data: charts = [], isLoading: chartsLoading } = useQuery({
    queryKey: ["/api/charts"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1d ago";
    return `${diffInDays}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">ZENTRAW Dashboard</h2>
              <p className="text-gray-600">AI-powered tools for music artists and DJs</p>
            </div>
            <Link href="/content">
              <Button className="bg-primary text-white hover:bg-indigo-600">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Content
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Artist Profile</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? "..." : stats?.hasProfile ? "Active" : "Setup"}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Generated Content</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? "..." : stats?.totalContent || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Image className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scheduled Posts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? "..." : stats?.scheduledPosts || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chart Entries</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {statsLoading ? "..." : stats?.chartsAvailable || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/profile">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 w-full"
                  >
                    <Palette className="w-6 h-6" />
                    Generate Bio & Release
                  </Button>
                </Link>
                <Link href="/content">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 w-full"
                  >
                    <Image className="w-6 h-6" />
                    Create Cover Art
                  </Button>
                </Link>
                <Link href="/charts">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2 w-full"
                  >
                    <Music className="w-6 h-6" />
                    Music Charts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Content */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Content</h3>
                  <Button variant="outline" size="sm" disabled={contentLoading}>
                    {contentLoading ? "Loading..." : `${content.length} total`}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {(content as any[])?.slice(0, 3).map((item: any) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                          {item.type === 'cover' ? (
                            <Image className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Music className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(item.createdAt)} • {item.type}
                          </p>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {content.length === 0 && !contentLoading && (
                    <div className="text-center py-8 text-gray-500">
                      <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No content generated yet</p>
                      <p className="text-sm">Create your first AI-generated content!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Music Charts */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Music Charts</h3>
                  <Button variant="outline" size="sm" disabled={chartsLoading}>
                    {chartsLoading ? "Loading..." : `${charts.length} entries`}
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {charts.slice(0, 4).map((chart: any) => (
                    <div key={chart.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          #{chart.position}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{chart.trackName}</p>
                          <p className="text-sm text-gray-600">{chart.artistName} • {chart.platform}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {chart.genre || 'Electronic'}
                      </Badge>
                    </div>
                  ))}
                  
                  {charts.length === 0 && !chartsLoading && (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No chart data available</p>
                      <p className="text-sm">Chart information will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Features Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
                  <h4 className="font-medium text-gray-900 mb-2">Bio & Release Generator</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Generate professional artist bios and press releases using AI
                  </p>
                  <Link href="/profile">
                    <Button variant="outline" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
                
                <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
                  <Palette className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                  <h4 className="font-medium text-gray-900 mb-2">Cover Art Creation</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Create stunning album covers and promotional artwork
                  </p>
                  <Link href="/content">
                    <Button variant="outline" size="sm">
                      Create Art
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
