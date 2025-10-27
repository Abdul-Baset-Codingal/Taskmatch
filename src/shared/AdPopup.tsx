"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import ad from "../../public/Images/taskMatch works.jpg";
import Link from "next/link";

export default function AdPopup() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const hasSeenAd = sessionStorage.getItem("hasSeenAd");
        if (hasSeenAd) {  // Show ONLY on first visit
            setTimeout(() => setShow(true), 800);
            sessionStorage.setItem("hasSeenAd", "true");
        }
    }, []);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[9999] backdrop-blur-sm p-3">
            <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden transition-all duration-500 animate-fade-in ">
                {/* Close Button */}
                <button
                    onClick={() => setShow(false)}
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-900 rounded-full p-2 shadow-md transition-all duration-200 z-50"
                >
                    <X size={22} />
                </button>

                {/* Ad Image */}
                <div className="relative">
                    <Image
                        src={ad}
                        alt="Ad Banner"
                        width={1200}
                        height={800}
                        className="w-full h-[60vh] sm:h-[60vh] object-cover"
                        priority
                    />

                    {/* Colored Overlay */}
                    <div className="absolute inset-0 bg-[#063A41]/90 mix-blend-multiply"></div>

                    {/* Logo */}
                    <div className="absolute top-4 left-5 flex items-center gap-2 z-20">
                        <Link href="/" className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                TaskAllo
                            </h1>
                            <span className="w-2 h-2 rounded-full bg-[#00ff88] inline-block relative top-[2px]" />
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center items-start text-white px-6 sm:px-10 md:px-16 py-6 sm:py-10 space-y-3 sm:space-y-5">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-snug drop-shadow-lg text-white">
                            Get $10 off Your First Task!
                        </h2>

                        <p className="text-base sm:text-lg md:text-2xl max-w-md sm:max-w-xl leading-relaxed text-gray-100">
                            Sign up today for your instant{" "}
                            <span className="text-[#00ff88] font-semibold">ATS credit</span> on any booking over $100.
                        </p>

                        <button className="mt-3 bg-[#00b35f] hover:bg-[#009e52] text-white font-semibold text-base sm:text-lg px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-[0_0_30px_5px_rgba(0,255,136,0.4)] transition-all duration-300">
                            Sign Up Now
                        </button>

                        <p className="text-xs sm:text-sm text-gray-200 italic">
                            *Offer valid only for new users.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
