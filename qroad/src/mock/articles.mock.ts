export type IssueStatus = 'generated' | 'prepublish' | 'published'

export interface Issue {
  id: number
  issue_num: string
  issue_date: string
  raw_text: string
  original_snippet: string
  status: IssueStatus
  article_count: number
  url: string
  qr_status: boolean
}

export interface Article {
  id: number
  issue_id: number
  title: string
  original_snippet: string
  author: string
  summary: string
  keywords: string[]
  article_url: string
  order: number
}

export const mockIssues: Issue[] = [
  {
    id: 1,
    issue_num: 'Issue 301',
    issue_date: '2025-02-10',
    raw_text:
      '옥천군이 디지털 관광주민증 사업 전략을 본격화하며 지역 관광 산업의 새 전환점을 만들고 있다.\n\n' +
      '군은 한국관광공사 데이터랩을 적극 활용해 관광객 동선과 소비 패턴을 분석했고, 그 결과를 기반으로 QRoad 서비스를 기획했다.\n\n' +
      '또한 지역화폐와 연동된 혜택을 설계해 외지 관광객의 체류 시간을 늘리는 방안을 추진 중이다.',
    original_snippet:
      '옥천군이 디지털 관광주민증 사업 전략을 본격화하며 지역 관광 산업의 전환점을 만들고 있다. 한국관광공사 데이터랩 분석과 지역화폐 연동 혜택으로 체류 시간을 늘리는 방안을 추진 중이다.',
    status: 'published',
    article_count: 3,
    url: 'https://qroad.app/a/issue/301',
    qr_status: true,
  },
  {
    id: 2,
    issue_num: 'Issue 302',
    issue_date: '2025-02-17',
    raw_text:
      '옥천군은 국정과제 대응 TF를 구성해 AI 행정과 지역 기반시설 확충을 동시에 추진한다.\n\n' +
      '특히 디지털 전환으로 행정 효율을 높이고, 공공의료 인프라 확충에 예산을 집중하겠다는 방침이다.\n\n' +
      '해당 TF는 중앙부처와의 공조를 강화해 지속적인 정책 제안을 이어간다.',
    original_snippet:
      '옥천군은 국정과제 대응 TF를 구성해 AI 행정과 기반시설 확충을 추진한다. 디지털 전환과 공공의료 인프라에 집중하며 중앙부처와의 공조를 강화한다.',
    status: 'generated',
    article_count: 2,
    url: '',
    qr_status: false,
  },
]

export const mockArticles: Article[] = [
  {
    id: 1,
    issue_id: 1,
    title: '디지털 관광주민증 도입으로 체류시간 증가 기대',
    original_snippet: '옥천군이 디지털 관광주민증을 도입하며 관광객 체류 시간을 늘리기 위한 인센티브를 설계했다.',
    author: 'AI Editor',
    summary:
      '옥천군은 관광 데이터 분석을 기반으로 QRoad 혜택을 설계했고, 지역화폐 연계 정책을 통해 체류 시간을 늘릴 계획이다.',
    keywords: ['디지털전환', '관광', '지역화폐'],
    article_url: '/a/article/1',
    order: 1,
  },
  {
    id: 2,
    issue_id: 1,
    title: '데이터랩 기반 지역 관광 전략',
    original_snippet: '한국관광공사 데이터랩 자료를 바탕으로 관광객 동선을 분석해 맞춤형 프로그램을 구성했다.',
    author: 'AI Editor',
    summary:
      '데이터랩 분석 결과를 활용해 체험 코스와 상권 추천을 고도화하고, QR 코드 기반 안내를 적용했다.',
    keywords: ['데이터랩', '상권', 'QR'],
    article_url: '/a/article/2',
    order: 2,
  },
  {
    id: 3,
    issue_id: 1,
    title: '지역화폐 혜택으로 외지 관광객 유치',
    original_snippet: '지역화폐 혜택을 QR 서비스에 연결해 외지 관광객 이용률을 높인다.',
    author: 'AI Editor',
    summary: '관광객이 QRoad 앱으로 지역화폐를 즉시 발급받고 혜택을 사용할 수 있도록 UX를 개선했다.',
    keywords: ['지역화폐', '혜택', 'UX'],
    article_url: '/a/article/3',
    order: 3,
  },
  {
    id: 4,
    issue_id: 2,
    title: '국정과제 대응 TF 가동',
    original_snippet: '옥천군은 AI 행정과 공공의료 확충을 목표로 국정과제 대응 TF를 운영한다.',
    author: 'AI Editor',
    summary: 'TF는 중앙부처와의 협업을 통해 인프라 예산을 확보하고, 데이터 기반 행정 시스템을 도입할 계획이다.',
    keywords: ['TF', 'AI행정', '공공의료'],
    article_url: '',
    order: 1,
  },
  {
    id: 5,
    issue_id: 2,
    title: '공공의료 인프라 확충 계획',
    original_snippet: '응급의료 대응 속도를 높이기 위해 의료 장비와 전문 인력을 확충한다.',
    author: 'AI Editor',
    summary: '지방소멸 대응기금을 활용해 MRI 장비를 도입하고, 의료 인력을 순환 배치하는 방안을 추진한다.',
    keywords: ['의료', '지방소멸', '인프라'],
    article_url: '',
    order: 2,
  },
]
