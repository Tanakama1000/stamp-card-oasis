
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (isSignup) {
        // Register new user
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: 'business_owner'
            }
          }
        });

        if (error) {
          setAuthError(error.message);
          return;
        }

        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });

        // After successful signup, navigate to admin page
        navigate('/admin');
      } else {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });

        if (error) {
          setAuthError(error.message);
          return;
        }

        toast({
          title: "Login Successful",
          description: "You've been logged in successfully!",
        });

        navigate('/admin');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <Card className="p-6 bg-white card-shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isSignup ? 'Sign Up' : 'Login'}
          </h2>
          
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignup && (
              <Input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : (isSignup ? 'Create Account' : 'Login')}
            </Button>
            <div className="text-center mt-4">
              <Button 
                type="button" 
                variant="link"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup 
                  ? 'Already have an account? Login' 
                  : 'Need an account? Sign Up'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthPage;
