import React, { useState } from 'react';
import { AutomationLog, Project } from '../types';
import { 
  Search, 
  Activity, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  FileCode, 
  Trash2, 
  Dribbble, 
  RefreshCw, 
  Play, 
  Layers, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

interface AutomationLogsViewProps {
  logs: AutomationLog[];
  onAddLog: (newLog: AutomationLog) => void;
  onClearLogs: () => void;
  projects: Project[];
}

export default function AutomationLogsView({ 
  logs, 
  onAddLog, 
  onClearLogs, 
  projects 
}: AutomationLogsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  
  // Track expanded log details
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({});
  
  // Copy to clipboard notification state
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  // Simulation Sandbox Form state
  const [simProject, setSimProject] = useState<string>(projects[0]?.id || '');
  const [simType, setSimType] = useState<string>('optin');

  const toggleExpand = (id: string) => {
    setExpandedLogIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyLogs = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLogId(id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  // Generate a premium simulated log entry in the sandbox
  const handleTriggerSimulation = () => {
    const selectedProj = projects.find(p => p.id === simProject) || projects[0];
    const clientName = selectedProj ? selectedProj.clientName : "一般アクセス";
    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    let newLog: AutomationLog;

    switch (simType) {
      case 'optin':
        newLog = {
          id: `log-${Date.now()}`,
          projectId: selectedProj?.id,
          projectName: clientName,
          action: 'Webhook - LINEオプトイン追加',
          statusCode: 200,
          status: 'success',
          timestamp: timeStr,
          message: `${clientName}：LINE公式アカウントへのオプトイン（友だち新規登録）を検出。UTAGE自動ステップ配信をトリガーしました。`,
          details: JSON.stringify({
            event_type: "utage.line.optin",
            api_version: "v1.2",
            payload: {
              source: "line_oa",
              client_id: selectedProj?.clientId || "c-unknown",
              client_name: clientName,
              user_status: "active_subscriber",
              tag_associated: "新規獲得リード_自動配信中"
            },
            http_response: {
              status: 200,
              message: "OK",
              handler: "line_webhook_controller"
            }
          }, null, 2)
        };
        break;
      case 'payment':
        newLog = {
          id: `log-${Date.now()}`,
          projectId: selectedProj?.id,
          projectName: clientName,
          action: 'Stripe API - 決済完了同期',
          statusCode: 201,
          status: 'success',
          timestamp: timeStr,
          message: `${clientName}：Stripeによる ${selectedProj?.revenue || "50,000円"} の決済完了を受信。購入者自動タグ追加および会員サイトアクセス権限を付与しました。`,
          details: JSON.stringify({
            event_type: "stripe.charge.succeeded",
            api_version: "v2.0",
            payload: {
              gateway: "stripe_v3",
              amount_str: selectedProj?.revenue || "50,050円",
              currency: "jpy",
              membership_level_created: "unlimited_pro",
              associated_email: "client-customer@test-email.com"
            },
            http_response: {
              status: 201,
              message: "CREATED",
              server_node: "aws-tokyo-edge-3"
            }
          }, null, 2)
        };
        break;
      case 'validation_error':
        newLog = {
          id: `log-${Date.now()}`,
          projectId: selectedProj?.id,
          projectName: clientName,
          action: 'UTAGE Form Validation Failed',
          statusCode: 422,
          status: 'warning',
          timestamp: timeStr,
          message: `${clientName}：APIパラメータバリデーションに失敗しました（必須タグ ID が指定されていません）。`,
          details: JSON.stringify({
            event_type: "utage.form.binding_error",
            api_version: "v1.2",
            error: {
              code: "VALIDATION_FAILED",
              field: "target_tag_id",
              reason: "Tag ID was requested but provided as null or undefined. Webhooks require a fallback mapping target."
            },
            http_response: {
              status: 422,
              message: "UNPROCESSABLE_ENTITY",
              action_required: "UTAGE管理盤 > 開発連携タグの設定を修正してください。"
            }
          }, null, 2)
        };
        break;
      case 'dns_error':
        newLog = {
          id: `log-${Date.now()}`,
          projectId: selectedProj?.id,
          projectName: clientName,
          action: 'UTAGE Cloud API Call Timeout',
          statusCode: 502,
          status: 'error',
          timestamp: timeStr,
          message: `接続失敗：UTAGEサブドメインの接続解決中にゲートウェイ 502 Bad Gateway タイムアウト(3000ms)が発生しました。システムが自動でキューに再試行を登録しました。`,
          details: JSON.stringify({
            event_type: "http.gateway_timeout",
            api_version: "v1.2",
            connection: {
              target_subdomain: "dots-direction",
              dns_resolution: "FAILED",
              latency_ms: 3005,
              requeue_attempt: 1,
              max_retries: 3
            },
            http_response: {
              status: 502,
              message: "BAD_GATEWAY",
              error: "GATEWAY_TIMEOUT"
            }
          }, null, 2)
        };
        break;
      default:
        return;
    }

    onAddLog(newLog);
  };

  // Perform filtering
  const filteredLogs = logs.filter(log => {
    // Search filter
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch = 
      log.action.toLowerCase().includes(lowerSearch) ||
      log.message.toLowerCase().includes(lowerSearch) ||
      (log.projectName && log.projectName.toLowerCase().includes(lowerSearch)) ||
      log.statusCode.toString().includes(lowerSearch);

    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || 
      log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate high-level stats indicators
  const totalCalls = logs.length;
  const successCount = logs.filter(l => l.status === 'success').length;
  const warningCount = logs.filter(l => l.status === 'warning').length;
  const errorCount = logs.filter(l => l.status === 'error').length;
  const successRate = totalCalls > 0 ? Math.round((successCount / totalCalls) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Overview Cards Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total calls */}
        <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">総APIコール・連携回数</p>
            <h4 className="text-2xl font-black mt-0.5 text-slate-800">{totalCalls} 回</h4>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">正常完了率 (Status 2xx)</p>
            <h4 className="text-2xl font-black mt-0.5 text-emerald-600">{successRate}%</h4>
          </div>
        </div>

        {/* Warnings */}
        <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">認証警告・バリデーション警告</p>
            <h4 className="text-2xl font-black mt-0.5 text-amber-600">{warningCount} 件</h4>
          </div>
        </div>

        {/* Error count */}
        <div className="bg-white rounded-2xl border border-slate-200/85 p-5 shadow-xs flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">連携エラー件数 (5xx/4xx)</p>
            <h4 className="text-2xl font-black mt-0.5 text-rose-600">{errorCount} 件</h4>
          </div>
        </div>
      </div>

      {/* Main Sandbox & Log Core row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Chronological Logs list (cols-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-500" />
                UTAGE 連携活動履歴（リアルタイム監査ログ）
              </h3>
              <p className="text-[10px] text-slate-450 mt-0.5">UTAGE API、Webhook、Stripe、LINEの相互アクションをタイムスタンプ順に常時監視します。</p>
            </div>

            <button
              onClick={onClearLogs}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 p-2 border border-rose-100 hover:bg-rose-50 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>ログ履歴を初期化</span>
            </button>
          </div>

          {/* Tab Toolbar Filter bar */}
          <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-150 flex flex-col sm:flex-row gap-3">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="アクション名、ステータスコード、メッセージ等で検索..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:border-indigo-500 focus:outline-hidden font-medium text-slate-800"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 bg-white border border-slate-200/80 p-0.5 rounded-xl shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                すべて ({logs.length})
              </button>
              <button
                onClick={() => setStatusFilter('success')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'success'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                正常 ({successCount})
              </button>
              <button
                onClick={() => setStatusFilter('warning')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'warning'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                警告 ({warningCount})
              </button>
              <button
                onClick={() => setStatusFilter('error')}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'error'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                エラー ({errorCount})
              </button>
            </div>
          </div>

          {/* Chronological Table */}
          <div className="divide-y divide-slate-100 overflow-y-auto">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const isExpanded = !!expandedLogIds[log.id];
                const isCopied = copiedLogId === log.id;

                // Status configuration styles
                let statusBadgeBg = "bg-emerald-50 text-emerald-700 border-emerald-150";
                let statusIcon = <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />;
                if (log.status === 'warning') {
                  statusBadgeBg = "bg-amber-50 text-amber-700 border-amber-200";
                  statusIcon = <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />;
                } else if (log.status === 'error') {
                  statusBadgeBg = "bg-rose-50 text-rose-700 border-rose-150";
                  statusIcon = <XCircle className="h-4.5 w-4.5 text-rose-500" />;
                }

                return (
                  <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    {/* Main Row Content */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Status Icon Indicator */}
                        <div className="mt-0.5 shrink-0">
                          {statusIcon}
                        </div>

                        {/* Middle textual block */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusBadgeBg}`}>
                              HTTP {log.statusCode}
                            </span>
                            <span className="font-extrabold text-[#1f2937] text-xs">
                              {log.action}
                            </span>
                            {log.projectName && (
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-205 font-bold">
                                {log.projectName}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-slate-600 leading-relaxed text-[11.5px] font-medium break-all">
                            {log.message}
                          </p>
                        </div>
                      </div>

                      {/* Right Meta Column */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 md:pl-4">
                        <span className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">
                          {log.timestamp}
                        </span>

                        <div className="flex items-center gap-1">
                          {log.details && (
                            <button
                              onClick={() => toggleExpand(log.id)}
                              className="text-[10.5px] font-bold text-indigo-600 hover:text-indigo-850 bg-indigo-50/70 hover:bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <span>{isExpanded ? 'ペイロードを隠す' : 'JSONペイロード'}</span>
                              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable JSON details */}
                    {isExpanded && log.details && (
                      <div className="mt-3 bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-inner relative">
                        <div className="absolute right-4 top-3 flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLogs(log.id, log.details || "")}
                            className="p-1 px-2 rounded-md bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                            <span>{isCopied ? 'コピー完了' : 'Copy Payload'}</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                          <FileCode className="h-3 w-3 text-indigo-400" />
                          <span>REST Response Payload (application/json)</span>
                        </div>
                        <pre className="text-[10.5px] font-mono text-indigo-200/90 whitespace-pre overflow-x-auto selection:bg-indigo-500/20 leading-relaxed focus:outline-hidden">
                          {log.details}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-3">
                <Activity className="h-8 w-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold">絞り込み条件に一致するログが存在しません</p>
                <p className="text-[10px]">検索キーワード、またはステータスフィルターを変更してください。</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Log Sandbox Trigger Simulator (cols-4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* UTAGE Synchronization API Sandbox panel */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] bg-indigo-500 text-white font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded border border-indigo-400 shadow-ms">
                API TESTING SANDBOX
              </span>
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-white">UTAGE 連携活動シミュレーター</h4>
              <p className="text-slate-300 text-[10.5px] mt-1 leading-relaxed">
                任意のシステム連動イベントを選択して「擬似ログ」をトリガーできます。UTAGEのWebhookや決済システムが動作した際の、進捗監査の挙動をライブ検証できます。
              </p>
            </div>

            <div className="space-y-3.5 pt-2 border-t border-slate-800 text-xs">
              {/* Target Project */}
              <div>
                <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">検証用ターゲット・クライアント</label>
                <select
                  value={simProject}
                  onChange={(e) => setSimProject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-extrabold text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.clientName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">シミュレーション・イベント</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-xl border border-slate-800 cursor-pointer hover:bg-slate-850 text-[11px] font-semibold text-slate-100">
                    <input
                      type="radio"
                      name="simType"
                      value="optin"
                      checked={simType === 'optin'}
                      onChange={() => setSimType('optin')}
                      className="border-slate-800 text-indigo-500 focus:ring-indigo-600 h-3.5 w-3.5 bg-slate-900"
                    />
                    <div>
                      <span>📥 LINEオプトイン（正常・200）</span>
                      <p className="text-[9px] text-slate-400 font-normal">LINE友だち追加検知とタグ付与処理</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-xl border border-slate-800 cursor-pointer hover:bg-slate-850 text-[11px] font-semibold text-slate-100">
                    <input
                      type="radio"
                      name="simType"
                      value="payment"
                      checked={simType === 'payment'}
                      onChange={() => setSimType('payment')}
                      className="border-slate-800 text-indigo-500 focus:ring-indigo-600 h-3.5 w-3.5 bg-slate-900"
                    />
                    <div>
                      <span>💳 Stripe 決済成功Webhook（正常・201）</span>
                      <p className="text-[9px] text-slate-400 font-normal">Stripe決済完了と会員自動招待権限</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-xl border border-slate-800 cursor-pointer hover:bg-slate-850 text-[11px] font-semibold text-slate-100">
                    <input
                      type="radio"
                      name="simType"
                      value="validation_error"
                      checked={simType === 'validation_error'}
                      onChange={() => setSimType('validation_error')}
                      className="border-slate-800 text-indigo-500 focus:ring-indigo-600 h-3.5 w-3.5 bg-slate-900"
                    />
                    <div>
                      <span>⚠️ タグ検証バリデーション警告（422）</span>
                      <p className="text-[9px] text-slate-400 font-normal">指定タグID等の不整合・マッピング警告</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-xl border border-slate-800 cursor-pointer hover:bg-slate-850 text-[11px] font-semibold text-slate-100">
                    <input
                      type="radio"
                      name="simType"
                      value="dns_error"
                      checked={simType === 'dns_error'}
                      onChange={() => setSimType('dns_error')}
                      className="border-slate-800 text-indigo-500 focus:ring-indigo-600 h-3.5 w-3.5 bg-slate-900"
                    />
                    <div>
                      <span>❌ APIタイムアウト接続エラー（502）</span>
                      <p className="text-[9px] text-slate-400 font-normal">外部UTAGEサーバーのDNSレスポンス異常</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Trigger Simulation */}
              <button
                onClick={handleTriggerSimulation}
                className="w-full flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer mt-2"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>シミュレーション連携を発火</span>
              </button>
            </div>
          </div>

          {/* UTAGE Partner Live Connection Metrics Dashboard Box */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-slate-800 space-y-3">
            <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">CONNECTION STABILITY</h4>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                UTAGE 認証接続
              </span>
              <span className="text-emerald-600">正常接続中 (100%)</span>
            </div>
            
            <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] leading-relaxed text-slate-500">
              <p>
                この「Automation Logs（オートメーションログ）」は、システム開発者がUTAGEとStripe・LINE間の通信データ疎通を確認するための監査システムです。
              </p>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 flex items-center gap-2">
                <ArrowRightLeft className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span className="font-semibold text-slate-750 text-[10px]">双方向Webhook通信レート: 32回/分 (安定)</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
