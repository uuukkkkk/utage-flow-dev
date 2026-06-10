import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Layers, 
  Info, 
  Sparkles, 
  Compass, 
  Lightbulb, 
  User, 
  Clock, 
  Save, 
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Template, FunnelType } from '../types';

interface TemplateListProps {
  templates: Template[];
  onAddTemplate: (newTemplate: Omit<Template, 'id' | 'stepsCount'> & { steps: string[] }) => void;
  onUpdateTemplate: (updatedTemplate: Template) => void;
  onDeleteTemplate: (templateId: string) => void;
  simulatedPlan?: 'Starter' | 'Pro' | 'Platinum';
}

const CATEGORIES: FunnelType[] = [
  'セミナー集客ファネル',
  '個別相談ファネル',
  '自社プロダクト販売ファネル',
  '無料プレゼント配布ファネル',
  'オンラインコンテンツ販売ファネル'
];

const PLAN_LEVELS = {
  'Starter': 1,
  'Pro': 2,
  'Platinum': 3
};

export default function TemplateList({
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  simulatedPlan = 'Pro'
}: TemplateListProps) {
  // Creator State
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FunnelType>('個別相談ファネル');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [expectedDuration, setExpectedDuration] = useState('');
  const [steps, setSteps] = useState<string[]>(['LPページ', 'サンクスページ']);

  // Editor State
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<FunnelType>('個別相談ファネル');
  const [editDescription, setEditDescription] = useState('');
  const [editAssignee, setEditAssignee] = useState('');
  const [editExpectedDuration, setEditExpectedDuration] = useState('');
  const [editSteps, setEditSteps] = useState<string[]>([]);

  // Steps Add/Remove Helper for Create Form
  const handleAddStepField = () => setSteps([...steps, '']);
  const handleRemoveStepField = (index: number) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, idx) => idx !== index));
  };
  const handleStepValueChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  // Steps Add/Remove Helper for Edit Form
  const handleAddEditStepField = () => setEditSteps([...editSteps, '']);
  const handleRemoveEditStepField = (index: number) => {
    if (editSteps.length <= 1) return;
    setEditSteps(editSteps.filter((_, idx) => idx !== index));
  };
  const handleEditStepValueChange = (index: number, val: string) => {
    const updated = [...editSteps];
    updated[index] = val;
    setEditSteps(updated);
  };

  // Submit handlers
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Filter out blank steps
    const filteredSteps = steps.map(s => s.trim()).filter(Boolean);
    if (filteredSteps.length === 0) {
      alert('少なくとも1つ以上のステップ名を入力してください。');
      return;
    }

    onAddTemplate({
      name: name.trim(),
      category,
      description: description.trim(),
      assignee: assignee.trim() || '未割り当て',
      expectedDuration: expectedDuration.trim() || '未設定',
      steps: filteredSteps
    });

    // Reset Form
    setName('');
    setCategory('個別相談ファネル');
    setDescription('');
    setAssignee('');
    setExpectedDuration('');
    setSteps(['LPページ', 'サンクスページ']);
    setIsAdding(false);
  };

  const handleEditClick = (template: Template) => {
    setEditingTemplate(template);
    setEditName(template.name);
    setEditCategory(template.category);
    setEditDescription(template.description);
    setEditAssignee(template.assignee || '');
    setEditExpectedDuration(template.expectedDuration || '');
    setEditSteps(template.steps || []);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    if (!editName.trim()) return;

    const filteredSteps = editSteps.map(s => s.trim()).filter(Boolean);
    if (filteredSteps.length === 0) {
      alert('少なくとも1つ以上のステップ名を入力してください。');
      return;
    }

    onUpdateTemplate({
      ...editingTemplate,
      name: editName.trim(),
      category: editCategory,
      description: editDescription.trim(),
      assignee: editAssignee.trim() || '未割り当て',
      expectedDuration: editExpectedDuration.trim() || '未設定',
      steps: filteredSteps,
      stepsCount: filteredSteps.length
    });

    setEditingTemplate(null);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (window.confirm(`「${name}」テンプレートを本当に削除してもよろしいですか？`)) {
      onDeleteTemplate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bento Standard Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-[#0f172a] text-white p-6 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest bg-slate-800 px-2.5 py-1 rounded-md">UTAGE TEMPLATES</span>
            <h2 className="text-2xl font-black tracking-tight mt-3">売上特化型ファネル テンプレート管理</h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-xl">
              成果実証済みの「顧客獲得〜決済自動化ルート」を標準データとして定義。
              独自の社内テンプレートを即座に作成・編集・削除することが可能になりました。
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-400 pt-3 border-t border-slate-800/80">
            <Compass className="h-4 w-4 text-indigo-500 animate-spin-slow" />
            <span>登録されたテンプレートは、新規案件作成時にロードさせ要件定義に利用可能です。</span>
          </div>
        </div>

        {/* Dynamic Highlight Stats Grid Box */}
        <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">TEMPLATE STATS</span>
            <h3 className="text-lg font-bold text-slate-800 mt-2">標準化とスピード構築</h3>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              あらかじめ担当者や期日の基本ベースをマッピングすることで、ディレクターへの引き継ぎが数秒で完了。
            </p>
          </div>
          <div className="flex justify-between items-center bg-white border border-slate-150 p-3 rounded-2xl mt-4">
            <span className="text-xs font-bold text-slate-500">標準テンプレート数</span>
            <span className="text-lg font-black text-indigo-600">{templates.length} 種類</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
        <span className="text-xs font-bold text-slate-500">テンプレート一覧と管理</span>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
            isAdding 
              ? 'bg-[#0f172a] text-white hover:bg-slate-800' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
          }`}
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{isAdding ? 'フォームを閉じる' : '新規テンプレートを作成'}</span>
        </button>
      </div>

      {/* Add New Template Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-800 border-l-3 border-indigo-600 pl-2">
            新しいファネルテンプレートの定義
          </h3>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">テンプレート名 (ファネル名)</label>
                <input
                  type="text"
                  placeholder="例: 【高CVR】LINE登録直後オンライン決済ルート"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">ファネル基本カテゴリ</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as FunnelType)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-semibold cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">標準担当者 (デフォルト)</label>
                <input
                  type="text"
                  placeholder="例: 佐藤 広務"
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">想定構築期間</label>
                <input
                  type="text"
                  placeholder="例: 3週間"
                  value={expectedDuration}
                  onChange={e => setExpectedDuration(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">ファネル設計概要・説明</label>
              <textarea
                rows={2}
                placeholder="このテンプレートに適合する業種や、構築のポイント、セールスフローについて簡潔に記述します。"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Dynamic steps entry list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500">
                  各ページステップ構成 (順序どおりに入力してください)
                </label>
                <button
                  type="button"
                  onClick={handleAddStepField}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3 w-3" />
                  <span>ステップを追加</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                {steps.map((stepVal, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-400 w-5 text-right">{idx + 1}.</span>
                    <input
                      type="text"
                      placeholder={`ステップ ${idx + 1} のページ名`}
                      value={stepVal}
                      onChange={e => handleStepValueChange(idx, e.target.value)}
                      className="flex-1 text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden font-bold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStepField(idx)}
                      disabled={steps.length <= 1}
                      className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Footer inside create container */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>テンプレートを作成</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Main Templates list Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => {
          const requiredPlanName = template.requiredPlan || 'Starter';
          const simPlanValue = PLAN_LEVELS[simulatedPlan] || 2;
          const reqPlanValue = PLAN_LEVELS[requiredPlanName as 'Starter' | 'Pro' | 'Platinum'] || 1;
          const isAllowed = simPlanValue >= reqPlanValue;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all relative ${
                isAllowed 
                  ? 'bg-white border-slate-200 hover:shadow-md' 
                  : 'bg-slate-50/70 border-slate-200/80 shadow-none'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider">
                      {template.category}
                    </span>
                    
                    {/* Plan Badge indicator */}
                    {isAllowed ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase ${
                        requiredPlanName === 'Platinum' 
                          ? 'bg-rose-50 text-rose-700 border-rose-150' 
                          : requiredPlanName === 'Pro' 
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-150' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-150'
                      }`}>
                        <Unlock className="h-2.5 w-2.5 text-current" />
                        <span>{requiredPlanName}設定解放済</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase bg-slate-100 text-slate-400 border-slate-200">
                        <Lock className="h-2.5 w-2.5 text-current" />
                        <span>{requiredPlanName}上位プラン</span>
                      </span>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditClick(template)}
                      className="p-1.5 bg-slate-50 border border-slate-200/50 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      title="編集"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(template.id, template.name)}
                      className="p-1.5 bg-slate-50 border border-slate-200/50 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="削除"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className={`text-base font-extrabold flex items-center gap-2 mt-4 mb-2 tracking-tight ${
                  isAllowed ? 'text-slate-900' : 'text-slate-400'
                }`}>
                  <Layers className={`h-4.5 w-4.5 flex-shrink-0 ${isAllowed ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{template.name}</span>
                </h3>

                <p className={`text-xs leading-relaxed mb-4 text-justify ${
                  isAllowed ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  {template.description}
                </p>

                {/* Template Meta Info (Assignee and expectedDuration) */}
                <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/80 font-bold">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <User className="h-3.5 w-3.5 text-indigo-400" />
                    <span>担当優先: <strong className="text-slate-800">{template.assignee || '未設定'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                    <span>想定工期: <strong className="text-slate-800">{template.expectedDuration || '未設定'}</strong></span>
                  </div>
                </div>

                {/* Steps visual list */}
                <div className={`space-y-2 p-4 rounded-2xl border mb-3 font-semibold ${
                  isAllowed 
                    ? 'bg-indigo-50/20 border-indigo-100/30' 
                    : 'bg-slate-100/40 border-slate-200/40'
                }`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-1 ${
                    isAllowed ? 'text-indigo-500' : 'text-slate-500'
                  }`}>
                    <Sparkles className="h-3 w-3 text-indigo-500" />
                    <span>実装必須ページ構成 ({template.steps?.length || 0}ステップ)</span>
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {template.steps && template.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
                        <div className={`h-4.5 w-4.5 rounded-full font-bold text-[9px] flex items-center justify-center shrink-0 border ${
                          isAllowed 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
                            : 'bg-slate-200 text-slate-500 border-slate-300'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className="text-slate-800 font-bold text-xs truncate">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Business Upsell callout box */}
                {!isAllowed && (
                  <div className="p-3 bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-100 rounded-2xl mb-4 text-xs font-bold text-amber-900 space-y-1 my-2">
                    <p className="flex items-center gap-1 text-rose-700 font-black">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>上位SaaSプラン専用配布テンプレート</span>
                    </p>
                    <p className="text-[10px] text-slate-600 leading-normal font-semibold">
                      このテンプレートを用いて自動構築を走らせるには、<strong>{requiredPlanName}</strong> プランへのご契約の更新が必要です。
                    </p>
                    <p className="text-[9px] text-indigo-650 leading-normal font-bold">
                      💡 右上のヘッダーコントロール「🧪 検証用契約プラン」を 【{requiredPlanName}】 に切り替えると、デモ構築を体験できます。
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer inside list item */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 mt-2">
                {isAllowed ? (
                  <button
                    type="button"
                    onClick={() => alert(`🚀 ファネル構築開始:\n成功テンプレート「${template.name}」に基づいて、LINE公式 / Stripe / UTAGE メンバーシップを自動連携＆プロビジョニングし、即時稼働可能なLPとステップ構成をインジェクションします！`)}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-lg text-xs cursor-pointer text-center flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10 transition-all font-semibold"
                  >
                    <span>🚀 この構成でファネルを自動構築する</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 bg-slate-200 text-slate-400 font-black rounded-lg text-xs cursor-not-allowed text-center flex items-center justify-center gap-1 border border-slate-300 font-semibold"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>🔑 {requiredPlanName} プラン以上で構築可能</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Template Modal Overlay */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">テンプレート構成の編集</h3>
              </div>
              <button
                onClick={() => setEditingTemplate(null)}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleEditSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">テンプレート名</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">カテゴリ</label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as FunnelType)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500 font-medium cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">標準担当者</label>
                  <input
                    type="text"
                    value={editAssignee}
                    onChange={e => setEditAssignee(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">想定工期</label>
                  <input
                    type="text"
                    value={editExpectedDuration}
                    onChange={e => setEditExpectedDuration(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">説明</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-800"
                />
              </div>

              {/* Steps Edit */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-500">ステップ構成一覧</label>
                  <button
                    type="button"
                    onClick={handleAddEditStepField}
                    className="text-[10px] text-indigo-650 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>ステップ追加</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                  {editSteps.map((stepVal, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-slate-400 w-5 text-right">{idx + 1}.</span>
                      <input
                        type="text"
                        value={stepVal}
                        onChange={e => handleEditStepValueChange(idx, e.target.value)}
                        className="flex-1 text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditStepField(idx)}
                        disabled={editSteps.length <= 1}
                        className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions Footer inside modal */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>変更を保存</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Standard UTAGE Features section */}
      <div className="bg-[#0f172a] text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
          <Lightbulb className="h-5 w-5 text-indigo-400 animate-bounce-slow" />
          UTAGEマキシマイズ構築の秘訣
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-300">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1.5 flex flex-col justify-between animate-pulse-slow">
            <strong className="text-indigo-350 block font-black border-b border-slate-800 pb-1 uppercase tracking-wider">1. 多段階 Stripe 決済連携</strong>
            <p className="text-[11px] text-slate-400">初期費用＋継続サブスクの組み合わせや、決済と連動させたオファー直後のワンクリック・アップセル機能で客単価を激増させます。</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1.5 flex flex-col justify-between">
            <strong className="text-indigo-350 block font-black border-b border-slate-800 pb-1 uppercase tracking-wider">2. LINE公式＆シナリオ配信</strong>
            <p className="text-[11px] text-slate-400">LINE友だち追加時に自動でユーザー情報を獲得し、ページ閲覧実績やイベント参加状況に応じた最適化ステップメールを配信します。</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1.5 flex flex-col justify-between">
            <strong className="text-indigo-350 block font-black border-b border-slate-800 pb-1 uppercase tracking-wider">3. エバーグリーン動画 ＆ タイマー</strong>
            <p className="text-[11px] text-slate-400">訪問時点に合わせて「あたかも今リアルタイムでオンラインセミナーが開催されているような仕組み」を再現し、購買意欲を最大限に高めます。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
