/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import SectionHeader from "@/resusable/SectionHeader";
// import Image from "next/image";
// import { FaStar } from "react-icons/fa";
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import { useGetTopTaskerReviewsQuery } from "@/features/auth/authApi";

// const Testimonials = () => {
//   const { data: reviews = [], isLoading, error } = useGetTopTaskerReviewsQuery(undefined);

//   console.log(reviews)

//   // Fallback reviews if none are fetched
//   const fallbackReviews = [
//     {
//       reviewerName: "John Doe",
//       message: "Exceptional tiling work and fixtures installation! Attention to detail transformed my outdated bathroom.",
//       taskTitle: "Handyman",
//       serviceTitle: "Bathroom Renovation",
//       rating: 5,
//       reviewerProfilePicture: "/Images/bannerImage1.jpg",
//     },
//     {
//       reviewerName: "Thomas D.",
//       message: "Left my home spotless! Amazing attention to detail, even cleaned areas I didn't mention.",
//       taskTitle: "Deep Clean",
//       serviceTitle: "House Cleaning",
//       rating: 5,
//       reviewerProfilePicture: "/Images/clientImage1.jpg",
//     },
//     {
//       reviewerName: "Michael R.",
//       message: "Fantastic at organizing my home office! Transformed my cluttered space into something functional.",
//       taskTitle: "Home Organization",
//       serviceTitle: "Decluttering",
//       rating: 5,
//       reviewerProfilePicture: "/Images/clientImage2.jpg",
//     },
//   ];

//   const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

//   return (
//     <div className="w-full  relative overflow-hidden py-8">
//       <div className="mx-auto px-4 sm:p x-6 lg:px-8">
//         <SectionHeader
//           title="What Our Customers Say"
//           description="Real stories from satisfied customers across the community"
//         />

//         {isLoading && <p className="text-center text-gray-600">Loading reviews...</p>}
//         {error && <p className="text-center text-red-600">Error loading reviews</p>}

//         <div className="mt-10">
//           <Swiper
//             modules={[Pagination]}
//             spaceBetween={20}
//             slidesPerView={1}
//             pagination={{ clickable: true }}
//             breakpoints={{
//               640: { slidesPerView: 2, spaceBetween: 24 },
//               1024: { slidesPerView: 3, spaceBetween: 28 },
//               1280: { slidesPerView: 4, spaceBetween: 32 },
//             }}
//           >
//             {displayReviews.slice(0, 6).map((review: { rating: number; message: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; taskerProfilePicture: any; reviewerName: string; reviewerFirstName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; reviewerLastName: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; taskTitle: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; service: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
//               <SwiperSlide key={index}>
//                 <div className="p-6 border-[#2F6F69] border-b-4 rounded-xl shadow-lg bg-[#f2f7f7] h-auto transition-all duration-300 hover:scale-[1.02] ">
//                   {/* Rating */}
//                   <div className="flex items-center">
//                     {[...Array(5)].map((_, i) => (
//                       <FaStar
//                         key={i}
//                         className={`text-sm sm:text-base mr-[2px] ${i < review.rating ? "text-yellow-400" : "text-gray-300"
//                           }`}
//                       />
//                     ))}
//                   </div>

//                   {/* Testimonial text */}
//                   <p className="leading-relaxed italic mt-4 text-sm sm:text-base lg:text-lg">
//                     &quot;{review.message}&quot;
//                   </p>

//                   <hr className="mt-4 border-purple-100" />

//                   {/* User info */}
//                   <div className="flex items-center gap-3 mt-4">
//                     <div className="w-12 h-12 relative border-2 border-white shadow-lg shadow-[#2F6F69] rounded-full overflow-hidden">
//                       <Image
//                         src={review.taskerProfilePicture
//                           || "/Images/defaultUser.jpg"}
//                         alt={review.reviewerName}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div>
//                       <p className="text-sm sm:text-base font-semibold">{review.reviewerFirstName} {review.reviewerLastName}</p>
//                       <p className="text-xs sm:text-sm text-[#72757E]">
//                         {review.taskTitle} {review.service}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </div>
//     </div>
//   );
// };

// import SectionHeader from "@/resusable/SectionHeader";
// import Image from "next/image";
// import { BiSolidQuoteAltLeft } from "react-icons/bi";
// import { FaStar, FaStarHalfAlt } from "react-icons/fa";

