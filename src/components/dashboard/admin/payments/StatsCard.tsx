// components/admin/payments/shared/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    urgent?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendUp,
    urgent
}) => {
    return (
        <div className={`bg-white rounded-lg shadow-sm border p-6 ${urgent ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${urgent ? 'text-red-600' : 'text-gray-500'}`}>
                        {title}
                    </p>
                    <p className={`text-2xl font-bold mt-1 ${urgent ? 'text-red-700' : 'text-gray-900'}`}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                    {trend && (
                        <p className={`text-sm mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                            {trend} from last period
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${urgent ? 'bg-red-100' : 'bg-gray-100'}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;