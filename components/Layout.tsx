import React, { useState, useEffect } from 'react';
import { ViewScope } from '../types';
import { MOCK_REPS } from '../services/dataService';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  scope: ViewScope;
  onScopeChange: (scope: ViewScope) => void;
  selectedRep: string | null;
  onRepChange: (repId: string | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, onTabChange, 
  scope, onScopeChange, selectedRep, onRepChange 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); 
    return () => clearInterval(timer);
  }, []);

  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
  };

  const formattedDate = `${currentTime.getFullYear()}년 ${currentTime.getMonth() + 1}월 ${currentTime.getDate()}일 ${currentTime.getHours()}시 [${getWeekNumber(currentTime)}주차]`;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col no-print">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-orange-500 tracking-tighter">IEG CRM <span className="text-sm text-gray-400">v7</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: '대시보드', icon: '📊' },
            { id: 'customer', label: '고객 정보 관리', icon: '👥' },
            { id: 'opportunity', label: '영업기회', icon: '💡' },
            { id: 'sales', label: '매출예정관리', icon: '💰' },
            { id: 'report', label: '보고서 (AI)', icon: '📑' },
            { id: 'settings', label: '설정', icon: '⚙️' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === item.id 
                  ? 'bg-orange-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">A</div>
            <div>
              <p className="text-sm font-semibold">관리자</p>
              <p className="text-xs text-slate-400">IEG 본부</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10 no-print">
          <div className="flex items-center gap-6">
            <span className="text-slate-500 font-mono text-sm bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {formattedDate}
            </span>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { id: 'INDIVIDUAL', label: '개인별' },
                { id: 'TEAM', label: '팀별' },
                { id: 'ALL', label: '전체' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onScopeChange(tab.id as ViewScope)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    scope === tab.id 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {scope !== 'ALL' && (
              <select 
                className="bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                value={selectedRep || ''}
                onChange={(e) => onRepChange(e.target.value || null)}
              >
                <option value="">담당자 선택...</option>
                {MOCK_REPS.map(rep => (
                  <option key={rep.id} value={rep.id}>{rep.name} ({rep.team})</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={() => window.print()} className="text-gray-500 hover:text-orange-600 transition-colors p-2" title="프린트/PDF 저장">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
             </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 relative">
           {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;