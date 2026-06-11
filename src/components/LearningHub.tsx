import React, { useState, useMemo, useEffect } from 'react';
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
  BookMarked,
  Heart,
  MessageSquare,
  Bookmark,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { WikiArticle } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface LearningHubProps {
  wikiArticles: WikiArticle[];
  setWikiArticles: React.Dispatch<React.SetStateAction<WikiArticle[]>>;
  simulatedPlan: 'Starter' | 'Pro' | 'Platinum';
  setSimulatedPlan?: React.Dispatch<React.SetStateAction<'Starter' | 'Pro' | 'Platinum'>>;
}

// Custom Note-style Hashtags mapping defined globally for static enrichment
const articleTags: Record<string, string[]> = {
  '1': ['#UTAGE構築', '#マーケティング', '#初心者向け', '#売上最大化'],
  '2': ['#ファネル設計', '#成約率アップ', '#LP改善', '#成約心理'],
  '3': ['#決済システム', '#Stripe設定', '#未決済対策', '#顧客サポート'],
  '4': ['#LINE公式', '#配信戦略', '#ステップ配信', '#LTV向上'],
  '5': ['#AIライティング', '#時間短縮', '#Gemini', '#プロンプト'],
  'default': ['#UTAGE', '#ノウハウ', '#ファネル構築', '#実践知見'],
};

