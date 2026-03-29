import apiClient, { unwrapResponse } from '../client';
import { GetReportsParams, Report, ReportListResponse, ReportStatus } from '@/types/admin';

const normalizeStatus = (status: unknown): ReportStatus => {
    if (status === 'unconfirmed' || status === 'in_review' || status === 'completed') {
        return status;
    }

    const normalized = String(status ?? '')
        .trim()
        .toUpperCase();

    if (normalized === 'UNCONFIRMED' || normalized === 'PENDING') return 'unconfirmed';
    if (normalized === 'IN_REVIEW' || normalized === 'REVIEWING') return 'in_review';
    if (normalized === 'COMPLETED' || normalized === 'DONE') return 'completed';

    return 'unconfirmed';
};

const normalizeReport = (item: Record<string, unknown>): Report => ({
    report_id: Number(item.report_id ?? item.id ?? 0),
    title: String(item.title ?? ''),
    content: String(item.content ?? ''),
    reporter_name: String(item.reporter_name ?? item.reporterName ?? item.reporterContact ?? ''),
    reporter_region: String(item.reporter_region ?? item.reporterRegion ?? ''),
    status: normalizeStatus(item.status),
    created_at: String(item.created_at ?? item.createdAt ?? ''),
    related_chunks: Array.isArray(item.related_chunks)
        ? (item.related_chunks as Report['related_chunks'])
        : [],
});

export const reportsApi = {
    getAll: async (params: GetReportsParams = {}): Promise<ReportListResponse> => {
        const { page = 1, limit = 10, status } = params;

        const queryParams: Record<string, string | number> = { page, limit };
        if (status !== undefined) {
            queryParams.status = status;
        }

        const res = await apiClient.get('/api/admin/reports', { params: queryParams });
        const body = unwrapResponse(res) as Record<string, unknown> | undefined;

        const rawReports = Array.isArray(body?.reports) ? (body?.reports as Record<string, unknown>[]) : [];
        const reports = rawReports.map(normalizeReport);

        const totalCount = Number(body?.total_count ?? body?.totalCount ?? reports.length ?? 0);

        return {
            total_count: totalCount,
            counts_by_status: {
                all: totalCount,
                unconfirmed: reports.filter((r) => r.status === 'unconfirmed').length,
                in_review: reports.filter((r) => r.status === 'in_review').length,
                completed: reports.filter((r) => r.status === 'completed').length,
            },
            reports,
        };
    },

    updateStatus: async (reportId: number, status: ReportStatus) => {
        const res = await apiClient.patch(`/api/admin/reports/${reportId}`, { status });
        return unwrapResponse(res);
    },
};
