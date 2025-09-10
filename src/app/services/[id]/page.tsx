'use client';

import React from 'react';
import { useParams } from 'next/navigation'; // <-- Next 13 client router
import { useGetServiceByIdQuery } from '@/features/api/servicesApi';
import Navbar from '@/shared/Navbar';
import DetailsBanner from '@/components/serviceDetails/DetailsBanner';
import TaskerSlider from '@/components/routes/urgent-task/TaskerSlider';

const Page = () => {
    const params = useParams();
    const id = params?.id;

    const { data: service, error, isLoading } = useGetServiceByIdQuery(id ?? '', {
        skip: !id,
    });

    console.log(service)

    if (!id) return <p>Loading...</p>;
    if (isLoading) return <p>Loading service details...</p>;
    if (error) return <p>Error loading service details</p>;

    return (
        <div>
            <Navbar />
            <DetailsBanner service={service} />
            
            <div>
                <TaskerSlider service={service} />
            </div>
        </div>
    );
};

export default Page;
