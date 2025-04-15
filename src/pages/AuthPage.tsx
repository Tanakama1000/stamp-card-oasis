
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = isSignup 
        ? await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              data: {
                full_name: '', // Optional: Add logic to capture full name during signup
                user_type: 'business_owner'
              }
            }
          })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: isSignup ? "Account created successfully!" : "Logged in successfully!"
      });

      navigate('/admin');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <Card className="p-6 bg-white card-shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isSignup ? 'Sign Up' : 'Login'}
          </h2>
          <form onSubmit={handleAuth} className="space-y-4">
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
            <Button type="submit" className="w-full">
              {isSignup ? 'Create Account' : 'Login'}
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
