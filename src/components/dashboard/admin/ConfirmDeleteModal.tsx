// components/dashboard/admin/ConfirmDeleteModal.tsx
import React, { useState, useEffect } from 'react';
import { FiX, FiTrash2, FiAlertTriangle, FiLoader } from 'react-icons/fi';

interface Props {
    title: string;
    message: string;
    itemName?: string;
    isLoading: boolean;
    requireConfirmation?: boolean;
    confirmationText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning';
}

const ConfirmDeleteModal: React.FC<Props> = ({
    title,
    message,
    itemName,
    isLoading,
    requireConfirmation = false,
    confirmationText = 'DELETE',
    onConfirm,
    onCancel,
    variant = 'danger',
}) => {
    const [confirmInput, setConfirmInput] = useState('');
    const isConfirmed = !requireConfirmation || confirmInput === confirmationText;

    useEffect(() => {
        setConfirmInput('');
    }, []);

    const variantStyles = {
        danger: {
            bg: 'bg-red-100 dark:bg-red-900/30',
            icon: 'text-red-600 dark:text-red-400',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            border: 'border-red-200 dark:border-red-800',
        },
        warning: {
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            icon: 'text-yellow-600 dark:text-yellow-400',
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
            border: 'border-yellow-200 dark:border-yellow-800',
        },
    };

    const styles = variantStyles[variant];

    // Handle backdrop click - only close if clicking the backdrop itself
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if clicking directly on the backdrop, not its children
        if (e.target === e.currentTarget && !isLoading) {
            onCancel();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] overflow-y-auto bg-black/50"
            onClick={handleBackdropClick}
        >
            <div
                className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
                onClick={handleBackdropClick}
            >
                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-opacity "
                    aria-hidden="true"
                />

                {/* Centering trick */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                {/* Modal - Stop propagation here */}
                <div
                    className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-xl shadow-xl relative z-[101]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start gap-4 p-6">
                        <div className={`p-3 rounded-full ${styles.bg} flex-shrink-0`}>
                            <FiAlertTriangle className={styles.icon} size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {message}
                            </p>
                            {itemName && (
                                <div className={`mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border ${styles.border}`}>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                                        "{itemName}"
                                    </p>
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => !isLoading && onCancel()}
                            disabled={isLoading}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0 disabled:opacity-50"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Confirmation Input */}
                    {requireConfirmation && (
                        <div className="px-6 pb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                Type{' '}
                                <span className="font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1 rounded">
                                    {confirmationText}
                                </span>{' '}
                                to confirm:
                            </p>
                            <input
                                type="text"
                                value={confirmInput}
                                onChange={(e) => setConfirmInput(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                                placeholder={confirmationText}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 px-6 pb-6">
                        <button
                            type="button"
                            onClick={() => !isLoading && onCancel()}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (isConfirmed && !isLoading) {
                                    onConfirm();
                                }
                            }}
                            disabled={isLoading || !isConfirmed}
                            className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 ${styles.button}`}
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="animate-spin" size={16} />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <FiTrash2 size={16} />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;