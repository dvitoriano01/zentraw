import { ReactNode } from "react";

interface EditorLayoutProps {
  header: ReactNode;
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
  children: ReactNode;
}

export function EditorLayout({ header, leftSidebar, rightSidebar, children }: EditorLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {header}
      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          {leftSidebar}
        </aside>
        <main className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
        <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          {rightSidebar}
        </aside>
      </div>
    </div>
  );
}
