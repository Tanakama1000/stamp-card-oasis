
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CustomerAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // Redirect to last visited business or default
        const lastBusiness = localStorage.getItem('lastBusinessSlug');
        if (lastBusiness) {
          navigate(`/join/${lastBusiness}`);
        } else {
          navigate('/');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/customer-auth`,
            data: {
              full_name: customerName,
              user_type: 'customer'
            }
          }
        });
        
        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });
        
        // Check for confirmation
        if (data.user && !data.session) {
          toast({
            title: "Check your email",
            description: "We sent you a confirmation link. Please check your email.",
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }
        
        toast({
          title: "Login Successful",
          description: "You've been logged in successfully!",
        });
        
        // Redirect to last visited business or default
        const lastBusiness = localStorage.getItem('lastBusinessSlug');
        if (lastBusiness) {
          navigate(`/join/${lastBusiness}`);
        } else {
          navigate('/');
        }
      }
      
      setAuthLoading(false);
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      setAuthLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8 px-4">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {isSignup ? 'Create Account' : 'Login'}
            </h2>
            <p className="text-gray-600">
              {isSignup 
                ? 'Create an account to access loyalty cards and rewards' 
                : 'Welcome back! Login to access your loyalty cards'}
            </p>
          </div>
          
          {authError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleAuthSubmit} className="space-y-4">
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
              {authLoading 
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                : isSignup ? 'Create Account' : 'Login'}
            </Button>
            
            <div className="text-center mt-4">
              <Button 
                type="button" 
                variant="link"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup 
                  ? "Already have an account? Login" 
                  : "Don't have an account? Sign Up"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default CustomerAuth;
