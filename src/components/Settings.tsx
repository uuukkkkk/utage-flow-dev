import React, { useState } from 'react';
import { 
  Settings, Shield, Link, User, Check, RefreshCw, Key, Landmark, MailOpen, 
  Globe, Laptop, Bell, Database, DownloadCloud, UploadCloud, History, 
  Users, CheckCircle2, Layers, Sparkles, Plus, Trash2, Lock, Sliders, 
  Building, CreditCard, HelpCircle, Activity, ChevronRight 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsView() {
  const [settingsTab, setSettingsTab] = useState<'admin' | 'general'>('admin');
  const [systemMode, setSystemMode] = useState<'internal' | 'saas'>('internal');
  
  // Onboarding sequence state
  const [onboardingSteps, setOnboardingSteps] = useState([
    { id: 1, title: 'システム基本設定', desc: '管理者アカウント・送信元ドメインの検証', done: true },
    { id: 2, title: 'UTAGE API認証連携', desc: 'UTAGEシステムまたはMCP APIトークンの同期', done: true },
    { id: 3, title: 'インフラ連携 & Webhook設定', desc: 'Google Workspaceカレンダー及びSlack連携', done: false },
    { id: 4, title: '初期ドメイン & 決済検証', desc: 'Stripe Sandboxでのテスト決済接続', done: false }
  ]);

  // SaaS Tenants list
  const [tenants, setTenants] = useState([
    { id: 't-1', name: '株式会社グバ・マーケティング', plan: 'Enterprise', usersCount: 12, storage: '45.2 GB', mrr: '¥98,000', status: 'ACTIVE', key: 'ut_tenant_live_9a82f3' },
    { id: 't-2', name: 'セレーネ起業家アカデミー', plan: 'Pro', usersCount: 5, storage: '12.8 GB', mrr: '¥49,800', status: 'ACTIVE', key: 'ut_tenant_live_8c21e1' },
    { id: 't-3', name: 'UTAGE構築代行プロラボ', plan: 'Pro', usersCount: 8, storage: '24.1 GB', mrr: '¥49,800', status: 'ACTIVE', key: 'ut_tenant_live_3d75a1' },
    { id: 't-4', name: '個人サロン推進事務局', plan: 'Lite', usersCount: 2, storage: '1.5 GB', mrr: '¥19,805', status: 'PENDING', key: 'ut_tenant_live_2b88f9' },
  ]);

  // Internal team members & roles
  const [internalMembers, setInternalMembers] = useState([
    { id: 'm-1', name: '田中ディレクター (統轄管理者)', email: 'director-tanaka@example.com', role: 'Super Admin', assignedProjects: 4, status: 'ONLINE' },
    { id: 'm-2', name: '佐藤コーダー (UTAGE実装担当)', email: 'coder-sato@example.com', role: 'Technical Coder', assignedProjects: 3, status: 'ONLINE' },
    { id: 'm-3', name: '鈴木ライター (原稿コピー構成)', email: 'writer-suzuki@example.com', role: 'AI Writer', assignedProjects: 2, status: 'AWAY' },
    { id: 'm-4', name: '高橋ディレクター (顧客折衝担当)', email: 'takahashi-d@example.com', role: 'Detail Designer', assignedProjects: 1, status: 'OFFLINE' },
  ]);

  // States for adding data dynamically
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantPlan, setNewTenantPlan] = useState('Pro');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Technical Coder');

  const [lineStatus, setLineStatus] = useState<'connected' | 'disconnected'>('connected');
  const [stripeStatus, setStripeStatus] = useState<'connected' | 'disconnected'>('connected');
  const [mailStatus, setMailStatus] = useState<'connected' | 'disconnected'>('connected');
  const [isSyncing, setIsSyncing] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  // Auto-Backup configurations
  const [isAutoBackup, setIsAutoBackup] = useState(true);
  const [autoBackupTime, setAutoBackupTime] = useState('03:00');
  const [backupRetentionDays, setBackupRetentionDays] = useState(30);
  const [isGeneratingBackup, setIsGeneratingBackup] = useState(false);
  const [manualBackupSuccess, setManualBackupSuccess] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  
  const [backupHistory, setBackupHistory] = useState([
    { id: 'backup-1', timestamp: '2026-06-08 03:00:12', size: '154 KB', trigger: '自動定期', status: 'SUCCESS' },
    { id: 'backup-2', timestamp: '2026-06-09 03:00:08', size: '156 KB', trigger: '自動定期', status: 'SUCCESS' },
    { id: 'backup-current', timestamp: '2026-06-10 03:00:22', size: '158 KB', trigger: '自動定期', status: 'SUCCESS' }
  ]);

  const handleManualBackup = () => {
    setIsGeneratingBackup(true);
    setManualBackupSuccess(false);
    setTimeout(() => {
      setIsGeneratingBackup(false);
      setManualBackupSuccess(true);
      const now = new Date();
      const newBackup = {
        id: `backup-manual-${Date.now()}`,
        timestamp: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
        size: '159 KB',
        trigger: '手動要求',
        status: 'SUCCESS' as const
      };
      setBackupHistory(prev => [newBackup, ...prev]);
    }, 1500);
  };

  const handleRestore = (timestamp: string) => {
    setRestoreStatus(`復元プログラム実行中... ${timestamp} 時点のアーカイブを展開しています。`);
    setTimeout(() => {
      setRestoreStatus(null);
      alert(`🎉 復元が正常に完了しました！\n${timestamp} のバックアップアーカイブに基づいて、UTAGE Hub上の全クライアント要件、案件ステータス、および変更ログを完全に復旧させました。`);
    }, 1800);
  };

  // UTAGE MCP states
  const [mcpStatus, setMcpStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('connected');
  const [mcpEndpoint, setMcpEndpoint] = useState('https://docs.utage-system.com/api/mcp/v2');
  const [mcpToken, setMcpToken] = useState('ut_mcp_live_e992b8d52ca63f01bcfcf');
  const [showToken, setShowToken] = useState(false);
  
  // UTAGE Auto-Sync states
  const [isMcpAutoSync, setIsMcpAutoSync] = useState(true);
  const [mcpAutoSyncTime, setMcpAutoSyncTime] = useState('02:00');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const handleTestConnection = () => {
    if (!mcpEndpoint.trim() || !mcpToken.trim()) {
      setMcpStatus('error');
      return;
    }
    setMcpStatus('connecting');
    setTimeout(() => {
      if (mcpEndpoint.startsWith('http') && mcpToken.length > 8) {
        setMcpStatus('connected');
      } else {
        setMcpStatus('error');
      }
    }, 1500);
  };

  const handleResetConnection = () => {
    setMcpStatus('disconnected');
    setMcpEndpoint('');
    setMcpToken('');
  };

  const toggleOnboarding = (id: number) => {
    setOnboardingSteps(prev => prev.map(step => 
      step.id === id ? { ...step, done: !step.done } : step
    ));
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    const newTenant = {
      id: `t-${Date.now()}`,
      name: newTenantName,
      plan: newTenantPlan,
      usersCount: 1,
      storage: '0.1 GB',
      mrr: newTenantPlan === 'Enterprise' ? '¥98,000' : newTenantPlan === 'Pro' ? '¥49,800' : '¥19,805',
      status: 'ACTIVE',
      key: `ut_tenant_live_${Math.random().toString(36).substring(2, 8)}`
    };
    setTenants(prev => [...prev, newTenant]);
    setNewTenantName('');
    alert(`🎉 テナンスペース「${newTenantName}」を正常に自動切り出し。接続用シークレットキーが発行されました。`);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    const newMember = {
      id: `m-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      assignedProjects: 0,
      status: 'ONLINE'
    };
    setInternalMembers(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
    alert(`👤 内部メンバー「${newMemberName}」を組織権限 [${newMemberRole}] で登録しました。`);
  };

  const handleDeleteTenant = (id: string, name: string) => {
    if (confirm(`⚠️ テナント「${name}」を完全に削除(アカウント解約)しますか？この操作により、他社環境、関連要件マッピング及びデータは永久回復不能になります。`)) {
      setTenants(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`👤 メンバー「${name}」のアクセス権限を剥奪しますか？`)) {
      setInternalMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
        <button
          onClick={() => setSettingsTab('admin')}
          className={`px-5 py-3 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            settingsTab === 'admin'
              ? 'border-indigo-600 text-indigo-755 bg-indigo-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>🔴 総合管理者 ＆ SaaS管理プラットフォーム</span>
        </button>
        <button
          onClick={() => setSettingsTab('general')}
          className={`px-5 py-3 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            settingsTab === 'general'
              ? 'border-indigo-600 text-indigo-755 bg-indigo-50/10'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>⚙️ システム基本設定 ＆ 外部API連携</span>
        </button>
      </div>

      {settingsTab === 'admin' ? (
        <div className="space-y-6">
          {/* Onboarding Wizard Setup Step */}
          <div className="bg-[#0f172a] text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest bg-slate-800 px-2.5 py-1 rounded-md">INITIAL WIZARD</span>
                <h3 className="text-xl font-black mt-2 text-white">管理者最初期登録 ＆ システム有効化（オンボーディング）</h3>
                <p className="text-slate-400 text-xs mt-1">
                  本システムを新しく導入した際、総合管理者が最初に行うべき4大セットアップタスクです。チェックを有効にして進行してください。
                </p>
              </div>
              <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl text-center shrink-0">
                <span className="block text-[9px] text-slate-400 font-bold uppercase">有効化プロセス</span>
                <strong className="text-lg font-black text-indigo-300">
                  {onboardingSteps.filter(s => s.done).length} / {onboardingSteps.length} 完了
                </strong>
              </div>
            </div>

            {/* Checklist Step UI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {onboardingSteps.map((step) => (
                <div 
                  key={step.id} 
                  onClick={() => toggleOnboarding(step.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    step.done 
                      ? 'bg-indigo-950/40 border-indigo-500/45 text-slate-100 shadow-[0_2px_12px_-3px_rgba(99,102,241,0.15)]' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-450'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-indigo-400">STEP 0{step.id}</span>
                      {step.done ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 fill-indigo-500/10" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-slate-700" />
                      )}
                    </div>
                    <h4 className="text-xs font-black mt-1.5">{step.title}</h4>
                    <p className="text-[10px] text-slate-400 leading-normal">{step.desc}</p>
                  </div>
                  <div className="mt-3 text-[9px] text-right">
                    {step.done ? (
                      <span className="text-indigo-300 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md">セットアップ完了</span>
                    ) : (
                      <span className="text-slate-500 font-bold hover:text-slate-350">未完了（タップで完了）</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Mode Switch Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-3xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <Sliders className="h-4.5 w-4.5 text-indigo-600" />
                  システム運用モード設定（内部組織 vs. マルチテナントSaaS化）
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  自社案件の進行管理・ディレクション用途か、多数の企業を管理するSaaSビジネス基盤用途かで、システム全体の機能配備を切り替えます。
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="bg-slate-100 p-1.5 rounded-2xl flex border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSystemMode('internal')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    systemMode === 'internal'
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  自社・内部アカウント運用
                </button>
                <button
                  type="button"
                  onClick={() => setSystemMode('saas')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    systemMode === 'saas'
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                  マルチテナントSaaS運用
                </button>
              </div>
            </div>

            {/* Mode-specific Dynamic Dashboards */}
            {systemMode === 'internal' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Members and hierarchy roles */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase">社内ディレクター ＆ 専門クルー組織（役割・権限）</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">自社の構築案件ごとにアサイン可能な常駐メンバー、及びその職能・セキュアパーミッションの定義です。</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-3xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-500 uppercase">
                          <th className="py-2.5 px-4">登録氏名</th>
                          <th className="py-2.5 px-3">役割（権限グループ）</th>
                          <th className="py-2.5 px-3">ログインメールアドレス</th>
                          <th className="py-2.5 px-3 text-center">割当案件</th>
                          <th className="py-2.5 px-3">稼働状況</th>
                          <th className="py-2.5 px-4 text-center">管理</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {internalMembers.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-55/30 transition-colors">
                            <td className="py-3 px-4 text-slate-900 font-bold">{m.name}</td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black ${
                                m.role === 'Super Admin' 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                  : m.role === 'Technical Coder' 
                                  ? 'bg-cyan-105/90 text-cyan-800 border border-cyan-200' 
                                  : m.role === 'AI Writer' 
                                  ? 'bg-indigo-100 text-indigo-780 border border-indigo-200' 
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {m.role}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{m.email}</td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{m.assignedProjects} 案件</td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${
                                m.status === 'ONLINE' ? 'text-emerald-600' : m.status === 'AWAY' ? 'text-amber-500' : 'text-slate-400'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  m.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : m.status === 'AWAY' ? 'bg-amber-400' : 'bg-slate-300'
                                }`} />
                                {m.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {m.role !== 'Super Admin' ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMember(m.id, m.name)}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                                >
                                  除外
                                </button>
                              ) : (
                                <span className="text-[9px] font-bold text-slate-404">主管理者</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Member inline form */}
                  <form onSubmit={handleAddMember} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="block text-[8px] text-slate-405 font-bold uppercase">新メンバー氏名</label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="例: 佐々木 (ライター)"
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                        required
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="block text-[8px] text-slate-405 font-bold uppercase">ログイン用メールアドレス</label>
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="sasaki@example.com"
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                        required
                      />
                    </div>
                    <div className="w-full sm:w-44 space-y-1">
                      <label className="block text-[8px] text-slate-405 font-bold uppercase">職能割当権限</label>
                      <select
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-200 px-2 py-2 bg-white text-slate-800 cursor-pointer"
                      >
                        <option value="Technical Coder">Technical Coder (コーダー)</option>
                        <option value="AI Writer">AI Writer (コピーライティング)</option>
                        <option value="Detail Designer">Detail Designer (ディレクター)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      新規登録
                    </button>
                  </form>
                </div>

                {/* 2. Internal Resource Meter widget */}
                <div className="bg-slate-50 border border-slate-205 p-5 rounded-3xl space-y-4">
                  <div className="border-b border-slate-200 pb-2.5">
                    <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">INTERNAL INFRASTRUCTURE</span>
                    <h4 className="text-xs font-black text-slate-800 mt-1 uppercase">社内ディレクションインプラリソース</h4>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span className="text-slate-600">組織メモリ総量保管 (Firestore)</span>
                        <span className="text-slate-800 font-mono">1.2 MB / 100 MB</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[1.2%] h-full bg-indigo-600 rounded-full" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between font-bold text-[11px]">
                        <span className="text-slate-600">Gemini API クォータ制限（今月）</span>
                        <span className="text-slate-800 font-mono">4,120 / 100,000 reqs</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="w-[4.1%] h-full bg-indigo-600 rounded-full" />
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50/50 border border-indigo-150 rounded-2xl block text-[10px] text-slate-550 leading-relaxed font-semibold">
                      <p className="text-indigo-755 font-black flex items-center gap-1 mb-1">
                        <Shield className="h-3.5 w-3.5 text-indigo-505" />
                        一般組織内ガバナンス
                      </p>
                      自社の複数案件・チームメンバーが個別のUTAGEに触れる際、セキュリティ制限をかけた専用トークンが提供されることで、他クローズド案件の機密を完全保護します。
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Multi-tenant Client Organizations List */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase">SaaSテナント空間 ＆ 顧客（企業）マルチ管理</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">本システムをSaaSライセンス販売したご契約中の他組織（テナント環境）への即時権限切り出しと、稼働監査です。</p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-3xs">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-black text-slate-500 uppercase">
                          <th className="py-2.5 px-4">ご契約テナント（企業名）</th>
                          <th className="py-2.5 px-3">プラン</th>
                          <th className="py-2.5 px-3 text-center">登録者数</th>
                          <th className="py-2.5 px-3">ディスク使用容量</th>
                          <th className="py-2.5 px-3">発生課金額 (MRR)</th>
                          <th className="py-2.5 px-3">テナント認証キー</th>
                          <th className="py-2.5 px-4 text-center">強制削除</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {tenants.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-55/30 transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-1.5">
                              <Building className="h-3.5 w-3.5 text-slate-400" />
                              {t.name}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black ${
                                t.plan === 'Enterprise' 
                                  ? 'bg-indigo-100 text-indigo-755 border border-indigo-200 animate-pulse' 
                                  : t.plan === 'Pro' 
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-150' 
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {t.plan}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{t.usersCount} 名</td>
                            <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{t.storage}</td>
                            <td className="py-3 px-3 text-emerald-700 font-bold">{t.mrr} <span className="text-[8px] text-slate-400 font-normal">/月</span></td>
                            <td className="py-3 px-3">
                              <span className="font-mono text-[10px] text-indigo-650 bg-indigo-50 border border-indigo-150/40 rounded px-1.5 py-0.5 select-all">
                                {t.key}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleDeleteTenant(t.id, t.name)}
                                className="text-red-500 hover:text-red-700 font-bold text-[10px] hover:underline cursor-pointer"
                              >
                                契約解除
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Add Tenant Form */}
                  <form onSubmit={handleAddTenant} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="block text-[8px] text-slate-405 font-bold uppercase">新規契約テナント（企業・代表名）</label>
                      <input
                        type="text"
                        value={newTenantName}
                        onChange={(e) => setNewTenantName(e.target.value)}
                        placeholder="例: 株式会社エッジプラス・クリエイティブ / 鈴木"
                        className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 bg-white text-slate-800"
                        required
                      />
                    </div>
                    <div className="w-full sm:w-44 space-y-1">
                      <label className="block text-[8px] text-slate-405 font-bold uppercase">契約プランライセンス</label>
                      <select
                        value={newTenantPlan}
                        onChange={(e) => setNewTenantPlan(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-200 px-2 py-2 bg-white text-slate-800 cursor-pointer"
                      >
                        <option value="Lite">Lite プラン (月額 ¥19,800)</option>
                        <option value="Pro">Pro プラン (月額 ¥49,800)</option>
                        <option value="Enterprise">Enterprise プラン (月額 ¥98,000)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-755 text-white text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      自動割出 ➔
                    </button>
                  </form>
                </div>

                {/* 2. SaaS platform MRR metrics widget */}
                <div className="bg-[#0f172a] text-white p-5 rounded-3xl flex flex-col justify-between border border-slate-800 shadow-xl space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-4.5 w-4.5 text-indigo-400" />
                      <span className="text-[9px] text-indigo-300 font-extrabold tracking-wider uppercase">SAAS REVENUE SUMMARY</span>
                    </div>
                    <h4 className="text-base font-black text-white mt-1.5 uppercase">プラットフォーム総合課金指標</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Stripe Billing APIによって自動引き落としされる想定MRR総量です。</p>
                  </div>

                  <div className="space-y-3.5 pt-1.5">
                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                      <span className="text-[8px] text-slate-405 uppercase font-bold block">プラットフォーム合算 MRR (月次収益)</span>
                      <strong className="text-xl font-black text-emerald-400 tracking-tight block mt-1">
                        ¥217,411
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-400">
                      <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                        <span>アクティブ契約</span>
                        <p className="text-xs font-black text-slate-105 mt-0.5">3件完了 / 4件</p>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                        <span>無料トライアル</span>
                        <p className="text-xs font-black text-slate-105 mt-0.5">1件 / 猶予14日</p>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-405 leading-relaxed bg-slate-900/40 p-3 rounded-2xl space-y-1.5 border border-slate-800/60 font-semibold">
                      <p className="text-indigo-300 font-black flex items-center gap-1">
                        <Lock className="h-3 text-indigo-400 shrink-0" />
                        SaaS管理者システム監査ログ
                      </p>
                      <ul className="list-disc pl-3 text-[9px] space-y-1">
                        <li>2026-06-10 09:12 - 株式会社グバ... LINE API同期正常</li>
                        <li>2026-06-09 23:44 - 新規テナント登録 招待リンク送出</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Org Workspace details (Duplicate original to keep Settings state clean) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
              <Shield className="h-4.5 w-4.5 text-indigo-600" />
              総合開発者アカウント統合・MCP権限認証
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">ワークスペース名（組織名）</label>
                <input
                  type="text"
                  defaultValue="UTAGE構築コンサルティング・日本事務局"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50 text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">統括ディレクターメール</label>
                <input
                  type="email"
                  defaultValue="c.thedots.2005@gmail.com"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50 text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
              ※ システムを完全にSaaS化する場合は、各テナントアカウントごとにGCP（Google Cloud Platform）のOAuthクライアントを個別に払い出す、またはマルチテナント対応の共有OAuth認証で運用します。詳細は開発仕様書（使い方マニュアル5章）を参照してください。
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bento Header Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-[#0f172a] text-white p-6 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest bg-slate-800 px-2.5 py-1 rounded-md">CORE SYSTEM CONFIG</span>
                <h2 className="text-2xl font-black tracking-tight mt-3">システム接続 ＆ アカウント設定</h2>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-xl">
                  UTAGEの外部プラットフォーム連携、安全な配信システムトークン、および本開発スペースにおけるシステム権限管理をおこないます。
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-400 border-t border-slate-800/80 pt-3">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                <span>すべてのAPI接続はTLS1.3トークン認証により、クライアントデータと厳重に切り離して暗号化保持されています。</span>
              </div>
            </div>

            {/* Sync Trigger Bento Box */}
            <div className="bg-slate-50 border border-slate-205 p-6 rounded-3xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">REALTIME STATUS</span>
                <h3 className="text-base font-bold text-slate-800 mt-2">API 稼働ステータス</h3>
                <p className="text-slate-500 text-[11px] mt-1">外部の各マーケティング基盤が稼働しているかリアルタイム確認します。</p>
              </div>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? '接続の整合性を確認中...' : '接続ステータス再取得'}</span>
              </button>
            </div>
          </div>

          {/* Main Settings Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Side: Detail configurations (2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* API platform connections */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
                  <Link className="h-4.5 w-4.5 text-indigo-600" />
                  UTAGE 外部マーケティングプラットフォーム API連携
                </h3>

                {/* Line official */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-55/35 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm select-none">
                      L
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">LINE公式アカウント / Messaging API</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">時間連動ステップLINE自動配信、お申込時のリマインダー連携に必須です。</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {lineStatus === 'connected' ? (
                      <>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-lg">
                          <Check className="h-3 w-3" /> 接続維持中
                        </span>
                        <button onClick={() => setLineStatus('disconnected')} className="text-[10px] text-red-500 hover:text-red-700 hover:underline cursor-pointer font-bold">解除する</button>
                      </>
                    ) : (
                      <button onClick={() => setLineStatus('connected')} className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-755 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer">今すぐ接続</button>
                    )}
                  </div>
                </div>

                {/* Stripe Payment */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-55/35 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm select-none">
                      S
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Stripe ゲートウェイ 決済連携</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">オンライン決済、追加オファーアップセル、継続サブスクに直結します。</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {stripeStatus === 'connected' ? (
                      <>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-lg">
                          <Check className="h-3 w-3" /> 接続維持中
                        </span>
                        <button onClick={() => setStripeStatus('disconnected')} className="text-[10px] text-red-500 hover:text-red-700 hover:underline cursor-pointer font-bold">解除する</button>
                      </>
                    ) : (
                      <button onClick={() => setStripeStatus('connected')} className="px-3 py-1.5 bg-indigo-655 hover:bg-indigo-755 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer">今すぐ接続</button>
                    )}
                  </div>
                </div>

                {/* Email Twilio SendGrid */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-105 bg-slate-50/50 hover:bg-slate-55/35 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm select-none">
                      M
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">大量配信専用 SMTP (SendGrid / AWS SES)</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">お申込直後のログイン自動メールを、最も高い迷惑メール回避率で自動送出します。</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {mailStatus === 'connected' ? (
                      <>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold bg-emerald-5 border border-emerald-150 px-2.5 py-1 rounded-lg">
                          <Check className="h-3 w-3" /> 接続維持中
                        </span>
                        <button onClick={() => setMailStatus('disconnected')} className="text-[10px] text-red-500 hover:text-red-700 hover:underline cursor-pointer font-bold">解除する</button>
                      </>
                    ) : (
                      <button onClick={() => setMailStatus('connected')} className="px-3 py-1.5 bg-indigo-655 hover:bg-indigo-755 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer">今すぐ接続</button>
                    )}
                  </div>
                </div>
              </div>

              {/* UTAGE MCP API Integration Panel */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                    <Globe className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                    UTAGE MCP (Model Context Protocol) 統合API連携
                  </h3>
                  <a 
                    href="https://docs.utage-system.com/introduction" 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="text-[10px] font-black text-indigo-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>公式開発API解説ドキュメント</span>
                    <span>→</span>
                  </a>
                </div>
                
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  UTAGE構築プロフェッショナルのためのMCP API連携設定です。UTAGE開発用のセキュアエンドポイントとマッピング鍵を同期させることで、ファネルステップのリアルタイム稼働監視やステップメールの一括監視、AI構成案のUTAGE直接構築（マッピング連携）が有効化されます。
                </p>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">UTAGE MCP 接続エンドポイント (URL)</label>
                      <input
                        type="text"
                        value={mcpEndpoint}
                        onChange={(e) => setMcpEndpoint(e.target.value)}
                        placeholder="https://your-domain.utage-system.com/api/mcp/v1"
                        className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50 text-slate-800 font-mono tracking-tight focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">MCPシステムセキュリティ認証トークン (Security Secret)</label>
                      <div className="relative">
                        <input
                          type={showToken ? "text" : "password"}
                          value={mcpToken}
                          onChange={(e) => setMcpToken(e.target.value)}
                          placeholder="ut_mcp_live_xxxxxxxxxxxxxxxx"
                          className="w-full text-xs rounded-xl border border-slate-200 pl-3 pr-10 py-2 bg-slate-50/50 text-slate-800 font-mono tracking-wider focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-[10px] font-black cursor-pointer bg-transparent border-none"
                        >
                          {showToken ? "非表示" : "表示"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* UTAGE Auto Sync Schedule Options */}
                  <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          プロジェクト情報の自動定期同期
                        </h4>
                        <p className="text-[10px] text-slate-450 font-medium leading-normal">
                          指定した時刻に1日1回、UTAGE側の最新プロジェクト情報やファネルステータスを自動的にバックグラウンド同期します。
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={isMcpAutoSync} 
                          onChange={(e) => setIsMcpAutoSync(e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650"></div>
                      </label>
                    </div>

                    {isMcpAutoSync && (
                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">同期実行時刻:</span>
                          <input
                            type="time"
                            value={mcpAutoSyncTime}
                            onChange={(e) => setMcpAutoSyncTime(e.target.value)}
                            className="rounded-lg border border-slate-250 px-2.5 py-1 bg-white text-slate-800 text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-150/50 rounded-lg px-2 py-0.5">
                          毎日 {mcpAutoSyncTime} に、UTAGE APIとの整合チェックを自動バックグラウンド実行します。
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons row */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={mcpStatus === 'connecting'}
                      className="px-4.5 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${mcpStatus === 'connecting' ? 'animate-spin' : ''}`} />
                      <span>{mcpStatus === 'connecting' ? '接続検証中...' : '接続確認テストを実行する'}</span>
                    </button>
                    
                    {mcpStatus !== 'disconnected' && (
                      <button
                        type="button"
                        onClick={handleResetConnection}
                        className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black rounded-xl border border-slate-250 cursor-pointer transition-all"
                      >
                        設定をリセット
                      </button>
                    )}
                  </div>

                  {/* Status Alert block */}
                  {mcpStatus === 'connected' && (
                    <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <strong className="font-extrabold flex items-center gap-1">
                          <Check className="h-4 w-4 text-emerald-600" />
                          接続中 - UTAGE MCP認定API認証に成功しました
                        </strong>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[10px] font-mono text-emerald-700 font-black">
                        <div className="bg-white/50 px-2.5 py-1.5 rounded border border-emerald-100/80">
                          <p className="text-[8px] text-slate-400">認証ステータス</p>
                          <p>ONLINE (ACTIVE)</p>
                        </div>
                        <div className="bg-white/50 px-2.5 py-1.5 rounded border border-emerald-100/80">
                          <p className="text-[8px] text-slate-400">応答速度 (PING)</p>
                          <p>38 ms (安定的)</p>
                        </div>
                        <div className="bg-white/50 px-2.5 py-1.5 rounded border border-emerald-100/80">
                          <p className="text-[8px] text-slate-400">マッピングAPI Ver</p>
                          <p>v2.14.3 (最新)</p>
                        </div>
                        <div className="bg-white/50 px-2.5 py-1.5 rounded border border-emerald-100/80">
                          <p className="text-[8px] text-slate-400">権限レベル</p>
                          <p>PRO_DEVELOPER</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {mcpStatus === 'error' && (
                    <div className="p-4 bg-rose-50 text-rose-800 border border-rose-150 rounded-xl space-y-1 text-xs">
                      <strong className="font-extrabold block">❌ APIトークン連携認証エラー</strong>
                      <p className="text-[11px] text-slate-500">
                        指定されたエンドポイントまたはセキュリティ認証トークンの形式が正しくない、もしくは認証キーが無効です。設定を入力した部分を見直してください。
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Real-time Notification System Adjustment Panel */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
                  <Bell className="h-4.5 w-4.5 text-indigo-650 animate-pulse" />
                  リアルタイム通知システム ＆ 推進督促リマインダー調整
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  設定された期限警告や、アサインされている担当クルーへのSlack/LINE WORKS向け各種Webhook通知の送出基準・トリガーを最適化します。
                </p>

                <div className="space-y-3.5">
                  {/* Toggle 1 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-3.5">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900">🚨 マイルストーン期限日アラート（本日・3日前）自動判定</h4>
                      <p className="text-[10px] text-slate-505 font-semibold leading-normal">基準日（2026年6月10日）をベースに、3日以内に期日を迎えるタスクを危険マイルストーンとして全画面に一斉警告表示します。</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650"></div>
                    </label>
                  </div>

                  {/* Toggle 2 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-3.5">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900">💬 Slack / LINE WORKS 自動メンション連携</h4>
                      <p className="text-[10px] text-slate-505 font-semibold leading-normal">期限間近の通知で「即時リマインド送信」が押下された場合、各タスクにアサインされた担当者宛てに自動でPushメンションをおこなう統合。現プロジェクトのみ適用します。</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650"></div>
                    </label>
                  </div>

                  {/* Test alert trigger */}
                  <div className="pt-2 flex items-center gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setTestNotificationSent(true);
                        setTimeout(() => setTestNotificationSent(false), 4000);
                      }}
                      className="px-4 py-2.5 bg-indigo-55/80 hover:bg-indigo-100 text-indigo-700 text-xs font-black rounded-xl border border-indigo-200 cursor-pointer transition-all shadow-3xs"
                    >
                      🔔 テスト通知を今すぐ送信してみる
                    </button>

                    {testNotificationSent && (
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-150 rounded-lg px-3 py-1.5 animate-bounce flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>【テスト通知】接続検証は正常です。SlackおよびLINE WORKS宛ての経路疎通に成功しました！</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Auto Backup Panel */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)]">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
                  <Database className="h-4.5 w-4.5 text-indigo-600" />
                  自動バックアップ / データ耐久性 ＆ 災害復旧
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  UTAGE Hub に登録されている全クライアントマッピング要件、クルー割当マイルストーン、および決定要望ログを一括で保管します。
                </p>

                <div className="space-y-4">
                  {/* Daily schedule item */}
                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-550 animate-pulse shrink-0" />
                          デイリー自動バックアップスケジュール
                        </h4>
                        <p className="text-[10px] text-slate-455 font-semibold leading-normal">
                          1日1回、指定した深夜帯にシステム内の状態スナップショットを自動エクスポートしてバックアップ世代に保管します。
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input 
                          type="checkbox" 
                          checked={isAutoBackup} 
                          onChange={(e) => setIsAutoBackup(e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650"></div>
                      </label>
                    </div>

                    {isAutoBackup && (
                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">実行時刻設定:</span>
                          <input
                            type="time"
                            value={autoBackupTime}
                            onChange={(e) => setAutoBackupTime(e.target.value)}
                            className="rounded-lg border border-slate-250 px-2.5 py-1 bg-white text-slate-805 text-xs font-mono font-bold focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                          />
                        </div>
                        <span className="text-[10px] font-black text-indigo-650 bg-indigo-50 border border-indigo-150/50 rounded-lg px-2 py-0.5">
                          毎日 {autoBackupTime} に自動作成し、世代保持を行います。
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Manual Backup */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleManualBackup}
                      disabled={isGeneratingBackup}
                      className="px-4 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <DownloadCloud className={`h-3.5 w-3.5 ${isGeneratingBackup ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingBackup ? 'バックアップ生成中...' : '今すぐ手動バックアップを作成'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Account status */}
            <div className="space-y-6">
              <div className="bg-[#0f172a] text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between h-full space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-wider">
                    <User className="h-4.5 w-4.5 text-indigo-400" />
                    運用者アカウント概要
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-slate-950/65 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">現在の登録プラン</p>
                      <p className="text-xs font-black text-indigo-400 mt-1">
                        エージェンシー・プラチナプラン
                      </p>
                    </div>

                    <div className="bg-slate-950/65 p-3 rounded-xl border border-slate-800/80">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">お支払ステータス</p>
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-400 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        正常支払完了 (Stripe同期中)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/60 text-[10px] text-slate-400 leading-relaxed">
                  <p>※ プラチナプランのご契約により、複数クライアントに対する独自ドメイン設置およびStripe決済のSandbox並行デバッグ権限が付与されています。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}