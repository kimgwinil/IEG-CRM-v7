import React, { useState } from 'react';
import { AnalysisType, SalesRecord, Customer } from '../types';
import { generateAIAnalysis } from '../services/geminiService';

interface AIReportProps {
  salesData: SalesRecord[];
  customers: Customer[];
  scope: string;
}

const AIReport: React.FC<AIReportProps> = ({ salesData, customers, scope }) => {
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType>(AnalysisType.WEEKLY_PERFORMANCE);
  const [reportContent, setReportContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const analysisMenu = [
    { id: AnalysisType.WEEKLY_PERFORMANCE, label: '주간 영업 실적 보고서' },
    { id: AnalysisType.MARKET_TRENDS, label: '시장 동향 및 외부 분석' },
    { id: AnalysisType.RISK_ASSESSMENT, label: '고객 리스크 진단' },
    { id: AnalysisType.STRATEGY_SUGGESTION, label: '차주 영업 진단 전략 제언' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateAIAnalysis(activeAnalysis, salesData, customers, scope);
    setReportContent(result);
    setLoading(false);
  };

  const handleExportDocs = () => {
    // In a real app, this triggers the n8n webhook
    alert("n8n Webhook Triggered: 리포트가 Google Docs로 전송되었습니다. (Simulated)");
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
            {analysisMenu.map((item) => (
            <button
                key={item.id}
                onClick={() => {
                    setActiveAnalysis(item.id);
                    setReportContent(''); // Clear previous report on switch
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeAnalysis === item.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                {item.label}
            </button>
            ))}
        </div>
        
        <button 
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>분석 중...</span>
                </>
            ) : (
                <>
                    <span>✨ AI 리포트 생성</span>
                </>
            )}
        </button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <span className="text-indigo-500">📄</span>
                {analysisMenu.find(m => m.id === activeAnalysis)?.label}
            </h3>
            {reportContent && (
                <button onClick={handleExportDocs} className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Google Docs로 내보내기
                </button>
            )}
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto bg-white">
            {reportContent ? (
                <div className="prose prose-slate max-w-none prose-headings:text-orange-600">
                    {reportContent.split('\n').map((line, i) => (
                        <div key={i}>
                            {line.startsWith('#') ? (
                                <h3 className="text-xl font-bold mt-6 mb-3 text-gray-800">{line.replace(/#/g, '')}</h3>
                            ) : line.startsWith('-') ? (
                                <li className="ml-4 text-gray-700">{line.replace('-', '')}</li>
                            ) : (
                                <p className="mb-2 text-gray-600 leading-relaxed">{line}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                    <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p>AI에게 분석을 요청하여 리포트를 생성하세요.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIReport;
