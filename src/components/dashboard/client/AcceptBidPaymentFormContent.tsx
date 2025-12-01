/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import React, { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import getStripe from '@/utils/stripeClient';
import { useCreateSetupIntentMutation, useSavePaymentMethodMutation } from "@/features/api/taskApi";
import { toast } from "react-toastify";

type AcceptBidPaymentFormProps = {
    onSuccess: (paymentMethodId: string) => void;
    onError: (error: string) => void;
    bidAmount: number;
    taskId: string;
    taskerId: string;
};

const AcceptBidPaymentFormContent: React.FC<AcceptBidPaymentFormProps> = ({
    onSuccess,
    onError,
    bidAmount,
    taskId,
    taskerId
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [createSetupIntent] = useCreateSetupIntentMutation();
    const [savePaymentMethod] = useSavePaymentMethodMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) {
            setError('Payment system not ready. Please try again.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // 1. Create SetupIntent first (this works with your existing backend)
            const setupIntentResponse = await createSetupIntent().unwrap();
            const { clientSecret } = setupIntentResponse;

            if (!clientSecret) {
                throw new Error('No client secret received from server');
            }

            // 2. Get card element
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            // 3. Confirm card setup with Stripe
            const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Customer',
                    },
                },
            });

            if (stripeError) {
                throw new Error(stripeError.message || 'Payment setup failed');
            }

            if (!setupIntent?.payment_method) {
                throw new Error('No payment method returned from Stripe');
            }

            // Extract the payment method ID
            const paymentMethodId = typeof setupIntent.payment_method === 'string'
                ? setupIntent.payment_method
                : setupIntent.payment_method.id;

            // 4. Save payment method to your backend
            await savePaymentMethod(paymentMethodId).unwrap();

            toast.success("Payment method saved successfully!")
            // 5. Call success callback with payment method ID
            onSuccess(paymentMethodId);

        } catch (err: any) {
            console.error('Payment setup error details:', err);

            let errorMessage = 'Payment setup failed';

            if (err?.data?.error) {
                errorMessage = err.data.error;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-yellow-700 font-medium">
                            Secure Payment Setup
                        </p>
                        <p className="text-sm text-yellow-600 mt-1">
                            Your card will be saved for this ${bidAmount} payment. Funds will be processed after task completion.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                    <strong>Payment Setup Error:</strong> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Details
                    </label>
                    <div className="p-3 border border-gray-300 rounded-md bg-white">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!stripe || isLoading}
                    className="w-full bg-[#109C3D] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#0d8332] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Setting Up Payment...' : `Setup Payment for $${bidAmount}`}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    🔒 Your card will be saved securely for this transaction
                </p>
            </form>
        </div>
    );
};

const AcceptBidPaymentForm: React.FC<AcceptBidPaymentFormProps> = (props) => {
    const [stripePromise, setStripePromise] = useState<any>(null);

    React.useEffect(() => {
        const initializeStripe = async () => {
            try {
                const stripe = await getStripe();
                setStripePromise(stripe);
            } catch (error) {
                console.error('Failed to initialize Stripe:', error);
            }
        };

        initializeStripe();
    }, []);

    if (!stripePromise) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#109C3D] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading payment system...</p>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <AcceptBidPaymentFormContent {...props} />
        </Elements>
    );
};

export default AcceptBidPaymentForm;