import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProjectDashboard from './components/ProjectDashboard';
import ClientList from './components/ClientList';
import TemplateList from './components/TemplateList';
import SettingsView from './components/Settings';
import ProjectDetailModal from './components/ProjectDetailModal';
import ProjectDetailView, { parseDeadlineStatus } from './components/ProjectDetailView';
import LearningHub from './components/LearningHub';
import GuideView from './components/GuideView';
import NewProjectModal from './components/NewProjectModal';
import AnalysisView from './components/AnalysisView';
import TeamManagement from './components/TeamManagement';
import AdminConsole from './components/AdminConsole';
import { mockClients, mockProjects, mockTemplates, mockTeamMembers, mockWikiArticles } from './data/mockData';
import { Project, Client, ProjectStatus, Template, TeamMember, UserRole, WikiArticle } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, Workflow, Settings as SettingsIcon, Bell, AlertTriangle, CheckCircle2, Clock, Calendar, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hostMode, setHostMode] = useState<'internal' | 'saas'>('saas');
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(true);
  const [simulatedPlan, setSimulatedPlan] = useState<'Starter' | 'Pro' | 'Platinum'>('Pro'); // SaaS tenant plan simulator
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Safely override window.alert to render our custom high-fidelity notification toast instead
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message: any) => {
      setToastMessage(message ? String(message) : '');
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);
  
  // App-level data states (local persistence simulation)
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>(mockWikiArticles);

  // Add member handler
  const handleAddMember = (newMemberData: Omit<TeamMember, 'id' | 'joinedAt'>) => {
    const newMember: TeamMember = {
      ...newMemberData,
      id: `m-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setMembers([...members, newMember]);
  };

  // Remove member handler
  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  // Update member role handler
  const handleUpdateRole = (id: string, newRole: UserRole) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  // Add template handler
  const handleAddTemplate = (newTempData: Omit<Template, 'id' | 'stepsCount'> & { steps: string[] }) => {
    const newTemp: Template = {
      ...newTempData,
      id: `t-${Date.now()}`,
      stepsCount: newTempData.steps.length
    };
    setTemplates([newTemp, ...templates]);
  };

  // Update template handler
  const handleUpdateTemplate = (updatedTemp: Template) => {
    setTemplates(templates.map(t => t.id === updatedTemp.id ? { ...updatedTemp, stepsCount: updatedTemp.steps.length } : t));
  };

  // Delete template handler
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  // Modal Control States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDetailedProject, setSelectedDetailedProject] = useState<Project | null>(null);
  const [selectedProjectIdForView, setSelectedProjectIdForView] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Notification Flyout/Dropdown States
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Dynamically computed overdue/urgent milestone signals based on progress & dates
  const urgentTasks = projects.flatMap(proj => {
    return (proj.funnelSteps || [])
      .filter(step => step.status !== '完了')
      .map(step => {
        // Calculate status relative to current基準日 2026-06-10
        const dStat = parseDeadlineStatus(step.targetDate, step.status);
        return {
          ...step,
          project: proj,
          dStat
        };
      })
      .filter(item => item.dStat.isNear);
  });

  // Add project handler
  const handleAddProject = (newProjData: Omit<Project, 'id' | 'progress'> & { id?: string, progress?: number }) => {
    const newProject: Project = {
      ...newProjData,
      id: `p-${Date.now()}`,
      progress: newProjData.progress ?? 0,
    } as Project;

    setProjects([newProject, ...projects]);
  };

  // Add client handler
  const handleAddClient = (newClientData: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...newClientData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClients([newClient, ...clients]);
  };

  // Update project handler
  const handleUpdateProject = (updatedProj: Project) => {
    setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
    // Also update current active selected project in detail modal to represent changes instantly
    if (selectedDetailedProject && selectedDetailedProject.id === updatedProj.id) {
      setSelectedDetailedProject(updatedProj);
    }
  };

  // Update client handler
  const handleUpdateClient = (updatedClient: Client) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  // Delete project handler
  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    setSelectedDetailedProject(null);
  };

  // Open detail helper
  const handleOpenDetailModal = (proj: Project) => {
    setSelectedDetailedProject(proj);
    setIsDetailModalOpen(true);
  };

  // Render current active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectDashboard 
            projects={projects}
            clients={clients}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onOpenDetailModal={handleOpenDetailModal}
            onUpdateProject={handleUpdateProject}
          />
        );
      case 'project-detail':
        return (
          <ProjectDetailView 
            projects={projects}
            selectedProjectId={selectedProjectIdForView}
            onSelectProject={setSelectedProjectIdForView}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            members={members}
            clients={clients}
          />
        );
      case 'clients':
        return (
          <ClientList 
            clients={clients}
            projects={projects}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
          />
        );
      case 'analysis':
        return (
          <AnalysisView 
            projects={projects}
            clients={clients}
          />
        );
      case 'team':
        return (
          <TeamManagement 
            members={members}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onUpdateRole={handleUpdateRole}
          />
        );
      case 'templates':
        return (
          <TemplateList 
            templates={templates}
            onAddTemplate={handleAddTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            simulatedPlan={simulatedPlan}
          />
        );
      case 'settings':
        return <SettingsView />;
      case 'learning':
        return (
          <LearningHub 
            wikiArticles={wikiArticles}
            setWikiArticles={setWikiArticles}
            simulatedPlan={simulatedPlan}
            setSimulatedPlan={setSimulatedPlan}
          />
        );
      case 'guide':
        return <GuideView />;
      case 'admin-console':
        return (
          <AdminConsole 
            hostMode={hostMode} 
            setHostMode={setHostMode}
            isSetupCompleted={isSetupCompleted}
            setIsSetupCompleted={setIsSetupCompleted}
            templates={templates}
            setTemplates={setTemplates}
            wikiArticles={wikiArticles}
            setWikiArticles={setWikiArticles}
            simulatedPlan={simulatedPlan}
            setSimulatedPlan={setSimulatedPlan}
          />
        );
      default:
        return (
          <div className="py-12 text-center text-slate-500">
            開発中の画面またはコンテンツが存在しません。
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 font-sans flex antialiased">
      {/* Sidebar for Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
        {/* Top Header Controls */}
        <header className="h-20 border-b border-slate-100 bg-white sticky top-0 z-30 px-6 flex items-center justify-between">
          {/* Left space filler or mobile spacing placeholder */}
          <div className="flex items-center space-x-3 pl-12 md:pl-0">
            <span className="text-sm font-semibold text-slate-400">ポータル</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-700">
              {activeTab === 'projects' ? 'プロジェクト管理' :
               activeTab === 'project-detail' ? '案件詳細ワークスペース' :
               activeTab === 'clients' ? '顧客一覧' :
               activeTab === 'analysis' ? '分析・統計ダッシュボード' :
               activeTab === 'team' ? '組織・専属メンバー' :
               activeTab === 'templates' ? 'ファネルテンプレート' :
               activeTab === 'learning' ? '学習ナレッジ・知見Wiki' :
               activeTab === 'guide' ? '使い方マニュアル' :
               activeTab === 'admin-console' ? '総合管理者コンソール' :
               'システム設定'}
            </span>
          </div>

          {/* Right Header Operations */}
          <div className="flex items-center space-x-4">
            {hostMode === 'saas' && (
              <div className="flex items-center gap-1.5 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-100 flex-shrink-0">
                <span className="text-[10px] text-indigo-700 font-extrabold uppercase font-mono tracking-wider">
                  🧪 検証用契約プラン:
                </span>
                <select
                  value={simulatedPlan}
                  onChange={(e) => setSimulatedPlan(e.target.value as any)}
                  className="bg-white border border-indigo-200 text-[11px] font-black rounded-lg px-2 py-0.5 text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Starter">Starter (初期)</option>
                  <option value="Pro">Pro (プロ)</option>
                  <option value="Platinum">Platinum (最高位)</option>
                </select>
              </div>
            )}

            {/* Quick Helper Info */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-150">
              UTAGE公式パートナー認定
            </span>

            {/* Notification alert badge */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="通知センター"
              >
                {urgentTasks.length > 0 && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                )}
                <Bell className="h-5 w-5 text-slate-500" />
              </button>

              {/* Notification dropdown */}
              {isNotificationOpen && (
                <>
                  {/* Backdrop overlay for closing */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200/90 shadow-xl py-3.5 z-50 animate-fade-in origin-top-right">
                    <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">
                          リアルタイムマイルストーン警告
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        urgentTasks.length > 0 ? 'bg-rose-50 text-rose-600 border border-slate-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        未処理 {urgentTasks.length} 件
                      </span>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-50">
                      {urgentTasks.length > 0 ? (
                        urgentTasks.map((task) => {
                          const { dStat } = task;
                          return (
                            <div 
                              key={task.id}
                              onClick={() => {
                                setSelectedProjectIdForView(task.project.id);
                                setActiveTab('project-detail');
                                setIsNotificationOpen(false);
                              }}
                              className="px-4 py-3 hover:bg-slate-50/85 transition-colors cursor-pointer text-left space-y-1.5"
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <span className="text-[11.5px] font-black text-slate-800 leading-snug">
                                  {task.name}
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-black shrink-0 ${
                                  dStat.isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {dStat.label}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500">
                                <span>
                                  案件: <strong className="text-slate-700 font-bold">{task.project.name}</strong> ({task.project.clientName})
                                </span>
                                <span className="font-semibold text-slate-400">
                                  担当: {task.assignee || '未アサイン'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-8 px-4 text-center space-y-2">
                          <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <p className="text-[11.5px] font-black text-slate-700">期限超過や警告マイルストーンはありません。</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-normal">基準日（2026年6月10日）ベースの判定はすべて正常です。</p>
                        </div>
                      )}
                    </div>

                    {/* Footer link to switch screen */}
                    <div className="px-4 pt-3.5 border-t border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('project-detail');
                          setIsNotificationOpen(false);
                        }}
                        className="text-[10.5px] font-black text-indigo-600 hover:text-indigo-800 cursor-pointer block w-full text-center hover:underline"
                      >
                        案件詳細ワークスペースですべて確認する →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Language indicator / simple label */}
            <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
              JP 🇯🇵
            </div>
          </div>
        </header>

        {/* Scrollable Screen Body Area */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global Footer (Anti-AI-slop, clean and humble text only) */}
        <footer className="h-16 border-t border-slate-100 bg-white flex items-center justify-center text-xs text-slate-400/80 px-6">
          © 2026 UTAGE Hub - Marketing Funnel & Client Automation Console
        </footer>
      </div>

      {/* Interactive Modals */}
      <AnimatePresence>
        {isAddModalOpen && (
          <NewProjectModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            clients={clients}
            members={members}
            onAddProject={handleAddProject}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDetailModalOpen && selectedDetailedProject && (
          <ProjectDetailModal 
            project={selectedDetailedProject}
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedDetailedProject(null);
            }}
            members={members}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onOpenDetailView={(id) => {
              setSelectedProjectIdForView(id);
              setActiveTab('project-detail');
              setIsDetailModalOpen(false);
              setSelectedDetailedProject(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating System Notification Toast to replace modern iframe-blocked alert boxes */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 15 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm w-[90%] sm:w-85 bg-slate-900 shadow-xl rounded-2xl p-4 border border-slate-800 text-white flex items-start gap-3.5"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-550/25 flex items-center justify-center text-indigo-400 shrink-0">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest">UTAGE Flow 通知システム</p>
              <p className="text-[11px] font-extrabold text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap">
                {toastMessage}
              </p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer text-slate-400 shrink-0"
              aria-label="閉じる"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
