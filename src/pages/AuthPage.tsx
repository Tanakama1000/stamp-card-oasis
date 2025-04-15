
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Coffee, User, LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "signin" | "signup";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (userType === 'business') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, userType, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      // Navigation will happen in the useEffect hook based on userType
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: "business", // Default to business users for now
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Registration successful!",
        description: "Please check your email for the confirmation link.",
      });
      
      setMode("signin");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 flex items-center gap-2">
          <Coffee size={32} className="text-coffee-dark" />
          <h1 className="text-3xl font-bold text-coffee-dark">Stamp Card Oasis</h1>
        </div>
        
        <Card className="w-full max-w-md p-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-coffee-dark">
              {mode === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-coffee-light mt-2">
              {mode === "signin" 
                ? "Sign in to manage your loyalty program" 
                : "Sign up to create your own loyalty program"}
            </p>
          </div>
          
          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp}>
            {mode === "signup" && (
              <div className="mb-4">
                <Label htmlFor="name" className="mb-2 block">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-coffee-light" />
                  <Input
                    id="name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <Label htmlFor="email" className="mb-2 block">
                Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-coffee-light" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="password" className="mb-2 block">
                Password
              </Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-5 w-5 text-coffee-light" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-orange hover:bg-orange-dark text-white"
              disabled={loading}
            >
              {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            {mode === "signin" ? (
              <p className="text-coffee-light">
                Don't have an account?{" "}
                <button 
                  onClick={() => setMode("signup")}
                  className="text-orange hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-coffee-light">
                Already have an account?{" "}
                <button 
                  onClick={() => setMode("signin")}
                  className="text-orange hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthPage;
