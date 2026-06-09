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
}
