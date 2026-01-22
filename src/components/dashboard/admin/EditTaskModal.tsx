// components/dashboard/admin/EditTaskModal.tsx
import React, { useState, useEffect } from 'react';
import {
    FiX,
    FiSave,
    FiAlertCircle,
    FiLoader,
    FiFileText,
    FiMapPin,
    FiClock,
    FiDollarSign,
    FiCalendar,
    FiInfo,
    FiHash,
    FiChevronDown,
    FiCheck
} from 'react-icons/fi';
import { useUpdateAdminTaskMutation } from '@/features/api/adminTaskApi';
import { toast } from 'react-toastify';

interface Task {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    serviceTitle?: string;
    location: string;
    schedule: string;
    status: string;
    price: number;
    estimatedTime?: string;
    additionalInfo?: string;
    offerDeadline?: string;
    extraCharge?: number;
}

interface Props {
    task: Task;
    onClose: () => void;
    onSuccess: () => void;
}

const scheduleOptions = [
    { value: 'Flexible', label: 'Flexible', icon: '🕐', description: 'Anytime that works' },
    { value: 'Schedule', label: 'Scheduled', icon: '📅', description: 'Specific date/time' },
    { value: 'Urgent', label: 'Urgent', icon: '⚡', description: 'ASAP' },
];

const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'in progress', label: 'In Progress', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'emerald' },
    { value: 'requested', label: 'Requested', color: 'violet' },
    { value: 'not completed', label: 'Not Completed', color: 'orange' },
    { value: 'declined', label: 'Declined', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' },
];

const getStatusColor = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    const colors: Record<string, string> = {
        amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
        emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
        violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400',
        orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
        red: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
        gray: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
    };
    return colors[option?.color || 'gray'];
};

