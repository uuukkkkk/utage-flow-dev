import React, { useState } from 'react';
import { 
  Crown, 
  Building, 
  Users, 
  Database, 
  ShieldAlert, 
  Key, 
  Globe, 
  Plus, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Bell,
  Settings,
  RefreshCw,
  Search,
  Check,
  Smartphone,
  BookOpen,
  Workflow,
  Lock,
  Unlock,
  Eye,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Template, WikiArticle, FunnelType } from '../types';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  plan: 'Starter' | 'Pro' | 'Platinum';
  status: 'active' | 'trial' | 'expired';
  revenue: number;
  joinedAt: string;
  mcpDomain: string;
  projectsCount: number;
}

interface AdminConsoleProps {
  hostMode: 'internal' | 'saas';
  setHostMode: (mode: 'internal' | 'saas') => void;
  isSetupCompleted: boolean;
  setIsSetupCompleted: (completed: boolean) => void;
  templates?: Template[];
  setTemplates?: React.Dispatch<React.SetStateAction<Template[]>>;
  wikiArticles?: WikiArticle[];
  setWikiArticles?: React.Dispatch<React.SetStateAction<WikiArticle[]>>;
  simulatedPlan?: 'Starter' | 'Pro' | 'Platinum';
  setSimulatedPlan?: React.Dispatch<React.SetStateAction<'Starter' | 'Pro' | 'Platinum'>>;
}

