// // components/AcceptBidPaymentFormContent.tsx

// "use client";

// import React, { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import {
//     Elements,
//     CardElement,
//     useStripe,
//     useElements,
// } from '@stripe/react-stripe-js';
// import { Loader2, CreditCard, Lock, CheckCircle } from 'lucide-react';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// const cardElementOptions = {
//     style: {
//         base: {
//             fontSize: '16px',
//             color: '#424770',
//             fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
//             '::placeholder': {
//                 color: '#aab7c4',
//             },
//         },
//         invalid: {
//             color: '#e53e3e',
//         },
//     },
// };

// interface PaymentFormProps {
//     onSuccess: (paymentMethodId: string) => void;
//     onError: (error: string) => void;
//     bidAmount: number;
//     taskId: string;
//     taskerId: string;
//     customerInfo?: {
//         id: string;
//         name: string;
//         email: string;
//     };
// }

// const PaymentFormContent: React.FC<PaymentFormProps> = ({
//     onSuccess,
//     onError,
//     bidAmount,
// }) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [cardComplete, setCardComplete] = useState(false);
//     const [cardError, setCardError] = useState<string | null>(null);
//     const [existingCards, setExistingCards] = useState<any[]>([]);
//     const [selectedCard, setSelectedCard] = useState<string | null>(null);
//     const [showNewCardForm, setShowNewCardForm] = useState(false);
//     const [isLoadingCards, setIsLoadingCards] = useState(true);

//     // Load existing payment methods
//     useEffect(() => {
//         const loadCards = async () => {
//             try {
//                 const response = await fetch('http://localhost:5000/api/payments/client/methods', {
//                     credentials: 'include'
//                 });
//                 const data = await response.json();

//                 if (data.paymentMethods && data.paymentMethods.length > 0) {
//                     setExistingCards(data.paymentMethods);
//                     // Auto-select default card
//                     const defaultCard = data.paymentMethods.find((c: any) => c.isDefault);
//                     if (defaultCard) {
//                         setSelectedCard(defaultCard.id);
//                     } else {
//                         setSelectedCard(data.paymentMethods[0].id);
//                     }
//                 } else {
//                     setShowNewCardForm(true);
//                 }
//             } catch (error) {
//                 console.error('Error loading cards:', error);
//                 setShowNewCardForm(true);
//             } finally {
//                 setIsLoadingCards(false);
//             }
//         };

//         loadCards();
//     }, []);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsProcessing(true);
//         setCardError(null);

//         try {
//             // If using existing card
//             if (selectedCard && !showNewCardForm) {
//                 onSuccess(selectedCard);
//                 return;
//             }

//             // Adding new card
//             if (!stripe || !elements) {
//                 throw new Error('Stripe not loaded');
//             }

//             // 1. Create SetupIntent
//             const intentResponse = await fetch('http://localhost:5000/api/payments/client/setup-intent', {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: { 'Content-Type': 'application/json' }
//             });

//             const intentData = await intentResponse.json();

//             if (!intentData.success || !intentData.clientSecret) {
//                 throw new Error(intentData.error || 'Failed to create setup intent');
//             }

//             // 2. Confirm card setup with Stripe
//             const cardElement = elements.getElement(CardElement);
//             if (!cardElement) {
//                 throw new Error('Card element not found');
//             }

//             const { error, setupIntent } = await stripe.confirmCardSetup(
//                 intentData.clientSecret,
//                 {
//                     payment_method: {
//                         card: cardElement,
//                     }
//                 }
//             );

//             if (error) {
//                 throw new Error(error.message);
//             }

//             if (!setupIntent?.payment_method) {
//                 throw new Error('No payment method returned');
//             }

//             // 3. Save payment method to backend
//             const saveResponse = await fetch('http://localhost:5000/api/payments/client/save', {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     paymentMethodId: setupIntent.payment_method
//                 })
//             });

//             const saveData = await saveResponse.json();

//             if (!saveData.success) {
//                 throw new Error(saveData.error || 'Failed to save payment method');
//             }

//             // Success!
//             onSuccess(setupIntent.payment_method as string);

