# 빌드 브랜치 타임라인 — 스펙

머지 내역 확인 시 특정 커밋이 어느 브랜치에 포함됐는지 확인할 수 있도록,
MAINLINE / BETA / ALPHA 브랜치 흐름을 한눈에 보는 타임라인. 주 1회 갱신.

기존 xlsx 생성 방식(`CD 브랜치 현황 관리/build_timeline.py`)을 대체하는 HTML 버전.
**이벤트(브랜치/패치)만 입력하면 레인별 버전 구간과 색 전환 시점은 규칙 엔진이 자동 파생**한다.

## 파일 구성

| 파일 | 역할 | 갱신 빈도 |
|------|------|-----------|
| `index.html` | 뷰어 + 편집기 마크업/스타일 | 거의 없음 |
| `app.js` | 규칙 엔진 + 렌더러 + 편집기 로직 | 거의 없음 |
| `data.js` | 타임라인 데이터 (`window.TIMELINE_DATA`) | **매주** |

## 브랜치 운영 규칙

- 레인 구성: **MAINLINE → BETA → ALPHA** (MAINLINE이 상위)
- 패치는 항상 **ALPHA에서만** 발생 (`patchLaneId`)
- 버전 형태: `AA.BB.CC` (CC = 핫픽스, BB = 정기 패치, AA = 대형 업데이트)
- **격주로 두 가지 패치 방식이 번갈아 진행**
  - **정규 브랜치 주차**(`mode: "regular"`): MAINLINE → BETA → ALPHA 순으로 브랜치 후 ALPHA에서 패치
  - **ALPHA 단독 주차**(`mode: "solo"`): 별도 브랜치 없이 ALPHA에 추가 데이터만 받아서 패치
- 같은 날 핫픽스가 추가로 발생할 수 있음 (자동으로 패치 2번째 행에 표시됨)

## 색 전환 규칙 (app.js `deriveSegments`가 자동 적용)

| 상황 | 전환 시점 |
|------|-----------|
| 브랜치를 **받는** 레인 (`to`) | 브랜치 **당일**부터 해당 버전 |
| 브랜치를 **보낸** 레인 (`from`) | `sourceNext` 지정 시 **다음 날**부터 그 버전 |
| 단독(solo) 주차 버전 | **직전 패치/핫픽스 다음 날**부터 |
| 핫픽스 | **당일**부터 (기본 버전의 진한 변형색 자동 배정) |
| 정규(regular) 주차 버전 | 패치 이벤트 자체는 색 전환을 만들지 않음 — **브랜치 이벤트가 실제 입력되기 전까지 이전 버전 색 유지** |

> 마지막 규칙이 xlsx 시절 매번 손으로 재검토하던 "ALPHA는 BETA→ALPHA 브랜치 전까지
> 이전 버전 색 유지" 규칙이다. 이제 엔진이 보장하므로 별도 검토 불필요.

## 데이터 스키마 (`data.js`)

```js
window.TIMELINE_DATA = {
  title: "…",                 // 상단 타이틀
  startDate: "YYYY-MM-DD",    // 표시 범위
  endDate:   "YYYY-MM-DD",
  lanes: [                    // 위→아래 순서, 인접 레인 사이에 브릿지 행 자동 생성
    { id: "mainline", name: "MAINLINE", labelBg: "#1F4E79" }, …
  ],
  patchLaneId: "alpha",       // 패치가 발생하는 레인
  initialVersions: { laneId: "버전" },  // startDate 시점의 레인별 버전
  branches: [                 // 브랜치 이벤트
    { date, time, from, to, version, sourceNext? }, …
  ],
  patches: [                  // 패치/핫픽스 이벤트
    { date, version, type: "patch"|"hotfix", mode?: "regular"|"solo" }, …
  ],
  versionColors: { "버전": "#hex" }  // 색 오버라이드(없으면 자동 배정)
};
```

## 표시 규칙 (xlsx 레이아웃 계승)

- 가로축 = 날짜(1일 1컬럼), 요일/날짜 2단 헤더, 첫 컬럼(레인 레이블) sticky 고정
- 같은 레인의 같은 버전 구간은 colspan 병합, 버전명 1개만 표시
- 패치가 있었던 날의 헤더는 빨강, 주말은 회보라, 주 단위로 헤더 명암 교차
- 브릿지 행: 브랜치 발생일에만 해당 버전 색 + **시간만 표기** ("브랜치" 텍스트 없음)
- 패치 행: `버전 패치` / `버전 핫픽스` 빨간 글씨, 같은 날 2건이면 2행
- 오늘 날짜 강조 / 하단 범례는 사용하지 않음
- 셀 호버 시 툴팁 (레인·버전·구간 / 브랜치 상세 / 패치 주차 방식)

## 갱신 워크플로우

1. 페이지(로컬 파일 또는 GitHub Pages)에서 **⚙ 편집** → 이벤트 추가/수정
   - 편집 내용은 브라우저 localStorage에 자동 임시 저장됨
2. **⬇ data.js 다운로드** → 받은 파일로 레포의 `data.js` 교체
   - Claude에게 파일 경로를 주고 "푸시해줘" 하면 됨
   - 또는 일정을 텍스트로 알려주면 Claude가 data.js를 직접 수정
3. push → GitHub Pages 자동 반영 → 팀원들은 같은 URL에서 최신 타임라인 확인

## 검증

`index.html?selftest=1` 로 열면 규칙 엔진 파생 결과를 기준 데이터
(기존 xlsx `lane_segments`)와 대조한 PASS/FAIL이 페이지 상단에 표시된다.
`?edit=1` 로 열면 편집 패널이 열린 상태로 시작한다.
