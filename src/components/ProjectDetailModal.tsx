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
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Project, ProjectStatus, FunnelStep, TeamMember } from '../types';
import { mockClients } from '../data/mockData';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (updatedProj: Project) => void;
  onDeleteProject: (projectId: string) => void;
  members: TeamMember[];
}

export default function ProjectDetailModal({ 
  project, 
  isOpen, 
  onClose, 
  onUpdateProject,
  onDeleteProject,
  members
}: ProjectDetailModalProps) {
  const [status, setStatus] = useState<ProjectStatus>('原稿執筆中');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [targetDate, setTargetDate] = useState('');
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  // Tabs for right panel
  const [rightPanelTab, setRightPanelTab] = useState<'steps' | 'ai'>('steps');
  const [selectedStepForAi, setSelectedStepForAi] = useState<string>('');
  const [aiGeneratedData, setAiGeneratedData] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const handleSaveMeta = () => {
    const updatedProj: Project = {
      ...project,
      status,
      description,
      notes,
      targetDate,
      funnelSteps: steps
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
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
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
                  <div className="text-sm text-slate-600 leading-relaxed bg-slate-50/40 p-4 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1.5">構築の背景・ターゲット</p>
                    <div className="text-slate-700">{project.description || '概要の記載はありません。'}</div>
                  </div>

                  {project.notes && (
                    <div className="text-sm bg-indigo-55/35 border border-indigo-100/60 p-4 rounded-xl">
                      <p className="font-bold text-indigo-800 text-[11px] uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-indigo-500" />
                        開発ディレクター 申し送りメモ
                      </p>
                      <p className="text-slate-650 text-xs leading-relaxed">{project.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-2 text-slate-505 text-xs">
                      <Calendar className="h-4 w-4 text-slate-405" />
                      <span>
                        目標日: <strong className="text-slate-850 font-bold">{project.targetDate}</strong>
                        <span className="text-slate-400 text-[10px]"> (始:{project.startDate})</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-505 text-xs">
                      <DollarSign className="h-4 w-4 text-slate-405" />
                      <span>
                        受注規模: <strong className="text-slate-850 font-bold">{project.revenue || '未設定'}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Column with Tabs */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-205 flex flex-col justify-between min-h-[500px]">
              <div>
                {/* Sleek Tab Toggles at top */}
                <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1 mb-4 select-none border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setRightPanelTab('steps')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      rightPanelTab === 'steps'
                        ? 'bg-white text-slate-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <ListTodo className="h-4 w-4 text-indigo-500" />
                    <span>タスク・進捗状況</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRightPanelTab('ai')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      rightPanelTab === 'ai'
                        ? 'bg-white text-slate-800 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                    <span>AI原稿・構成アシスト</span>
                  </button>
                </div>

                {rightPanelTab === 'steps' ? (
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
                                className="w-full text-xs font-bold text-slate-750 bg-slate-50 border border-slate-200 rounded-md px-1 py-1 focus:bg-white focus:outline-hidden"
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
                ) : (
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
                          className="w-full text-xs font-bold text-slate-805 bg-white border border-slate-205 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
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
                        <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 pt-1">
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
                                  <div key={idx} className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-lg flex items-start gap-1.5 text-[10px] font-bold text-slate-700">
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
                              className="absolute top-3 right-3 text-slate-500 hover:text-white transition cursor-pointer"
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
                                {copiedField === 'email' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
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

              <div className="mt-4 pt-3 border-t border-slate-200/80 text-center text-[10px] text-slate-400">
                {rightPanelTab === 'steps' 
                  ? "※ 各ステータスはリアルタイムで保存され、全体の進捗率へ即座に連動反映されます。" 
                  : "※ AIコピーはUTAGEに直接貼り付け、または左メモ欄に注入して再編成が可能です。"
                }
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
