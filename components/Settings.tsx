import React, { useState } from 'react';
import { MOCK_REPS } from '../services/dataService';
import { Team } from '../types';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [reps, setReps] = useState(MOCK_REPS);
  const [newRepName, setNewRepName] = useState('');
  const [newRepTeam, setNewRepTeam] = useState<Team>(Team.SALES_1);

  const handleAddRep = () => {
    if (newRepName) {
      setReps([...reps, { id: `u${Date.now()}`, name: newRepName, team: newRepTeam, email: '' }]);
      setNewRepName('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
       <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'profile' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            내 정보 수정
          </button>
          <button 
            onClick={() => setActiveTab('reps')}
            className={`px-6 py-4 font-medium text-sm ${activeTab === 'reps' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            영업 담당자 관리
          </button>
       </div>

       <div className="p-8 max-w-2xl">
          {activeTab === 'profile' && (
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">관리자 정보</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input type="text" className="w-full border rounded p-2 bg-white text-gray-900" defaultValue="관리자" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <input type="email" className="w-full border rounded p-2 bg-white text-gray-900" defaultValue="admin@ieg.co.kr" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 변경</label>
                        <input type="password" className="w-full border rounded p-2 bg-white text-gray-900" placeholder="새 비밀번호" />
                    </div>
                </div>
                <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">저장</button>
            </div>
          )}

          {activeTab === 'reps' && (
             <div className="space-y-6">
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-bold text-gray-800 mb-3">새 영업 담당자 추가</h4>
                    <div className="flex gap-2">
                        <select 
                            className="border rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
                            value={newRepTeam}
                            onChange={(e) => setNewRepTeam(e.target.value as Team)}
                        >
                            {Object.values(Team).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input 
                            type="text" 
                            className="flex-1 border rounded p-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none" 
                            placeholder="이름 입력"
                            value={newRepName}
                            onChange={(e) => setNewRepName(e.target.value)}
                        />
                        <button onClick={handleAddRep} className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700 font-medium">추가</button>
                    </div>
                 </div>

                 <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-3">등록된 담당자 목록</h4>
                    <ul className="divide-y divide-gray-100 border rounded-lg overflow-hidden bg-white">
                        {reps.map(rep => (
                            <li key={rep.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <span className="font-bold text-gray-800 mr-2">{rep.name}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">{rep.team}</span>
                                </div>
                                <button className="text-red-500 text-xs hover:underline font-medium">삭제</button>
                            </li>
                        ))}
                    </ul>
                 </div>
             </div>
          )}
       </div>
    </div>
  );
};

export default Settings;