export default function AdminConsole({ 
  hostMode, 
  setHostMode, 
  isSetupCompleted, 
  setIsSetupCompleted,
  templates = [],
  setTemplates = () => {},
  wikiArticles = [],
  setWikiArticles = () => {},
  simulatedPlan = 'Pro',
  setSimulatedPlan = () => {}
}: AdminConsoleProps) {
  // SaaS simulated data
  const [tenants, setTenants] = useState<Tenant[]>([
    { id: 'tn-1', name: '株式会社アルファマーケティング', subdomain: 'alpha', plan: 'Platinum', status: 'active', revenue: 29800, joinedAt: '2026-04-12', mcpDomain: 'https://alpha.utage-system.com/api', projectsCount: 12 },
    { id: 'tn-2', name: 'セルフケア・コンサルティング', subdomain: 'selfcare', plan: 'Pro', status: 'active', revenue: 19800, joinedAt: '2026-05-01', mcpDomain: 'https://sync.selfcare-funnel.jp/api', projectsCount: 5 },
    { id: 'tn-3', name: '合同会社ビジョンテック', subdomain: 'vision', plan: 'Starter', status: 'trial', revenue: 0, joinedAt: '2026-06-05', mcpDomain: 'https://vision-tech.utage-system.com/api', projectsCount: 2 },
    { id: 'tn-4', name: 'アカデミー進学塾グループ', subdomain: 'academy-edu', plan: 'Platinum', status: 'active', revenue: 29800, joinedAt: '2026-05-18', mcpDomain: 'https://edu.utage.jp/api', projectsCount: 9 },
    { id: 'tn-5', name: '株式会社グバ・プロモーション', subdomain: 'guba-promo', plan: 'Pro', status: 'expired', revenue: 0, joinedAt: '2026-03-10', mcpDomain: 'https://guba-promo.site/api', projectsCount: 0 },
  ]);

  // SaaS Plans state
  const [plans, setPlans] = useState([
    { name: 'Starter プラン', price: 9800, maxProjects: 3, maxClients: 5, enabled: true },
    { name: 'Pro プラン', price: 19800, maxProjects: 10, maxClients: 15, enabled: true },
    { name: 'Platinum プラン', price: 29800, maxProjects: 99, maxClients: 99, enabled: true },
  ]);

  // Tenant form state
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSubdomain, setNewTenantSubdomain] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState<'Starter' | 'Pro' | 'Platinum'>('Pro');

  // Logs simulation state
  const [systemLogs, setSystemLogs] = useState([
    { time: '10:45:21', type: 'info', text: 'SaaSシステム健全性診断チェック完了。全128インスタンスは正常稼働中。' },
    { time: '09:12:44', type: 'success', text: 'テナント [株式会社アルファマーケティング] がLINE API Webhookエンドポイントを更新完了。' },
    { time: '08:30:12', type: 'revenue', text: 'Stripeより定期決済自動回収成功: [tn-4] ￥29,800 元気。' },
    { time: '02:00:00', type: 'backup', text: '日次マルチテナント隔離スナップショット自動バックアップが正常にS3バケットへ送信されました。' },
    { time: '昨日 18:22:15', type: 'register', text: '新規テナント [合同会社ビジョンテック] がフリートライアル登録を開始。テナント用セパレートDBを自動プロビジョニング。' },
  ]);

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'tenants' | 'plans' | 'wizard' | 'delivery-templates' | 'knowledge-wiki' | 'admin-settings'>('overview');

  // API keys and system settings state
  const [apiKeys, setApiKeys] = useState({
    geminiKey: 'AI_STUDIO_GEMINI_API_KEY_EXAMPLE_MOCK_2026',
    stripeSecret: 'sk_test_51MzUtageSecretKeyExample999',
    stripeWebhook: 'whsec_UtageWebhookSecretExample001',
    lineChannelToken: 'eyJhY2Nlc3NfdG9rZW4iOiJsaW5lX3V0YWdlX3Rva2VuXzIwMjYifQ==',
    lineChannelSecret: 'bf9c3968ad691cbf726db4e3d3ffbc3a',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: '587',
  });
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // System users (staff) state
  const [systemUsers, setSystemUsers] = useState([
    { id: 'usr-1', name: '中村 誠二', email: 'c.thedots.2005@gmail.com', role: 'Owner', joinedAt: '2026-04-01', status: 'active' },
    { id: 'usr-2', name: '佐藤 健太', email: 'k.sato@utage-flow.jp', role: 'Administrator', joinedAt: '2026-04-15', status: 'active' },
    { id: 'usr-3', name: '田中 拓海', email: 't.tanaka@creative.co.jp', role: 'Director', joinedAt: '2026-05-01', status: 'active' },
    { id: 'usr-4', name: '鈴木 美咲', email: 'm.suzuki@external-writer.com', role: 'Writer', joinedAt: '2026-05-20', status: 'active' },
  ]);

  // New staff form state
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Owner' | 'Administrator' | 'Director' | 'Writer'>('Director');

  const handleSaveApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      setSystemLogs([
        { time: new Date().toLocaleTimeString(), type: 'success', text: '【システム共通設定更新】各種APIキー統合・SMTPメールリレー構成を更新保存しました。' },
        ...systemLogs
      ]);
      alert('🔒 設定変更を厳密に暗号化し、インフラ安全領域へ伝播・保存しました。');
    }, 850);
  };

  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newUser = {
      id: `usr-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setSystemUsers([...systemUsers, newUser]);
    setSystemLogs([
      { time: new Date().toLocaleTimeString(), type: 'register', text: `【ユーザー追加】新規管理メンバー「${newStaffName}」をロール：[${newStaffRole}] で登録完了しました。` },
      ...systemLogs
    ]);

    setNewStaffName('');
    setNewStaffEmail('');
    setShowInviteForm(false);
    alert(`🎉 ${newStaffName} さん宛ての招待用システムアクセスURLをモック送信しました！`);
  };

  // --- Admin Template Distribution handlers ---
  const [newDelName, setNewDelName] = useState('');
  const [newDelCategory, setNewDelCategory] = useState<FunnelType>('個別相談ファネル');
  const [newDelDescription, setNewDelDescription] = useState('');
  const [newDelSteps, setNewDelSteps] = useState("1. オプトインLP\n2. 特典送付・価値教育メール\n3. オンライン個別決済フォーム");
  const [newDelPlan, setNewDelPlan] = useState<'Starter' | 'Pro' | 'Platinum'>('Pro');
  const [newDelDuration, setNewDelDuration] = useState('2週間');

  const handleAddDeliveryTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDelName) return;
    const stepList = newDelSteps.split('\n').map(s => s.trim()).filter(Boolean);
    const newTemp: Template = {
      id: `t-add-${Date.now()}`,
      name: newDelName,
      category: newDelCategory,
      description: newDelDescription,
      stepsCount: stepList.length,
      steps: stepList,
      assignee: '管理者配布',
      expectedDuration: newDelDuration,
      requiredPlan: newDelPlan
    };
    setTemplates([newTemp, ...templates]);
    setNewDelName('');
    setNewDelDescription('');
    setNewDelSteps("1. オプトインLP\n2. 特典送付・価値教育メール\n3. オンライン個別決済フォーム");
    
    setSystemLogs([
      { time: new Date().toLocaleTimeString(), type: 'success', text: `【ファネル配布】新テンプレート「${newDelName}」を配信（プラン制限: ${newDelPlan}以上）。` },
      ...systemLogs
    ]);
    alert(`👑 配布テンプレートを新規追加しました。全テナント（SaaS契約プラン: ${newDelPlan}以上）に即座に配布されます。`);
  };

  const handleUpdateTemplatePlan = (id: string, plan: 'Starter' | 'Pro' | 'Platinum') => {
    setTemplates(templates.map(t => t.id === id ? { ...t, requiredPlan: plan } : t));
    setSystemLogs([
      { time: new Date().toLocaleTimeString(), type: 'info', text: `【ファネル制限更新】テンプレート(ID: ${id}) の必要プランを [${plan}] に改訂しました。` },
      ...systemLogs
    ]);
  };

  const handleDeleteTemplateFromAdmin = (id: string, name: string) => {
    if (confirm(`この配布用テンプレート「${name}」を全テナントから撤廃します。本当によろしいですか？`)) {
      setTemplates(templates.filter(t => t.id !== id));
      setSystemLogs([
        { time: new Date().toLocaleTimeString(), type: 'warning', text: `【ファネル撤廃】配布中テンプレート「${name}」の公開を停止しました。` },
        ...systemLogs
      ]);
    }
  };

  // --- Admin Wiki/Knowledge handlers ---
  const [newWikiTitle, setNewWikiTitle] = useState('');
  const [newWikiCategory, setNewWikiCategory] = useState<'ファネル設計' | 'UTAGE設定' | 'LINE・配信' | 'Stripe決済' | 'AI活用' | 'マーケティング知見'>('ファネル設計');
  const [newWikiExcerpt, setNewWikiExcerpt] = useState('');
  const [newWikiContent, setNewWikiContent] = useState('');
  const [newWikiPlan, setNewWikiPlan] = useState<'Starter' | 'Pro' | 'Platinum'>('Pro');
  const [newWikiAuthor, setNewWikiAuthor] = useState('マーケティング室');

  const handleAddWikiArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWikiTitle || !newWikiContent) return;
    const newArt: WikiArticle = {
      id: `w-add-${Date.now()}`,
      title: newWikiTitle,
      category: newWikiCategory,
      excerpt: newWikiExcerpt,
      content: newWikiContent,
      author: newWikiAuthor,
      publishedAt: new Date().toISOString().split('T')[0],
      requiredPlan: newWikiPlan,
      viewsCount: 0
    };
    setWikiArticles([newArt, ...wikiArticles]);
    setNewWikiTitle('');
    setNewWikiExcerpt('');
    setNewWikiContent('');
    
    setSystemLogs([
      { time: new Date().toLocaleTimeString(), type: 'success', text: `【知見Wiki公開】「${newWikiTitle}」を顧客向けに公開（プラン: ${newWikiPlan}以上）。` },
      ...systemLogs
    ]);
    alert(`💡 新たな成功知見Wikiを公開しました！全テナント（プラン: ${newWikiPlan}以上）が「知見・学習」タブから学習可能です。`);
  };

  const handleDeleteWikiArticle = (id: string, title: string) => {
    if (confirm(`知見ナレッジ記事「${title}」を顧客の共有ナレッジベースから永久削除します。本当によろしいですか？`)) {
      setWikiArticles(wikiArticles.filter(w => w.id !== id));
      setSystemLogs([
        { time: new Date().toLocaleTimeString(), type: 'warning', text: `【知見Wiki非公開】記事「${title}」を削除・非公開化しました。` },
        ...systemLogs
      ]);
    }
  };

  const handleUpdateWikiPlan = (id: string, plan: 'Starter' | 'Pro' | 'Platinum') => {
    setWikiArticles(wikiArticles.map(w => w.id === id ? { ...w, requiredPlan: plan } : w));
    setSystemLogs([
      { time: new Date().toLocaleTimeString(), type: 'info', text: `【ナレッジ制限更新】知見記事(ID: ${id}) の閲覧必要プランを [${plan}] にアップデートしました。` },
      ...systemLogs
    ]);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    const userToFind = systemUsers.find(u => u.id === userId);
    if (!userToFind) return;
    
    setSystemUsers(systemUsers.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
    setSystemLogs([
      { time: new Date().toLocaleTimeString(), type: 'info', text: `【ユーザー権限変更】${userToFind.name} の権限ロールを [${newRole}] に変更しました。` },
      ...systemLogs
    ]);
  };

  const handleDeleteStaff = (userId: string, name: string) => {
    if (confirm(`本当にアカウント「${name}」からすべてのシステム最高特権・作業権限を剥奪しますか？`)) {
      setSystemUsers(systemUsers.filter(u => u.id !== userId));
      setSystemLogs([
        { time: new Date().toLocaleTimeString(), type: 'warning', text: `【ユーザー資格剥奪】${name} のアクセスキーを暗号失効処理しました。` },
        ...systemLogs
      ]);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulatingProvision, setIsSimulatingProvision] = useState(false);
  const [provisionProgress, setProvisionProgress] = useState(0);

  // Initial Onboarding Registration Simulated Actions
  const handleAddNewTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantSubdomain) return;

    setIsSimulatingProvision(true);
    setProvisionProgress(5);

    const interval = setInterval(() => {
      setProvisionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newTenant: Tenant = {
              id: `tn-${Date.now()}`,
              name: newTenantName,
              subdomain: newTenantSubdomain.toLowerCase(),
              plan: newTenantPlan,
              status: newTenantPlan === 'Starter' ? 'trial' : 'active',
              revenue: newTenantPlan === 'Starter' ? 0 : (newTenantPlan === 'Pro' ? 19800 : 29800),
              joinedAt: new Date().toISOString().split('T')[0],
              mcpDomain: `https://${newTenantSubdomain}.utage-system.com/api`,
              projectsCount: 1
            };
            setTenants([newTenant, ...tenants]);
            setSystemLogs([
              { time: new Date().toLocaleTimeString(), type: 'register', text: `【新規テナント】${newTenantName}（サブドメイン: ${newTenantSubdomain}）の初期登録完了。` },
              ...systemLogs
            ]);
            setIsSimulatingProvision(false);
            setNewTenantName('');
            setNewTenantSubdomain('');
          }, 4);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleDeleteTenant = (id: string, name: string) => {
    if (confirm(`本当にテナント「${name}」をシステムから完全に削除しますか？データベース格納領域およびすべての連携APIトークンが永久削除されます。`)) {
      setTenants(tenants.filter(t => t.id !== id));
      setSystemLogs([
        { time: new Date().toLocaleTimeString(), type: 'warning', text: `【テナント削除】${name} の割当リソースをすべて物理削除しました。` },
        ...systemLogs
      ]);
    }
  };

  // SaaS Total monthly recurring revenue metric
  const mrr = tenants.reduce((acc, t) => acc + (t.status === 'active' ? t.revenue : 0), 0);

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Super Admin Top Hero Board */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0f172a] to-indigo-950 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-indigo-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-505/15 rounded-full blur-3xl -z-10" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black border border-indigo-500/30">
              <Crown className="h-3.5 w-3.5 text-amber-450 animate-pulse" />
              <span>SYSTEM OWNER PORTAL</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              総合システム管理者 コントロールタワー
            </h2>
            <p className="text-slate-350 text-xs md:text-sm max-w-xl leading-relaxed">
              本システムの所有者（代理店責任者・SaaS運営者）側の最高特権アカウント専用画面です。
              社内独自コンサルツールとしての運用と、一般事業者向け課金型SaaSとしての展開を瞬時にデバッグ切替・一括統括できます。
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md space-y-3 shrink-0">
            <div className="text-xs">
              <span className="text-slate-400 font-bold block uppercase tracking-wider">現在のインフラ稼働ライセンス</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-extrabold text-white">SaaSハイパーマルチテナントモード</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 pt-2 border-t border-white/5">
              <span className="text-[10px] text-slate-400">ホスト戦略の切り替え:</span>
              <div className="inline-flex rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setHostMode('internal');
                    setSystemLogs([{ time: new Date().toLocaleTimeString(), type: 'info', text: '運用モードを「社内専用ツール：1社単一運用」に切り替えました。' }, ...systemLogs]);
                  }}
                  className={`px-2.5 py-1 text-[9px] font-black rounded-md transition-all cursor-pointer ${
                    hostMode === 'internal' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  社内専有
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHostMode('saas');
                    setSystemLogs([{ time: new Date().toLocaleTimeString(), type: 'info', text: '運用モードを「マルチテナントSaaSモデル」に切り替えました。' }, ...systemLogs]);
                  }}
                  className={`px-2.5 py-1 text-[9px] font-black rounded-md transition-all cursor-pointer ${
                    hostMode === 'saas' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SaaS化
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Mode Quick Tabs */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSubTab === 'overview' 
              ? 'bg-[#0f172a] text-white' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          🌐 統合ステータス ＆ アーキテクチャ解説
        </button>

        <button
          onClick={() => setActiveSubTab('wizard')}
          className={`px-4.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
            activeSubTab === 'wizard' 
              ? 'bg-[#0f172a] text-white' 
              : 'text-indigo-600 hover:bg-indigo-50 border border-indigo-150 bg-indigo-50/20'
          }`}
        >
          🚀 登録手順・アカウント登録の実演
        </button>

        <button
          onClick={() => setActiveSubTab('admin-settings')}
          className={`px-4.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'admin-settings' 
              ? 'bg-[#0f172a] text-white' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Settings className="h-3.5 w-3.5 text-indigo-600" />
          <span>⚙️ システム設定 & ユーザー権限</span>
        </button>

        {hostMode === 'saas' && (
          <>
            <button
              onClick={() => setActiveSubTab('tenants')}
              className={`px-4.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'tenants' 
                  ? 'bg-[#0f172a] text-white' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              <span>テナント企業・Stripe同期一覧 ({tenants.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('plans')}
              className={`px-4.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'plans' 
                  ? 'bg-[#0f172a] text-white' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <DollarSign className="h-3.5 w-3.5" />
              <span>プラン価格/リミット設定</span>
            </button>
            <button
              onClick={() => setActiveSubTab('delivery-templates')}
              className={`px-4.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'delivery-templates' 
                  ? 'bg-[#0f172a] text-white' 
                  : 'text-indigo-650 hover:bg-indigo-50 border border-indigo-150 bg-indigo-50/10'
              }`}
            >
              <Workflow className="h-3.5 w-3.5 text-indigo-500" />
              <span>👑 成功ファネル配布 ({templates.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('knowledge-wiki')}
              className={`px-4.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'knowledge-wiki' 
                  ? 'bg-[#0f172a] text-white' 
                  : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-150 bg-emerald-50/10'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
              <span>💡 知見Wiki・学習ナレッジ ({wikiArticles.length})</span>
            </button>
          </>
        )}
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${hostMode}-${activeSubTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* SubTab 1: CORE ARCHITECTURE OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Concept breakdown card */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Visual Explanation block */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-xs">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Building className="h-5 w-5 text-indigo-650" />
                    【ホスト戦略比較】自社専用運用 VS SaaS展開サービス化
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    このシステムを統合管理する際、最初に決定すべき<strong>「2つの基本動作モデル」</strong>の技術構造と、総合管理者の実際の意思決定手順についての全貌です：
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                    
                    {/* Strategy A: Internal */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 hover:border-slate-250 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-200 text-slate-800 uppercase tracking-wider">
                          Mode A: 社内完結・受託専有モデル
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">1社専有・チーム共有ハブ</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
                          貴社所属のディレクター、コーダー、ライターが共同で案件をモニタリング。
                          エンドクライアントには「マイルストーン警告URL」や「議事ログ」を直接通知・レポート共有します。
                        </p>
                      </div>
                      <div className="pt-3.5 mt-3 border-t border-slate-150 text-[10px] text-slate-700 font-bold space-y-1">
                        <p className="flex items-center gap-1">✅ 登録：管理者が代表メールで一括セットアップ</p>
                        <p className="flex items-center gap-1">✅ 連携：共通のAPI鍵（LINE / Stripe）にてデバッグ</p>
                        <p className="flex items-center gap-1">✅ アカウント：社内メンバーを直接追加招待</p>
                      </div>
                    </div>

                    {/* Strategy B: Saas Model */}
                    <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-150 hover:border-indigo-250 transition-colors flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="inline-flex px-2 py-0.5 rounded-md text-[9px] font-black bg-indigo-100 text-indigo-800 uppercase tracking-wider">
                          Mode B: SaaSマーケティングプラットフォーム
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">マルチテナント・課金制展開</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed text-justify">
                          他社マーケテラや構築代理店が、それぞれ独自のアカウント（テナント）を作成し、自社のUTAGEトークンを入力。
                          ユーザー数・顧客登録数に基づく自動継続課金システムモデルです。
                        </p>
                      </div>
                      <div className="pt-3.5 mt-3 border-t border-indigo-150/70 text-[10px] text-indigo-750 font-bold space-y-1">
                        <p className="flex items-center gap-1">🚀 登録：セルフ契約、独自のサブドメイン発行</p>
                        <p className="flex items-center gap-1">🚀 連携：Stripe Connectを用いた支払いマッピング</p>
                        <p className="flex items-center gap-1">🚀 データベース：マルチテナント型の厳密データ隔離</p>
                      </div>
                    </div>

                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-150 rounded-2xl flex items-start gap-3">
                    <span className="text-base select-none">💡</span>
                    <div className="text-[11px] text-amber-900 leading-relaxed">
                      <strong className="font-extrabold block mb-0.5">総合管理者（オーナー）の実際の役割 (The Operational Flow)</strong>
                      総合管理者は、システム構築の土台（共通テンプレート）を提供し、システム全体の死活監視、Stripe決済不具合のリカバリ、各テナントのAPIレート上限解除、サーバー自動スケールの制御を行います。
                    </div>
                  </div>
                </div>

                {/* SaaS Metrics block if SaaS mode activated */}
                {hostMode === 'saas' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-widest">SaaS Monthly Revenue</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">￥{mrr.toLocaleString()}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold mt-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>先月比 +15.4% (MRRベース)</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-widest">Active Tenants</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">{tenants.filter(t => t.status !== 'expired').length} / {tenants.length} 社</p>
                      <span className="inline-block mt-2 text-[10px] text-slate-450 font-medium">現在トライアル移行中: 1社</span>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-widest">Avg Projects / Tenant</span>
                      <p className="text-2xl font-black text-indigo-650 mt-1">
                        {(tenants.reduce((acc, t) => acc + t.projectsCount, 0) / tenants.length).toFixed(1)} 件
                      </p>
                      <span className="inline-block mt-2 text-[10px] text-indigo-505 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md font-semibold">
                        UTAGE MCP 同期パケット正常
                      </span>
                    </div>

                  </div>
                )}

              </div>

              {/* Right panel: System event stream & Quick Settings */}
              <div className="space-y-6">
                
                {/* Active logs console */}
                <div className="bg-slate-950 text-slate-300 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4 font-mono text-[11px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">SYSTEM MONITOR STREAM</span>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {systemLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed hover:text-white transition-colors">
                        <span className="text-slate-400">[{log.time}]</span>{' '}
                        {log.type === 'success' && <span className="text-emerald-400 font-bold">[OK]</span>}
                        {log.type === 'register' && <span className="text-indigo-405 font-black">[REG]</span>}
                        {log.type === 'revenue' && <span className="text-amber-400 font-bold">[PAY]</span>}
                        {log.type === 'backup' && <span className="text-teal-400">[BACKUP]</span>}
                        {log.type === 'warning' && <span className="text-rose-400 font-bold">[WARN]</span>}
                        {log.type === 'info' && <span className="text-slate-300 font-medium">[SYSTEM]</span>}{' '}
                        <span className="text-slate-100 font-semibold">{log.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-[9px] text-slate-500 text-right">
                    更新間隔 : 5秒ごと自動リロード
                  </div>
                </div>

                {/* Infrastructure check */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-3xs">
                  <h4 className="text-xs font-black text-slate-900 uppercase">総合管理データベース性能</h4>
                  <div className="space-y-3 text-xs text-slate-600 font-semibold">
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span>マルチテナント隔離設計:</span>
                      <span className="text-slate-800 font-black">Row Level Security (Drizzle Postgre)</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span>Stripe自動疎通API:</span>
                      <span className="text-slate-800 font-black">SANDBOX並行本番</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span>マスター初期設定テンプレート:</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">5種類が適用済 完了</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SubTab 2: REGISTRATION DEMORCRAFTER & ONBOARDING STEPS */}
          {activeSubTab === 'wizard' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-6 shadow-xs max-w-4xl mx-auto">
              
              <div className="border-b border-slate-150 pb-4">
                <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest bg-indigo-50 border border-indigo-150/65 px-2.5 py-1 rounded-md">INITIAL ONBOARDING SIMULATOR</span>
                <h3 className="text-lg font-black text-slate-900 mt-3">
                  このシステムの「最初の登録手順」と総合管理者の初期挙動シミュレーション
                </h3>
                <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                  本システムの最初のログイン環境の初期化手順です。以下で「内部アカウントとして1社で受託に使う場合」と「システム自体をAPI同期付きSaaSとして提供する場合」の初期セットアップを模擬実行できます。
                </p>
              </div>

              {/* Steps and interactive form */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Stepper overview (Left - 4 columns) */}
                <div className="md:col-span-5 space-y-3 pt-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">セットアップ実行手順</p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">1</div>
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 block">ホスト運用方針の検討決定</strong>
                        <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                          単一の制作チームで使うか（社内モード）、複数の外部ユーザーに月額販売するか（SaaSモード）を決定します。
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-slate-930 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">2</div>
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 block">総合最高管理権限(Super Admin)の取得</strong>
                        <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                          マスタ管理者のメールアドレスを設定し、DB全体の初期暗号シールドを生成します。
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">3</div>
                      <div className="space-y-0.5">
                        <strong className="text-indigo-900 font-black block">初期データベース・スキーマ展開</strong>
                        <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                          右のパネルをデモ入力し、初期化を実施することで、必要なモック情報、各種ファネルテンプレートがDBへプロビジョニングされます。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100 text-[11px] text-indigo-950 font-bold space-y-2.5 mt-4">
                    <div className="flex items-center gap-1">
                      <ShieldAlert className="h-4 w-4 text-indigo-650 shrink-0" />
                      <span>SaaS展開時のStripe自動課金連携とは？</span>
                    </div>
                    <p className="font-semibold text-slate-600 leading-relaxed">
                      SaaS販売モードでは、クライアントが新規会員登録フォームからサインアップすると、Stripe Checkoutへ自動転送され、課金確認が完了した瞬間（Stripe Webhookにより同期）にテナント用の隔離テナント環境が約2秒で即時払い出し自動構成される仕組みとなります。
                    </p>
                  </div>
                </div>

                {/* Simulated Registration Console (Right - 7 columns) */}
                <div className="md:col-span-7 bg-slate-50 p-5 rounded-3xl border border-slate-205 space-y-4">
                  <h4 className="text-xs font-black text-indigo-905 flex items-center gap-1">
                    <Settings className="h-4.5 w-4.5 text-indigo-600" />
                    システム初期プロビジョニング・シミュレータ
                  </h4>

                  <form onSubmit={(e) => { e.preventDefault(); alert("初期セットアップのプロビジョニングが実行されました！"); }} className="space-y-3.5 text-xs text-slate-800">
                    <div>
                      <label className="block text-[10px] text-slate-600 font-bold uppercase mb-1">1. 初期運用の選択方式</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setHostMode('internal')}
                          className={`p-3.5 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                            hostMode === 'internal'
                              ? 'bg-white border-indigo-505 shadow-xs ring-1 ring-indigo-505'
                              : 'bg-white hover:bg-slate-100 border-slate-205'
                          }`}
                        >
                          <span className="font-black text-slate-700 block text-xs">A. 社内専用ツール運用</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">受託チームメンバーで一括共同構築（1社独占）</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setHostMode('saas')}
                          className={`p-3.5 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                            hostMode === 'saas'
                              ? 'bg-white border-indigo-505 shadow-xs ring-1 ring-indigo-505'
                              : 'bg-white hover:bg-slate-100 border-slate-205'
                          }`}
                        >
                          <span className="font-black text-slate-700 block text-xs">B. マルチテナントSaaS化</span>
                          <span className="text-[10px] text-slate-400 mt-1 block">外部にサブスクを月額販売（マルチテナント）</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">2. 総合統括管理者（Super Admin）のメール</label>
                        <input
                          type="email"
                          defaultValue="c.thedots.2005@gmail.com"
                          className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-550"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">3. 初期セキュリティ管理者秘密鍵</label>
                        <input
                          type="password"
                          defaultValue="super_secret_master_key_999"
                          className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-550 font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">内部で行われる全自動処理：</span>
                      <ul className="list-styled pl-4 text-slate-655 space-y-1 font-semibold">
                        <li>・オーナーマスター設定テーブルの初期パブリッシュ</li>
                        <li>・UTAGE標準テンプレート全5型のスキーマ一括インジェクション</li>
                        <li>・Stripe決済 sandbox Webhookの待受ポート3000自動割当</li>
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                      {isSimulatingProvision ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[11px] font-bold text-slate-600">
                            <span>システム資源を初期プロビジョニング中...</span>
                            <span>{provisionProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-650 transition-all duration-305" style={{ width: `${provisionProgress}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsSimulatingProvision(true);
                            setProvisionProgress(10);
                            const interval = setInterval(() => {
                              setProvisionProgress((prev) => {
                                if (prev >= 100) {
                                  clearInterval(interval);
                                  setTimeout(() => {
                                    setIsSimulatingProvision(false);
                                    setIsSetupCompleted(true);
                                    setSystemLogs([
                                      { time: new Date().toLocaleTimeString(), type: 'success', text: '【初期登録完了】総合管理者の初期化コマンド完了。ポータル全機能がアクティベートされました！' },
                                      ...systemLogs
                                    ]);
                                    alert(`🎉 システムの初期設定に成功しました！(動作モード: ${hostMode === 'internal' ? '社内専用専有ツール' : 'マルチテナントSaaS課金型'})`);
                                  }, 4);
                                  return 100;
                                }
                                return prev + 20;
                              });
                            }, 150);
                          }}
                          className="w-full py-3 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition-all flex items-center justify-center gap-1"
                        >
                          <span>🚀 この設定でシステムを初期化登録しポータルを開く</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsSetupCompleted(false);
                          alert('初期セットアップ・ウィザードのリミッターを再稼働させました。');
                        }}
                        className="text-center text-[10px] text-slate-500 hover:text-red-500 font-bold hover:underline cursor-pointer"
                      >
                        （初期設定ウィザードの表示ロックを強制リセットする）
                      </button>
                    </div>

                  </form>
                </div>

              </div>

            </div>
          )}

          {/* SubTab 3: SaaS Tenants Directory */}
          {activeSubTab === 'tenants' && hostMode === 'saas' && (
            <div className="space-y-6">
              
              {/* Add tenant manual simulator block */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-black text-slate-900">
                  🛡️ 新規テナントアカウントの手動登録プロビジョニング
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Stripe決済の不具合時やテストデバッグ用の強制アカウント手動追加フォームです。独自の専用サブドメインとMCP連携URLが自動算出されます。
                </p>

                <form onSubmit={handleAddNewTenant} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">企業または代理店名</label>
                    <input
                      type="text"
                      value={newTenantName}
                      onChange={(e) => setNewTenantName(e.target.value)}
                      placeholder="株式会社ブレインズ"
                      className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">希望サブドメイン (アルファベット)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={newTenantSubdomain}
                        onChange={(e) => setNewTenantSubdomain(e.target.value)}
                        placeholder="brains"
                        className="w-full text-xs rounded-xl border border-slate-250 pl-3 pr-20 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500 font-mono tracking-tight"
                      />
                      <span className="absolute right-3 top-2.5 text-[9px] text-slate-400 font-medium font-mono">.utage-flow.jp</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">初期プラン選択</label>
                    <select
                      value={newTenantPlan}
                      onChange={(e) => setNewTenantPlan(e.target.value as any)}
                      className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500 font-bold"
                    >
                      <option value="Starter">Starter プラン (トライアル)</option>
                      <option value="Pro">Pro プラン (~10案件)</option>
                      <option value="Platinum">Platinum プラン (制限なし)</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={isSimulatingProvision}
                      className="w-full py-2 bg-[#0f172a] hover:bg-slate-800 text-white font-black text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1 shadow-3xs"
                    >
                      {isSimulatingProvision ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>構築中...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4.5 w-4.5" />
                          <span>テナント追加 & DB起動</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Tenants Directory Grid / Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-2">
                      <Building className="h-4.5 w-4.5 text-indigo-600" />
                      SaaS テナント総合台帳 ＆ Stripe定期課金監視
                    </h3>
                    <p className="text-slate-400 text-xs mt-0.5">
                      現在このUTAGE Flow SaaS版に登録されているワークスペース一覧です。
                    </p>
                  </div>

                  {/* Search query box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="テナントを検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-60 font-semibold"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] text-slate-500 font-black uppercase border-b border-slate-150">
                        <th className="py-3 px-6">テナント情報（代表企業）</th>
                        <th className="py-3 px-6">サブドメイン発行</th>
                        <th className="py-3 px-6">登録プラン</th>
                        <th className="py-3 px-6">月間売上 (MRR)</th>
                        <th className="py-3 px-6">課金ステータス</th>
                        <th className="py-3 px-6">活性タスク/UTAGEエンドポイント</th>
                        <th className="py-3 px-6 text-right">アクション</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                      {tenants
                        .filter(t => t.name.includes(searchQuery) || t.subdomain.includes(searchQuery))
                        .map((tenant) => (
                          <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-6 font-bold text-slate-800">
                              <p>{tenant.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">登録日: {tenant.joinedAt}</span>
                            </td>
                            <td className="py-3.5 px-6">
                              <span className="font-mono text-indigo-650 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-[10px]">
                                {tenant.subdomain}.utage-flow.jp
                              </span>
                            </td>
                            <td className="py-3.5 px-6">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black border ${
                                tenant.plan === 'Platinum' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                tenant.plan === 'Pro' ? 'bg-indigo-50 text-indigo-850 border-indigo-200' :
                                'bg-slate-100 text-slate-650 border-slate-200'
                              }`}>
                                {tenant.plan}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 font-mono text-slate-900 font-bold">
                              ￥{(tenant.status === 'active' ? tenant.revenue : 0).toLocaleString()} <span className="text-[9px] text-slate-400">/月</span>
                            </td>
                            <td className="py-3.5 px-6">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                                tenant.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                                tenant.status === 'trial' ? 'bg-amber-50 text-amber-850 border-amber-150 animate-pulse' :
                                'bg-rose-50 text-rose-800 border-rose-150'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  tenant.status === 'active' ? 'bg-emerald-505' :
                                  tenant.status === 'trial' ? 'bg-amber-550' :
                                  'bg-rose-500'
                                }`} />
                                {tenant.status === 'active' ? '正常課金中' :
                                 tenant.status === 'trial' ? '試用期間中' :
                                 'お支払期限切れ (退避中)'}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 leading-relaxed">
                              <p className="text-[10px] text-slate-400 font-mono tracking-tight truncate max-w-[150px]">{tenant.mcpDomain}</p>
                              <p className="text-[10px] font-bold text-slate-600 font-mono">{tenant.projectsCount} 案件モニタ同期</p>
                            </td>
                            <td className="py-3.5 px-6 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                                className="p-1 px-2 text-rose-650 hover:bg-rose-50 border border-transparent hover:border-rose-150 rounded-lg cursor-pointer transition-colors"
                              >
                                物理削除
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* SubTab 4: Plan editor */}
          {activeSubTab === 'plans' && hostMode === 'saas' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-6 shadow-xs max-w-4xl mx-auto">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  💳 SaaS サブスクリプションプラン価格設定
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  支払いシステム（Stripe ConnectAPI）と完全連動する、フロントエンド側の自動価格定義です。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between space-y-4 shadow-3xs">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-800 text-sm font-black block">{plan.name}</strong>
                        <label className="relative inline-flex items-center cursor-pointer scale-75">
                          <input 
                            type="checkbox" 
                            checked={plan.enabled} 
                            onChange={(e) => {
                              const updated = [...plans];
                              updated[idx].enabled = e.target.checked;
                              setPlans(updated);
                            }}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650"></div>
                        </label>
                      </div>

                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900">￥{plan.price.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 font-bold">/ 月額 (税込)</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 font-semibold py-3 border-t border-b border-slate-150">
                      <div className="flex justify-between">
                        <span>同期ファネル案件数:</span>
                        <span className="text-slate-800 font-bold">{plan.maxProjects === 99 ? '上限なし' : `最大 ${plan.maxProjects} 件`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>登録可能クライアント数:</span>
                        <span className="text-slate-800 font-bold">{plan.maxClients === 99 ? '上限なし' : `最大 ${plan.maxClients} 人`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gemini AIライター:</span>
                        <span className="text-slate-800 font-bold">{plan.name === 'Starter プラン' ? '利用不可' : '無制限'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-450 display-block leading-relaxed mt-2">
                        ※ Stripe Dashboard 側の商品ID `prod_{plan.name.toLowerCase()}` と同期待受を確保中
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">※ Stripe決済Webhookシークレット疎通テスト：</span>
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded font-black">
                  CONNECTED (安全な暗号SSL通信 確立中)
                </span>
              </div>
            </div>
          )}

          {/* SubTab 5: System Admin Settings & User Permissions */}
          {activeSubTab === 'admin-settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Column Left (LG: 5 columns): API Keys and Integrations */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <Key className="h-4 w-4 text-indigo-600" />
                        <span>システム連携 API 認証資格設定</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        システムが利用する各種AI・決済・メッセージングのグローバルAPIキーです。
                      </p>
                    </div>

                    <form onSubmit={handleSaveApiKeys} className="space-y-4">
                      
                      {/* Gemini API Key */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-slate-700 font-bold block">Gemini AI API Key</label>
                          <button
                            type="button"
                            onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                            className="text-[10px] text-indigo-650 hover:underline cursor-pointer font-bold animate-none"
                          >
                            {showKeys.gemini ? 'マスクする' : 'ハッシュを表示'}
                          </button>
                        </div>
                        <input
                          type={showKeys.gemini ? 'text' : 'password'}
                          value={apiKeys.geminiKey}
                          onChange={(e) => setApiKeys({ ...apiKeys, geminiKey: e.target.value })}
                          className="w-full text-xs font-mono rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                        />
                        <p className="text-[10px] text-slate-450 leading-relaxed font-semibold">
                          ※ UTAGEのLPコンテンツ自動生成・AI分析エッジノードで消費される、システム全体の共有APIトークンです。
                        </p>
                      </div>

                      {/* Stripe Secret Key */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-slate-700 font-bold block">Stripe Secret Key (sk_live/test)</label>
                          <button
                            type="button"
                            onClick={() => setShowKeys(prev => ({ ...prev, stripe: !prev.stripe }))}
                            className="text-[10px] text-indigo-650 hover:underline cursor-pointer font-bold animate-none"
                          >
                            {showKeys.stripe ? 'マスクする' : 'ハッシュを表示'}
                          </button>
                        </div>
                        <input
                          type={showKeys.stripe ? 'text' : 'password'}
                          value={apiKeys.stripeSecret}
                          onChange={(e) => setApiKeys({ ...apiKeys, stripeSecret: e.target.value })}
                          className="w-full text-xs font-mono rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Stripe Webhook Secret */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-slate-700 font-bold block">Stripe Webhook Secret (whsec_...)</label>
                          <button
                            type="button"
                            onClick={() => setShowKeys(prev => ({ ...prev, webhook: !prev.webhook }))}
                            className="text-[10px] text-indigo-650 hover:underline cursor-pointer font-bold animate-none"
                          >
                            {showKeys.webhook ? 'マスクする' : 'ハッシュを表示'}
                          </button>
                        </div>
                        <input
                          type={showKeys.webhook ? 'text' : 'password'}
                          value={apiKeys.stripeWebhook}
                          onChange={(e) => setApiKeys({ ...apiKeys, stripeWebhook: e.target.value })}
                          className="w-full text-xs font-mono rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {/* LINE Messaging API */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <label className="text-slate-700 font-bold block">LINE Channel Access Token</label>
                          <button
                            type="button"
                            onClick={() => setShowKeys(prev => ({ ...prev, lineToken: !prev.lineToken }))}
                            className="text-[10px] text-indigo-650 hover:underline cursor-pointer font-bold animate-none"
                          >
                            {showKeys.lineToken ? 'マスクする' : 'ハッシュを表示'}
                          </button>
                        </div>
                        <input
                          type={showKeys.lineToken ? 'text' : 'password'}
                          value={apiKeys.lineChannelToken}
                          onChange={(e) => setApiKeys({ ...apiKeys, lineChannelToken: e.target.value })}
                          className="w-full text-xs font-mono rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {/* SMTP Mail Delivery setting */}
                      <div className="grid grid-cols-2 gap-3 pb-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">SMTP ホストアドレス</label>
                          <input
                            type="text"
                            value={apiKeys.smtpHost}
                            onChange={(e) => setApiKeys({ ...apiKeys, smtpHost: e.target.value })}
                            className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">SMTP ポート番号</label>
                          <input
                            type="text"
                            value={apiKeys.smtpPort}
                            onChange={(e) => setApiKeys({ ...apiKeys, smtpPort: e.target.value })}
                            className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 focus:ring-1 focus:ring-indigo-500 font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingSettings}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs transition-all"
                      >
                        {isSavingSettings ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>暗号書き込み中...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>変更を暗号化保存する</span>
                          </>
                        )}
                      </button>

                    </form>
                  </div>

                  {/* API Environment Diagnostics Checklist */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-slate-300 space-y-3.5">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      <span>エンドポイント正常性チェック</span>
                    </h4>
                    <div className="space-y-2 text-xs font-semibold">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-semibold">Gemini API疎通:</span>
                        <span className="text-emerald-400 font-bold">200 OK (Latency: 12ms)</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-slate-400 font-semibold">Stripe Webhook待機:</span>
                        <span className="text-emerald-400 font-bold">ACTIVE (Sandbox並行)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-semibold">LINE SSLエンドポイント:</span>
                        <span className="text-amber-400 font-bold">MUTUAL_SSL_RECON</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column Right (LG: 7 columns): User Management Panel */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* User List & Role Assignment Card */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
                          <Users className="h-4.5 w-4.5 text-indigo-600" />
                          <span>管理者・代理店所属ユーザー権限統合</span>
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5">
                          システム全体の管理者権限、およびクライアントへの閲覧割り当て権限を編集できます。
                        </p>
                      </div>

                      {/* Open Add User modal inline */}
                      <button
                        type="button"
                        onClick={() => setShowInviteForm(!showInviteForm)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-indigo-50 border border-indigo-150 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                        <span>メンバー登録・招待</span>
                      </button>
                    </div>

                    {/* Invite form expansion */}
                    <AnimatePresence>
                      {showInviteForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-b border-slate-100 bg-slate-50/50 overflow-hidden"
                        >
                          <form onSubmit={handleInviteStaff} className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto items-end text-xs">
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-500 font-bold uppercase">お名前</label>
                              <input
                                type="text"
                                required
                                value={newStaffName}
                                onChange={(e) => setNewStaffName(e.target.value)}
                                placeholder="例) 山田 太郎"
                                className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500 font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-500 font-bold uppercase">メールアドレス</label>
                              <input
                                type="email"
                                required
                                value={newStaffEmail}
                                onChange={(e) => setNewStaffEmail(e.target.value)}
                                placeholder="taroyamada@example.com"
                                className="w-full text-xs font-semibold rounded-xl border border-slate-250 px-3 py-2 bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] text-slate-500 font-bold uppercase">管理者/スタッフ権限</label>
                              <select
                                value={newStaffRole}
                                onChange={(e) => setNewStaffRole(e.target.value as any)}
                                className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-white text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500"
                              >
                                <option value="Owner">Owner (最高経営特権)</option>
                                <option value="Administrator">Administrator (統括管理)</option>
                                <option value="Director">Director (制作ディレクター)</option>
                                <option value="Writer">Writer (専門執筆ライター)</option>
                              </select>
                            </div>
                            <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setShowInviteForm(false)}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                              >
                                取消
                              </button>
                              <button
                                type="submit"
                                className="px-5 py-2 rounded-xl text-xs font-black bg-[#0f172a] hover:bg-slate-800 text-white cursor-pointer shadow-3xs"
                              >
                                メンバーを追加 & アクティベート
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Users list table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-500 font-black uppercase border-b border-slate-150">
                            <th className="py-3 px-6">メンバー基本情報</th>
                            <th className="py-3 px-6">アクセス所有ロール</th>
                            <th className="py-3 px-6">連携ステータス</th>
                            <th className="py-3 px-6">アカウント作成</th>
                            <th className="py-3 px-6 text-right">アクション</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150/60 text-slate-700 font-semibold">
                          {systemUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-3.5 px-6">
                                <p className="font-bold text-slate-800 text-xs">{user.name}</p>
                                <span className="text-[10px] text-slate-450 font-mono select-all block mt-0.5">{user.email}</span>
                              </td>
                              <td className="py-3.5 px-6">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                  className="text-xs bg-slate-50/50 focus:bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-2 py-1 font-black text-slate-800 cursor-pointer focus:ring-1 focus:ring-indigo-500"
                                >
                                  <option value="Owner">👑 Owner (最高経営権)</option>
                                  <option value="Administrator">🛡️ Administrator (管理)</option>
                                  <option value="Director">📁 Director (ディレクション)</option>
                                  <option value="Writer">✏️ Writer (執筆・連携)</option>
                                </select>
                              </td>
                              <td className="py-3.5 px-6">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-800 border border-emerald-150">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  <span>認可完了 (Active)</span>
                                </span>
                              </td>
                              <td className="py-3.5 px-6 font-mono text-slate-450 text-[10px]">
                                {user.joinedAt}
                              </td>
                              <td className="py-3.5 px-6 text-right">
                                {user.role !== 'Owner' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStaff(user.id, user.name)}
                                    className="p-1 px-2 text-rose-650 hover:bg-rose-50 border border-transparent hover:border-rose-150 rounded-lg cursor-pointer transition-colors text-[10px]"
                                  >
                                    アカウント削除
                                  </button>
                                ) : (
                                  <span className="text-[9px] text-slate-400 font-medium px-2 block">削除不可 (最高特権)</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                  </div>

                  {/* Detailed Description block explaining security model */}
                  <div className="bg-slate-50 rounded-3xl border border-slate-205 p-6 space-y-3">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1">
                      <ShieldAlert className="h-4 w-4 text-emerald-650" />
                      <span>【システム所有者様への推奨セキュリティガイド】</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                      本システムでは、ロールの階層に基づきダッシュボード・顧客台帳・各種連携APIキーの閲覧および編集範囲が厳密に隔離されます。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[10px] text-slate-500 pt-1 font-semibold">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-150">
                        <strong className="text-slate-800 block mb-0.5">Owner</strong>
                        全領域（Stripe Connect含む支払定義および他社テナントの強制解除能力）を持った最高位支配ロール。
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-150">
                        <strong className="text-slate-800 block mb-0.5">Administrator</strong>
                        自テナント内の顧客管理、プロジェクト初期化、連携LINE/Stripeの調整を実施可能。
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-150">
                        <strong className="text-slate-800 block mb-0.5">Director</strong>
                        プロジェクトのモニタ、テンプレート選択、進行フェーズ調整の通常運用権限。
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-150">
                        <strong className="text-slate-800 block mb-0.5">Writer</strong>
                        Gemini AI作成セクション、ファネルLPコピーライティングのインポートおよび編集に特化。
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* SubTab 6: Super Admin Success Funnel Distribution Management */}
          {activeSubTab === 'delivery-templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Create / Add New Template Form (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <Workflow className="h-4.5 w-4.5 text-indigo-650" />
                        <span>新規プラットフォーム標準テンプレート配信</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        成果実証済みのファネル構成をライブラリに追加し、指定プラン以上の契約テナント全員に一斉配布します。
                      </p>
                    </div>

                    <form onSubmit={handleAddDeliveryTemplate} className="space-y-4 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-slate-700 font-bold block">テンプレート名</label>
                        <input
                          type="text"
                          required
                          value={newDelName}
                          onChange={(e) => setNewDelName(e.target.value)}
                          placeholder="例: 【高単価】個別Zoom面談・直撃即決ファネル"
                          className="w-full text-xs font-semibold rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-850 focus:ring-1 focus:ring-indigo-500 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-slate-700 font-bold block">ファネル種別</label>
                          <select
                            value={newDelCategory}
                            onChange={(e) => setNewDelCategory(e.target.value as any)}
                            className="w-full text-xs rounded-xl border border-slate-250 px-2 py-2 bg-white text-slate-850 font-bold cursor-pointer"
                          >
                            <option value="セミナー集客ファネル">セミナー集客ファネル</option>
                            <option value="個別相談ファネル">個別相談ファネル</option>
                            <option value="自社プロダクト販売ファネル">自社プロダクト販売ファネル</option>
                            <option value="無料プレゼント配布ファネル">無料プレゼント配布ファネル</option>
                            <option value="オンラインコンテンツ販売ファネル">オンラインコンテンツ販売ファネル</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-700 font-bold block">配布ライセンス制限</label>
                          <select
                            value={newDelPlan}
                            onChange={(e) => setNewDelPlan(e.target.value as any)}
                            className="w-full text-xs rounded-xl border border-slate-250 px-2 py-2 bg-white text-indigo-755 font-black cursor-pointer"
                          >
                            <option value="Starter">Starter 以上 (制限なし)</option>
                            <option value="Pro">Pro 以上 (中堅プラン)</option>
                            <option value="Platinum">Platinum 限定 (高位プラン限定)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-slate-700 font-bold block">想定工期</label>
                          <input
                            type="text"
                            value={newDelDuration}
                            onChange={(e) => setNewDelDuration(e.target.value)}
                            placeholder="例: 2週間"
                            className="w-full text-xs font-semibold rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-slate-700 font-bold block">担当プロモデラー</label>
                          <input
                            type="text"
                            value="管理者配布"
                            disabled
                            className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-slate-100/70 text-slate-450 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-700 font-bold block">ファネル概要説明文</label>
                        <textarea
                          rows={2}
                          value={newDelDescription}
                          onChange={(e) => setNewDelDescription(e.target.value)}
                          placeholder="この成功パターンのマーケティング心理的アピールポイントについて記述。"
                          className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-slate-700 font-bold block">構築ステップ構成 (改行で1ステップ)</label>
                          <span className="text-[10px] text-slate-400 font-bold">自動ナンバリング</span>
                        </div>
                        <textarea
                          rows={4}
                          value={newDelSteps}
                          onChange={(e) => setNewDelSteps(e.target.value)}
                          placeholder="1. オプトインLP&#10;2. セミナー動画視聴&#10;3. Zoom予約＆Stripe決済"
                          className="w-full text-xs font-mono rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 transition-all"
                      >
                        <Plus className="h-4 w-4" />
                        <span>新テンプレートを発行＆全テナントへ配布</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Side: Active Admin templates Distribution Checklist (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
                        <Workflow className="h-4 w-4.5 text-indigo-600" />
                        <span>現在共通配信中の成功パターンテンプレート ({templates.length})</span>
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                        各テンプレートがどのSaaSプランで利用可能かをリアルタイム管理します。プラン制限を変更すると、テナントの構築選択肢に直ちに制限が課されます。
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {templates.map((temp) => (
                        <div key={temp.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/30 transition-colors">
                          <div className="space-y-1.5 max-w-lg">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                                {temp.category}
                              </span>
                              <span className="text-slate-450 font-mono text-[10px]">Steps: {temp.stepsCount}</span>
                              <span className="text-slate-400 text-[10px]">• 工期: {temp.expectedDuration || '未設定'}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-850 text-xs flex items-center gap-1">
                              {temp.name}
                            </h4>
                            <p className="text-[11px] text-slate-450 leading-relaxed truncate-2-lines text-justify">
                              {temp.description}
                            </p>
                            
                            {/* Steps Preview */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {temp.steps.map((st, i) => (
                                <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[9px] font-semibold">
                                  {st}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col items-end gap-3 shrink-0 bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-2xl">
                            <div className="space-y-1 text-right">
                              <span className="text-[10px] text-slate-400 font-extrabold block">必要SaaSプラン</span>
                              <select
                                value={temp.requiredPlan || 'Starter'}
                                onChange={(e) => handleUpdateTemplatePlan(temp.id, e.target.value as any)}
                                className={`text-[11px] rounded-lg border px-2 py-1 font-black cursor-pointer shadow-3xs ${
                                  temp.requiredPlan === 'Platinum' 
                                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                                    : temp.requiredPlan === 'Pro' 
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                }`}
                              >
                                <option value="Starter">🔰 Starter プラン以上</option>
                                <option value="Pro">⚡ Pro プラン以上</option>
                                <option value="Platinum">👑 Platinum 限定</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteTemplateFromAdmin(temp.id, temp.name)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-rose-650 hover:bg-rose-50 border border-transparent hover:border-rose-100 cursor-pointer transition-all shrink-0"
                            >
                              配信を差し止める
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SubTab 7: Super Admin Marketing Knowledge & Wiki Management */}
          {activeSubTab === 'knowledge-wiki' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Create / Add New Wiki Form (6 cols) */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-200/90 p-6 space-y-5 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <BookOpen className="h-4.5 w-4.5 text-emerald-650" />
                        <span>新規知見・学習マーケティングWikiのパブリッシュ</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        単なる「使い方マニュアル」を超えた、Stripeの回収率最大化やLINEステップの黄金律など、全テナント向け「ノウハウ・学習ポータル記事」を執筆公開します。
                      </p>
                    </div>

                    <form onSubmit={handleAddWikiArticle} className="space-y-4 text-xs">
                      
                      <div className="space-y-1.5">
                        <label className="text-slate-700 font-bold block">記事タイトル</label>
                        <input
                          type="text"
                          required
                          value={newWikiTitle}
                          onChange={(e) => setNewWikiTitle(e.target.value)}
                          placeholder="例: 会員マイページでの「ドリップ追加特典」によるサブスク継続化の原則"
                          className="w-full text-xs font-semibold rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-850 focus:ring-1 focus:ring-indigo-500 font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5 col-span-2">
                          <label className="text-slate-700 font-bold block">知見カテゴリ</label>
                          <select
                            value={newWikiCategory}
                            onChange={(e) => setNewWikiCategory(e.target.value as any)}
                            className="w-full text-xs rounded-xl border border-slate-250 px-2 py-2 bg-white text-slate-800 font-semibold cursor-pointer"
                          >
                            <option value="ファネル設計">ファネル設計ノウハウ</option>
                            <option value="UTAGE設定">UTAGE詳細システム設定</option>
                            <option value="LINE・配信">LINE公式・ステップ配信</option>
                            <option value="Stripe決済">Stripe決済・サブスクリプション</option>
                            <option value="AI活用">AIライティング・Gemini連携</option>
                            <option value="マーケティング知見">実証済みマーケティング理論</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-slate-700 font-bold block">閲覧ライセンス制限</label>
                          <select
                            value={newWikiPlan}
                            onChange={(e) => setNewWikiPlan(e.target.value as any)}
                            className="w-full text-xs rounded-xl border border-slate-250 px-2 py-2 bg-white text-emerald-800 font-black cursor-pointer"
                          >
                            <option value="Starter">Starter 以上</option>
                            <option value="Pro">Pro 以上</option>
                            <option value="Platinum">Platinum 限定</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-slate-700 font-bold block">ノウハウ寄稿者</label>
                          <input
                            type="text"
                            value={newWikiAuthor}
                            onChange={(e) => setNewWikiAuthor(e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800 font-semibold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-slate-700 font-bold block">事前抽出（リード文・抜粋）</label>
                          <input
                            type="text"
                            value={newWikiExcerpt}
                            onChange={(e) => setNewWikiExcerpt(e.target.value)}
                            placeholder="記事一覧でカードに表示される短い文章（1〜2文程度）。"
                            className="w-full text-xs rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-slate-700 font-bold block">ノウハウ・学習用ナレッジ本文 (Markdown)</label>
                        <textarea
                          rows={11}
                          required
                          value={newWikiContent}
                          onChange={(e) => setNewWikiContent(e.target.value)}
                          placeholder="### コンテンツの段階公開による利益率の最大化&#10;&#10;生徒が入塾した直後にすべての動画を渡さず、1週目にオンボーディング、2週目に実践編、などのようにドリップ公開する設定です。これにより退会率が激減します。&#10;&#10;#### 具体的な手順&#10;1. UTAGE会員サイトを選択&#10;2. 公開モジュールの制限を「登録日から7日後」などに割り当て..."
                          className="w-full text-xs font-mono rounded-xl border border-slate-250 px-3 py-2 bg-slate-50/50 text-slate-850"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10 transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>学習ノウハウ記事を即時パブリッシュする</span>
                      </button>

                    </form>
                  </div>
                </div>

                {/* Right Side: Active Wiki Articles List (6 cols) */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="text-sm font-black text-slate-900 uppercase flex items-center gap-1.5">
                        <BookOpen className="h-4.5 w-4.5 text-emerald-600" />
                        <span>配信中の知見・マーケティング攻略Wiki一覧 ({wikiArticles.length})</span>
                      </h3>
                      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed font-semibold">
                        システム全体の「学習Wiki」に登録された攻略記事です。各マニュアルの「必要講読ライセンス」を管理変更でき、プランに応じた自習アップグレード導線として活用できます。
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {wikiArticles.map((art) => (
                        <div key={art.id} className="p-5 space-y-3 hover:bg-slate-50/20 transition-colors">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 font-black">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg px-2.5 py-0.5 text-[9px] uppercase">
                                {art.category}
                              </span>
                              <span className="text-slate-400 text-[10px]">執筆: {art.author}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">{art.publishedAt}</span>
                          </div>

                          <h4 className="font-extrabold text-slate-850 text-xs text-justify">
                            {art.title}
                          </h4>
                          <p className="text-[11px] text-slate-450 leading-relaxed text-justify">
                            {art.excerpt}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-400 font-extrabold pb-0.5">閲覧対象プラン:</span>
                              <select
                                value={art.requiredPlan || 'Starter'}
                                onChange={(e) => handleUpdateWikiPlan(art.id, e.target.value as any)}
                                className={`text-[10px] rounded-lg border px-2 py-0.5 font-bold cursor-pointer shadow-3xs focus:outline-none ${
                                  art.requiredPlan === 'Platinum' 
                                    ? 'bg-rose-50 border-rose-200 text-rose-700' 
                                    : art.requiredPlan === 'Pro' 
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-750' 
                                      : 'bg-emerald-50 border-emerald-250 text-emerald-800'
                                }`}
                              >
                                <option value="Starter">🔰 Starterプラン以上</option>
                                <option value="Pro">⚡ Proプラン以上</option>
                                <option value="Platinum">👑 Platinum限定</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteWikiArticle(art.id, art.title)}
                              className="text-[10px] text-rose-650 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg px-2 py-1 cursor-pointer transition-all font-bold"
                            >
                              この記事を非公開化する
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
