import React, { useState } from 'react';
import { X, Plus, Sparkles, Check, AlertCircle } from 'lucide-react';
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

  // AI Funnel Outline Generator States
  const [targetAudience, setTargetAudience] = useState('');
  const [aiOutfitData, setAiOutfitData] = useState<{
    steps: { name: string; description: string }[];
    copyPlaceholders: string;
    timeline: string;
  } | null>(null);
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [aiError, setAiError] = useState('');
  const [customAiSteps, setCustomAiSteps] = useState<FunnelStep[] | null>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const handleGenerateAiBlueprint = async () => {
    if (!targetAudience.trim()) {
      setAiError('AIがファネル構成を設計するために、対象となるターゲット顧客層を入力してください。');
      return;
    }

    setGeneratingOutline(true);
    setAiError('');
    setAiOutfitData(null);

    try {
      const response = await fetch('/api/generate-funnel-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAudience, funnelType })
      });

      if (!response.ok) {
        throw new Error(`APIサーバーエラー: ステータス ${response.status}`);
      }

      const data = await response.json();
      setAiOutfitData(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'AI経由の構成設計に失敗しました。時間をおいて再試行してください。');
    } finally {
      setGeneratingOutline(false);
    }
  };

  const handleApplyAiBlueprint = () => {
    if (!aiOutfitData) return;

    // Map AI recommended steps to FunnelSteps with generic incremental IDs
    const mappedSteps: FunnelStep[] = aiOutfitData.steps.map((st, idx) => ({
      id: `ai-step-${Date.now()}-${idx}`,
      name: st.name,
      status: '未着手' as const,
      targetDate: `第${idx + 1}週`
    }));

    setCustomAiSteps(mappedSteps);
    setDescription(`【ターゲット顧客】\n${targetAudience}\n\n【AI推薦・心理ライティングコピー構成】\n${aiOutfitData.copyPlaceholders}`);
    setNotes(`【AI提案モデル・週間マイルストーン】\n${aiOutfitData.timeline}`);
  };

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
    if (customAiSteps && customAiSteps.length > 0) {
      funnelSteps = customAiSteps;
    } else if (useTemplate) {
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
    setTargetAudience('');
    setAiOutfitData(null);
    setCustomAiSteps(null);
    setIsAiPanelOpen(false);
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

          {/* AI Funnel Outline Generator Accordion/Panel */}
          <div className="border border-indigo-200 bg-gradient-to-br from-indigo-50/40 to-teal-50/20 p-5 rounded-xl space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    Gemini AI ファネル自動設計アシスト (推奨)
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold">ターゲットを指定するだけで、構築ステップ・構成コピー・期日計画を全自動生成します</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className="text-xs px-3 py-1 bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-700 font-bold rounded-lg shadow-3xs cursor-pointer transition-all"
              >
                {isAiPanelOpen ? '閉じる' : '開く / 起動'}
              </button>
            </div>

            {isAiPanelOpen && (
              <div className="space-y-4 pt-2 border-t border-indigo-100/65">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ターゲット顧客像 & 提供サービス詳細 (AI入力元)
                  </label>
                  <textarea
                    rows={2}
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="例: 副業や独立を考えている30代・40代の会社員で、本格的な動画編集・SNS集客スキルを習得したい方々。"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">※ターゲット顧客の悩みや年齢層、解決したい課題を細かく入れると、AI設計の精度がより向上します。</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-450 font-bold">ファネル種類: <strong className="text-indigo-600">{funnelType}</strong></span>
                  <button
                    type="button"
                    onClick={handleGenerateAiBlueprint}
                    disabled={generatingOutline || !targetAudience.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-teal-600 hover:opacity-95 text-white text-xs font-black rounded-lg shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {generatingOutline ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>設計中...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-yellow-200" />
                        <span>AI設計図を生成</span>
                      </>
                    )}
                  </button>
                </div>

                {aiError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}

                {aiOutfitData && (
                  <div className="bg-white rounded-xl border border-indigo-100 p-4 space-y-4 max-h-[300px] overflow-y-auto shadow-inner text-left">
                    <div className="flex items-center justify-between border-b border-indigo-50/80 pb-2">
                      <span className="text-xs font-black text-indigo-950 flex items-center gap-1">
                        ✨ AI推薦設計プラン概要
                      </span>
                      <button
                        type="button"
                        onClick={handleApplyAiBlueprint}
                        className="py-1 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-[10px] font-black rounded-md flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Check className="h-3 w-3 text-teal-600" />
                        <span>この設計をプロジェクト枠に適用</span>
                      </button>
                    </div>

                    {/* Recommended Steps list */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider">🛠️ 推薦構築ステップ ({aiOutfitData.steps.length}ステージ)</span>
                      <div className="space-y-1.5">
                        {aiOutfitData.steps.map((st, sIdx) => (
                          <div key={sIdx} className="bg-slate-50 border border-slate-150 p-2.5 rounded-lg flex items-start gap-2 text-xs">
                            <span className="w-5 h-5 bg-indigo-100 text-indigo-850 rounded-full flex items-center justify-center font-mono font-bold shrink-0 text-[10px]">{sIdx + 1}</span>
                            <div>
                              <p className="font-bold text-slate-800 text-[11px] leading-tight mb-0.5">{st.name}</p>
                              <p className="text-[9px] text-slate-500 leading-normal">{st.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Copy strategies */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider">✍️ 心理コピーライティング・ポイント案</span>
                      <p className="text-[10px] text-slate-650 bg-slate-50 p-3 rounded-lg border border-slate-150 font-medium leading-relaxed whitespace-pre-wrap">
                        {aiOutfitData.copyPlaceholders}
                      </p>
                    </div>

                    {/* Milestone schedules */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider">📅 推薦スケジュール ＆ 注意点</span>
                      <p className="text-[10px] text-slate-650 bg-slate-50 p-3 rounded-lg border border-slate-150 font-medium leading-relaxed whitespace-pre-wrap">
                        {aiOutfitData.timeline}
                      </p>
                    </div>
                  </div>
                )}

                {customAiSteps && customAiSteps.length > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold leading-normal flex items-start gap-2">
                    <Check className="h-4.5 w-4.5 text-emerald-650 shrink-0 mt-0.5" />
                    <div>
                      <p>AI設計 blueprint の適用に成功しました！</p>
                      <p className="text-[10px] text-emerald-700 font-normal mt-0.5">
                        このまま下部の「プロジェクトを作成する」をクリックすると、AIが特別に抽出した全 {customAiSteps.length} ステップの構築タスクとスケジュール、コピー設定が連動して初期搭載されます。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
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
