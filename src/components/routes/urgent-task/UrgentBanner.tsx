/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import HowItWorks from "./HowItWorks";

const UrgentBanner = () => {
    const [clipPath, setClipPath] = useState(
        "polygon(0 0, 100% 0, 100% 210vh, 0 220vh)"
    );
    const [height, setHeight] = useState("120vh");
    const [showOptions, setShowOptions] = useState(false);
    const [option, setOption] = useState<"urgent" | "scheduled" | null>(null);

    useEffect(() => {
        const updateClipPath = () => {
            if (window.innerWidth < 768) {
                setClipPath("polygon(0 0, 100% 0, 100% 190vh, 0 200vh)");
                setHeight("200vh");
            } else {
                setClipPath("polygon(0 0, 100% 0, 100% 210vh, 0 120vh)");
                setHeight("120vh");
            }
        };

        updateClipPath();
        window.addEventListener("resize", updateClipPath);
        return () => window.removeEventListener("resize", updateClipPath);
    }, []);

    const handleToggle = () => {
        setShowOptions(!showOptions);
        setOption(null);
    };

    return (
        <div
            className="w-full bg-[#16161A] relative overflow-hidden"
            style={{ height: height, clipPath: clipPath }}
        >
            {/* Bubble Top Left */}
            <div className="absolute z-10 w-[450px] h-[450px] bg-purple-950 opacity-30 rounded-full top-[-60px] left-[-60px] blur-3xl animate-bubbleFloat"></div>
            {/* Bubble Bottom Right */}
            <div className="absolute z-10 w-[400px] h-[400px] bg-green-950 opacity-30 rounded-full bottom-[-80px] right-[80px] blur-2xl animate-bubbleFloat"></div>

            {/* Content Container */}
            <div className="relative z-20 flex justify-center items-center h-full w-full">
                <div className="flex items-center max-w-6xl mx-auto gap-16 w-full justify-center flex-col lg:flex-row px-4">
                    {/* Left Text */}
                    <div className="text-white max-w-lg">
                        <h1 className="text-6xl font-bold leading-snug">
                            Post an <span className="text-[#FF8906]">URGENT</span>
                            <br />
                            Task            </h1>
                        <p className="text-lg font-semibold mt-3">
                            Your request will be prioritized with our network of professionals for immediate assistance. Urgent tasks typically receive offers within minutes.                        </p>

                    </div>

                    <div>
                        <HowItWorks />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrgentBanner;