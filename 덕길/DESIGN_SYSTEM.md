# 덕길이 디자인 시스템

민트와 화이트를 중심으로 행사 당일의 긴장감을 낮추고, 중요한 다음 행동은 빠르게 읽히도록 설계한다.

## Color

| Token | Value | Usage |
| --- | --- | --- |
| Mint 50 | `#F7FCFC` | 페이지 보조 배경, 정보 영역 |
| Mint 100 | `#E9FBF8` | 선택 상태, 연한 배지 |
| Mint 200 | `#C9F7F0` | 민트 계열 테두리 |
| Mint 300 | `#7CEEDF` | 보조 강조, 진행 상태 |
| Mint 400 | `#38D9C7` | 주요 버튼, AI 핵심 카드 |
| Mint 600 | `#149C90` | 아이콘, 링크 |
| Mint 700 | `#0F766E` | 민트 배경 위 보조 텍스트 |
| Mint 900 | `#073B36` | 민트 배경 위 주요 텍스트 |
| White | `#FFFFFF` | 기본 배경, 카드 |
| Slate 50 | `#F8FAFC` | 중립 보조 배경 |
| Slate 200 | `#E2E8F0` | 기본 테두리 |
| Slate 500 | `#64748B` | 보조 텍스트 |
| Slate 900 | `#0F172A` | 기본 텍스트 |

밝은 민트 위에는 흰색이 아닌 `Mint 900`을 사용하여 읽기 쉬운 대비를 유지한다.

## Typography

- Display: 27px / 700 / line-height 1.30
- Title: 20px / 700 / line-height 1.35
- Section: 18px / 700 / line-height 1.40
- Body: 12px / 500 / line-height 1.60
- Caption: 9px / 600 / line-height 1.45
- Label: 8px / 800 / letter-spacing 0.08em

한 화면에서 굵기는 최대 세 단계만 사용하며, 핵심 행동 문구를 가장 굵게 표시한다.

## Spacing

4px 단위를 사용한다: `4, 8, 12, 16, 20, 24, 32, 40`.

- 화면 좌우 여백: 20px
- 섹션 사이: 28-32px
- 카드 내부: 16-24px
- 아이콘과 텍스트: 8-12px

## Radius

- Small: 8px — 배지, 작은 버튼
- Medium: 12px — 입력창, 보조 버튼
- Large: 16px — 기본 카드
- Extra large: 22px — AI 핵심 카드
- Pill: 999px — 상태 태그, 필터

## Elevation

- Small: `0 2px 8px rgba(15, 23, 42, 0.05)`
- Medium: `0 8px 24px rgba(15, 23, 42, 0.07)`
- Mint action: `0 10px 26px rgba(31, 194, 177, 0.18)`

그림자는 핵심 행동과 떠 있는 내비게이션에만 사용한다. 정보 카드는 테두리를 우선한다.

## Components

- Primary button: Mint 400 배경 + Mint 900 텍스트, 높이 50px
- Secondary button: White 배경 + Mint 200 테두리 + Mint 700 텍스트
- AI action card: Mint 400 배경 + Mint 900 텍스트, radius 22px
- Information card: White 배경 + Slate 200 테두리, radius 16px
- Selected card: Mint 50 배경 + Mint 400 테두리
- Status badge: Mint 100 배경 + Mint 700 텍스트
- Input focus: Mint 400 테두리 + 25% 민트 포커스 링

## Principles

1. 한 화면의 강한 민트 면적은 하나의 핵심 행동에 집중한다.
2. 정보 카드는 화이트를 유지하고 민트는 상태와 행동에만 사용한다.
3. 실시간 추천은 `AI NEXT ACTION` 레이블과 함께 표시한다.
4. 성공, 경고, 오류 상태는 민트로 대체하지 않고 각 의미 색상을 유지한다.
5. 본문과 중요한 시간 정보는 항상 높은 대비로 표시한다.
