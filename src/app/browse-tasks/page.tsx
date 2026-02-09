// // import { Metadata } from 'next'
// // import BrowseTasksClient from './BrowseTasksClient'

// // export const metadata: Metadata = {
// //     title: 'Browse Tasks & Services in Canada | Find Local Professionals | Taskallo',
// //     description: 'Browse available tasks and services across Canada. Find trusted professionals for home repairs, cleaning, pet care, automotive services, and more. Post your task or request quotes today.',
// //     keywords: ['browse tasks Canada', 'find services', 'local professionals', 'hire taskers', 'service providers Canada', 'home services'],
// //     openGraph: {
// //         title: 'Browse Tasks & Services in Canada | Taskallo',
// //         description: 'Find trusted professionals for all your home and specialized service needs across Canada.',
// //         url: 'https://www.taskallo.com/browse-tasks',
// //         type: 'website',
// //     },
// //     alternates: {
// //         canonical: '/browse-tasks',
// //     },
// // }

// // const Page = () => {
// //     return <BrowseTasksClient />
// // }

// // export default Page

// import { Metadata } from 'next'
// import BrowseTasksClient from './BrowseTasksClient'

// export const metadata: Metadata = {
//     title: 'Browse Tasks & Services in Canada | Find Local Professionals | Taskallo',
//     description: 'Browse available tasks and services across Canada. Find trusted professionals for home repairs, cleaning, pet care, automotive services, and more. Post your task or request quotes today.',
//     keywords: ['browse tasks Canada', 'find services', 'local professionals', 'hire taskers', 'service providers Canada', 'home services'],
//     openGraph: {
//         title: 'Browse Tasks & Services in Canada | Taskallo',
//         description: 'Find trusted professionals for all your home and specialized service needs across Canada.',
//         url: 'https://www.taskallo.com/browse-tasks',
//         type: 'website',
//     },
//     alternates: {
//         canonical: '/browse-tasks',
//     },
// }

// const Page = () => {
//     return (
//         <main>
//             {/* ✅ SEO Content - Google reads this immediately */}
//             <div className="sr-only">
//                 <h1>Browse Tasks & Services in Canada</h1>
//                 <p>
//                     Find trusted professionals for home repairs, cleaning, pet care,
//                     automotive services, and more across Canada. Post your task or
//                     request quotes from verified Taskers on Taskallo.
//                 </p>

//                 <h2>Available Service Categories</h2>
//                 <ul>
//                     <li>Handyman & Home Repairs - Small fixes, furniture assembly, painting, drywall, flooring</li>
//                     <li>Pet Services - Dog walking, pet sitting, boarding, and grooming</li>
//                     <li>Cleaning Services - Standard, deep, and move-in/move-out cleaning</li>
//                     <li>Plumbing, Electrical & HVAC - Repairs, installations, emergency services</li>
//                     <li>Automotive Services - Oil changes, tire services, brake repairs</li>
//                     <li>All Other Specialized Services - Custom tasks and specialized help</li>
//                 </ul>

//                 <h2>How It Works</h2>
//                 <ol>
//                     <li>Browse available tasks posted by clients across Canada</li>
//                     <li>Filter by category, location, price, and deadline</li>
//                     <li>Place your bid on tasks that match your skills</li>
//                     <li>Get hired and complete the task</li>
//                 </ol>

//                 <h2>Why Choose Taskallo</h2>
//                 <ul>
//                     <li>Trusted professionals verified across Canada</li>
//                     <li>Transparent pricing with no hidden fees</li>
//                     <li>Secure messaging between clients and taskers</li>
//                     <li>Simple and fast booking process</li>
//                 </ul>
//             </div>

//             {/* Your existing client component */}
//             <BrowseTasksClient />
//         </main>
//     )
// }

// export default Page

// app/browse-tasks/page.tsx

import { Metadata } from 'next'
import BrowseTasksClient from './BrowseTasksClient'
import Link from 'next/link'
import Footer from '@/shared/Footer'

