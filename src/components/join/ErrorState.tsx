
import React from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ErrorStateProps {
  errorMessage: string;
  businessActive?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, businessActive = true }) => {
  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 text-center">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-red-500 text-xl mb-4">
            {businessActive ? 'Business Not Found' : 'Program Not Available'}
          </div>
          <p className="mb-6">
            {businessActive 
              ? (errorMessage || "The business you're looking for doesn't exist or the link is invalid.")
              : "This loyalty program is currently not available. Please check back later."}
          </p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </Card>
      </div>
    </Layout>
  );
};

export default ErrorState;
