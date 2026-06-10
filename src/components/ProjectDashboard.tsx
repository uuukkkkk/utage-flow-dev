import React, { useState } from 'react';
import { 
  Project, 
  Client, 
  FunnelType, 
  ProjectStatus,
  AutomationLog
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
  Zap,
  LayoutGrid,
  Kanban,
  RefreshCw,
  Database,
  ArrowLeft,
  ArrowRight,
  Settings,
  Shield,
  HelpCircle,
  Activity,
  Check,
  Globe,
  Webhook
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AutomationLogsView from './AutomationLogsView';


interface ProjectDashboardProps {
  projects: Project[];
  clients: Client[];
  onOpenAddModal: () => void;
  onOpenDetailModal: (project: Project) => void;
  onUpdateProject?: (updatedProject: Project) => void;
}

export default function ProjectDashboard({ 
  projects, 
  clients, 
  onOpenAddModal, 
  onOpenDetailModal,
  onUpdateProject
}: ProjectDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFunnel, setSelectedFunnel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Dashboard view toggle: 'grid' (traditional bento) or 'kanban'
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');

  // Tab selection: 'projects' | 'logs'
  const [dashboardTab, setDashboardTab] = useState<'projects' | 'logs'>('projects');

  // Centering Automation sync logs entries
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([
    {
      id: "log-1",
      action: "UTAGE API Sync - Steps Update",
      statusCode: 200,
      status: "success",
      timestamp: "2026-06-10 08:01:15",
      message: "ツバサ教育アカデミー様：プロジェクト進捗を35%（特典送付・価値教育メール設定）に同期しました。",
      details: "{\n  \"action\": \"sync_status\",\n  \"client\": \"ツバサ教育アカデミー様\",\n  \"progress\": 35,\n  \"stage\": \"原稿執筆中\",\n  \"status_code\": 200\n}"
    },
    {
      id: "log-2",
      action: "Webhook Sync Trigger",
      statusCode: 200,
      status: "success",
      timestamp: "2026-06-10 07:42:30",
      message: "木漏れ日ヨガスタジオ様：LINE自動友だち追加時応答Webhook受信。タグ『体験会案内配信中』を付与完了。",
      details: "{\n  \"event\": \"line.follow\",\n  \"client_id\": \"c2\",\n  \"tag_applied\": \"体験会案内配信中\",\n  \"webhook_status\": \"success\"\n}"
    },
    {
      id: "log-3",
      action: "Stripe Webhook Sync",
      statusCode: 201,
      status: "success",
      timestamp: "2026-06-09 23:45:10",
      message: "フロンティアコンサルのプロ様：決済Webhook受信。金額 600,000円 の領収・メンバーシップ自動招待に成功しました。",
      details: "{\n  \"payment_provider\": \"Stripe\",\n  \"amount\": 600000,\n  \"currency\": \"jpy\",\n  \"user_notified\": true\n}"
    },
    {
      id: "log-4",
      action: "UTAGE API Connection Handshake",
      statusCode: 200,
      status: "success",
      timestamp: "2026-06-09 21:14:02",
      message: "接続確認成功：Stripe決済・UTAGE Webhook疎通テストに成功しました。",
      details: "{\n  \"api_endpoint\": \"https://dots-direction.utage.biz/api/v1/auth\",\n  \"handshake\": \"OK\"\n}"
    },
    {
      id: "log-5",
      action: "ドリップ配信公開スケジュール同期",
      statusCode: 200,
      status: "success",
      timestamp: "2026-06-09 18:32:45",
      message: "ネクストステージ英語教室様：マイページ会員コンテンツの「順次ドリップスケジュール配信」情報の同期が完了しました。",
      details: "{\n  \"sync_type\": \"drip_schedule\",\n  \"lessons\": 24,\n  \"membership_tiers\": [\"Standard\", \"Gold\"]\n}"
    },
    {
      id: "log-6",
      action: "SSL Domain Handshake",
      statusCode: 401,
      status: "warning",
      timestamp: "2026-06-08 14:20:11",
      message: "外部ドメイン連携警告：提供されたUTAGEサブドメイン[dots-direction.utage.biz]へのSSLセキュリティ認証キーの有効期限が24時間以内に切れる可能性があります。自動更新ジョブを確認してください。",
      details: "{\n  \"domain\": \"dots-direction.utage.biz\",\n  \"ssl_provider\": \"Let's Encrypt\",\n  \"days_remaining\": 1\n}"
    },
    {
      id: "log-7",
      action: "UTAGE API Form Validation Error",
      statusCode: 500,
      status: "error",
      timestamp: "2026-06-07 11:30:15",
      message: "同期失敗：和風ハーブティー工房様の決済フォームタグ連動処理中にDNSタイムアウトが発生しました。UTAGEサブドメイン検証を再試行します。",
      details: "{\n  \"error_code\": \"ERR_DNS_TIMEOUT\",\n  \"target_url\": \"https://wafuu-herb.utage.biz/api/v1/forms\",\n  \"retries_remaining\": 3\n}"
    }
  ]);

  // UTAGE Sync modal states
  const [isUtageSyncOpen, setIsUtageSyncOpen] = useState(false);
  const [utageSubdomain, setUtageSubdomain] = useState('dots-direction');
  const [utageApiKey, setUtageApiKey] = useState('ut_live_550e8400e29b41d4a716446655440000');
  const [autoSync, setAutoSync] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed' | 'error'>('idle');
  const [syncStep, setSyncStep] = useState(0);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    "2026-06-09 21:14:02 - Stripe決済・UTAGE Webhook疎通テスト成功",
    "2026-06-09 18:32:45 - 会員サイト「ネクストステージ英語教室様」ドリップスケジュール同期完了",
    "2026-06-08 14:20:11 - オプトインLP「ツバサ教育アカデミー様」タグ連動メンバー+12名検知"
  ]);

  // Drag and Drop State tracking
  const [draggingOverStatus, setDraggingOverStatus] = useState<string | null>(null);

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

  // Helper to adjust percentage automatically when status is updated
  const getProgressForStatus = (status: ProjectStatus, currentProgress: number): number => {
    switch (status) {
      case '原稿執筆中':
        return currentProgress < 15 ? 15 : currentProgress;
      case 'クライアント確認中':
        return currentProgress < 45 ? 45 : currentProgress;
      case 'UTAGE実装中':
        return currentProgress < 70 ? 70 : currentProgress;
      case 'テスト運用中':
        return currentProgress < 90 ? 90 : currentProgress;
      case '本番稼働中':
        return 100;
      default:
        return currentProgress;
    }
  };

  const updateProjectStatus = (projectId: string, newStatus: ProjectStatus) => {
    if (!onUpdateProject) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const nextProgress = getProgressForStatus(newStatus, project.progress);
    onUpdateProject({
      ...project,
      status: newStatus,
      progress: nextProgress
    });

    // Create dynamic automation sync log entry
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      projectId: projectId,
      projectName: project.clientName,
      action: 'プロジェクトステータス同期',
      statusCode: 200,
      status: 'success',
      timestamp: timeStr,
      message: `${project.clientName}：進捗ステータスを「${newStatus}」に自動同期完了 (${nextProgress}%)。`,
      details: JSON.stringify({
        event: "project_status_sync",
        client_id: project.clientId,
        client_name: project.clientName,
        new_status: newStatus,
        progress: nextProgress,
        sync_method: "automatic_rest_pipe"
      }, null, 2)
    };
    setAutomationLogs(prev => [newLog, ...prev]);
  };

  // Drag handles
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDraggingOverStatus(status);
  };

  const handleDragLeave = () => {
    setDraggingOverStatus(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ProjectStatus) => {
    e.preventDefault();
    setDraggingOverStatus(null);
    const projectId = e.dataTransfer.getData('text/plain');
    if (projectId) {
      updateProjectStatus(projectId, targetStatus);
    }
  };

  // Clickable fallbacks for quick status transition
  const handleMoveStatus = (id: string, currentStatus: ProjectStatus, direction: 'left' | 'right') => {
    const currentIndex = statusCategories.indexOf(currentStatus);
    if (direction === 'left' && currentIndex > 0) {
      updateProjectStatus(id, statusCategories[currentIndex - 1]);
    } else if (direction === 'right' && currentIndex < statusCategories.length - 1) {
      updateProjectStatus(id, statusCategories[currentIndex + 1]);
    }
  };

  // Simulate UTAGE Live Sync
  const handleStartUtageSync = () => {
    setSyncStatus('syncing');
    setSyncStep(1);

    setTimeout(() => {
      setSyncStep(2);
      setTimeout(() => {
        setSyncStep(3);
        setTimeout(() => {
          setSyncStep(4);
          setTimeout(() => {
            setSyncStatus('completed');
            const now = new Date();
            const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
            setSyncLogs(prev => [
              `${timeStr} - 同期成功 - リスト・LPステップ自動マッピング更新`,
              ...prev
            ]);

            // Prepend a log to the Automation Logs state as well
            const manualSyncLog: AutomationLog = {
              id: `log-${Date.now()}`,
              action: '手動一括API同期',
              statusCode: 200,
              status: 'success',
              timestamp: timeStr,
              message: `手動一括同期成功：接続先 [${utageSubdomain}.utage.biz] のリスト及びLPアセット(${projects.length}件分)の自動構成マッピングを正常同期しました。`,
              details: JSON.stringify({
                api_trigger: "user_manual_dashboard_click",
                subdomain: utageSubdomain,
                status_code: 200,
                ssl_secured: true,
                records_extracted: projects.length,
                timestamp: timeStr
              }, null, 2)
            };
            setAutomationLogs(prev => [manualSyncLog, ...prev]);
          }, 800);
        }, 800);
      }, 700);
    }, 600);
  };

  // Metrics (Financial and project volume stats)
  const totalProjectsCount = projects.length;
  const inProgressCount = projects.filter(p => p.status !== '本番稼働中').length;
  const completedCount = projects.filter(p => p.status === '本番稼働中').length;
  
  const totalValueSum = projects.reduce((sum, p) => {
    if (p.revenue) {
      const num = parseInt(p.revenue.replace(/[^0-9]/g, ''));
      return isNaN(num) ? sum : sum + num;
    }
    return sum;
  }, 0);

  // Filter projects according to search & categories
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.funnelType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFunnel = selectedFunnel === 'all' || project.funnelType === selectedFunnel;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;

    return matchesSearch && matchesFunnel && matchesStatus;
  });

  // Status badge styles with indigo theme
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

  const getStatusBadgeColor = (status: ProjectStatus) => {
    switch (status) {
      case '本番稼働中': return 'emerald';
      case 'テスト運用中': return 'indigo';
      case 'UTAGE実装中': return 'violet';
      case 'クライアント確認中': return 'amber';
      default: return 'slate';
    }
  };

  const getCurrentPhase = (project: Project) => {
    const activeStep = project.funnelSteps?.find(s => s.status === '制作中' || s.status === '確認中');
    return activeStep ? activeStep.name : (project.funnelSteps?.[0]?.name || 'キックオフ準備');
  };

  const mainFeaturedProject = filteredProjects[0];
  const remainingProjects = filteredProjects.slice(1);

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner / Welcome row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-100">
              BUILD PIPELINE DASHBOARD
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-teal-600 font-black bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100 animate-pulse">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
              UTAGE 自動常時同期 有効
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1f2937] tracking-tight mt-1.5">プロジェクト管理</h1>
          <p className="text-xs text-slate-400 mt-1">クライアント別のUTAGEファネル開発案件の進捗管理および動的ステータス管理を行います。</p>
        </div>
        
        {/* Actions Button Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* UTAGE Autodeploy sync control */}
          <button
            onClick={() => {
              setIsUtageSyncOpen(true);
              setSyncStatus('idle');
            }}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="h-4 w-4 text-indigo-500" />
            <span>UTAGE同期ダッシュボード</span>
          </button>

          <button
            id="btn-add-project-top"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>新規プロジェクトを追加</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-slate-200/80 flex items-center space-x-1">
        <button
          onClick={() => setDashboardTab('projects')}
          className={`px-4.5 py-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            dashboardTab === 'projects'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-350'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>案件進捗ダッシュボード</span>
        </button>
        <button
          id="tab-automation-logs"
          onClick={() => setDashboardTab('logs')}
          className={`px-4.5 py-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer flex items-center gap-2 relative ${
            dashboardTab === 'logs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-350'
          }`}
        >
          <Activity className="h-4 w-4 text-rose-500" />
          <span>常時連携同期ログ (Automation Logs)</span>
          <span className="px-1.5 py-0.5 text-[9px] font-bold font-mono bg-indigo-100 text-indigo-700 rounded-full">
            {automationLogs.length}
          </span>
          {automationLogs.some(log => log.status === 'error') && (
            <span className="absolute top-2 right-1.5 flex h-1.5 w-1.5 font-sans">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-550"></span>
            </span>
          )}
        </button>
      </div>

      {dashboardTab === 'projects' ? (
        <>
          {/* Global Toolbar and Filter / Search Area */}
          <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="顧客名、ファネル目的で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-indigo-500 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-550 font-medium text-slate-800"
            />
          </div>

          {/* Funnel categories selection */}
          <div>
            <select
              value={selectedFunnel}
              onChange={(e) => setSelectedFunnel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-indigo-500 focus:outline-hidden focus:bg-white text-slate-600 font-bold"
            >
              <option value="all">すべてのファネル種別（絞り込み）</option>
              {funnelCategories.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Status filtering (only visible/applied in Grid Mode to keep boards clean) */}
          {viewMode === 'grid' && (
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl focus:border-indigo-500 focus:outline-hidden focus:bg-white text-slate-600 font-bold"
              >
                <option value="all">すべての進捗ステータス</option>
                {statusCategories.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* View Mode Toggle Slider */}
        <div className="shrink-0 flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60 self-start lg:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-white text-indigo-750 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>グリッド (Stats)</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              viewMode === 'kanban' 
                ? 'bg-white text-indigo-750 shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Kanban className="h-4 w-4 text-emerald-500" />
            <span>カンバン (Drag & Drop)</span>
          </button>
        </div>
      </div>

      {/* Main Container Switch */}
      {viewMode === 'grid' ? (
        /* ================= GRID / STATS MODE (BENTO VIEW) ================= */
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Main Active Project card */}
          {mainFeaturedProject ? (
            <div 
              onClick={() => onOpenDetailModal(mainFeaturedProject)}
              className="md:col-span-4 md:row-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer min-h-[350px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-extrabold border border-indigo-100">
                    最優先リード案件
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {mainFeaturedProject.funnelType}
                  </span>
                </div>
                
                <h2 className="text-2xl font-black mb-1.5 text-slate-800 tracking-tight">
                  {mainFeaturedProject.clientName}
                </h2>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 max-w-xl">
                  {mainFeaturedProject.description}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-end mb-2.5">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      ステータス: <strong className="text-indigo-600 font-extrabold">{mainFeaturedProject.status}</strong>
                    </span>
                    <span className="text-2xl font-black text-indigo-600">
                      {mainFeaturedProject.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-lg transition-all duration-500"
                      style={{ width: `${mainFeaturedProject.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold mb-0.5">現在の担当フェーズ</p>
                    <p className="font-bold text-slate-800 text-xs truncate">{getCurrentPhase(mainFeaturedProject)}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold mb-0.5">目標期日 (始動日)</p>
                    <p className="font-bold text-slate-800 text-xs">
                      {mainFeaturedProject.targetDate} <span className="text-[10px] font-normal text-slate-400">({mainFeaturedProject.startDate})</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-center items-center shadow-xs text-center min-h-[300px]">
              <Briefcase className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-slate-500 text-xs font-bold">アクティブなプロジェクトがありません</p>
            </div>
          )}

          {/* Bento metric total box */}
          <div className="md:col-span-2 bg-indigo-950 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
            <div>
              <p className="text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">全アサイン済案件数</p>
              <h4 className="text-4xl font-black mt-3 text-white tracking-tight">{projects.length} 件</h4>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs text-slate-300">
                <span>進行中: <strong>{inProgressCount} 件</strong></span>
                <span>完了: <strong>{completedCount} 件</strong></span>
              </div>
              <p className="text-[10px] text-indigo-300 mt-3 font-semibold flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                独自ドメインSSL疎通セキュリティ確認済
              </p>
            </div>
          </div>

          {/* Quick Action Bento Panel */}
          <div className="md:col-span-2 bg-[#0f172a] text-white rounded-3xl p-6 flex flex-col justify-between border border-slate-850 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-teal-400 font-extrabold tracking-widest uppercase">STAGE BLUEPRINTS</span>
                <Zap className="h-4 w-4 text-teal-400" />
              </div>
              <h4 className="font-extrabold text-sm text-white">テンプレートの再利用性</h4>
              <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
                セミナー集客、個別相談、オンライン受講など、定評のある5つの高確度構成枠を1クリックで新規案件に流用できます。
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-indigo-300 font-bold flex items-center justify-between">
              <span>全 4 カテゴリ定義済</span>
              <span>詳細タブを参照</span>
            </div>
          </div>

          {/* Remaining smaller projects listings */}
          {remainingProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenDetailModal(project)}
              className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer flex flex-col justify-between h-[210px]"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-extrabold text-slate-800 text-xs truncate max-w-[150px]">
                    {project.clientName}
                  </h3>
                  <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border shrink-0 ${getStatusBadgeStyle(project.status)}`}>
                    {project.status === 'クライアント確認中' ? '確認中' : project.status}
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold truncate mb-3">{project.funnelType}</p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>進捗: <strong className="text-slate-700">{project.progress}%</strong></span>
                  <span>目標: {project.targetDate}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Placeholder for no projects retrieved */}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-slate-50 rounded-full text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <p className="text-slate-800 font-bold text-sm">該当するプロジェクトが見つかりません</p>
                <p className="text-slate-400 text-xs mt-1">絞り込み条件を緩和してください。</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= KANBAN BOARD VIEW (DRAG & DROP) ================= */
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-4 min-w-[1100px] items-stretch">
            {statusCategories.map((status) => {
              const columnProjects = filteredProjects.filter(p => p.status === status);
              const isOver = draggingOverStatus === status;

              return (
                <div
                  key={status}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status)}
                  className={`flex-1 min-w-[220px] rounded-2xl border transition-all flex flex-col ${
                    isOver 
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20' 
                      : 'bg-slate-50/60 border-slate-200/80'
                  }`}
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {status === '本番稼働中' ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <span className={`w-2 h-2 rounded-full shrink-0 bg-${getStatusBadgeColor(status)}-500`} />
                      )}
                      <h3 className="text-xs font-black text-slate-800 truncate" title={status}>
                        {status}
                      </h3>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded-full">
                      {columnProjects.length}
                    </span>
                  </div>

                  {/* Cards container */}
                  <div className="p-2.5 space-y-2.5 flex-1 min-h-[420px] overflow-y-auto max-h-[500px]">
                    {columnProjects.map((project) => (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        className="bg-white rounded-xl border border-slate-150 p-3 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-indigo-200 group relative block"
                      >
                        {/* Interactive Drag Handle Overlay hint for UX */}
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <span className="text-[8px] bg-slate-100 text-slate-400 font-black px-1.5 py-0.2 rounded uppercase">
                            {project.funnelSteps?.length || 0} STEPS
                          </span>
                          <span className="text-[9px] text-indigo-500 font-extrabold truncate max-w-[100px]">
                            {project.funnelType}
                          </span>
                        </div>

                        {/* Client Name & Target */}
                        <h4 
                          onClick={() => onOpenDetailModal(project)}
                          className="text-xs font-black text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                        >
                          {project.clientName}
                        </h4>

                        {/* Mini description snippet */}
                        <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Progress slider visually */}
                        <div className="mt-3.5 space-y-1">
                          <div className="flex items-center justify-between text-[9px] text-slate-400">
                            <span>進捗率 : <strong className="font-black text-slate-700">{project.progress}%</strong></span>
                            <span className="font-mono text-[8px] text-slate-400">{project.targetDate}</span>
                          </div>
                          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Arrow Action Buttons (Fallback for mobile and non-drag preference) */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => handleMoveStatus(project.id, project.status, 'left')}
                            disabled={statusCategories.indexOf(project.status) === 0}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent rounded transition-colors cursor-pointer"
                            title="左のステータスへ移動"
                          >
                            <ArrowLeft className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenDetailModal(project)}
                            className="text-[9px] font-bold text-slate-400 hover:text-indigo-650"
                          >
                            詳細を表示
                          </button>

                          <button
                            onClick={() => handleMoveStatus(project.id, project.status, 'right')}
                            disabled={statusCategories.indexOf(project.status) === statusCategories.length - 1}
                            className="p-1 text-slate-400 hover:text-indigo-650 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent rounded transition-colors cursor-pointer"
                            title="右のステータスへ移動"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {columnProjects.length === 0 && (
                      <div className="h-32 border border-dashed border-slate-200 rounded-xl flex items-center justify-center p-4 text-center">
                        <p className="text-[10px] text-slate-400 font-bold">
                          ここにカードを<br />ドラッグ＆ドロップ
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
        </>
      ) : (
        <AutomationLogsView 
          logs={automationLogs}
          onAddLog={(newLog) => setAutomationLogs(prev => [newLog, ...prev])}
          onClearLogs={() => setAutomationLogs([])}
          projects={projects}
        />
      )}

      {/* ================= UTAGE ADVANCED AUTOSYNC PORTAL MODAL ================= */}
      <AnimatePresence>
        {isUtageSyncOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-250 max-w-xl w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Database className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">UTAGE API CLOUD INTEGRATION</span>
                    <h3 className="text-sm font-black text-white mt-0.5">UTAGE自動同期ダッシュボード</h3>
                  </div>
                </div>
                <button
                  onClick={() => setIsUtageSyncOpen(false)}
                  className="p-1 text-xs rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  閉じる
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Parameter col */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">UTAGE アカウント ドメインサブドメイン</label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={utageSubdomain}
                          onChange={(e) => setUtageSubdomain(e.target.value)}
                          placeholder="dots-direction"
                          className="w-full text-xs font-semibold rounded-l-xl border border-slate-200 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-hidden"
                        />
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 border-y border-r border-slate-200 px-2.5 py-2.5 rounded-r-xl">.utage.biz</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">UTAGE APIセキュリティキー (Secret Token)</label>
                      <input
                        type="password"
                        value={utageApiKey}
                        onChange={(e) => setUtageApiKey(e.target.value)}
                        className="w-full text-xs font-mono rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoSync}
                          onChange={(e) => setAutoSync(e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span>Webhookリアルタイム逆連携を有効化</span>
                      </label>
                      <p className="text-[9px] text-slate-400 mt-1 pl-6 leading-relaxed">
                        UTAGE上の決済成功・LINE登録の各ステージWebhookが作動した際、本管理盤のプログレスを自動的に次のフェーズへ進めるのを許可します。
                      </p>
                    </div>
                  </div>

                  {/* Right sync progress visualizer col */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2 flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-slate-500" />
                        リアルタイム同期ステータス
                      </h4>

                      {syncStatus === 'idle' && (
                        <div className="py-8 text-center text-slate-400 space-y-2">
                          <Database className="h-6 w-6 mx-auto text-slate-300" />
                          <p className="text-xs font-semibold">同期テスト未実行</p>
                          <p className="text-[9px]">APIシームレス接続テストを開始してください。</p>
                        </div>
                      )}

                      {syncStatus === 'syncing' && (
                        <div className="py-6 space-y-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-indigo-600 flex items-center gap-1.5">
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              UTAGEデータ抽出中...
                            </span>
                            <span className="font-mono text-slate-400">{syncStep * 25}%</span>
                          </div>
                          
                          {/* Sync mini step-by-step progress tracking */}
                          <div className="space-y-1.5">
                            <div className={`p-1.5 rounded text-[10px] font-semibold flex items-center gap-1.5 ${syncStep >= 1 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-300'}`}>
                              <Check className={`h-3 w-3 shrink-0 ${syncStep >= 1 ? 'text-indigo-600' : 'text-transparent'}`} />
                              1. API認証疎通テスト
                            </div>
                            <div className={`p-1.5 rounded text-[10px] font-semibold flex items-center gap-1.5 ${syncStep >= 2 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-300'}`}>
                              <Check className={`h-3 w-3 shrink-0 ${syncStep >= 2 ? 'text-indigo-600' : 'text-transparent'}`} />
                              2. LPステップURLマッピング同期
                            </div>
                            <div className={`p-1.5 rounded text-[10px] font-semibold flex items-center gap-1.5 ${syncStep >= 3 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-300'}`}>
                              <Check className={`h-3 w-3 shrink-0 ${syncStep >= 3 ? 'text-indigo-600' : 'text-transparent'}`} />
                              3. LINEアカウントタグ紐付け取得
                            </div>
                            <div className={`p-1.5 rounded text-[10px] font-semibold flex items-center gap-1.5 ${syncStep >= 4 ? 'bg-indigo-50 text-indigo-700' : 'text-slate-300'}`}>
                              <Check className={`h-3 w-3 shrink-0 ${syncStep >= 4 ? 'text-indigo-600' : 'text-transparent'}`} />
                              4. 本番データベース再読み込み判定
                            </div>
                          </div>
                        </div>
                      )}

                      {syncStatus === 'completed' && (
                        <div className="py-6 text-center text-emerald-700 space-y-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-150">
                            <Check className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black">同期完了 (Status 200 OK)</p>
                            <p className="text-[9px] text-slate-400 mt-1">最新のUTAGEメタデータ構成を反映復元しました。</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        onClick={handleStartUtageSync}
                        disabled={syncStatus === 'syncing'}
                        className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black px-4 py-2.5 transition-all shadow-md shadow-indigo-650/10 cursor-pointer disabled:opacity-40"
                      >
                        {syncStatus === 'syncing' ? '同期実行中...' : '今すぐ手動同期を開始する'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Audit synchronization logs */}
                <div className="space-y-2">
                  <h4 className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">同期履歴・ログ監査</h4>
                  <div className="bg-slate-900 text-slate-300 font-mono text-[9px] p-3 rounded-xl max-h-[140px] overflow-y-auto space-y-1.5 border border-slate-800">
                    {syncLogs.map((log, index) => (
                      <div key={index} className="truncate select-all cursor-text leading-relaxed">
                        <span className="text-teal-400 font-bold">&gt; </span>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

