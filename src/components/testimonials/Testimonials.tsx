/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SectionHeader from "@/resusable/SectionHeader";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useGetTopTaskerReviewsQuery } from "@/features/auth/authApi";

const Testimonials = () => {
  const { data: reviews = [], isLoading, error } = useGetTopTaskerReviewsQuery(undefined);

  console.log(reviews)

  // Fallback reviews if none are fetched
  const fallbackReviews = [
    {
      reviewerName: "John Doe",
      message: "Exceptional tiling work and fixtures installation! Attention to detail transformed my outdated bathroom.",
      taskTitle: "Handyman",
      serviceTitle: "Bathroom Renovation",
      rating: 5,
      reviewerProfilePicture: "/Images/bannerImage1.jpg",
    },
    {
      reviewerName: "Thomas D.",
      message: "Left my home spotless! Amazing attention to detail, even cleaned areas I didn't mention.",
      taskTitle: "Deep Clean",
      serviceTitle: "House Cleaning",
      rating: 5,
      reviewerProfilePicture: "/Images/clientImage1.jpg",
    },
    {
      reviewerName: "Michael R.",
      message: "Fantastic at organizing my home office! Transformed my cluttered space into something functional.",
      taskTitle: "Home Organization",
      serviceTitle: "Decluttering",
      rating: 5,
      reviewerProfilePicture: "/Images/clientImage2.jpg",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <div className="w-full bg-[#FDF4F4] relative overflow-hidden py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Customers Say"
          description="Real stories from satisfied customers across the community"
        />

        {isLoading && <p className="text-center text-gray-600">Loading reviews...</p>}
        {error && <p className="text-center text-red-600">Error loading reviews</p>}

        <div className="mt-10">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 28 },
              1280: { slidesPerView: 4, spaceBetween: 32 },
            }}
          >
            {displayReviews.slice(0, 6).map((review: { rating: number; message: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; taskerProfilePicture: any; reviewerName: string; reviewerFirstName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; reviewerLastName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; taskTitle: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; service: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
              <SwiperSlide key={index}>
                <div className="p-6 border-[#8560F1] border-b-4 rounded-xl shadow-lg bg-white h-auto transition-all duration-300 hover:scale-[1.02] hover:border-[#E7B6FE]">
                  {/* Rating */}
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm sm:text-base mr-[2px] ${i < review.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="leading-relaxed italic mt-4 text-sm sm:text-base lg:text-lg">
                    &quot;{review.message}&quot;
                  </p>

                  <hr className="mt-4 border-purple-100" />

                  {/* User info */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-12 h-12 relative border-2 border-white shadow-lg shadow-purple-600 rounded-full overflow-hidden">
                      <Image
                        src={review.taskerProfilePicture
                          || "/Images/defaultUser.jpg"}
                        alt={review.reviewerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold">{review.reviewerFirstName} {review.reviewerLastName}</p>
                      <p className="text-xs sm:text-sm text-[#72757E]">
                        {review.taskTitle} {review.service}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;