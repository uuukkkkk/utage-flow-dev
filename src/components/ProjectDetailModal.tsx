import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  History,
  MessageSquare,
  FolderOpen,
  Send,
  RefreshCw,
  Chrome,
  ExternalLink,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { Project, ProjectStatus, FunnelStep, TeamMember, ProjectHistoryLog } from '../types';
import { mockClients } from '../data/mockData';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (updatedProj: Project) => void;
  onDeleteProject: (projectId: string) => void;
  members: TeamMember[];
  onOpenDetailView?: (projectId: string) => void;
}

export default function ProjectDetailModal({ 
  project, 
  isOpen, 
  onClose, 
  onUpdateProject,
  onDeleteProject,
  members,
  onOpenDetailView
}: ProjectDetailModalProps) {
  const [status, setStatus] = useState<ProjectStatus>('原稿執筆中');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [targetDate, setTargetDate] = useState('');
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  // Tabs for right panel
  const [rightPanelTab, setRightPanelTab] = useState<'steps' | 'history' | 'google' | 'ai'>('steps');
  const [selectedStepForAi, setSelectedStepForAi] = useState<string>('');
  const [aiGeneratedData, setAiGeneratedData] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // States for custom history logs and Google Workspace integration helper
  const [newLogCategory, setNewLogCategory] = useState<'client_request' | 'meeting_note' | 'update_log'>('client_request');
  const [newLogContent, setNewLogContent] = useState('');
  const [newLogAuthor, setNewLogAuthor] = useState('佐藤 広務');

  const [googleSyncing, setGoogleSyncing] = useState(false);
  const [googleCalendarSynced, setGoogleCalendarSynced] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [googleMessages, setGoogleMessages] = useState<any[]>([]);

  // Load project values when modal opens or shifts
  useEffect(() => {
    if (project) {
      setStatus(project.status);
      setDescription(project.description);
      setNotes(project.notes || '');
      setSteps(project.funnelSteps || []);
      setTargetDate(project.targetDate);
      setIsEditingMeta(false);
      
      if (project.funnelSteps && project.funnelSteps.length > 0) {
        setSelectedStepForAi(project.funnelSteps[0].name);
      } else {
        setSelectedStepForAi('');
      }
      setAiGeneratedData(null);
      setErrorMessage('');
      setRightPanelTab('steps');

      // Populate interactive google communications aggregated for this client
      setGoogleMessages([
        {
          id: `g-${project.id}-1`,
          source: 'Google Chat (Space)',
          sender: `代表 ${project.clientName.replace('様', '')}様`,
          timestamp: '今日 11:24',
          content: `お疲れ様です！今回の${project.funnelType}用の画像・構成原稿をGoogleドライブに追加共有しました。ご確認いただけますか？`,
          isCustomer: true
        },
        {
          id: `g-${project.id}-2`,
          source: 'Google Chat (Space)',
          sender: '田中 美咲 (UTAGE Hub)',
          timestamp: '今日 11:45',
          content: 'ご共有ありがとうございます！ファイル一式確認できました。構成案を現在のステップ（制作中）にマッピング反映いたします。',
          isCustomer: false
        },
        {
          id: `g-${project.id}-3`,
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
  }, [project]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateAiCopy = async () => {
    if (!selectedStepForAi) return;
    setLoadingAi(true);
    setErrorMessage('');
    setAiGeneratedData(null);

    const associatedClient = mockClients.find(c => c.id === project.clientId);
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
    if (!aiGeneratedData) return;
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

  if (!isOpen || !project) return null;

  // Handle step status change
  const handleStepStatusChange = (stepId: string, newStepStatus: FunnelStep['status']) => {
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
      id: `g-reply-${Date.now()}`,
      source: 'Google Chat (Space)',
      sender: 'あなた (UTAGE Hub統合)',
      timestamp: timeStr,
      content: replyText,
      isCustomer: false
    };

    setGoogleMessages(prev => [...prev, newMsg]);

    // Also auto-append an activity log on the history logs!
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
    const logEntries: string[] = [];
    if (status !== project.status) {
      logEntries.push(`・ステータスを「${project.status}」から「${status}」へ書き換え`);
    }
    if (targetDate !== project.targetDate) {
      logEntries.push(`・目標期日を「${project.targetDate}」から「${targetDate}」へ調整`);
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
      funnelSteps: steps,
      historyLogs: updatedLogs
    };
    onUpdateProject(updatedProj);
    setIsEditingMeta(false);
  };

  const handleDelete = () => {
    if (window.confirm(`「${project.clientName}」のプロジェクトを本当に削除してよろしいですか？`)) {
      onDeleteProject(project.id);
      onClose();
    }
  };

  // Status Badge color helpers
  const getStepStatusClasses = (stepStatus: FunnelStep['status']) => {
    switch (stepStatus) {
      case '完了':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case '確認中':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case '制作中':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#0f172a] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <p className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest">{project.funnelType}</p>
            <h3 className="text-xl font-bold tracking-tight mt-0.5">{project.clientName}</h3>
          </div>
          <div className="flex items-center space-x-3">
            {onOpenDetailView && (
              <button
                type="button"
                onClick={() => onOpenDetailView(project.id)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
              >
                <span>🖥️ Widescreen詳細ワークスペースで開く</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body Scrollable */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Progress Banner */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-505 animate-pulse" />
                  ファネル総合構築進捗
                </span>
                <span className="text-xl font-black text-indigo-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">進捗状態</span>
              <span className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${
                project.status === '本番稼働中' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                project.status === 'テスト運用中' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                project.status === 'UTAGE実装中' ? 'bg-violet-50 text-violet-600 border border-violet-200' :
                project.status === 'クライアント確認中' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                'bg-slate-50 text-slate-600 border border-slate-250'
              }`}>
                {project.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: General Meta Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">プロジェクト詳細・スコープ</h4>
                <button
                  type="button"
                  onClick={() => setIsEditingMeta(!isEditingMeta)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {isEditingMeta ? (
                    <>
                      <X className="h-3.5 w-3.5" />
                      <span>編集キャンセル</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>内容を編集する</span>
                    </>
                  )}
                </button>
              </div>

              {isEditingMeta ? (
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-550 mb-1">全体進捗ステータス</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                      className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-550"
                    >
                      <option value="原稿執筆中">原稿執筆中</option>
                      <option value="クライアント確認中">クライアント確認中</option>
                      <option value="UTAGE実装中">UTAGE実装中</option>
                      <option value="テスト運用中">テスト運用中</option>
                      <option value="本番稼働中">本番稼働中</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">目標期日</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-850 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">ファネル設計の概要</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-855 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-450 mb-1">開発用メモ (備忘録)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-sm rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-855 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveMeta}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/10"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>変更内容を保存する</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50/40 p-4 rounded-xl border border-slate-100 text-left">
                    <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1.5">構築の背景・ターゲット</p>
                    <div className="text-slate-700 whitespace-pre-wrap select-text">{project.description || '概要の記載はありません。'}</div>
                  </div>

                  {project.notes && (
                    <div className="text-sm bg-indigo-50/55 border border-indigo-100 p-4 rounded-xl text-left">
                      <p className="font-bold text-indigo-805 text-[11px] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-indigo-500" />
                        開発ディレクター 申し送りメモ
                      </p>
                      <p className="text-slate-650 text-xs leading-relaxed whitespace-pre-wrap select-text">{project.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-2 text-slate-500 text-xs">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>
                        目標日: <strong className="text-slate-800 font-bold">{project.targetDate}</strong>
                        <span className="text-slate-400 text-[10px]"> (始:{project.startDate})</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-500 text-xs">
                      <DollarSign className="h-4 w-4 text-slate-404" />
                      <span>
                        受注規模: <strong className="text-slate-800 font-bold">{project.revenue || '未設定'}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Column with 4 Polished Tabs */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-205 flex flex-col justify-between min-h-[520px]">
              <div>
                {/* Sleek Tab Toggles at top */}
                <div className="grid grid-cols-4 bg-slate-200/60 p-1 rounded-xl gap-1 mb-4 select-none border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRightPanelTab('steps')}
                    className={`py-2 rounded-lg text-[9px] sm:text-[10.5px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      rightPanelTab === 'steps'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ListTodo className="h-3.5 w-3.5 text-indigo-505" />
                    <span>タスク</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRightPanelTab('history')}
                    className={`py-2 rounded-lg text-[9px] sm:text-[10.5px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      rightPanelTab === 'history'
                        ? 'bg-white text-emerald-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <History className="h-3.5 w-3.5 text-amber-500" />
                    <span>履歴・要望</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRightPanelTab('google')}
                    className={`py-2 rounded-lg text-[9px] sm:text-[10.5px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      rightPanelTab === 'google'
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Chrome className="h-3.5 w-3.5 text-blue-500" />
                    <span>Google連携</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRightPanelTab('ai')}
                    className={`py-2 rounded-lg text-[9px] sm:text-[10.5px] font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      rightPanelTab === 'ai'
                        ? 'bg-white text-slate-850 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    <span>AI原稿</span>
                  </button>
                </div>

                {rightPanelTab === 'steps' && (
                  /* ================= STEPS VIEW ================= */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                        UTAGEページ進捗 & 担当管理
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-black">
                        {steps.filter(s => s.status === '完了').length} / {steps.length} 完了
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                      {steps.map((step) => (
                        <div key={step.id} className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-3 hover:border-slate-350 transition-colors">
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-xs font-black text-slate-855 leading-snug">
                              {step.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border shrink-0 ${getStepStatusClasses(step.status)}`}>
                              {step.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-slate-100">
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase mb-0.5">担当者</span>
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
                                className="w-full text-xs font-bold text-slate-750 bg-slate-50 border border-slate-200 rounded-md px-1 py-1 focus:bg-white focus:outline-hidden cursor-pointer"
                              >
                                <option value="">未設定</option>
                                {members.map(m => (
                                  <option key={m.id} value={m.name}>{m.name} ({m.role})</option>
                                ))}
                                {step.assignee && !members.some(m => m.name === step.assignee) && (
                                  <option value={step.assignee}>{step.assignee}</option>
                                )}
                              </select>
                            </div>

                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase mb-0.5">作業期日</span>
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
                                className="w-full text-xs font-bold text-slate-750 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 focus:bg-white focus:outline-hidden"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                            <span className="text-[9px] text-slate-400 font-bold">ステータス:</span>
                            <div className="flex space-x-1 select-none">
                              {(['未着手', '制作中', '確認中', '完了'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStepStatusChange(step.id, st)}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold border transition-all cursor-pointer ${
                                    step.status === st 
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs' 
                                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-150'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rightPanelTab === 'history' && (
                  /* ================= HISTORY TIMELINE VIEW ================= */
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                        <History className="h-4 w-4 text-amber-500" />
                        顧客要望 ＆ スコープ変更履歴タイムライン
                      </span>
                    </div>

                    {/* Quick Add Form */}
                    <div className="bg-slate-100/80 p-3.5 rounded-xl border border-dashed border-slate-250 space-y-2.5 shadow-3xs">
                      <p className="text-[10.5px] font-black text-slate-800">✍️ 新規履歴・ご要望の追記登録</p>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <label className="block text-[8px] text-slate-400 font-bold uppercase mb-0.5">ログ種類</label>
                          <select
                            value={newLogCategory}
                            onChange={(e) => setNewLogCategory(e.target.value as any)}
                            className="w-full text-xs font-bold bg-white border border-slate-200 rounded-md px-1.5 py-1 focus:outline-hidden"
                          >
                            <option value="client_request">📥 顧客からの追加要望</option>
                            <option value="meeting_note">📅 打ち合わせ決定事項</option>
                            <option value="update_log">🛠️ スコープ・要件更新</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8px] text-slate-400 font-bold uppercase mb-0.5">記録担当者</label>
                          <input
                            type="text"
                            value={newLogAuthor}
                            onChange={(e) => setNewLogAuthor(e.target.value)}
                            className="w-full text-xs font-bold bg-white border border-slate-200 rounded-md px-1.5 py-1 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] text-slate-400 font-bold uppercase mb-0.5">履歴メモ（決定事項や顧客メッセージ等）</label>
                        <textarea
                          rows={2}
                          value={newLogContent}
                          onChange={(e) => setNewLogContent(e.target.value)}
                          placeholder="例: 会員限定特別PDFダウンロードについて、Stripeのご決済完了後にUTAGE自動ステップが配信される設計に決定。"
                          className="w-full text-xs font-medium bg-white border border-slate-200 rounded-md p-1.5 focus:outline-hidden text-slate-800"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddNewHistoryLog}
                        disabled={!newLogContent.trim()}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs"
                      >
                        タイムラインへ保存・追記する
                      </button>
                    </div>

                    {/* Historical Timeline List scrollable */}
                    <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                      {project.historyLogs && project.historyLogs.length > 0 ? (
                        project.historyLogs.map((log) => {
                          let badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
                          let categoryText = "顧客要望";
                          if (log.category === 'meeting_note') {
                            badgeBg = "bg-blue-50 text-blue-700 border-blue-200";
                            categoryText = "会議議事";
                          } else if (log.category === 'update_log') {
                            badgeBg = "bg-slate-100 text-slate-700 border-slate-300";
                            categoryText = "要件変更";
                          }

                          return (
                            <div key={log.id} className="bg-white p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-1 my-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${badgeBg}`}>
                                    {categoryText}
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-bold">
                                    {log.author}
                                  </span>
                                </div>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {log.timestamp}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-700 font-medium whitespace-pre-wrap leading-relaxed select-text">
                                {log.content}
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 text-center text-slate-400 space-y-2">
                          <History className="h-6 w-6 mx-auto text-slate-300" />
                          <p className="text-[9px] font-bold">まだ依頼履歴やメモが登録されていません</p>
                          <p className="text-[8px] text-slate-400">上部の追記フォームから新しい決定事項や顧客メッセージを登録してください。</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {rightPanelTab === 'google' && (
                  /* ================= GOOGLE CONNECTOR HUB VIEW ================= */
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                        <Chrome className="h-4 w-4 text-blue-500" />
                        Google Workspace エコシステム統合
                      </span>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-black flex items-center gap-1 border border-emerald-250">
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                        Live同期中
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      
                      {/* Section 1: Chat Stream */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[10.5px] font-black text-slate-800 flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
                            顧客メッセージ集約 (Google Chat / Gmail)
                          </h5>
                          <span className="text-[8px] text-slate-400">Backlog不要</span>
                        </div>

                        {/* Stream message history */}
                        <div className="bg-slate-50 rounded-lg p-2.5 space-y-2 max-h-[160px] overflow-y-auto border border-slate-100 select-text">
                          {googleMessages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col space-y-0.5 text-[10px] ${msg.isCustomer ? 'items-start' : 'items-end'}`}>
                              <span className="text-[8px] text-slate-400 font-semibold">{msg.sender} ({msg.source}) • {msg.timestamp}</span>
                              <div className={`p-2 max-w-[90%] rounded-lg leading-normal font-medium ${
                                msg.isCustomer 
                                  ? 'bg-white text-slate-805 border border-slate-200 text-left' 
                                  : 'bg-indigo-650 text-white text-left'
                              }`}>
                                {msg.content}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Quick Interactive Reply input */}
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendGoogleReply()}
                            placeholder="Google Chat、またはGmail経由で直接顧客に返信..."
                            className="flex-1 bg-slate-55 text-[11px] rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-550"
                          />
                          <button
                            type="button"
                            onClick={handleSendGoogleReply}
                            className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shrink-0 transition"
                            title="返信する"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Section 2: Drive deliveries */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[10.5px] font-black text-slate-800 flex items-center gap-1.5">
                            <FolderOpen className="h-3.5 w-3.5 text-amber-500" />
                            Googleドライブ 成果物・素材共有フォルダ
                          </h5>
                          <span className="text-[8px] text-indigo-600 font-extrabold">同期フォルダ</span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                          {[{ name: `📥LP_構成原稿案_Ver3.docx`, size: '1.4 MB' },
                            { name: `🖼️ファーストビュー素材.png`, size: '8.4 MB' },
                            { name: `📊決済マッピングシート.xlsx`, size: '124 KB' },
                            { name: `🗂️顧客提出向け資料.pdf`, size: '9.2 MB' }].map((df, dfIdx) => (
                              <div key={dfIdx} className="bg-slate-50 border border-slate-150 p-1.5 rounded-lg flex items-center justify-between">
                                <span className="truncate text-slate-700 font-bold select-all gap-1 flex items-center" title={df.name}>
                                  <FileText className="h-3 w-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{df.name}</span>
                                </span>
                                <span className="text-[8px] text-slate-400 shrink-0 bg-white px-1 border border-slate-200 rounded">{df.size}</span>
                              </div>
                            ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => alert("Google Driveに繋いでプロジェクト専用フォルダ「" + project.clientName + "_UTAGE設計」を新規に開きます。")}
                          className="w-full py-1 bg-slate-50 hover:bg-slate-105 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer leading-none transition"
                        >
                          <span>Google Drive で直接共有フォルダを開く</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Section 3: Calendar automation */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <h5 className="text-[10.5px] font-black text-slate-800 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
                            Googleカレンダー自動連携設定
                          </h5>
                          <p className="text-[8px] text-slate-450">目標期日: {project.targetDate} を顧客共同カレンダーと同期保存</p>
                        </div>

                        <button
                          type="button"
                          onClick={handleSyncGoogleCalendar}
                          disabled={googleSyncing}
                          className={`py-1.5 px-3 rounded-lg text-[10px] font-black flex items-center gap-1 transition ${
                            googleCalendarSynced 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-250'
                              : 'bg-indigo-600 text-white hover:opacity-95 shadow-2xs'
                          }`}
                        >
                          {googleSyncing ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : googleCalendarSynced ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>同期完了</span>
                            </>
                          ) : (
                            <span>カレンダー同期</span>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {rightPanelTab === 'ai' && (
                  /* ================= AI ASSISTANT VIEW ================= */
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                      <Sparkles className="h-4.5 w-4.5 text-emerald-500" />
                      <div>
                        <h4 className="text-xs font-black text-slate-800">
                          AI原稿ライティング & 構成ブロック生成
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Gemini 3.5 を活用して、選択中ステップの高成約原稿＆設定を生成</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">
                          ライティング対象のファネルステップを選択
                        </label>
                        <select
                          value={selectedStepForAi}
                          onChange={(e) => setSelectedStepForAi(e.target.value)}
                          className="w-full text-xs font-bold text-slate-805 bg-white border border-slate-205 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          {steps.map((st) => (
                            <option key={st.id} value={st.name}>{st.name}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={handleGenerateAiCopy}
                        disabled={loadingAi || !selectedStepForAi}
                        className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:opacity-95 text-white py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {loadingAi ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>構成・コピー案を生成中... (約3秒)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4.5 w-4.5" />
                            <span>AIコピー＆構成案を生成する</span>
                          </>
                        )}
                      </button>

                      {errorMessage && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Generated result rendering */}
                      {aiGeneratedData && (
                        <div className="space-y-4 max-h-[290px] overflow-y-auto pr-1 pt-1">
                          {/* JPY Headline Hook Copy */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs relative group text-left">
                            <span className="text-[8px] bg-indigo-50 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">最強キャッチコピー (案)</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(aiGeneratedData.headlineCopy, 'headline')}
                              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                              title="コピー"
                            >
                              {copiedField === 'headline' ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500 font-extrabold" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <p className="text-xs font-black text-slate-800 mt-2 leading-relaxed whitespace-pre-wrap">
                              {aiGeneratedData.headlineCopy}
                            </p>
                          </div>

                          {/* Sub Headline */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-3xs relative group text-left">
                            <span className="text-[8px] bg-slate-100 text-slate-500 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">サブベネフィット/説明文</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(aiGeneratedData.subHeadline, 'subheadline')}
                              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                            >
                              {copiedField === 'subheadline' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                            <p className="text-[11px] font-medium text-slate-600 mt-2 leading-relaxed">
                              {aiGeneratedData.subHeadline}
                            </p>
                          </div>

                          {/* CTA conversion button preview */}
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-left">
                            <span className="text-[8px] text-slate-400 font-extrabold block mb-2">おすすめボタンCTA誘導 (成約率重視)</span>
                            <div className="bg-emerald-50 border border-dashed border-emerald-250 p-2 text-center rounded-xl font-black text-xs text-emerald-800 flex items-center justify-between">
                              <span className="truncate">&gt;&gt; {aiGeneratedData.ctaText}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(aiGeneratedData.ctaText, 'cta')}
                                className="bg-white border border-emerald-300 p-1 rounded hover:bg-emerald-100 transition shrink-0 cursor-pointer"
                              >
                                {copiedField === 'cta' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-500" />}
                              </button>
                            </div>
                          </div>

                          {/* Key compulsion hooks */}
                          {aiGeneratedData.keyFeatures && aiGeneratedData.keyFeatures.length > 0 && (
                            <div className="space-y-1.5 text-left">
                              <span className="text-[8px] text-slate-400 font-extrabold block">ステップ要素のコア訴求3選</span>
                              <div className="grid grid-cols-1 gap-1.5">
                                {aiGeneratedData.keyFeatures.map((kf: string, idx: number) => (
                                  <div key={idx} className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg flex items-start gap-1.5 text-[10px] font-bold text-slate-705">
                                    <span className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 font-mono text-[9px] mt-0.5">{idx + 1}</span>
                                    <span className="leading-relaxed">{kf}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Layout recommendation blocks */}
                          <div className="bg-slate-950 text-slate-350 p-3.5 rounded-xl border border-slate-800 relative text-left">
                            <span className="text-[8px] bg-slate-800 text-slate-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                              <Layout className="h-3 w-3 text-indigo-400" />
                              UTAGE要素＆カラーのレイアウト推奨
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(aiGeneratedData.layoutRecomendations, 'layout')}
                              className="absolute top-3 right-3 text-slate-505 hover:text-white transition cursor-pointer"
                            >
                              {copiedField === 'layout' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                            <p className="text-[10px] text-slate-300 font-mono mt-2 leading-relaxed whitespace-pre-wrap">
                              {aiGeneratedData.layoutRecomendations}
                            </p>
                          </div>

                          {/* Follow up Autoresponder email */}
                          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 space-y-2 relative text-left">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-[8px] text-indigo-400 font-black uppercase tracking-wider flex items-center gap-1">
                                <Mail className="h-3 w-3 text-indigo-400" />
                                登録直後・自動返信メール下書き
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(`件名: ${aiGeneratedData.emailSubject}\n\n${aiGeneratedData.emailBody}`, 'email')}
                                className="text-slate-400 hover:text-white cursor-pointer"
                              >
                                {copiedField === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-505" /> : <Copy className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                            <div className="text-[10px] font-mono space-y-1.5">
                              <p className="font-extrabold text-teal-400">件名: {aiGeneratedData.emailSubject}</p>
                              <div className="border-t border-slate-800 pt-1.5 max-h-[140px] overflow-y-auto pr-1 text-slate-400 whitespace-pre-wrap leading-relaxed select-text font-sans text-[10px]">
                                {aiGeneratedData.emailBody}
                              </div>
                            </div>
                          </div>

                          {/* Quick injection action */}
                          <button
                            type="button"
                            onClick={handleInjectToNotes}
                            className="w-full text-center bg-indigo-50 hover:bg-slate-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-black py-2.5 transition cursor-pointer"
                          >
                            📝 生成された原稿を開発メモ（申し送り）に注入保存する
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                {rightPanelTab === 'steps' ? "※ 各ステータスはリアルタイムで保存され、全体の進捗率へ即座に連動反映されます。" :
                 rightPanelTab === 'history' ? "※ 顧客からの急な要件変更や打ち合わせ決定事項をタイムラインに集約管理します。" :
                 rightPanelTab === 'google' ? "※ 顧客がいつものGoogle UIで送ったメッセージが自動集約。Backlog/Asanaは不要です。" :
                 "※ AIコピーはUTAGEに直接貼り付け、または左メモ欄に注入して再編成が可能です。"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200/60 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="px-3.5 py-2 text-xs text-red-650 hover:text-red-850 font-bold hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            本プロジェクトを破棄
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl shadow-md transition-colors cursor-pointer"
          >
            ダッシュボードに戻る
          </button>
        </div>
      </motion.div>
    </div>
  );
}
