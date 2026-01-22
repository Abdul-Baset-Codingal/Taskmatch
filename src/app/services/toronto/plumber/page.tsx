import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';

// SEO Metadata
export const metadata: Metadata = {
    title: 'Plumber in Toronto | Licensed Plumbing Services | Taskallo',
    description: 'Find trusted licensed plumbers in Toronto. Emergency repairs, installations, drain cleaning, water heater services. Get quotes from verified Toronto plumbing professionals.',
    keywords: [
        'plumber Toronto',
        'Toronto plumbing services',
        'emergency plumber Toronto',
        'licensed plumber Toronto',
        'drain cleaning Toronto',
        'water heater repair Toronto',
        'pipe repair Toronto',
        'Toronto plumber near me'
    ],
    openGraph: {
        title: 'Plumber in Toronto | Licensed Plumbing Services | Taskallo',
        description: 'Find trusted licensed plumbers in Toronto. Emergency repairs, installations, drain cleaning, and water heater services.',
        url: 'https://www.taskallo.com/toronto/plumber',
        type: 'website',
        siteName: 'Taskallo',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Plumber in Toronto - Taskallo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Plumber in Toronto | Licensed Plumbing Services | Taskallo',
        description: 'Find trusted licensed plumbers in Toronto. Emergency repairs, installations, and more.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: '/toronto/plumber',
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
    "name": "Plumbing Services in Toronto",
    "description": "Professional plumbing services in Toronto including emergency repairs, drain cleaning, water heater services, and pipe installation.",
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
    "serviceType": "Plumbing"
};

export default function TorontoPlumberPage() {
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
                                Trusted Plumbing Professionals in Toronto
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Plumber in Toronto
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                                Find licensed, insured, and verified plumbers for all your residential
                                and commercial plumbing needs across the Greater Toronto Area.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/services/688bbf7d2056a9b591a728b1"
                                    className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all text-center"
                                >
                                    Find a Plumber
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
                                Plumbing Services in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our network of verified plumbers provides comprehensive plumbing
                                services for homes and businesses throughout Toronto.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Service 1 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">01</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Emergency Plumbing Repairs
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    24/7 emergency plumbing services for burst pipes, severe leaks,
                                    flooding, and other urgent plumbing issues in Toronto.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Burst pipe repair</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Flood damage response</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Gas leak detection</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 2 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">02</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Drain Cleaning Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional drain cleaning and unclogging services using
                                    advanced equipment to restore proper drainage.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Kitchen drain cleaning</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Bathroom drain unclogging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Main sewer line cleaning</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 3 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">03</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Water Heater Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Installation, repair, and maintenance of tank and tankless
                                    water heaters from all major brands.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Water heater installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Tankless heater repair</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Annual maintenance</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 4 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">04</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Pipe Installation and Repair
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Complete pipe services including new installations, repairs,
                                    and repiping for residential and commercial properties.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Copper pipe installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>PEX repiping</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Leak detection and repair</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 5 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">05</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Fixture Installation
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional installation of toilets, sinks, faucets, showers,
                                    bathtubs, and other plumbing fixtures.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Toilet installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Faucet replacement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Shower installation</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 6 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">06</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Sewer Line Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Comprehensive sewer line inspection, cleaning, repair, and
                                    replacement services for Toronto properties.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Video camera inspection</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Sewer line repair</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Trenchless replacement</span>
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
                                Why Choose Toronto Plumbers on Taskallo
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We connect you with verified, professional plumbers who meet
                                our strict quality standards.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">L</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Licensed Professionals
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    All plumbers are licensed and certified to work in Ontario,
                                    ensuring compliance with local codes.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">I</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Fully Insured
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Every plumber carries liability insurance to protect your
                                    property during service.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">T</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Transparent Pricing
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Get upfront quotes with no hidden fees. Compare prices from
                                    multiple plumbers before booking.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">R</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Verified Reviews
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Read authentic reviews from real customers to make informed
                                    decisions about your plumber.
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
                                How to Book a Plumber in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Getting professional plumbing help is simple with Taskallo.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    1
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Post Your Task
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Describe your plumbing issue, location, and preferred timing.
                                    Be as detailed as possible for accurate quotes.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    2
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Receive Quotes
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Licensed Toronto plumbers will review your task and submit
                                    competitive quotes for the work.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Choose Your Plumber
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Compare quotes, read reviews, and select the plumber that
                                    best fits your needs and budget.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    4
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Job Completed
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Your plumber completes the work to your satisfaction.
                                    Leave a review to help others find great service.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/services/688bbf7d2056a9b591a728b1"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Post Your Plumbing Task Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Service Areas Section */}
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                Areas We Serve in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our plumbers provide services throughout the Greater Toronto Area.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Downtown Toronto</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">North York</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Scarborough</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Etobicoke</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">East York</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">York</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Midtown</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">The Beaches</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">High Park</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Yorkville</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">The Annex</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Leslieville</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-gray-600">
                                Common questions about plumbing services in Toronto.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How much does a plumber cost in Toronto?
                                </h3>
                                <p className="text-gray-600">
                                    Plumbing costs in Toronto vary depending on the service.
                                    Simple repairs may start at $100-$200, while larger projects
                                    like water heater installation can range from $500-$2000.
                                    Get free quotes from multiple plumbers on Taskallo to compare prices.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Do I need a licensed plumber in Ontario?
                                </h3>
                                <p className="text-gray-600">
                                    Yes, plumbing work in Ontario must be performed by licensed
                                    plumbers to ensure safety and code compliance. All plumbers
                                    on Taskallo are verified and licensed to work in Ontario.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How quickly can I get a plumber in Toronto?
                                </h3>
                                <p className="text-gray-600">
                                    For emergency plumbing issues, many Toronto plumbers on
                                    Taskallo offer same-day service. For non-urgent repairs,
                                    you can typically schedule within 1-3 days depending on availability.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What should I do in a plumbing emergency?
                                </h3>
                                <p className="text-gray-600">
                                    First, shut off the water supply to prevent further damage.
                                    Then post an urgent task on Taskallo describing the emergency.
                                    Our plumbers monitor for emergency requests and can respond quickly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-[#063A41] to-[#0a4f59]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Need a Plumber in Toronto?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8">
                            Get free quotes from licensed plumbing professionals today.
                            No obligation, no hidden fees.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/services/688bbf7d2056a9b591a728b1"
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