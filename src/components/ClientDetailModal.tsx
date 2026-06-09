import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Save, 
  FileText, 
  History, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Compass, 
  Sparkles 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Client, Project } from '../types';

interface ClientDetailModalProps {
  client: Client;
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateClient: (updatedClient: Client) => void;
}

export default function ClientDetailModal({
  client,
  projects,
  isOpen,
  onClose,
  onUpdateClient
}: ClientDetailModalProps) {
  // Local state for editable fields
  const [representative, setRepresentative] = useState(client.representative || '');
  const [email, setEmail] = useState(client.email || '');
  const [phone, setPhone] = useState(client.phone || '');
  const [industry, setIndustry] = useState(client.industry || '');
  const [notes, setNotes] = useState(client.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  // Filter projects associated with this client
  const clientProjects = projects.filter(p => p.clientId === client.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClient({
      ...client,
      representative: representative.trim(),
      email: email.trim(),
      phone: phone.trim(),
      industry: industry.trim(),
      notes: notes.trim()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case '本番稼働中':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'テスト運用中':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'UTAGE実装中':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'クライアント確認中':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Banner header resembling a high-contrast Bento row */}
        <div className="bg-[#0f172a] text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded-md">CLIENT METADATA PRO</span>
            <h3 className="text-lg font-black text-white tracking-tight mt-1">{client.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Scrollable multi-panel body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-5 gap-6 flex-1 bg-slate-50/50">
          {/* Left panel (3 cols): Contact and note editable form */}
          <div className="md:col-span-3 space-y-6">
            <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-slate-205 shadow-xs space-y-4">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 uppercase tracking-wider">
                <User className="h-4 w-4 text-indigo-600" />
                登録・連携プロフィール
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">窓口担当者名</label>
                  <input
                    type="text"
                    value={representative}
                    onChange={e => setRepresentative(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50 text-slate-800 font-semibold focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    placeholder="例: 山田 太郎"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">提供サービス・業種</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={e => setIndustry(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50/50 text-slate-800 font-semibold focus:bg-white focus:ring-1 focus:ring-indigo-500"
                    placeholder="例: フィットネスヨガスタジオ"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">連絡用メールアドレス</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                      placeholder="example@yourdomain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">連絡先電話番号</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 pl-9 pr-3 py-2 bg-slate-50/50 text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                      placeholder="090-0000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Note / Memo section */}
              <div className="pt-2">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-indigo-500" />
                  ディレクション用共有メモ欄（自由記入）
                </label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3_5 py-2.5 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium leading-relaxed"
                  placeholder="例: 特約要件、Stripe接続状況、その他打ち合わせの覚書を記入..."
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono">最終保存: 同期済み</span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaved ? '変更を保存しました！' : 'プロフィール情報を保存'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right panel (2 cols): Past project history list */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-205 shadow-xs h-full flex flex-col">
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2.5 uppercase tracking-wider shrink-0">
                <History className="h-4 w-4 text-indigo-605" />
                ファネル構築・運用履歴 ({clientProjects.length}件)
              </h4>

              <div className="space-y-3 overflow-y-auto pr-1 flex-1 mt-3">
                {clientProjects.length > 0 ? (
                  clientProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-150 transition-colors flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-xs font-extrabold text-slate-800 leading-tight truncate">
                            {project.funnelType}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            始動期: {project.startDate} / 目標期: {project.targetDate}
                          </p>
                        </div>
                        <span className={`text-[8px] font-black font-sans shrink-0 border border-slate-100 px-2 py-0.5 rounded-md ${getStatusBadgeStyle(project.status)}`}>
                          {project.status === 'クライアント確認中' ? '確認中' : project.status}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-2">
                        {/* Progress */}
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase">
                          <span>構築進捗: {project.progress}%</span>
                          {project.revenue && <span className="text-indigo-600">費用: {project.revenue}</span>}
                        </div>
                        <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                    <Briefcase className="h-8 w-8 text-slate-350" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">構築中のプロジェクトなし</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">プロジェクト管理から、この顧客のファネルを新規追加できます。</p>
                    </div>
                  </div>
                )}
              </div>

              {/* standard metadata */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 mt-4 text-[10px] text-slate-500 space-y-1">
                <div className="flex justify-between items-center text-slate-400 font-mono">
                  <span>顧客アカウント登録日</span>
                  <span>{client.createdAt}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 font-mono">
                  <span>クライアントシステムID</span>
                  <span>{client.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-150 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-medium font-sans">
            <Compass className="h-3.5 w-3.5 text-indigo-500" />
            UTAGE Customer Core CRM v1.2
          </span>
          <span className="text-[10px] text-slate-400">
            すべてのクライアントデータの完全保護を保証しています。
          </span>
        </div>
      </motion.div>
    </div>
  );
}
