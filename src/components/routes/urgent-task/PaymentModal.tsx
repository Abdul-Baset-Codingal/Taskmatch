/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentDetails: {
        cardNumber: string;
        expirationDate: string;
        cvv: string;
        cardholderName: string;
        billingZip: string;
        saveCard: boolean;
    }) => void;
    taskForm: any;
    isLoading: boolean;
};

const PaymentModal = ({ isOpen, onClose, onConfirm, isLoading }: Props) => {
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardholderName, setCardholderName] = useState("");
    const [billingZip, setBillingZip] = useState("");
    const [saveCard, setSaveCard] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!cardNumber || !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(cardNumber)) {
            newErrors.cardNumber = "Enter a valid 16-digit card number (e.g., 1234 5678 9012 3456)";
        }
        if (!expirationDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
            newErrors.expirationDate = "Enter a valid expiration date (MM/YY)";
        }
        if (!cvv || !/^\d{3}$/.test(cvv)) {
            newErrors.cvv = "Enter a valid 3-digit CVV";
        }
        if (!cardholderName || cardholderName.trim().length < 2) {
            newErrors.cardholderName = "Enter a valid cardholder name";
        }
        if (!billingZip || !/^\d{5}$/.test(billingZip)) {
            newErrors.billingZip = "Enter a valid 5-digit zip/postal code";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onConfirm({
                cardNumber,
                expirationDate,
                cvv,
                cardholderName,
                billingZip,
                saveCard,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-6 transition-opacity duration-300">
            <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-navy-900">Add Payment Method</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition duration-200"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-600 mb-8 text-sm font-medium">Securely complete your booking by adding a payment method</p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                className="w-full border border-gray-200 rounded-lg p-3 pl-10 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 placeholder-gray-400"
                            />
                            <span className="absolute left-3 top-3 text-gray-400">💳</span>
                        </div>
                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1.5">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiration Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    placeholder="MM/YY"
                                    className="w-full border border-gray-200 rounded-lg p-3 pl-10 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 placeholder-gray-400"
                                />
                                <span className="absolute left-3 top-3 text-gray-400">📅</span>
                            </div>
                            {errors.expirationDate && <p className="text-red-500 text-xs mt-1.5">{errors.expirationDate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    placeholder="123"
                                    className="w-full border border-gray-200 rounded-lg p-3 pl-10 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 placeholder-gray-400"
                                />
                                <span className="absolute left-3 top-3 text-gray-400">🔒</span>
                            </div>
                            {errors.cvv && <p className="text-red-500 text-xs mt-1.5">{errors.cvv}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cardholder Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={cardholderName}
                                onChange={(e) => setCardholderName(e.target.value)}
                                placeholder="John Smith"
                                className="w-full border border-gray-200 rounded-lg p-3 pl-10 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 placeholder-gray-400"
                            />
                            <span className="absolute left-3 top-3 text-gray-400">👤</span>
                        </div>
                        {errors.cardholderName && <p className="text-red-500 text-xs mt-1.5">{errors.cardholderName}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Billing Zip/Postal Code <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={billingZip}
                                onChange={(e) => setBillingZip(e.target.value)}
                                placeholder="12345"
                                className="w-full border border-gray-200 rounded-lg p-3 pl-10 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 placeholder-gray-400"
                            />
                            <span className="absolute left-3 top-3 text-gray-400">🏠</span>
                        </div>
                        {errors.billingZip && <p className="text-red-500 text-xs mt-1.5">{errors.billingZip}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-200 rounded transition duration-200"
                        />
                        <label className="ml-2 text-sm text-gray-600">Save this card for future bookings</label>
                    </div>

                    <div className="mt-6 bg-green-50 border border-green-500 p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-700 flex items-center">
                            <span className="text-lg mr-2">🔒</span>
                            <span>
                                <strong>Secure Payment</strong>: Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                            </span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="bg-gray-100 text-navy-700 font-semibold py-3 rounded-xl hover:bg-gray-200 hover:text-navy-900 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-500 to-green-700 py-3 rounded-xl font-semibold text-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? "Processing..." : "Save & Complete Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;