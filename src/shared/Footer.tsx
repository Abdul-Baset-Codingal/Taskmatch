import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import background from "../../public/Images/ad.jpg";
// import logo from "../../public/Images/taskalloLogo-removebg-preview.png"
import logo from "../../public/Images/ChatGPT_Image_Dec_10__2025__04_46_12_PM-removebg-preview.png"

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
                    {/* <div className="flex items-center gap-2">
                        <Link href="/">
                            <Image
                                src={logo}
                                alt="TaskAllo Logo"
                                className="w-24 h-auto xs:w-28 sm:w-32 lg:w-36"
                                priority
                            />
                        </Link>
                    </div> */}

                    <div className="flex items-center gap-2"> <Link href="/"> <h1 className="text-2xl xs:text-3xl sm:text-4xl text-white lg:text-3xl font-bold color1 bg-clip-text "> Taskallo </h1> </Link>
                    </div>
                    <p className="text-gray-200 leading-relaxed text-sm mt-3">
                        Taskallo is built to support local communities by connecting Canadians with skilled, reliable service providers. From everyday help to specialized services, we make finding the right help easy and dependable.
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
                        <li><Link href="/contact-us">Contact</Link></li>
                    </ul>
                </div>

                {/* Our Services */}
                <div>
                    <h3 className="text-xl font-semibold text-[#E5FFDB] mb-4">
                        Our Services
                    </h3>
                    <ul className="space-y-2 text-gray-200">
                        <li><Link href={'https://www.taskallo.com/services/688bb7262056a9b591a72862'} >Handyman & Home Repairs</Link></li>
                        <li><Link href={'https://www.taskallo.com/services/688bbdea2056a9b591a7288b'}>Pet Services</Link></li>
                        <li> <Link href={'https://www.taskallo.com/services/688bbe762056a9b591a72892'}>Cleaning Services </Link> </li>
                        <li><Link href={'https://www.taskallo.com/services/688bbf7d2056a9b591a728b1'}> Plumbing, Electric & HVAC </Link></li>
                        <li><Link href={'https://www.taskallo.com/services/688bcb3a2056a9b591a728ba'}> Automotive Services </Link></li>
                        <li><Link href={'https://www.taskallo.com/services/688bce0c2056a9b591a728cc'}> All Other Specialized Services </Link></li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    {/* <h3 className="text-xl font-semibold text-[#E5FFDB] mb-4">
                        Contact
                    </h3> */}
                    <p className="text-gray-200 text-sm mb-3">
                        Toronto, Canada<br />
                        support@taskallo.com<br />
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mt-4">
                        <a href="https://www.facebook.com/profile.php?id=61585575984069" className="p-2 bg-[#109C3D] rounded-full hover:bg-[#E5FFDB] hover:text-[#063A41] transition-all">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.instagram.com/taskallo/" className="p-2 bg-[#109C3D] rounded-full hover:bg-[#E5FFDB] hover:text-[#063A41] transition-all">
                            <FaInstagram />
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
