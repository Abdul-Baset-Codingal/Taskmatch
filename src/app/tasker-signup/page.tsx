import TaskerBanner from "@/components/taskerBanner/TaskerBanner";
import MultiStepForm from "@/components/taskerSignUpForm/MultiStepForm";
import Navbar from "@/shared/Navbar";

const TaskerSignupPage = () => {
    return (
        <div>
            <Navbar />
            <TaskerBanner />
            <div>
                <MultiStepForm />
            </div>
        </div>
    );
};
export default TaskerSignupPage;