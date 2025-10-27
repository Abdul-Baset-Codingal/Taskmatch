import React from "react";
import { FaPhoneAlt, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Header = () => {
    return (
        <div className="h-[60px] color2 flex justify-center items-center ">
            <div className="w-full lg:max-w-[1300px] flex justify-between items-center text-white text-sm  px-6">

                {/* Left Side - Phone & Email */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <FaPhoneAlt className="text3" />
                        <span className="text3">+880 1234-567890</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdEmail className="text3 text-lg" />
                        <span className="text3">info@taskAllo.com</span>
                    </div>
                </div>

                {/* Right Side - Social Media */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text2 p-2 rounded-full hover:bg-color2 hover:text-white transition"
                    >
                        <FaLinkedinIn size={14} />
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text2 p-2 rounded-full hover:bg-color2 hover:text-white transition"
                    >
                        <FaFacebookF size={14} />
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text2 p-2 rounded-full hover:bg-color2 hover:text-white transition"
                    >
                        <FaTwitter size={14} />
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Header;