const EditTaskModal: React.FC<Props> = ({ task, onClose, onSuccess }) => {
    const [updateTask, { isLoading }] = useUpdateAdminTaskMutation();

    const [formData, setFormData] = useState({
        taskTitle: '',
        taskDescription: '',
        location: '',
        schedule: '',
        status: '',
        price: 0,
        estimatedTime: '',
        additionalInfo: '',
        offerDeadline: '',
        extraCharge: 0,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (task) {
            setFormData({
                taskTitle: task.taskTitle || '',
                taskDescription: task.taskDescription || '',
                location: task.location || '',
                schedule: task.schedule || '',
                status: task.status || '',
                price: task.price || 0,
                estimatedTime: task.estimatedTime || '',
                additionalInfo: task.additionalInfo || '',
                offerDeadline: task.offerDeadline ? task.offerDeadline.split('T')[0] : '',
                extraCharge: task.extraCharge || 0,
            });
            setHasChanges(false);
            setErrors({});
            setTouched({});
        }
    }, [task]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'extraCharge'
                ? parseFloat(value) || 0
                : value
        }));
        setHasChanges(true);

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.taskTitle.trim()) {
            newErrors.taskTitle = 'Task title is required';
        } else if (formData.taskTitle.length < 5) {
            newErrors.taskTitle = 'Task title must be at least 5 characters';
        }

        if (!formData.taskDescription.trim()) {
            newErrors.taskDescription = 'Description is required';
        } else if (formData.taskDescription.length < 20) {
            newErrors.taskDescription = 'Description must be at least 20 characters';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.schedule) {
            newErrors.schedule = 'Schedule type is required';
        }

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        if (formData.price < 0) {
            newErrors.price = 'Price cannot be negative';
        }

        if (formData.extraCharge < 0) {
            newErrors.extraCharge = 'Extra charge cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix the validation errors');
            return;
        }

        try {
            await updateTask({
                taskId: task._id,
                updateData: formData
            }).unwrap();

            toast.success('Task updated successfully');
            onSuccess();
        } catch (error: any) {
            console.error('Update error:', error);
            toast.error(error?.data?.message || 'Failed to update task');
        }
    };

    const handleCloseClick = () => {
        if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    const InputWrapper: React.FC<{
        label: string;
        required?: boolean;
        error?: string;
        hint?: string;
        children: React.ReactNode;
        icon?: React.ReactNode;
    }> = ({ label, required, error, hint, children, icon }) => (
        <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {icon && <span className="text-gray-400">{icon}</span>}
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && (
                <p className="flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
                    <FiAlertCircle size={14} />
                    {error}
                </p>
            )}
            {hint && !error && (
                <p className="text-xs text-gray-400 dark:text-gray-500">{hint}</p>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm "
                onClick={handleCloseClick}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl lg:h-[800px] h-[500px] overflow-y-scroll bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                                <FiFileText className="emerald-blue-600 dark:emerald-blue-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Edit Task
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <FiHash size={12} />
                                    <span className="font-mono">{task._id.slice(-8).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleCloseClick}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6 space-y-8">

                            {/* Section: Basic Information */}
                            <section className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Basic Information
                                    </span>
                                </div>

                                {/* Task Title */}
                                <InputWrapper
                                    label="Task Title"
                                    required
                                    error={touched.taskTitle ? errors.taskTitle : undefined}
                                    icon={<FiFileText size={14} />}
                                >
                                    <input
                                        type="text"
                                        name="taskTitle"
                                        value={formData.taskTitle}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('taskTitle')}
                                        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 ${errors.taskTitle && touched.taskTitle
                                                ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20'
                                            : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/20 focus:border-emerald-500'
                                            }`}
                                        placeholder="Enter a descriptive task title"
                                    />
                                </InputWrapper>

                                {/* Description */}
                                <InputWrapper
                                    label="Description"
                                    required
                                    error={touched.taskDescription ? errors.taskDescription : undefined}
                                    hint={`${formData.taskDescription.length} characters (minimum 20)`}
                                >
                                    <textarea
                                        name="taskDescription"
                                        value={formData.taskDescription}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('taskDescription')}
                                        rows={4}
                                        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 ${errors.taskDescription && touched.taskDescription
                                                ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20'
                                            : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/20 focus:border-emerald-500'
                                            }`}
                                        placeholder="Describe the task in detail..."
                                    />
                                </InputWrapper>

                                {/* Location */}
                                <InputWrapper
                                    label="Location"
                                    required
                                    error={touched.location ? errors.location : undefined}
                                    icon={<FiMapPin size={14} />}
                                >
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('location')}
                                        className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 ${errors.location && touched.location
                                                ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/20 focus:border-emerald-500'
                                            }`}
                                        placeholder="Enter task location"
                                    />
                                </InputWrapper>
                            </section>

                            {/* Section: Status & Schedule */}
                            <section className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Status & Schedule
                                    </span>
                                </div>

                                {/* Schedule Options */}
                                <InputWrapper
                                    label="Schedule Type"
                                    required
                                    error={touched.schedule ? errors.schedule : undefined}
                                >
                                    <div className="grid grid-cols-3 gap-3">
                                        {scheduleOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, schedule: option.value }));
                                                    setHasChanges(true);
                                                    if (errors.schedule) {
                                                        setErrors(prev => {
                                                            const newErrors = { ...prev };
                                                            delete newErrors.schedule;
                                                            return newErrors;
                                                        });
                                                    }
                                                }}
                                                className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all duration-200 ${formData.schedule === option.value
                                                    ? 'border-emerald-500 bg-blue-50 dark:bg-blue-500/10'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800'
                                                    }`}
                                            >
                                                {formData.schedule === option.value && (
                                                    <div className="absolute top-2 right-2">
                                                        <FiCheck className="text-emerald-500" size={14} />
                                                    </div>
                                                )}
                                                <span className="text-xl">{option.icon}</span>
                                                <span className={`text-sm font-medium ${formData.schedule === option.value
                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                        : 'text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {option.label}
                                                </span>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                                    {option.description}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </InputWrapper>

                                {/* Status Dropdown */}
                                <InputWrapper
                                    label="Status"
                                    required
                                    error={touched.status ? errors.status : undefined}
                                >
                                    <div className="relative">
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('status')}
                                            className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 ${errors.status && touched.status
                                                    ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/20 focus:border-emerald-500'
                                                }`}
                                        >
                                            <option value="">Select status</option>
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    </div>
                                    {formData.status && (
                                        <div className="mt-2">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(formData.status)}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                {statusOptions.find(s => s.value === formData.status)?.label}
                                            </span>
                                        </div>
                                    )}
                                </InputWrapper>
                            </section>

                            {/* Section: Pricing */}
                            <section className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Pricing
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Price */}
                                    <InputWrapper
                                        label="Budget"
                                        error={errors.price}
                                        icon={<FiDollarSign size={14} />}
                                    >
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 ${errors.price
                                                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20'
                                                    : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/20 focus:border-emerald-500'
                                                    }`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </InputWrapper>

                                    {/* Extra Charge */}
                                    <InputWrapper
                                        label="Extra Charge"
                                        error={errors.extraCharge}
                                        hint="Additional fees if any"
                                    >
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                            <input
                                                type="number"
                                                name="extraCharge"
                                                value={formData.extraCharge}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                className={`w-full pl-8 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 ${errors.extraCharge
                                                        ? 'border-red-300 dark:border-red-500/50 focus:ring-red-500/20'
                                                    : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/20 focus:border-emerald-500'
                                                    }`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </InputWrapper>
                                </div>

                                {/* Total Display */}
                                {(formData.price > 0 || formData.extraCharge > 0) && (
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                            Total Amount
                                        </span>
                                        <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                                            ${(formData.price + formData.extraCharge).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </section>

                            {/* Section: Timeline */}
                            <section className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Timeline
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Estimated Time */}
                                    <InputWrapper
                                        label="Estimated Duration"
                                        icon={<FiClock size={14} />}
                                        hint="e.g., 2-3 hours"
                                    >
                                        <input
                                            type="text"
                                            name="estimatedTime"
                                            value={formData.estimatedTime}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800"
                                            placeholder="e.g., 2-3 hours"
                                        />
                                    </InputWrapper>

                                    {/* Offer Deadline */}
                                    <InputWrapper
                                        label="Offer Deadline"
                                        icon={<FiCalendar size={14} />}
                                    >
                                        <input
                                            type="date"
                                            name="offerDeadline"
                                            value={formData.offerDeadline}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800"
                                        />
                                    </InputWrapper>
                                </div>
                            </section>

                            {/* Section: Additional Info */}
                            <section className="space-y-5">
                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                        Additional Details
                                    </span>
                                </div>

                                <InputWrapper
                                    label="Additional Information"
                                    icon={<FiInfo size={14} />}
                                    hint="Any extra details or special requirements"
                                >
                                    <textarea
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-gray-800"
                                        placeholder="Any additional notes or special instructions..."
                                    />
                                </InputWrapper>
                            </section>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-2">
                            {hasChanges ? (
                                <span className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    Unsaved changes
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                                    <FiCheck size={14} />
                                    No changes
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCloseClick}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !hasChanges}
                                className="relative px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 overflow-hidden"
                            >
                                {isLoading ? (
                                    <>
                                        <FiLoader className="animate-spin" size={16} />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSave size={16} />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;