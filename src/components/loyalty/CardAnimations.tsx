
import React from "react";

const CardAnimations: React.FC = () => {
  return (
    <style>
      {`
        @keyframes stamp-animation {
          0% { transform: scale(1); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        
        .stamp-animation {
          animation: stamp-animation 0.5s ease;
        }
        
        .pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-bounce-once {
          animation: bounce-once 0.5s ease-in-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}
    </style>
  );
};

export default CardAnimations;
