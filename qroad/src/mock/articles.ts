export interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  summary: string;
  relatedArticles: { title: string; description: string; url: string }[];
  relatedPolicies: { title: string; description: string; url: string }[];
  url: string;
  keywords?: string[];
}

export const articles: Article[] = [
  {
    id: 1,
    title: "황규철 군수, 대통령 국정설명회서 직접 '옥천지역화폐 성과' 홍보",
    author: "옥천신문",
    date: "2025-11-24",
    summary:
      "황규철 옥천군수는 청와대 영빈관에서 열린 시장·군수·구청장 국정설명회에서 옥천지역화폐 ‘향수OK카드’의 운영 성과를 대통령에게 직접 홍보했다. 옥천군은 군비만으로 지역화폐를 안정적으로 운영하고 있으며 이용자의 약 15%가 대전·청주 등 외지 주민이라는 점을 강조했다. 황 군수는 행안부 장관에게 매출 30억 이상 점포의 지역화폐 사용 제한 정책이 농촌 현실에 맞지 않다고 조정 요청도 전달했다. 이번 설명회는 161개 기초지자체장이 참석해 자치분권 및 균형발전 정책을 논의하는 자리였으며, 황 군수는 주민 중심 행정의 중요성을 다시 확인하는 계기였다고 밝혔다.",
    url: "http://www.okinews.com/news/articleView.html?idxno=227970",
    relatedArticles: [
      {
        title: "지역경제 선순환 이끄는 옥천사랑상품권",
        description:
          "지역 경제 선순환 구조 핵심 역할 및 소비 증대 효과 확인, 다만 지역 내부 산업 활성화 연계 방안 모색 과제 부각.",
        url: "http://www.okinews.com/news/articleView.html?idxno=227628",
      },
      {
        title: "10∼20% 캐시백 적용되는 옥천군 '향수OK카드' 인기몰이",
        description:
          "옥천군 지역화폐 '향수OK카드'**의 캐시백(10%~20%) 혜택 인기로 발행액 13.6% 증가 및 외지인 유입 등 활성화.",
        url: "https://www.yna.co.kr/view/AKR20250530059800064",
      },
    ],
    relatedPolicies: [
      {
        title: "지역사랑상품권 발행 지자체에 보통교부세 지원…'골목경제 활력'",
        description:
          "행안부, 2027년부터 지역사랑상품권 발행 비용 보통교부세 산정 반영 및 비수도권·인구감소지역 지원 확대 통한 지역 경제 활성화 도모.",
        url: "https://www.korea.kr/news/policyNewsView.do?newsId=148953567"
      },
      {
        title: "이달부터 지역사랑상품권 최대 15% 할인…특별재난지역은 20%",
        description:
          "행안부, 지역 경제 활성화 및 소비 진작 목적 연말까지 지역사랑상품권 최대 20% 할인율 인상 및 10조 원 규모 집중 발행 추진.",
        url: "https://www.korea.kr/news/policyNewsView.do?newsId=148948486"
      }
    ],
  },
  {
    id: 2,
    title: "[기획-공동체 무너뜨리는 주거 불안정⑤] 노인·장애인에 절실한 주거환경개선사업, 행정·민간 따로 가면 효과는 ‘반감’",
    author: "옥천신문",
    date: "2025-11-14",
    summary:
      "옥천군·복지관·민간단체 등이 한정된 예산으로 각자 주거환경개선사업을 진행, 노후 주택의 고비용 문제 해결을 위한 자원 통합 부재로 양질의 개선이 어렵다는 평가가 나왔다. 특히 정신·지체장애인 배봉관 씨의 경우, 장애인복지관 주도 아래 청담로타리 등 여러 기관 연계를 통해 1,500만 원 상당의 화장실·보일러 설치 등 성공적인 주거 개선을 이룬 사례는 협력의 중요성을 입증한다. 그러나 현재 정부 사업은 재산·소득 기준으로 대상자를 선별하고 산발적 지원이 이루어져 복지 사각지대 발생 우려가 있으며, 민간의 탄력적 운영 장점에도 불구하고 정보력과 재정 문제로 관내 수요 파악에 한계가 있다. 이에 전문가들은 사업을 체계화하고 자원 분산을 막을 컨트롤타워, 즉 주거복지센터의 필요성을 강조했으며, 이미 이웃 보은군이 센터 설치를 검토 중인 것으로 확인되며 옥천군도 전달체계 구축 방안을 검토하겠다는 입장이다.",
    url: "http://www.okinews.com/news/articleView.html?idxno=227973",
    relatedArticles: [
      {
        title: "옥천군·복지관·민간단체 주거환경개선사업 효율성 지적",
        description:
          "주거환경개선사업에서 행정과 민간이 별도로 움직여 비효율 발생 지적",
        url: "http://m.ccpost.kr/news/articleView.html?idxno=20848",
      },
      {
        title: "성동구, 노인 주거환경개선에 7.5억 투입",
        description:
          "노인 주거낙상 방지 위해 주택개조 및 안전용품 지원 사업 전개",
        url: "https://www.yna.co.kr/view/AKR20240416054600004",
      },
    ],
    relatedPolicies: [
      {
        title: "국토부-환경부, 취약계층 주거환경개선 힘 모은다",
        description:
          "노후주택 수선유지사업과 환경복지서비스 연계 시범사업 추진",
        url: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=148874123",
      },
      {
        title: "지역사회 통합 돌봄(커뮤니티 케어)",
        description:
          "어르신 등이 살던 곳에서 통합돌봄 받을 수 있도록 주거·의료·돌봄 서비스 연계 기반 마련",
        url: "https://www.korea.kr/special/policyCurationView.do?newsId=148866645",
      },
    ],
  },
  {
    id: 3,
    title: "[충북도의회 행정사무감사] 개발제한 구역 부분 해제, “충북도 적극 행정 안보여”",
    author: "옥천신문",
    date: "2025-11-14",
    summary:
      "충북도의회 **박용규 도의원(옥천2)**은 행정사무감사에서 지방소멸 위험지역인 옥천 군북군서면 일대(면적 83% 상수원 보호구역 포함)가 52년간 개발제한구역(GB)으로 묶여 주민들의 재산권 피해 및 사소한 개발행위도 제한되는 상황임에도, 충북도가 GB 부분 해제에 대한 주민 의견 수렴이나 계획 수립을 제대로 하지 않는 등 미진한 행정력을 보인다고 강하게 지적했다. 이에 충북도 균형발전과장은 현재 단절토지 필지 조사와 환경영향평가 등 절차가 진행 중임을 밝히며, 내년도 상반기에는 반드시 GB 부분 해제를 추진하겠다고 약속했다.",
    url: "http://www.okinews.com/news/articleView.html?idxno=227949",
    relatedArticles: [
      {
        title: "충북도의회 “그린벨트 해제해야”…“기후위기 역행”",
        description:
          "충북도의회 그린벨트 해제 공식 입장 표명. 주민 재산권 보호 목적이나, 환경 문제 및 낮은 실현 가능성 비판 존재.",
        url: "https://news.kbs.co.kr/news/pc/view/view.do?ncd=7995767",
      },
      {
        title: "충북도의회 그린벨트 해제 촉구에, 시민단체 '한심한 결정'",
        description:
          "충북도의회 그린벨트 전면 해제 건의안 심의 직전, 충북 시민단체 난개발 우려 및 부결 촉구. 주민 지원 확대 등 실질적 대책 필요 주장.",
        url: "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003039196",
      },
    ],
    relatedPolicies: [
      {
        title: "환경평가 1~2등급지도 지역전략사업 추진 땐 그린벨트 해제",
        description:
          "지역전략사업 선정 시 개발제한구역 해제총량 적용 제외 지침 개정",
        url: "https://www.korea.kr/news/policyNewsView.do?newsId=148928219",
      },
    ],
  },
  {
    id: 4,
    title: "[제328회 임시회-성장정책과] 청년주택 100호 담아낼 지역활력타운 계획 추진",
    author: "옥천신문",
    date: "2025-11-14",
    summary:
      "옥천군의회 제328회 임시회 군정업무보고에 따르면, 옥천군은 청년 주거 공간 확보를 위해 후년(2027년) 국토부 등 8개 부처 협력 지역활력타운 공모 사업에 도전할 계획이며, 이 사업은 총 사업비 350억 원 규모로 최대 100호의 청년주택 및 주거·복지·문화 인프라 복합단지 조성을 목표로 한다. 박정옥 군의원은 용역비 추가 반영과 함께 인구가 읍에 치중된 점을 지적, 지역 균형을 고려한 추진를 주문했다. 또한 군은 청년들이 직접 지역 문제와 정책 사업을 발굴하여 2027년 본 예산에 반영하는 **청년참여형 주민참여예산제(예산 5천만 원)**를 신규 추진하며, 이병우 군의원의 예산 한계에 대한 우려에도 불구하고 군은 제안 사업들을 지역활력타운 조성 계획에 반영할 방침이다.",
    url: "http://www.okinews.com/news/articleView.html?idxno=227959",
    relatedArticles: [
      {
        title: "옥천군, 80억 들여 안남면에 ‘주거플랫폼’ 사업 내년 준공",
        description:
          "안남면 연주리에 커뮤니티센터·체육관 등 복합 정주인프라 구축",
        url: "https://joongdo.co.kr/web/view.php?key=20251118010006495",
      },
      {
        title: "‘주거 걱정 덜어드립니다’ 옥천군, 청년 주거비 지원 추가 모집",
        description:
          "청년 주거비 지원사업 추가 모집 통해 주거비 부담 경감 추진",
        url: "https://www.inews365.com/news/article.html?no=887034",
      },
    ],
    relatedPolicies: [
      {
        title: "2025 지역활력타운 10선",
        description:
          "청년·신혼부부·은퇴자 맞춤형 주거·돌봄 복합정주단지 선정",
        url: "https://www.korea.kr/news/policyNewsView.do?newsId=148943660",
      },
    ],
  }, {
    id: 5,
    title: "충북만 빠진 농어촌 기본소득 시범지역 … “옥천군 추가선정 촉구” 한 목소리",
    author: "옥천신문",
    date: "2025-10-24",
    summary:
      "옥천군이 주민 1인당 월 15만 원을 지역화폐로 지원하는 농어촌기본소득 시범사업 공모에서 1차 심사 유일 통과에도 불구하고 최종 탈락하며, 약 1,800억 원의 예산 투입 기대감에 찬 주민들의 아쉬움이 크다. 이에 황규철 군수는 옥천군이 높은 지역화폐 활용도와 사회적 경제 조직과의 촘촘한 연계 등으로 **'최적지'**임을 강조하며, 박덕흠 의원 등 충북 여야 국회의원 및 인근 군 관계자들과 함께 국회에서 8개 도 중 충북만 제외된 결과의 형평성 문제를 지적하며 추가 선정을 강력히 촉구했다. 국회의원들은 1차 통과 12개 지역 전면 확대 및 국비 지원 비율 상향 필요성을 주장했고, 전문가들은 기존 개발 위주 정책의 한계를 벗어난 농어촌기본소득이 균형발전의 핵심 정책임을 강조하며, 옥천군 차원의 자체 기본소득 정책 시행 검토와 공론화 필요성 또한 제기되었다.",
    url: "http://www.okinews.com/news/articleView.html?idxno=227818",
    relatedArticles: [
      {
        title: "농어촌 기본소득사업 추가 선정?…국회 농림위 증액 예산 의결",
        description:
          "국회 농해수위 농어촌 기본소득 사업비 두 배 증액 의결, 옥천군 추가 지정 여부 국회 예결위 최종 결정 촉각.",
        url: "https://www.news1.kr/local/sejong-chungbuk/5976972",
      },
      {
        title: "옥천군민들 15만원씩 농어촌 기본소득 받나",
        description:
          "국회 상임위 통과로 농어촌 기본소득 예산 2배 확대 및 옥천군 추가 선정 기대감 상승",
        url: "https://v.daum.net/v/20251114151345007?f=p",
      },
    ],
    relatedPolicies: [
      {
        title: "농어촌 기본소득 시범사업 대상지역 선정 결과 발표",
        description:
          "인구감소·고령화 지역에 월 15만 원 상당 지역사랑상품권 지급 시범사업 시작",
        url: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156722096",
      },
      {
        title: "농어촌 기본소득 시범사업 대상지는 사업 조건에 동의한 지방정부를 공모로 선정",
        description:
          "농어촌 기본소득 시범사업, 지방비 부담 (60%) 따른 재정 취약 지자체 부담 증가 비판. 농식품부 자발적 참여 및 국비 마중물 역할 강조. 재정 안정화 여건 조성 노력 약속.",
        url: "https://www.korea.kr/briefing/actuallyView.do?newsId=148954835",
      },
    ],
  }
];
