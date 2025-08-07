"use client"
import { useState } from 'react';
import { FaBook, FaQuoteLeft } from 'react-icons/fa';
import AllBookings from './AllBookings'; // Adjust import path as needed
import RequestQuoteByUser from './RequestQuoteByUser'; // Adjust import path as needed

const ViewSelector: React.FC = () => {
    const [activeView, setActiveView] = useState<'bookings' | 'quotes'>('bookings');

    return (
        <div className="mt-10 max-w-7xl mx-auto ">
            {/* Selector Cards */}
            <div className="flex justify-center gap-4 mb-8">
                <div
                    onClick={() => setActiveView('bookings')}
                    className={`relative flex items-center justify-center gap-3 w-48 py-4 px-6 bg-gradient-to-r from-indigo-700 to-blue-600 text-white rounded-xl shadow-[0_8px_24px_rgba(79,70,229,0.4)] transition-all duration-500 cursor-pointer transform perspective-1000 ${activeView === 'bookings' ? 'scale-110 -rotate-y-6' : 'scale-95 opacity-70 hover:scale-100 hover:opacity-90'
                        }`}
                >
                    <FaBook className="text-xl animate-pulse" />
                    <span className="text-base font-bold">Bookings</span>
                    {activeView === 'bookings' && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-ping" />
                    )}
                </div>
                <div
                    onClick={() => setActiveView('quotes')}
                    className={`relative flex items-center justify-center gap-3 w-48 py-4 px-6 bg-gradient-to-r from-indigo-700 to-blue-600 text-white rounded-xl shadow-[0_8px_24px_rgba(79,70,229,0.4)] transition-all duration-500 cursor-pointer transform perspective-1000 ${activeView === 'quotes' ? 'scale-110 rotate-y-6' : 'scale-95 opacity-70 hover:scale-100 hover:opacity-90'
                        }`}
                >
                    <FaQuoteLeft className="text-xl animate-pulse" />
                    <span className="text-base font-bold">Quotes</span>
                    {activeView === 'quotes' && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-ping" />
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative bg-white rounded-2xl     overflow-hidden">
                <div
                    className={`transition-all duration-700 transform ${activeView === 'bookings' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                        }`}
                >
                    {activeView === 'bookings' && (
                        <div className="animate-flip-in">
                            <AllBookings />
                        </div>
                    )}
                </div>
                <div
                    className={`transition-all duration-700 transform ${activeView === 'quotes' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                        }`}
                >
                    {activeView === 'quotes' && (
                        <div className="animate-flip-in">
                            <RequestQuoteByUser />
                        </div>
                    )}
                </div>
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none" />
            </div>

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes flip-in {
          0% { opacity: 0; transform: rotateY(90deg); }
          100% { opacity: 1; transform: rotateY(0deg); }
        }
        .animate-flip-in {
          animation: flip-in 0.7s ease-out;
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-ping {
          animation: ping 1.5s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
        </div>
    );
};

export default ViewSelector;