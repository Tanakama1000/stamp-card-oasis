
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
}

const ErrorState = ({ 
  title = "Business Not Found",
  message = "The business you're looking for doesn't exist or the link is invalid."
}: ErrorStateProps) => {
  return (
    <div className="max-w-md mx-auto mt-12 text-center">
      <Card className="p-6 bg-white card-shadow">
        <div className="flex justify-center mb-4">
          <AlertCircle className="text-red-500 h-12 w-12" />
        </div>
        <div className="text-red-500 text-xl mb-4 font-bold">{title}</div>
        <p className="mb-6 text-gray-700">
          {message}
        </p>
        <div className="flex flex-col space-y-2">
          <Link to="/auth">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In / Sign Up</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full">Return Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ErrorState;
