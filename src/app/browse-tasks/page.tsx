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
//     return <BrowseTasksClient />
// }

// export default Page

import { Metadata } from 'next'
import BrowseTasksClient from './BrowseTasksClient'

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
        canonical: '/browse-tasks',
    },
}

const Page = () => {
    return (
        <main>
            {/* ✅ SEO Content - Google reads this immediately */}
            <div className="sr-only">
                <h1>Browse Tasks & Services in Canada</h1>
                <p>
                    Find trusted professionals for home repairs, cleaning, pet care,
                    automotive services, and more across Canada. Post your task or
                    request quotes from verified Taskers on Taskallo.
                </p>

                <h2>Available Service Categories</h2>
                <ul>
                    <li>Handyman & Home Repairs - Small fixes, furniture assembly, painting, drywall, flooring</li>
                    <li>Pet Services - Dog walking, pet sitting, boarding, and grooming</li>
                    <li>Cleaning Services - Standard, deep, and move-in/move-out cleaning</li>
                    <li>Plumbing, Electrical & HVAC - Repairs, installations, emergency services</li>
                    <li>Automotive Services - Oil changes, tire services, brake repairs</li>
                    <li>All Other Specialized Services - Custom tasks and specialized help</li>
                </ul>

                <h2>How It Works</h2>
                <ol>
                    <li>Browse available tasks posted by clients across Canada</li>
                    <li>Filter by category, location, price, and deadline</li>
                    <li>Place your bid on tasks that match your skills</li>
                    <li>Get hired and complete the task</li>
                </ol>

                <h2>Why Choose Taskallo</h2>
                <ul>
                    <li>Trusted professionals verified across Canada</li>
                    <li>Transparent pricing with no hidden fees</li>
                    <li>Secure messaging between clients and taskers</li>
                    <li>Simple and fast booking process</li>
                </ul>
            </div>

            {/* Your existing client component */}
            <BrowseTasksClient />
        </main>
    )
}

export default Page