import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Layers, 
  Lock, 
  Unlock, 
  Eye, 
  Globe, 
  Copy, 
  Check, 
  ArrowRight, 
  User, 
  Calendar, 
  Flame, 
  Share2, 
  Clock, 
  Filter, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { WikiArticle } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LearningHubProps {
  wikiArticles: WikiArticle[];
  setWikiArticles: React.Dispatch<React.SetStateAction<WikiArticle[]>>;
  simulatedPlan: 'Starter' | 'Pro' | 'Platinum';
  setSimulatedPlan?: React.Dispatch<React.SetStateAction<'Starter' | 'Pro' | 'Platinum'>>;
}

export default function LearningHub({ 
  wikiArticles = [], 
  setWikiArticles, 
  simulatedPlan = 'Pro',
  setSimulatedPlan
}: LearningHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全て');
  const [selectedArticleId, setSelectedArticleId] = useState<string>(wikiArticles[0]?.id || '');
  const [previewMode, setPreviewMode] = useState<'logged_in' | 'public_guest'>('logged_in');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Categories list
  const categories = ['全て', 'ファネル設計', 'UTAGE設定', 'LINE・配信', 'Stripe決済', 'AI活用', 'マーケティング知見'];

  // Plan level index for comparison
  const planWeights = {
    'Starter': 1,
    'Pro': 2,
    'Platinum': 3
  };

  // Handle article selection
  const activeArticle = useMemo(() => {
    return wikiArticles.find(a => a.id === selectedArticleId) || wikiArticles[0] || null;
  }, [wikiArticles, selectedArticleId]);

  // Is accessible in the current mode
  const checkAccessibility = (article: WikiArticle) => {
    if (previewMode === 'public_guest') {
      // In guest mode, let's treat 'Starter' required plan as the base member level.
      // E.g. Articles requiring any plan (Starter, Pro, Platinum) are member-only, hence locked for anonymous guests.
      // If of high quality, anonymous guests can see excerpts but not full bodies.
      // We assume Starter/Pro/Platinum are all member-restricted.
      return false; 
    } else {
      // Logged-in mode
      const userWeight = planWeights[simulatedPlan] || 2;
      const articleWeight = planWeights[article.requiredPlan || 'Starter'];
      return userWeight >= articleWeight;
    }
  };

  // Copy shareable link simulation
  const handleCopyLink = (id: string) => {
    const fakeUrl = `https://utagehub.com/pub/knowledge/${id}`;
    navigator.clipboard.writeText(fakeUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return wikiArticles.filter(art => {
      const matchSearch = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (art.excerpt && art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchCategory = selectedCategory === '全て' || art.category === selectedCategory;
      
      return matchSearch && matchCategory;
    });
  }, [wikiArticles, searchQuery, selectedCategory]);

  // Quick helper to render a light markdown style text block nicely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm font-black text-slate-900 mt-6 mb-2.5 pb-1 border-b border-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-indigo-500 rounded-xs inline-block" />
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h4 key={idx} className="text-xs font-extrabold text-slate-800 mt-4 mb-2 flex items-center gap-1">
            <span className="w-1 h-3 bg-teal-500 rounded-xs inline-block" />
            {line.replace('#### ', '')}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.substring(2);
        // Highlight bold texts within list item
        const boldParts = text.split('**');
        return (
          <li key={idx} className="ml-4 pl-1 list-disc text-slate-650 text-xs my-1 text-justify leading-relaxed">
            {boldParts.map((part, pIdx) => {
              if (pIdx % 2 === 1) {
                return <strong key={pIdx} className="text-slate-900 font-bold">{part}</strong>;
              }
              return part;
            })}
          </li>
        );
      }
      if (line.startsWith('```')) {
        if (line.trim() === '```') return null; // closing backticks
        return null; // Handle code blocks with pre-wrap representation instead of multi-rendering
      }

      // Check if it's inside a code block sequence
      let isCodeBlock = false;
      // Look backward to count backticks
      let backtickCount = 0;
      for (let i = 0; i < idx; i++) {
        if (lines[i].startsWith('```')) backtickCount++;
      }
      if (backtickCount % 2 === 1) {
        return (
          <div key={idx} className="bg-slate-900 text-slate-300 font-mono text-[10.5px] p-3 rounded-xl my-1 overflow-x-auto border border-slate-800 leading-relaxed max-w-full">
            {line}
          </div>
        );
      }

      if (line.trim() === '') return <div key={idx} className="h-2" />;

      // Normal text lines with potential bold triggers
      const parts = line.split('**');
      return (
        <p key={idx} className="text-slate-650 text-xs leading-relaxed text-justify my-1.5 font-medium">
          {parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx} className="text-slate-900 font-bold">{part}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-sm border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <BookMarked className="h-3.5 w-3.5" />
              <span>学習ナレッジ・知見Wikiポータル</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <span>学習・知見ナレッジベース</span>
            </h2>
            <p className="text-slate-400 text-xs max-w-2xl">
              ファネル設計ノウハウから、UTAGEの設定細部、Stripe滞納回収、LINEステップの配信攻略まで。
              管理者が発信する最新の実証済みマーケティング知見を一元閲覧・自習できるハブです。
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">総配信ノウハウ</span>
              <span className="text-lg font-black text-indigo-300 font-mono">{wikiArticles.length} <span className="text-xs text-white">記事</span></span>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">自習可能レベル</span>
              <span className="text-xs font-black bg-indigo-600 px-2 py-0.5 rounded text-white">{simulatedPlan} 会員</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls Segment (Public/Guest Visibility Switcher) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Toggle Mode: Logged-in view simulation vs General Public guest simulation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-500">閲覧シミュレーター:</span>
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 flex items-center">
            <button
              onClick={() => setPreviewMode('logged_in')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'logged_in'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="h-3.5 w-3.5 text-indigo-505" />
              <span>ログイン会員表示</span>
            </button>
            <button
              onClick={() => setPreviewMode('public_guest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'public_guest'
                  ? 'bg-white text-teal-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-teal-650" />
              <span>一般公開（ゲスト表示）</span>
            </button>
          </div>
        </div>

        {/* Info label based on state */}
        <div className="text-[11px] leading-relaxed text-slate-500 max-w-sm flex items-start gap-1.5">
          <AlertCircle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <span>
            {previewMode === 'logged_in' ? (
              <>管理者 console でアサインした <strong>{simulatedPlan} 契約プラン</strong> として見れる内容を表示しています。他契約用はロック表示。</>
            ) : (
              <>ログインしていない<strong>一般訪問者（非契約ゲスト）</strong>が見られる公開範囲です。有料ノウハウは閲覧制限が自動適用されます。</>
            )}
          </span>
        </div>
      </div>

      {/* 3. Main Filter & Search Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Article Navigation Drawer Block (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Filtering Widgets */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-3xs">
            
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="知見・キーワードを検索..."
                className="w-full text-xs font-bold rounded-xl border border-slate-250 bg-slate-50/50 pl-10 pr-4 py-2.5 text-slate-850 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Category horizontal badges */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1">
                <Layers className="h-3.5 w-3.5" />
                <span>カテゴリ別絞り込み</span>
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        isActive
                          ? 'bg-indigo-650 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-150'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Article List Stack */}
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => {
                  const isActive = activeArticle?.id === art.id;
                  const isAccessible = checkAccessibility(art);
                  
                  return (
                    <motion.div
                      key={art.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`rounded-2xl p-4 border transition-all cursor-pointer text-left space-y-2 ${
                        isActive
                          ? 'bg-indigo-50/70 border-indigo-300 shadow-sm ring-1 ring-indigo-300/40'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-3xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="bg-slate-100 text-slate-700 text-[9px] font-black rounded-md px-2 py-0.5 border border-slate-200">
                          {art.category}
                        </span>

                        {/* Lock / Unlock Badges */}
                        <div className="flex items-center gap-1 shrink-0">
                          {previewMode === 'public_guest' ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded text-[8px] font-black flex items-center gap-0.5">
                              <Lock className="h-2 w-2" />
                              <span>ログイン限定</span>
                            </span>
                          ) : (
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black flex items-center gap-0.5 ${
                              isAccessible 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                : 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                            }`}>
                              {isAccessible ? <Unlock className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                              <span>
                                {art.requiredPlan}以上
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug">
                        {art.title}
                      </h4>

                      <p className="text-slate-500 text-[11px] leading-relaxed text-justify line-clamp-2">
                        {art.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                        <span className="font-semibold">寄稿: {art.author}</span>
                        <span className="font-mono">{art.publishedAt}</span>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-black text-slate-800">一致する知見・ナレッジがありません。</p>
                  <p className="text-[10px] text-slate-400">検索フィルターの文字を消すか、他のカテゴリを試してください。</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Detailed Reader Workspace Display (7 Cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeArticle ? (
              <motion.div
                key={activeArticle.id + '-' + previewMode + '-' + simulatedPlan}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-3xl border border-slate-200/95 p-6 shadow-xs space-y-5 text-left relative min-h-[500px]"
              >
                {/* Ribbon Category & Operations Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-50 text-indigo-800 border border-indigo-150 rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase">
                      {activeArticle.category}
                    </span>
                    <span className="text-slate-400 text-xs">/</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{activeArticle.publishedAt} 公開</span>
                    </span>
                  </div>

                  {/* Share public simulation button */}
                  <div className="flex items-center gap-1.5 shrink-0 select-none">
                    <button
                      onClick={() => handleCopyLink(activeArticle.id)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-all ${
                        copiedId === activeArticle.id
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {copiedId === activeArticle.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === activeArticle.id ? 'コピー完了' : '一般公開用リンクを共有'}</span>
                    </button>
                  </div>
                </div>

                {/* Article Header Title */}
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-black text-slate-900 leading-snug">
                    {activeArticle.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <span>著者: {activeArticle.author}</span>
                  </div>
                </div>

                {/* Excerpt Lead summary */}
                <div className="bg-slate-50 border-l-4 border-indigo-500 rounded-xl p-4 text-[11.5px] leading-relaxed text-slate-600 text-justify font-medium">
                  <strong>💡 要約ロードマップ:</strong> {activeArticle.excerpt}
                </div>

                {/* Article Body Content with Auth Constraint Evaluation */}
                <div className="relative pt-2">
                  {checkAccessibility(activeArticle) ? (
                    <div className="space-y-3 prose max-w-none text-slate-700">
                      {renderFormattedContent(activeArticle.content)}

                      {/* Cool interaction helper to simulation apply to marketing */}
                      <div className="mt-8 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="space-y-1 text-left">
                          <strong className="text-indigo-950 font-black text-xs flex items-center gap-1">
                            <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
                            <span>UTAGEでの設定・実践に移しますか？</span>
                          </strong>
                          <p className="text-slate-500 text-[10px] font-semibold leading-normal">
                            このマーケティング知見に沿ったLP・自動ステップ・決済設定テンプレートを、自身の案件環境に自動転写できます。
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert('🚀 同期成功: お使いのUTAGE構築環境へ、知見に基づいた「カスタム連動設定」をマージ適用しました。')}
                          className="px-3.5 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-[10.5px] rounded-lg cursor-pointer transition-all shadow-xs flex items-center gap-1 shrink-0"
                        >
                          <span>設定マニュアル案をUTAGEに自動連携</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Lockout paywall / anonymous guest visual blur screen */
                    <div className="relative">
                      {/* Teaser content snippet slightly visible to trigger user's appetite */}
                      <div className="space-y-3 select-none pointer-events-none opacity-30 filter blur-xs">
                        <h4 className="text-sm font-black text-slate-900 mt-6 mb-2.5 pb-1 border-b border-slate-100">
                          ### 施策：ドリップコンテンツ適用レシピ
                        </h4>
                        <p className="text-xs text-slate-650 text-justify leading-relaxed">
                          この手順を行うことで、サロン継続離脱率をこれまでの実績データから40%以上カットさせることに成功しました。
                        </p>
                        <p className="text-xs text-slate-650 text-justify leading-relaxed">
                          1. まずUTAGEの管理画面へログイン。
                          2. 対象の会員制コース編集画面へと移行して、「段階公開/ドリップ」のスケジュールルールを「会員追加時からの経過日数」アサインします。
                        </p>
                      </div>

                      {/* Paywall Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-center text-center p-6 pt-10">
                        <div className="max-w-sm space-y-4 bg-white/95 border border-slate-250 rounded-2xl p-5 shadow-lg relative -top-3">
                          <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto border border-rose-100 shadow-3xs">
                            <Lock className="h-5 w-5" />
                          </div>
                          
                          {previewMode === 'public_guest' ? (
                            <div className="space-y-1.5">
                              <h4 className="text-xs font-black text-slate-900 flex items-center justify-center gap-1">
                                <span>🔒 契約ユーザー(ログイン)限定ノウハウ</span>
                              </h4>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                こちらの記事は「{activeArticle.requiredPlan}プラン」以上ご契約のアカウント会員限定コンテンツです。
                                一般の訪問者（ゲスト）は閲覧できません。
                              </p>
                              <div className="pt-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewMode('logged_in')}
                                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                                >
                                  <span>👤 simulated メンバーとしてログイン</span>
                                  <ArrowRight className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <h4 className="text-xs font-black text-slate-900 flex items-center justify-center gap-1">
                                <span>🔒 ライセンス不足によるロック中</span>
                              </h4>
                              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                                この知見記事は <strong className="text-rose-600 font-bold">{activeArticle.requiredPlan}限定ノウハウ</strong> です。<br />
                                あなたのアカウント契約プラン（模擬ステータス: <span className="text-slate-800 font-extrabold">[{simulatedPlan}]</span>）では権限がありません。
                              </p>
                              
                              <div className="pt-2 space-y-1.5">
                                <p className="text-[9px] text-indigo-500 font-bold">💡 下記から模擬アカウントをアップグレードしてテストできます</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {['Pro', 'Platinum'].map((p) => (
                                    <button
                                      key={p}
                                      type="button"
                                      onClick={() => {
                                        if (setSimulatedPlan) {
                                          setSimulatedPlan(p as any);
                                          alert(`💼 コントロール: 模擬プランを「${p}」に変更しました。即時にロック解除されます。`);
                                        }
                                      }}
                                      className="py-1 px-2 border border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-750 font-extrabold text-[9px] rounded cursor-pointer transition-all"
                                    >
                                      {p}プランに切り替え
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="text-[9.5px] text-slate-400 font-semibold border-t border-slate-100 pt-2 flex items-center justify-center gap-1">
                            <span>「自社サイトでノウハウを一般公開し、会員だけが読めるようにしたい」というご要望の挙動シミュレーションです。</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3 min-h-[500px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-black text-slate-800">ノウハウを選択してください</h4>
                <p className="text-xs text-slate-400 max-w-xs">
                  左側の一覧から知見Wiki記事を選択すると、こちらに内容と公開ステータス詳細が表示されます。
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
        
      </div>

    </div>
  );
}
