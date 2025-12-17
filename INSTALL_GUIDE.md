# IEG CRM v7 상세 구축 매뉴얼

이 문서는 개발 환경이 낯선 분들도 따라 하실 수 있도록 **폴더 생성부터 실행까지** 아주 상세하게 설명합니다.

---

## 1단계: 메인 폴더 만들기 (바탕화면)

가장 먼저 모든 코드를 담을 "집"을 지어야 합니다.

1.  컴퓨터의 **바탕화면(Desktop)** 으로 이동합니다.
2.  마우스 우클릭 > **새로 만들기** > **폴더**를 클릭합니다.
3.  폴더 이름을 **`IEG_CRM_V7`** 이라고 입력합니다.
    *   *참고: 원하신다면 '내 문서' 등 다른 곳에 만드셔도 상관없습니다.*

---

## 2단계: 코드 에디터로 폴더 열기

코드를 작성하고 실행할 도구(VS Code)가 필요합니다.

1.  **Visual Studio Code (VS Code)** 프로그램을 실행합니다.
2.  상단 메뉴에서 **파일(File) > 폴더 열기(Open Folder)** 를 클릭합니다.
3.  방금 바탕화면에 만든 **`IEG_CRM_V7`** 폴더를 선택하고 '열기'를 누릅니다.

---

## 3단계: 파일 및 폴더 구조 잡기 (중요!)

이제 VS Code 왼쪽의 탐색기(EXPLORER) 창에서 아래 그림과 똑같이 폴더와 파일을 만들어야 합니다.

### 3-1. 폴더 만들기
VS Code 탐색기 빈 공간 우클릭 > **새 폴더(New Folder)** 선택

1.  `components` 라는 이름으로 폴더 생성
2.  `services` 라는 이름으로 폴더 생성

### 3-2. 파일 만들기 및 코드 붙여넣기
VS Code 탐색기 빈 공간 우클릭 > **새 파일(New File)** 선택

아래 목록에 있는 파일들을 하나씩 만들고, 제가 제공해 드린 코드를 복사해서 붙여넣으세요.

**[최상위 경로 (IEG_CRM_V7 폴더 바로 아래)]**
*   📄 `package.json` (새로 추가됨: 프로젝트 설정 파일)
*   📄 `.env` (새로 추가됨: 구글 API 키 저장 파일)
*   📄 `App.tsx`
*   📄 `index.tsx`
*   📄 `types.ts`
*   📄 `index.html` (public 폴더 없이 최상위에 두어도 되지만, 보통은 public 폴더 안에 둡니다. 이 프로젝트 설정상 최상위에 두셔도 작동합니다.)

**[components 폴더 안]**
*   📄 `Dashboard.tsx`
*   📄 `SalesForecast.tsx`
*   📄 `CustomerManager.tsx`
*   📄 `AIReport.tsx`
*   📄 `SalesOpportunity.tsx`
*   📄 `Settings.tsx`
*   📄 `Layout.tsx`
*   📄 `IEGAssistant.tsx`

**[services 폴더 안]**
*   📄 `dataService.ts`
*   📄 `geminiService.ts`

---

## 4단계: API 키 설정하기

AI 기능을 쓰려면 열쇠(Key)가 필요합니다.

1.  최상위 경로에 만든 **`.env`** 파일을 엽니다.
2.  아래 내용을 입력합니다.
    ```env
    REACT_APP_API_KEY=AIzaSy... (구글에서 받은 키를 여기에 붙여넣기)
    ```
    *   *키가 없다면 [Google AI Studio](https://aistudio.google.com/)에서 'Get API key'를 눌러 무료로 발급받으세요.*

---

## 5단계: 프로그램 설치 및 실행

이제 준비된 재료를 조립할 차례입니다.

1.  VS Code 상단 메뉴에서 **터미널(Terminal) > 새 터미널(New Terminal)** 을 클릭합니다.
2.  화면 아래쪽에 터미널 창이 열리면, 다음 명령어를 입력하고 엔터(Enter)를 치세요. (인터넷 연결 필요)

    ```bash
    npm install
    ```
    *(약 1~2분 정도 걸리며, 필요한 부품들을 다운로드합니다.)*

3.  설치가 끝나면, 실행 명령어를 입력하세요.

    ```bash
    npm start
    ```

4.  잠시 후 인터넷 브라우저가 자동으로 열리며 **IEG CRM v7** 화면이 나타납니다!

---

## 6단계: 데이터 연동 (심화 - 관리자용)

보고서를 구글 닥스로 보내거나 데이터를 저장하려면 `n8n`이라는 자동화 도구가 필요합니다.
제공해 드린 `n8n_workflow.json` 파일은 코드가 아니라, n8n 사이트에서 **"Import(가져오기)"** 할 때 쓰는 설정 파일입니다.

1.  n8n 설치 또는 클라우드 버전 접속
2.  Workflows 메뉴 > Import from File 클릭
3.  `n8n_workflow.json` 선택

---

### 자주 묻는 질문

*   **Q: `npm` 명령어가 없다고 나와요.**
    *   A: [Node.js](https://nodejs.org/) 프로그램을 컴퓨터에 먼저 설치해야 합니다. LTS 버전을 설치해주세요.

*   **Q: 화면이 하얗게만 나와요.**
    *   A: `.env` 파일에 API 키를 제대로 넣었는지 확인하고, 터미널에서 `Ctrl + C`를 눌러 껐다가 다시 `npm start` 해보세요.

© 2026 IEG Dev Team.
