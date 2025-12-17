import React, { useState, useEffect } from 'react';
import { OpportunityRecord, OpportunityStage } from '../types';
import { getOpportunities } from '../services/dataService';

const SalesOpportunity: React.FC = () => {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>([]);

  useEffect(() => {
    getOpportunities().then(setOpportunities);
  }, []);

  const stages = Object.values(OpportunityStage);

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 h-full min-w-max pb-2">
        {stages.map((stage) => (
          <div key={stage} className="w-72 flex flex-col bg-gray-100 rounded-xl max-h-full">
            <div className="p-3 font-bold text-gray-700 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-gray-100 rounded-t-xl z-10">
              <span>{stage}</span>
              <span className="bg-white text-xs px-2 py-0.5 rounded-full border border-gray-200">
                {opportunities.filter(o => o.stage === stage).length}
              </span>
            </div>
            <div className="p-2 flex-1 overflow-y-auto space-y-2">
              {opportunities.filter(o => o.stage === stage).map(opp => (
                <div key={opp.id} className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-xs text-orange-600 font-bold mb-1">{opp.customerName}</div>
                  <div className="font-medium text-gray-800 text-sm mb-2">{opp.title}</div>
                  <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-500">{opp.picName}</div>
                    <div className="text-sm font-bold text-gray-900">{(opp.amount / 1000000).toFixed(0)}백만원</div>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 text-right">{opp.lastUpdate}</div>
                </div>
              ))}
              {opportunities.filter(o => o.stage === stage).length === 0 && (
                <div className="text-center text-gray-400 text-xs py-4">데이터 없음</div>
              )}
            </div>
            <div className="p-2">
                <button className="w-full py-1 text-sm text-gray-500 hover:bg-gray-200 rounded dashed border border-gray-300">
                    + 추가
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesOpportunity;
