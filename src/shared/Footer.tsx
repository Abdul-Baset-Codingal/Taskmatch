import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import background from "../../public/Images/ad.jpg";

export default function Footer() {
    return (
        <footer className="relative text-white py-16 mt-20">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={background}
                    alt="Footer background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-[#063A41]/90"></div>
            </div>

            {/* Content */}
            <div className="relative max-w-[1300px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 z-10">
                {/* Logo & About */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Link href="/">
                            <h1 className="text-3xl font-bold text-white">
                                TaskAllo
                            </h1>
                        </Link>
                        <span className="w-2 h-2 rounded-full bg-[#109C3D] relative top-3 inline-block"></span>
                    </div>
                    <p className="text-gray-200 leading-relaxed text-sm">
                        TaskAllo is Canada’s trusted platform for home services — connecting
                        clients with professional Taskers for everything from plumbing to
                        beauty & wellness.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold text-[#E5FFDB] mb-4">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 text-gray-200">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/our-story">About Us</Link></li>
                        <li><Link href="/services">Services</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>

                {/* Our Services */}
                <div>
                    <h3 className="text-xl font-semibold text-[#E5FFDB] mb-4">
                        Our Services
                    </h3>
                    <ul className="space-y-2 text-gray-200">
                        <li>Handyman</li>
                        <li>Renovation & Moving Help</li>
                        <li>Plumbing, Electrical & HVAC</li>
                        <li>Beauty & Wellness</li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h3 className="text-xl font-semibold text-[#E5FFDB] mb-4">
                        Contact
                    </h3>
                    <p className="text-gray-200 text-sm mb-3">
                        Toronto, Canada<br />
                        info@taskallo.ca<br />
                        +1 (647) 123-4567
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-4">
                        <a href="#" className="p-2 bg-[#109C3D] rounded-full hover:bg-[#E5FFDB] hover:text-[#063A41] transition-all">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="p-2 bg-[#109C3D] rounded-full hover:bg-[#E5FFDB] hover:text-[#063A41] transition-all">
                            <FaInstagram />
                        </a>
                        <a href="#" className="p-2 bg-[#109C3D] rounded-full hover:bg-[#E5FFDB] hover:text-[#063A41] transition-all">
                            <FaTwitter />
                        </a>
                        <a href="#" className="p-2 bg-[#109C3D] rounded-full hover:bg-[#E5FFDB] hover:text-[#063A41] transition-all">
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="relative text-center text-gray-300 text-sm mt-12 border-t border-white/20 pt-6">
                © {new Date().getFullYear()} TaskAllo. All rights reserved.
            </div>
        </footer>
    );
}
