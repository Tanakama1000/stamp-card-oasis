
import React from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface LoginFormProps {
  isSignup: boolean;
  setIsSignup: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  customerName: string;
  setCustomerName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  authLoading: boolean;
  authError: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isSignup,
  setIsSignup,
  email,
  setEmail,
  password,
  setPassword,
  customerName,
  setCustomerName,
  onSubmit,
  authLoading,
  authError
}) => {
  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-1">
              {isSignup ? 'Create an Account' : 'Login'}
            </h2>
            <p className="text-gray-600">
              {isSignup 
                ? 'Join with an account to access loyalty cards and rewards' 
                : 'Welcome back! Login to access your loyalty cards'}
            </p>
          </div>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {authError}
            </div>
          )}
          
          <form onSubmit={onSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Your Name
                </label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={authLoading}
            >
              {authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignup ? 'Creating Account...' : 'Logging in...'}
                </>
              ) : (
                isSignup ? 'Create Account' : 'Login'
              )}
            </Button>
            
            <div className="text-center mt-4">
              <Button 
                type="button" 
                variant="link"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup 
                  ? 'Already have an account? Login' 
                  : "Don't have an account? Sign Up"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginForm;