//         } catch (error: any) {
//             console.error('Payment error:', error);
//             setCardError(error.message);
//             onError(error.message);
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     if (isLoadingCards) {
//         return (
//             <div className="flex items-center justify-center py-8">
//                 <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
//                 <span className="ml-2 text-gray-500">Loading payment methods...</span>
//             </div>
//         );
//     }

//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Existing Cards */}
//             {existingCards.length > 0 && !showNewCardForm && (
//                 <div className="space-y-3">
//                     <label className="block text-sm font-medium text-gray-700">
//                         Select Payment Method
//                     </label>

//                     {existingCards.map((card) => (
//                         <label
//                             key={card.id}
//                             className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedCard === card.id
//                                     ? 'border-green-500 bg-green-50'
//                                     : 'border-gray-200 hover:border-gray-300'
//                                 }`}
//                         >
//                             <input
//                                 type="radio"
//                                 name="card"
//                                 value={card.id}
//                                 checked={selectedCard === card.id}
//                                 onChange={() => setSelectedCard(card.id)}
//                                 className="sr-only"
//                             />
//                             <div className="flex items-center gap-3 flex-1">
//                                 <CreditCard className="w-5 h-5 text-gray-400" />
//                                 <div>
//                                     <span className="font-medium text-gray-900 uppercase">
//                                         {card.brand}
//                                     </span>
//                                     <span className="text-gray-500"> •••• {card.last4}</span>
//                                 </div>
//                                 {card.isDefault && (
//                                     <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
//                                         Default
//                                     </span>
//                                 )}
//                             </div>
//                             {selectedCard === card.id && (
//                                 <CheckCircle className="w-5 h-5 text-green-500" />
//                             )}
//                         </label>
//                     ))}

//                     <button
//                         type="button"
//                         onClick={() => setShowNewCardForm(true)}
//                         className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
//                     >
//                         <CreditCard className="w-4 h-4" />
//                         Use a different card
//                     </button>
//                 </div>
//             )}

//             {/* New Card Form */}
//             {showNewCardForm && (
//                 <div className="space-y-4">
//                     {existingCards.length > 0 && (
//                         <button
//                             type="button"
//                             onClick={() => setShowNewCardForm(false)}
//                             className="text-sm text-gray-500 hover:text-gray-700"
//                         >
//                             ← Back to saved cards
//                         </button>
//                     )}

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Card Details
//                         </label>
//                         <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
//                             <CardElement
//                                 options={cardElementOptions}
//                                 onChange={(e) => {
//                                     setCardComplete(e.complete);
//                                     setCardError(e.error?.message || null);
//                                 }}
//                             />
//                         </div>
//                     </div>

//                     {cardError && (
//                         <p className="text-sm text-red-600">{cardError}</p>
//                     )}
//                 </div>
//             )}

//             {/* Amount Display */}
//             <div className="py-3 px-4 bg-gray-50 rounded-lg">
//                 <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Amount to authorize:</span>
//                     <span className="text-xl font-bold text-[#109C3D]">${bidAmount}</span>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                     This amount will be held until the task is completed
//                 </p>
//             </div>

//             {/* Submit Button */}
//             <button
//                 type="submit"
//                 disabled={
//                     isProcessing ||
//                     (!selectedCard && !cardComplete && showNewCardForm) ||
//                     (showNewCardForm && !cardComplete)
//                 }
//                 className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${isProcessing ||
//                         (!selectedCard && !cardComplete && showNewCardForm) ||
//                         (showNewCardForm && !cardComplete)
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-[#109C3D] hover:bg-[#0d8534] text-white'
//                     }`}
//             >
//                 {isProcessing ? (
//                     <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                     </>
//                 ) : (
//                     <>
//                         <Lock className="w-4 h-4" />
//                         Accept Bid & Authorize ${bidAmount}
//                     </>
//                 )}
//             </button>

//             {/* Security Note */}
//             <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
//                 <Lock className="w-3 h-3" />
//                 <span>Secured by Stripe • Card details never touch our servers</span>
//             </div>
//         </form>
//     );
// };

// // Wrapper with Stripe Elements
// const 
// AcceptBidPaymentForm: React.FC<PaymentFormProps> = (props) => {
//     return (
//         <Elements stripe={stripePromise}>
//             <PaymentFormContent {...props} />
//         </Elements>
//     );
// };

// export default AcceptBidPaymentForm;


"use client";

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { Loader2, CreditCard, Lock, CheckCircle, MapPin } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ⭐ Hide postal code - we'll use our own Canadian format input
const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#e53e3e',
        },
    },
    hidePostalCode: true,  // ⭐ Hide Stripe's postal code field
};

