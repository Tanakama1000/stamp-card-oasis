
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { 
  Award, 
  Check, 
  ChevronRight,
  Coffee,
  CreditCard, 
  Gift, 
  Globe,
  Mail,
  Menu,
  Phone,
  QrCode, 
  Shield, 
  Star, 
  TrendingUp, 
  Users,
  X
} from "lucide-react";
import SlugChecker from "@/components/SlugChecker";
import useWindowSize from "@/hooks/useWindowSize";
import RewardsCard from "@/components/loyalty/RewardsCard";

const LandingPage = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white font-[Inter] overflow-x-hidden">
      {/* Header/Navigation */}
      <header className="bg-white text-slate-800 px-4 py-3 sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              alt="InStamp Logo" 
              className="h-10 w-auto" 
              src="/lovable-uploads/101a2884-0ac9-46b2-81e7-c566dea60886.png" 
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">InStamp</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav>
              <ul className="flex space-x-8">
                <li><a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">How It Works</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium">Pricing</a></li>
                <li><a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium">Testimonials</a></li>
              </ul>
            </nav>
            <div className="flex items-center gap-3">
              <Button 
                variant="outlineModern" 
                onClick={() => navigate("/admin")}
              >
                Log In
              </Button>
              <Button 
                variant="modern"
                onClick={() => navigate("/admin")}
              >
                Get Started
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-fade-in z-50">
            <nav className="container mx-auto py-4 px-6">
              <ul className="space-y-4 mb-6">
                <li><a href="#features" onClick={toggleMobileMenu} className="text-gray-600 block py-2">Features</a></li>
                <li><a href="#how-it-works" onClick={toggleMobileMenu} className="text-gray-600 block py-2">How It Works</a></li>
                <li><a href="#pricing" onClick={toggleMobileMenu} className="text-gray-600 block py-2">Pricing</a></li>
                <li><a href="#testimonials" onClick={toggleMobileMenu} className="text-gray-600 block py-2">Testimonials</a></li>
              </ul>
              <div className="space-y-3">
                <Button 
                  variant="outlineModern" 
                  onClick={() => navigate("/admin")}
                  className="w-full justify-center"
                >
                  Log In
                </Button>
                <Button 
                  variant="modern"
                  onClick={() => navigate("/admin")}
                  className="w-full justify-center"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white to-blue-50/30">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full opacity-60 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-50 rounded-full opacity-60 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-50 rounded-full opacity-60 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="flex items-center mb-4 bg-blue-50 w-max px-3 py-1.5 rounded-full text-blue-600 text-sm font-medium">
                <span className="animate-pulse mr-2">●</span> 
                Digital Loyalty Cards Made Simple
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Build Customer <span className="text-gradient-primary">Loyalty</span><br />
                Boost <span className="text-gradient-primary">Repeat Business</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Create digital loyalty programs that your customers will love. No app downloads required, works instantly on any device.
              </p>
              
              <div className="mb-8">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <SlugChecker className="overflow-hidden" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check size={14} className="text-blue-600" />
                  </div>
                  <span className="text-gray-600">No app downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check size={14} className="text-blue-600" />
                  </div>
                  <span className="text-gray-600">Setup in minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check size={14} className="text-blue-600" />
                  </div>
                  <span className="text-gray-600">Works on any device</span>
                </div>
              </div>
            </div>
            
            {/* Hero illustration */}
            <div className="relative animate-fade-in hidden lg:block">
              <div className="w-full h-full flex items-center justify-center perspective-1000">
                {/* Main device mockup */}
                <div className="relative z-20 shadow-2xl rounded-xl transform transition-all duration-500 hover:rotate-1 hover:scale-105">
                  <div className="relative overflow-hidden rounded-xl border-8 border-gray-800 shadow-lg">
                    <img 
                      src="/lovable-uploads/03bd2d95-1cd4-4fba-8e3a-d6e467234380.png" 
                      alt="InStamp App Demo" 
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-800"></div>
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 flex justify-center items-center">
                      <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-10 -right-6 bg-white p-4 rounded-lg shadow-xl w-48 transform rotate-6 z-20 animate-float">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      <Coffee size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Coffee Shop</p>
                      <p className="text-xs text-gray-500">Loyalty Card</p>
                    </div>
                  </div>
                  <div className="h-2 bg-blue-50 rounded-full mb-2">
                    <div className="h-2 bg-blue-600 rounded-full w-8/12"></div>
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={`stamp-${i}`} className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Check size={10} className="text-blue-600" />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats card */}
                <div className="absolute -bottom-8 -left-4 bg-white p-4 rounded-lg shadow-xl z-20 animate-float" style={{animationDelay: "0.5s"}}>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">35% Increase</p>
                      <p className="text-xs text-green-500">in repeat customers</p>
                    </div>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-gray-500 font-medium">TRUSTED BY BUSINESSES EVERYWHERE</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <img src="/lovable-uploads/26067f6a-e63b-4ab5-bd59-6e318bdf705d.png" alt="Company Logo" className="h-8 md:h-10" />
            </div>
            <div className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <img src="/lovable-uploads/e96cc08e-37f2-4ba1-bdf4-b00665a89d2d.png" alt="Company Logo" className="h-8 md:h-10" />
            </div>
            <div className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <img src="/lovable-uploads/ec60039d-0d09-4ec3-94ff-8e66e6c380a5.png" alt="Company Logo" className="h-8 md:h-10" />
            </div>
            <div className="grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
              <img src="/lovable-uploads/ea829b14-3811-434f-8770-4c7e1d35e177.png" alt="Company Logo" className="h-8 md:h-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature preview section */}
      <section id="features" className="py-20 bg-blue-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">
              BEAUTIFUL LOYALTY CARDS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Digital Loyalty Cards That Customers Love
            </h2>
            <p className="text-lg text-gray-600">
              Make your customers feel special with personalized loyalty cards that are always at their fingertips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
              <RewardsCard 
                rewardsCount={2}
                totalEarned={36}
                totalStamps={124}
                textColor="#3B82F6"
                accentColor="#EBF5FF"
              />
            </div>
            <div className="animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
              <RewardsCard 
                rewardsCount={4}
                totalEarned={52}
                totalStamps={205}
                textColor="#8B5CF6" 
                accentColor="#F3EEFF"
              />
            </div>
            <div className="animate-slide-in-left" style={{ animationDelay: "0.5s" }}>
              <RewardsCard 
                rewardsCount={3}
                totalEarned={29}
                totalStamps={98}
                textColor="#EC4899"
                accentColor="#FCE7F3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Proven Results for Business Growth</h2>
            <p className="text-gray-600">Our digital stamp card system drives measurable business results</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "2.5M+", label: "Stamps Collected", delay: 0 },
              { value: "15k+", label: "Business Users", delay: 1 },
              { value: "98%", label: "Customer Satisfaction", delay: 2 },
              { value: "35%", label: "Avg. Revenue Boost", delay: 3 }
            ].map((stat, index) => (
              <div key={index} className="text-center" style={{"--animation-order": stat.delay} as React.CSSProperties}>
                <div className="text-4xl font-bold text-blue-600 mb-2 animate-count">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">POWERFUL FEATURES</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Everything You Need for Customer Loyalty</h2>
            <p className="text-lg text-gray-600">Our platform gives you powerful tools to create, manage, and analyze your digital loyalty program.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <QrCode size={24} className="text-blue-600" />,
                title: "Digital Stamp Cards",
                description: "Create beautiful digital loyalty cards that work on any device without app downloads.",
                benefits: ["Customizable design", "Works on all devices", "Easy to setup and share"]
              },
              {
                icon: <TrendingUp size={24} className="text-blue-600" />,
                title: "Analytics Dashboard",
                description: "Track customer engagement and program performance with real-time analytics.",
                benefits: ["Customer insights", "Revenue tracking", "Performance metrics"]
              },
              {
                icon: <Gift size={24} className="text-blue-600" />,
                title: "Reward Management",
                description: "Create and manage rewards that keep customers coming back again and again.",
                benefits: ["Flexible reward options", "Automatic redemption", "Custom milestones"]
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 feature-card-hover">
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 rounded-l-full -translate-y-1/4 transform rotate-12 opacity-70"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">GETTING STARTED</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">How InStamp Works</h2>
            <p className="text-lg text-gray-600">Three simple steps to launch your digital loyalty program</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative">
            {/* Connecting lines (desktop only) */}
            <div className="hidden md:block absolute top-16 left-[25%] right-[25%] h-0.5 bg-blue-200"></div>
            
            <div className="relative text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Create Your Account</h3>
              <p className="text-gray-600">Sign up in minutes and customize your digital stamp card to match your brand.</p>
            </div>
            
            <div className="relative text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Share Your Link</h3>
              <p className="text-gray-600">Invite customers to join your loyalty program via QR code or personalized link.</p>
            </div>
            
            <div className="relative text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg relative z-10">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Reward Customers</h3>
              <p className="text-gray-600">Scan customer QR codes to add stamps and watch your customer loyalty grow.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="modern" 
              size="lg" 
              onClick={() => navigate("/admin")} 
              className="px-8"
            >
              Get Started Now
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600">Choose the plan that's right for your business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 transition-all duration-300">
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="text-lg font-medium text-gray-400 mb-1">Free</div>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-gray-800">$0</span>
                    <span className="text-gray-500 ml-1 mb-1">/month</span>
                  </div>
                  <p className="text-gray-500 mt-2">Perfect for small businesses just getting started</p>
                </div>
                
                <Separator className="my-4" />
                
                <ul className="space-y-3 mb-8">
                  {["1 Digital Loyalty Card", "Up to 100 customers", "Basic analytics", "Email support"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outlineModern" 
                  className="mt-auto w-full"
                  onClick={() => navigate("/admin")}
                >
                  Get Started
                </Button>
              </div>
            </Card>
            
            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 rounded-xl overflow-hidden shadow-xl relative transform scale-105">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1">
                MOST POPULAR
              </div>
              <div className="p-8 flex flex-col h-full">
                <div className="mb-4">
                  <div className="text-lg font-medium text-blue-600 mb-1">Pro</div>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-gray-800">$29</span>
                    <span className="text-gray-500 ml-1 mb-1">/month</span>
                  </div>
                  <p className="text-gray-500 mt-2">Perfect for growing businesses</p>
                </div>
                
                <Separator className="my-4" />
                
                <ul className="space-y-3 mb-8">
                  {[
                    "5 Digital Loyalty Cards",
                    "Unlimited customers",
                    "Advanced analytics",
                    "Priority support",
                    "Custom branding",
                    "Export customer data"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="modern" 
                  className="mt-auto w-full"
                  onClick={() => navigate("/admin")}
                >
                  Get Started
                </Button>
              </div>
            </Card>
            
            {/* Business Plan */}
            <Card className="border border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 transition-all duration-300">
              <div className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <div className="text-lg font-medium text-gray-400 mb-1">Business</div>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-gray-800">$99</span>
                    <span className="text-gray-500 ml-1 mb-1">/month</span>
                  </div>
                  <p className="text-gray-500 mt-2">For businesses with multiple locations</p>
                </div>
                
                <Separator className="my-4" />
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited Digital Cards",
                    "Unlimited customers",
                    "Enterprise analytics",
                    "24/7 priority support",
                    "Team management",
                    "API access",
                    "Custom integration"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outlineModern" 
                  className="mt-auto w-full"
                  onClick={() => navigate("/admin")}
                >
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Loved by Businesses & Customers</h2>
            <p className="text-lg text-gray-600">Join thousands of businesses that have increased customer retention with InStamp</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial cards */}
            <Card className="bg-white border border-gray-100 shadow-md p-6 hover:shadow-lg transition-all duration-300 rounded-xl">
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-gray-700">"Since implementing InStamp, we've seen a 35% increase in repeat customers. The digital loyalty cards are so much better than the paper ones we used to use!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  SJ
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Bloom Coffee Shop</p>
                </div>
              </div>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="bg-white border border-gray-100 shadow-md p-6 hover:shadow-lg transition-all duration-300 rounded-xl">
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-gray-700">"The analytics alone made it worth switching to InStamp. We can now track which rewards drive customer loyalty and adjust our offerings accordingly."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                  MC
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Michael Chen</p>
                  <p className="text-xs text-gray-500">Urban Bakery</p>
                </div>
              </div>
            </Card>
            
            {/* Testimonial 3 */}
            <Card className="bg-white border border-gray-100 shadow-md p-6 hover:shadow-lg transition-all duration-300 rounded-xl">
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-gray-700">"Our customers love the convenience of digital stamp cards. No more lost paper cards, and they can check their progress anytime. It's a game-changer!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  AW
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Amanda Wilson</p>
                  <p className="text-xs text-gray-500">Sunshine Cafe</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-white rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Loyalty Program?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of businesses that have increased customer retention and revenue with our digital loyalty platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-lg rounded-full" 
              size="xxl" 
              onClick={() => navigate("/admin")}
            >
              Get Started Free
              <ChevronRight size={20} />
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 text-lg rounded-full" 
              size="xxl" 
              onClick={() => navigate("/admin")}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/09d9d85d-a5be-4ff5-8719-cc0a75ecc273.png" alt="InStamp Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold">InStamp</span>
              </div>
              <p className="text-gray-400 mb-4">
                Helping businesses build customer loyalty with simple digital solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:hello@instamp.com" className="hover:text-white transition-colors flex items-center gap-2">
                    <Mail size={16} />
                    <span>hello@instamp.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+11234567890" className="hover:text-white transition-colors flex items-center gap-2">
                    <Phone size={16} />
                    <span>+1 (123) 456-7890</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors flex items-center gap-2">
                    <Globe size={16} />
                    <span>123 Business St, San Francisco, CA</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-gray-800 my-8" />
          
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} InStamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
