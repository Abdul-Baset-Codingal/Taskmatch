import { FaClipboardList, FaCommentsDollar, FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    icon: <FaClipboardList className="text-3xl text-[#FF8906]" />,
    title: "Describe your task",
    description: "Tell us what you need done",
  },
  {
    icon: <FaCommentsDollar className="text-3xl text-[#FF8906]" />,
    title: "Get quotes from taskers",
    description: "Review offers from professionals",
  },
  {
    icon: <FaCheckCircle className="text-3xl text-[#FF8906]" />,
    title: "Choose and book",
    description: "Select your preferred tasker",
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-[#252531] py-12 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-xl max-w-6xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-10">
        How It Works
      </h2>

      <div className="grid md:grid-cols-1 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-[#1f1f29] p-8 rounded-2xl shadow-md border border-[#3b3b4b] transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[#FF8906]/50"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-[#FF8906]/10 rounded-full mb-6 mx-auto">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-2">
              {index + 1}. {step.title}
            </h3>
            <p className="text-gray-400 text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