// const Testimonials = () => {
//   return (
//     <div className="px-4 sm:px-8 lg:px-16">
//       <SectionHeader
//         title="What Our Customers Say"
//         description="Real stories from satisfied customers across the community"
//       />

//       <div className="flex justify-center mt-8">
//         <div className="flex flex-col lg:flex-row justify-between w-full max-w-[1300px] gap-6 lg:gap-5">

//           {/* Left Cards Section */}
//           <div className="w-full lg:w-[50%] space-y-5">
//             {/* Card 1 */}
//             <div className="color3 flex flex-col sm:flex-row items-center gap-4 rounded-2xl justify-between px-4 py-5 sm:px-5 sm:py-6">
//               <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden">
//                 <Image
//                   src="/Images/clientImage3.jpg"
//                   alt="Client"
//                   width={100}
//                   height={100}
//                   className="object-cover border-4 border-[#109C3D] rounded-full"
//                 />
//               </div>

//               <div className="w-full">
//                 <div className="flex justify-between items-start sm:items-center">
//                   <div>
//                     <h2 className="text-lg sm:text-2xl font-bold text2">
//                       Sara Lisbon
//                     </h2>
//                     <p className="text-sm sm:text-lg text-gray-800">Client</p>
//                   </div>
//                   <BiSolidQuoteAltLeft className="text2 text-3xl sm:text-5xl" />
//                 </div>

//                 <hr className="my-3 sm:my-5" />
//                 <p className="text-sm sm:text-base">
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                   Praesentium eius aspernatur repellendus, esse aut neque
//                   eligendi dolor.
//                 </p>
//               </div>
//             </div>

//             {/* Card 2 */}
//             <div className="color2 relative lg:left-6 flex flex-col sm:flex-row items-center gap-4 rounded-2xl justify-between px-4 py-5 sm:px-5 sm:py-6">
//               <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden">
//                 <Image
//                   src="/Images/clientImage3.jpg"
//                   alt="Client"
//                   width={100}
//                   height={100}
//                   className="object-cover border-4 border-white rounded-full"
//                 />
//               </div>

//               <div className="w-full">
//                 <div className="flex justify-between items-start sm:items-center">
//                   <div>
//                     <h2 className="text-lg sm:text-2xl font-bold text-white">
//                       Sara Lisbon
//                     </h2>
//                     <p className="text-sm sm:text-lg text-white">Client</p>
//                   </div>
//                   <BiSolidQuoteAltLeft className="text-white text-3xl sm:text-5xl" />
//                 </div>

//                 <hr className="my-3 sm:my-5 border-white/50" />
//                 <p className="text-white text-sm sm:text-base">
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                   Praesentium eius aspernatur repellendus, esse aut neque
//                   eligendi dolor.
//                 </p>
//               </div>
//             </div>

//             {/* Card 3 */}
//             <div className="color1 flex flex-col sm:flex-row items-center gap-4 rounded-2xl justify-between px-4 py-5 sm:px-5 sm:py-6">
//               <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden">
//                 <Image
//                   src="/Images/clientImage3.jpg"
//                   alt="Client"
//                   width={100}
//                   height={100}
//                   className="object-cover border-4 border-white rounded-full"
//                 />
//               </div>

//               <div className="w-full">
//                 <div className="flex justify-between items-start sm:items-center">
//                   <div>
//                     <h2 className="text-lg sm:text-2xl font-bold text-white">
//                       Sara Lisbon
//                     </h2>
//                     <p className="text-sm sm:text-lg text-white">Client</p>
//                   </div>
//                   <BiSolidQuoteAltLeft className="text-white text-3xl sm:text-5xl" />
//                 </div>

//                 <hr className="my-3 sm:my-5 border-white/50" />
//                 <p className="text-white text-sm sm:text-base">
//                   Lorem ipsum dolor sit amet consectetur adipisicing elit.
//                   Praesentium eius aspernatur repellendus, esse aut neque
//                   eligendi dolor.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Image Section */}
//           <div className="w-full lg:w-[50%] mt-6 lg:mt-0">
//             <div className="relative w-full max-w-[600px] mx-auto">
//               {/* Main Image */}
//               <Image
//                 src="/Images/taskMatch works.jpg"
//                 alt="TaskMatch Works"
//                 width={600}
//                 height={650}
//                 className="w-full h-auto lg:h-[620px] rounded-xl object-cover"
//               />

