import React, { useMemo } from 'react';
import { Customer, SalesRecord, SalesStatus, CustomerGrade } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LabelList } from 'recharts';
import { generateLeadRecommendations } from '../services/geminiService';

interface DashboardProps {
  salesData: SalesRecord[];
  customers: Customer[];
  year: number;
}

const Dashboard: React.FC<DashboardProps> = ({ salesData, customers, year }) => {
  const [aiLeads, setAiLeads] = React.useState<string[]>([]);
  const [loadingLeads, setLoadingLeads] = React.useState(false);

  // KPI Calculation
  const kpi = useMemo(() => {
    const target = 10000000000;
    const current = salesData
      .filter(d => d.status === SalesStatus.ACTUAL || d.status === SalesStatus.CONFIRMED)
      .reduce((sum, d) => sum + d.totalAmount, 0);
    
    const activity = salesData
      .filter(d => d.status === SalesStatus.EXPECTED || d.status === SalesStatus.UNDECIDED)
      .reduce((sum, d) => sum + d.totalAmount, 0);

    const activeCustomers = new Set(salesData.map(d => d.customerId)).size;

    return { target, current, activity, activeCustomers };
  }, [salesData]);

  // Monthly Stacked Bar Data
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);
    const data = months.map(m => ({
      name: m,
      [SalesStatus.ACTUAL]: 0,
      [SalesStatus.CONFIRMED]: 0,
      [SalesStatus.EXPECTED]: 0,
      [SalesStatus.UNDECIDED]: 0,
    }));

    salesData.forEach(record => {
      const date = new Date(record.expectedDate);
      const monthIndex = date.getMonth();
      if (monthIndex >= 0 && monthIndex < 12) {
        data[monthIndex][record.status] += record.totalAmount;
      }
    });

    return data;
  }, [salesData]);

  // Grade Distribution Data (Donut)
  const gradeData = useMemo(() => {
    const gradeSums: Record<string, number> = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    salesData.forEach(record => {
      if (gradeSums[record.grade] !== undefined) {
        gradeSums[record.grade] += record.totalAmount;
      }
    });
    const total = Object.values(gradeSums).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(gradeSums).map(([key, value]) => ({
      name: key,
      value: value,
      percent: Math.round((value / total) * 100)
    })).filter(d => d.value > 0);
  }, [salesData]);

  const STACK_COLORS = {
    [SalesStatus.ACTUAL]: '#ea580c', // Orange 600 - Bottom
    [SalesStatus.CONFIRMED]: '#f97316', // Orange 500
    [SalesStatus.EXPECTED]: '#fdba74', // Orange 300
    [SalesStatus.UNDECIDED]: '#e2e8f0', // Slate 200 - Top
  };

  const GRADE_COLORS = ['#7c3aed', '#2563eb', '#16a34a', '#ca8a04', '#4b5563'];

  React.useEffect(() => {
    setLoadingLeads(true);
    generateLeadRecommendations(customers).then(leads => {
      setAiLeads(leads);
      setLoadingLeads(false);
    });
  }, [customers]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
          <p className="text-sm text-gray-500 mb-1">총 매출 목표</p>
          <p className="text-2xl font-bold text-gray-800">{(kpi.target / 100000000).toFixed(1)}억 원</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
          <p className="text-sm text-gray-500 mb-1">누적 실적 / 달성율</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-orange-600">{(kpi.current / 100000000).toFixed(1)}억</p>
            <p className="text-sm font-medium text-orange-400 mb-1">
              ({((kpi.current / kpi.target) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
          <p className="text-sm text-gray-500 mb-1">영업 활동 금액</p>
          <p className="text-2xl font-bold text-blue-600">{(kpi.activity / 100000000).toFixed(1)}억 원</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100">
          <p className="text-sm text-gray-500 mb-1">진행 중 고객 수</p>
          <p className="text-2xl font-bold text-gray-800">{kpi.activeCustomers} 사</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Sales Chart (Stacked) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">매출 현황 분석 ({year}년)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" />
                 <YAxis tickFormatter={(val) => `${val/100000000}억`} />
                 <Tooltip formatter={(val: number) => `${(val/100000000).toFixed(2)}억 원`} />
                 <Legend />
                 <Bar dataKey={SalesStatus.ACTUAL} stackId="a" fill={STACK_COLORS[SalesStatus.ACTUAL]} />
                 <Bar dataKey={SalesStatus.CONFIRMED} stackId="a" fill={STACK_COLORS[SalesStatus.CONFIRMED]} />
                 <Bar dataKey={SalesStatus.EXPECTED} stackId="a" fill={STACK_COLORS[SalesStatus.EXPECTED]} />
                 <Bar dataKey={SalesStatus.UNDECIDED} stackId="a" fill={STACK_COLORS[SalesStatus.UNDECIDED]} />
               </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution (Donut) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-4">고객 등급별 매출 비중</h3>
          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ value }) => `${(value/100000000).toFixed(1)}억`} 
                >
                  <LabelList 
                    dataKey="name" 
                    position="inside" 
                    fill="#fff" 
                    stroke="none" 
                    fontWeight="bold" 
                    fontSize={14} 
                  />
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => `${(val/100000000).toFixed(1)}억`} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Action Items */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-lg font-bold text-orange-400">주간 예정 업무 (AI 분석)</h3>
        </div>
        <div className="bg-slate-700/50 p-4 rounded-lg">
            {loadingLeads ? (
                <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-slate-600 rounded w-1/2"></div>
                </div>
            ) : (
                <ul className="space-y-3">
                    {aiLeads.map((lead, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold mt-1">✓</span>
                        <span className="text-sm text-slate-200">{lead.replace(/^- /, '')}</span>
                    </li>
                    ))}
                    {aiLeads.length === 0 && <span className="text-slate-400">추천 내역이 없습니다.</span>}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;