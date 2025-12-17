import React from 'react';

const Guide: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-100 bg-slate-50">
        <h2 className="text-2xl font-bold text-gray-800">IEG CRM v7 설치 및 사용 가이드북</h2>
        <p className="text-gray-500 mt-2 text-sm">시스템 설정, 데이터 연동 및 주요 기능 활용법</p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* 1. 시스템 개요 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">1</span>
              <h3 className="text-xl font-bold text-gray-800">시스템 개요</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 text-gray-600 leading-relaxed">
              <p className="mb-2">
                <strong>IEG CRM v7</strong>은 영업 파이프라인 최적화와 AI 기반 분석을 위해 설계된 차세대 고객 관리 시스템입니다. 
                Google Gemini AI 엔진을 탑재하여 고객 데이터를 분석하고, 등급을 자동으로 제안하며, 주간 업무 리포트를 생성합니다.
              </p>
              <ul className="list-disc ml-5 space-y-1 mt-3 text-sm">
                <li><strong>주요 색상:</strong> Orange (IEG 아이덴티티 반영)</li>
                <li><strong>기술 스택:</strong> React, Tailwind CSS, Google GenAI SDK</li>
                <li><strong>데이터 연동:</strong> Google Sheets, Google Docs (n8n 워크플로우 연동 권장)</li>
              </ul>
            </div>
          </section>

          {/* 2. 설치 및 환경 설정 */}
          <section>
             <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">2</span>
              <h3 className="text-xl font-bold text-gray-800">설치 및 초기 설정 (Installation)</h3>
            </div>
            <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">① API Key 설정</h4>
                    <p className="text-sm text-slate-600 mb-2">
                        AI 분석 기능을 사용하기 위해서는 Google Gemini API 키가 필요합니다.
                    </p>
                    <code className="block bg-slate-800 text-green-400 p-3 rounded text-xs font-mono mb-2">
                        // .env 파일 생성 및 키 입력<br/>
                        REACT_APP_API_KEY=AIzaSy...
                    </code>
                    <p className="text-xs text-slate-500">
                        * API Key는 Google AI Studio에서 발급받을 수 있습니다.
                    </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">② n8n 및 구글 시트 연동</h4>
                    <p className="text-sm text-slate-600 mb-2">
                        데이터의 영구 저장을 위해 n8n 워크플로우를 설정해야 합니다.
                    </p>
                    <ol className="list-decimal ml-5 text-sm text-slate-600 space-y-1">
                        <li>제공된 <code>n8n_workflow.json</code> 파일을 n8n에 Import 합니다.</li>
                        <li>Google Sheets 노드에서 본인의 구글 계정을 인증하고 시트 ID를 연결합니다.</li>
                        <li>생성된 Webhook URL을 소스 코드의 <code>dataService.ts</code> 내 API 엔드포인트로 설정합니다.</li>
                    </ol>
                </div>
            </div>
          </section>

          {/* 3. 주요 기능 사용법 */}
          <section>
             <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">3</span>
              <h3 className="text-xl font-bold text-gray-800">주요 기능 사용법</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-orange-600 mb-2">📊 대시보드</h4>
                    <p className="text-sm text-gray-600">
                        누적 매출 실적과 목표 달성율을 직관적으로 확인합니다. 
                        도우넛 차트 외부에 표기된 금액과 내부에 표기된 등급(S/A/B)을 통해 고객 포트폴리오를 점검하세요.
                        AI가 분석한 '주간 예정 업무'를 통해 우선순위 고객을 파악할 수 있습니다.
                    </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-orange-600 mb-2">👥 고객 정보 관리</h4>
                    <p className="text-sm text-gray-600">
                        고객 등록 시 <strong>'AI 등급 분석'</strong> 버튼을 눌러보세요. 
                        입력된 기업 정보와 산업군 데이터를 바탕으로 AI가 적절한 고객 등급(S~D)을 제안합니다.
                    </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-orange-600 mb-2">💰 매출 예정 관리</h4>
                    <p className="text-sm text-gray-600">
                        2026년 매출 계획을 수립합니다. '매출 추가' 버튼을 통해 건별 데이터를 입력하고, 
                        리스트에서 직접 수정/삭제가 가능합니다. 입력된 데이터는 주간 리포트 분석의 기초 자료가 됩니다.
                    </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-bold text-orange-600 mb-2">📑 AI 보고서</h4>
                    <p className="text-sm text-gray-600">
                        주간 실적 보고서, 시장 동향, 리스크 진단 등 4가지 유형의 보고서를 AI가 자동 생성합니다. 
                        생성된 보고서는 Google Docs로 내보내어 즉시 출력하거나 공유할 수 있습니다.
                    </p>
                </div>
            </div>
          </section>

          <div className="text-center py-8 text-sm text-gray-400 border-t border-gray-100 mt-8">
            © 2026 IEG CRM v7. All Rights Reserved.
          </div>

        </div>
      </div>
    </div>
  );
};

export default Guide;
