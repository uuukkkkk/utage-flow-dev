import React, { useState } from 'react';
import { Settings, Shield, Link, User, Check, RefreshCw, Key, Landmark, MailOpen, Globe, Laptop, Bell } from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsView() {
  const [lineStatus, setLineStatus] = useState<'connected' | 'disconnected'>('connected');
  const [stripeStatus, setStripeStatus] = useState<'connected' | 'disconnected'>('connected');
  const [mailStatus, setMailStatus] = useState<'connected' | 'disconnected'>('connected');
  const [isSyncing, setIsSyncing] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  // UTAGE MCP states
  const [mcpStatus, setMcpStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('connected');
  const [mcpEndpoint, setMcpEndpoint] = useState('https://docs.utage-system.com/api/mcp/v2');
  const [mcpToken, setMcpToken] = useState('ut_mcp_live_e992b8d52ca63f01bcfcf');
  const [showToken, setShowToken] = useState(false);

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

  return (
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
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
                    <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-lg">
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
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-[10px] font-black cursor-pointer"
                    >
                      {showToken ? "非表示" : "表示"}
                    </button>
                  </div>
                </div>
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
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] animate-fade-in">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
              <Bell className="h-4.5 w-4.5 text-indigo-650 animate-pulse" />
              リアルタイム通知システム ＆ 推進督促リマインダー調整
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              設定された期限警告や、アサインされている担当クルーへのSlack/LINE WORKS向け各種Webhook通知の送出基準・トリガーを最適化します。
            </p>

            <div className="space-y-3.5">
              {/* Toggle 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-3.5">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">🚨 マイルストーン期限日アラート（本日・3日前）自動判定</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">基準日（2026年6月10日）をベースに、3日以内に期日を迎えるタスクを危険マイルストーンとして全画面に一斉警告表示します。</p>
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
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">期限間近の通知で「即時リマインド送信」が押下された場合、各タスクにアサインされた担当者宛てに自動でPushメンションをおこなう統合。現プロジェクトのみ適用します。</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650"></div>
                </label>
              </div>

              {/* Toggle 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-3.5">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">📅 Google Calendar カレンダー自動同期・警告掲載</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">プロジェクト側で期日が変動した場合に、Workspace内に連携してあるGoogleカレンダー上の終日予定をリアルタイムに自動編集・警告同期します。</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-205 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650"></div>
                </label>
              </div>

              {/* Alert Test trigger with React-driven state feedback */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setTestNotificationSent(true);
                    setTimeout(() => setTestNotificationSent(false), 4000);
                  }}
                  className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black rounded-xl border border-indigo-200 cursor-pointer transition-all shadow-3xs"
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

          {/* Org Workspace details */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3 uppercase tracking-wider">
              <Shield className="h-4.5 w-4.5 text-indigo-600" />
              ディレクション組織プロフィール
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
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">デフォルトファネル言語</label>
                <select
                  defaultValue="ja"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50/50 text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="ja">日本語 (JA-JP)</option>
                  <option value="en">英語 (EN-US)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">地域タイムゾーン設定</label>
                <select
                  defaultValue="Asia/Tokyo"
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50/50 text-slate-800 font-bold focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Asia/Tokyo">日本標準時 (GMT+09:00 Tokyo)</option>
                  <option value="America/New_York">米国東部標準時 (EST/EDT NY)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Bento account status banner */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] text-white rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between h-full">
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
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">クライアント組織上限</p>
                  <p className="text-xs font-semibold text-slate-200 mt-1">
                    制限なし (現 5 組織登録中)
                  </p>
                </div>

                <div className="bg-slate-950/65 p-3 rounded-xl border border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">システム連携APIキー</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Key className="h-3 w-3 text-indigo-400" />
                    <span className="text-[11px] text-slate-500 font-mono tracking-widest">●●●●●●●●●●</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 text-[10px] text-slate-400 leading-relaxed space-y-2">
              <p>※ プラチナプランのご契約により、複数クライアントに対する独自ドメイン設置およびStripe決済のSandbox並行デバッグ権限が付与されています。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
