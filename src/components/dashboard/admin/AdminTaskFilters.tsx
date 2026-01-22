// components/admin/AdminTaskFilters.tsx
import React, { useState } from 'react';
import { FiSearch, FiFilter, FiX, FiCalendar } from 'react-icons/fi';

interface Filters {
    page: number;
    limit: number;
    status: string;
    schedule: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    startDate: string;
    endDate: string;
    minPrice?: number;
    maxPrice?: number;
}

interface Props {
    filters: Filters;
    onFilterChange: (filters: Partial<Filters>) => void;
}

const AdminTaskFilters: React.FC<Props> = ({ filters, onFilterChange }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ search: searchInput });
    };

    const handleClearFilters = () => {
        setSearchInput('');
        onFilterChange({
            status: '',
            schedule: '',
            search: '',
            startDate: '',
            endDate: '',
            minPrice: undefined,
            maxPrice: undefined,
        });
    };

    const hasActiveFilters = filters.status || filters.schedule || filters.search ||
        filters.startDate || filters.endDate || filters.minPrice || filters.maxPrice;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
            {/* Main Filter Row */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="flex-1">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks by title, description, or location..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </form>

                {/* Status Filter */}
                <select
                    value={filters.status}
                    onChange={(e) => onFilterChange({ status: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="requested">Requested</option>
                    <option value="not completed">Not Completed</option>
                    <option value="declined">Declined</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                {/* Schedule Filter */}
                <select
                    value={filters.schedule}
                    onChange={(e) => onFilterChange({ schedule: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Schedules</option>
                    <option value="Flexible">Flexible</option>
                    <option value="Schedule">Schedule</option>
                    <option value="Urgent">Urgent</option>
                </select>

                {/* Per Page */}
                <select
                    value={filters.limit}
                    onChange={(e) => onFilterChange({ limit: parseInt(e.target.value) })}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                </select>

                {/* Advanced Toggle */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors ${showAdvanced
                            ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    <FiFilter size={16} />
                    Advanced
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                    >
                        <FiX size={16} />
                        Clear
                    </button>
                )}
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Date
                            </label>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => onFilterChange({ startDate: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Date
                            </label>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => onFilterChange({ endDate: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Min Price
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="$0.00"
                                value={filters.minPrice || ''}
                                onChange={(e) => onFilterChange({ minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Max Price
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="$999.99"
                                value={filters.maxPrice || ''}
                                onChange={(e) => onFilterChange({ maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Pills */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {filters.status && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                            Status: {filters.status}
                            <button onClick={() => onFilterChange({ status: '' })} className="hover:text-blue-600">
                                <FiX size={14} />
                            </button>
                        </span>
                    )}
                    {filters.schedule && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                            Schedule: {filters.schedule}
                            <button onClick={() => onFilterChange({ schedule: '' })} className="hover:text-green-600">
                                <FiX size={14} />
                            </button>
                        </span>
                    )}
                    {filters.search && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm">
                            Search: "{filters.search}"
                            <button onClick={() => { setSearchInput(''); onFilterChange({ search: '' }); }} className="hover:text-purple-600">
                                <FiX size={14} />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminTaskFilters;