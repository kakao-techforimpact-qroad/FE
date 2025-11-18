export interface Article {
  id: number
  qrId: string
  title: string
  category: string
  url: string
  content?: string
  summary?: string
  author?: string
  status: '발행' | '비공개'
  createdAt: string
}

export const mockArticles: Article[] = [
  {
    id: 1,
    qrId: 'qr123',
    title: '첫 번째 기사 제목',
    category: '경제',
    url: 'https://example.com/article1',
    content: '기사 내용입니다...',
    summary: '경제 전반에 영향을 미칠 새로운 규제와 기회에 대해 요약합니다.',
    author: '김재현',
    status: '발행',
    createdAt: '2025-01-15',
  },
  {
    id: 2,
    qrId: 'qr123',
    title: '두 번째 기사 제목',
    category: '정치',
    url: 'https://example.com/article2',
    content: '기사 내용입니다...',
    summary: '국내 정치 지형 변화를 짚어보는 분석 기사입니다.',
    author: '이서연',
    status: '발행',
    createdAt: '2025-01-15',
  },
  {
    id: 3,
    qrId: 'qr123',
    title: '세 번째 기사 제목',
    category: '사회',
    url: 'https://example.com/article3',
    content: '기사 내용입니다...',
    summary: '사회 전반을 바꾸는 최신 트렌드를 소개합니다.',
    author: '박도윤',
    status: '발행',
    createdAt: '2025-01-14',
  },
]

export interface QRCode {
  id: string
  url: string
  createdAt: string
}

export const mockQRData: QRCode = {
  id: 'qr123',
  url: 'https://qroad.app/a/qr123',
  createdAt: '2025-01-10',
}
