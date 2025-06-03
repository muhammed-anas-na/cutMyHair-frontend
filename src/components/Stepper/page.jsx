// Step indicator component
const StepIndicator = ({ currentStep, totalSteps = 3 }) => {
    return (
      <div className="flex items-center justify-center gap-4 m-8">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center
              ${currentStep === index + 1 
                ? 'bg-[#CE145B] text-white' 
                : 'bg-white text-gray-400'}`}>
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className="w-16 h-[2px] bg-gray-300 mx-2" />
            )}
          </div>
        ))}
      </div>
    );
  };
  export default StepIndicator;