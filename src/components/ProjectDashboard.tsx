import React, { useState } from 'react';
import { 
  Project, 
  Client, 
  FunnelType, 
  ProjectStatus 
} from '../types';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Briefcase,
  Layers,
  ChevronRight,
  Sparkles,
  Calendar,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

interface ProjectDashboardProps {
  projects: Project[];
  clients: Client[];
  onOpenAddModal: () => void;
  onOpenDetailModal: (project: Project) => void;
}

export default function ProjectDashboard({ 
  projects, 
  clients, 
  onOpenAddModal, 
  onOpenDetailModal 
}: ProjectDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunnel, setSelectedFunnel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Calculate Metrics based on active state
  const totalProjectsCount = projects.length;
  const inProgressCount = projects.filter(p => p.status !== '本番稼働中').length;
  const completedCount = projects.filter(p => p.status === '本番稼働中').length;
  
  // High-fidelity active financial / metric summary
  const totalValueSum = projects.reduce((sum, p) => {
    if (p.revenue) {
      const num = parseInt(p.revenue.replace(/[^0-9]/g, ''));
      return isNaN(num) ? sum : sum + num;
    }
    return sum;
  }, 0);

  // Filter logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.funnelType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFunnel = selectedFunnel === 'all' || project.funnelType === selectedFunnel;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

    return matchesSearch && matchesFunnel && matchesStatus;
  });

  const funnelCategories: FunnelType[] = [
    'セミナー集客ファネル',
    '個別相談ファネル',
    '自社プロダクト販売ファネル',
    '無料プレゼント配布ファネル',
    'オンラインコンテンツ販売ファネル'
  ];

  const statusCategories: ProjectStatus[] = [
    '原稿執筆中',
    'クライアント確認中',
    'UTAGE実装中',
    'テスト運用中',
    '本番稼働中'
  ];

  // Status tag styles with indigo theme
  const getStatusBadgeStyle = (status: ProjectStatus) => {
    switch (status) {
      case '本番稼働中':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'テスト運用中':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200/50';
      case 'UTAGE実装中':
        return 'bg-violet-50 text-violet-600 border-violet-200/50';
      case 'クライアント確認中':
        return 'bg-amber-50 text-amber-600 border-amber-200/50';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // Get active steps info
  const getCurrentPhase = (project: Project) => {
    const activeStep = project.funnelSteps?.find(s => s.status === '制作中' || s.status === '確認中');
    return activeStep ? activeStep.name : (project.funnelSteps?.[0]?.name || 'キックオフ準備');
  };

  // Split into Main (Feature) Card and Sub Cards for the Bento Grid layout
  const mainFeaturedProject = filteredProjects[0];
  const remainingProjects = filteredProjects.slice(1);

  return (
    <div className="space-y-8 text-slate-800">
      {/* Top Banner / Welcome Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">プロジェクト管理</h1>
          <p className="text-slate-500 mt-1">現在進行中のファネル設計・UTAGE構築案件（計 {projects.length} 件）</p>
        </div>
        
        <button
          id="btn-add-project-top"
          onClick={onOpenAddModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          <span>新規プロジェクト追加</span>
        </button>
      </div>

      {/* Bento Grid layout container */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

        {/* 1. Main Active Project (Featured Big Bento Card) */}
        {mainFeaturedProject ? (
          <div 
            onClick={() => onOpenDetailModal(mainFeaturedProject)}
            className="md:col-span-4 md:row-span-2 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[360px]"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-3.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100">
                  最優先リード
                </span>
                <span className="text-xs text-indigo-400 font-semibold bg-indigo-50/50 px-2 py-0.5 rounded-md">
                  {mainFeaturedProject.funnelType}
                </span>
              </div>
              
              <h2 className="text-2xl font-black mb-1.5 text-slate-800 italic tracking-tight">
                {mainFeaturedProject.clientName}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                {mainFeaturedProject.description}
              </p>
            </div>

            <div className="space-y-6">
              {/* Progress and status */}
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-semibold text-slate-700 italic underline decoration-indigo-300 decoration-2">
                    進捗状況: {mainFeaturedProject.status}
                  </span>
                  <span className="text-3xl font-black text-indigo-600">
                    {mainFeaturedProject.progress}%
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)] transition-all duration-500"
                    style={{ width: `${mainFeaturedProject.progress}%` }}
                  />
                </div>
              </div>
              
              {/* Secondary Bento Grid metrics info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">現在のフェーズ</p>
                  <p className="font-bold text-slate-800 text-sm truncate">{getCurrentPhase(mainFeaturedProject)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">目標期日 (始動日)</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {mainFeaturedProject.targetDate} <span className="text-[10px] font-normal text-slate-400">({mainFeaturedProject.startDate})</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-center items-center shadow-sm text-center">
            <Briefcase className="h-10 w-10 text-slate-300 mb-2" />
            <p className="text-slate-500 font-medium">アクティブなプロジェクトがありません</p>
          </div>
        )}

        {/* 2. Bento Stats Card (Small indigo filled block) */}
        <div className="md:col-span-2 bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/10 flex flex-col justify-between">
          <div>
            <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">全アクティブ案件</p>
            <h4 className="text-5xl font-black mt-3 tracking-tight">{projects.length}</h4>
          </div>
          <div className="mt-6 pt-4 border-t border-indigo-500/40">
            <div className="flex justify-between items-center text-xs text-indigo-150">
              <span>稼働中: <strong>{inProgressCount} 件</strong></span>
              <span>公開済: <strong>{completedCount} 件</strong></span>
            </div>
            <p className="text-indigo-200 text-[10px] mt-2 font-medium">現在すべてのUTAGE独自ドメインでSSL有効を確認</p>
          </div>
        </div>

        {/* 3. Bento Quick Action Client Template Card */}
        <div className="md:col-span-2 bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">設計テンプレート活用</p>
              <h4 className="font-black text-lg mt-1 tracking-tight">実証済みの構成パターン</h4>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          
          <div className="mt-4 text-xs text-slate-400 leading-relaxed font-medium">
            1クリックで個別相談LP、エバーグリーン、動画教材マイページ等の構成を新規開発プロジェクトに適用できます。
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>全 4 パターン公開中</span>
            <span className="text-indigo-400 font-bold">テンプレートを見る</span>
          </div>
        </div>

        {/* 4. Secondary projects listed as Bento Cards of size col-span-2 */}
        {remainingProjects.map((project, index) => (
          <div
            key={project.id}
            onClick={() => onOpenDetailModal(project)}
            className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between h-[210px]"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800 tracking-tight truncate max-w-[140px]">
                  {project.clientName}
                </h3>
                <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-lg border ${getStatusBadgeStyle(project.status)}`}>
                  {project.status === 'クライアント確認中' ? '確認中' : project.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mb-4">{project.funnelType}</p>
              
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {project.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>進行: {project.progress}%</span>
                <span>目標: {project.targetDate}</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        
        {/* If there are no remaining projects but filter returned empty, search was handled or we show placeholder */}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
              <Search className="h-8 w-8" />
            </div>
            <div>
              <p className="text-slate-800 font-bold text-base">該当するプロジェクトが見つかりません</p>
              <p className="text-slate-400 text-xs mt-1">別のキーワードに変更するか、絞り込みをクリアしてください。</p>
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFunnel('all');
                setSelectedStatus('all');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
            >
              フィルターをクリアする
            </button>
          </div>
        )}

      </div>

      {/* Filter / Search Area (Repositioned to make Bento Grid feel very structured) */}
      <div className="bg-white px-5 py-4 rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="クライアント名、LP配信目的で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Funnel Filter */}
        <div className="relative">
          <select
            value={selectedFunnel}
            onChange={(e) => setSelectedFunnel(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 focus:border-indigo-500 focus:outline-hidden bg-white cursor-pointer"
          >
            <option value="all">すべてのファネル種別</option>
            {funnelCategories.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-500 focus:border-indigo-500 focus:outline-hidden bg-white cursor-pointer"
          >
            <option value="all">すべての進捗状況</option>
            {statusCategories.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
}
