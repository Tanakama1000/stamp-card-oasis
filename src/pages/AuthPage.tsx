
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

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
        console.log("Signing up with:", { email, password, fullName, userType });
        
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType
            }
          }
        });

        if (error) {
          console.error("Signup error:", error);
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }

        console.log("Signup successful:", data);
        
        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        });

        // After successful signup, navigate to appropriate page based on user type
        if (userType === 'business_owner') {
          navigate('/admin');
        } else if (userType === 'super_admin') {
          navigate('/super-admin');
        } else {
          navigate('/');
        }
      } else {
        // Login existing user
        console.log("Logging in with:", { email, password });
        
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });

        if (error) {
          console.error("Login error:", error);
          setAuthError(error.message);
          setIsLoading(false);
          return;
        }

        console.log("Login successful:", data);
        
        toast({
          title: "Login Successful",
          description: "You've been logged in successfully!",
        });

        // Check user type and navigate accordingly
        const userType = data.user?.user_metadata?.user_type;
        
        if (userType === 'super_admin') {
          navigate('/super-admin');
        } else if (userType === 'business_owner') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
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
              <>
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input 
                    id="full-name"
                    type="text" 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
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
