import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';

// SEO Metadata
export const metadata: Metadata = {
    title: 'Handyman in Toronto | Home Repairs & Maintenance Services | Taskallo',
    description: 'Find trusted handyman services in Toronto. Furniture assembly, painting, drywall repair, flooring installation, small renovations, and general home repairs. Get quotes from verified professionals.',
    keywords: [
        'handyman Toronto',
        'Toronto handyman services',
        'home repairs Toronto',
        'furniture assembly Toronto',
        'drywall repair Toronto',
        'painting services Toronto',
        'flooring installation Toronto',
        'home maintenance Toronto',
        'handyman near me Toronto',
        'small renovations Toronto'
    ],
    openGraph: {
        title: 'Handyman in Toronto | Home Repairs & Maintenance Services | Taskallo',
        description: 'Find trusted handyman services in Toronto. Furniture assembly, painting, drywall repair, and more.',
        url: 'https://www.taskallo.com/toronto/handyman',
        type: 'website',
        siteName: 'Taskallo',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Handyman in Toronto - Taskallo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Handyman in Toronto | Home Repairs & Maintenance Services | Taskallo',
        description: 'Find trusted handyman services in Toronto. Furniture assembly, painting, drywall repair, and more.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: '/toronto/handyman',
    },
    robots: {
        index: true,
        follow: true,
    },
};

// Structured Data for Local Business
const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Handyman & Home Repair Services in Toronto",
    "description": "Professional handyman services in Toronto including furniture assembly, painting, drywall repair, flooring installation, small renovations, and general home maintenance.",
    "provider": {
        "@type": "Organization",
        "name": "Taskallo",
        "url": "https://www.taskallo.com"
    },
    "areaServed": {
        "@type": "City",
        "name": "Toronto",
        "addressRegion": "ON",
        "addressCountry": "CA"
    },
    "serviceType": "Handyman Services"
};