// Generates distinct elegant visual header gradient matching article cover vibe
const getCoverGradient = (id: string) => {
  const coverClasses = [
    'from-rose-100 via-teal-50 to-indigo-100',
    'from-amber-100 via-orange-50 to-amber-200',
    'from-sky-100 via-indigo-50 to-pink-100',
    'from-emerald-100 via-teal-50 to-cyan-100',
    'from-purple-100 via-violet-50 to-fuchsia-100'
  ];
  const index = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % coverClasses.length;
  return coverClasses[index];
};

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
  const [showToc, setShowToc] = useState(true);

  // States for 'Suki' (Likes), mock storage
  const [likesState, setLikesState] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    // Scaffold initial like counts per ID for media reality
    const dict: Record<string, { count: number; liked: boolean }> = {};
    wikiArticles.forEach((art, idx) => {
      dict[art.id] = {
        count: 24 + (idx * 17) + (art.title.length * 2),
        liked: false
      };
    });
    return dict;
  });

  // Handle clicking "Suki" with heart bumper animation
  const handleLikeToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikesState(prev => {
      const current = prev[id] || { count: 32, liked: false };
      return {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked
        }
      };
    });
  };

  // Categories list
  const categories = ['全て', 'ファネル設計', 'UTAGE設定', 'LINE・配信', 'Stripe決済', 'AI活用', 'マーケティング知見'];

  // Plan level index for comparison
  const planWeights = {
    'Starter': 1,
    'Pro': 2,
    'Platinum': 3
  };

  // Force-select active article
  const activeArticle = useMemo(() => {
    return wikiArticles.find(a => a.id === selectedArticleId) || wikiArticles[0] || null;
  }, [wikiArticles, selectedArticleId]);

  // Read time & character calculations
  const textStats = useMemo(() => {
    if (!activeArticle) return { chars: 0, mins: 1 };
    const length = activeArticle.content.length + (activeArticle.excerpt?.length || 0);
    return {
      chars: length,
      mins: Math.max(1, Math.ceil(length / 500)) // 500 characters per minute reading pace
    };
  }, [activeArticle]);

  // Extract headings for Table of Contents
  const tableOfContents = useMemo(() => {
    if (!activeArticle) return [];
    const lines = activeArticle.content.split('\n');
    return lines
      .filter(line => line.startsWith('### ') || line.startsWith('#### '))
      .map((line, index) => {
        const isSub = line.startsWith('#### ');
        const text = line.replace(/### |#### /, '').trim();
        return { id: `toc-${index}`, text, isSub };
      });
  }, [activeArticle]);

  // Is accessible in the current mode
  const checkAccessibility = (article: WikiArticle) => {
    if (previewMode === 'public_guest') {
      return false; 
    } else {
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

  // Reset selected item if list updates or filters push active out of view
  const filteredArticles = useMemo(() => {
    return wikiArticles.filter(art => {
      const cleanSearch = searchQuery.trim().toLowerCase();
      
      const hashtags = articleTags[art.id] || articleTags['default'];
      const hasTagMatch = hashtags.some(t => t.toLowerCase().includes(cleanSearch));

      const matchSearch = 
        cleanSearch === '' ||
        art.title.toLowerCase().includes(cleanSearch) || 
        art.content.toLowerCase().includes(cleanSearch) || 
        (art.excerpt && art.excerpt.toLowerCase().includes(cleanSearch)) ||
        art.category.toLowerCase().includes(cleanSearch) || 
        hasTagMatch;
      
      const matchCategory = selectedCategory === '全て' || art.category === selectedCategory;
      
      return matchSearch && matchCategory;
    });
  }, [wikiArticles, searchQuery, selectedCategory]);

  // Auto focus first item on list update if selection not in filtered
  useEffect(() => {
    if (filteredArticles.length > 0) {
      const containsActive = filteredArticles.some(a => a.id === selectedArticleId);
      if (!containsActive) {
        setSelectedArticleId(filteredArticles[0].id);
      }
    }
  }, [filteredArticles, selectedArticleId]);

  // Custom Formatted rendering with note.com beautiful spacing
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        const headingText = line.replace('### ', '');
        return (
          <h3 
            key={idx} 
            className="text-[17px] font-black tracking-tight text-slate-900 mt-9 mb-4 pb-2 border-b border-rose-100 flex items-center gap-2.5 leading-normal"
            id={`heading-${headingText}`}
          >
            <span className="w-1.5 h-6 bg-rose-400 rounded-full" />
            {headingText}
          </h3>
        );
      }
      if (line.startsWith('#### ')) {
        const subHeadingText = line.replace('#### ', '');
        return (
          <h4 
            key={idx} 
            className="text-[13.5px] font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2 pl-1.5 border-l-2 border-indigo-400"
          >
            {subHeadingText}
          </h4>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const text = line.substring(2);
        const boldParts = text.split('**');
        return (
          <li key={idx} className="ml-5 pl-1 list-disc text-slate-700 text-xs leading-relaxed my-2.5 text-justify antialiased">
            {boldParts.map((part, pIdx) => {
              if (pIdx % 2 === 1) {
                return <strong key={pIdx} className="text-slate-950 font-bold border-b border-indigo-100 pb-0.5">{part}</strong>;
              }
              return part;
            })}
          </li>
        );
      }
      if (line.startsWith('```')) {
        return null;
      }

      // Inside a markdown script/code blocks check
      let backtickCount = 0;
      for (let i = 0; i < idx; i++) {
        if (lines[i].startsWith('```')) backtickCount++;
      }
      if (backtickCount % 2 === 1) {
        return (
          <div key={idx} className="bg-slate-900 text-teal-300 font-mono text-[11px] p-4 rounded-xl my-4 overflow-x-auto border border-slate-800 leading-relaxed shadow-3xs">
            {line}
          </div>
        );
      }

      if (line.trim() === '') return <div key={idx} className="h-4" />;

      const parts = line.split('**');
      return (
        <p key={idx} className="text-[12.5px] text-slate-750 leading-[2.1] text-justify font-normal my-3.5 antialiased tracking-wide">
          {parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return <strong key={pIdx} className="text-slate-950 font-extrabold bg-amber-50 px-1 py-0.5 rounded-sm">{part}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* 1. Header Banner - Elegant minimal Cover style */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 relative overflow-hidden shadow-2xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-100/30 to-teal-100/20 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
              <Sparkles className="h-3.5 w-3.5" />
              <span>本質マーケティング自習ハブ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              知見Wiki & 学習ナレッジベース
            </h2>
            <p className="text-slate-500 text-xs leading-relaxed max-w-2xl">
              「note」のような快適な読み心地で、UTAGEのプロが実践している本質的なノウハウを提供します。<br />
              一般公開のオープン講義と、契約プラン別メンバー限定のプレミアム記事に分けて自習学習が可能です。
            </p>
          </div>

          {/* Core Metrics */}
          <div className="shrink-0 bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 flex items-center gap-4">
            <div className="text-left">
              <span className="text-[10px] font-black text-slate-400 block tracking-wider">知見ストック数</span>
              <span className="text-xl font-mono font-black text-slate-800">{wikiArticles.length} <span className="text-[11px] font-sans font-medium text-slate-500">記事</span></span>
            </div>
            <div className="w-[1px] h-9 bg-slate-200" />
            <div className="text-left">
              <span className="text-[10px] font-black text-slate-400 block tracking-wider">シミュレーション契約</span>
              <span className="text-xs font-extrabold bg-slate-900 px-2 py-0.5 rounded-lg text-white font-mono block mt-1">{simulatedPlan}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Visibility & Simulation Switcher (Modern Flat Styling) */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-extrabold text-slate-500">閲覧権限の切替テスト:</span>
          <div className="bg-slate-200/70 p-0.5 rounded-xl border border-slate-300 flex items-center">
            <button
              onClick={() => setPreviewMode('logged_in')}
              className={`px-3 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'logged_in'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="h-3.5 w-3.5 text-indigo-600" />
              <span>会員（ログイン済）</span>
            </button>
            <button
              onClick={() => setPreviewMode('public_guest')}
              className={`px-3 py-1.5 rounded-lg font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewMode === 'public_guest'
                  ? 'bg-white text-rose-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-rose-500" />
              <span>一般公開（未ログイン）</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
          <span>
            {previewMode === 'logged_in' ? (
              <>擬似ログイン：現在、あなたのアカウント <strong>[{simulatedPlan}]</strong> 用のコンテンツがアクティブです。</>
            ) : (
              <>擬似ゲスト：非会員ステータス。プレミアム会員向けの独自ノウハウは「プレビュー（note有料風）」として表示されます。</>
            )}
          </span>
        </div>
      </div>

      {/* 3. Main Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (5 Cols) - note styled Article List Drawer */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Elegant Sidebar Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-3xs">
            
            {/* Search Input Custom Box */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="キーワード、または #ハッシュタグ で検索..."
                className="w-full text-xs font-bold rounded-xl border border-slate-250 bg-slate-50/50 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-650"
                >
                  クリア
                </button>
              )}
            </div>

            {/* Beautiful category list styled minimal style */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                <span>カテゴリ・タグから選ぶ</span>
              </label>
              
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-3xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100/80 border border-slate-200/60'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* List Section Title */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-extrabold text-slate-450 tracking-wide uppercase">
              ノウハウ記事一覧 ({filteredArticles.length}件)
            </span>
          </div>

          {/* Editorial Note-Style Scrollable Article List */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            <AnimatePresence mode="popLayout">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => {
                  const isActive = activeArticle?.id === art.id;
                  const isAccessible = checkAccessibility(art);
                  const hashtags = articleTags[art.id] || articleTags['default'];
                  
                  // Likes Count Simulation
                  const likesInfo = likesState[art.id] || { count: 35, liked: false };
                  
                  return (
                    <motion.div
                      key={art.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`rounded-2xl p-4.5 border text-left transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-gradient-to-br from-white to-slate-50/20 border-slate-800 shadow-sm ring-[1.5px] ring-slate-800'
                          : 'bg-white border-slate-200 hover:border-slate-350 hover:shadow-2xs'
                      }`}
                    >
                      {/* Top author & status block */}
                      <div className="flex items-center justify-between gap-2.5 mb-2.5">
                        
                        {/* Rounded Profile Avatar Icon */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800/20 flex items-center justify-center text-[10px] text-white font-bold tracking-tight">
                            {art.author.substring(0, 1)}
                          </div>
                          <div>
                            <span className="text-[11px] font-extrabold text-slate-700 block tracking-tight">
                              {art.author}
                            </span>
                          </div>
                        </div>

                        {/* Beautiful Note.com Lock/Unlock Indicator */}
                        <div className="shrink-0">
                          {previewMode === 'public_guest' ? (
                            <span className="bg-amber-50 text-amber-700 border border-amber-100/80 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                              <Lock className="h-2.5 w-2.5" />
                              <span>限定講義</span>
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${
                              isAccessible 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                                : 'bg-red-50 text-red-605 border border-red-105 animate-pulse'
                            }`}>
                              {isAccessible ? <Unlock className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
                              <span>
                                {art.requiredPlan}以上
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cover Photo simulation - subtle color pill */}
                      <div className="space-y-1.5 mb-2.5">
                        <span className="text-[10px] font-extrabold text-slate-400 tracking-wider">
                          {art.category}
                        </span>
                        <h4 className="font-black text-xs md:text-sm text-slate-905 leading-snug tracking-tight hover:text-rose-600 transition-colors">
                          {art.title}
                        </h4>
                      </div>

                      {/* Excerpt */}
                      <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 text-justify font-medium mb-3">
                        {art.excerpt}
                      </p>

                      {/* Hashtags display */}
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {hashtags.slice(0, 3).map((tag) => (
                          <span 
                            key={tag}
                            className="text-[10.5px] text-slate-450 hover:text-slate-800 transition-colors font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Note.com typical footer metrics */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2.5 border-t border-slate-100">
                        <span className="font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>読了目安 約{Math.max(1, Math.ceil((art.content.length || 200) / 450))}分</span>
                        </span>
                        
                        {/* Like micro-count in list */}
                        <button
                          type="button"
                          onClick={(e) => handleLikeToggle(art.id, e)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md transition-colors ${
                            likesInfo.liked ? 'text-rose-500 font-bold' : 'text-slate-400 hover:text-rose-400'
                          }`}
                        >
                          <Heart className={`h-3.5 w-3.5 ${likesInfo.liked ? 'fill-rose-500' : ''}`} />
                          <span className="font-mono">{likesInfo.count}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="bg-white rounded-3xl border border-slate-205 p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-black text-slate-800">条件に合う知見・講義が見つかりません</p>
                  <p className="text-[10px] text-slate-400">
                    検索キーワードのつづりを確認するか、他のカテゴリバッジを選択しなおしてください。
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column (7 Cols) - Detailed Modern Note Editorial Reader */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeArticle ? (
              <motion.article
                key={activeArticle.id + '-' + previewMode + '-' + simulatedPlan}
                initial={{ opacity: 0, scale: 0.99, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99, y: -5 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="bg-white rounded-3xl border border-slate-200/95 overflow-hidden shadow-xs text-left text-slate-800 flex flex-col min-h-[600px]"
              >
                
                {/* Note illustration cover placeholder at top */}
                <div className={`h-24 md:h-28 bg-gradient-to-r ${getCoverGradient(activeArticle.id)} opacity-85 relative flex items-end p-4 border-b border-slate-100`}>
                  <div className="absolute top-4 right-4 bg-white/85 backdrop-blur-xs text-[9px] font-black px-2 py-1 rounded-md text-slate-800 uppercase tracking-wider font-mono shadow-3xs">
                    {activeArticle.category}
                  </div>
                </div>

                {/* Primary Content Container */}
                <div className="p-6 md:p-8 space-y-6 flex-1">
                  
                  {/* Article main info metadata & reading level indicators */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      {/* Creator Round Logo avatar like note.com */}
                      <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800/20 flex items-center justify-center font-black text-xs text-white shadow-3xs">
                        {activeArticle.author.substring(0, 1)}
                      </div>
                      <div>
                        <span className="text-xs font-black text-slate-900 block">{activeArticle.author}</span>
                        <span className="text-[10.5px] text-slate-400 block tracking-tight">UTAGE公認プロフェッショナル</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-400 select-none">
                      <span className="font-mono flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{activeArticle.publishedAt}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>約{textStats.mins}分 ({textStats.chars}字)</span>
                      </span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <div className="space-y-4">
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-snug tracking-tight">
                      {activeArticle.title}
                    </h1>

                    {/* Rich Note Hashtags display layout */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(articleTags[activeArticle.id] || articleTags['default']).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSearchQuery(tag); // Instantly set filter to query and apply
                            // Move window scroll back to grid if on mobile
                            const elem = document.getElementById('mobile-sidebar-toggle');
                            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 text-[10.5px] font-semibold text-slate-650 px-2.5 py-1 rounded-full transition-all cursor-pointer border border-slate-150"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic parsed Table of Contents (note styled Accordion) */}
                  {tableOfContents.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
                      <button 
                        onClick={() => setShowToc(!showToc)}
                        className="w-full flex items-center justify-between font-black text-xs text-slate-850 focus:outline-none"
                      >
                        <span className="flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span>目次</span>
                        </span>
                        {showToc ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                      </button>

                      <AnimatePresence>
                        {showToc && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <nav className="space-y-1.5 pt-2 border-t border-slate-200/50">
                              {tableOfContents.map((el, i) => (
                                <button
                                  key={el.id}
                                  onClick={() => {
                                    // Smoothly scroll down or highlight heading on client side simulation
                                    const idString = `heading-${el.text}`;
                                    const targetElem = document.getElementById(idString);
                                    if (targetElem) {
                                      targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                      targetElem.className += " animate-pulse bg-yellow-50 text-indigo-950 px-1 py-0.5 rounded";
                                    } else {
                                      alert(`📌 見出し「${el.text}」のセクションへスクロール案内します。`);
                                    }
                                  }}
                                  className={`block text-left text-xs font-semibold w-full py-1 hover:text-rose-500 transition-colors ${
                                    el.isSub ? 'pl-4 text-slate-500' : 'text-slate-700'
                                  }`}
                                >
                                  {el.text}
                                </button>
                              ))}
                            </nav>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Editorial Lead Blockquote Summary */}
                  <div className="bg-slate-50 border-l-4 border-rose-400 rounded-r-xl p-4 text-[12px] leading-relaxed text-slate-650 text-justify font-medium">
                    <strong className="text-slate-900 font-bold block mb-1">💡 記事の要約ロードマップ:</strong> {activeArticle.excerpt}
                  </div>

                  {/* Body Content with Paywall and blurred elements */}
                  <div className="relative pt-2">
                    {checkAccessibility(activeArticle) ? (
                      <div className="space-y-4">
                        {renderFormattedContent(activeArticle.content)}

                        {/* Highly Interactive Support / Sync Button modeled like note.com Creator Support tool */}
                        <div className="mt-12 bg-rose-50/20 border border-slate-200 rounded-3xl p-6 text-center space-y-4">
                          <div className="max-w-md mx-auto space-y-2">
                            <strong className="text-slate-900 font-black text-sm flex items-center justify-center gap-1">
                              <Sparkles className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
                              <span>クリエイターとの実務・設定連動</span>
                            </strong>
                            <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">
                              この講義マニュアルに沿ったUTAGEシステム側のステップメール送信設定・LP構成・Stripe決済テンプレート群を、お使いのUTAGE Flow環境にワンクリックで即座に追加・適合できます。
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-sm mx-auto">
                            <button
                              type="button"
                              onClick={() => alert('🚀 同期成功: お使いのUTAGEアカウント（検証用環境）に「知見カスタム連動設定テンプレート」を転写完了しました！')}
                              className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] rounded-lg transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1.5"
                            >
                              <span>設定テンプレートを環境に自動インポート</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* Perfect visual blur mockup representing typical premium paywall cover on note.com */
                      <div className="relative">
                        {/* Static teaser lines that fade into complete blur */}
                        <div className="space-y-4 select-none pointer-events-none opacity-20 filter blur-xs">
                          <h3 className="text-sm font-black text-slate-900 mt-6 mb-2.5 pb-1 border-b border-slate-100">
                            ### 実務適用ステップ：自動連携の設計手順
                          </h3>
                          <p className="text-xs text-slate-650 leading-loose">
                            実際のマーケティング運用でこの数値を1ピクセル誤るだけで、コンバージョンファネル全体のトラッキング損失を引き起こす危険性があります。まずは、以下のパラメータ表に沿って変数を登録。
                          </p>
                          <p className="text-xs text-slate-650 leading-loose">
                            UTAGEシステムの「外部決済通知API(Webhooks)」に、以下のシークレットパスを設定することで、自動の顧客追跡バッチ処理が起動します。
                          </p>
                        </div>

                        {/* Fully custom note-style Paywall Cover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent flex flex-col items-center justify-end text-center p-4 pb-12 pt-16">
                          <div className="max-w-md w-full space-y-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-md relative -top-2">
                            
                            {/* Header Paywall indicators */}
                            <div className="space-y-2">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider">
                                👑 Premium 会員限定
                              </span>
                              <h3 className="text-sm md:text-base font-black text-slate-905 pt-1.5">
                                この続きは、対象プランのご契約後に読めます。
                              </h3>
                              <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                                こちらの記事には、具体的なUTAGEのURLパス設定、トラブルシューティング手法、および実践可能な決済回収プロトコルの詳細などの具体的な極秘知見が記述されています。
                              </p>
                            </div>

                            {/* Options to login or simulation upgrade within client panel */}
                            <div className="border-t border-b border-slate-100 py-4 my-2 text-left space-y-3">
                              
                              {/* Guest User Option Info */}
                              {previewMode === 'public_guest' ? (
                                <div className="space-y-2.5">
                                  <p className="text-[10.5px] text-slate-500 font-semibold leading-normal">
                                    一般の訪問ゲストさまは、模擬ログイン機能から「検証アカウント」としてメンバー表示に切り替えることですぐに自習画面をテストできます。
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setPreviewMode('logged_in')}
                                    className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-[11px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                                  >
                                    <span>👤 クライアントメンバーとして模擬ログイン</span>
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                /* Logged-in but deficient contract levels */
                                <div className="space-y-3">
                                  <div className="p-2.5 bg-rose-50/50 rounded-xl border border-rose-100 flex items-start gap-2 text-[10.5px]">
                                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-extrabold text-slate-800">契約レベルが不足しています</p>
                                      <p className="text-slate-500 text-[10px] leading-relaxed">
                                        この記事の閲覧には <strong className="text-rose-605">{activeArticle.requiredPlan}プラン以上の契約</strong> が必要です。<br />
                                        現在のご契約想定: <span className="font-bold text-slate-800 font-mono">[{simulatedPlan}]</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <p className="text-[9.5px] text-indigo-500 font-bold">💡 検証機能：お好みのテストプランに変更して、ロック解除をお試しできます</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['Pro', 'Platinum'].map((p) => {
                                        const isCurrent = simulatedPlan === p;
                                        return (
                                          <button
                                            key={p}
                                            type="button"
                                            onClick={() => {
                                              if (setSimulatedPlan) {
                                                setSimulatedPlan(p as any);
                                                alert(`💼 コントロール: 模擬検証プランを「${p}」に変更しました。即時にロック解除されます。`);
                                              }
                                            }}
                                            className={`py-1.5 px-2 border text-center font-extrabold text-[10px] rounded-lg cursor-pointer transition-all ${
                                              isCurrent 
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 text-indigo-750'
                                            }`}
                                          >
                                            {p}プランに即時切替
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <p className="text-[9px] text-slate-400 text-center font-medium">
                              「魅力的な導入文（要約）を一般公開し、会員になるとフル記事を読める。上位プランになると超濃密記事を段階開放する」という本格的な記事配信サブスク（note風）を高度にデモンストレーションしています。
                            </p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Note Share Footer Action line */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-10 text-slate-450 text-xs">
                    
                    {/* Bottom Like and Bookmark row */}
                    <div className="flex items-center gap-3">
                      {/* Interactive Heart (Suki) details button */}
                      <button
                        type="button"
                        onClick={(e) => handleLikeToggle(activeArticle.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-[11px] cursor-pointer ${
                          (likesState[activeArticle.id]?.liked)
                            ? 'bg-rose-50 text-rose-600 border-rose-200 font-extrabold'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${(likesState[activeArticle.id]?.liked) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                        <span>読者スキ {(likesState[activeArticle.id]?.count) || 32}</span>
                      </button>

                      {/* Share public link button standard */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(activeArticle.id)}
                        className={`text-[10.5px] font-bold px-3 py-1.5 rounded-full border flex items-center gap-1 cursor-pointer transition-all ${
                          copiedId === activeArticle.id
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {copiedId === activeArticle.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedId === activeArticle.id ? '一般等リンクコピー済' : '共有用にURLコピー'}</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      © {activeArticle.author}. All Rights Reserved.
                    </span>
                  </div>

                </div>
              </motion.article>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200/95 p-16 text-center space-y-4 min-h-[600px] flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h4 className="text-sm font-black text-slate-800">知見Wikiを選択してください</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  左側の一覧から気になるマーケティング講義をクリックしてください。美しい誌面レイアウトで内容が表示されます。
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
        
      </div>

    </div>
  );
}
