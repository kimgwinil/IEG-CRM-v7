export enum CustomerGrade {
  S = 'S',
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum SalesStatus {
  ACTUAL = '매출실적', // Completed (Bottom of stack)
  CONFIRMED = '매출확정', // Contract Signed
  EXPECTED = '매출예정', // High Probability
  UNDECIDED = '매출미정', // Pipeline (Top of stack)
}

export enum OpportunityStage {
  UNVISITED = '미방문',
  LEAD = '리드(잠재)',
  PROPOSAL = '제안',
  SPEC_WORK = '사양작업',
  PROCUREMENT = '조달요청',
  WON = '계약성사',
}

export enum Team {
  MARKETING_HQ = '마케팅본부',
  SALES_1 = '영업1팀',
  SALES_2 = '영업2팀',
  SALES_3 = '영업3팀',
  OVERSEAS = '해외사업팀',
}

export interface Customer {
  id: string;
  name: string; // 거래처명
  grade: CustomerGrade;
  pic: string; // IEG Sales Rep ID
  picName: string; // IEG Sales Rep Name
  contactPerson: string; // 담당자
  position: string; // 직책
  tel: string;
  email: string;
  lastVisit: string;
  industry: string;
  address: string; // For region generation
  region: string; // Auto-generated
}

export interface SalesRecord {
  id: string;
  customerId: string;
  customerName: string;
  picName: string; // Sales Rep
  status: SalesStatus;
  productAmount: number; // 제품금액
  merchandiseAmount: number; // 상품금액
  totalAmount: number; // 소계
  expectedDate: string; // 매출예정일 (YYYY-MM-DD)
  region: string;
  grade: CustomerGrade;
  item: string; // 품목
  description: string;
}

export interface OpportunityRecord {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  stage: OpportunityStage;
  amount: number;
  picName: string;
  lastUpdate: string;
}

export interface SalesRep {
  id: string;
  name: string;
  team: Team;
  email: string;
}

export interface DashboardStats {
  targetAmount: number;
  currentAmount: number;
  activityAmount: number;
  activeCustomerCount: number;
}

export type ViewScope = 'INDIVIDUAL' | 'TEAM' | 'ALL';

export enum AnalysisType {
  WEEKLY_PERFORMANCE = 'WEEKLY_PERFORMANCE',
  MARKET_TRENDS = 'MARKET_TRENDS',
  RISK_ASSESSMENT = 'RISK_ASSESSMENT',
  STRATEGY_SUGGESTION = 'STRATEGY_SUGGESTION',
}