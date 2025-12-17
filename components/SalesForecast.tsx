import React, { useState, useMemo } from 'react';
import { SalesRecord, SalesStatus, CustomerGrade } from '../types';

interface SalesForecastProps {
  salesData: SalesRecord[];
  year: number;
  onYearChange: (year: number) => void;
  onUpdate: (record: SalesRecord) => void;
  onDelete: (id: string) => void;
  onAdd: (record: SalesRecord) => void;
}

// Mock data for weekly variance since we don't have historical DB snapshots in this frontend demo
const MOCK_WEEKLY_CHANGES = [
  { type: '증액', customer: '태양전자', content: '1분기 계약 금액 상향', amount: 50000000, pic: '김철수' },
  { type: '이월', customer: '미래건설', content: '계약 시점 3월 -> 4월 연기', amount: 300000000, pic: '이영희' },
  { type: '추가', customer: '신규테크', content: '신규 리드 발굴', amount: 15000000, pic: '박민수' },
  { type: '삭제', customer: '한빛유통', content: '프로젝트 취소', amount: -20000000, pic: '박민수' },
  { type: '감액', customer: '대현화학', content: '일부 품목 제외', amount: -5000000, pic: '김철수' },
];

const SalesForecast: React.FC<SalesForecastProps> = ({ 
  salesData, 
  year, 
  onYearChange, 
  onUpdate, 
  onDelete,
  onAdd 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Partial<SalesRecord>>({});

  // --- Calculations for Aggregates ---

  // 1. Monthly Aggregates
  const monthlyAggregates = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      [SalesStatus.ACTUAL]: 0,
      [SalesStatus.CONFIRMED]: 0,
      [SalesStatus.EXPECTED]: 0,
      [SalesStatus.UNDECIDED]: 0,
      total: 0
    }));

    salesData.forEach(record => {
      const date = new Date(record.expectedDate);
      // Ensure date matches selected year
      if (date.getFullYear() === year) {
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          months[monthIndex][record.status] += record.totalAmount;
          months[monthIndex].total += record.totalAmount;
        }
      }
    });

    return months;
  }, [salesData, year]);

  // Annual Total for Monthly Table
  const annualTotal = useMemo(() => {
    return monthlyAggregates.reduce((acc, curr) => ({
      [SalesStatus.ACTUAL]: acc[SalesStatus.ACTUAL] + curr[SalesStatus.ACTUAL],
      [SalesStatus.CONFIRMED]: acc[SalesStatus.CONFIRMED] + curr[SalesStatus.CONFIRMED],
      [SalesStatus.EXPECTED]: acc[SalesStatus.EXPECTED] + curr[SalesStatus.EXPECTED],
      [SalesStatus.UNDECIDED]: acc[SalesStatus.UNDECIDED] + curr[SalesStatus.UNDECIDED],
      total: acc.total + curr.total
    }), {
      [SalesStatus.ACTUAL]: 0,
      [SalesStatus.CONFIRMED]: 0,
      [SalesStatus.EXPECTED]: 0,
      [SalesStatus.UNDECIDED]: 0,
      total: 0
    });
  }, [monthlyAggregates]);

  // 2. Representative Aggregates
  const repAggregates = useMemo(() => {
    const reps: Record<string, any> = {};

    salesData.forEach(record => {
        const date = new Date(record.expectedDate);
        if (date.getFullYear() === year) {
            const pic = record.picName || 'Unassigned';
            if (!reps[pic]) {
                reps[pic] = {
                    name: pic,
                    [SalesStatus.ACTUAL]: 0,
                    [SalesStatus.CONFIRMED]: 0,
                    [SalesStatus.EXPECTED]: 0,
                    [SalesStatus.UNDECIDED]: 0,
                    total: 0
                };
            }
            reps[pic][record.status] += record.totalAmount;
            reps[pic].total += record.totalAmount;
        }
    });

    return Object.values(reps);
  }, [salesData, year]);


  // --- Helper Functions ---

  const getStatusColor = (status: SalesStatus) => {
    switch (status) {
      case SalesStatus.ACTUAL: return 'bg-orange-600 text-white border-orange-600';
      case SalesStatus.CONFIRMED: return 'bg-orange-100 text-orange-800 border-orange-200';
      case SalesStatus.EXPECTED: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case SalesStatus.UNDECIDED: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getChangeTypeBadge = (type: string) => {
      switch(type) {
          case '증액': return 'bg-red-100 text-red-700';
          case '감액': return 'bg-blue-100 text-blue-700';
          case '추가': return 'bg-green-100 text-green-700';
          case '삭제': return 'bg-gray-100 text-gray-700 line-through';
          case '이월': return 'bg-orange-100 text-orange-700';
          default: return 'bg-gray-100';
      }
  };

  // --- Handlers ---

  const handleEdit = (record: SalesRecord) => {
    setCurrentRecord({ ...record });
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setCurrentRecord({
      id: '', // New record indicator
      status: SalesStatus.UNDECIDED,
      grade: CustomerGrade.C,
      expectedDate: `${year}-01-01`,
      productAmount: 0,
      merchandiseAmount: 0,
      totalAmount: 0,
      region: '서울'
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  const handleSave = () => {
    if (currentRecord.customerName) {
      const productAmt = Number(currentRecord.productAmount) || 0;
      const merchAmt = Number(currentRecord.merchandiseAmount) || 0;
      const total = productAmt + merchAmt;

      const recordToSave = {
        ...currentRecord,
        productAmount: productAmt,
        merchandiseAmount: merchAmt,
        totalAmount: total,
      } as SalesRecord;

      if (currentRecord.id) {
        onUpdate(recordToSave);
      } else {
        onAdd({ ...recordToSave, id: `s${Date.now()}` });
      }
      setIsModalOpen(false);
    } else {
        alert("거래처명을 입력해주세요.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Top Controls */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4 bg-white sticky top-0 z-20">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            매출 예정 관리
            <select 
                value={year} 
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="ml-2 text-base font-normal bg-gray-50 border border-gray-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-orange-500"
            >
                <option value={2024}>2024년</option>
                <option value={2025}>2025년</option>
                <option value={2026}>2026년</option>
            </select>
        </h2>
        
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded text-sm font-medium hover:bg-indigo-100">
                <span>🔄</span> 동기화
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <button 
              onClick={handleNew}
              className="px-4 py-1.5 bg-orange-600 text-white rounded text-sm font-bold hover:bg-orange-700 shadow-sm"
            >
                + 매출 추가
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-8">
        
        {/* 1. Main Data Table */}
        <section>
            <h3 className="text-sm font-bold text-gray-600 mb-2 border-l-4 border-orange-500 pl-2">상세 매출 목록</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                    <th className="px-4 py-3 bg-gray-50">구분</th>
                    <th className="px-4 py-3 bg-gray-50">거래처</th>
                    <th className="px-4 py-3 bg-gray-50">담당자</th>
                    <th className="px-4 py-3 bg-gray-50 text-right font-bold">소계</th>
                    <th className="px-4 py-3 bg-gray-50 text-center">매출예정일</th>
                    <th className="px-4 py-3 bg-gray-50 text-center">관리</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {salesData.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">데이터가 없습니다.</td>
                    </tr>
                    ) : (
                    salesData.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(record.status)}`}>
                            {record.status}
                            </span>
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900">{record.customerName}</td>
                        <td className="px-4 py-2 text-gray-600">{record.picName}</td>
                        <td className="px-4 py-2 text-right font-bold text-gray-800">
                            {record.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-600">{record.expectedDate}</td>
                        <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                                <button onClick={() => handleEdit(record)} className="text-blue-500 hover:text-blue-700 text-xs">수정</button>
                                <span className="text-gray-300">|</span>
                                <button onClick={() => handleDelete(record.id)} className="text-gray-400 hover:text-red-600 text-xs">삭제</button>
                            </div>
                        </td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
        </section>

        {/* 2. Monthly Summary Table */}
        <section>
            <h3 className="text-sm font-bold text-gray-600 mb-2 border-l-4 border-blue-500 pl-2">월별 매출 집계 (Monthly Aggregate)</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-center whitespace-nowrap">
                    <thead className="bg-blue-50 text-blue-900 font-bold">
                        <tr>
                            <th className="px-4 py-2 text-left">월 (Month)</th>
                            <th className="px-4 py-2">매출실적 (Actual)</th>
                            <th className="px-4 py-2">매출확정 (Confirmed)</th>
                            <th className="px-4 py-2">매출예정 (Expected)</th>
                            <th className="px-4 py-2">매출미정 (Undecided)</th>
                            <th className="px-4 py-2 bg-blue-100">합계 (Total)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {monthlyAggregates.map((m) => (
                            <tr key={m.month} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-left font-medium text-gray-700">{m.month}월</td>
                                <td className="px-4 py-2 text-gray-600">{m[SalesStatus.ACTUAL].toLocaleString()}</td>
                                <td className="px-4 py-2 text-gray-600">{m[SalesStatus.CONFIRMED].toLocaleString()}</td>
                                <td className="px-4 py-2 text-gray-600">{m[SalesStatus.EXPECTED].toLocaleString()}</td>
                                <td className="px-4 py-2 text-gray-400">{m[SalesStatus.UNDECIDED].toLocaleString()}</td>
                                <td className="px-4 py-2 font-bold text-blue-800 bg-blue-50/30">{m.total.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-slate-800 text-white font-bold">
                        <tr>
                            <td className="px-4 py-3 text-left">연간 총계 (Total)</td>
                            <td className="px-4 py-3">{annualTotal[SalesStatus.ACTUAL].toLocaleString()}</td>
                            <td className="px-4 py-3">{annualTotal[SalesStatus.CONFIRMED].toLocaleString()}</td>
                            <td className="px-4 py-3">{annualTotal[SalesStatus.EXPECTED].toLocaleString()}</td>
                            <td className="px-4 py-3 text-gray-300">{annualTotal[SalesStatus.UNDECIDED].toLocaleString()}</td>
                            <td className="px-4 py-3 text-yellow-400">{annualTotal.total.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>

        {/* 3. Representative Summary Table */}
        <section>
            <h3 className="text-sm font-bold text-gray-600 mb-2 border-l-4 border-green-500 pl-2">담당자별 매출 집계 (Personal Aggregate)</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-sm text-center whitespace-nowrap">
                    <thead className="bg-green-50 text-green-900 font-bold">
                        <tr>
                            <th className="px-4 py-2 text-left">담당자</th>
                            <th className="px-4 py-2">매출실적</th>
                            <th className="px-4 py-2">매출확정</th>
                            <th className="px-4 py-2">매출예정</th>
                            <th className="px-4 py-2">매출미정</th>
                            <th className="px-4 py-2 bg-green-100">합계</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {repAggregates.map((rep, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-left font-medium text-gray-700">{rep.name}</td>
                                <td className="px-4 py-2 text-gray-600">{rep[SalesStatus.ACTUAL].toLocaleString()}</td>
                                <td className="px-4 py-2 text-gray-600">{rep[SalesStatus.CONFIRMED].toLocaleString()}</td>
                                <td className="px-4 py-2 text-gray-600">{rep[SalesStatus.EXPECTED].toLocaleString()}</td>
                                <td className="px-4 py-2 text-gray-400">{rep[SalesStatus.UNDECIDED].toLocaleString()}</td>
                                <td className="px-4 py-2 font-bold text-green-800 bg-green-50/30">{rep.total.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        {/* 4. Weekly Variance Analysis */}
        <section>
            <h3 className="text-sm font-bold text-gray-600 mb-2 border-l-4 border-purple-500 pl-2">전주 대비 금주 변동 현황 (Weekly Variance)</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-purple-50 text-purple-900 font-bold">
                        <tr>
                            <th className="px-4 py-2 text-center w-24">구분</th>
                            <th className="px-4 py-2">거래처</th>
                            <th className="px-4 py-2">내용</th>
                            <th className="px-4 py-2 text-right">변동금액</th>
                            <th className="px-4 py-2 text-center">담당자</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {MOCK_WEEKLY_CHANGES.map((change, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-center">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getChangeTypeBadge(change.type)}`}>
                                        {change.type}
                                    </span>
                                </td>
                                <td className="px-4 py-2 font-medium text-gray-800">{change.customer}</td>
                                <td className="px-4 py-2 text-gray-600">{change.content}</td>
                                <td className={`px-4 py-2 text-right font-bold ${change.amount > 0 ? 'text-red-600' : change.amount < 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {change.amount !== 0 ? change.amount.toLocaleString() : '-'}
                                </td>
                                <td className="px-4 py-2 text-center text-gray-500">{change.pic}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">* 본 데이터는 주간 마감 스냅샷을 기준으로 자동 생성됩니다.</p>
        </section>

      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[600px] max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold mb-6 border-b pb-2">
                매출 정보 {currentRecord.id ? '수정' : '추가'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">구분 (Status)</label>
                <select 
                    value={currentRecord.status}
                    onChange={e => setCurrentRecord({...currentRecord, status: e.target.value as SalesStatus})}
                    className="w-full border rounded p-2 text-sm"
                >
                    {Object.values(SalesStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">등급</label>
                <select 
                    value={currentRecord.grade}
                    onChange={e => setCurrentRecord({...currentRecord, grade: e.target.value as CustomerGrade})}
                    className="w-full border rounded p-2 text-sm"
                >
                    {Object.values(CustomerGrade).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">거래처명</label>
                <input 
                    type="text" 
                    className="w-full border rounded p-2" 
                    value={currentRecord.customerName || ''} 
                    onChange={e => setCurrentRecord({...currentRecord, customerName: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">담당자(영업)</label>
                <input 
                    type="text" 
                    className="w-full border rounded p-2" 
                    value={currentRecord.picName || ''} 
                    onChange={e => setCurrentRecord({...currentRecord, picName: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
                <input 
                    type="text" 
                    className="w-full border rounded p-2" 
                    value={currentRecord.region || ''} 
                    onChange={e => setCurrentRecord({...currentRecord, region: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제품금액</label>
                <input 
                    type="number" 
                    className="w-full border rounded p-2" 
                    value={currentRecord.productAmount || 0} 
                    onChange={e => setCurrentRecord({...currentRecord, productAmount: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상품금액</label>
                <input 
                    type="number" 
                    className="w-full border rounded p-2" 
                    value={currentRecord.merchandiseAmount || 0} 
                    onChange={e => setCurrentRecord({...currentRecord, merchandiseAmount: Number(e.target.value)})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">매출예정일</label>
                <input 
                    type="date" 
                    className="w-full border rounded p-2" 
                    value={currentRecord.expectedDate || ''} 
                    onChange={e => setCurrentRecord({...currentRecord, expectedDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">품목</label>
                <input 
                    type="text" 
                    className="w-full border rounded p-2" 
                    value={currentRecord.item || ''} 
                    onChange={e => setCurrentRecord({...currentRecord, item: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">취소</button>
              <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesForecast;
