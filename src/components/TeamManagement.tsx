import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2, 
  Mail, 
  Calendar, 
  Compass, 
  UserCheck, 
  Lock, 
  Key, 
  RefreshCw, 
  AlertCircle, 
  Check, 
  LogOut,
  Sliders,
  Settings,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TeamMember, UserRole } from '../types';

interface TeamManagementProps {
  members: TeamMember[];
  onAddMember: (newMember: Omit<TeamMember, 'id' | 'joinedAt'>) => void;
  onRemoveMember: (id: string) => void;
  onUpdateRole: (id: string, newRole: UserRole) => void;
}

export default function TeamManagement({
  members,
  onAddMember,
  onRemoveMember,
  onUpdateRole
}: TeamManagementProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('メンバー');
  const [googleConnected, setGoogleConnected] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter or search states
  const [searchQuery, setSearchQuery] = useState('');

  // Built-in currentUser simulation
  const currentUser = {
    name: '佐藤 広務',
    email: 'hiromu.sato@dots-direction.test',
    role: '管理者' as UserRole,
    avatar: '佐藤'
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddMember({
      name: name.trim(),
      email: email.trim(),
      role,
      googleConnected
    });

    setName('');
    setEmail('');
    setRole('メンバー');
    setGoogleConnected(true);
    setIsAdding(false);

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case '管理者':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="h-3.5 w-3.5" />
            管理者 (Admin)
          </span>
        );
      case '開発者':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Sliders className="h-3.5 w-3.5" />
            提供・開発者 (Editor)
          </span>
        );
      case 'メンバー':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-200">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            一般メンバー (Viewer)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper header section */}
      <div className="bg-[#0f172a] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              ORGANIZATION & ACCESS MANAGEMENT
            </span>
            <span className="flex items-center gap-1 text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
              <Compass className="h-3 w-3" />
              Google Workspace同期
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mt-1.5 sm:text-3xl">組織・専属メンバー管理</h2>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-xl">
            Google Workspaceアカウントを活用して組織開発メンバーを招待します。ロール階層（管理者 / 開発者 / 閲覧メンバー）に応じて、UTAGEファネルの編集・閲覧権限の分離設定を確実に制御します。
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <button
            onClick={() => setIsAdding(true)}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold px-4 py-3 shadow-lg shadow-indigo-600/10 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            新規メンバーを招待
          </button>
        </div>
      </div>

      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
          <UserCheck className="h-4 w-4 text-emerald-600" />
          <span>メンバーの登録およびGoogleアカウントへの招待リンク発行が完了しました。</span>
        </div>
      )}

      {/* Grid: 2 Panels (Main Member list / Google Auth Info Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main List Column (8/12) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-205 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-indigo-500" />
                  専属メンバーリスト ({members.length}件)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">登録担当者は、各ファネル内の個別UTAGEドキュメントタスクへ直接アサイン可能です。</p>
              </div>

              {/* Quick Filter */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="メンバー名・メアドで検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium px-4 py-2 pl-9 rounded-xl focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-indigo-550 w-full sm:w-56"
                />
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* List Table/Row */}
            <div className="divide-y divide-slate-100 mt-2">
              {filteredMembers.map((member) => {
                const isSelf = member.email === currentUser.email;
                return (
                  <div key={member.id} className="py-4 hover:bg-slate-50/50 rounded-xl px-2 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar with initial */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-205 flex items-center justify-center font-bold text-slate-700 text-xs uppercase shrink-0">
                        {member.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-slate-800 leading-none truncate">
                            {member.name}
                          </p>
                          {isSelf && (
                            <span className="text-[9px] bg-slate-900 text-white font-black px-1.5 py-0.5 rounded-sm">
                              あなた
                            </span>
                          )}
                          {member.googleConnected ? (
                            <span className="text-[9px] text-teal-600 bg-teal-50 border border-teal-150 font-bold px-1.5 py-0.2 rounded-md">
                              Google連携済
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.2 rounded-md">
                              招待中
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                      {/* Role drop-down */}
                      <div>
                        {isSelf ? (
                          <div className="text-right">
                            {getRoleBadge(member.role)}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={member.role}
                              onChange={(e) => onUpdateRole(member.id, e.target.value as UserRole)}
                              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
                            >
                              <option value="管理者">管理者 (Admin)</option>
                              <option value="開発者">開発者 (Editor)</option>
                              <option value="メンバー">メンバー (Viewer)</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      {!isSelf && (
                        <button
                          onClick={() => {
                            if (confirm(`${member.name}様を組織チームから削減（削除）してもよろしいですか？\n割り当て済みのタスクは自動的に未割り当てに戻されます。`)) {
                              onRemoveMember(member.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="組織から削減"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredMembers.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  該当するチームメンバーが見つかりません。
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info & Google Workspace Account Sync Setup (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Current Session login block */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-850 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
              <Key className="h-3.5 w-3.5" />
              管理者ログインセッション
            </h4>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-indigo-400 text-xs">
                {currentUser.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-white">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{currentUser.email}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                ドメイン保護下
              </span>
              <span className="font-mono text-slate-500">ROOT ADMIN</span>
            </div>
          </div>

          {/* Google Workspace Setup Policy instructions */}
          <div className="bg-white rounded-3xl border border-slate-205 p-6 space-y-4">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3 uppercase tracking-wider">
              <Settings className="h-4 w-4 text-indigo-600" />
              Google 組織統合＆セキュリティ
            </h4>

            <div className="space-y-4 text-xs">
              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">01</span>
                <div>
                  <p className="font-black text-slate-800">シングルサインオン (SSO)</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">
                    メンバーはGoogle認証のみで安全に組織にアクセス。IDパスワードの漏洩リスクをゼロにします。
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">02</span>
                <div>
                  <p className="font-black text-slate-800">細分化された権限分割 (RBAC)</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">
                    ・<strong>管理者</strong>: すべての編集設定とメンバーの削減ができる権限。<br />
                    ・<strong>開発者</strong>: UTAGE構築およびステップの登録と編集権限。<br />
                    ・<strong>メンバー</strong>: 安全な進捗レビューが可能な閲覧限定権限。
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">03</span>
                <div>
                  <p className="font-black text-slate-800">Google ドライブ・カレンダー連携</p>
                  <p className="text-slate-400 text-[10px] mt-0.5 leading-relaxed">
                    Google Workspaceグループを同期することで、共有メモリアルタイム同期や作業期日のカレンダー自動アグリゲーションが作動します。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registering Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden"
            >
              <div className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded-md">GOOGLE DIRECTORY</span>
                  <h3 className="text-md font-black text-white mt-1">組織メンバーを新規招待</h3>
                </div>
                <button
                  onClick={() => setIsAdding(false)}
                  className="p-1 px-2 text-xs rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
                >
                  閉じる
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">氏名</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例: 佐々木 優奈"
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 font-semibold focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-505 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Google Workspace メールアドレス</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@yourdomain.com 等"
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-505 text-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">割り当て権限 (Role)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-55 font-bold focus:outline-hidden text-slate-800"
                  >
                    <option value="管理者">管理者 (フルコントロール可能)</option>
                    <option value="開発者">開発者 (UTAGE編集/作成可能)</option>
                    <option value="メンバー">一般メンバー (閲覧のみ保護)</option>
                  </select>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={googleConnected}
                      onChange={(e) => setGoogleConnected(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span>Google 組織アカウントとしての自動有効化を実行</span>
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal ml-6">
                    チェックを入れると、Workspace APIを通じて自動的にチームドキュメントおよび共有カレンダー共有リストへの招待メールがGoogleより自動通知されます。
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>変更を決定・招待発行</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
