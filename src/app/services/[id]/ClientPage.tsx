'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/shared/Navbar';
import TaskerSlider from '@/components/routes/urgent-task/TaskerSlider';
import { useGetServiceByIdQuery } from '@/features/api/servicesApi';

interface ClientPageProps {
    id: string;
}

export default function ClientPage({ id }: ClientPageProps) {
    // Use the passed id (from server params) for the query
    const { data: service, error, isLoading } = useGetServiceByIdQuery(id ?? '', {
        skip: !id,
    });

    console.log(service);

    if (!id) return <p>Loading...</p>;
    if (isLoading) return <p>Loading service details...</p>;
    if (error) return <p>Error loading service details</p>;

    return (
        <div>
            <div className='z-[999]'>
                <Navbar />
            </div>
            {/* <DetailsBanner service={service} /> */}

            <div className=''>
                <TaskerSlider service={service} />
            </div>
        </div>
    );
}