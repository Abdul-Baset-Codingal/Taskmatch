// /* eslint-disable @typescript-eslint/ban-ts-comment */
// // @ts-nocheck
// // components/PaymentModal.jsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useCheckPaymentMethodQuery } from '@/features/api/taskApi';
// import PaymentMethodForm from './PaymentMethodForm';

// interface PaymentModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSuccess: () => void;
//     taskAmount?: number;
// }

// const StripePaymentModal: React.FC<PaymentModalProps> = ({
//     isOpen,
//     onClose,
//     onSuccess,
//     taskAmount
// }) => {
//     const [showPaymentForm, setShowPaymentForm] = useState(false);
//     const { data: paymentMethod, refetch, isLoading: checkingPayment } = useCheckPaymentMethodQuery();

//     useEffect(() => {
//         if (isOpen) {
//             refetch();
//             setShowPaymentForm(false);
//         }
//     }, [isOpen, refetch]);

//     const handlePaymentSuccess = () => {
//         setShowPaymentForm(false);
//         refetch();
//         onSuccess();
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ">
//             <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
//                 <div className="p-6">
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-2xl font-bold text-[#063A41]">
//                             Payment Setup
//                         </h2>
//                         <button
//                             onClick={onClose}
//                             className="text-gray-400 hover:text-gray-600 text-2xl"
//                         >
//                             ×
//                         </button>
//                     </div>

//                     {taskAmount && (
//                         <div className="mb-6 p-4 bg-blue-50 rounded-lg">
//                             <p className="text-sm text-blue-600 mb-1">Task Amount:</p>
//                             <p className="text-2xl font-bold text-[#109C3D]">${taskAmount}</p>
//                         </div>
//                     )}

//                     {checkingPayment ? (
//                         <div className="flex justify-center py-8">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#109C3D]"></div>
//                         </div>
//                     ) : showPaymentForm ? (
//                         <PaymentMethodForm
//                             onSuccess={handlePaymentSuccess}
//                             onError={() => setShowPaymentForm(false)}
//                         />
//                     ) : paymentMethod?.hasPaymentMethod ? (
//                         <div className="space-y-4">
//                             <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <div>
//                                         <p className="text-green-700 font-medium">
//                                             Payment method saved
//                                         </p>
//                                         <p className="text-sm text-green-600 mt-1">
//                                             Your card is ready for task payments
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex gap-3">
//                                 <button
//                                     onClick={onSuccess}
//                                     className="flex-1 bg-[#109C3D] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#0d8332] transition-colors"
//                                 >
//                                     Continue to Post Task
//                                 </button>
//                                 <button
//                                     onClick={() => setShowPaymentForm(true)}
//                                     className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
//                                 >
//                                     Change Card
//                                 </button>
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
//                                             <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                         </svg>
//                                     </div>
//                                     <div>
//                                         <p className="text-yellow-700 font-medium">
//                                             Payment method required
//                                         </p>
//                                         <p className="text-sm text-yellow-600 mt-1">
//                                             You need to add a payment method to post tasks
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <PaymentMethodForm onSuccess={handlePaymentSuccess} />
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default StripePaymentModal;


/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// components/PaymentModal.jsx
'use client';

import React, { useState, useEffect } from 'react';
import PaymentMethodForm from './PaymentMethodForm';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    taskAmount?: number;
}

const StripePaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    taskAmount
}) => {
    const [paymentCompleted, setPaymentCompleted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPaymentCompleted(false);
        }
    }, [isOpen]);

    const handlePaymentSuccess = () => {
        setPaymentCompleted(true);
        // Wait a moment to show success message before closing
        setTimeout(() => {
            onSuccess();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-[#063A41]">
                            {paymentCompleted ? 'Payment Successful' : 'Enter Payment Details'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {taskAmount && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 mb-1">Task Amount:</p>
                            <p className="text-2xl font-bold text-[#109C3D]">${taskAmount}</p>
                        </div>
                    )}

                    {paymentCompleted ? (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-green-700 font-medium">
                                            Payment Successful!
                                        </p>
                                        <p className="text-sm text-green-600 mt-1">
                                            Your task has been submitted successfully.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#109C3D] mx-auto"></div>
                                <p className="text-sm text-gray-600 mt-2">Redirecting...</p>
                            </div>
                        </div>
                    ) : (
                        <PaymentMethodForm
                            onSuccess={handlePaymentSuccess}
                            onError={(error) => console.error('Payment error:', error)}
                            taskAmount={taskAmount}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StripePaymentModal;