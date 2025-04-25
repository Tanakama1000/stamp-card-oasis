
import React from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProgramNotAvailableProps {
  businessName: string;
}

const ProgramNotAvailable: React.FC<ProgramNotAvailableProps> = ({ businessName }) => {
  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 text-center">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-red-500 text-xl mb-4">Program Not Available</div>
          <p className="mb-6">
            The loyalty program for {businessName} is currently not available. 
            Please check back later.
          </p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </Card>
      </div>
    </Layout>
  );
};

export default ProgramNotAvailable;
