import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Edit3, 
  Save, 
  Clock, 
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  Mail,
  Layout,
  ListTodo,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  History,
  MessageSquare,
  FolderOpen,
  Send,
  RefreshCw,
  Chrome,
  ExternalLink,
  FileText,
  Search,
  Briefcase,
  Layers,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';
import { Project, ProjectStatus, FunnelStep, TeamMember, ProjectHistoryLog } from '../types';

// Helper to determine task deadline alerts and countdown values relative to fixed date 2026-06-10
export function parseDeadlineStatus(targetDateStr?: string, status?: string) {
  if (!targetDateStr || status === '完了') {
    return { isOverdue: false, isNear: false, isToday: false, daysRemaining: 999, label: '' };
  }

  // Active sync context date: 2026-06-10
  const today = new Date('2026-06-10T00:00:00');
  let dateObj: Date | null = null;
  const cleanStr = targetDateStr.trim();

  // Parse YYYY-MM-DD
  const yyyymmdd = cleanStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (yyyymmdd) {
    dateObj = new Date(parseInt(yyyymmdd[1]), parseInt(yyyymmdd[2]) - 1, parseInt(yyyymmdd[3]));
  } else {
    // Parse MM/DD or MM-DD (assume current year is 2026)
    const mmdd = cleanStr.match(/^(\d{1,2})[-/](\d{1,2})$/);
    if (mmdd) {
      dateObj = new Date(2026, parseInt(mmdd[1]) - 1, parseInt(mmdd[2]));
    } else {
      // Parse M月D日
      const jpd = cleanStr.match(/^(\d{1,2})月(\d{1,2})日?$/);
      if (jpd) {
        dateObj = new Date(2026, parseInt(jpd[1]) - 1, parseInt(jpd[2]));
      }
    }
  }

  if (!dateObj || isNaN(dateObj.getTime())) {
    return { isOverdue: false, isNear: false, isToday: false, daysRemaining: 999, label: '' };
  }

  const diffTime = dateObj.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      isOverdue: true,
      isNear: true,
      isToday: false,
      daysRemaining: diffDays,
      label: `期限超過 ${Math.abs(diffDays)}日`
    };
  } else if (diffDays === 0) {
    return {
      isOverdue: false,
      isNear: true,
      isToday: true,
      daysRemaining: 0,
      label: '本日〆切！'
    };
  } else if (diffDays <= 3) {
    return {
      isOverdue: false,
      isNear: true,
      isToday: false,
      daysRemaining: diffDays,
      label: `残り ${diffDays}日`
    };
  }

  return {
    isOverdue: false,
    isNear: false,
    isToday: false,
    daysRemaining: diffDays,
    label: `残り ${diffDays}日`
  };
}

interface ProjectDetailViewProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onUpdateProject: (updatedProj: Project) => void;
  onDeleteProject: (projectId: string) => void;
  members: TeamMember[];
  clients: any[];
}

