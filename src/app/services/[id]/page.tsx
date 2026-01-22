// import { Metadata } from 'next';
// import ClientPage from './ClientPage';

// // Service data mapping for SEO
// const serviceMetadata: Record<string, {
//     title: string
//     description: string
//     keywords: string[]
// }> = {
//     '688bb7262056a9b591a72862': {
//         title: 'Handyman & Home Repairs Services in Canada | Taskallo',
//         description: 'Find trusted handyman services in Canada. Small fixes, furniture assembly, painting, drywall, flooring, small renovations, and moving labor. Get quotes from verified professionals.',
//         keywords: ['handyman Canada', 'home repairs', 'furniture assembly', 'painting services', 'drywall repair', 'flooring installation', 'home renovations']
//     },
//     '688bbdea2056a9b591a7288b': {
//         title: 'Professional Pet Services in Canada | Dog Walking & Pet Sitting | Taskallo',
//         description: 'Trusted pet services across Canada. Dog walking, pet sitting, boarding, and grooming. Give your pet the love and care they deserve with verified pet care professionals.',
//         keywords: ['pet services Canada', 'dog walking', 'pet sitting', 'pet boarding', 'dog grooming', 'pet care', 'pet training']
//     },
//     '688bbe762056a9b591a72892': {
//         title: 'Professional Cleaning Services in Canada | Deep Cleaning & Move-in/out | Taskallo',
//         description: 'Book professional cleaning services in Canada. Standard cleaning, deep cleaning, and move-in/move-out cleaning. Transform your space with trusted cleaners.',
//         keywords: ['cleaning services Canada', 'deep cleaning', 'move-in cleaning', 'move-out cleaning', 'house cleaning', 'professional cleaners', 'home cleaning']
//     },
//     '688bbf7d2056a9b591a728b1': {
//         title: 'Plumbing, Electrical & HVAC Services in Canada | Emergency Repairs | Taskallo',
//         description: 'Find licensed plumbers, electricians, and HVAC technicians in Canada. Plumbing repairs, electrical work, furnace/AC installation & repair, and emergency services available.',
//         keywords: ['plumbing services Canada', 'electrician Canada', 'HVAC services', 'furnace repair', 'AC installation', 'emergency plumber', 'electrical repairs']
//     },
//     '688bcb3a2056a9b591a728ba': {
//         title: 'Automotive Services & Car Repairs in Canada | Mechanics Near You | Taskallo',
//         description: 'Find reliable mechanics in Canada for oil changes, tire services, brake repairs, and car maintenance. Book trusted automotive professionals for all your vehicle needs.',
//         keywords: ['automotive services Canada', 'car repair', 'oil change', 'brake repair', 'tire replacement', 'auto mechanic', 'car maintenance']
//     },
//     '688bce0c2056a9b591a728cc': {
//         title: 'Specialized Services in Canada | Custom Help & Unique Tasks | Taskallo',
//         description: 'Find experts for specialized and unique tasks in Canada. From everyday needs to one-off projects, connect with professionals for custom help and odd jobs.',
//         keywords: ['specialized services Canada', 'unique tasks', 'custom help', 'odd jobs', 'personal projects', 'freelance services']
//     }
// }

// // Generate metadata for each service page (synchronous, no async needed)
// export async function generateMetadata({
//     params
// }: {
//     params: Promise<{ id: string }> // Type as Promise
// }): Promise<Metadata> {
//     const resolvedParams = await params; // Await to resolve
//     const serviceId = resolvedParams.id;
//     const metadata = serviceMetadata[serviceId];

//     if (!metadata) {
//         return {
//             title: 'Service Details | Taskallo',
//             description: 'View service details and book trusted professionals on Taskallo.'
//         };
//     }

//     return {
//         title: metadata.title,
//         description: metadata.description,
//         keywords: metadata.keywords,
//         openGraph: {
//             title: metadata.title,
//             description: metadata.description,
//             url: `https://www.taskallo.com/services/${serviceId}`,
//             type: 'website',
//             images: [
//                 {
//                     url: '/og-image.png',
//                     width: 1200,
//                     height: 630,
//                     alt: metadata.title,
//                 },
//             ],
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title: metadata.title,
//             description: metadata.description,
//             images: ['/og-image.png'],
//         },
//         alternates: {
//             canonical: `/services/${serviceId}`,
//         },
//     };
// }

// // Server Component: Now async to handle params
// export default async function Page({ params }: { params: Promise<{ id: string }> }) {
//     const resolvedParams = await params; // Await to resolve
//     return <ClientPage id={resolvedParams.id} />;
// }

import { Metadata } from 'next';
import ClientPage from './ClientPage';