export default function TorontoHandymanPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <main className="flex-1">

                {/* Hero Section */}
                <section className="bg-gradient-to-br from-[#063A41] to-[#0a4f59] text-white py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl">
                            <p className="text-[#E5FFDB] font-medium mb-4">
                                Professional Home Repair Services in Toronto
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Handyman in Toronto
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                                Find skilled, reliable handymen for all your home repair and
                                maintenance needs across the Greater Toronto Area. From small
                                fixes to complete renovations.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/services/688bb7262056a9b591a72862"
                                    className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all text-center"
                                >
                                    Find a Handyman 
                                </Link>
                                <Link
                                    href="/browse-tasks"
                                    className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-white/20 text-center"
                                >
                                    Browse Available Tasks
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                Handyman Services in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our network of verified handymen provides comprehensive home repair
                                and maintenance services for residential and commercial properties.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Service 1 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">01</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Furniture Assembly
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional assembly of flat-pack furniture from IKEA, Wayfair,
                                    Amazon, and other retailers. Save time and avoid frustration.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>IKEA furniture assembly</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Office furniture setup</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Bed frame and mattress setup</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 2 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">02</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Painting Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Interior and exterior painting services for homes and businesses.
                                    Professional results with quality materials and clean finishes.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Interior wall painting</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Ceiling painting</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Trim and door painting</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 3 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">03</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Drywall Repair
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Expert drywall repair and patching services. Fix holes, cracks,
                                    and water damage with seamless, professional results.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Hole patching and repair</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Crack repair</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Water damage restoration</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 4 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">04</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Flooring Installation
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional flooring installation and repair services.
                                    Hardwood, laminate, vinyl, and tile flooring solutions.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Hardwood floor installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Laminate flooring</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Vinyl plank installation</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 5 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">05</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Small Renovations
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Transform your space with small renovation projects.
                                    Bathroom updates, kitchen improvements, and room makeovers.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Bathroom updates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Kitchen backsplash installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Basement finishing</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 6 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">06</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    General Repairs
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    All-around home repair services for those everyday fixes.
                                    Door repairs, shelving, caulking, and miscellaneous tasks.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Door and window repairs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Shelf and cabinet installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Caulking and sealing</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 7 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">07</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    TV and Mirror Mounting
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Secure mounting of TVs, mirrors, artwork, and shelving units.
                                    Proper installation with wall type consideration.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>TV wall mounting</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Mirror hanging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Art and picture hanging</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 8 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">08</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Moving and Heavy Lifting
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Assistance with moving furniture, appliances, and heavy items.
                                    Rearranging rooms and loading/unloading help.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Furniture moving</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Appliance relocation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Loading and unloading</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 9 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">09</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Deck and Fence Repair
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Outdoor repair services for decks, fences, and patios.
                                    Restore and maintain your outdoor living spaces.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Deck board replacement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Fence panel repair</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Deck staining and sealing</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                Why Choose Toronto Handymen on Taskallo
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We connect you with verified, skilled handymen who deliver
                                quality workmanship on every project.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">V</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Verified Professionals
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Every handyman is background-checked and verified for
                                    skills and experience before joining our platform.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">F</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Fair Pricing
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Get competitive quotes from multiple handymen. Compare
                                    prices and choose the best value for your project.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">Q</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Quality Guaranteed
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Our handymen take pride in their work and stand behind
                                    the quality of every repair and installation.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">R</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Real Reviews
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Read authentic reviews from Toronto homeowners to find
                                    the right handyman for your specific needs.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                How to Hire a Handyman in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Finding reliable handyman help is simple and straightforward with Taskallo.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    1
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Describe Your Task
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Tell us what needs to be done. Include details about the
                                    project, materials needed, and your preferred timeline.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    2
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Get Free Quotes
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Qualified Toronto handymen will review your task and
                                    submit competitive quotes for the work.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Select Your Handyman
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Review profiles, compare quotes, and read reviews to
                                    choose the best handyman for your project.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    4
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Task Completed
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Your handyman arrives and completes the work. Review
                                    the results and leave feedback for future customers.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/services/688bb7262056a9b591a72862"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Post Your Handyman Task Now
                            </Link>
                        </div>
                    </div>
                </section>

          

                {/* Service Areas Section */}
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                Areas We Serve in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our handymen provide services throughout the Greater Toronto Area.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Downtown Toronto</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">North York</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Scarborough</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Etobicoke</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">East York</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">York</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Midtown</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">The Beaches</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">High Park</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Yorkville</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">The Annex</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Leslieville</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-gray-600">
                                Common questions about handyman services in Toronto.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How much does a handyman charge in Toronto?
                                </h3>
                                <p className="text-gray-600">
                                    Handyman rates in Toronto typically range from $50 to $100 per hour,
                                    depending on the type of work and experience level. Many tasks are
                                    quoted as flat-rate projects. Post your task on Taskallo to get
                                    accurate quotes from multiple handymen.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What tasks can a handyman do?
                                </h3>
                                <p className="text-gray-600">
                                    Handymen can handle a wide variety of home repairs and improvements
                                    including furniture assembly, painting, drywall repair, flooring,
                                    TV mounting, minor carpentry, caulking, fixture installation, and
                                    general maintenance. For specialized work like electrical or plumbing,
                                    licensed tradespeople are recommended.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How quickly can I get a handyman in Toronto?
                                </h3>
                                <p className="text-gray-600">
                                    Many handymen on Taskallo offer same-day or next-day availability
                                    for urgent tasks. For scheduled projects, you can typically book
                                    within 2-3 days. Post your task with your preferred timeline and
                                    receive quotes from available handymen.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Do I need to provide tools and materials?
                                </h3>
                                <p className="text-gray-600">
                                    Most handymen bring their own tools for standard tasks. Materials
                                    like paint, flooring, or fixtures are typically purchased by the
                                    homeowner or can be picked up by the handyman for an additional
                                    fee. Clarify material arrangements when reviewing quotes.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Are Taskallo handymen insured?
                                </h3>
                                <p className="text-gray-600">
                                    We encourage all handymen on our platform to carry liability
                                    insurance. You can ask about insurance coverage when communicating
                                    with potential handymen before hiring. This protects both you and
                                    the service provider during the project.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-[#063A41] to-[#0a4f59]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Need a Handyman in Toronto?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8">
                            Get free quotes from skilled handymen for your home repair project.
                            No obligation, no hidden fees.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/services/688bb7262056a9b591a72862"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Post Your Task Now
                            </Link>
                            <Link
                                href="/contact-us"
                                className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-white/20"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}