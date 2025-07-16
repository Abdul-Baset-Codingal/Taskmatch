import GettingDone from "@/components/gettingDone/GettingDone";
import Banner from "@/components/home/Banner";
import HowTaskMatchWorks from "@/components/howTaskMatchWorks/HowTaskMatchWorks";
import PopularServices from "@/components/popularServices/PopularServices";
import TaskMatchApp from "@/components/taskMatchApp/TaskMatchApp";
import Testimonials from "@/components/testimonials/Testimonials";
import Navbar from "@/shared/Navbar";

export default function Home() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Banner />
      </div>
      <div className="mt-28">
        <PopularServices />
      </div>
      <div className="mt-28">
        <HowTaskMatchWorks />
      </div>
      <div className="mt-28">
        <GettingDone />
      </div>
      {/* <div className="mt-28">
        <RecentlyCompleted />
      </div> */}
      <div>
        <Testimonials />
      </div>
      <div className="mt-28">
        <TaskMatchApp />
      </div>
    </div>
  );
}