//               {/* Overlay Card */}
//               <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-[#063A41]/80 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg w-[90%] sm:w-[80%] flex flex-col sm:flex-row items-center justify-between border border-white">
//                 {/* Left: Tasker Images */}
//                 <div className="flex -space-x-3 sm:-space-x-4 mb-2 sm:mb-0">
//                   {["clientImage1.jpg", "clientImage2.jpg", "clientImage3.jpg"].map(
//                     (img, i) => (
//                       <div
//                         key={i}
//                         className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full border-2 border-white overflow-hidden"
//                       >
//                         <Image
//                           src={`/Images/${img}`}
//                           alt={`Tasker ${i + 1}`}
//                           width={50}
//                           height={50}
//                           className="object-cover"
//                         />
//                       </div>
//                     )
//                   )}
//                 </div>

//                 {/* Right: Rating */}
//                 <div className="text-center sm:text-right">
//                   <h3 className="text-lg sm:text-2xl font-bold">Happy Clients</h3>
//                   <p className="text-sm sm:text-[16px] mt-1 flex items-center justify-center sm:justify-end gap-1">
//                     4.5
//                     <FaStar className="text-yellow-400" />
//                     <FaStar className="text-yellow-400" />
//                     <FaStar className="text-yellow-400" />
//                     <FaStar className="text-yellow-400" />
//                     <FaStarHalfAlt className="text-yellow-400" />
//                   </p>
//                   <p className="text-[12px] sm:text-[14px] mt-1">3.6K reviews</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Testimonials;



"use client";

import SectionHeader from "@/resusable/SectionHeader";
import Image from "next/image";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useGetTopTaskerReviewsQuery } from "@/features/auth/authApi";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

const Testimonials = () => {
  const { data: reviews = [], isLoading, error } = useGetTopTaskerReviewsQuery(undefined);

  // Fallback data
  const fallbackReviews = [
    {
      reviewerFirstName: "John",
      reviewerLastName: "Doe",
      reviewerName: "John Doe",
      message: "Exceptional tiling work and fixtures installation! Attention to detail transformed my outdated bathroom.",
      service: "Bathroom Renovation",
      rating: 5,
      reviewerProfilePicture: "/Images/bannerImage1.jpg",
    },
    {
      reviewerFirstName: "Thomas",
      reviewerLastName: "D.",
      reviewerName: "Thomas D.",
      message: "Left my home spotless! Amazing attention to detail, even cleaned areas I didn't mention.",
      service: "House Cleaning",
      rating: 5,
      reviewerProfilePicture: "/Images/clientImage1.jpg",
    },
    {
      reviewerFirstName: "Michael",
      reviewerLastName: "R.",
      reviewerName: "Michael R.",
      message: "Fantastic at organizing my home office! Transformed my cluttered space into something functional.",
      service: "Decluttering",
      rating: 5,
      reviewerProfilePicture: "/Images/clientImage2.jpg",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackReviews;

  // Calculate average rating
  const averageRating =
    displayReviews.reduce((sum: any, r: { rating: any; }) => sum + (r.rating || 0), 0) / displayReviews.length;

  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating - fullStars >= 0.5;

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;

    for (let i = 0; i < full; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    if (hasHalf) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    return stars;
  };

  if (isLoading) return <p className="text-center py-10">Loading reviews...</p>;
  if (error) return <p className="text-center py-10 text-red-600">Failed to load reviews</p>;

  return (
    <section className="py-12 ">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeader
          title="What Our Customers Say"
          description="Real stories from happy clients across the community"
        />



        {/* Review Cards - Simple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {displayReviews.map((review: { reviewerName: string; reviewerFirstName: any; reviewerLastName: any; reviewerProfilePicture: any; taskerProfilePicture: any; rating: any; message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; service: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => {
            const name = review.reviewerName || `${review.reviewerFirstName} ${review.reviewerLastName}`.trim();
            const photo = review.reviewerProfilePicture || review.taskerProfilePicture || "/Images/defaultUser.jpg";

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col h-full"
              >
                {/* Header: Photo + Name + Quote Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-gray-200">
                      <Image
                        src={photo}
                        alt={name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
                      <p className="text-sm text-gray-500">Verified Tasker</p>
                    </div>
                  </div>
                  <BiSolidQuoteAltLeft className="text-4xl text1" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-3">
                  {renderStars(review.rating || 5)}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 flex-grow leading-relaxed">
                  "{review.message}"
                </p>

                {/* Service (optional) */}
                {review.service && (
                  <p className="text-sm text-gray-500 mt-4 italic">
                    Service: {review.service}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;