import apiClient, { unwrapResponse } from '../client';
import { GetReportsParams, ReportListResponse, ReportStatus } from '@/types/admin';

export const reportsApi = {
    getAll: async (params: GetReportsParams = {}): Promise<ReportListResponse> => {
        const { page = 1, limit = 10, status } = params;

        const queryParams: Record<string, string | number> = { page, limit };
        if (status !== undefined) {
            queryParams.status = status;
        }

        const res = await apiClient.get('/api/admin/reports', { params: queryParams });
        const body = unwrapResponse(res) as ReportListResponse | undefined;
        return (
            body ?? {
                total_count: 0,
                counts_by_status: { all: 0, unconfirmed: 0, in_review: 0, completed: 0 },
                reports: [],
            }
        );
    },
    updateStatus: async (reportId: number, status: ReportStatus) => {
        const res = await apiClient.patch(`/api/admin/reports/${reportId}`, { status });
        return unwrapResponse(res);
    },
};
