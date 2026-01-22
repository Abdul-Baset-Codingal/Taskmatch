import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';

// SEO Metadata
export const metadata: Metadata = {
    title: 'Specialized Services in Toronto | Custom Tasks & Unique Help | Taskallo',
    description: 'Find professionals for specialized and unique tasks in Toronto. Event help, personal assistance, moving labor, landscaping, junk removal, appliance installation, and custom projects. Get quotes from verified service providers.',
    keywords: [
        'specialized services Toronto',
        'custom services Toronto',
        'odd jobs Toronto',
        'task help Toronto',
        'personal assistant Toronto',
        'event help Toronto',
        'moving help Toronto',
        'junk removal Toronto',
        'landscaping Toronto',
        'appliance installation Toronto',
        'errands Toronto',
        'delivery services Toronto',
        'assembly services Toronto',
        'mounting services Toronto',
        'organization services Toronto'
    ],
    openGraph: {
        title: 'Specialized Services in Toronto | Custom Tasks & Unique Help | Taskallo',
        description: 'Find professionals for specialized and unique tasks in Toronto. Event help, personal assistance, moving labor, and more.',
        url: 'https://www.taskallo.com/toronto/specialized-services',
        type: 'website',
        siteName: 'Taskallo',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Specialized Services in Toronto - Taskallo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Specialized Services in Toronto | Custom Tasks & Unique Help | Taskallo',
        description: 'Find professionals for specialized and unique tasks in Toronto. Event help, personal assistance, moving labor, and more.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: '/toronto/specialized-services',
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
    "name": "Specialized Services in Toronto",
    "description": "Professional specialized services in Toronto including event help, personal assistance, moving labor, landscaping, junk removal, appliance installation, and custom project assistance from verified service providers.",
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
    "serviceType": "Specialized Services"
};

export default function TorontoSpecializedServicesPage() {
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
                                Get Help With Any Task in Toronto
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Specialized Services in Toronto
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                                Need help with a unique task? Find skilled professionals for
                                specialized projects, odd jobs, personal assistance, and custom
                                tasks across the Greater Toronto Area. No job is too unusual.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/services/688bce0c2056a9b591a728cc"
                                    className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all text-center"
                                >
                                    Post Your Task
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
                                Specialized Services We Offer in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our network of verified service providers can help with
                                virtually any task. From everyday errands to one-of-a-kind
                                projects, find the right person for the job.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Service 1 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">01</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Moving and Heavy Lifting
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Get help with moving furniture, loading trucks, rearranging
                                    rooms, and any tasks requiring extra muscle.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Furniture moving and rearranging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Loading and unloading trucks</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Appliance moving</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 2 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">02</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Junk Removal
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Clear out unwanted items, furniture, appliances, and debris.
                                    Responsible disposal and donation options available.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Furniture and appliance removal</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Garage and basement cleanouts</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Estate and hoarding cleanups</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 3 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">03</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Landscaping and Yard Work
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Transform your outdoor space with lawn care, gardening,
                                    and landscaping services for all seasons.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Lawn mowing and edging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Garden planting and maintenance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Snow removal and salting</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 4 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">04</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Event Help and Setup
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Extra hands for parties, weddings, corporate events,
                                    and special occasions. Setup, service, and cleanup.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Event setup and teardown</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Party and wedding assistance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Serving and bartending help</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 5 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">05</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Personal Assistance
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Get help with personal tasks, errands, and everyday
                                    to-dos that you do not have time to handle yourself.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Grocery shopping and pickup</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Waiting for deliveries or service calls</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Running errands</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 6 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">06</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Delivery and Pickup
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Same-day delivery and pickup services for items, packages,
                                    furniture, and marketplace purchases.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Furniture and large item delivery</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Marketplace item pickup</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Store pickup and delivery</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 7 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">07</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Appliance Installation
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional installation of household appliances
                                    including washers, dryers, dishwashers, and more.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Washer and dryer installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Dishwasher installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Range and oven setup</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 8 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">08</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Home Organization
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Declutter and organize your home with professional
                                    organization services for any room or space.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Closet organization</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Kitchen and pantry organization</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Garage and storage organization</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 9 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">09</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Packing and Unpacking
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional packing services for moves or storage.
                                    Careful handling of your belongings.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Full home packing</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Unpacking and setup</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Fragile item packing</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 10 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">10</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Senior Assistance
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Compassionate help for seniors with errands, home tasks,
                                    companionship, and everyday assistance.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Grocery shopping and errands</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Light housekeeping</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Transportation assistance</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 11 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">11</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Holiday and Seasonal Help
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Get help with holiday decorating, seasonal tasks, and
                                    special occasion preparations.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Christmas light installation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Holiday decoration setup</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Seasonal yard cleanup</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 12 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">12</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Custom Projects
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Have a unique task that does not fit other categories?
                                    Post it and find someone with the right skills.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>One-of-a-kind projects</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Specialized skill tasks</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Creative and craft projects</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Services Section */}
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                More Services Available in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Whatever you need help with, our service providers are ready to assist.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Window Cleaning</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Gutter Cleaning</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Pressure Washing</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Pool Maintenance</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Grocery Delivery</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Meal Prep Assistance</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Laundry Services</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Dry Cleaning Pickup</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Car Washing</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Interior Detailing</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Tech Setup Help</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Smart Home Setup</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Computer Help</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Photography</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Videography</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Music Lessons</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Tutoring</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Language Practice</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Fitness Training</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Yoga Instruction</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Catering Assistance</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Gift Wrapping</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Line Waiting</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                                <p className="font-medium text-[#063A41]">Anything Else</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                Why Choose Taskallo for Specialized Services
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We connect you with verified, reliable service providers
                                who can handle any task, big or small.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">A</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Any Task Welcome
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    No job is too unusual or too small. Post any task and
                                    find someone with the right skills to help.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">V</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Verified Providers
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Every service provider is verified for identity and
                                    reliability before joining our platform.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">F</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Flexible Scheduling
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Get help when you need it. Same-day, evening, and
                                    weekend availability for most tasks.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">T</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Transparent Pricing
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Get upfront quotes with no hidden fees. Know exactly
                                    what you will pay before the work begins.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-16 md:py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                How to Get Help With Any Task
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Finding the right person for your specialized task is simple with Taskallo.
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
                                    Tell us what you need done. Be as detailed as possible
                                    about the task, location, and timeline.
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
                                    Qualified Toronto service providers will review your
                                    task and submit competitive quotes.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Choose Your Helper
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Compare profiles, read reviews, and select the person
                                    who is the best fit for your task.
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
                                    Your helper arrives and completes the task.
                                    Leave a review to help other Toronto residents.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/services/688bce0c2056a9b591a728cc"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Post Your Task Now
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
                                Our service providers are available throughout the Greater Toronto Area.
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
                                Common questions about specialized services in Toronto.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What types of tasks can I post on Taskallo?
                                </h3>
                                <p className="text-gray-600">
                                    You can post virtually any legal task or service need. Common
                                    examples include moving help, junk removal, yard work, event
                                    assistance, errands, deliveries, organization, and custom projects.
                                    If you are unsure whether your task is suitable, post it and see
                                    if service providers are available to help.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How quickly can I get help with my task?
                                </h3>
                                <p className="text-gray-600">
                                    Many tasks can be completed same-day or next-day depending on
                                    availability. When posting your task, specify your preferred
                                    timeline. For urgent tasks, mark them as time-sensitive to
                                    attract providers who can help immediately.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How do I know if a service provider is reliable?
                                </h3>
                                <p className="text-gray-600">
                                    All service providers on Taskallo are verified for identity.
                                    You can view their profile, read reviews from previous clients,
                                    see their completed task history, and message them before booking.
                                    Choose providers with good ratings and reviews relevant to your
                                    type of task.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What if I need multiple people for my task?
                                </h3>
                                <p className="text-gray-600">
                                    When posting your task, specify how many helpers you need.
                                    For large tasks like moving or event setup, you can request
                                    multiple service providers. Some providers also work in teams
                                    and can bring additional helpers if needed.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Do I need to provide tools or supplies?
                                </h3>
                                <p className="text-gray-600">
                                    It depends on the task. Many service providers bring their own
                                    basic tools and equipment. For specialized tasks or if specific
                                    supplies are needed, discuss this with the provider before booking.
                                    Clarify who is responsible for materials in your task description.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What if my task is not listed in your categories?
                                </h3>
                                <p className="text-gray-600">
                                    No problem. Taskallo is designed for all types of tasks, including
                                    unique and one-of-a-kind projects. Post your task with a detailed
                                    description and service providers with relevant skills will respond.
                                    We have helped with everything from costume making to mystery shopping.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-[#063A41] to-[#0a4f59]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Need Help With a Task in Toronto?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8">
                            Whatever you need done, we have someone who can help.
                            Post your task and get free quotes from verified service providers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/services/688bce0c2056a9b591a728cc"
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