export default function ProjectDetailView({ 
  projects, 
  selectedProjectId, 
  onSelectProject,
  onUpdateProject,
  onDeleteProject,
  members,
  clients
}: ProjectDetailViewProps) {
  // Current active project state matching the selectedProjectId
  const project = selectedProjectId ? (projects.find(p => p.id === selectedProjectId) || null) : null;

  const [status, setStatus] = useState<ProjectStatus>('原稿執筆中');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [targetDate, setTargetDate] = useState('');
  const [revenue, setRevenue] = useState('');
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  // Bulk step selection states
  const [selectedStepIds, setSelectedStepIds] = useState<string[]>([]);

  // Tabs for interactive right-hand details workspace
  const [rightPanelTab, setRightPanelTab] = useState<'steps' | 'history' | 'google' | 'ai'>('steps');
  const [selectedStepForAi, setSelectedStepForAi] = useState<string>('');
  const [aiGeneratedData, setAiGeneratedData] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form states for new timeline events
  const [newLogCategory, setNewLogCategory] = useState<'client_request' | 'meeting_note' | 'update_log'>('client_request');
  const [newLogContent, setNewLogContent] = useState('');
  const [newLogAuthor, setNewLogAuthor] = useState('佐藤 広務');

  // Google ecosystem simulator states
  const [googleSyncing, setGoogleSyncing] = useState(false);
  const [googleCalendarSynced, setGoogleCalendarSynced] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [googleMessages, setGoogleMessages] = useState<any[]>([]);

  // Project list states (when no project is selected)
  const [listSearchTerm, setListSearchTerm] = useState('');
  const [listFunnelFilter, setListFunnelFilter] = useState('all');
  const [listStatusFilter, setListStatusFilter] = useState('all');

  // Custom alerting states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  // Automatically fade out notification toasts after 5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // If a project is loaded, sync state values
  useEffect(() => {
    if (project) {
      setStatus(project.status);
      setDescription(project.description);
      setNotes(project.notes || '');
      setSteps(project.funnelSteps || []);
      setTargetDate(project.targetDate);
      setRevenue(project.revenue || '未設定');
      setIsEditingMeta(false);
      setSelectedStepIds([]);
      
      if (project.funnelSteps && project.funnelSteps.length > 0) {
        setSelectedStepForAi(project.funnelSteps[0].name);
      } else {
        setSelectedStepForAi('');
      }
      setAiGeneratedData(null);
      setErrorMessage('');

      // Populate interactive google communications aggregated for this client
      setGoogleMessages([
        {
          id: `g-view-${project.id}-1`,
          source: 'Google Chat (Space)',
          sender: `代表 ${project.clientName.replace('様', '')}様`,
          timestamp: '今日 11:24',
          content: `お疲れ様です！今回の${project.funnelType}用の画像・構成原稿をGoogleドライブに追加共有しました。ご確認いただけますか？`,
          isCustomer: true
        },
        {
          id: `g-view-${project.id}-2`,
          source: 'Google Chat (Space)',
          sender: '田中 美咲 (UTAGE Hub)',
          timestamp: '今日 11:45',
          content: 'ご共有ありがとうございます！ファイル一式確認できました。構成案を現在のステップ（制作中）にマッピング反映いたします。',
          isCustomer: false
        },
        {
          id: `g-view-${project.id}-3`,
          source: 'Gmail',
          sender: `${project.clientName.replace('様', '')} 担当窓口`,
          timestamp: '昨日 17:40',
          content: `UTAGE管理画面から設定するLINEオプトイン用アカウントのタグ情報ですが、Googleスプレッドシートの「タグ紐付けシート」へ直接書き込んでおきました！`,
          isCustomer: true
        }
      ]);
      setGoogleCalendarSynced(false);
      setReplyText('');
    }
  }, [project, selectedProjectId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateAiCopy = async () => {
    if (!selectedStepForAi || !project) return;
    setLoadingAi(true);
    setErrorMessage('');
    setAiGeneratedData(null);

    const associatedClient = clients.find(c => c.id === project.clientId);
    const clientIndustry = associatedClient ? associatedClient.industry : 'Webサービス・マーケティング';

    try {
      const response = await fetch('/api/generate-funnel-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: project.clientName,
          clientIndustry: clientIndustry,
          funnelType: project.funnelType,
          stepName: selectedStepForAi,
          projectDescription: project.description
        })
      });

      if (!response.ok) {
        throw new Error(`APIエラー: ステータス ${response.status}`);
      }

      const resData = await response.json();
      setAiGeneratedData(resData);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'AI原稿生成中に原因不明のエラーが発生しました。');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleInjectToNotes = () => {
    if (!aiGeneratedData || !project) return;
    const injection = `
=========================================
【AI生成原稿】ステップ: ${selectedStepForAi}
-----------------------------------------
■ キャッチコピー：
${aiGeneratedData.headlineCopy}

■ サブコピー：
${aiGeneratedData.subHeadline}

■ ボタン文言：
${aiGeneratedData.ctaText}

■ メール件名：
${aiGeneratedData.emailSubject}

■ メール本文：
${aiGeneratedData.emailBody}
=========================================
`;
    const newNotes = notes ? `${notes}\n${injection}` : injection;
    setNotes(newNotes);
    const updatedProj: Project = { ...project, notes: newNotes };
    onUpdateProject(updatedProj);
    alert("生成された原稿を、プロジェクトのディレクター申し送りメモ（左側）に自動注入保存しました！");
  };

  const handleStepStatusChange = (stepId: string, newStepStatus: FunnelStep['status']) => {
    if (!project) return;
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, status: newStepStatus } : step
    );
    setSteps(updatedSteps);
    
    // Automatically recalculate progress %
    const totalSteps = updatedSteps.length;
    if (totalSteps > 0) {
      const completionSum = updatedSteps.reduce((acc, step) => {
        if (step.status === '完了') return acc + 100;
        if (step.status === '確認中') return acc + 75;
        if (step.status === '制作中') return acc + 25;
        return acc;
      }, 0);
      const calculatedProgress = Math.round(completionSum / totalSteps);
      
      const updatedProj: Project = {
        ...project,
        status: status, // current selected parent status
        funnelSteps: updatedSteps,
        progress: Math.min(100, Math.max(0, calculatedProgress))
      };
      onUpdateProject(updatedProj);
    }
  };

  const handleToggleStepSelection = (stepId: string) => {
    setSelectedStepIds(prev => 
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const handleToggleAllSteps = () => {
    if (selectedStepIds.length === steps.length) {
      setSelectedStepIds([]);
    } else {
      setSelectedStepIds(steps.map(s => s.id));
    }
  };

  const handleBulkStatusChange = (newStepStatus: FunnelStep['status']) => {
    if (!project || selectedStepIds.length === 0) return;
    const updatedSteps = steps.map(step => 
      selectedStepIds.includes(step.id) ? { ...step, status: newStepStatus } : step
    );
    setSteps(updatedSteps);

    const totalSteps = updatedSteps.length;
    if (totalSteps > 0) {
      const completionSum = updatedSteps.reduce((acc, step) => {
        if (step.status === '完了') return acc + 100;
        if (step.status === '確認中') return acc + 75;
        if (step.status === '制作中') return acc + 25;
        return acc;
      }, 0);
      const calculatedProgress = Math.round(completionSum / totalSteps);
      
      const updatedProj: Project = {
        ...project,
        status: status,
        funnelSteps: updatedSteps,
        progress: Math.min(100, Math.max(0, calculatedProgress))
      };
      onUpdateProject(updatedProj);
    }
    setToastMessage(`📢 選択した ${selectedStepIds.length} 個のタスクステータスを「${newStepStatus}」に一括変更しました。`);
  };

  const handleBulkAssigneeChange = (assigneeName: string) => {
    if (!project || selectedStepIds.length === 0) return;
    const updatedSteps = steps.map(step => 
      selectedStepIds.includes(step.id) ? { ...step, assignee: assigneeName } : step
    );
    setSteps(updatedSteps);

    const updatedProj: Project = {
      ...project,
      funnelSteps: updatedSteps
    };
    onUpdateProject(updatedProj);
    setToastMessage(`📢 選択した ${selectedStepIds.length} 個のタスク担当者を「${assigneeName || '未割り当て'}」に一括設定しました。`);
  };

  const handleAddNewHistoryLog = () => {
    if (!newLogContent.trim() || !project) return;
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const nextLog: ProjectHistoryLog = {
      id: `history-${Date.now()}`,
      timestamp: timeStr,
      category: newLogCategory,
      author: newLogAuthor,
      content: newLogContent
    };

    const updatedLogs = [nextLog, ...(project.historyLogs || [])];
    const updatedProj: Project = {
      ...project,
      historyLogs: updatedLogs
    };

    onUpdateProject(updatedProj);
    setNewLogContent('');
  };

  const handleSendGoogleReply = () => {
    if (!replyText.trim() || !project) return;
    const now = new Date();
    const timeStr = `今日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg = {
      id: `g-view-reply-${Date.now()}`,
      source: 'Google Chat (Space)',
      sender: 'あなた (UTAGE Hub統合)',
      timestamp: timeStr,
      content: replyText,
      isCustomer: false
    };

    setGoogleMessages(prev => [...prev, newMsg]);

    const logTimeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const updatedLogs = [
      {
        id: `history-${Date.now()}`,
        timestamp: logTimeStr,
        category: 'client_request' as const,
        author: 'あなた（Google Chat連携）',
        content: `【Google Chat自動同期返信】\n${replyText}`
      },
      ...(project.historyLogs || [])
    ];

    const updatedProj: Project = {
      ...project,
      historyLogs: updatedLogs
    };
    onUpdateProject(updatedProj);
    setReplyText('');
    
    alert(`Google Workspace同期成功: 返信内容が正常にGoogle ChatSpaceおよび宛先宛てGmailへ自動配信＆このツールの履歴一覧に同期保存されました！`);
  };

  const handleSyncGoogleCalendar = () => {
    if (!project) return;
    setGoogleSyncing(true);
    setTimeout(() => {
      setGoogleSyncing(false);
      setGoogleCalendarSynced(true);
      
      const now = new Date();
      const logTimeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const updatedLogs = [
        {
          id: `history-${Date.now()}`,
          timestamp: logTimeStr,
          category: 'update_log' as const,
          author: 'システム（Google同期）',
          content: `【Googleカレンダー同期】\nプロジェクトの目標期日「${project.targetDate}」および各タスク期日をGoogleカレンダー「${project.clientName}共同スケジュール」へ自動登録・同期しました。`
        },
        ...(project.historyLogs || [])
      ];

      onUpdateProject({
        ...project,
        historyLogs: updatedLogs
      });
      alert(`Googleカレンダーとの同期が完了しました！\n顧客側のGoogle Calendarにも、UTAGE構築上の目標期日( ${project.targetDate} )がアラート付きで自動挿入されました。`);
    }, 1200);
  };

  const handleSaveMeta = () => {
    if (!project) return;
    const logEntries: string[] = [];
    if (status !== project.status) {
      logEntries.push(`・ステータスを「${project.status}」から「${status}」へ書き換え`);
    }
    if (targetDate !== project.targetDate) {
      logEntries.push(`・目標期日を「${project.targetDate}」から「${targetDate}」へ調整`);
    }
    if (revenue !== project.revenue) {
      logEntries.push(`・受注規模を「${project.revenue || '未設定'}」から「${revenue}」に変更`);
    }
    if (description !== project.description) {
      logEntries.push(`・プロジェクト概要およびターゲット・スコープ情報を更新`);
    }
    if (notes !== (project.notes || '')) {
      logEntries.push(`・開発ディレクター申し送りメモを最新化`);
    }

    let updatedLogs = [...(project.historyLogs || [])];

    if (logEntries.length > 0) {
      const now = new Date();
      const logTimeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newHistoryLog: ProjectHistoryLog = {
        id: `history-${Date.now()}`,
        timestamp: logTimeStr,
        category: 'update_log',
        author: '佐藤 広務',
        content: `【スコープ・情報変更】\n` + logEntries.join('\n')
      };
      updatedLogs = [newHistoryLog, ...updatedLogs];
    }

    const updatedProj: Project = {
      ...project,
      status,
      description,
      notes,
      targetDate,
      revenue,
      funnelSteps: steps,
      historyLogs: updatedLogs
    };
    onUpdateProject(updatedProj);
    setIsEditingMeta(false);
  };

  const handleDelete = () => {
    if (!project) return;
    if (window.confirm(`「${project.clientName}」のプロジェクトを本当に削除してよろしいですか？`)) {
      onDeleteProject(project.id);
      onSelectProject(null);
    }
  };

  const getStepStatusClasses = (stepStatus: FunnelStep['status']) => {
    switch (stepStatus) {
      case '完了':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case '確認中':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case '制作中':
        return 'bg-indigo-50 text-indigo-705 border-indigo-150';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  if (!project) {
    const filtered = projects.filter(p => {
      const matchesSearch = p.clientName.toLowerCase().includes(listSearchTerm.toLowerCase()) ||
                            (p.description || '').toLowerCase().includes(listSearchTerm.toLowerCase());
      const matchesFunnel = listFunnelFilter === 'all' || p.funnelType === listFunnelFilter;
      const matchesStatus = listStatusFilter === 'all' || p.status === listStatusFilter;
      return matchesSearch && matchesFunnel && matchesStatus;
    });

    const funnelTypes = Array.from(new Set(projects.map(p => p.funnelType)));
    const statusTypes = Array.from(new Set(projects.map(p => p.status)));

    return (
      <div className="space-y-6">
        {/* UTAGE MCP Informative Header */}
        <div className="bg-gradient-to-r from-slate-905 from-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-indigo-950/40 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black border border-indigo-500/30">
                <Layers className="h-3.5 w-3.5 text-indigo-300" />
                <span>UTAGE Hub 総合進捗ダッシュボード</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight m-0">全件案件 総合構築進捗一覧</h2>
              <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed font-semibold mt-1">
                構築要件・フェーズ・マイルストーン別進捗状況を、一元横断して確認・管理可能です。各案件の「詳細ワークスペース」を開いて、タスクアサインや追加要望ログ、AI構成原稿の自動生成などを実行できます。
              </p>
            </div>
          </div>

          {/* Stats quick card grid within summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 font-semibold">
              <p className="text-slate-300 font-bold text-[10px] tracking-wider uppercase mb-1">追跡案件総数</p>
              <p className="text-xl font-black font-mono">{projects.length} 件</p>
            </div>
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 font-semibold">
              <p className="text-emerald-300 font-bold text-[10px] tracking-wider uppercase mb-1">本番稼働中</p>
              <p className="text-xl font-black font-mono text-emerald-300">
                {projects.filter(p => p.status === '本番稼働中').length} 件
              </p>
            </div>
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 font-semibold">
              <p className="text-indigo-300 font-bold text-[10px] tracking-wider uppercase mb-1">実装・テスト中</p>
              <p className="text-xl font-black font-mono text-indigo-300">
                {projects.filter(p => p.status === 'UTAGE実装中' || p.status === 'テスト運用中').length} 件
              </p>
            </div>
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 font-semibold">
              <p className="text-amber-300 font-bold text-[10px] tracking-wider uppercase mb-1">平均構築進行度</p>
              <p className="text-xl font-black font-mono text-amber-305">
                {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + (p.progress || 0), 0) / projects.length) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Filter controls row */}
        <div className="bg-white p-5 rounded-3xl border border-slate-205 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="クライアント名、概要を検索..."
                value={listSearchTerm}
                onChange={(e) => setListSearchTerm(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
            </div>

            <div className="w-full sm:w-48">
              <select
                value={listFunnelFilter}
                onChange={(e) => setListFunnelFilter(e.target.value)}
                className="w-full text-xs font-bold rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50/50 text-slate-705 focus:bg-white focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">すべてのファネル形式</option>
                {funnelTypes.map(ft => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-48">
              <select
                value={listStatusFilter}
                onChange={(e) => setListStatusFilter(e.target.value)}
                className="w-full text-xs font-bold rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50/50 text-slate-705 focus:bg-white focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">すべてのフェーズ</option>
                {statusTypes.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* High Density Table & Progression block */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03),0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-4 px-6">顧客名（クライアント様）</th>
                  <th className="py-4 px-3">ファネル形式</th>
                  <th className="py-4 px-3">総合構築進捗率</th>
                  <th className="py-4 px-3">タスク完了状況</th>
                  <th className="py-4 px-3">現在の開発フェーズ</th>
                  <th className="py-4 px-3">目標期日</th>
                  <th className="py-4 px-6 text-right font-black">詳細作業</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 text-xs">
                {filtered.map((proj) => {
                  const completedSteps = proj.funnelSteps?.filter(s => s.status === '完了').length || 0;
                  const totalSteps = proj.funnelSteps?.length || 0;
                  
                  return (
                    <tr 
                      key={proj.id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p 
                            onClick={() => onSelectProject(proj.id)} 
                            className="font-black text-slate-900 text-sm hover:text-indigo-650 transition-colors cursor-pointer"
                          >
                            {proj.clientName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{proj.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 text-[10px] font-black">
                          {proj.funnelType}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="space-y-1.5 max-w-[160px]">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-mono font-black text-slate-805">{proj.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                proj.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                              }`} 
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-slate-500 text-[11px] font-bold">
                        {completedSteps} / {totalSteps} ステップ
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black ${
                          proj.status === '本番稼働中' ? 'bg-emerald-55 bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          proj.status === 'テスト運用中' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                          proj.status === 'UTAGE実装中' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          proj.status === 'クライアント確認中' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-slate-100 text-slate-650 border border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            proj.status === '本番稼働中' ? 'bg-emerald-500' :
                            proj.status === 'テスト運用中' ? 'bg-teal-500' :
                            proj.status === 'UTAGE実装中' ? 'bg-indigo-500' :
                            proj.status === 'クライアント確認中' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-mono text-slate-500 text-[11px]">
                        {proj.targetDate}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectProject(proj.id)}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-xs font-black transition-all cursor-pointer border border-indigo-200 hover:border-indigo-600 shadow-3xs"
                        >
                          詳細ワークスペース ➔
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center bg-white border-t border-slate-150 flex flex-col items-center justify-center space-y-3">
              <AlertCircle className="h-6 w-6 text-slate-350" />
              <div>
                <p className="text-slate-800 font-extrabold text-sm">該当するプロジェクトが見つかりません</p>
                <p className="text-slate-400 text-xs mt-0.5">フィルターの絞り込み条件を緩和してください。</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800">
      {/* Search selection project switcher for fluid navigation */}
      <div className="bg-white px-5 py-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 flex-wrap">
          <button
            type="button"
            onClick={() => onSelectProject(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl border border-slate-200 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>← 総合進捗一覧に戻る</span>
          </button>
          
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-indigo-550 text-indigo-500 shrink-0" />
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">詳細切替:</span>
            <select
              value={project.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="text-xs font-extrabold text-indigo-800 bg-slate-50 border border-indigo-150 rounded-xl px-3 py-1.5 focus:bg-white focus:outline-hidden cursor-pointer"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.clientName} ({p.funnelType})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-550 font-bold">
          対象クライアント: <strong className="text-indigo-600 font-black">{project.clientName}</strong> 様のワークスペースを検証中
        </div>
      </div>

      {/* Real-time Notification Toast overlay */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0f172a] text-white rounded-2xl shadow-xl border border-slate-700 p-4 max-w-sm flex items-center justify-between gap-3 animate-slide-up duration-350">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 shrink-0">
              <Bell className="h-4.5 w-4.5" />
            </span>
            <div className="text-xs">
              <p className="font-black text-white">リアルタイム進捗通知</p>
              <p className="text-slate-300 font-semibold leading-relaxed mt-0.5">{toastMessage}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)} 
            className="text-slate-400 hover:text-white font-black text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Urgent task deadline alerts */}
      {(() => {
        const urgentSteps = steps.filter(step => {
          if (step.status === '完了') return false;
          const stat = parseDeadlineStatus(step.targetDate, step.status);
          return stat.isNear && !acknowledgedAlerts.includes(step.id);
        });

        if (urgentSteps.length > 0) {
          return (
            <div className="bg-rose-50/70 border border-rose-200/90 rounded-3xl p-5 space-y-4 shadow-3xs animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-8.5 h-8.5 rounded-2xl bg-rose-100 text-rose-600">
                    <AlertTriangle className="h-5 w-5 animate-pulse" />
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-rose-950 tracking-tight">🚨 マイルストーン期限警告 : 超過・期限間近タスクを検出</h4>
                    <p className="text-[10px] text-rose-700/80 font-bold mt-0.5">※ 本日の進行基準日（2026年6月10日）を基に対象要件をリアルタイム分析しています。</p>
                  </div>
                </div>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded-lg border border-rose-200 shrink-0 self-start sm:self-center">
                  要対応アラート {urgentSteps.length} 件
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {urgentSteps.map(step => {
                  const dStat = parseDeadlineStatus(step.targetDate, step.status);
                  return (
                    <div key={step.id} className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-3xs">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                            dStat.isOverdue ? 'bg-rose-100 text-rose-805 border border-rose-205' : 'bg-amber-100 text-amber-900 border border-amber-205'
                          }`}>
                            {dStat.label}
                          </span>
                          <strong className="text-slate-900 text-xs font-black">{step.name}</strong>
                        </div>
                        <p className="text-[10px] text-slate-450 font-semibold">
                          担当クルー: <strong className="text-slate-700">{step.assignee || '未担当'}</strong> • 期日設定: <strong className="font-mono text-slate-700">{step.targetDate || '設定なし'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 border-t sm:border-0 pt-2 sm:pt-0 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setToastMessage(`📢 [${step.assignee || '未割り当て'}] 宛に、マイルストーン「${step.name}」の推進督促（Slack/LINE）を配信しました。`);
                            
                            // Log event into project history securely
                            const newLog: ProjectHistoryLog = {
                              id: `remind-log-${Date.now()}`,
                              timestamp: '今日 11:35',
                              category: 'update_log',
                              author: '自動アラートシステム',
                              content: `🔔 【スピード対応要請】タスク「${step.name}」担当の ${step.assignee || '未設定'} メンバーに対し、アラート通知＆Slack/LINE WORKSリマインドの自動一斉送信を実行しました。`
                            };
                            const updatedLogs = project.historyLogs ? [newLog, ...project.historyLogs] : [newLog];
                            const updatedProj = { ...project, historyLogs: updatedLogs };
                            onUpdateProject(updatedProj);
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-xl transition-all cursor-pointer shadow-3xs hover:shadow-2xs"
                        >
                          即時リマインド送信
                        </button>
                        <button
                          type="button"
                          onClick={() => setAcknowledgedAlerts(prev => [...prev, step.id])}
                          className="px-2 py-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                          title="このアラートを一時的に閉じる"
                        >
                          非表示
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        } else {
          return (
            <div className="bg-emerald-50/50 border border-emerald-100/90 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-bold animate-fade-in shadow-3xs">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </span>
                <p className="text-emerald-950 font-black">
                  期限超過、または3日以内に期日を迎える構築マイルストーンはありません。マイルストーン進行は順調です。
                </p>
              </div>
              <span className="text-[10px] text-emerald-600 font-extrabold tracking-wider uppercase font-mono self-start sm:self-center shrink-0">
                STATUS: OPTIMAL
              </span>
            </div>
          );
        }
      })()}

      {/* Main workspace cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: General project meta card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] bg-slate-100 text-slate-500 font-black tracking-widest px-2.5 py-0.5 rounded border border-slate-200">
                {project.funnelType}
              </span>
              <h3 className="text-xl font-black text-slate-800 tracking-tight mt-2">{project.clientName}</h3>
            </div>

            {/* Quick progress visualizer */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-505" />
                  総合フェーズ進捗
                </span>
                <span className="text-sm font-black text-indigo-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Editing and metadata values */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">プロジェクト基本定義</h4>
                <button
                  type="button"
                  onClick={() => setIsEditingMeta(!isEditingMeta)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {isEditingMeta ? (
                    <>
                      <span>閉じる</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-3 w-3" />
                      <span>定義を変更する</span>
                    </>
                  )}
                </button>
              </div>

              {isEditingMeta ? (
                <div className="space-y-4 pt-1 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60">
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">全体進捗ステータス</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                      className="w-full text-xs font-bold rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-550"
                    >
                      <option value="原稿執筆中">原稿執筆中</option>
                      <option value="クライアント確認中">クライアント確認中</option>
                      <option value="UTAGE実装中">UTAGE実装中</option>
                      <option value="テスト運用中">テスト運用中</option>
                      <option value="本番稼働中">本番稼働中</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-wider mb-1">目標期日</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full text-xs font-bold rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">受注規模・ご予算 (円)</label>
                    <input
                      type="text"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      placeholder="例: 450,000円"
                      className="w-full text-xs font-bold rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">背景・ターゲット</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-450 uppercase tracking-wider mb-1">開発申し送り事項 (メモ欄)</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs font-medium rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveMeta}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>定義保存する</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/50 space-y-1.5">
                    <p className="font-extrabold text-[9px] text-slate-450 uppercase tracking-wider">構築の方向・目的</p>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap select-text">{project.description || '概要登録はありません。'}</p>
                  </div>

                  {project.notes && (
                    <div className="text-xs bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl space-y-1.5">
                      <p className="font-extrabold text-[9px] text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 flex-shrink-0" />
                        ディレクター 申し送りメモ
                      </p>
                      <p className="text-slate-650 leading-relaxed whitespace-pre-wrap select-text">{project.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="bg-slate-50 border border-slate-200/40 p-2.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[8px] text-slate-450 tracking-wider">開始日 / 目標期日</span>
                      <strong className="text-slate-800 text-[11px] mt-1 pr-1 truncate">
                        {project.targetDate}
                      </strong>
                      <span className="text-[8px] text-slate-400 mt-0.5">({project.startDate}開始)</span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/40 p-2.5 rounded-lg flex flex-col justify-between">
                      <span className="text-[8px] text-slate-450 tracking-wider">�            {/* Render selected widescreen tab content details */}
                      想定受注規模 / 予算
                    </span>
                    <strong className="text-slate-800 text-[11px] mt-1 pr-1 truncate">
                      {project.revenue || '未設定'}
                    </strong>
                    <span className="text-[8px] text-slate-400 mt-0.5">※目安予算額</span>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Details workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 relative">
            
            {/* Tabs selection menu */}
            <div className="flex border-b border-slate-200 mb-6 overflow-x-auto whitespace-nowrap gap-1">
              {[
                { id: 'steps', label: 'マイルストーン進行', count: steps.length },
                { id: 'history', label: '変更・決定要望履歴', count: project.historyLogs?.length || 0 },
                { id: 'google', label: 'Google Docs連携要件書' },
                { id: 'ai', label: 'AI LP構成・コピーライター' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRightPanelTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all cursor-pointer ${
                    rightPanelTab === tab.id
                      ? 'border-indigo-600 text-indigo-650 bg-indigo-50/10'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.label} {tab.count !== undefined && `(${tab.count})`}
                </button>
              ))}
            </div>

            {/* Render selected widescreen tab content details */}
            {rightPanelTab === 'steps' && (
              <div className="space-y-4">
                {/* Bulk operation action shelf (glowing, premium top container) */}
                {selectedStepIds.length > 0 ? (
                  <div className="sticky top-0 z-10 p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 animate-fade-in shadow-md">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      </div>
                      <span className="text-xs font-black text-indigo-100">
                        選択中：<span className="text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold border border-indigo-900">{selectedStepIds.length} 個</span> のタスクを一括編集
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 flex-wrap">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">ステータス:</span>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleBulkStatusChange(e.target.value as any);
                            }
                          }}
                          className="text-[11px] font-black bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 cursor-pointer focus:ring-1 focus:ring-indigo-500 font-mono"
                        >
                          <option value="" className="text-slate-400">選択してください</option>
                          <option value="未着手" className="text-slate-800 bg-white">未着手</option>
                          <option value="制作中" className="text-slate-800 bg-white">制作中</option>
                          <option value="確認中" className="text-slate-800 bg-white font-bold">確認中 (クライアントレビュー)</option>
                          <option value="完了" className="text-slate-800 bg-white font-extrabold">完了 (作業フィニッシュ)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">担当メンバー:</span>
                        <select
                          value=""
                          onChange={(e) => {
                            handleBulkAssigneeChange(e.target.value);
                          }}
                          className="text-[11px] font-black bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="" className="text-slate-400">選択してください</option>
                          <option value="" className="text-slate-850 bg-white">未設定 (アサイン解除)</option>
                          {members.map(m => (
                            <option key={m.id} value={m.name} className="text-slate-800 bg-white">{m.name} ({m.role})</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedStepIds([])}
                          className="text-[10px] text-slate-300 hover:text-white bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg transition-colors font-black cursor-pointer shadow-3xs"
                        >
                          選択クリア
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>タスクを選択すると、ここに一括更新バーが表示されます</span>
                    </div>
                    <span className="text-[10px] text-slate-450 font-bold font-mono">BULK EDIT READY</span>
                  </div>
                )}

                {/* Subheader and Select All bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2.5">
                  <div className="flex items-center gap-2.5">
                    {/* Header level Select All switch */}
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl p-1 px-2.5">
                      <input
                        type="checkbox"
                        id="selectAllTasksHeader"
                        checked={steps.length > 0 && selectedStepIds.length === steps.length}
                        onChange={handleToggleAllSteps}
                        className="w-4 h-4 rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 cursor-pointer shrink-0"
                      />
                      <label htmlFor="selectAllTasksHeader" className="text-[10px] font-black text-slate-650 cursor-pointer select-none">
                        すべて選択
                      </label>
                    </div>
                    <span className="text-xs text-slate-450 font-semibold">|</span>
                    <span className="text-xs text-slate-550 font-black uppercase tracking-wider font-sans">
                      マイルストーン別進捗管理 & クルー割当
                    </span>
                  </div>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-black self-start sm:self-auto border border-indigo-150/40">
                    {steps.filter(s => s.status === '完了').length} / {steps.length} 完了
                  </span>
                </div>

                {/* List container for row by row display */}
                <div className="space-y-2.5">
                  {steps.map((step) => {
                    const dStat = parseDeadlineStatus(step.targetDate, step.status);
                    const isSelected = selectedStepIds.includes(step.id);
                    
                    // Styled border depending on status/delay/selection state
                    const containerStyle = isSelected 
                      ? 'border-indigo-400 bg-indigo-50/15 ring-1 ring-indigo-500/10 shadow-xs'
                      : dStat.isOverdue 
                        ? 'border-rose-250 bg-rose-50/10 hover:border-rose-350 hover:bg-rose-50/20' 
                        : dStat.isNear 
                          ? 'border-amber-250 bg-amber-50/10 hover:border-amber-350 hover:bg-amber-50/20' 
                          : 'border-slate-150 bg-white hover:border-slate-300 hover:bg-slate-50/30';
                    
                    return (
                      <div 
                        key={step.id} 
                        className={`transition-all duration-150 rounded-xl border p-3 flex flex-col md:flex-row md:items-center justify-between gap-3.5 ${containerStyle}`}
                      >
                        {/* Left block: Checkbox + Task Name + Badges */}
                        <div className="flex items-start gap-3 min-w-0 md:flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleStepSelection(step.id)}
                            className="w-4.5 h-4.5 rounded-md text-indigo-650 border-slate-300 focus:ring-indigo-500 cursor-pointer shrink-0 mt-0.5"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-extrabold text-slate-800 leading-snug break-words">
                                {step.name}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border shrink-0 ${getStepStatusClasses(step.status)}`}>
                                {step.status}
                              </span>
                            </div>
                            {dStat.isNear && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8.5px] font-black ${
                                dStat.isOverdue ? 'bg-rose-50 text-rose-700 border border-rose-150' : 'bg-amber-50 text-amber-800 border border-amber-150'
                              }`}>
                                {dStat.isOverdue ? (
                                  <AlertTriangle className="h-3 w-3 text-rose-500 shrink-0" />
                                ) : (
                                  <Clock className="h-3 w-3 text-amber-500 animate-pulse shrink-0" />
                                )}
                                <span>{dStat.label}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right block: Assignee + Date Input + Status switch controls */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 text-xs w-full md:w-auto md:justify-end shrink-0">
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            {/* Assignee select */}
                            <div className="flex-1 sm:w-[120px] sm:flex-initial shrink-0">
                              <select
                                value={step.assignee || ''}
                                onChange={(e) => {
                                  const updatedSteps = steps.map(s => 
                                    s.id === step.id ? { ...s, assignee: e.target.value } : s
                                  );
                                  setSteps(updatedSteps);
                                  const updatedProj: Project = { ...project, funnelSteps: updatedSteps };
                                  onUpdateProject(updatedProj);
                                }}
                                className="w-full text-[11px] font-bold text-slate-705 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 sm:py-1 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                              >
                                <option value="">👤 未設定</option>
                                {members.map(m => (
                                  <option key={m.id} value={m.name}>{m.name} ({m.role.substring(0, 8)})</option>
                                ))}
                                {step.assignee && !members.some(m => m.name === step.assignee) && (
                                  <option value={step.assignee}>{step.assignee}</option>
                                )}
                              </select>
                            </div>

                            {/* Date input */}
                            <div className="w-[85px] shrink-0 font-sans">
                              <input
                                type="text"
                                value={step.targetDate || ''}
                                onChange={(e) => {
                                  const updatedSteps = steps.map(s => 
                                    s.id === step.id ? { ...s, targetDate: e.target.value } : s
                                  );
                                  setSteps(updatedSteps);
                                  const updatedProj: Project = { ...project, funnelSteps: updatedSteps };
                                  onUpdateProject(updatedProj);
                                }}
                                placeholder="例: 6月20日"
                                className="w-full text-[11px] font-bold text-slate-705 bg-white border border-slate-200 rounded-lg px-2 py-1.5 sm:py-1 text-center focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          </div>

                          {/* Status toggle tag list */}
                          <div className="flex items-center gap-0.5 select-none border-t border-slate-100 pt-2.5 sm:border-t-0 sm:pt-0 sm:border-l sm:border-slate-150 sm:pl-3 w-full sm:w-auto justify-between sm:justify-start shrink-0">
                            {(['未着手', '制作中', '確認中', '完了'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStepStatusChange(step.id, st)}
                                className={`flex-1 sm:flex-initial text-center px-2 py-1 sm:px-1.5 sm:py-0.5 rounded text-[9.5px] sm:text-[8px] font-black border transition-all cursor-pointer ${
                                  step.status === st 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
                                    : 'bg-white text-slate-550 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {rightPanelTab === 'history' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-black uppercase tracking-wider flex items-center gap-1.5">
                    <History className="h-4.5 w-4.5 text-amber-500" />
                    クライアント要望 & 打ち合わせ決定事項タイムライン
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Append timeline event form */}
                  <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <p className="text-xs font-bold text-slate-700">＋ 決定事項・新規要望の手動追記</p>
                    
                    <div className="space-y-2 text-[10px]">
                      <div>
                        <label className="block text-slate-400 font-bold mb-0.5">事象区分</label>
                        <select
                          value={newLogCategory}
                          onChange={(e) => setNewLogCategory(e.target.value as any)}
                          className="w-full text-xs font-bold bg-white border border-slate-200 rounded-md px-1.5 py-1"
                        >
                          <option value="client_request">📥 顧客からの追加要望</option>
                          <option value="meeting_note">📅 打ち合わせの決定事項</option>
                          <option value="update_log">🛠️ スコープ・契約要件更新</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-0.5">記録した記述者</label>
                        <input
                          type="text"
                          value={newLogAuthor}
                          onChange={(e) => setNewLogAuthor(e.target.value)}
                          className="w-full text-xs font-bold bg-white border border-slate-200 rounded-md px-1.5 py-1"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 font-bold mb-0.5">対談・議事コピー</label>
                        <textarea
                          rows={4}
                          value={newLogContent}
                          onChange={(e) => setNewLogContent(e.target.value)}
                          placeholder="例: UTAGEに移行する際の決済方法。保護者向けの為、Stripe以外の銀行振込用のメッセージも自動ステップへ書き込むよう追加要請あり。"
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-md p-2 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddNewHistoryLog}
                      disabled={!newLogContent.trim()}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs"
                    >
                      履歴に追記保存する
                    </button>
                  </div>

                  {/* Scrollable list */}
                  <div className="md:col-span-7 space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {project.historyLogs && project.historyLogs.length > 0 ? (
                      project.historyLogs.map((log) => {
                        let badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
                        let categoryText = "要望事項";
                        if (log.category === 'meeting_note') {
                          badgeBg = "bg-blue-50 text-blue-700 border-blue-200";
                          categoryText = "会議議事";
                        } else if (log.category === 'update_log') {
                          badgeBg = "bg-slate-100 text-slate-700 border-slate-300";
                          categoryText = "要件更新";
                        }

                        return (
                          <div key={log.id} className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2">
                            <div className="flex items-center justify-between text-[10px]">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold border ${badgeBg}`}>
                                  {categoryText}
                                </span>
                                <strong className="text-slate-500 font-bold">
                                  記録者: {log.author}
                                </strong>
                              </div>
                              <span className="text-slate-400 font-mono font-bold">
                                {log.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 font-medium whitespace-pre-wrap leading-relaxed select-text">
                              {log.content}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-20 text-center text-slate-400 space-y-2">
                        <History className="h-8 w-8 mx-auto text-slate-300" />
                        <p className="text-xs font-bold">要望・変更ログはまだありません</p>
                        <p className="text-xs">左の入力欄より打ち合わせの決定事項や変更要求を直接追加してください。</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {rightPanelTab === 'google' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs text-slate-500 font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Chrome className="h-4.5 w-4.5 text-blue-500" />
                    Google Workspace 自動連携モニタリング・対談ログ
                  </span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 border border-emerald-200">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    Google API 正常通信中
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Google Chat & Client feed */}
                  <div className="md:col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <MessageSquare className="h-4 w-4 text-blue-505" />
                          リアルタイム一元メッセージ (Google Chat / Gmail)
                        </h5>
                        <div className="text-[10px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.2 rounded font-mono">Synced</div>
                      </div>

                      {/* Msg stack scroll */}
                      <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 pt-2 select-text">
                        {googleMessages.map((msg) => (
                          <div key={msg.id} className={`flex flex-col space-y-0.75 text-xs ${msg.isCustomer ? 'items-start' : 'items-end'}`}>
                            <span className="text-[9px] text-slate-400 font-bold">{msg.sender} ({msg.source}) • {msg.timestamp}</span>
                            <div className={`p-3 max-w-[85%] rounded-xl leading-normal font-medium shadow-3xs ${
                              msg.isCustomer 
                                ? 'bg-white text-slate-700 border border-slate-200 text-left' 
                                : 'bg-indigo-600 text-white text-left'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick interactive input */}
                    <div className="flex gap-2 items-center pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendGoogleReply()}
                        placeholder="Google Chatへ直接同期返答メッセージを入力..."
                        className="flex-1 bg-white text-xs rounded-lg border border-slate-200 px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-550"
                      />
                      <button
                        type="button"
                        onClick={handleSendGoogleReply}
                        className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shrink-0 transition shadow-xs cursor-pointer"
                        title="顧客へ同期送信"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Drive folders & Google scheduler calendar settings */}
                  <div className="md:col-span-5 space-y-4">
                    {/* Folder tree */}
                    <div className="bg-white p-4 rounded-xl border border-slate-205 space-y-2.5">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                        <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <FolderOpen className="h-4 w-4 text-amber-500" />
                          Google Drive 連携・共有フォルダ
                        </h5>
                        <span className="text-[9px] text-slate-400">マッピング済</span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        {[
                          { name: '📥LP_構成原稿案_Ver3.docx', size: '1.4 MB' },
                          { name: '🖼️ファーストビュー素材.png', size: '8.4 MB' },
                          { name: '📊決済マッピングシート.xlsx', size: '124 KB' },
                          { name: '🗂️顧客提出向け資料.pdf', size: '9.2 MB' }
                        ].map((df, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg flex items-center justify-between">
                            <span className="truncate text-slate-700 font-bold select-all gap-1.5 flex items-center" title={df.name}>
                              <FileText className="h-3.5 w-3.5 text-slate-405 shrink-0" />
                              <span className="truncate">{df.name}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 shrink-0 bg-white px-1.5 border border-slate-200 rounded">{df.size}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => alert("Google Driveに繋いでプロジェクト専用フォルダ「" + project.clientName + "_UTAGE設計」を新規タブで開きます。")}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <span>Google Drive をエクスプローラで開く</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Google Calendar synclink */}
                    <div className="bg-white p-4 rounded-xl border border-slate-205 space-y-4">
                      <div>
                        <h5 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-emerald-500" />
                          Google Calendar 期日・会議連動
                        </h5>
                        <p className="text-[10px] text-slate-450 mt-1">目標期日 ( {project.targetDate} )をカレンダー連携して顧客・構築クルー間で常時同期します。</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSyncGoogleCalendar}
                        disabled={googleSyncing}
                        className={`w-full py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition ${
                          googleCalendarSynced 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-250 font-black'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-3xs cursor-pointer'
                        }`}
                      >
                        {googleSyncing ? (
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        ) : googleCalendarSynced ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>カレンダー期日同期が完了しました</span>
                          </>
                        ) : (
                          <span>Googleカレンダーと連動同期する</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {rightPanelTab === 'ai' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-slate-800">
                      Gemini 3.5 AI原稿ジェネレーター & LP構成構成文
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">UTAGEに登録するメッセージ文言や、成約率を高める訴求コピー案をAI生成します。</p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-8">
                      <label className="block text-[9px] text-slate-450 font-black uppercase tracking-wider mb-1.5">
                        ターゲットとする構築対象ステップ（オプトイン、完了メール、決済等）
                      </label>
                      <select
                        value={selectedStepForAi}
                        onChange={(e) => setSelectedStepForAi(e.target.value)}
                        className="w-full text-xs font-extrabold text-slate-805 bg-white border border-slate-205 rounded-xl px-3.5 py-3 focus:outline-hidden cursor-pointer"
                      >
                        {steps.map((st) => (
                          <option key={st.id} value={st.name}>{st.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-4">
                      <button
                        type="button"
                        onClick={handleGenerateAiCopy}
                        disabled={loadingAi || !selectedStepForAi}
                        className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:opacity-95 text-white py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        {loadingAi ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>AI執筆中...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 shrink-0" />
                            <span>AIコピーを執筆生成</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Generated result showcase in widescreen */}
                {aiGeneratedData ? (
                  <div className="space-y-5 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* JPY Headline Copy */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs relative group text-left space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">キャッチコピー構成案</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(aiGeneratedData.headlineCopy, 'copy')}
                            className="text-slate-400 hover:text-indigo-600 transition"
                          >
                            {copiedField === 'copy' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <p className="text-xs font-extrabold text-slate-800 pt-1 leading-relaxed">{aiGeneratedData.headlineCopy}</p>
                      </div>

                      {/* Sub Headline */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs relative group text-left space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] bg-indigo-50 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">サブコピー構成案</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(aiGeneratedData.subHeadline, 'sub')}
                            className="text-slate-400 hover:text-indigo-600 transition"
                          >
                            {copiedField === 'sub' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <p className="text-xs font-bold text-slate-650 pt-1 leading-relaxed">{aiGeneratedData.subHeadline}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* CTA Button text */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs text-left">
                        <div className="flex items-center justify-between border-b pb-1">
                          <span className="text-[8px] text-teal-600 font-extrabold uppercase">CTAボタン文言案</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(aiGeneratedData.ctaText, 'cta')}
                            className="text-slate-400 hover:text-indigo-605"
                          >
                            {copiedField === 'cta' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                        <p className="text-xs font-bold font-mono text-teal-800 pt-1.5">{aiGeneratedData.ctaText}</p>
                      </div>

                      {/* Expected Optin Rate */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs text-left">
                        <div className="border-b pb-1">
                          <span className="text-[8px] text-purple-600 font-extrabold uppercase">想定登録転換率 (CVR)</span>
                        </div>
                        <p className="text-xs font-black text-purple-800 pt-1.5">{aiGeneratedData.expectedConversonRate || '18.5%'}</p>
                      </div>

                      {/* Suggested Block layout */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs text-left">
                        <div className="border-b pb-1">
                          <span className="text-[8px] text-emerald-600 font-extrabold uppercase">推奨背景グラフィック配色</span>
                        </div>
                        <p className="text-xs font-extrabold text-slate-700 pt-1.5">{aiGeneratedData.suggestedLayout || '爽やかな空と太陽を想起させるグラデーション'}</p>
                      </div>
                    </div>

                    {/* Step automatic email copies */}
                    <div className="bg-[#1e293b] text-slate-100 p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-880 pb-2.5">
                        <span className="text-[9px] text-teal-400 font-extrabold uppercase tracking-wide flex items-center gap-1">
                          <Mail className="h-3. w-3.5" />
                          LINE配信・フォロー自動メール原稿ステップ
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`件名: ${aiGeneratedData.emailSubject}\n\n${aiGeneratedData.emailBody}`, 'email')}
                          className="text-slate-400 hover:text-white transition"
                        >
                          {copiedField === 'email' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>

                      <div className="text-xs font-mono space-y-2 select-text">
                        <p className="font-extrabold text-teal-300">📧 件名: {aiGeneratedData.emailSubject}</p>
                        <div className="border-t border-slate-700 pt-3 max-h-[180px] overflow-y-auto pr-1 text-slate-350 whitespace-pre-wrap leading-relaxed select-text font-sans">
                          {aiGeneratedData.emailBody}
                        </div>
                      </div>
                    </div>

                    {/* Quick injection action */}
                    <button
                      type="button"
                      onClick={handleInjectToNotes}
                      className="w-full text-center bg-indigo-50 hover:bg-slate-100/80 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black py-3 transition cursor-pointer shadow-xs"
                    >
                      📝 生成された原稿を開発メモ（申し送り）に自動注入保存する
                    </button>
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl space-y-2">
                    <Sparkles className="h-7 w-7 mx-auto text-slate-300" />
                    <p className="text-xs font-black">AI生成がまだ実行されていません</p>
                    <p className="text-[11px]">上部のセレクトボックスからマイルストーンを選択し、「AIコピーを執筆生成」をクリックしてください。</p>
                  </div>
                )}
              </div>
            )}

            {/* Truncated tabs blocks placeholder */}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80 text-center text-[10px] text-slate-400">
            {rightPanelTab === 'steps' 
              ? "※ 各ステータスは即時で保存され、全体の進捗率へ動的に連動反映されます。" 
              : rightPanelTab === 'history'
              ? "※ クライアント要望や決定事項は時間降順でタイムライン形式として共有保存されます。"
              : "※ 他ツール(UTAGE / Google API / Stripe)との情報連動が正常に行われています。"
            }
          </div>
        </div>

      </div>
    </div>
  );
}
