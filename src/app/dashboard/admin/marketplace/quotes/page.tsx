// @ts-nocheck
// app/admin/quotes/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useGetAllAdminQuotesQuery, useGetQuoteStatisticsQuery } from '@/features/api/adminQuoteApi';
import { Download, RefreshCw } from 'lucide-react';
import Pagination from '@/components/dashboard/admin/Pagination';
import QuotesTable from '@/components/dashboard/admin/QuotesTable';
import BulkActions from '@/components/dashboard/admin/BulkActions';
import QuotesFilters from '@/components/dashboard/admin/QuotesFilters';
import StatsCards from '@/components/dashboard/admin/StatsCards'; // Updated import

export default function QuotesPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        paymentStatus: '',
        startDate: '',
        endDate: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);

    // Fetch quotes
    const { data, isLoading: quotesLoading, isFetching, refetch } = useGetAllAdminQuotesQuery({
        page,
        limit,
        ...filters,
    });

    // Fetch statistics
    const { data: statsData, isLoading: statsLoading } = useGetQuoteStatisticsQuery({
        startDate: filters.startDate,
        endDate: filters.endDate,
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked && data?.quotes) {
            setSelectedQuotes(data.quotes.map(q => q._id));
        } else {
            setSelectedQuotes([]);
        }
    };

    const handleSelectQuote = (quoteId: string, checked: boolean) => {
        if (checked) {
            setSelectedQuotes(prev => [...prev, quoteId]);
        } else {
            setSelectedQuotes(prev => prev.filter(id => id !== quoteId));
        }
    };

    const handleBulkActionComplete = () => {
        setSelectedQuotes([]);
        refetch();
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quotes Management</h1>
                    <p className="text-gray-500 mt-1">
                        View and manage all quote requests
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => refetch()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards
                statistics={statsData?.statistics}
                isLoading={statsLoading}
            />

            {/* Filters */}
            <QuotesFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={() => {
                    setFilters({
                        status: '',
                        search: '',
                        paymentStatus: '',
                        startDate: '',
                        endDate: '',
                        sortBy: 'createdAt',
                        sortOrder: 'desc',
                    });
                    setPage(1);
                }}
            />

            {/* Bulk Actions */}
            {selectedQuotes.length > 0 && (
                <BulkActions
                    selectedIds={selectedQuotes}
                    onComplete={handleBulkActionComplete}
                    onClear={() => setSelectedQuotes([])}
                />
            )}

            {/* Results Info */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing {data?.quotes?.length || 0} of {data?.pagination?.totalCount || 0} quotes
                </p>
                <select
                    value={limit}
                    onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                </select>
            </div>

            {/* Table */}
            <QuotesTable
                quotes={data?.quotes || []}
                isLoading={quotesLoading}
                selectedQuotes={selectedQuotes}
                onSelectAll={handleSelectAll}
                onSelectQuote={handleSelectQuote}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSort={(field) => {
                    if (filters.sortBy === field) {
                        handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                        setFilters(prev => ({ ...prev, sortBy: field, sortOrder: 'desc' }));
                    }
                }}
            />

            {/* Pagination */}
            {data?.pagination && (
                <Pagination
                    currentPage={data.pagination.currentPage}
                    totalPages={data.pagination.totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
}