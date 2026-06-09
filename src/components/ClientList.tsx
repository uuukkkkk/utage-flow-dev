import React, { useState } from 'react';
import { Client, Project } from '../types';
import { Plus, Search, UserPlus, Mail, Phone, Building, Calendar, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ClientDetailModal from './ClientDetailModal';

interface ClientListProps {
  clients: Client[];
  projects: Project[];
  onAddClient: (newClient: Omit<Client, 'id' | 'createdAt'>) => void;
  onUpdateClient: (updatedClient: Client) => void;
}

export default function ClientList({ 
  clients, 
  projects, 
  onAddClient, 
  onUpdateClient 
}: ClientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Form fields
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [representative, setRepresentative] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAddClient({
      name,
      industry,
      representative,
      email,
      phone
    });
    // Reset values
    setName('');
    setIndustry('');
    setRepresentative('');
    setEmail('');
    setPhone('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions - Bento Grid Style */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Side: App Meta Intro Box */}
        <div className="lg:col-span-2 bg-[#0f172a] text-white p-6 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest bg-slate-800 px-2.5 py-1 rounded-md">CLIENT ACCOUNTS</span>
            <h2 className="text-2xl font-black tracking-tight mt-3 text-white">顧客アカウント管理</h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed max-w-xl">
              UTAGEの構築・運用対象となるクライアントアカウントおよび関係者情報を一元管理します。
              各プロジェクトの主担当とのスムーズな連絡体制のために設定を最新に維持してください。
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-slate-400">
            <ShieldAlert className="h-3.5 w-3.5 text-indigo-455" />
            <span>アクセス権限および接続キーは設定タブから連携できます。</span>
          </div>
        </div>

        {/* Right Side: Quick Action Register Box */}
        <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">顧客アクション</h3>
            <p className="text-xs text-slate-500 mt-1">新しいクライアント様を登録して進捗紐付けを可能にします。</p>
          </div>
          <button
            id="btn-add-client-tab"
            onClick={() => setIsAdding(!isAdding)}
            className={`w-full mt-4 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              isAdding 
                ? 'bg-[#0f172a] hover:bg-slate-800 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-750 text-white shadow-indigo-505/10'
            }`}
          >
            {isAdding ? <X className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            <span>{isAdding ? 'フォームを閉じる' : '新規クライアントアカウント登録'}</span>
          </button>
        </div>
      </div>

      {/* Add Client Inline Form */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-205 p-6 rounded-3xl shadow-lg"
        >
          <h3 className="text-sm font-bold text-slate-800 mb-4 border-l-3 border-indigo-600 pl-2">新規顧客情報の追加</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wider">会社名、または屋号様 (必須)</label>
              <input
                type="text"
                placeholder="例: グリーンヨガスクール様"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wider">業種・ビジネス領域</label>
              <input
                type="text"
                placeholder="例: オンラインフィットネス教室"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wider">代表者・ご担当者名</label>
              <input
                type="text"
                placeholder="例: 佐々木 優奈"
                value={representative}
                onChange={e => setRepresentative(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wider">連絡用メールアドレス</label>
              <input
                type="email"
                placeholder="example@yourdomain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white text-slate-800 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wider">連絡先電話番号</label>
              <input
                type="text"
                placeholder="090-0000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-white text-slate-800 focus:outline-hidden"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-colors cursor-pointer"
              >
                顧客データベースに保存
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filter Bento Box row */}
      <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="顧客名、提供サービス業種、代表者、メールアドレスで絞り込み検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Grid List - Clean Bento Grid Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedClient(client)}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
                <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-slate-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {client.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{client.name}</h4>
                  <div className="flex items-center text-[10px] text-slate-400 mt-0.5 space-x-1">
                    <Building className="h-3 w-3 text-indigo-500" />
                    <span>{client.industry || '非公開'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 my-3">
                <div className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-slate-50">
                  <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider">窓口担当</span>
                  <span className="font-bold text-slate-800">{client.representative || '未設定'}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-slate-50">
                  <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider">連絡メール</span>
                  <span className="font-medium text-slate-600 truncate max-w-[150px]">{client.email || '未設定'}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-slate-50">
                  <span className="font-bold text-slate-400 text-[9px] uppercase tracking-wider">連絡電話</span>
                  <span className="font-semibold text-slate-650">{client.phone || '未設定'}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                登録期: {client.createdAt}
              </span>
              <span className="bg-slate-50 border border-slate-205 text-slate-550 px-2 py-0.5 rounded-md font-mono text-[9px]">
                詳細表示
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Render ClientDetailModal inside dynamic AnimatePresence overlay */}
      <AnimatePresence>
        {selectedClient && (
          <ClientDetailModal
            client={selectedClient}
            projects={projects}
            isOpen={selectedClient !== null}
            onClose={() => setSelectedClient(null)}
            onUpdateClient={(updatedClient) => {
              onUpdateClient(updatedClient);
              // also update current local selectedClient to show the edited values in real-time
              setSelectedClient(updatedClient);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
