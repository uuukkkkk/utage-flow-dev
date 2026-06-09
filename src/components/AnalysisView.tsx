import React, { useState, useMemo } from 'react';
import { Project, Client, FunnelStep } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  CheckCircle, 
  Users, 
  PieChart as PieIcon, 
  BarChart2, 
  Activity, 
  AlertCircle,
  Briefcase,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  AreaChart,
  Area
} from 'recharts';

interface AnalysisViewProps {
  projects: Project[];
  clients: Client[];
}

export default function AnalysisView({ projects, clients }: AnalysisViewProps) {
  const [filterFunnelType, setFilterFunnelType] = useState<string>('all');

  // Helpers to parse currency strings (e.g. "450,050円" or "¥600,000") to numeric values
  const parseRevenue = (revStr: string | undefined): number => {
    if (!revStr) return 0;
    const cleaned = revStr.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
  };

  // Format number back to JPY text
  const formatJPY = (val: number): string => {
    return new Intl.NumberFormat('ja-JP', { 
      style: 'currency', 
      currency: 'JPY',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Funnel types list for filter dropdown
  const funnelTypes = useMemo(() => {
    const types = new Set<string>();
    projects.forEach(p => {
      if (p.funnelType) types.add(p.funnelType);
    });
    return ['all', ...Array.from(types)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (filterFunnelType === 'all') return projects;
    return projects.filter(p => p.funnelType === filterFunnelType);
  }, [projects, filterFunnelType]);

  // Comprehensive KPI Aggregations
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let avgProgressSum = 0;
    let completedCount = 0;
    let ongoingCount = 0;
    let totalSteps = 0;
    let completedSteps = 0;

    filteredProjects.forEach(p => {
      totalRevenue += parseRevenue(p.revenue);
      avgProgressSum += p.progress || 0;
      if (p.status === '本番稼働中') {
        completedCount++;
      } else {
        ongoingCount++;
      }

      if (p.funnelSteps) {
        totalSteps += p.funnelSteps.length;
        completedSteps += p.funnelSteps.filter(s => s.status === '完了').length;
      }
    });

    const avgProgress = filteredProjects.length > 0 ? Math.round(avgProgressSum / filteredProjects.length) : 0;
    const stepCompletionPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return {
      totalRevenue,
      avgProgress,
      completedCount,
      ongoingCount,
      totalSteps,
      completedSteps,
      stepCompletionPercentage,
      projectCount: filteredProjects.length
    };
  }, [filteredProjects]);

  // Chart Data 1: Project Progress and Revenue rank
  const projectRevenueData = useMemo(() => {
    return filteredProjects.map(p => ({
      name: p.clientName.replace('様', ''),
      '進捗率 (%)': p.progress,
      '売上金額 (万円)': Math.round(parseRevenue(p.revenue) / 10000),
      type: p.funnelType
    }));
  }, [filteredProjects]);

  // Chart Data 2: Step status distributions
  const stepStatusDistribution = useMemo(() => {
    let unstarted = 0;
    let inProgress = 0;
    let inReview = 0;
    let finished = 0;

    filteredProjects.forEach(p => {
      p.funnelSteps?.forEach(s => {
        if (s.status === '未着手') unstarted++;
        else if (s.status === '制作中') inProgress++;
        else if (s.status === '確認中') inReview++;
        else if (s.status === '完了') finished++;
      });
    });

    return [
      { name: '未着手', value: unstarted, color: '#94a3b8' },
      { name: '制作中', value: inProgress, color: '#6366f1' },
      { name: '確認中', value: inReview, color: '#f59e0b' },
      { name: '完了', value: finished, color: '#10b981' }
    ].filter(item => item.value > 0);
  }, [filteredProjects]);

  // Chart Data 3: Team member / Assignee task workloads
  const assigneeWorkloadData = useMemo(() => {
    const loadMap: Record<string, { name: string, '完了': number, '対応中': number, '未着手': number }> = {};

    filteredProjects.forEach(p => {
      p.funnelSteps?.forEach(s => {
        const assignee = s.assignee?.trim() || '未割り当て';
        if (!loadMap[assignee]) {
          loadMap[assignee] = { name: assignee, '完了': 0, '対応中': 0, '未着手': 0 };
        }
        
        if (s.status === '完了') {
          loadMap[assignee]['完了']++;
        } else if (s.status === '未着手') {
          loadMap[assignee]['未着手']++;
        } else {
          loadMap[assignee]['対応中']++;
        }
      });
    });

    return Object.values(loadMap);
  }, [filteredProjects]);

  // Find priority bottlenecks (incomplete items approaching targets)
  const bottlenecks = useMemo(() => {
    const list: Array<{ clientName: string, stepName: string, assignee: string, targetDate: string }> = [];
    filteredProjects.forEach(p => {
      p.funnelSteps?.forEach(s => {
        if (s.status !== '完了' && s.targetDate) {
          list.push({
            clientName: p.clientName,
            stepName: s.name,
            assignee: s.assignee || '未設定',
            targetDate: s.targetDate
          });
        }
      });
    });
    // Just grab the first 4 bottleneck tasks
    return list.slice(0, 4);
  }, [filteredProjects]);

  return (
    <div className="space-y-6">
      {/* Upper header section with title and search filter */}
      <div className="bg-[#0f172a] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              REAL-TIME UTAGE METRICS SCREEN
            </span>
            <span className="flex items-center gap-1 text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
              <Sparkles className="h-3 w-3" />
              自動同期
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mt-1.5 sm:text-3xl">構築ファネル分析 & KPI統計</h2>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-xl">
            商談受注からUTAGEページの制作ステップ進捗、メンバー負荷状況に至るすべてのKPIデータを自動集計し、ボトルネックを早期に解消します。
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <div>
            <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              ファネル構造で絞り込み
            </label>
            <select
              value={filterFunnelType}
              onChange={(e) => setFilterFunnelType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">すべてのファネルタイプ ({projects.length})</option>
              {funnelTypes.filter(t => t !== 'all').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Bento-style stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
            <DollarSign className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">受注総価値</p>
            <p className="text-sm xs:text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-slate-900 mt-0.5 leading-tight tracking-tight break-all font-sans" title={formatJPY(stats.totalRevenue)}>
              {formatJPY(stats.totalRevenue)}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              合計 {stats.projectCount} プロジェクト
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
            <TrendingUp className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">平均ファネル進捗率</p>
            <p className="text-sm xs:text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-slate-900 mt-0.5 leading-tight tracking-tight">
              {stats.avgProgress}%
            </p>
            <div className="w-full max-w-[100px] bg-slate-100 rounded-full h-1 mt-2 overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: `${stats.avgProgress}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">実動完了と進行状況</p>
            <p className="text-sm xs:text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-slate-900 mt-0.5 leading-tight tracking-tight">
              {stats.completedCount}件 / {stats.ongoingCount}件
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              稼働中 / 進行中
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
            <Activity className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">全UTAGEページ完了率</p>
            <p className="text-sm xs:text-base sm:text-lg md:text-sm lg:text-base xl:text-xl font-black text-slate-900 mt-0.5 leading-tight tracking-tight">
              {stats.stepCompletionPercentage}%
            </p>
            <p className="text-[10px] text-slate-500 mt-1">
              {stats.completedSteps}/{stats.totalSteps} 完了
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left main: Chart 1 Bar chart for Progress & Income scale */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <BarChart2 className="h-4.5 w-4.5 text-indigo-500" />
                  クライアント毎の構築進捗と受注規模
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">受注金額（万円：右軸）と現在の構築進捗率（％：左軸）を可視化しています</p>
              </div>
            </div>

            <div className="w-full h-80 relative font-sans text-xs">
              {projectRevenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#6366f1" tickLine={false} axisLine={false} unit="%" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" tickLine={false} axisLine={false} unit="万" />
                    <Tooltip 
                      contentStyle={{ background: '#0e1726', borderRadius: '12px', border: 'none', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend iconType="circle" />
                    <Bar yAxisId="left" dataKey="進捗率 (%)" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
                    <Bar yAxisId="right" dataKey="売上金額 (万円)" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  データが存在しません
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Chart 2 Pie chart for step allocation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-1">
              <PieIcon className="h-4.5 w-4.5 text-indigo-500" />
              UTAGE構築ステップ状態
            </h3>
            <p className="text-[11px] text-slate-400 mb-6">全登録プロジェクトに関わる個別ページの進捗配分グラフ</p>

            <div className="w-full h-56 flex items-center justify-center relative font-sans text-xs">
              {stepStatusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stepStatusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stepStatusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#0e1726', borderRadius: '12px', border: 'none', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-400">データ不足</div>
              )}
            </div>

            {/* Labels under Pie Chart */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
              {stepStatusDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-[11px]">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-bold">{item.name}:</span>
                  <span className="text-slate-900 font-black font-mono">{item.value}件</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Wokload loading on team members & Priority Checklist / Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Team workloads workload map (BarChart Stacked) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-7">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-1">
            <Users className="h-4.5 w-4.5 text-indigo-500" />
            専属メンバーのタスク負荷 & 配置状況
          </h3>
          <p className="text-[11px] text-slate-400 mb-5">各メンバーが抱えているUTAGEステップページの件数と、その進捗段階</p>

          <div className="w-full h-64 font-sans text-xs">
            {assigneeWorkloadData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assigneeWorkloadData} layout="vertical" margin={{ top: 10, right: 10, left: 15, bottom: 5 }}>
                  <XAxis type="number" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#64748b" tickLine={false} axisLine={false} barSize={20} />
                  <Tooltip contentStyle={{ background: '#0e1726', borderRadius: '12px', border: 'none', color: '#fff' }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="未着手" stackId="work" fill="#94a3b8" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="対応中" stackId="work" fill="#6366f1" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="完了" stackId="work" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">データなし</div>
            )}
          </div>
        </div>

        {/* Priority Bottlenecks / Near targets watchlist */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-1">
              <AlertCircle className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
              遅延防止・期限間近タスク監視
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">現在「未完了」かつ「期日」が設定されているUTAGE最優先チェック対象</p>

            <div className="space-y-3">
              {bottlenecks.length > 0 ? (
                bottlenecks.map((task, idx) => (
                  <div key={idx} className="p-3 bg-rose-50/50 hover:bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <p className="text-[9px] text-rose-600 font-extrabold uppercase tracking-wide truncate">
                        {task.clientName}
                      </p>
                      <p className="text-slate-800 font-bold truncate leading-snug mt-0.5">
                        {task.stepName}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <span>担当: <strong>{task.assignee}</strong></span>
                      </p>
                    </div>
                    <div className="text-right shrink-0 bg-white border border-rose-200 px-2.5 py-1 rounded-lg">
                      <p className="text-[8px] text-slate-400 font-bold uppercase">作業期日</p>
                      <p className="text-xs text-rose-700 font-black font-sans">{task.targetDate}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                  <Briefcase className="h-8 w-8 text-slate-350" />
                  <div>
                    <p className="text-xs font-bold text-slate-700">優先ウォッチタスクなし</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">すべての期日付きタスクが完了しています。</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 mt-4 text-[10px] text-slate-550 flex items-start gap-1.5 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1" />
            <span>
              <strong>ディレクションヒント:</strong> 特定メンバーにタスクが偏っている場合は、詳細モーダルから他の要員に担当者を変更して平準化しましょう。
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
