import React, { useState } from 'react';
import { getContentImageUrl } from '../../utils/imageUtils';
import './BuilderGuide.css';

const BuilderGuide = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to KitchenLux Kit Builder!",
      content: "Create your own custom kitchenware collection tailored to your vacation rental needs. Follow this quick guide to get started.",
      image: getContentImageUrl('welcome'),
    },
    {
      title: "Browse Items by Category",
      content: "Use the sidebar to filter items by category. You'll find knives, pans, utensils, and more.",
      image: getContentImageUrl('categories'),
    },
    {
      title: "Add Items to Your Kit",
      content: "Click 'Add to Kit' on any item you want to include. Adjust quantities as needed in your kit summary.",
      image: getContentImageUrl('add-items'),
    },
    {
      title: "Try a Template",
      content: "Not sure where to start? Use a template as a foundation and customize from there.",
      image: getContentImageUrl('templates'),
    },
    {
      title: "Save and Checkout",
      content: "Name your kit, save it for future use, and add it to your cart when you're ready to rent!",
      image: getContentImageUrl('checkout'),
    },
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="builder-guide-overlay">
      <div className="builder-guide">
        <button className="close-guide-btn" onClick={onClose}>×</button>

        <div className="guide-content">
          <div className="guide-image">
            <img src={steps[currentStep].image} alt={steps[currentStep].title} />
          </div>

          <div className="guide-text">
            <h3>{steps[currentStep].title}</h3>
            <p>{steps[currentStep].content}</p>
          </div>
        </div>

        <div className="guide-progress">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>

        <div className="guide-controls">
          <button
            className="btn btn-sm btn-outline"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          <button
            className="btn btn-sm"
            onClick={goToNextStep}
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuilderGuide;
