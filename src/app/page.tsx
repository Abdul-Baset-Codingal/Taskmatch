// import GettingDone from "@/components/gettingDone/GettingDone";
// import Banner from "@/components/home/Banner";
// import HowTaskMatchWorks from "@/components/howTaskMatchWorks/HowTaskMatchWorks";
// import PopularServices from "@/components/popularServices/PopularServices";
// import TaskMatchApp from "@/components/taskMatchApp/TaskMatchApp";
// import Testimonials from "@/components/testimonials/Testimonials";
// import Navbar from "@/shared/Navbar";
// import banner from "../../public/Images/banner5.png";

// export default function Home() {
//   return (
//     <div>
//       {/* Container for Navbar and Banner with background image */}
//       <div
//         className="w-full bg-cover bg-center"
//         style={{
//           backgroundImage: `url(${banner.src})`,
//           minHeight: "calc(110px + 100%)", // Navbar height (110px) + Banner height
//         }}
//       >
//         <Navbar />
//         <Banner />
//       </div>
//       {/* Other sections with solid white background */}
//       <div className="mt-4 bg-white">
//         <PopularServices />
//       </div>
//       <div className="mt-4 lg:mt-10 bg-white">
//         <HowTaskMatchWorks />
//       </div>
//       <div className="mt-4 lg:mt-10 bg-white">
//         <GettingDone />
//       </div>
//       <div className="mt-4 lg:mt-14 bg-white">
//         <Testimonials />
//       </div>
//       <div className="mt-4 lg:mt-10 bg-white">
//         <TaskMatchApp />
//       </div>
//     </div>
//   );
// }


import GettingDone from "@/components/gettingDone/GettingDone";
import Banner from "@/components/home/Banner";
import HowTaskMatchWorks from "@/components/howTaskMatchWorks/HowTaskMatchWorks";
import PopularServices from "@/components/popularServices/PopularServices";
import TaskMatchApp from "@/components/taskMatchApp/TaskMatchApp";
import Testimonials from "@/components/testimonials/Testimonials";
import AdPopup from "@/shared/AdPopup";
import Footer from "@/shared/Footer";

export default function Home() {
  return (
    <div>
       {/* <div className="lg:block hidden">
        <Header/>
       </div> */}
      
      <AdPopup /> 
      <div className="color1 font-nunito">
        <Banner />
      </div>
      {/* Other sections with solid white background */}
      <div className="mt-4 bg-white">
        <PopularServices />
      </div>
      <div className="mt-4 lg:mt-16 bg-white">
        <HowTaskMatchWorks />
      </div>
      <div className="mt-4 lg:mt-10 bg-white">
        <GettingDone />
      </div>
      <div className="mt-4 lg:mt-14 bg-white">
        <Testimonials />
      </div>
      <div className="mt-4 lg:mt-14 bg-white">
        <TaskMatchApp />
      </div>
      <div className="mt-4 lg:mt-14">
         <Footer/>
      </div>
    </div>
  );
}