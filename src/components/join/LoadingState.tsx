
import React from "react";
import Layout from "@/components/Layout";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 animate-fade-in">
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-[#5271ff]" />
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#5271ff]"></div>
        </div>
        <p className="mt-6 text-lg text-[#5271ff] font-medium animate-pulse">Loading business details...</p>
        <div className="mt-4 w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#5271ff] animate-progress"></div>
        </div>
        <style jsx>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: progress 1.5s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default LoadingState;
