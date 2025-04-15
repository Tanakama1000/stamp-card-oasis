
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Coffee, Award, Zap, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();

  const navigateToAuth = () => {
    navigate("/auth");
  };

  // If user is logged in, redirect to appropriate page
  if (user) {
    if (userType === "business") {
      navigate("/admin");
      return null;
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between py-12 md:py-24">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-coffee-dark mb-4">
              Loyalty Made Simple
            </h1>
            <p className="text-lg text-coffee-light mb-8 max-w-lg">
              Create digital loyalty cards for your business. Engage customers, boost retention and increase sales with our easy-to-use platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Button 
                onClick={navigateToAuth}
                size="lg"
                className="bg-orange hover:bg-orange-dark text-white"
              >
                Get Started for Free
              </Button>
              <Button 
                onClick={() => navigate("/auth")}
                variant="outline" 
                size="lg"
                className="border-coffee-light text-coffee-dark hover:bg-cream"
              >
                Sign In
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mb-8 md:mb-0">
            <div className="bg-gradient-to-r from-coffee-light to-orange p-8 rounded-lg shadow-xl transform rotate-2">
              <LoyaltyCardPreview />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-cream rounded-lg my-16 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-coffee-dark mb-4">Why Choose Stamp Card Oasis?</h2>
            <p className="text-coffee-light max-w-xl mx-auto">
              Our platform provides everything you need to create and manage digital loyalty programs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Coffee className="text-orange h-10 w-10" />}
              title="Easy to Set Up"
              description="Create your custom loyalty cards in minutes with our intuitive design tools."
            />
            <FeatureCard 
              icon={<Users className="text-orange h-10 w-10" />}
              title="Grow Your Customer Base"
              description="Attract new customers and keep them coming back with engaging loyalty programs."
            />
            <FeatureCard 
              icon={<Award className="text-orange h-10 w-10" />}
              title="Insights & Analytics"
              description="Track customer engagement and measure the success of your loyalty program."
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16 my-8">
          <h2 className="text-3xl font-bold text-coffee-dark mb-4">Ready to Boost Your Business?</h2>
          <p className="text-coffee-light max-w-xl mx-auto mb-8">
            Join thousands of businesses already using Stamp Card Oasis to increase customer loyalty.
          </p>
          <Button 
            onClick={navigateToAuth}
            size="lg"
            className="bg-orange hover:bg-orange-dark text-white px-8"
          >
            <Zap className="mr-2 h-5 w-5" />
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </Layout>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="p-6 text-center hover:shadow-lg transition-shadow">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-coffee-dark mb-2">{title}</h3>
    <p className="text-coffee-light">{description}</p>
  </Card>
);

// Loyalty Card Preview Component
const LoyaltyCardPreview = () => (
  <div className="bg-white rounded-lg p-4 shadow-inner">
    <div className="flex justify-between items-center mb-4 border-b border-dashed border-coffee-light pb-2">
      <div>
        <h3 className="font-bold text-coffee-dark">SAMPLE LOYALTY CARD</h3>
        <p className="text-xs text-coffee-light">Collect stamps & earn rewards</p>
      </div>
      <Coffee className="text-coffee-dark h-8 w-8" />
    </div>
    
    <div className="grid grid-cols-5 gap-2 mb-4">
      {[...Array(10)].map((_, i) => (
        <div 
          key={i} 
          className={`aspect-square rounded-full border-2 ${i < 5 ? 'bg-orange border-orange-dark flex items-center justify-center' : 'border-coffee-light'}`}
        >
          {i < 5 && <Coffee className="h-4 w-4 text-white" />}
        </div>
      ))}
    </div>
    
    <div className="text-center text-xs text-coffee-light mt-4">
      <p>5 stamps to go until your next reward!</p>
    </div>
  </div>
);

export default Index;
