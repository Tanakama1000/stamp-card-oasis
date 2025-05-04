import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Award, Check, ChevronRight, Coffee, CreditCard, Gift, Globe, Mail, Menu, Phone, QrCode, Shield, Star, TrendingUp, Users, X } from "lucide-react";
import SlugChecker from "@/components/SlugChecker";
import useWindowSize from "@/hooks/useWindowSize";
import RewardsCard from "@/components/loyalty/RewardsCard";
const LandingPage = () => {
  const navigate = useNavigate();
  const {
    width
  } = useWindowSize();
  const isMobile = width < 768;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState<{
    [key: string]: boolean;
  }>({});
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  useEffect(() => {
    const sections = ['features', 'how-it-works', 'benefits', 'testimonials'];
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        setIsIntersecting(prev => ({
          ...prev,
          [entry.target.id]: entry.isIntersecting
        }));
      });
    };
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return <div className="min-h-screen bg-white font-['Inter'] overflow-x-hidden">
      {/* Header/Navigation */}
      <header className="bg-white text-slate-800 px-4 py-4 sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img alt="InStamp Logo" className="h-10 w-auto" src="/lovable-uploads/101a2884-0ac9-46b2-81e7-c566dea60886.png" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">InStamp</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav>
              <ul className="flex space-x-8">
                <li><a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">How It Works</a></li>
                <li><a href="#benefits" className="text-gray-600 hover:text-blue-600 font-medium">Benefits</a></li>
                <li><a href="#testimonials" className="text-gray-600 hover:text-blue-600 font-medium">Testimonials</a></li>
              </ul>
            </nav>
            <div className="flex items-center gap-3">
              <Button variant="outlineModern" size="pill" onClick={() => navigate("/admin")}>
                Log In
              </Button>
              <Button variant="vibrant" size="pill" onClick={() => navigate("/admin")}>
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
        {mobileMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-fade-in z-50">
            <nav className="container mx-auto py-4 px-6">
              <ul className="space-y-4 mb-6">
                <li><a href="#features" onClick={toggleMobileMenu} className="text-gray-600 block py-2">Features</a></li>
                <li><a href="#how-it-works" onClick={toggleMobileMenu} className="text-gray-600 block py-2">How It Works</a></li>
                <li><a href="#benefits" onClick={toggleMobileMenu} className="text-gray-600 block py-2">Benefits</a></li>
                <li><a href="#testimonials" onClick={toggleMobileMenu} className="text-gray-600 block py-2">Testimonials</a></li>
              </ul>
              <div className="space-y-3">
                <Button variant="outlineModern" onClick={() => navigate("/admin")} className="w-full justify-center">
                  Log In
                </Button>
                <Button variant="vibrant" onClick={() => navigate("/admin")} className="w-full justify-center">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden bg-gradient-to-b from-white to-blue-50/40">
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
                Turn Repeat Customers into Loyal Fans
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Build Customer <span className="text-gradient-vibrant">Loyalty</span><br />
                Boost <span className="text-gradient-vibrant">Repeat Business</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                The all-in-one digital loyalty solution that helps local businesses create, manage, and grow customer reward programs. No app downloads required.
              </p>
              
              <div className="mb-8 bg-white p-5 rounded-xl shadow-lg border border-blue-100/50">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Get your unique loyalty page:</h3>
                <SlugChecker className="overflow-hidden" />
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
              
              <div className="flex flex-wrap gap-4">
                <Button variant="cta" size="pillLg" onClick={() => navigate("/admin")} className="group">
                  Get Started Free
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
                <Button variant="outlineModern" size="pillLg" onClick={() => navigate("/")}>
                  See It In Action
                </Button>
              </div>
            </div>
            
            {/* Hero illustration */}
            <div className="relative animate-fade-in hidden lg:block">
              <div className="w-full h-full flex items-center justify-center perspective-1000">
                {/* Main device mockup */}
                <div className="relative z-20 shadow-2xl rounded-xl transform transition-all duration-500 hover:rotate-1 hover:scale-105">
                  <div className="relative overflow-hidden rounded-xl border-8 border-gray-800 shadow-lg">
                    <img src="/lovable-uploads/03bd2d95-1cd4-4fba-8e3a-d6e467234380.png" alt="InStamp App Demo" className="w-full h-auto" />
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
                    {[...Array(5)].map((_, i) => <div key={`stamp-${i}`} className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Check size={10} className="text-blue-600" />
                      </div>)}
                  </div>
                </div>
                
                {/* Stats card */}
                <div className="absolute -bottom-8 -left-4 bg-white p-4 rounded-lg shadow-xl z-20 animate-float" style={{
                animationDelay: "0.5s"
              }}>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">35% Increase</p>
                      <p className="text-xs text-green-500">in repeat customers</p>
                    </div>
                  </div>
                </div>

                {/* QR Code element */}
                <div className="absolute top-1/2 -right-8 bg-white p-3 rounded-lg shadow-xl z-20 animate-bounce-slow">
                  <div className="w-20 h-20 rounded-md bg-gray-200 flex items-center justify-center">
                    <QrCode size={48} className="text-gray-600" />
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

      {/* Features Section */}
      <section id="features" className="section-padding bg-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Everything Your Business Needs
            </h2>
            <p className="text-lg text-gray-600">
              Our platform gives you powerful tools to create, manage, and analyze your digital loyalty program
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            icon: <QrCode size={24} className="text-white" />,
            bgColor: "from-blue-500 to-blue-600",
            title: "Digital Loyalty Cards",
            description: "Create beautiful digital stamp cards that your customers can access on any device"
          }, {
            icon: <Gift size={24} className="text-white" />,
            bgColor: "from-purple-500 to-indigo-600",
            title: "Custom Rewards",
            description: "Set milestones and create custom rewards that keep your customers coming back"
          }, {
            icon: <TrendingUp size={24} className="text-white" />,
            bgColor: "from-pink-500 to-rose-600",
            title: "Analytics Dashboard",
            description: "Track visits, spending, and program performance with real-time insights"
          }, {
            icon: <Users size={24} className="text-white" />,
            bgColor: "from-teal-500 to-emerald-600",
            title: "Customer Engagement",
            description: "Build stronger relationships through personalized loyalty experiences"
          }].map((feature, index) => <Card key={index} className={`border-0 shadow-lg rounded-xl overflow-hidden staggered-fade-in staggered-delay-${index + 1} hover:shadow-xl transition-all duration-300 h-full`}>
                <div className="p-6 flex flex-col h-full">
                  <div className={`feature-icon-container from-${feature.bgColor.split(' ')[0]} to-${feature.bgColor.split(' ')[1]}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">
              SIMPLE PROCESS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">How InStamp Works</h2>
            <p className="text-lg text-gray-600">Start rewarding loyal customers in three easy steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[{
            step: 1,
            title: "Sign Up",
            description: "Create an account and customize your loyalty program to match your brand",
            icon: <CreditCard size={32} className="text-blue-600" />
          }, {
            step: 2,
            title: "Share With Customers",
            description: "Invite customers via QR code or your unique link to join your program",
            icon: <QrCode size={32} className="text-blue-600" />
          }, {
            step: 3,
            title: "Reward Loyalty",
            description: "Track visits, add stamps, and deliver rewards that keep them coming back",
            icon: <Award size={32} className="text-blue-600" />
          }].map((step, index) => <div key={index} className={`step-card bg-white staggered-fade-in staggered-delay-${index + 1}`}>
                <div className="step-number">{step.step}</div>
                <div className="flex flex-col items-center text-center pt-2">
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="section-padding bg-gradient-to-b from-blue-50/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">
              DOUBLE VALUE
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">For Businesses & Customers</h2>
            <p className="text-lg text-gray-600">Benefits that create a win-win loyalty experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="card-gradient p-8 shadow-lg rounded-xl staggered-fade-in staggered-delay-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard size={24} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold">For Businesses</h3>
              </div>
              
              <ul className="space-y-4">
                {["Increase customer retention by up to 35%", "Drive more repeat visits and higher spending", "Collect valuable customer data and insights", "Build stronger relationships with your audience", "Differentiate from competitors"].map((benefit, i) => <li key={i} className="flex items-start gap-3">
                    <Check size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>)}
              </ul>
            </Card>
            
            <Card className="card-gradient p-8 shadow-lg rounded-xl staggered-fade-in staggered-delay-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users size={24} className="text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold">For Customers</h3>
              </div>
              
              <ul className="space-y-4">
                {["Earn rewards at their favorite local businesses", "No need to download apps or carry physical cards", "Access loyalty program from any device", "Track progress toward rewards in real-time", "Discover exclusive offers and promotions"].map((benefit, i) => <li key={i} className="flex items-start gap-3">
                    <Check size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>)}
              </ul>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">
              SUCCESS STORIES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Loved by Businesses & Customers</h2>
            <p className="text-lg text-gray-600">Join thousands of businesses that have increased customer retention with InStamp</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[{
            quote: "Since implementing InStamp, we've seen a 35% increase in repeat customers. The digital loyalty cards are so much better than the paper ones we used to use!",
            author: "Sarah Johnson",
            business: "Bloom Coffee Shop",
            color: "bg-blue-50 border-blue-100"
          }, {
            quote: "The analytics alone made it worth switching to InStamp. We can now track which rewards drive customer loyalty and adjust our offerings accordingly.",
            author: "Michael Chen",
            business: "Urban Bakery",
            color: "bg-purple-50 border-purple-100"
          }, {
            quote: "Our customers love the convenience of digital stamp cards. No more lost paper cards, and they can check their progress anytime. It's a game-changer!",
            author: "Amanda Wilson",
            business: "Sunshine Cafe",
            color: "bg-amber-50 border-amber-100"
          }].map((testimonial, index) => <div key={index} className={`testimonial-card ${testimonial.color} staggered-fade-in staggered-delay-${index + 1}`}>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="mb-6 text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {testimonial.author.split(' ').map(name => name[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.author}</p>
                    <p className="text-xs text-gray-500">{testimonial.business}</p>
                  </div>
                </div>
              </div>)}
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
          <h2 className="text-4xl font-bold mb-6">Ready to Turn Visitors Into Loyal Fans?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of businesses that have increased customer retention and revenue with our digital loyalty platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg text-lg rounded-full" size="xxl" onClick={() => navigate("/admin")}>
              Get Started Free
              <ChevronRight size={20} />
            </Button>
            <Button variant="outline" size="xxl" onClick={() => navigate("/admin")} className="border-white text-white text-lg rounded-full bg-white/0">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm mt-4 opacity-80">No credit card required • Free 30-day trial • Setup in minutes</p>
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
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:tananakacamesgapara@gmail.com" className="hover:text-white transition-colors flex items-center gap-2">
                    <Mail size={16} />
                    <span>tananakacamesgapara@gmail.com</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+27676324068" className="hover:text-white transition-colors flex items-center gap-2">
                    <Phone size={16} />
                    <span>+27 67 632 4068</span>
                  </a>
                </li>
                <li>
                  <a href="https://paystack.com/pay/instamp" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                    <Globe size={16} />
                    <span>paystack.com/pay/instamp</span>
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
    </div>;
};
export default LandingPage;