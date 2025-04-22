
import React from "react";
import Layout from "@/components/Layout";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-coffee-dark" />
        <p className="mt-4 text-coffee-light">Loading business details...</p>
      </div>
    </Layout>
  );
};

export default LoadingState;
