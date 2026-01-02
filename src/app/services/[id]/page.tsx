import { Metadata } from 'next';
import ClientPage from './ClientPage';

// Service data mapping for SEO
const serviceMetadata: Record<string, {
    title: string
    description: string
    keywords: string[]
}> = {
    '688bb7262056a9b591a72862': {
        title: 'Handyman & Home Repairs Services in Canada | Taskallo',
        description: 'Find trusted handyman services in Canada. Small fixes, furniture assembly, painting, drywall, flooring, small renovations, and moving labor. Get quotes from verified professionals.',
        keywords: ['handyman Canada', 'home repairs', 'furniture assembly', 'painting services', 'drywall repair', 'flooring installation', 'home renovations']
    },
    '688bbdea2056a9b591a7288b': {
        title: 'Professional Pet Services in Canada | Dog Walking & Pet Sitting | Taskallo',
        description: 'Trusted pet services across Canada. Dog walking, pet sitting, boarding, and grooming. Give your pet the love and care they deserve with verified pet care professionals.',
        keywords: ['pet services Canada', 'dog walking', 'pet sitting', 'pet boarding', 'dog grooming', 'pet care', 'pet training']
    },
    '688bbe762056a9b591a72892': {
        title: 'Professional Cleaning Services in Canada | Deep Cleaning & Move-in/out | Taskallo',
        description: 'Book professional cleaning services in Canada. Standard cleaning, deep cleaning, and move-in/move-out cleaning. Transform your space with trusted cleaners.',
        keywords: ['cleaning services Canada', 'deep cleaning', 'move-in cleaning', 'move-out cleaning', 'house cleaning', 'professional cleaners', 'home cleaning']
    },
    '688bbf7d2056a9b591a728b1': {
        title: 'Plumbing, Electrical & HVAC Services in Canada | Emergency Repairs | Taskallo',
        description: 'Find licensed plumbers, electricians, and HVAC technicians in Canada. Plumbing repairs, electrical work, furnace/AC installation & repair, and emergency services available.',
        keywords: ['plumbing services Canada', 'electrician Canada', 'HVAC services', 'furnace repair', 'AC installation', 'emergency plumber', 'electrical repairs']
    },
    '688bcb3a2056a9b591a728ba': {
        title: 'Automotive Services & Car Repairs in Canada | Mechanics Near You | Taskallo',
        description: 'Find reliable mechanics in Canada for oil changes, tire services, brake repairs, and car maintenance. Book trusted automotive professionals for all your vehicle needs.',
        keywords: ['automotive services Canada', 'car repair', 'oil change', 'brake repair', 'tire replacement', 'auto mechanic', 'car maintenance']
    },
    '688bce0c2056a9b591a728cc': {
        title: 'Specialized Services in Canada | Custom Help & Unique Tasks | Taskallo',
        description: 'Find experts for specialized and unique tasks in Canada. From everyday needs to one-off projects, connect with professionals for custom help and odd jobs.',
        keywords: ['specialized services Canada', 'unique tasks', 'custom help', 'odd jobs', 'personal projects', 'freelance services']
    }
}

// Generate metadata for each service page (synchronous, no async needed)
export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }> // Type as Promise
}): Promise<Metadata> {
    const resolvedParams = await params; // Await to resolve
    const serviceId = resolvedParams.id;
    const metadata = serviceMetadata[serviceId];

    if (!metadata) {
        return {
            title: 'Service Details | Taskallo',
            description: 'View service details and book trusted professionals on Taskallo.'
        };
    }

    return {
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        openGraph: {
            title: metadata.title,
            description: metadata.description,
            url: `https://www.taskallo.com/services/${serviceId}`,
            type: 'website',
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: metadata.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metadata.title,
            description: metadata.description,
            images: ['/og-image.png'],
        },
        alternates: {
            canonical: `/services/${serviceId}`,
        },
    };
}

// Server Component: Now async to handle params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params; // Await to resolve
    return <ClientPage id={resolvedParams.id} />;
}