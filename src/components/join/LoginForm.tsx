
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coffee, LogIn, UserPlus, Loader2 } from "lucide-react";
import ReferralInput from "@/components/referral/ReferralInput";

interface LoginFormProps {
  isSignup: boolean;
  setIsSignup: (signup: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  onSubmit: (e: React.FormEvent, referralCode?: string) => void;
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
  const [referralCode, setReferralCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    onSubmit(e, referralCode);
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-center mb-6">
            <Coffee size={40} className="mx-auto mb-2 text-coffee-medium" />
            <h2 className="text-2xl font-bold mb-2 text-coffee-dark">
              {isSignup ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="text-coffee-medium">
              {isSignup ? 'Join the loyalty program' : 'Access your loyalty cards'}
            </p>
          </div>

          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <Input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {isSignup && (
              <ReferralInput
                businessId="signup"
                referralCode={referralCode}
                setReferralCode={setReferralCode}
              />
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={authLoading}
            >
              {authLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isSignup ? (
                <UserPlus size={20} />
              ) : (
                <LogIn size={20} />
              )}
              {authLoading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => setIsSignup(!isSignup)}
              className="text-coffee-medium hover:text-coffee-dark"
            >
              {isSignup 
                ? 'Already have an account? Sign In' 
                : 'Need an account? Sign Up'}
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginForm;
