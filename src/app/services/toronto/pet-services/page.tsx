import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/shared/Navbar';
import Footer from '@/shared/Footer';

// SEO Metadata
export const metadata: Metadata = {
    title: 'Pet Services in Toronto | Dog Walking, Pet Sitting & Grooming | Taskallo',
    description: 'Find trusted pet care professionals in Toronto. Dog walking, pet sitting, boarding, grooming, and training services. Verified pet caregivers who treat your pets like family.',
    keywords: [
        'pet services Toronto',
        'dog walking Toronto',
        'pet sitting Toronto',
        'pet boarding Toronto',
        'dog grooming Toronto',
        'cat sitting Toronto',
        'pet care Toronto',
        'dog walker near me Toronto',
        'pet sitter Toronto',
        'overnight pet sitting Toronto',
        'dog daycare Toronto',
        'pet training Toronto'
    ],
    openGraph: {
        title: 'Pet Services in Toronto | Dog Walking, Pet Sitting & Grooming | Taskallo',
        description: 'Find trusted pet care professionals in Toronto. Dog walking, pet sitting, boarding, grooming, and training services.',
        url: 'https://www.taskallo.com/toronto/pet-services',
        type: 'website',
        siteName: 'Taskallo',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Pet Services in Toronto - Taskallo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pet Services in Toronto | Dog Walking, Pet Sitting & Grooming | Taskallo',
        description: 'Find trusted pet care professionals in Toronto. Dog walking, pet sitting, boarding, and grooming.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: '/toronto/pet-services',
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
    "name": "Pet Services in Toronto",
    "description": "Professional pet care services in Toronto including dog walking, pet sitting, boarding, grooming, and training from verified pet care professionals.",
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
    "serviceType": "Pet Care Services"
};

export default function TorontoPetServicesPage() {
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
                                Trusted Pet Care Professionals in Toronto
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Pet Services in Toronto
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                                Find loving, reliable pet care professionals who treat your
                                furry family members like their own. Dog walking, pet sitting,
                                grooming, and more across the Greater Toronto Area.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/services/688bbdea2056a9b591a7288b"
                                    className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all text-center"
                                >
                                    Find a Pet Caregiver
                                </Link>
                                <Link
                                    href="/browse-tasks"
                                    className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-white/20 text-center"
                                >
                                    Browse Pet Tasks
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
                                Pet Care Services in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our network of verified pet care professionals provides
                                comprehensive services for dogs, cats, and other pets
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
                                    Dog Walking
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Regular dog walking services to keep your pup healthy, happy,
                                    and well-exercised. Flexible scheduling for busy pet owners.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>30, 45, or 60-minute walks</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Solo or group walks available</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>GPS tracking and photo updates</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 2 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">02</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Pet Sitting
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    In-home pet sitting services so your pet stays comfortable
                                    in familiar surroundings while you are away.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Drop-in visits (30-60 minutes)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Feeding and medication administration</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Playtime and companionship</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 3 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">03</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Overnight Pet Sitting
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Overnight care at your home or the sitter's home. Your pet
                                    receives constant attention and care while you travel.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>12+ hours of overnight care</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Evening and morning routines</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Regular updates and photos</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 4 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">04</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Pet Boarding
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Home-based boarding with experienced pet caregivers. A
                                    comfortable, home-like environment for your pet.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>24/7 supervision and care</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Home environment (not a kennel)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Daily exercise and playtime</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 5 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">05</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Dog Grooming
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional grooming services to keep your dog clean,
                                    healthy, and looking great. Mobile and in-home options available.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Bathing and blow-drying</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Haircuts and styling</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Nail trimming and ear cleaning</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 6 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">06</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Cat Sitting
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Specialized care for your feline friends. Cats stay
                                    comfortable at home with regular visits from a trusted sitter.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Feeding and fresh water</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Litter box maintenance</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Playtime and affection</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 7 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">07</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Dog Training
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Professional dog training services to address behavioral
                                    issues and teach obedience. Private and group sessions available.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Basic obedience training</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Puppy training</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Behavioral correction</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 8 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">08</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Pet Transportation
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Safe and reliable pet transportation services. Vet visits,
                                    grooming appointments, and airport pickup/drop-off.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Veterinary appointment transport</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Groomer drop-off and pickup</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Airport pet transport</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Service 9 */}
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-[#109C3D]/10 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#109C3D] font-bold text-xl">09</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#063A41] mb-3">
                                    Small Pet Care
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Care for rabbits, guinea pigs, hamsters, birds, fish, and
                                    other small pets. Specialized attention for unique needs.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Feeding and cage cleaning</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Exercise and enrichment</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-[#109C3D] mt-1">—</span>
                                        <span>Health monitoring</span>
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
                                Why Choose Toronto Pet Caregivers on Taskallo
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                We connect you with verified, passionate pet lovers who
                                provide exceptional care for your furry family members.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">V</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Verified Caregivers
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Every pet caregiver is background-checked and verified
                                    for experience and reliability before joining our platform.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">E</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Experienced with Pets
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Our caregivers are genuine pet lovers with hands-on
                                    experience caring for dogs, cats, and other animals.
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                                <div className="w-16 h-16 bg-[#109C3D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-[#109C3D] font-bold text-2xl">U</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Regular Updates
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Receive photo updates, GPS tracking for walks, and
                                    messages to stay connected while you are away.
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
                                    Read authentic reviews from Toronto pet owners to find
                                    the perfect caregiver for your pet's personality and needs.
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
                                How to Find Pet Care in Toronto
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Finding trusted pet care is simple and straightforward with Taskallo.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    1
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Describe Your Needs
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Tell us about your pet, the type of care needed, and your
                                    schedule. Include any special requirements or instructions.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    2
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Receive Offers
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Qualified pet caregivers in Toronto will review your
                                    request and submit offers with their availability.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Choose Your Caregiver
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Review profiles, read reviews, and message caregivers
                                    to find the perfect match for your pet.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#109C3D] to-[#063A41] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    4
                                </div>
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Enjoy Peace of Mind
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Your pet receives loving care while you receive regular
                                    updates. Leave a review to help other pet owners.
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-12">
                            <Link
                                href="/services/688bbdea2056a9b591a7288b"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Find a Pet Caregiver Now
                            </Link>
                        </div>
                    </div>
                </section>


                {/* Pet Types Section */}
                <section className="py-16 md:py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#063A41] mb-4">
                                We Care for All Types of Pets
                            </h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Our pet caregivers have experience with a wide variety of animals.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Dogs</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Cats</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Rabbits</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Birds</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Guinea Pigs</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Hamsters</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Fish</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Reptiles</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Ferrets</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Turtles</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Chickens</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-100">
                                <p className="font-medium text-[#063A41]">Other Pets</p>
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
                                Our pet caregivers provide services throughout the Greater Toronto Area.
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
                                Common questions about pet services in Toronto.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How do I know if a pet caregiver is trustworthy?
                                </h3>
                                <p className="text-gray-600">
                                    All pet caregivers on Taskallo go through a verification process.
                                    You can review their profile, read reviews from other pet owners,
                                    and message them before booking. We recommend scheduling a meet-and-greet
                                    so your pet can get comfortable with the caregiver before the first service.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What if my pet has special medical needs?
                                </h3>
                                <p className="text-gray-600">
                                    Many of our pet caregivers have experience with pets that require
                                    medication, special diets, or extra attention due to age or health
                                    conditions. When posting your task, include details about your pet's
                                    needs so caregivers with relevant experience can respond.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Can I meet the pet sitter before booking?
                                </h3>
                                <p className="text-gray-600">
                                    Absolutely. We highly recommend a meet-and-greet before your first
                                    booking. This gives your pet a chance to meet the caregiver, and
                                    you can discuss routines, preferences, and any special instructions
                                    in person.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    What happens if there is an emergency with my pet?
                                </h3>
                                <p className="text-gray-600">
                                    Our caregivers are trained to handle emergencies. Before booking,
                                    provide your vet's contact information and any emergency instructions.
                                    In case of an emergency, the caregiver will contact you immediately
                                    and take your pet to the vet if necessary.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    Do you provide services for aggressive or anxious dogs?
                                </h3>
                                <p className="text-gray-600">
                                    Some of our caregivers specialize in dogs with behavioral challenges.
                                    Be upfront about your dog's temperament when posting your task so
                                    experienced caregivers can respond. This ensures the best match for
                                    your pet's personality and needs.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-[#063A41] mb-2">
                                    How far in advance should I book pet services?
                                </h3>
                                <p className="text-gray-600">
                                    For regular services like dog walking, you can often find same-day
                                    or next-day availability. For overnight sitting or boarding,
                                    especially during holidays and busy seasons, we recommend booking
                                    at least 1-2 weeks in advance to secure your preferred caregiver.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 md:py-20 bg-gradient-to-br from-[#063A41] to-[#0a4f59]">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Need Pet Care in Toronto?
                        </h2>
                        <p className="text-xl text-gray-200 mb-8">
                            Connect with loving, verified pet caregivers in your neighborhood.
                            Your furry family members deserve the best care.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/services/688bbdea2056a9b591a7288b"
                                className="inline-block bg-[#109C3D] hover:bg-[#0d8a35] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                            >
                                Find a Pet Caregiver
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