// Service data mapping for SEO
const serviceMetadata: Record<string, {
    title: string
    description: string
    keywords: string[]
    h1: string
    content: string
    features: string[]
}> = {
    '688bb7262056a9b591a72862': {
        title: 'Handyman & Home Repairs Services in Canada | Taskallo',
        description: 'Find trusted handyman services in Canada. Small fixes, furniture assembly, painting, drywall, flooring, small renovations, and moving labor. Get quotes from verified professionals.',
        keywords: ['handyman Canada', 'home repairs', 'furniture assembly', 'painting services', 'drywall repair', 'flooring installation', 'home renovations'],
        h1: 'Handyman & Home Repairs Services in Canada',
        content: 'Find trusted handyman professionals across Canada for all your home repair needs. From small fixes to complete renovations, our verified taskers are ready to help.',
        features: [
            'Small fixes and repairs',
            'Furniture assembly',
            'Painting and drywall',
            'Flooring installation',
            'Small renovations',
            'Moving labor and heavy lifting'
        ]
    },
    '688bbdea2056a9b591a7288b': {
        title: 'Professional Pet Services in Canada | Dog Walking & Pet Sitting | Taskallo',
        description: 'Trusted pet services across Canada. Dog walking, pet sitting, boarding, and grooming. Give your pet the love and care they deserve with verified pet care professionals.',
        keywords: ['pet services Canada', 'dog walking', 'pet sitting', 'pet boarding', 'dog grooming', 'pet care', 'pet training'],
        h1: 'Professional Pet Services in Canada',
        content: 'Give your pet the love and care they deserve with trusted pet care professionals across Canada. From daily walks to extended boarding, we have you covered.',
        features: [
            'Dog walking services',
            'Pet sitting at your home',
            'Pet boarding facilities',
            'Professional grooming',
            'Pet training assistance',
            'Emergency pet care'
        ]
    },
    '688bbe762056a9b591a72892': {
        title: 'Professional Cleaning Services in Canada | Deep Cleaning & Move-in/out | Taskallo',
        description: 'Book professional cleaning services in Canada. Standard cleaning, deep cleaning, and move-in/move-out cleaning. Transform your space with trusted cleaners.',
        keywords: ['cleaning services Canada', 'deep cleaning', 'move-in cleaning', 'move-out cleaning', 'house cleaning', 'professional cleaners', 'home cleaning'],
        h1: 'Professional Cleaning Services in Canada',
        content: 'Transform your space with professional cleaning services. Our verified cleaners provide thorough, reliable cleaning for homes and offices across Canada.',
        features: [
            'Standard home cleaning',
            'Deep cleaning services',
            'Move-in cleaning',
            'Move-out cleaning',
            'Office cleaning',
            'Post-renovation cleaning'
        ]
    },
    '688bbf7d2056a9b591a728b1': {
        title: 'Plumbing, Electrical & HVAC Services in Canada | Emergency Repairs | Taskallo',
        description: 'Find licensed plumbers, electricians, and HVAC technicians in Canada. Plumbing repairs, electrical work, furnace/AC installation & repair, and emergency services available.',
        keywords: ['plumbing services Canada', 'electrician Canada', 'HVAC services', 'furnace repair', 'AC installation', 'emergency plumber', 'electrical repairs'],
        h1: 'Plumbing, Electrical & HVAC Services in Canada',
        content: 'Connect with licensed plumbers, electricians, and HVAC technicians across Canada. Professional installation, repairs, and emergency services available.',
        features: [
            'Plumbing repairs and installation',
            'Electrical work and repairs',
            'Furnace installation and repair',
            'AC installation and maintenance',
            'Emergency services 24/7',
            'Water heater services'
        ]
    },
    '688bcb3a2056a9b591a728ba': {
        title: 'Automotive Services & Car Repairs in Canada | Mechanics Near You | Taskallo',
        description: 'Find reliable mechanics in Canada for oil changes, tire services, brake repairs, and car maintenance. Book trusted automotive professionals for all your vehicle needs.',
        keywords: ['automotive services Canada', 'car repair', 'oil change', 'brake repair', 'tire replacement', 'auto mechanic', 'car maintenance'],
        h1: 'Automotive Services & Car Repairs in Canada',
        content: 'Find reliable mechanics and automotive professionals across Canada. From routine maintenance to major repairs, get your vehicle serviced by trusted experts.',
        features: [
            'Oil changes and fluid services',
            'Brake repair and replacement',
            'Tire services and rotation',
            'Engine diagnostics',
            'Battery replacement',
            'General car maintenance'
        ]
    },
    '688bce0c2056a9b591a728cc': {
        title: 'Specialized Services in Canada | Custom Help & Unique Tasks | Taskallo',
        description: 'Find experts for specialized and unique tasks in Canada. From everyday needs to one-off projects, connect with professionals for custom help and odd jobs.',
        keywords: ['specialized services Canada', 'unique tasks', 'custom help', 'odd jobs', 'personal projects', 'freelance services'],
        h1: 'Specialized Services in Canada',
        content: 'Need help with a unique task? Find skilled professionals for specialized services and custom projects across Canada. No job is too unusual.',
        features: [
            'Custom project assistance',
            'Unique task help',
            'Personal errands',
            'Event support',
            'Administrative tasks',
            'One-off specialized jobs'
        ]
    }
}

// Generate metadata for each service page
export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const resolvedParams = await params;
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

// Server Component with SEO content
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const serviceId = resolvedParams.id;
    const seoData = serviceMetadata[serviceId];

    return (
        <main>
            {/* ✅ SEO Content - Google reads this immediately */}
            {seoData && (
                <div className="sr-only">
                    <h1>{seoData.h1}</h1>
                    <p>{seoData.content}</p>

                    <h2>Our {seoData.h1.split(' ')[0]} Services Include:</h2>
                    <ul>
                        {seoData.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>

                    <h2>Why Choose Taskallo for {seoData.h1.split(' ')[0]} Services?</h2>
                    <ul>
                        <li>Verified and trusted professionals across Canada</li>
                        <li>Transparent pricing with no hidden fees</li>
                        <li>Easy booking and secure payments</li>
                        <li>Read reviews from real customers</li>
                        <li>Get quotes and compare taskers</li>
                    </ul>

                    <h2>How to Book</h2>
                    <ol>
                        <li>Browse available taskers in your area</li>
                        <li>Compare prices and reviews</li>
                        <li>Book your preferred professional</li>
                        <li>Get the job done and leave a review</li>
                    </ol>
                </div>
            )}

            {/* Client Component */}
            <ClientPage id={serviceId} />
        </main>
    );
}