export const metadata: Metadata = {
    title: 'Browse Tasks & Services in Canada | Find Local Professionals | Taskallo',
    description: 'Browse available tasks and services across Canada. Find trusted professionals for home repairs, cleaning, pet care, automotive services, and more. Post your task or request quotes today.',
    keywords: ['browse tasks Canada', 'find services', 'local professionals', 'hire taskers', 'service providers Canada', 'home services'],
    openGraph: {
        title: 'Browse Tasks & Services in Canada | Taskallo',
        description: 'Find trusted professionals for all your home and specialized service needs across Canada.',
        url: 'https://www.taskallo.com/browse-tasks',
        type: 'website',
    },
    alternates: {
        canonical: 'https://www.taskallo.com/browse-tasks',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Browse Tasks & Services in Canada',
    description: 'Find trusted professionals for home repairs, cleaning, pet care, automotive services, and more across Canada.',
    url: 'https://www.taskallo.com/browse-tasks',
    provider: {
        '@type': 'Organization',
        name: 'Taskallo',
        url: 'https://www.taskallo.com'
    },
    mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Handyman Services', url: 'https://www.taskallo.com/services/toronto/handyman' },
            { '@type': 'ListItem', position: 2, name: 'Cleaning Services', url: 'https://www.taskallo.com/services/toronto/cleaning-services' },
            { '@type': 'ListItem', position: 3, name: 'Plumbing Services', url: 'https://www.taskallo.com/services/toronto/plumber' },
            { '@type': 'ListItem', position: 4, name: 'Pet Services', url: 'https://www.taskallo.com/services/toronto/pet-services' },
            { '@type': 'ListItem', position: 5, name: 'Automotive Services', url: 'https://www.taskallo.com/services/toronto/automotive-services' },
        ]
    }
}

const Page = () => {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main>
                <BrowseTasksClient />

                {/* ✅ SEO Footer - Looks like natural page content */}
                <section className="bg-gray-50 border-t mt-8">
                    <div className="max-w-6xl mx-auto px-4 py-8">

                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Find Tasks by Category
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                            <Link
                                href="/services/toronto/handyman"
                                className="block p-3 bg-white border rounded-lg text-center hover:border-gray-400 transition"
                            >
                                <span className="text-sm font-medium text-gray-700">Handyman</span>
                            </Link>
                            <Link
                                href="/services/toronto/cleaning-services"
                                className="block p-3 bg-white border rounded-lg text-center hover:border-gray-400 transition"
                            >
                                <span className="text-sm font-medium text-gray-700">Cleaning</span>
                            </Link>
                            <Link
                                href="/services/toronto/plumber"
                                className="block p-3 bg-white border rounded-lg text-center hover:border-gray-400 transition"
                            >
                                <span className="text-sm font-medium text-gray-700">Plumbing</span>
                            </Link>
                            <Link
                                href="/services/toronto/pet-services"
                                className="block p-3 bg-white border rounded-lg text-center hover:border-gray-400 transition"
                            >
                                <span className="text-sm font-medium text-gray-700">Pet Services</span>
                            </Link>
                            <Link
                                href="/services/toronto/automotive-services"
                                className="block p-3 bg-white border rounded-lg text-center hover:border-gray-400 transition"
                            >
                                <span className="text-sm font-medium text-gray-700">Automotive</span>
                            </Link>
                            <Link
                                href="/services/toronto/specialized-services"
                                className="block p-3 bg-white border rounded-lg text-center hover:border-gray-400 transition"
                            >
                                <span className="text-sm font-medium text-gray-700">Specialized</span>
                            </Link>
                        </div>

                        <div className="text-gray-600 text-sm leading-relaxed">
                            <p className="mb-3">
                                <strong>Taskallo</strong> connects you with trusted professionals across Canada.
                                Browse available tasks for home repairs, cleaning services, pet care,
                                automotive maintenance, and specialized services in your area.
                            </p>
                            <p>
                                Whether you need a handyman for small fixes, a cleaner for your home,
                                or a professional for specialized tasks, find the right match on Taskallo.
                                Post your task today and receive quotes from verified service providers.
                            </p>
                        </div>

                    </div>
                </section>
                <Footer />

            </main>
        </>
    )
}

export default Page