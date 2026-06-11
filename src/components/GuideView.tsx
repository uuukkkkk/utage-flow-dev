import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Chrome, 
  Settings, 
  FolderKanban, 
  Contact, 
  TrendingUp, 
  Workflow, 
  ChevronRight, 
  Terminal, 
  Code2, 
  Layers, 
  FileText, 
  ExternalLink,
  Smartphone,
  Check,
  Building
} from 'lucide-react';
import { motion } from 'motion/react';

export default function GuideView() {
  const [activeSection, setActiveSection] = useState<'intro' | 'features' | 'google' | 'ai' | 'architecture'>('intro');

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' }
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-rose-50/40 via-white to-indigo-50/55 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xs border border-slate-200/90">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-150/15 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-650 text-[10.5px] font-black shadow-3xs">
              <BookOpen className="h-3.5 w-3.5" />
              <span>システム公式取扱マニュアル</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">UTAGE Flow 使い方ガイド & 設計規定書</h2>
            <p className="text-slate-500 text-xs md:text-sm max-w-xl font-medium leading-relaxed">
              本システムは、UTAGEシステム構築プロフェッショナルのためのワークスペース管理ハブです。高度なタスク管理、Google社システム連携、Gemini AIコピーライターを統合した生産性プラットフォームです。
            </p>
          </div>
          <div className="shrink-0 bg-white/80 border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-3xs">
            <div className="w-10 h-10 bg-gradient-to-tr from-rose-500 to-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-xs">U</div>
            <div>
              <p className="text-xs font-black text-slate-800">UTAGE Flow</p>
              <p className="text-[10px] text-slate-400 font-bold block mt-0.5">Version 1.0.0 (Latest)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar inside the Guide */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <p className="text-[9px] font-black text-slate-400 tracking-wider uppercase px-2 mb-3">目次 / 各コンテンツ選択</p>
            {[
              { id: 'intro', label: '1. 初めに見るマニュアル', icon: HelpCircle },
              { id: 'features', label: '2. 案件管理・ステップ管理', icon: FolderKanban },
              { id: 'google', label: '3. Google社システムとの同期', icon: Chrome },
              { id: 'ai', label: '4. Gemini AIでの原稿生成', icon: Sparkles },
              { id: 'architecture', label: '5. 技術設計・データ構造', icon: Code2 }
            ].map((section) => {
              const Icon = section.icon;
              const isSelected = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-600/10 text-indigo-700 border border-indigo-500/20 font-bold' 
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{section.label}</span>
                  </div>
                  <ChevronRight className={`h-3 w-3 shrink-0 opacity-40 transition-transform ${isSelected ? 'translate-x-0.5 opacity-80' : ''}`} />
                </button>
              );
            })}
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-indigo-400" />
              <span className="text-xs font-black tracking-wider text-slate-350">システム本番同期ステータス</span>
            </div>
            <div className="space-y-2 text-[10px] text-slate-400">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span>API Gateway:</span>
                <span className="text-emerald-400 font-mono font-bold">ONLINE (3000)</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span>Database engine:</span>
                <span className="text-slate-205 font-mono">React memory-state</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Google OAuth Status:</span>
                <span className="text-indigo-400 font-mono font-bold">SANDBOX_ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="lg:col-span-9 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs min-h-[500px]">
          <motion.div
            key={activeSection}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {activeSection === 'intro' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-black text-slate-800">1. 初めに見るマニュアル (クイックスタート)</h3>
                  <p className="text-slate-450 text-xs mt-1">本システムをスムーズに業務で活用するための最速手順について説明します。</p>
                </div>

                <p className="text-xs text-slate-650 leading-relaxed">
                  <strong>UTAGE Flow</strong>は、UTAGE（旧ファネルシステム）構築において、顧客の「要望・決定ログ」、各「ファネルステップの開発・進行進捗」、および「Googleカレンダーやチャット、Google Drive、Gmailの一元モニタリング」を集約させた、<strong>日本初の実用構築ハブ</strong>です。
                </p>

                <div className="bg-slate-5 font-bold p-4.5 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <p className="text-slate-800 text-xs font-black">🌟 主要な操作ルート</p>
                  <ul className="list-disc pl-4 mt-2 space-y-1.5 font-medium text-slate-600">
                    <li><strong className="text-slate-850">プロジェクト全体の俯瞰：</strong> 「プロジェクト管理」画面で進行度や要件の全体像をチェック。ドラッグ＆ドロップで次のフェーズに瞬時に変更可能。</li>
                    <li><strong className="text-slate-850">案件詳細（各ステップの決定・メモ）：</strong> 左側メインメニューの「案件詳細ワークスペース」を開き、顧客名やファネルを選択。そこでマイルストーンごとの詳細担当（assignee）や期日の調整、顧客との対談録を履歴として追記保存できます。</li>
                    <li><strong className="text-slate-850">AI文言作成・コピーライティング：</strong> Gemini APIを使った強力ライターを搭載。決定済ステップをクリックするだけで、成約率を最大化する「キャッチコピー・サブコピー・CTA文言・配信ステップメール」を即時生成し、メモ欄へ1クリックでインポート可能です。</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-start gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <strong className="text-slate-800 text-xs block">案件を新規追加したい</strong>
                      <p className="text-slate-500 text-[11px] leading-relaxed">「プロジェクト管理」画面の右上「＋ 新規プロジェクトの登録」ボタンから、顧客情報・ファネル形式を選択して登録を開始します。</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex items-start gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <strong className="text-slate-800 text-xs block">原稿案を瞬時に作成したい</strong>
                      <p className="text-slate-500 text-[11px] leading-relaxed">詳細は「案件詳細ワークスペース」の “AI原稿” タブから作成。生成された原稿をワンクリックでメモに転写し、スムーズに構築者へ伝達可能です。</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'features' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-black text-slate-800">2. 案件管理・ステップ管理マニュアル</h3>
                  <p className="text-slate-450 text-xs mt-1">案件状態(Kanban)の遷移規則と、マイルストーン(Funnel Step)の進捗更新に関する運用規約です。</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-indigo-505" />
                      1. Kanbanカンバンの利用ルール
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed pl-6">
                      プロジェクト管理は、「原稿執筆中」「クライアント確認中」「UTAGE実装中」「テスト運用中」「本番稼働中」の5フェーズに分類されます。
                      各フェーズは<strong>ドラッグ＆ドロップ</strong>で自動で契約要件の適合やステータスの書き換えが行われ、自動的にタイムライン（更新ログ）に履歴が同期されます。
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-indigo-505" />
                      2. ファネルタスク(Funnel Steps)のパーセンテージ連動
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed pl-6">
                      「案件詳細ワークスペース」の「構築タスクステップ」タブにおいて、各ステップ（例: LP、入力フォーム、テスト決済、確認メール）ごとに担当者や期日を設定できます。
                      それぞれの状況切り替え（<strong>「未着手 / 制作中 / 確認中 / 完了」</strong>）を変更することによって、<strong>総合進捗率（%）がリアルタイムに加重平均算定され、プロジェクト全体進捗として反映</strong>されます。
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-indigo-505" />
                      3. 要望・決定事項ログの追記
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed pl-6">
                      クライアントからの細かな要請事項（「銀行振込のメッセージも付けたい」「フォームの項目に電話番号必須を追加」など）は、「追加要望・決定ログ」タブから手動でいつ、誰が書き込んだかを保存可能。これによりディレクター交代時にも齟齬なく構築を引き継ぐことができます。
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-indigo-505" />
                      4. 複数タスク一括操作アクションバーの活用
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed pl-6">
                      マイルストーン進行タスク一覧の各タスクに設置された<strong>チェックボックス</strong>を選択すると、画面上部にスマートなフローティングアクションバーが出現します。
                      「選択したタスク全員を一斉に <strong>田中(コーダー)</strong> に変更する」や、「進行状況をすべて <strong>制作中</strong> または <strong>完了</strong> に倒す」といった一斉書き換え処理が1タップで完了。大幅なアサイン作業コストを削減します。
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4.5 w-4.5 text-indigo-505" />
                      5. デイリー自動バックアップ & 災害復旧 (DR対策)
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed pl-6">
                      <strong>「システム設定」</strong>のバックアップ保管庫より、指定の深夜等にシステムの状態全体を暗号圧縮アーカイブに自動エクスポートするスケジュール機能が作動。
                      さらに「現在データのJSONエクスポート」および、退避アーカイブ/外部JSONから1秒で前進捗状態を完全にリストア・ロールバック可能な「JSON復元インポート機能」を搭載しており、万が一の誤操作や障害にも万全です。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'google' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-black text-slate-800">3. Google Workspace 仮想統合マニュアル</h3>
                  <p className="text-slate-450 text-xs mt-1">Google Chat、Gmail、Google ドライブ、カレンダー連携の統合運用マニュアルです。</p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-650 leading-relaxed">
                    本プラットフォームは、日々クライアントと行き交うGoogle ecosystemの各種連絡・資料共有・期日取り決めを一括同期監視します。
                  </p>

                  <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-4.5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-white font-mono flex items-center justify-center text-[10px] font-black">C</span>
                        <strong className="text-slate-800 text-xs">A. Google Chat & Gmail 同期配信・返答機能</strong>
                      </div>
                      <p className="text-slate-600 text-xs font-medium pl-7 leading-relaxed">
                        「Google連携チャット」タブでは、お客様がGoogle Chat用共有スペースやGmailへ書き込んだ履歴を時系列でモニタリングできます。
                        画面一番下の返信入力ボックスにメッセージを入力し、[送信]を行うことで、<strong>自動的に顧客のGoogle Workspace環境(外部チャット)にAPIを介して内容を伝達送信すると同時に、案件タイムラインに決定証拠としての議事履歴が自動生成(Synced)</strong> されます。
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-mono flex items-center justify-center text-[10px] font-black">S</span>
                        <strong className="text-slate-800 text-xs">B. Calendar / Drive インテグレーション完了ルール</strong>
                      </div>
                      <p className="text-slate-600 text-xs font-medium pl-7 leading-relaxed">
                        「カレンダーと同期する」を実行すると、本プロジェクトの「目標期日 (Target Date)」および各ファネルタスクに紐づいた締切目安が自動的にクライアント共有スケジュールへ登録追加されます。
                        また、ドライブエクスプローラを活用することで、顧客がドライブにアップロードしたLP用原稿(*.docx)やファーストビュー画像(*.png)をそのまま本システムから直接監視できます。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-black text-slate-800">4. Gemini AIでの原稿生成 (構成ライティング)</h3>
                  <p className="text-slate-450 text-xs mt-1">成約率を最大化するAI構成文案作成エンジン (Google Geunine AI API) の機能運用方法です。</p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-650 leading-relaxed">
                    UTAGE Flowに標準搭載されている「AI原稿生成」は、<strong>Googleの革新的大規模言語モデル「Gemini」</strong> をバックエンド側に直結(Secure Proxy)させることで実現。クライアントのビジネス特性(教育、ヨガ、店舗、EC等)・ファネル形式に適した強力な各種成約用テキストを全自動創出します。
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-1.5">
                      <strong className="text-indigo-900 font-extrabold text-xs block">🎯 生成される原稿内容</strong>
                      <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-1">
                        <li><strong>キャッチコピーコピー：</strong> ファーストビューで一瞬で惹きつけるコピー案</li>
                        <li><strong>サブヘッダーコピー：</strong> ニーズを深化し行動をそっと促す補助コピー</li>
                        <li><strong>アクションCTA文言：</strong> クリック率を高める具体的なボタン内テキスト例</li>
                        <li><strong>ステップ配信/完了メール案：</strong> オプトイン後、自動的に配信される感動体験用メッセージ構成一式 (件名および詳細本文)</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-2 text-xs">
                      <strong className="text-indigo-900 font-extrabold text-xs block">🔗 メモへの自動インポート（1クリック）</strong>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        生成結果の右下にある「📝 構築メモに転記インポートする」をクリックすると、左側のプロジェクト定義の「ディレクター申し送りメモ欄（Notes）」へ構造化された状態で自動的にマージ格納されます。
                        これにより、実装エンジニアが即座に原稿を解釈し、UTAGE編集画面へ移植できるようになります。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'architecture' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-black text-slate-800">5. 技術設計・データ構造・GitHub管理規定</h3>
                  <p className="text-slate-450 text-xs mt-1">開発・保守担当者が本リポジトリ全体を解釈するためのモジュール・データ型定義です。</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <strong className="text-slate-800 text-xs block">A. 主要データモデル定義 (src/types.tsより)</strong>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[10px] font-mono leading-relaxed text-slate-700 whitespace-pre-wrap">
{`export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  funnelType: FunnelType;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  targetDate: string;
  revenue?: string;
  description: string;
  notes?: string;
  funnelSteps?: FunnelStep[];
  historyLogs?: ProjectHistoryLog[];
}`}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                      <strong className="text-slate-800 text-xs font-black">🛠️ システム主要技術構成</strong>
                      <p className="text-[11px] leading-relaxed mt-1">
                        ・<strong>フロントエンド：</strong> React 18, Vite, TypeSafe Typescript, Tailwind CSS, lucide-react<br />
                        ・<strong>アニメーション：</strong> motion (import from 'motion/react' による直感的なモビリティ)<br />
                        ・<strong>API連携層：</strong> Node.js Express サーバー (`/api/generate-funnel-helper`) を介して Gemini 呼出。APIキー (GEMINI_API_KEY) やセンシティブなトークンの流出をブロック
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
                      <strong className="text-slate-800 text-xs font-black">📦 GitHubへの管理・コミット規則</strong>
                      <p className="text-[11px] leading-relaxed mt-1">
                        本リポジトリをGitHub等のバージョン管理へコミットする際は、不要なビルド生成物 (`dist/`, `node_modules/`, および `.env` 本番ファイル) は必ず `.gitignore` により除外された状態であることを確認してください。<br />
                        APIの拡張や、新たなファネル形式 (`FunnelType`) を足す際は、`src/types.ts` および `src/data/mockData.ts` を同期更新してください。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
