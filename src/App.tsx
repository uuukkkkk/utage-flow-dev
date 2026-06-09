import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProjectDashboard from './components/ProjectDashboard';
import ClientList from './components/ClientList';
import TemplateList from './components/TemplateList';
import SettingsView from './components/Settings';
import ProjectDetailModal from './components/ProjectDetailModal';
import NewProjectModal from './components/NewProjectModal';
import AnalysisView from './components/AnalysisView';
import TeamManagement from './components/TeamManagement';
import { mockClients, mockProjects, mockTemplates, mockTeamMembers } from './data/mockData';
import { Project, Client, ProjectStatus, Template, TeamMember, UserRole } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Users, Workflow, Settings as SettingsIcon, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // App-level data states (local persistence simulation)
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="py-12 text-center text-slate-500">
            開発中の画面またはコンテンツが存在しません。
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex antialiased">
      {/* Sidebar for Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Container */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header Controls */}
        <header className="h-20 border-b border-slate-100 bg-white sticky top-0 z-30 px-6 flex items-center justify-between">
          {/* Left space filler or mobile spacing placeholder */}
          <div className="flex items-center space-x-3 pl-12 md:pl-0">
            <span className="text-sm font-semibold text-slate-400">ポータル</span>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-700">
              {activeTab === 'projects' ? 'プロジェクト管理' :
               activeTab === 'clients' ? '顧客一覧' :
               activeTab === 'analysis' ? '分析・統計ダッシュボード' :
               activeTab === 'team' ? '組織・専属メンバー' :
               activeTab === 'templates' ? 'ファネルテンプレート' :
               'システム設定'}
            </span>
          </div>

          {/* Right Header Operations */}
          <div className="flex items-center space-x-4">
            {/* Quick Helper Info */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-150">
              UTAGE公式パートナー認定
            </span>

            {/* Notification alert badge */}
            <div className="relative cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Bell className="h-5 w-5 text-slate-500" />
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
