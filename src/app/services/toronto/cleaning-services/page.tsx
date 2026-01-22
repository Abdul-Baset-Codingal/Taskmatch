import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';

// SEO Metadata
export const metadata: Metadata = {
    title: 'Cleaning Services in Toronto | House Cleaning & Deep Cleaning | Taskallo',
    description: 'Find trusted cleaning professionals in Toronto. House cleaning, deep cleaning, move-in/move-out cleaning, office cleaning, and post-renovation cleanup. Get quotes from verified cleaners.',
    keywords: [
        'cleaning services Toronto',
        'house cleaning Toronto',
        'deep cleaning Toronto',
        'move-in cleaning Toronto',
        'move-out cleaning Toronto',
        'office cleaning Toronto',
        'residential cleaning Toronto',
        'home cleaning Toronto',
        'professional cleaners Toronto',
        'maid service Toronto',
        'cleaning lady Toronto',
        'post-renovation cleaning Toronto'
    ],
    openGraph: {
        title: 'Cleaning Services in Toronto | House Cleaning & Deep Cleaning | Taskallo',
        description: 'Find trusted cleaning professionals in Toronto. House cleaning, deep cleaning, move-in/move-out cleaning, and more.',
        url: 'https://www.taskallo.com/toronto/cleaning-services',
        type: 'website',
        siteName: 'Taskallo',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Cleaning Services in Toronto - Taskallo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cleaning Services in Toronto | House Cleaning & Deep Cleaning | Taskallo',
        description: 'Find trusted cleaning professionals in Toronto. House cleaning, deep cleaning, move-in/move-out cleaning, and more.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: '/toronto/cleaning-services',
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
    "name": "Cleaning Services in Toronto",
    "description": "Professional cleaning services in Toronto including house cleaning, deep cleaning, move-in/move-out cleaning, office cleaning, and post-renovation cleanup from verified cleaning professionals.",
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
    "serviceType": "Cleaning Services"
};

export default function TorontoCleaningServicesPage() {
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
                                Professional Cleaning Services in Toronto
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Cleaning Services in Toronto
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                                Find trusted, professional cleaners for your home or office.
                                From regular house cleaning to deep cleaning and move-in/move-out
                                services across the Greater Toronto Area.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/services/688bbe762056a9b591a72892"
                                    className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all text-center"
                                >
                                    Book a Cleaner
                                </Link>
                                <Link
                                    href="/browse-tasks"
                                    className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-white/20 text-center"
                                >
                                    Browse Cleaning Tasks
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
                                Cleaning Services We Offer in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our network of verified cleaning professionals provides
                                comprehensive cleaning services for homes, apartments,
                                condos, and commercial spaces throughout Toronto.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Service 1 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">01</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Standard House Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Regular cleaning services to maintain a clean and tidy home.
                                    Perfect for weekly, bi-weekly, or monthly maintenance cleaning.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Dusting and surface wiping</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Vacuuming and mopping floors</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Kitchen and bathroom cleaning</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 2 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">02</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Deep Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Thorough, top-to-bottom cleaning that reaches every corner.
                                    Ideal for seasonal cleaning or first-time service.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Inside cabinets and appliances</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Behind and under furniture</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Baseboards, vents, and light fixtures</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 3 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">03</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Move-In Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Start fresh in your new home with a comprehensive cleaning
                                    before you move in. Spotless results guaranteed.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Complete sanitization</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>All cabinets and closets cleaned</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Appliance interior cleaning</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 4 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">04</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Move-Out Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Leave your old place spotless for the next tenant or to
                                    get your deposit back. Landlord-approved results.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Wall spot cleaning</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Full appliance cleaning</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Deposit-back guarantee</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 5 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">05</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Office Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional cleaning for offices, retail spaces, and
                                    commercial properties. Create a clean, healthy workspace.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Desk and workstation cleaning</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Common area maintenance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Restroom sanitization</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 6 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">06</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Post-Renovation Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Remove construction dust, debris, and residue after
                                    renovations or remodeling. Specialized cleaning required.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Construction dust removal</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Paint splatter cleanup</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Window and fixture cleaning</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 7 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">07</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Carpet Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional carpet and rug cleaning to remove stains,
                                    odors, and allergens. Extend the life of your carpets.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Steam cleaning</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Stain and spot treatment</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Deodorizing treatment</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 8 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">08</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Window Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Crystal-clear windows inside and out. Professional
                                    equipment for streak-free results at any height.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Interior and exterior glass</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Window frame and sill cleaning</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Screen cleaning</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 9 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">09</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Airbnb and Rental Cleaning
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Quick turnaround cleaning between guests for Airbnb
                                    hosts and rental property managers. Keep your ratings high.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Linen and towel changes</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Restocking amenities</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Same-day turnaround available</span>
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
                                Why Choose Toronto Cleaners on Taskallo
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We connect you with verified, professional cleaners who
                                deliver spotless results every time.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">V</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Vetted Professionals
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Every cleaner is background-checked and verified for
                                    experience and professionalism before joining our platform.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">S</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Satisfaction Guaranteed
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Our cleaners take pride in their work and ensure you
                                    are completely satisfied with every cleaning service.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">F</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Flexible Scheduling
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Book cleaning services when it suits you. Same-day,
                                    weekends, and recurring appointments available.
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
                                    Get upfront quotes with no hidden fees. Compare prices
                                    from multiple cleaners before booking.
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
                                How to Book Cleaning Services in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Getting your home or office professionally cleaned is simple with Taskallo.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    1
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Describe Your Space
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Tell us about your space, the type of cleaning needed,
                                    and any specific areas requiring attention.
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
                                    Professional Toronto cleaners will review your request
                                    and submit competitive quotes for the job.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Choose Your Cleaner
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Compare profiles, read reviews, and select the cleaner
                                    that best fits your needs and budget.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    4
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Enjoy a Clean Space
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Your cleaner arrives and transforms your space.
                                    Leave a review to help other Toronto residents.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/services/688bbe762056a9b591a72892"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Book Cleaning Services Now
                            </Link>
                        </div>
                    </div>
                </section>

            

                {/* Cleaning Checklist Section */}
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                What Our Cleaning Services Include
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                A breakdown of what is typically included in standard and deep cleaning services.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Standard Cleaning */}
                            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                                <h3 className="text-xl font-bold text-[#063A41] mb-6">Standard Cleaning</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-[#063A41] mb-3">Kitchen</h4>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Wipe down countertops and backsplash</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean exterior of appliances</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean and sanitize sink</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Mop floors</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-[#063A41] mb-3">Bathroom</h4>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean and sanitize toilet</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean shower/bathtub</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean sink and mirror</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Mop floors</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-[#063A41] mb-3">Living Areas and Bedrooms</h4>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Dust all surfaces</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Vacuum carpets and rugs</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Mop hard floors</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Empty trash bins</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Deep Cleaning */}
                            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                                <h3 className="text-xl font-bold text-[#063A41] mb-6">Deep Cleaning (Includes All Standard Plus)</h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-[#063A41] mb-3">Kitchen</h4>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean inside oven and microwave</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean inside refrigerator</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean inside cabinets</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Degrease range hood and stovetop</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-[#063A41] mb-3">Bathroom</h4>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Scrub grout and tile</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Descale faucets and showerhead</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean inside cabinets</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean exhaust fan</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-[#063A41] mb-3">Throughout Home</h4>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean baseboards</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean door frames and handles</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean light switches and fixtures</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-[#109C3D] mt-1">—</span>
                                                <span>Clean behind and under furniture</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
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
                                Our cleaning professionals provide services throughout the Greater Toronto Area.
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
                                <p className="font-medium text-[#063A41]">Liberty Village</p>
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
                                Common questions about cleaning services in Toronto.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How much does house cleaning cost in Toronto?
                                </h3>
                                <p className="text-gray-600">
                                    Standard house cleaning in Toronto typically costs between $80 and
                                    $220 depending on the size of your home. A 1-bedroom apartment usually
                                    costs $80-$120, while a 3-bedroom house ranges from $150-$220.
                                    Deep cleaning and move-in/move-out services cost more. Post your
                                    specific needs on Taskallo to get accurate quotes.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What is the difference between standard and deep cleaning?
                                </h3>
                                <p className="text-gray-600">
                                    Standard cleaning covers regular maintenance tasks like dusting,
                                    vacuuming, mopping, and surface cleaning of kitchens and bathrooms.
                                    Deep cleaning is more thorough and includes cleaning inside appliances,
                                    cabinets, baseboards, behind furniture, and other areas not covered
                                    in regular cleaning. Deep cleaning is recommended for first-time
                                    service or seasonal cleaning.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Do I need to provide cleaning supplies?
                                </h3>
                                <p className="text-gray-600">
                                    Most professional cleaners bring their own supplies and equipment.
                                    If you prefer specific products to be used (for allergies, eco-friendly
                                    preferences, or pet safety), discuss this when booking. Some cleaners
                                    may offer a slight discount if you provide supplies.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How long does a typical cleaning take?
                                </h3>
                                <p className="text-gray-600">
                                    A standard cleaning typically takes 2-4 hours depending on the
                                    size and condition of your home. A 1-bedroom apartment usually
                                    takes 2-2.5 hours, while a 3-bedroom house takes 3-4 hours.
                                    Deep cleaning takes approximately 50-100% longer than standard cleaning.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Do I need to be home during the cleaning?
                                </h3>
                                <p className="text-gray-600">
                                    It is up to you. Many clients provide access instructions and
                                    are not home during cleaning. You can give entry codes, leave a
                                    key, or use a lockbox. If you prefer to be present, especially
                                    for first-time service, that is perfectly fine as well.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Can I book recurring cleaning services?
                                </h3>
                                <p className="text-gray-600">
                                    Yes, many clients book weekly, bi-weekly, or monthly recurring
                                    cleaning services. After finding a cleaner you like on Taskallo,
                                    you can arrange a regular schedule directly with them. Recurring
                                    clients often receive discounted rates.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-[#063A41] to-[#0a4f59]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Need Cleaning Services in Toronto?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8">
                            Get free quotes from professional cleaners in your area.
                            Spotless results, transparent pricing, no hassle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/services/688bbe762056a9b591a72892"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Book a Cleaner Now
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