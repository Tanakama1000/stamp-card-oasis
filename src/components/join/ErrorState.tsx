
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ErrorState = () => {
  return (
    <div className="max-w-md mx-auto mt-12 text-center">
      <Card className="p-6 bg-white card-shadow">
        <div className="text-red-500 text-xl mb-4 font-bold">Business Not Found</div>
        <p className="mb-6 text-gray-700">
          The business you're looking for doesn't exist or the link is invalid.
        </p>
        <Link to="/">
          <Button className="bg-gray-900 hover:bg-gray-800">Return Home</Button>
        </Link>
      </Card>
    </div>
  );
};

export default ErrorState;
