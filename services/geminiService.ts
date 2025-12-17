import { GoogleGenAI } from "@google/genai";
import { AnalysisType, SalesRecord, Customer, CustomerGrade } from "../types";

const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const generateAIAnalysis = async (
  type: AnalysisType,
  salesData: SalesRecord[],
  customers: Customer[],
  scope: string
): Promise<string> => {
  
  if (!apiKey) return "API Key is missing.";

  const modelId = "gemini-2.5-flash"; 

  let prompt = "";
  const dataContext = JSON.stringify({ sales: salesData.slice(0, 20), customers: customers.slice(0, 20) });

  const baseInstruction = `
    당신은 IEG 기업의 수석 영업 전략가이자 데이터 분석가입니다.
    IEG의 상징색은 주황색이며, 역동적이고 현대적인 영업 전략을 제시합니다.
    제공된 JSON 데이터를 기반으로 통찰력 있는 분석 결과를 마크다운(Markdown) 형식으로 작성해 주세요.
    
    데이터: ${dataContext}
    분석 대상 범위: ${scope}
  `;

  switch (type) {
    case AnalysisType.WEEKLY_PERFORMANCE:
      prompt = `${baseInstruction}
      다음 항목을 포함하여 "주간 영업 실적 보고서"를 작성하세요:
      1. 금주 주요 성과 요약
      2. 목표 대비 달성 현황 분석
      3. 주요 성공/실패 요인
      4. 다음 주 중점 관리 사항
      `;
      break;

    case AnalysisType.MARKET_TRENDS:
      prompt = `${baseInstruction}
      "시장 동향 및 외부 분석" 리포트를 작성하세요.
      주요 고객 산업군(제조, 건설, 유통 등)을 바탕으로 2026년 경제 전망을 시뮬레이션하세요.
      1. 주요 고객 산업군 동향
      2. 경쟁사 예상 움직임
      3. 기회 및 위협 요인 (SWOT 분석 중 OT)
      `;
      break;

    case AnalysisType.RISK_ASSESSMENT:
      prompt = `${baseInstruction}
      "고객 리스크 진단"을 수행하세요.
      1. 이탈 위험이 있는 고객 식별
      2. 계약 지연 리스크가 있는 건 분석
      3. 리스크 완화 방안 제언
      `;
      break;
      
    case AnalysisType.STRATEGY_SUGGESTION:
      prompt = `${baseInstruction}
      "차주 영업 진단 및 전략 제언"을 작성하세요.
      1. AI가 추천하는 방문 필수 거래처
      2. 파이프라인 가속화를 위한 액션 아이템
      3. 영업 담당자 동기부여 메시지
      `;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "분석 결과를 생성할 수 없습니다.";
  } catch (error) {
    return "AI 분석 중 오류가 발생했습니다.";
  }
};

export const generateLeadRecommendations = async (customers: Customer[]): Promise<string[]> => {
    if (!apiKey) return ["API Key required for AI leads"];

    const prompt = `
    다음 고객 목록을 분석하여 다음 주에 반드시 방문해야 할 "주간 예정 업무(방문 필수 거래처)" 3곳을 추천하고 이유를 짧게 서술하세요.
    S, A 등급이면서 마지막 방문일이 오래된 순서로 우선순위를 두세요.
    형식: "- [고객명] (등급): 이유"
    
    고객 목록: ${JSON.stringify(customers)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return response.text?.split('\n').filter(line => line.trim().startsWith('-')) || [];
    } catch (e) {
        return ["AI 추천을 불러오는 데 실패했습니다."];
    }
}

export const analyzeCustomerGrade = async (customerInfo: Partial<Customer>): Promise<CustomerGrade> => {
    if (!apiKey) return CustomerGrade.C; // Default if no key

    const prompt = `
    다음 고객 정보를 바탕으로 고객 등급(S, A, B, C, D)을 평가해 주세요.
    산업군 규모와 중요도, 지역 등을 고려하여 잠재 가치를 판단하세요.
    오직 등급 알파벳 한 글자만 반환하세요 (예: A).
    
    고객 정보: ${JSON.stringify(customerInfo)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        const grade = response.text?.trim().toUpperCase() as CustomerGrade;
        return Object.values(CustomerGrade).includes(grade) ? grade : CustomerGrade.C;
    } catch (e) {
        return CustomerGrade.C;
    }
}

export const askIEGAssistant = async (query: string, salesData: SalesRecord[], customers: Customer[]): Promise<string> => {
    if (!apiKey) return "API Key가 설정되지 않았습니다.";

    // Context Optimization: Limit payload size
    const contextSales = salesData.map(s => ({
        c: s.customerName, // Shorten keys
        p: s.picName,
        s: s.status,
        a: s.totalAmount,
        i: s.item
    }));
    
    const contextCustomers = customers.map(c => ({
        n: c.name,
        g: c.grade,
        p: c.picName,
        i: c.industry
    }));

    // System Instruction for Persona
    const systemInstruction = `
    당신은 'IEG 어시스턴트'입니다. 다음 규칙을 따르세요:
    1. 사용자의 질문에 대해 제공된 CRM 데이터를 분석하여 답변합니다.
    2. 친절하고 전문적인 말투(해요체)를 사용합니다.
    3. 데이터에 없는 내용은 추측하지 말고 "데이터에서 찾을 수 없습니다"라고 답합니다.
    4. 금액은 억/천만원 단위로 변환하여 읽기 쉽게 표시합니다.
    5. 답변은 명확하고 간결하게 작성합니다.
    `;

    const prompt = `
    [매출 데이터 (c:거래처, p:담당자, s:상태, a:금액, i:품목)]
    ${JSON.stringify(contextSales)}

    [고객 데이터 (n:이름, g:등급, p:담당자, i:산업군)]
    ${JSON.stringify(contextCustomers)}

    사용자 질문: ${query}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7, // Balance creativity and accuracy
            }
        });
        return response.text || "답변을 생성할 수 없습니다.";
    } catch (e) {
        console.error(e);
        return "죄송합니다. 처리 중 오류가 발생했습니다. (잠시 후 다시 시도해주세요)";
    }
};