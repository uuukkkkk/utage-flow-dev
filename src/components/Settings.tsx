import React, { useState } from 'react';
import { Settings, Shield, Link, User, Check, RefreshCw, Key, Landmark, MailOpen, Globe, Laptop } from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsView() {
  const [lineStatus, setLineStatus] = useState<'connected' | 'disconnected'>('connected');
  const [stripeStatus, setStripeStatus] = useState<'connected' | 'disconnected'>('connected');
  const [mailStatus, setMailStatus] = useState<'connected' | 'disconnected'>('connected');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
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
