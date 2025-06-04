
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { toast } = useToast();
  
  const email = searchParams.get('email') || '';
  const confirmed = searchParams.get('confirmed') === 'true';

  const handleResendConfirmation = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No email address provided",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setResendSuccess(true);
        toast({
          title: "Email Sent",
          description: "New confirmation email has been sent.",
        });
      }
    } catch (error) {
      console.error('Resend confirmation error:', error);
      toast({
        title: "Error",
        description: "Failed to resend confirmation email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (confirmed) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-12">
          <Card className="p-6 bg-white card-shadow text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-coffee-dark">Email Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your email has been successfully verified. You can now access all features of your account.
            </p>
            <Link to="/auth">
              <Button className="w-full bg-coffee-medium hover:bg-coffee-dark">
                Continue to Login
              </Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <Card className="p-6 bg-white card-shadow text-center">
          <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-coffee-dark">Check Your Email</h2>
          
          {email ? (
            <p className="text-gray-600 mb-4">
              We've sent a confirmation email to <strong>{email}</strong>
            </p>
          ) : (
            <p className="text-gray-600 mb-4">
              We've sent you a confirmation email.
            </p>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 text-left">
                <p className="font-medium mb-1">Before you can sign in:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the confirmation link in the email</li>
                  <li>Return here to sign in</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {email && (
              <Button
                onClick={handleResendConfirmation}
                disabled={isResending || resendSuccess}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : resendSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Email Sent!
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Confirmation Email
                  </>
                )}
              </Button>
            )}
            
            <Link to="/auth">
              <Button variant="link" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Having trouble? Contact support for assistance.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default EmailConfirmationPage;
