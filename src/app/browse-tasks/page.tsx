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
    return <BrowseTasksClient />
}

export default Page