import { Link, useLocation } from "wouter";
import { 
  Home, 
  Music, 
  Palette, 
  BarChart3, 
  Calendar,
  Sparkles,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/profile", icon: Music, label: "Artist Profile" },
    { href: "/content", icon: Palette, label: "Generate Content" },
    { href: "/charts", icon: BarChart3, label: "Music Charts" },
    { href: "/schedule", icon: Calendar, label: "Schedule Posts" },
    { href: "/admin", icon: Settings, label: "Admin Panel" },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">ZENTRAW</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer",
                  isActive
                    ? "text-primary bg-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">DJ Producer</p>
            <p className="text-xs text-gray-500">artist@zentraw.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
