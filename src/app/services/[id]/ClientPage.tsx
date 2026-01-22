// 'use client';

// import React from 'react';
// import { useParams } from 'next/navigation';
// import Navbar from '@/shared/Navbar';
// import TaskerSlider from '@/components/routes/urgent-task/TaskerSlider';
// import { useGetServiceByIdQuery } from '@/features/api/servicesApi';

// interface ClientPageProps {
//     id: string;
// }

// export default function ClientPage({ id }: ClientPageProps) {
//     // Use the passed id (from server params) for the query
//     const { data: service, error, isLoading } = useGetServiceByIdQuery(id ?? '', {
//         skip: !id,
//     });

//     console.log(service);

//     if (!id) return <p>Loading...</p>;
//     if (isLoading) return <p>Loading service details...</p>;
//     if (error) return <p>Error loading service details</p>;

//     return (
//         <div>
//             <div className='z-[999]'>
//                 <Navbar />
//             </div>
//             {/* <DetailsBanner service={service} /> */}

//             <div className=''>
//                 <TaskerSlider service={service} />
//             </div>
//         </div>
//     );
// }

'use client';

import React from 'react';
import Navbar from '@/shared/Navbar';
import TaskerSlider from '@/components/routes/urgent-task/TaskerSlider';
import { useGetServiceByIdQuery } from '@/features/api/servicesApi';

interface ClientPageProps {
    id: string;
}

export default function ClientPage({ id }: ClientPageProps) {
    const { data: service, error, isLoading } = useGetServiceByIdQuery(id ?? '', {
        skip: !id,
    });

    return (
        <div>
            <div className='z-[999]'>
                <Navbar />
            </div>

            {/* Loading State - Styled nicely instead of plain text */}
            {isLoading && (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-pulse text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#109C3D] to-[#063A41] flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-600">Loading service details...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading service details</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-[#109C3D] text-white rounded-lg"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            {!isLoading && !error && service && (
                <div>
                    <TaskerSlider service={service} />
                </div>
            )}
        </div>
    );
}