interface PaymentFormProps {
    onSuccess: (paymentMethodId: string) => void;
    onError: (error: string) => void;
    bidAmount: number;
    totalAmount: number;
    taskId: string;
    taskerId: string;
    customerInfo?: {
        id: string;
        name: string;
        email: string;
    };
}

// ⭐ Canadian Postal Code Validation & Formatting
const formatCanadianPostalCode = (value: string): string => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Format as A1A 1A1
    if (cleaned.length <= 3) {
        return cleaned;
    }
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
};

const isValidCanadianPostalCode = (postalCode: string): boolean => {
    // Canadian postal code pattern: A1A 1A1
    // First letter cannot be D, F, I, O, Q, U, W, Z
    const pattern = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ] ?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i;
    return pattern.test(postalCode.replace(/\s/g, '').toUpperCase());
};

const PaymentFormContent: React.FC<PaymentFormProps> = ({
    onSuccess,
    onError,
    bidAmount,
    totalAmount,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);
    const [existingCards, setExistingCards] = useState<any[]>([]);
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const [showNewCardForm, setShowNewCardForm] = useState(false);
    const [isLoadingCards, setIsLoadingCards] = useState(true);

    // ⭐ Canadian Postal Code State
    const [postalCode, setPostalCode] = useState('');
    const [postalCodeError, setPostalCodeError] = useState<string | null>(null);
    const [postalCodeTouched, setPostalCodeTouched] = useState(false);

    // Load existing payment methods
    useEffect(() => {
        const loadCards = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/payments/client/methods', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.paymentMethods && data.paymentMethods.length > 0) {
                    setExistingCards(data.paymentMethods);
                    const defaultCard = data.paymentMethods.find((c: any) => c.isDefault);
                    if (defaultCard) {
                        setSelectedCard(defaultCard.id);
                    } else {
                        setSelectedCard(data.paymentMethods[0].id);
                    }
                } else {
                    setShowNewCardForm(true);
                }
            } catch (error) {
                console.error('Error loading cards:', error);
                setShowNewCardForm(true);
            } finally {
                setIsLoadingCards(false);
            }
        };

        loadCards();
    }, []);

    // ⭐ Handle postal code input with formatting
    const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCanadianPostalCode(e.target.value);
        setPostalCode(formatted);

        // Clear error when user starts typing
        if (postalCodeError) {
            setPostalCodeError(null);
        }
    };

    // ⭐ Validate postal code on blur
    const handlePostalCodeBlur = () => {
        setPostalCodeTouched(true);

        if (!postalCode) {
            setPostalCodeError('Postal code is required');
        } else if (!isValidCanadianPostalCode(postalCode)) {
            setPostalCodeError('Please enter a valid Canadian postal code (e.g., M5V 3A1)');
        } else {
            setPostalCodeError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setCardError(null);

        try {
            // If using existing card
            if (selectedCard && !showNewCardForm) {
                onSuccess(selectedCard);
                return;
            }

            // ⭐ Validate postal code for new card
            if (!postalCode) {
                setPostalCodeError('Postal code is required');
                setIsProcessing(false);
                return;
            }

            if (!isValidCanadianPostalCode(postalCode)) {
                setPostalCodeError('Please enter a valid Canadian postal code (e.g., M5V 3A1)');
                setIsProcessing(false);
                return;
            }

            // Adding new card
            if (!stripe || !elements) {
                throw new Error('Stripe not loaded');
            }

            // 1. Create SetupIntent
            const intentResponse = await fetch('http://localhost:5000/api/payments/client/setup-intent', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const intentData = await intentResponse.json();

            if (!intentData.success || !intentData.clientSecret) {
                throw new Error(intentData.error || 'Failed to create setup intent');
            }

            // 2. Confirm card setup with Stripe
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                throw new Error('Card element not found');
            }

            // ⭐ Include billing details with Canadian postal code
            const { error, setupIntent } = await stripe.confirmCardSetup(
                intentData.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            address: {
                                postal_code: postalCode.replace(/\s/g, '').toUpperCase(), // Remove space for Stripe
                                country: 'CA',  // ⭐ Set country to Canada
                            },
                        },
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            if (!setupIntent?.payment_method) {
                throw new Error('No payment method returned');
            }

            // 3. Save payment method to backend
            const saveResponse = await fetch('http://localhost:5000/api/payments/client/save', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentMethodId: setupIntent.payment_method
                })
            });

            const saveData = await saveResponse.json();

            if (!saveData.success) {
                throw new Error(saveData.error || 'Failed to save payment method');
            }

            // Success!
            onSuccess(setupIntent.payment_method as string);

        } catch (error: any) {
            console.error('Payment error:', error);
            setCardError(error.message);
            onError(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoadingCards) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Loading payment methods...</span>
            </div>
        );
    }

    // Check if form is valid
    const isFormValid = showNewCardForm
        ? (cardComplete && postalCode && isValidCanadianPostalCode(postalCode))
        : !!selectedCard;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Existing Cards */}
            {existingCards.length > 0 && !showNewCardForm && (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Select Payment Method
                    </label>

                    {existingCards.map((card) => (
                        <label
                            key={card.id}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedCard === card.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="card"
                                value={card.id}
                                checked={selectedCard === card.id}
                                onChange={() => setSelectedCard(card.id)}
                                className="sr-only"
                            />
                            <div className="flex items-center gap-3 flex-1">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <div>
                                    <span className="font-medium text-gray-900 uppercase">
                                        {card.brand}
                                    </span>
                                    <span className="text-gray-500"> •••• {card.last4}</span>
                                </div>
                                {card.isDefault && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                        Default
                                    </span>
                                )}
                            </div>
                            {selectedCard === card.id && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                        </label>
                    ))}

                    <button
                        type="button"
                        onClick={() => setShowNewCardForm(true)}
                        className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
                    >
                        <CreditCard className="w-4 h-4" />
                        Use a different card
                    </button>
                </div>
            )}

            {/* New Card Form */}
            {showNewCardForm && (
                <div className="space-y-4">
                    {existingCards.length > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                setShowNewCardForm(false);
                                setPostalCode('');
                                setPostalCodeError(null);
                                setPostalCodeTouched(false);
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Back to saved cards
                        </button>
                    )}

                    {/* Card Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Details
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                            <CardElement
                                options={cardElementOptions}
                                onChange={(e) => {
                                    setCardComplete(e.complete);
                                    setCardError(e.error?.message || null);
                                }}
                            />
                        </div>
                        {cardError && (
                            <p className="text-sm text-red-600 mt-1">{cardError}</p>
                        )}
                    </div>

                    {/* ⭐ Canadian Postal Code Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code
                            <span className="text-gray-400 font-normal ml-1">(Canadian)</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={postalCode}
                                onChange={handlePostalCodeChange}
                                onBlur={handlePostalCodeBlur}
                                placeholder="M5V 3A1"
                                maxLength={7}
                                className={`
                                    block w-full pl-10 pr-3 py-3 
                                    border rounded-lg 
                                    text-gray-900 placeholder-gray-400
                                    focus:outline-none focus:ring-2 focus:border-transparent
                                    uppercase tracking-wider font-mono text-lg
                                    ${postalCodeError && postalCodeTouched
                                        ? 'border-red-500 focus:ring-red-500'
                                        : postalCode && isValidCanadianPostalCode(postalCode)
                                            ? 'border-green-500 focus:ring-green-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }
                                `}
                            />
                            {/* Validation indicator */}
                            {postalCode && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    {isValidCanadianPostalCode(postalCode) ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : postalCodeTouched ? (
                                        <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                                            <span className="text-red-500 text-xs font-bold">!</span>
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>

                        {/* Error message */}
                        {postalCodeError && postalCodeTouched && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                <span>⚠️</span>
                                {postalCodeError}
                            </p>
                        )}

                        {/* Helper text */}
                        <p className="text-xs text-gray-500 mt-1">
                            🇨🇦 Format: A1A 1A1 (e.g., M5V 3A1, V6B 1A1)
                        </p>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isProcessing || !isFormValid}
                className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${isProcessing || !isFormValid
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#109C3D] hover:bg-[#0d8534] text-white'
                    }`}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4" />
                        Accept Bid & Authorize ${totalAmount.toFixed(2)} CAD
                    </>
                )}
            </button>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Lock className="w-3 h-3" />
                <span>🇨🇦 Canadian payments secured by Stripe</span>
            </div>
        </form>
    );
};

// Wrapper with Stripe Elements
const AcceptBidPaymentForm: React.FC<PaymentFormProps> = (props) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentFormContent {...props} />
        </Elements>
    );
};

export default AcceptBidPaymentForm;