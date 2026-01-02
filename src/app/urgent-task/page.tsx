import { Metadata } from 'next'
import UrgentTaskClient from './UrgentTaskClient'

export const metadata: Metadata = {
  title: 'Post an Urgent Task | Get Quick Help from Local Professionals | Taskallo',
  description: 'Need help fast? Post an urgent task and get quick responses from verified local professionals. Emergency home repairs, last-minute cleaning, and more available across Canada.',
  keywords: ['urgent task', 'emergency services', 'quick help', 'fast service', 'immediate assistance', 'emergency repairs Canada'],
  openGraph: {
    title: 'Post an Urgent Task | Taskallo',
    description: 'Get quick help from local professionals for your urgent tasks and emergency services.',
    url: 'https://www.taskallo.com/urgent-task',
    type: 'website',
  },
  alternates: {
    canonical: '/urgent-task',
  },
}

// Prevent static prerendering to avoid useSearchParams issues
export const dynamic = "force-dynamic";

const Page = () => {
  return <UrgentTaskClient />
}

export default Page