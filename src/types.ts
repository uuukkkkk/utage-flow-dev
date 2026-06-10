export type UserRole = '管理者' | '開発者' | 'メンバー';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
  googleConnected: boolean;
  avatarUrl?: string;
}

export type FunnelType = 
  | 'セミナー集客ファネル'
  | '個別相談ファネル'
  | '自社プロダクト販売ファネル'
  | '無料プレゼント配布ファネル'
  | 'オンラインコンテンツ販売ファネル';

export type ProjectStatus = 
  | '原稿執筆中'
  | 'クライアント確認中'
  | 'UTAGE実装中'
  | 'テスト運用中'
  | '本番稼働中';

export interface FunnelStep {
  id: string;
  name: string;
  status: '未着手' | '制作中' | '確認中' | '完了';
  assignee?: string;
  targetDate?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  representative: string;
  email: string;
  phone: string;
  createdAt: string;
  notes?: string;
}

export interface ProjectHistoryLog {
  id: string;
  timestamp: string;
  category: 'client_request' | 'meeting_note' | 'update_log';
  author: string;
  content: string;
}

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  funnelType: FunnelType;
  progress: number; // 0 to 100
  status: ProjectStatus;
  startDate: string;
  targetDate: string;
  description: string;
  funnelSteps: FunnelStep[];
  notes?: string;
  revenue?: string; // Estimated budget / value
  historyLogs?: ProjectHistoryLog[];
}

export interface Template {
  id: string;
  name: string;
  category: FunnelType;
  description: string;
  stepsCount: number;
  steps: string[];
  assignee?: string;
  expectedDuration?: string;
  requiredPlan?: 'Starter' | 'Pro' | 'Platinum'; // Super Admin distribution plan restriction
}

export interface WikiArticle {
  id: string;
  title: string;
  category: 'ファネル設計' | 'UTAGE設定' | 'LINE・配信' | 'Stripe決済' | 'AI活用' | 'マーケティング知見';
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  requiredPlan?: 'Starter' | 'Pro' | 'Platinum';
  viewsCount?: number;
}

export interface AutomationLog {
  id: string;
  projectId?: string;
  projectName?: string;
  action: string;
  statusCode: number;
  status: 'success' | 'error' | 'warning';
  timestamp: string;
  message: string;
  details?: string;
}

