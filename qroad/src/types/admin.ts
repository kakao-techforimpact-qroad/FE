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
    publishedDate: string; // YYYY-MM-DD
    tempKey: string;
}

export interface CreatePublicationResponse {
    jobId: string;
}

export interface PublicationUploadUrlRequest {
    fileName: string;
    contentType: string;
    fileSize: number;
}

export interface PublicationUploadUrlResponse {
    uploadUrl: string;
    tempKey: string;
}

export type PublicationJobStatus = 'PROCESSING' | 'DONE' | 'FAILED';

export interface PublicationProgressResponse {
    status: PublicationJobStatus;
    progress: number;
    message: string;
    // 완료 응답에서만 내려올 수 있어 optional로 둔다.
    paperId?: number;
    paper_id?: number;
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
    imagePath?: string;
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
    imagePath?: string;
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

// Report (이슈 제보) 관련
export type ReportStatus = 'unconfirmed' | 'in_review' | 'completed';

export interface ReportRelatedChunk {
    chunk_id: number;
    title: string;
    link: string;
}

export interface Report {
    report_id: number;
    title: string;
    content: string;
    reporter_name: string;
    reporter_region: string;
    status: ReportStatus;
    created_at: string;
    related_chunks: ReportRelatedChunk[];
}

export interface ReportCountsByStatus {
    all: number;
    unconfirmed: number;
    in_review: number;
    completed: number;
}

export interface ReportListResponse {
    total_count: number;
    counts_by_status: ReportCountsByStatus;
    reports: Report[];
}

export interface GetReportsParams {
    page?: number;
    limit?: number;
    status?: ReportStatus;
}

export interface CreateReportRequest {
    title: string;
    content: string;
    reporterContact: string;
}

export interface CreateReportResponse {
    id: number;
    title: string;
    content: string;
    reporterContact: string;
    status: string;
    createdAt: string;
}

export type EmotionType = 'LIKE' | 'HEARTWARMING' | 'SAD' | 'ANGRY' | 'WANT_FOLLOW_UP';

export interface CreateEmotionRequest {
    emotionType: EmotionType;
}

export interface CreateEmotionResponse {
    articleId: number;
    emotionType: EmotionType;
    isActive: boolean;
    totalCount: number;
}
