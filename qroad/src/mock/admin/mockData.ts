// Mock data for admin panel

export interface Article {
    id: number;
    issue_id: number;
    title: string;
    summary: string;
    keywords: string[];
    order: number;
    author: string;
}

export interface Issue {
    id: number;
    issue_num: string;
    issue_date: string;
    raw_text: string;
    original_snippet: string;
    url: string;
    status: 'created' | 'pre-publish' | 'published';
    qr_status: boolean;
    qr_url?: string;
    qr_image?: string;
    articles?: Article[];
    publisher?: string;
}

// Mock Issues
export let mockIssues: Issue[] = [
    {
        id: 1,
        issue_num: '2024-03-15',
        issue_date: '2024-03-15',
        raw_text: 'Sample raw text for quantum computing article...',
        original_snippet: 'Quantum computing represents a paradigm shift in computational technology...',
        url: 'https://qroad.app/issue/1',
        status: 'published',
        qr_status: true,
        qr_url: 'https://qroad.app/issue/1',
        qr_image: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://qroad.app/issue/1',
        publisher: 'QRoad 편집팀',
    },
    {
        id: 2,
        issue_num: '2024-03-12',
        issue_date: '2024-03-12',
        raw_text: 'Sample raw text for sustainable cities article...',
        original_snippet: 'As urbanization accelerates globally, sustainable city planning has become critical...',
        url: 'https://qroad.app/issue/2',
        status: 'pre-publish',
        qr_status: false,
        publisher: 'QRoad 편집팀',
    },
    {
        id: 3,
        issue_num: '2024-03-10',
        issue_date: '2024-03-10',
        raw_text: 'Sample raw text for minimalist design article...',
        original_snippet: 'Minimalist design philosophy emphasizes clarity, simplicity, and intentionality...',
        url: 'https://qroad.app/issue/3',
        status: 'created',
        qr_status: false,
        publisher: 'QRoad 편집팀',
    },
];

// Mock Articles
export let mockArticles: Article[] = [
    {
        id: 1,
        issue_id: 1,
        title: 'The Future of Quantum Computing',
        summary: 'Quantum computing represents a paradigm shift in computational technology, leveraging quantum mechanical phenomena to solve complex problems.',
        keywords: ['quantum computing', 'technology', 'innovation'],
        order: 1,
        author: 'Sarah Chen',
    },
    {
        id: 2,
        issue_id: 1,
        title: 'Machine Learning Ethics',
        summary: 'The integration of machine learning in healthcare raises profound ethical questions about bias and accountability.',
        keywords: ['AI', 'ethics', 'healthcare'],
        order: 2,
        author: 'Dr. James Park',
    },
    {
        id: 3,
        issue_id: 2,
        title: 'Building Sustainable Cities',
        summary: 'Sustainable city planning integrates green infrastructure and renewable energy systems.',
        keywords: ['sustainability', 'urban planning', 'environment'],
        order: 1,
        author: 'Marcus Rodriguez',
    },
    {
        id: 4,
        issue_id: 2,
        title: 'Climate Tech Startups',
        summary: 'A new generation of climate technology startups is tackling global warming with innovative approaches.',
        keywords: ['climate', 'startups', 'innovation'],
        order: 2,
        author: 'Michael Zhang',
    },
    {
        id: 5,
        issue_id: 3,
        title: 'Minimalist Design Principles',
        summary: 'Minimalist design philosophy emphasizes clarity, simplicity, and intentionality in digital product creation.',
        keywords: ['design', 'UX', 'minimalism'],
        order: 1,
        author: 'Emma Thompson',
    },
];

// Helper functions for mock data manipulation
export const getIssues = () => mockIssues;
export const getIssue = (id: number) => mockIssues.find(issue => issue.id === id);
export const createIssue = (issue: Omit<Issue, 'id'>) => {
    const newIssue = { ...issue, id: mockIssues.length + 1 };
    mockIssues.push(newIssue);
    return newIssue;
};
export const updateIssue = (id: number, data: Partial<Issue>) => {
    const index = mockIssues.findIndex(issue => issue.id === id);
    if (index !== -1) {
        mockIssues[index] = { ...mockIssues[index], ...data };
        return mockIssues[index];
    }
    return null;
};

export const getArticlesByIssue = (issueId: number) =>
    mockArticles.filter(article => article.issue_id === issueId);

export const getArticle = (id: number) =>
    mockArticles.find(article => article.id === id);

export const updateArticle = (id: number, data: Partial<Article>) => {
    const index = mockArticles.findIndex(article => article.id === id);
    if (index !== -1) {
        mockArticles[index] = { ...mockArticles[index], ...data };
        return mockArticles[index];
    }
    return null;
};
