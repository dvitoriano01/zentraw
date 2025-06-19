import { Music, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="glass-effect border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center glow-purple">
                <Music className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  Zentraw
                </h1>
                <span className="text-xs text-purple-300 font-medium tracking-wide">ARTIST TOOLKIT</span>
              </div>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white font-medium transition-colors">Toolkit</Link>
            <Link href="/workspace" className="text-gray-300 hover:text-white font-medium transition-colors flex items-center space-x-1">
              <Palette className="h-4 w-4" />
              <span>Editor V1.3</span>
            </Link>
            <Link href="/layer-test" className="text-gray-300 hover:text-white font-medium transition-colors">Layer Test</Link>
            <Link href="/studio-pro" className="text-gray-300 hover:text-white font-medium transition-colors flex items-center space-x-1">
              <Palette className="h-4 w-4" />
              <span>Studio Pro</span>
            </Link>
            <Button className="gradient-purple hover:opacity-90 transition-opacity glow-purple">
              <span className="mr-2">⭐</span>Premium
            </Button>
          </nav>
          <button className="md:hidden p-2">
            <div className="w-5 h-5 flex flex-col justify-between">
              <div className="w-full h-0.5 bg-gray-300"></div>
              <div className="w-full h-0.5 bg-gray-300"></div>
              <div className="w-full h-0.5 bg-gray-300"></div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
