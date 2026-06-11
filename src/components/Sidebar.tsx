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
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  setIsOpen,
  isCollapsed,
  setIsCollapsed
}: SidebarProps) {
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
    setIsOpen(false); // Close mobile drawer
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          id="mobile-sidebar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2.5 rounded-xl bg-slate-900 text-white shadow-md hover:bg-slate-850 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-slate-950/40 z-40 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/90 text-slate-700 flex flex-col justify-between transition-all duration-300 ease-in-out transform md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Logo Section */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-xs shrink-0 select-none">
                U
              </div>
              {!isCollapsed && (
                <span className="text-base font-black tracking-tight text-slate-900 font-sans whitespace-nowrap">
                  UTAGE <span className="text-indigo-650 text-xs font-semibold px-1 py-0.5 rounded bg-indigo-50 border border-indigo-100 ml-0.5">Flow</span>
                </span>
              )}
            </div>

            {/* Collapse / Expand Toggle Button for Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 hover:border-slate-350 transition-all cursor-pointer shadow-3xs"
              title={isCollapsed ? "メニューを展開" : "メニューを畳む"}
            >
              {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Quick Metrics (Dressed down beautifully for Note-style look) */}
          {!isCollapsed && (
            <div className="px-4.5 py-3 border-b border-slate-100 bg-slate-50/30 shrink-0">
              <div className="flex items-center space-x-2 text-[10.5px] text-slate-500 font-semibold bg-white rounded-xl p-2.5 border border-slate-150 shadow-3xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">進捗状況 : <span className="text-emerald-700 font-black">順調 (リアルタイム)</span></span>
              </div>
            </div>
          )}

          {/* Navigation Links - Scrollable on long menus */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 select-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleMenuClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-bold transition-all duration-150 group cursor-pointer ${
                    isCollapsed ? 'justify-center py-3 px-0' : 'space-x-3 px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-805 font-black border border-indigo-100/90 shadow-3xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-800'
                  }`} />
                  
                  {!isCollapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info / Profile Section at Bottom */}
        <div className="p-4 border-t border-slate-150 bg-slate-50/50 shrink-0 select-none">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800/20 flex items-center justify-center text-[10.5px] text-white font-black shrink-0">
              管
            </div>
            {!isCollapsed && (
              <div className="text-slate-700 min-w-0">
                <p className="text-slate-900 font-extrabold text-[11px] truncate leading-tight">田中 太郎</p>
                <p className="text-[10px] text-slate-400 font-bold block mt-0.5">プラン: Pro (検証)</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

