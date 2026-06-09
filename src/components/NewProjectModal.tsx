import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Project, FunnelType, ProjectStatus, FunnelStep, Client, TeamMember } from '../types';
import { mockTemplates } from '../data/mockData';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  members: TeamMember[];
  onAddProject: (project: Omit<Project, 'id' | 'progress'> & { id?: string, progress?: number }) => void;
}

export default function NewProjectModal({ isOpen, onClose, clients, members, onAddProject }: NewProjectModalProps) {
  const [clientId, setClientId] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [useCustomClient, setUseCustomClient] = useState(false);
  const [funnelType, setFunnelType] = useState<FunnelType>('個別相談ファネル');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('');
  const [revenue, setRevenue] = useState('');
  const [notes, setNotes] = useState('');
  const [useTemplate, setUseTemplate] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalClientName = '';
    let finalClientId = '';

    if (useCustomClient) {
      finalClientName = newClientName || '新規顧客様';
      finalClientId = 'c_new_' + Date.now();
    } else {
      const selectedClient = clients.find(c => c.id === clientId);
      if (selectedClient) {
        finalClientName = selectedClient.name;
        finalClientId = selectedClient.id;
      } else {
        // Fallback or first client
        finalClientName = clients[0]?.name || '新規顧客様';
        finalClientId = clients[0]?.id || 'c1';
      }
    }

    // Auto generate steps if requested, else empty setup
    let funnelSteps: FunnelStep[] = [];
    if (useTemplate) {
      const matchingTemplate = mockTemplates.find(t => t.category === funnelType);
      if (matchingTemplate) {
        funnelSteps = matchingTemplate.steps.map((step, idx) => ({
          id: `step-${Date.now()}-${idx}`,
          name: step.replace(/^\d+\.\s*/, ''), // strip numbers for visual beauty
          status: '未着手' as const
        }));
      } else {
        // Fallback default steps
        funnelSteps = [
          { id: `step-def-1`, name: 'LP制作', status: '未着手' },
          { id: `step-def-2`, name: 'UTAGEフォーム統合', status: '未着手' },
          { id: `step-def-3`, name: 'サンクスページ', status: '未着手' },
          { id: `step-def-4`, name: 'リマインダー設定', status: '未着手' }
        ];
      }
    } else {
      funnelSteps = [
        { id: `step-simple-1`, name: '初期ヒアリング & 要件定義', status: '未着手' },
        { id: `step-simple-2`, name: 'UTAGE構築作業', status: '未着手' },
        { id: `step-simple-3`, name: '動作検証 & クライアント確認', status: '未着手' }
      ];
    }

    onAddProject({
      clientId: finalClientId,
      clientName: finalClientName,
      funnelType,
      status: '原稿執筆中',
      startDate,
      targetDate: targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // default 1 month
      description,
      revenue: revenue ? `${parseInt(revenue).toLocaleString()}円` : '未定',
      funnelSteps,
      notes,
    });

    // Reset fields
    setClientId('');
    setNewClientName('');
    setDescription('');
    setRevenue('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-2xl w-full overflow-hidden"
      >
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Sparkles className="h-5 w-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-800">新規プロジェクト追加</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Client Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                対象の顧客 (クライアント)
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4 mb-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-teal-600 focus:ring-teal-500"
                      checked={!useCustomClient}
                      onChange={() => setUseCustomClient(false)}
                    />
                    <span className="ml-2 text-sm text-slate-700">登録済み顧客から選択</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-teal-600 focus:ring-teal-500"
                      checked={useCustomClient}
                      onChange={() => setUseCustomClient(true)}
                    />
                    <span className="ml-2 text-sm text-slate-700">新しい顧客を入力</span>
                  </label>
                </div>

                {!useCustomClient ? (
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    required={!useCustomClient}
                  >
                    <option value="">▼ クライアントを選択してください</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.industry})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="例: インサイド英会話スクール様"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    required={useCustomClient}
                  />
                )}
              </div>
            </div>

            {/* Funnel Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                UTAGEファネルの種類
              </label>
              <select
                value={funnelType}
                onChange={(e) => setFunnelType(e.target.value as FunnelType)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-1000 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                required
              >
                <option value="個別相談ファネル">個別相談獲得ファネル</option>
                <option value="セミナー集客ファネル">セミナー集客ファネル</option>
                <option value="無料プレゼント配布ファネル">無料プレゼント配布ファネル</option>
                <option value="自社プロダクト販売ファネル">自社プロダクト直売ファネル</option>
                <option value="オンラインコンテンツ販売ファネル">エバーグリーン会員サイト販売ファネル</option>
              </select>
            </div>
          </div>

          {/* Dates & Budget */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                プロジェクト開始日
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                リリース完了・目標期日
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                予算・案件バリュー (半角数値)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="例: 400000"
                  className="w-full rounded-lg border border-slate-200 bg-white pl-3 pr-8 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                />
                <span className="absolute right-3 top-2 text-sm text-slate-400">円</span>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              案件概要・ファネル設計メモ
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例: 集客用LPから無料オンライン説明会へ案内し、高単価プレミアム講座への申込みを獲得。リマインドラインや特典アンケート配信も含めてUTAGEで自動一貫構築します。"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              当面の作業メモ / 進め方の注意点
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="作業上の注意、期日連絡などのリマインダーをここに記入"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500"
            />
          </div>

          {/* Auto Template toggle */}
          <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 flex items-start space-x-3">
            <input
              type="checkbox"
              id="use-preset-template"
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
              className="mt-1 rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <div>
              <label htmlFor="use-preset-template" className="text-sm font-semibold text-slate-800 cursor-pointer">
                ファネルテンプレートから高精度の初期ステップを自動生成する (推奨)
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                選択したファネル種類（{funnelType}）に最適なLP、サンクス、決済などのステップ群、標準リマインド構成が自動的に展開されます。
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-md hover:shadow-teal-100 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>プロジェクトを作成する</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
