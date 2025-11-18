export interface Article {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  summary: string;
  relatedArticles: { title: string; description: string; url: string }[];
  relatedPolicies: { title: string; description: string; url: string }[];
  url: string;
}

export const articles: Article[] = [
  {
    id: 1,
    title: "옥천군, 한국 관광 데이터랩 우수 활용 사례 대상 수상",
    description:
      "옥천군이 디지털 관광주민증 사업 전략을 한국관광공사 데이터랩으로 분석해 지역관광 활성화 모델을 구축함.",
    author: "스포츠동아",
    date: "2023-11-30",
    summary:
      "옥천군은 한국관광공사가 운영하는 관광 데이터랩을 활용해 관광객 이동, 소비 패턴 등을 분석하고 디지털 관광주민증 사업을 활성화하는 전략을 마련했다. 이를 통해 10월 말 기준 관광주민증 발급자 수가 5만 명을 돌파하며 지역 관계 인구 창출에 성과를 냈다. 이 공모전 수상을 기반으로 옥천군은 앞으로 광역관광 코스 개발 및 관광 마케팅 사업을 지속 발굴할 계획이다.",
    url: "https://sports.donga.com/region/article/all/20231130/122416530/2",
    relatedArticles: [
      {
        title: "옥천군 골목형상점가, 온누리상품권 사용 가능",
        description:
          "옥천 먹자골목이 온누리상품권 사용처로 지정되며 지역 상권 활성화 기대.",
        url: "https://news.zum.com/articles/98801471",
      },
      {
        title: "옥천군, 새 정부 국정과제 '퀀텀 점프' 노린다",
        description:
          "옥천군이 AI·디지털 전환 등 미래 성장 전략을 국정과제에 반영하기 위해 TF를 구성.",
        url: "https://m.news.zum.com/articles/99203328",
      },
    ],
    relatedPolicies: [
      {
        title: "옥천군 스마트도시계획 (2025)",
        description:
          "충북 옥천군이 스마트도시 기본계획을 세워 광역철도 연장 등 인프라 확충 추진.",
        url: "https://smartcity.go.kr/wp-content/uploads/2025/09/%EC%98%A5%EC%B2%9C%EA%B5%B0-%EC%8A%A4%EB%A7%88%ED%8A%B8%EB%8F%84%EC%8B%9C%EA%B3%84%ED%9A%8D_25.9.pdf",
      },
    ],
  },
  {
    id: 2,
    title: "옥천군, 새 정부 국정과제 대응 TF 구성",
    description:
      "옥천군이 디지털 전환, 인구·복지, 신성장 전략 등 핵심 현안을 국정과제로 반영하기 위한 TF 구성.",
    author: "중부매일 / 뉴스로",
    date: "2025-06-27",
    summary:
      "옥천군은 부군수를 단장으로 한 ‘국정과제 대응 TF’를 구성해 AI와 디지털 전환, 지역 기반시설 확충, 공공의료 등 5대 전략 과제를 중심으로 새 정부 정책에 선제적으로 대응하고 있다. 이를 통해 지역 발전 로드맵을 중앙정부 국정 과제와 연계하며 예산 확보 및 지속가능한 성장 기반을 마련하려는 전략이다.",
    url: "https://m.news.zum.com/articles/99222298",
    relatedArticles: [
      {
        title: "옥천군, 지역 현안 새 정부 국정과제에 반영 나서",
        description:
          "옥천군이 지역 핵심현안을 새 정부 국정 과제로 반영하기 위해 중앙부처와의 협력 강화.",
        url: "https://m.news.zum.com/articles/99206058",
      },
      {
        title: "옥천군, 한국 관광 데이터랩 우수 활용 사례 대상 수상",
        description:
          "관광 데이터 분석을 통해 디지털 관광주민증 사업 전략을 세워 관광 활성화에 성공.",
        url: "https://sports.donga.com/region/article/all/20231130/122416530/2",
      },
    ],
    relatedPolicies: [
      {
        title: "국정과제 대응 TF 운영 계획",
        description:
          "옥천군이 새 정부 과제 전략에 맞추어 TF를 구성해 지역 전략사업을 국정과제로 제안.",
        url: "https://m.news.zum.com/articles/99222298",
      },
    ],
  },
  {
    id: 3,
    title: "옥천성모병원에 최첨단 MRI 의료장비 지원",
    description:
      "옥천군이 지방소멸대응기금으로 MRI 장비를 지원해 지역 의료 인프라를 강화.",
    author: "중부매일",
    date: "2025-06-11",
    summary:
      "옥천군은 인구 감소와 고령화 위기에 대응하기 위해, 지방소멸 대응기금을 활용해 옥천성모병원에 최첨단 MRI 장비를 도입했다. 이를 통해 지역 주민의 의료 접근성을 향상시키고 응급의료 체계를 강화하려는 목표를 세우고 있다.",
    url: "https://news.zum.com/articles/98842622",
    relatedArticles: [
      {
        title: "옥천군, 새 정부 국정과제 대응 TF 구성",
        description:
          "디지털 전환, 공공의료, 인프라 확대 등 핵심 과제를 국정 과제에 반영하기 위해 TF 운영.",
        url: "https://m.news.zum.com/articles/99222298",
      },
    ],
    relatedPolicies: [
      {
        title: "지방소멸대응기금 활용 정책",
        description:
          "국가 정책으로 인구감소 지역의 의료 및 사회 인프라 강화를 위한 재정 지원.",
        url: "https://news.zum.com/articles/98842622",
      },
    ],
  },
  {
    id: 4,
    title: "옥천군 골목형상점가, 온누리상품권 사용처 지정",
    description:
      "옥천 먹자골목이 온누리상품권 사용 가능 상점가로 지정되며 지역경제 활성화 기대.",
    author: "연합뉴스",
    date: "2025-06-10",
    summary:
      "옥천군은 먹자골목 상권을 ‘골목형 상점가’로 지정하고, 온누리상품권 사용처로 등록해 전통 상권 활성화 전략을 실행하고 있다. 이를 통해 지역 주민과 관광객의 소비 유입을 늘리고 지역 소상공인에 대한 지원을 강화할 계획이다.",
    url: "https://news.zum.com/articles/98801471",
    relatedArticles: [
      {
        title: "옥천군, 한국 관광 데이터랩 우수 활용 사례 대상 수상",
        description:
          "관광 데이터랩을 활용한 디지털 관광주민증 전략이 지역 관광 활성화에 기여.",
        url: "https://sports.donga.com/region/article/all/20231130/122416530/2",
      },
    ],
    relatedPolicies: [
      {
        title: "전통시장 및 소상공인 지원 정책",
        description:
          "골목형상점가 지정 및 온누리상품권 정책을 통한 지역경제 활성화.",
        url: "https://news.zum.com/articles/98801471",
      },
    ],
  },
];
