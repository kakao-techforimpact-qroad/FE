// 로그인 관련
export interface LoginRequest {
    loginId: string;
    password: string;
}

// Publication (신문) 관련
export interface ArticleInResponse {
    id: number;
    title: string;
    summary: string;
    keywords: string[];
}

export interface CreatePublicationRequest {
    title: string;
    content: string;
    publishedDate: string; // YYYY-MM-DD
}

export interface CreatePublicationResponse {
    paperId: number;
    articleCount: number;
    articles: ArticleInResponse[];
}

// Publication 상세 조회 응답
export interface PublicationDetailResponse {
    paper_id: number;
    title: string;
    published_date: string;
    body: string;
    article_count: number;
    articles: ArticleInResponse[];
}

// User Landing Page 응답
export interface ArticleSimple {
    id: number;
    title: string;
}

export interface UserLandingPageResponse {
    publishedDate: string;
    articleCount: number;
    articleSimpleDTOS: ArticleSimple[];
}

// Article 상세 조회 응답
export interface RelatedArticle {
    id: number;
    title: string;
    content: string;
    link: string;
}

export interface RelatedPolicy {
    id: number;
    title: string;
    content: string;
    link: string;
}

export interface ArticleDetailResponse {
    articleId: number;
    title: string;
    pressCompany: string;
    reporter: string;
    publishedDate: string;
    summary: string;
    keywords: string[];
    articleRelatedDTOS: RelatedArticle[];
    policyArticleRelatedDTOS: RelatedPolicy[];
}

// Publication 목록 조회 응답
export interface PublicationInList {
    id: number;
    title: string;
    body: string;
    published_date: string;
    admin: string;
}

export interface PublicationListResponse {
    total_count: number;
    papers: PublicationInList[];
}
