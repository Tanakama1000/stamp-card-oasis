
import React from "react";
import Layout from "@/components/Layout";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-slate-50 animate-fade-in">
        <Loader2 className="h-10 w-10 animate-spin text-[#5271ff]" />
        <p className="mt-6 text-lg text-[#5271ff] font-medium">Loading business details...</p>
      </div>
    </Layout>
  );
};

export default LoadingState;
