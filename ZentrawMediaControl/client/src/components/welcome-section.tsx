import { useQuery } from "@tanstack/react-query";
import { User, Newspaper, Video, Download } from "lucide-react";

type UserStats = {
  bios: number;
  releases: number;
  videos: number;
  downloads: number;
};

export default function WelcomeSection() {
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });

  const statItems = [
    {
      icon: User,
      label: "Biographies",
      value: stats?.bios || 0,
      gradientClass: "gradient-blue",
      iconColor: "text-white"
    },
    {
      icon: Newspaper,
      label: "Press Releases",
      value: stats?.releases || 0,
      gradientClass: "gradient-purple",
      iconColor: "text-white"
    },
    {
      icon: Video,
      label: "Videos Created",
      value: stats?.videos || 0,
      gradientClass: "gradient-purple",
      iconColor: "text-white"
    },
    {
      icon: Download,
      label: "PDF Downloads",
      value: stats?.downloads || 0,
      gradientClass: "gradient-blue",
      iconColor: "text-white"
    }
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-3">
          Welcome back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Alex Rodriguez</span>
        </h2>
        <p className="text-gray-400 text-lg">Create professional content for your music career with AI-powered tools</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="gradient-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${item.gradientClass} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`${item.iconColor} h-6 w-6`} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{item.value}</p>
                  <p className="text-sm text-gray-400">{item.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
