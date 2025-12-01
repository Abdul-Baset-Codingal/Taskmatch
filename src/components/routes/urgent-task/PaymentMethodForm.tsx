// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// // components/PaymentMethodForm.jsx
// 'use client';

// import React, { useState } from "react";
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import getStripe from '@/utils/stripeClient';
// import { useCreateSetupIntentMutation, useSavePaymentMethodMutation } from "@/features/api/taskApi";

// type PaymentMethodFormProps = {
//     onSuccess?: () => void;
//     onError?: (error: string) => void;
// };

// const PaymentMethodFormContent: React.FC<PaymentMethodFormProps> = ({ onSuccess, onError }) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [saved, setSaved] = useState(false);

//     const [createSetupIntent] = useCreateSetupIntentMutation();
//     const [savePaymentMethod] = useSavePaymentMethodMutation();

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!stripe || !elements) return;

//         setIsLoading(true);
//         setError('');

//         try {
//             // 1. Create SetupIntent using your RTK mutation
//             const setupIntentResponse = await createSetupIntent().unwrap();
//             const { clientSecret } = setupIntentResponse;

//             // 2. Confirm card setup
//             const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
//                 payment_method: {
//                     card: elements.getElement(CardElement)!,
//                     billing_details: {
//                         name: 'Client Name',
//                     },
//                 },
//             });

//             if (stripeError) {
//                 setError(stripeError.message || 'Card setup failed');
//                 onError?.(stripeError.message);
//                 return;
//             }

//             // 3. Save to backend using RTK mutation
//             await savePaymentMethod(setupIntent.payment_method).unwrap();

//             setSaved(true);
//             onSuccess?.();
//         } catch (err: any) {
//             const errorMessage = err?.data?.error || err.message || 'Payment setup failed';
//             setError(errorMessage);
//             onError?.(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="p-6">
//             <h2 className="text-2xl font-bold mb-4 text-[#063A41]">Add Payment Method</h2>
//             <p className="text-sm text-gray-600 mb-6">
//                 Securely save your card for task payments. Your card will be charged when tasks are completed.
//             </p>

//             {error && (
//                 <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
//                     {error}
//                 </div>
//             )}

//             {saved && (
//                 <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded mb-4">
//                     Payment method saved successfully!
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Card Details
//                     </label>
//                     <div className="p-3 border border-gray-300 rounded-md bg-white">
//                         <CardElement
//                             options={{
//                                 style: {
//                                     base: {
//                                         fontSize: '16px',
//                                         color: '#424770',
//                                         '::placeholder': { color: '#aab7c4' },
//                                     },
//                                 },
//                             }}
//                         />
//                     </div>
//                 </div>

//                 <button
//                     type="submit"
//                     disabled={!stripe || isLoading}
//                     className="w-full bg-[#109C3D] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#0d8332] disabled:opacity-50 transition-colors"
//                 >
//                     {isLoading ? 'Saving...' : 'Save Payment Method'}
//                 </button>

//                 <p className="text-xs text-gray-500 text-center">
//                     🔒 Powered by Stripe - Your payment information is secure and encrypted
//                 </p>
//             </form>
//         </div>
//     );
// };

// const PaymentMethodForm: React.FC<PaymentMethodFormProps> = (props) => {
//     const [stripePromise, setStripePromise] = useState<any>(null);

//     React.useEffect(() => {
//         // Load Stripe asynchronously to handle potential errors
//         const initializeStripe = async () => {
//             try {
//                 const stripe = await getStripe();
//                 setStripePromise(stripe);
//             } catch (error) {
//                 console.error('Failed to initialize Stripe:', error);
//                 // You can set a state to show an error message to the user
//             }
//         };

//         initializeStripe();
//     }, []);

//     if (!stripePromise) {
//         return (
//             <div className="p-6 text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#109C3D] mx-auto mb-4"></div>
//                 <p className="text-gray-600">Loading payment system...</p>
//             </div>
//         );
//     }

//     return (
//         <Elements stripe={stripePromise}>
//             <PaymentMethodFormContent {...props} />
//         </Elements>
//     );
// };

// export default PaymentMethodForm;



/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// components/PaymentMethodForm.jsx
'use client';

import React, { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import getStripe from '@/utils/stripeClient';
import { useCreateSetupIntentMutation, useSavePaymentMethodMutation } from "@/features/api/taskApi";

type PaymentMethodFormProps = {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    taskAmount?: number;
};

const PaymentMethodFormContent: React.FC<PaymentMethodFormProps> = ({ onSuccess, onError, taskAmount }) => {
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
            // 1. Create SetupIntent
            const setupIntentResponse = await createSetupIntent().unwrap();
            const { clientSecret } = setupIntentResponse;

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
                throw new Error(stripeError.message || 'Card setup failed');
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

            // 5. Call success callback
            onSuccess?.();

        } catch (err: any) {
            console.error('Payment error details:', err);

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
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-blue-700 font-medium">
                            Enter Card Details
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                            Please provide your credit card information for this task.
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
                    <strong>Payment Error:</strong> {error}
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
                    {isLoading ? 'Processing Payment...' : (taskAmount ? `Pay $${taskAmount}` : 'Continue with Payment')}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    🔒 Powered by Stripe - Your payment information is secure and encrypted
                </p>
            </form>
        </div>
    );
};

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = (props) => {
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
            <PaymentMethodFormContent {...props} />
        </Elements>
    );
};

export default PaymentMethodForm;