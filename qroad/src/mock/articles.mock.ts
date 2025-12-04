export interface Article {
  id: number
  qrId: string
  title: string
  category: string
  url: string
  content?: string
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
