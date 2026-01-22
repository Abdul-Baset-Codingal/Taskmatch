// components/admin/users/UsersFilters.tsx
"use client";

import React, { useState, useCallback } from "react";
import { Search, X, ChevronDown, ChevronUp, Filter } from "lucide-react";
import debounce from "lodash/debounce";
import { FilterState } from "@/app/dashboard/admin/users/allUsers/page";

interface FiltersProps {
    filters: FilterState;
    onFilterChange: (key: keyof FilterState, value: any) => void;
    onSearch: (term: string) => void;
    onReset: () => void;
    roleType: string;
}

const PROVINCES = [
    { value: '', label: 'All Provinces' },
    { value: 'ON', label: 'Ontario' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'AB', label: 'Alberta' },
    { value: 'QC', label: 'Quebec' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'PE', label: 'Prince Edward Island' },
];

const STATUS_OPTIONS = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'banned', label: 'Banned' },
];

const TASKER_STATUS_OPTIONS = [
    { value: '', label: 'All Tasker Statuses' },
    { value: 'not_applied', label: 'Not Applied' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
];

const CATEGORIES = [
    { value: '', label: 'All Categories' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'moving', label: 'Moving' },
    { value: 'handyman', label: 'Handyman' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'assembly', label: 'Assembly' },
    { value: 'painting', label: 'Painting' },
    { value: 'gardening', label: 'Gardening' },
];

export default function AllUsersFilter({
    filters,
    onFilterChange,
    onSearch,
    onReset,
    roleType,
}: FiltersProps) {
    const [searchInput, setSearchInput] = useState(filters.search);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            onSearch(value);
        }, 300),
        [onSearch]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSearch(value);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        onSearch('');
    };

    // Count active filters
    const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
        if (['page', 'limit', 'sortBy', 'sortOrder', 'roleType'].includes(key)) return false;
        return value !== '' && value !== undefined;
    }).length;

    return (
        <div className="mt-6 bg-white rounded-lg shadow p-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        placeholder="Search by name, email, phone, or city..."
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {searchInput && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2">
                    <select
                        value={filters.status}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.province}
                        onChange={(e) => onFilterChange('province', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        {PROVINCES.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showAdvanced || activeFilterCount > 0
                                ? 'border-primary-500 text-primary-700 bg-primary-50'
                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced
                        {activeFilterCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                        {showAdvanced ? (
                            <ChevronUp className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronDown className="w-4 h-4 ml-2" />
                        )}
                    </button>

                    {activeFilterCount > 0 && (
                        <button
                            onClick={onReset}
                            className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Verification Filters */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Verified
                            </label>
                            <select
                                value={filters.emailVerified}
                                onChange={(e) => onFilterChange('emailVerified', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All</option>
                                <option value="true">Verified</option>
                                <option value="false">Not Verified</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Verified
                            </label>
                            <select
                                value={filters.phoneVerified}
                                onChange={(e) => onFilterChange('phoneVerified', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All</option>
                                <option value="true">Verified</option>
                                <option value="false">Not Verified</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Identity Verified
                            </label>
                            <select
                                value={filters.identityVerified}
                                onChange={(e) => onFilterChange('identityVerified', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All</option>
                                <option value="true">Verified</option>
                                <option value="false">Not Verified</option>
                            </select>
                        </div>

                        {/* Tasker-specific filters */}
                        {(roleType === 'tasker' || roleType === 'all' || roleType === 'both') && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tasker Status
                                    </label>
                                    <select
                                        value={filters.taskerStatus}
                                        onChange={(e) => onFilterChange('taskerStatus', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        {TASKER_STATUS_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => onFilterChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    >
                                        {CATEGORIES.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Location Filters */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                value={filters.city}
                                onChange={(e) => onFilterChange('city', e.target.value)}
                                placeholder="Filter by city"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {/* Rating Filters */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Rating
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                step="0.5"
                                value={filters.minRating}
                                onChange={(e) => onFilterChange('minRating', e.target.value)}
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Rating
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                step="0.5"
                                value={filters.maxRating}
                                onChange={(e) => onFilterChange('maxRating', e.target.value)}
                                placeholder="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        {/* Date Filters */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Registered From
                            </label>
                            <input
                                type="date"
                                value={filters.createdFrom}
                                onChange={(e) => onFilterChange('createdFrom', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Registered To
                            </label>
                            <input
                                type="date"
                                value={filters.createdTo}
                                onChange={(e) => onFilterChange('createdTo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}