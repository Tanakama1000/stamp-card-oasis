
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Lock, CheckCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have the necessary tokens in the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated.",
        });
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-12">
          <Card className="p-6 bg-white card-shadow text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-coffee-dark">Password Updated!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You will be redirected to the login page shortly.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-coffee-medium hover:bg-coffee-dark"
            >
              Continue to Login
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <Card className="p-6 bg-white card-shadow">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-coffee-dark">Reset Your Password</h2>
            <p className="text-gray-600">
              Enter your new password below.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-coffee-medium hover:bg-coffee-dark"
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
