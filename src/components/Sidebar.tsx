import React from 'react';
import { 
  Users, 
  FolderKanban, 
  FileCode, 
  Settings, 
  Menu, 
  X, 
  TrendingUp,
  Workflow,
  Contact,
  UserCheck,
  BookOpen,
  Crown,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { id: 'projects', label: 'プロジェクト管理', icon: FolderKanban },
    { id: 'project-detail', label: '案件詳細ワークスペース', icon: Workflow },
    { id: 'clients', label: '顧客一覧', icon: Contact },
    { id: 'analysis', label: '分析・統計', icon: TrendingUp },
    { id: 'team', label: '組織・メンバー', icon: UserCheck },
    { id: 'templates', label: 'ファネルテンプレート', icon: FileCode },
    { id: 'learning', label: '学習知見Wiki', icon: BookOpen },
    { id: 'guide', label: '使い方マニュアル', icon: HelpCircle },
    { id: 'settings', label: 'システム設定', icon: Settings },
    { id: 'admin-console', label: '総合管理者コンソール', icon: Crown },
  ];

  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false); // Close on mobile
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          id="mobile-sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-lg bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0f172a] border-r border-slate-800 text-slate-300 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/80 bg-slate-950/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">U</div>
              <span className="text-xl font-bold tracking-tight text-white italic">UTAGE Flow</span>
            </div>
          </div>

          {/* Quick Metrics / Status Indicator in Workspace */}
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/10">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium bg-slate-950/40 rounded-lg p-2.5 border border-slate-800/40">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>本日のファネル進捗 : <span className="text-indigo-400 font-bold">順調</span></span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    isActive
                        ? 'bg-indigo-600/10 text-indigo-400 font-semibold border border-indigo-500/20 shadow-xs'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info / Profile Section at Bottom */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs border border-slate-600 text-white font-bold">
              管理
            </div>
            <div className="text-sm">
              <p className="text-white font-medium">田中 太郎</p>
              <p className="text-xs text-slate-500">プラン: Pro</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
