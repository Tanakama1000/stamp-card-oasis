
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import LoginForm from './join/LoginForm';

interface AuthFormProps {
  businessId: string | null;
  businessName: string;
  isSignup: boolean;
  setIsAuthMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthForm: React.FC<AuthFormProps> = ({ 
  businessId, 
  businessName, 
  isSignup, 
  setIsAuthMode 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add a setter for isSignup
  const setIsSignup = (value: boolean) => {
    // If called from LoginForm, update isSignup and reset auth error
    setIsAuthMode(value);
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      if (isSignup) {
        // Signup flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: customerName
            }
          }
        });

        if (error) throw error;

        // If signup is successful and businessId is provided, create a business member
        if (businessId) {
          const { error: memberError } = await supabase
            .from('business_members')
            .insert([{ 
              business_id: businessId, 
              customer_name: customerName 
            }]);

          if (memberError) throw memberError;
        }

        toast({
          title: 'Account Created',
          description: 'Your account has been successfully created.',
        });

        navigate('/');
      } else {
        // Login flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        toast({
          title: 'Logged In',
          description: 'You have successfully logged in.',
        });

        navigate('/');
      }
    } catch (error: any) {
      setAuthError(error.message);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <LoginForm 
      isSignup={isSignup}
      setIsSignup={setIsSignup} // Pass the setter function
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      customerName={customerName}
      setCustomerName={setCustomerName}
      onSubmit={handleSubmit}
      authLoading={authLoading}
      authError={authError}
    />
  );
};

export default AuthForm;
