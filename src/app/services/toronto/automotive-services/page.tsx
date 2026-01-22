import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';

// SEO Metadata
export const metadata: Metadata = {
    title: 'Automotive Services in Toronto | Car Repair & Mechanics | Taskallo',
    description: 'Find trusted mechanics and automotive professionals in Toronto. Oil changes, brake repair, tire services, engine diagnostics, car maintenance, and emergency roadside assistance. Get quotes from verified auto technicians.',
    keywords: [
        'automotive services Toronto',
        'car repair Toronto',
        'mechanic Toronto',
        'auto repair Toronto',
        'oil change Toronto',
        'brake repair Toronto',
        'tire service Toronto',
        'car maintenance Toronto',
        'engine repair Toronto',
        'auto mechanic near me Toronto',
        'mobile mechanic Toronto',
        'car inspection Toronto',
        'transmission repair Toronto',
        'auto body repair Toronto'
    ],
    openGraph: {
        title: 'Automotive Services in Toronto | Car Repair & Mechanics | Taskallo',
        description: 'Find trusted mechanics and automotive professionals in Toronto. Oil changes, brake repair, tire services, and more.',
        url: 'https://www.taskallo.com/toronto/automotive-services',
        type: 'website',
        siteName: 'Taskallo',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Automotive Services in Toronto - Taskallo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Automotive Services in Toronto | Car Repair & Mechanics | Taskallo',
        description: 'Find trusted mechanics and automotive professionals in Toronto. Oil changes, brake repair, tire services, and more.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: '/toronto/automotive-services',
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
    "name": "Automotive Services in Toronto",
    "description": "Professional automotive services in Toronto including oil changes, brake repair, tire services, engine diagnostics, car maintenance, and emergency roadside assistance from verified mechanics and auto technicians.",
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
    "serviceType": "Automotive Services"
};

export default function TorontoAutomotiveServicesPage() {
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
                                Trusted Auto Repair Professionals in Toronto
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Automotive Services in Toronto
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                                Find reliable mechanics and automotive technicians for all your
                                vehicle needs. From routine maintenance to major repairs, connect
                                with verified auto professionals across the Greater Toronto Area.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/services/688bcb3a2056a9b591a728ba"
                                    className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all text-center"
                                >
                                    Find a Mechanic
                                </Link>
                                <Link
                                    href="/browse-tasks"
                                    className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-white/20 text-center"
                                >
                                    Browse Auto Tasks
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
                                Automotive Services We Offer in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our network of verified mechanics and automotive professionals
                                provides comprehensive services for all makes and models
                                throughout the Greater Toronto Area.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Service 1 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">01</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Oil Change Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Regular oil changes to keep your engine running smoothly.
                                    Conventional, synthetic, and high-mileage oil options available.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Conventional oil change</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Synthetic oil change</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Oil filter replacement</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 2 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">02</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Brake Repair and Service
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Complete brake system inspection, repair, and replacement.
                                    Keep your vehicle safe with properly functioning brakes.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Brake pad replacement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Brake rotor resurfacing or replacement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Brake fluid flush</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 3 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">03</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Tire Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Full tire services including installation, rotation, balancing,
                                    and seasonal tire changes for year-round safety.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Tire installation and mounting</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Tire rotation and balancing</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Winter and summer tire swaps</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 4 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">04</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Engine Diagnostics
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Advanced computer diagnostics to identify engine problems,
                                    check engine light issues, and performance concerns.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Check engine light diagnosis</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>OBD-II code reading</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Performance diagnostics</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 5 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">05</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Battery Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Battery testing, charging, and replacement services.
                                    Avoid being stranded with a dead battery.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Battery testing and inspection</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Battery replacement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Terminal cleaning and maintenance</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 6 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">06</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Transmission Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Transmission maintenance, fluid changes, and repairs
                                    for automatic and manual transmissions.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Transmission fluid change</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Transmission flush</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Clutch repair and replacement</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 7 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">07</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Suspension and Steering
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Suspension and steering system repairs to ensure
                                    a smooth, safe ride and proper handling.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Shock and strut replacement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Wheel alignment</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Power steering repair</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 8 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">08</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Exhaust System Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Exhaust system inspection, repair, and replacement
                                    including mufflers, catalytic converters, and pipes.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Muffler repair and replacement</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Catalytic converter service</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Exhaust leak repair</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 9 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">09</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Heating and Cooling
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Automotive HVAC services to keep you comfortable
                                    in your vehicle year-round.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>AC recharge and repair</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Heater core repair</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Radiator service</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 10 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">10</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Pre-Purchase Inspection
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Comprehensive vehicle inspection before buying a used car.
                                    Make an informed purchase decision.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Full mechanical inspection</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Test drive evaluation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Written inspection report</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 11 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">11</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Mobile Mechanic Services
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Mechanics who come to you. Convenient service at your
                                    home, office, or roadside location.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>On-site repairs and maintenance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Emergency roadside assistance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Fleet service for businesses</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 12 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">12</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Safety Inspection
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Ontario safety standards certificate inspection
                                    required for vehicle ownership transfer.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Safety standards certificate</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Emissions testing (e-test)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>MTO compliance inspection</span>
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
                                Why Choose Toronto Mechanics on Taskallo
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We connect you with verified, experienced automotive professionals
                                who deliver honest, quality service.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">C</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Certified Mechanics
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Our mechanics are certified and experienced with all
                                    makes and models including domestic and import vehicles.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">H</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Honest Pricing
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Get upfront quotes with no hidden fees or surprise charges.
                                    Know exactly what you will pay before work begins.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">Q</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Quality Parts
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Our mechanics use quality OEM and aftermarket parts
                                    backed by manufacturer warranties.
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
                                    Read authentic reviews from Toronto vehicle owners
                                    to find a mechanic you can trust.
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
                                How to Find a Mechanic in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Getting your vehicle serviced by a trusted professional is simple with Taskallo.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    1
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Describe the Issue
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Tell us about your vehicle, the problem or service needed,
                                    and your location. Include make, model, and year.
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
                                    Qualified Toronto mechanics will review your request
                                    and submit competitive quotes for the work.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Choose Your Mechanic
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Compare profiles, specializations, reviews, and prices
                                    to select the best mechanic for your needs.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    4
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Get Back on the Road
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Your mechanic completes the repair or service.
                                    Leave a review to help other vehicle owners.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/services/688bcb3a2056a9b591a728ba"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Find a Mechanic Now
                            </Link>
                        </div>
                    </div>
                </section>

              

                {/* Vehicle Types Section */}
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                We Service All Vehicle Makes and Models
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our mechanics have experience with domestic, import, and luxury vehicles.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Toyota</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Honda</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Ford</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Chevrolet</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Hyundai</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Kia</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Nissan</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Mazda</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Subaru</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Volkswagen</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">BMW</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Mercedes-Benz</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Audi</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Lexus</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Acura</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Jeep</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">RAM</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">GMC</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Dodge</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Chrysler</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Infiniti</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Volvo</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Tesla</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Other Makes</p>
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
                                Our automotive professionals provide services throughout the Greater Toronto Area.
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
                                <p className="font-medium text-[#063A41]">Markham</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Richmond Hill</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Vaughan</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Mississauga</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Brampton</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Pickering</p>
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
                                Common questions about automotive services in Toronto.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How much does a mechanic charge per hour in Toronto?
                                </h3>
                                <p className="text-gray-600">
                                    Mechanic labor rates in Toronto typically range from $80 to $150 per
                                    hour depending on the shop type and specialization. Dealerships tend
                                    to charge more than independent mechanics. Many common services are
                                    quoted at flat rates. Post your specific needs on Taskallo to get
                                    accurate quotes from multiple mechanics.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How do I know if a mechanic is trustworthy?
                                </h3>
                                <p className="text-gray-600">
                                    Look for mechanics with good reviews from real customers, proper
                                    certifications, and transparent pricing. On Taskallo, you can read
                                    reviews from other Toronto vehicle owners, see the mechanic's
                                    experience and specializations, and communicate directly before
                                    booking to ask questions.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Can a mobile mechanic fix my car at home?
                                </h3>
                                <p className="text-gray-600">
                                    Many repairs can be done at your home or office by a mobile mechanic.
                                    Common mobile services include oil changes, brake pad replacement,
                                    battery replacement, diagnostics, and minor repairs. More complex
                                    repairs requiring lifts or specialized equipment may need to be done
                                    at a shop.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What is included in a safety inspection in Ontario?
                                </h3>
                                <p className="text-gray-600">
                                    An Ontario safety standards inspection covers brakes, tires, steering,
                                    suspension, lights, windshield, mirrors, horn, exhaust system, fuel
                                    system, and structural integrity. Vehicles must pass this inspection
                                    to be registered when ownership is transferred. The inspection
                                    typically costs $80-$120.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How often should I change my oil?
                                </h3>
                                <p className="text-gray-600">
                                    Most modern vehicles with conventional oil need an oil change every
                                    5,000-8,000 km or every 3-6 months. Vehicles using synthetic oil can
                                    typically go 8,000-15,000 km between changes. Check your owner's manual
                                    for manufacturer recommendations specific to your vehicle.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What should I do if my check engine light comes on?
                                </h3>
                                <p className="text-gray-600">
                                    A steady check engine light usually indicates a non-emergency issue
                                    that should be diagnosed soon. A flashing check engine light indicates
                                    a serious problem and you should reduce speed and get to a mechanic
                                    as soon as possible. Post a diagnostic task on Taskallo to have a
                                    mechanic read the error codes and diagnose the issue.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-[#063A41] to-[#0a4f59]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Need Automotive Services in Toronto?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8">
                            Get free quotes from trusted mechanics and automotive professionals.
                            Honest pricing, quality work, no hassle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/services/688bcb3a2056a9b591a728ba"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Find a Mechanic Now
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