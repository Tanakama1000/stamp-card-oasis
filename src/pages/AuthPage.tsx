
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('business_owner');
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
              user_type: userType
            },
            emailRedirectTo: `${window.location.origin}/auth`
          }
        });

        if (error) {
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }

        // Check if email confirmation is required
        if (data.user && !data.session) {
          // Email confirmation required - redirect to confirmation page
          navigate(`/email-confirmation?email=${encodeURIComponent(email)}`);
          return;
        }

        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });

        // After successful signup with immediate session, navigate to admin page
        navigate('/admin');
      } else {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });

        if (error) {
          setAuthError(error.message);
          setIsLoading(false);
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
              <>
                <Input 
                  type="text" 
                  placeholder="Full Name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <div className="space-y-2">
                  <Label htmlFor="user-type">Account Type</Label>
                  <Select 
                    value={userType} 
                    onValueChange={setUserType}
                  >
                    <SelectTrigger id="user-type">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business_owner">Business Owner</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
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
          </form>
          
          {!isSignup && (
            <div className="text-center mt-4">
              <Link 
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </Link>
            </div>
          )}
          
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
        </Card>
      </div>
    </Layout>
  );
};

export default AuthPage;
