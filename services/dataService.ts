import { Customer, CustomerGrade, SalesRecord, SalesStatus, SalesRep, Team, OpportunityRecord, OpportunityStage } from '../types';

export const MOCK_REPS: SalesRep[] = [
  { id: 'u1', name: '김철수', team: Team.SALES_1, email: 'cs.kim@ieg.co.kr' },
  { id: 'u2', name: '이영희', team: Team.SALES_1, email: 'yh.lee@ieg.co.kr' },
  { id: 'u3', name: '박민수', team: Team.SALES_2, email: 'ms.park@ieg.co.kr' },
  { id: 'u4', name: '최지훈', team: Team.OVERSEAS, email: 'jh.choi@ieg.co.kr' },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: '태양전자', grade: CustomerGrade.S, pic: 'u1', picName: '김철수', contactPerson: '박부장', position: '구매팀장', tel: '010-1234-5678', email: 'park@sun.com', lastVisit: '2024-05-20', industry: '제조', address: '경기도 수원시 영통구', region: '경기' },
  { id: 'c2', name: '미래건설', grade: CustomerGrade.A, pic: 'u2', picName: '이영희', contactPerson: '김이사', position: '현장소장', tel: '010-2345-6789', email: 'kim@mirae.com', lastVisit: '2024-05-15', industry: '건설', address: '서울특별시 강남구 테헤란로', region: '서울' },
  { id: 'c3', name: '한빛유통', grade: CustomerGrade.B, pic: 'u3', picName: '박민수', contactPerson: '최대리', position: '구매담당', tel: '010-3456-7890', email: 'choi@hanbit.com', lastVisit: '2024-04-10', industry: '유통', address: '부산광역시 해운대구', region: '부산' },
  { id: 'c4', name: '대현화학', grade: CustomerGrade.S, pic: 'u1', picName: '김철수', contactPerson: '정상무', position: '생산본부장', tel: '010-5555-5555', email: 'jung@daehyun.com', lastVisit: '2024-05-22', industry: '화학', address: '울산광역시 남구', region: '울산' },
  { id: 'c5', name: '세종테크', grade: CustomerGrade.C, pic: 'u2', picName: '이영희', contactPerson: '이과장', position: '개발팀장', tel: '010-7777-8888', email: 'lee@sejong.com', lastVisit: '2024-02-01', industry: 'IT', address: '경기도 성남시 분당구', region: '경기' },
];

export const MOCK_SALES_DATA: SalesRecord[] = [
  { id: 's1', customerId: 'c1', customerName: '태양전자', picName: '김철수', status: SalesStatus.CONFIRMED, productAmount: 300000000, merchandiseAmount: 200000000, totalAmount: 500000000, expectedDate: '2026-03-15', region: '경기', grade: CustomerGrade.S, item: '반도체 장비 A', description: '1분기 정기 계약' },
  { id: 's2', customerId: 'c2', customerName: '미래건설', picName: '이영희', status: SalesStatus.EXPECTED, productAmount: 200000000, merchandiseAmount: 100000000, totalAmount: 300000000, expectedDate: '2026-06-20', region: '서울', grade: CustomerGrade.A, item: '통신 설비', description: '신규 사옥 설비' },
  { id: 's3', customerId: 'c3', customerName: '한빛유통', picName: '박민수', status: SalesStatus.UNDECIDED, productAmount: 100000000, merchandiseAmount: 50000000, totalAmount: 150000000, expectedDate: '2026-09-10', region: '부산', grade: CustomerGrade.B, item: 'POS 시스템', description: '물류 시스템' },
  { id: 's4', customerId: 'c1', customerName: '태양전자', picName: '김철수', status: SalesStatus.ACTUAL, productAmount: 400000000, merchandiseAmount: 50000000, totalAmount: 450000000, expectedDate: '2026-01-20', region: '경기', grade: CustomerGrade.S, item: '유지보수', description: '연간 유지보수' },
  { id: 's5', customerId: 'c4', customerName: '대현화학', picName: '김철수', status: SalesStatus.EXPECTED, productAmount: 600000000, merchandiseAmount: 200000000, totalAmount: 800000000, expectedDate: '2026-04-05', region: '울산', grade: CustomerGrade.S, item: '플랜트 제어기', description: '공장 증설' },
  { id: 's6', customerId: 'c5', customerName: '세종테크', picName: '이영희', status: SalesStatus.ACTUAL, productAmount: 50000000, merchandiseAmount: 0, totalAmount: 50000000, expectedDate: '2026-02-15', region: '경기', grade: CustomerGrade.C, item: '서버 랙', description: '서버실 증설' },
];

export const MOCK_OPPORTUNITIES: OpportunityRecord[] = [
  { id: 'o1', customerId: 'c3', customerName: '한빛유통', title: '스마트 물류 제안', stage: OpportunityStage.PROPOSAL, amount: 200000000, picName: '박민수', lastUpdate: '2024-05-25' },
  { id: 'o2', customerId: 'c2', customerName: '미래건설', title: '2공구 통신망', stage: OpportunityStage.SPEC_WORK, amount: 500000000, picName: '이영희', lastUpdate: '2024-05-24' },
  { id: 'o3', customerId: 'c5', customerName: '세종테크', title: 'AI 서버 도입', stage: OpportunityStage.LEAD, amount: 100000000, picName: '이영희', lastUpdate: '2024-05-20' },
  { id: 'o4', customerId: 'c4', customerName: '대현화학', title: '안전 진단 센서', stage: OpportunityStage.UNVISITED, amount: 50000000, picName: '김철수', lastUpdate: '2024-05-01' },
];

export const getCustomers = async (): Promise<Customer[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CUSTOMERS]), 300));
};

export const getSalesData = async (year: number): Promise<SalesRecord[]> => {
  // In real app filter by year. Mock simply returns all for demo of 2026
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_SALES_DATA]), 300));
};

export const getOpportunities = async (): Promise<OpportunityRecord[]> => {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_OPPORTUNITIES]), 300));
};

export const saveCustomer = async (customer: Customer): Promise<void> => {
  console.log("Saving customer...", customer);
};
