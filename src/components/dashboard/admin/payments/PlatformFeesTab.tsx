"use client"
// components/admin/payments/tabs/PlatformFeesTab.tsx
import React, { useState, useEffect } from 'react';
import {
    Settings,
    Save,
    Calculator,
    RefreshCcw,
    DollarSign,
    Percent,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

import { formatCurrency } from './/formatters';
import { useGetPlatformConfigQuery, useSimulateFeesMutation, useUpdatePlatformConfigMutation } from '@/features/api/adminDashboardPaymentApi';
import LoadingSpinner from './LoadingSpinner';

const PlatformFeesTab: React.FC = () => {
    const { data: configData, isLoading, refetch } = useGetPlatformConfigQuery();
    const [updateConfig, { isLoading: isUpdating }] = useUpdatePlatformConfigMutation();
    const [simulateFees, { isLoading: isSimulating }] = useSimulateFeesMutation();

    const [formData, setFormData] = useState({
        clientPlatformFeePercent: 0.10,
        reservationFeeCents: 500,
        clientTaxPercent: 0.13,
        taskerPlatformFeePercent: 0.12,
        taskerTaxPercent: 0.13,
    });

    const [simulationAmount, setSimulationAmount] = useState('100');
    const [simulationResult, setSimulationResult] = useState<any>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        if (configData?.config) {
            setFormData({
                clientPlatformFeePercent: configData.config.clientPlatformFeePercent || 0.10,
                reservationFeeCents: configData.config.reservationFeeCents || 500,
                clientTaxPercent: configData.config.clientTaxPercent || 0.13,
                taskerPlatformFeePercent: configData.config.taskerPlatformFeePercent || 0.12,
                taskerTaxPercent: configData.config.taskerTaxPercent || 0.13,
            });
        }
    }, [configData]);

    const handleInputChange = (field: string, value: string) => {
        const numValue = parseFloat(value);
        setFormData(prev => ({ ...prev, [field]: numValue }));
        setHasChanges(true);
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        try {
            await updateConfig(formData).unwrap();
            setHasChanges(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            refetch();
        } catch (error) {
            console.error('Failed to update config:', error);
        }
    };

    const handleSimulate = async () => {
        try {
            const result = await simulateFees({
                bidAmount: parseFloat(simulationAmount),
                ...formData,
            }).unwrap();
            setSimulationResult(result.simulation);
        } catch (error) {
            console.error('Simulation failed:', error);
        }
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            {/* Warning Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                        <h4 className="text-sm font-medium text-amber-800">Important Notice</h4>
                        <p className="text-sm text-amber-700 mt-1">
                            Changes to platform fees will only apply to new transactions. Existing bookings, tasks, and quotes will retain their original fee structure.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Settings className="w-5 h-5 mr-2 text-gray-500" />
                            Fee Configuration
                        </h3>
                        {saveSuccess && (
                            <span className="inline-flex items-center text-sm text-green-600">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Saved successfully
                            </span>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Client Fees Section */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-4 pb-2 border-b">
                                Client-Side Fees
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Platform Fee (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={(formData.clientPlatformFeePercent * 100).toFixed(1)}
                                            onChange={(e) => handleInputChange('clientPlatformFeePercent', (parseFloat(e.target.value) / 100).toString())}
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Charged to clients on top of the bid amount
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Reservation Fee (¢)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.reservationFeeCents}
                                            onChange={(e) => handleInputChange('reservationFeeCents', e.target.value)}
                                            step="50"
                                            min="0"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">¢</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Fixed fee charged per booking ({formatCurrency(formData.reservationFeeCents / 100)})
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Tax Rate (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={(formData.clientTaxPercent * 100).toFixed(1)}
                                            onChange={(e) => handleInputChange('clientTaxPercent', (parseFloat(e.target.value) / 100).toString())}
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        HST/GST applied to client total
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tasker Fees Section */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-4 pb-2 border-b">
                                Tasker-Side Deductions
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Platform Fee (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={(formData.taskerPlatformFeePercent * 100).toFixed(1)}
                                            onChange={(e) => handleInputChange('taskerPlatformFeePercent', (parseFloat(e.target.value) / 100).toString())}
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Deducted from tasker's payout
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Tax Withholding (%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={(formData.taskerTaxPercent * 100).toFixed(1)}
                                            onChange={(e) => handleInputChange('taskerTaxPercent', (parseFloat(e.target.value) / 100).toString())}
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tax withheld from tasker earnings
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-6 pt-4 border-t">
                        <button
                            onClick={handleSave}
                            disabled={isUpdating || !hasChanges}
                            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors
                ${hasChanges
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }
                disabled:opacity-50`}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isUpdating ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>

                {/* Fee Simulator */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
                        <Calculator className="w-5 h-5 mr-2 text-gray-500" />
                        Fee Simulator
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bid Amount ($)
                            </label>
                            <div className="flex space-x-3">
                                <div className="relative flex-1">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="number"
                                        value={simulationAmount}
                                        onChange={(e) => setSimulationAmount(e.target.value)}
                                        placeholder="100"
                                        step="10"
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <button
                                    onClick={handleSimulate}
                                    disabled={isSimulating || !simulationAmount}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {isSimulating ? 'Calculating...' : 'Calculate'}
                                </button>
                            </div>
                        </div>

                        {simulationResult && (
                            <div className="mt-6 space-y-4">
                                {/* Client Side */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-blue-900 mb-3">Client Pays</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Bid Amount:</span>
                                            <span className="font-medium text-blue-900">{formatCurrency(simulationResult.bidAmount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Platform Fee:</span>
                                            <span className="font-medium text-blue-900">+{formatCurrency(simulationResult.clientSide.platformFee)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Reservation Fee:</span>
                                            <span className="font-medium text-blue-900">+{formatCurrency(simulationResult.clientSide.reservationFee)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-700">Tax:</span>
                                            <span className="font-medium text-blue-900">+{formatCurrency(simulationResult.clientSide.tax)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-blue-200">
                                            <span className="font-medium text-blue-900">Total:</span>
                                            <span className="font-bold text-blue-900">{formatCurrency(simulationResult.clientSide.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tasker Side */}
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-green-900 mb-3">Tasker Receives</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Bid Amount:</span>
                                            <span className="font-medium text-green-900">{formatCurrency(simulationResult.bidAmount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Platform Fee:</span>
                                            <span className="font-medium text-red-600">-{formatCurrency(simulationResult.taskerSide.platformFee)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-green-700">Tax Withholding:</span>
                                            <span className="font-medium text-red-600">-{formatCurrency(simulationResult.taskerSide.tax)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-green-200">
                                            <span className="font-medium text-green-900">Net Payout:</span>
                                            <span className="font-bold text-green-900">{formatCurrency(simulationResult.taskerSide.payout)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Platform Revenue */}
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-purple-900 mb-3">Platform Revenue</h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-purple-700">Total Collected:</span>
                                        <span className="font-bold text-purple-900">{formatCurrency(simulationResult.platform.totalRevenue)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Current Config Info */}
            {configData?.config && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                        <span>
                            Last updated: {new Date(configData.config.updatedAt).toLocaleDateString()}
                            {configData.config.lastUpdatedBy && (
                                <> by {configData.config.lastUpdatedBy.firstName} {configData.config.lastUpdatedBy.lastName}</>
                            )}
                        </span>
                        <button
                            onClick={() => refetch()}
                            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center"
                        >
                            <RefreshCcw className="w-4 h-4 mr-1" />
                            Refresh
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlatformFeesTab;