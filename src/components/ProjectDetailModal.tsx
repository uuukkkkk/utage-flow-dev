import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Edit3, Save, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Project, ProjectStatus, FunnelStep } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProject: (updatedProj: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function ProjectDetailModal({ 
  project, 
  isOpen, 
  onClose, 
  onUpdateProject,
  onDeleteProject
}: ProjectDetailModalProps) {
  const [status, setStatus] = useState<ProjectStatus>('原稿執筆中');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const [targetDate, setTargetDate] = useState('');
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  // Load project values when modal opens or shifts
  useEffect(() => {
    if (project) {
      setStatus(project.status);
      setDescription(project.description);
      setNotes(project.notes || '');
      setSteps(project.funnelSteps || []);
      setTargetDate(project.targetDate);
      setIsEditingMeta(false);
    }
  }, [project]);

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
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: General Meta Details */}
            <div className="md:col-span-2 space-y-5">
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

            {/* Right Side: Step-by-step detail pipeline for UTAGE */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-205 flex flex-col">
              <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  UTAGEページ毎の進捗状況と担当・期日
                </h4>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold">
                  {steps.filter(s => s.status === '完了').length} / {steps.length} 完了
                </span>
              </div>
              
              <div className="space-y-4 flex-1 max-h-[460px] overflow-y-auto pr-1">
                {steps.map((step) => {
                  return (
                    <div key={step.id} className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-3 hover:border-slate-350 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-xs font-black text-slate-800 leading-tight">
                            {step.name}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border shrink-0 ${getStepStatusClasses(step.status)}`}>
                          {step.status}
                        </span>
                      </div>

                      {/* Display / Input fields for Assignee and Due Date */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                        <div>
                          <label className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                            担当者
                          </label>
                          <input
                            type="text"
                            value={step.assignee || ''}
                            onChange={(e) => {
                              const updatedSteps = steps.map(s => 
                                s.id === step.id ? { ...s, assignee: e.target.value } : s
                              );
                              setSteps(updatedSteps);
                              const updatedProj: Project = { ...project, funnelSteps: updatedSteps };
                              onUpdateProject(updatedProj);
                            }}
                            placeholder="担当者名..."
                            className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 focus:bg-white focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                            作業期日
                          </label>
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
                            className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 focus:bg-white focus:outline-hidden"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[9px] text-slate-400 font-bold">ステータス切替:</span>
                        <div className="flex space-x-1 select-none">
                          {(['未着手', '制作中', '確認中', '完了'] as const).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStepStatusChange(step.id, st)}
                              className={`px-1.5 py-0.5 rounded-md text-[9px] font-extrabold border transition-all cursor-pointer ${
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
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 text-center text-[10px] text-slate-400">
                ※ 担当者・期日・各ステータスはリアルタイムで保存され、全体の進捗率（％）へ即座に連動反映されます。
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
