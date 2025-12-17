import React, { useState } from 'react';
import { Customer, CustomerGrade } from '../types';
import { analyzeCustomerGrade } from '../services/geminiService';

interface CustomerManagerProps {
  customers: Customer[];
  onUpdate: (customer: Customer) => void;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ customers, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({});
  const [analyzingGrade, setAnalyzingGrade] = useState(false);

  // Grade Colors
  const gradeColors: Record<CustomerGrade, string> = {
    [CustomerGrade.S]: 'bg-purple-100 text-purple-700 border-purple-200',
    [CustomerGrade.A]: 'bg-blue-100 text-blue-700 border-blue-200',
    [CustomerGrade.B]: 'bg-green-100 text-green-700 border-green-200',
    [CustomerGrade.C]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    [CustomerGrade.D]: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer({ ...customer });
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setCurrentCustomer({
      id: Date.now().toString(),
      grade: CustomerGrade.C,
      region: '서울', // Default
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (currentCustomer.name) {
      onUpdate(currentCustomer as Customer);
      setIsModalOpen(false);
    }
  };

  const handleAIGrade = async () => {
    setAnalyzingGrade(true);
    const grade = await analyzeCustomerGrade(currentCustomer);
    setCurrentCustomer(prev => ({ ...prev, grade }));
    setAnalyzingGrade(false);
  };

  const filtered = customers.filter(c => 
    c.name.includes(searchTerm) || c.contactPerson.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">고객 정보 관리</h2>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="거래처명, 담당자 검색" 
            className="border border-gray-300 rounded px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-orange-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleNew} className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700">
            + 신규 등록
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
            <tr>
              <th className="px-6 py-3">등급</th>
              <th className="px-6 py-3">거래처명</th>
              <th className="px-6 py-3">담당자</th>
              <th className="px-6 py-3">직책</th>
              <th className="px-6 py-3">연락처/이메일</th>
              <th className="px-6 py-3">영업담당자</th>
              <th className="px-6 py-3">마지막 접촉일</th>
              <th className="px-6 py-3 text-center">활동</th>
              <th className="px-6 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border ${gradeColors[customer.grade]}`}>
                    {customer.grade}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">{customer.name}</td>
                <td className="px-6 py-4 text-gray-700">{customer.contactPerson}</td>
                <td className="px-6 py-4 text-gray-500">{customer.position}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-xs text-gray-500">
                    <span>{customer.tel}</span>
                    <span className="text-blue-500">{customer.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{customer.picName}</td>
                <td className="px-6 py-4 text-gray-500">{customer.lastVisit}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => setIsActivityOpen(true)}
                    className="bg-green-50 text-green-600 px-3 py-1 rounded border border-green-200 text-xs hover:bg-green-100"
                  >
                    활동 기록
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleEdit(customer)}
                    className="text-gray-400 hover:text-orange-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold mb-6 border-b pb-2">고객 정보 {currentCustomer.id ? '수정' : '등록'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex items-end gap-2">
                 <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">등급</label>
                    <select 
                      value={currentCustomer.grade}
                      onChange={e => setCurrentCustomer({...currentCustomer, grade: e.target.value as CustomerGrade})}
                      className="w-full border rounded p-2"
                    >
                      {Object.values(CustomerGrade).map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                 </div>
                 <button 
                    onClick={handleAIGrade}
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 mb-0.5 flex items-center gap-1"
                 >
                   {analyzingGrade ? '분석 중...' : '🤖 AI 등급 분석'}
                 </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">거래처명</label>
                <input type="text" className="w-full border rounded p-2" value={currentCustomer.name || ''} onChange={e => setCurrentCustomer({...currentCustomer, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">산업군</label>
                <input type="text" className="w-full border rounded p-2" value={currentCustomer.industry || ''} onChange={e => setCurrentCustomer({...currentCustomer, industry: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                <input type="text" className="w-full border rounded p-2" value={currentCustomer.contactPerson || ''} onChange={e => setCurrentCustomer({...currentCustomer, contactPerson: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">직책</label>
                <input type="text" className="w-full border rounded p-2" value={currentCustomer.position || ''} onChange={e => setCurrentCustomer({...currentCustomer, position: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                <input type="text" className="w-full border rounded p-2" value={currentCustomer.tel || ''} onChange={e => setCurrentCustomer({...currentCustomer, tel: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input type="text" className="w-full border rounded p-2" value={currentCustomer.email || ''} onChange={e => setCurrentCustomer({...currentCustomer, email: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">주소 (지역 자동생성)</label>
                <input type="text" className="w-full border rounded p-2" value={currentCustomer.address || ''} onChange={e => setCurrentCustomer({...currentCustomer, address: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">취소</button>
              <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">저장</button>
            </div>
          </div>
        </div>
      )}

       {/* Activity Modal */}
       {isActivityOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[400px] p-6">
            <h3 className="text-lg font-bold mb-4">활동 기록 입력</h3>
            <textarea className="w-full border rounded p-2 h-32 mb-4" placeholder="활동 내용을 입력하세요..."></textarea>
            <div className="flex justify-end gap-2">
               <button onClick={() => setIsActivityOpen(false)} className="px-4 py-2 text-gray-600">취소</button>
               <button onClick={() => setIsActivityOpen(false)} className="px-4 py-2 bg-green-600 text-white rounded">기록 저장</button>
            </div>
          </div>
        </div>
       )}
    </div>
  );
};

export default CustomerManager;
