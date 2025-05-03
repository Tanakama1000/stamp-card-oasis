
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Award, Check, ChevronRight, Coffee, CreditCard, Gift, Heart, Mail, Phone, QrCode, Shield, Smartphone, Star, TrendingUp, Users } from "lucide-react";
import SlugChecker from "@/components/SlugChecker";
import useWindowSize from "@/hooks/useWindowSize";

const LandingPage = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  return (
    <div className="min-h-screen bg-white font-[Poppins]">
      {/* Header/Navigation */}
      <header className="bg-white text-slate-800 p-4 shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/09d9d85d-a5be-4ff5-8719-cc0a75ecc273.png" alt="InStamp Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">InStamp</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:flex" onClick={() => navigate("/admin")}>
              Log In
            </Button>
            <Button variant="heroGradient" onClick={() => navigate("/admin")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full opacity-60 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-50 rounded-full opacity-60 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-50 rounded-full opacity-60 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4 bg-blue-50 w-max px-3 py-1.5 rounded-full text-blue-600 text-sm font-medium">
                <span className="animate-pulse mr-2">●</span> Digital Stamp Cards Made Simple
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Build Customer <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Loyalty</span><br/>
                Drive <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Repeat Business</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                The modern digital loyalty platform for cafes, restaurants and small businesses. 
                No app downloads required, works on any device!
              </p>
              
              <div className="mb-8">
                <SlugChecker />
              </div>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check size={14} className="text-blue-600" />
                  </div>
                  <span className="text-slate-600">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check size={14} className="text-blue-600" />
                  </div>
                  <span className="text-slate-600">Easy setup in minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Check size={14} className="text-blue-600" />
                  </div>
                  <span className="text-slate-600">No app downloads</span>
                </div>
              </div>
            </div>
            
            {/* Hero image/illustration section */}
            <div className="relative">
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src="/lovable-uploads/03bd2d95-1cd4-4fba-8e3a-d6e467234380.png" 
                  alt="InStamp App Demo" 
                  className="max-w-full rounded-lg shadow-xl relative z-10"
                />
                
                {/* Floating cards elements */}
                <div className="absolute -top-12 -right-6 bg-white p-4 rounded-lg shadow-lg w-48 transform rotate-6 z-20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Star size={14} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Program</p>
                      <p className="text-sm font-medium">Reward Ready!</p>
                    </div>
                  </div>
                  <div className="h-2 bg-blue-50 rounded-full mt-3">
                    <div className="h-2 bg-blue-500 rounded-full w-full"></div>
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -left-6 bg-white p-4 rounded-lg shadow-lg z-20">
                  <div className="flex items-center gap-2">
                    <Coffee size={20} className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">+324 Stamps Today</p>
                      <p className="text-xs text-green-500">↑ 12% from yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with gradient background */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Trusted by Businesses Everywhere</h2>
            <p className="text-slate-600">Our digital stamp card system helps businesses build customer loyalty and increase revenue</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2.5M+</div>
              <div className="text-slate-600">Stamps Collected</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15k+</div>
              <div className="text-slate-600">Business Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-slate-600">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">35%</div>
              <div className="text-slate-600">Avg. Revenue Boost</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">POWERFUL FEATURES</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Everything You Need to Build Customer Loyalty</h2>
            <p className="text-lg text-slate-600">Our platform gives you all the tools to create, manage, and analyze your digital loyalty program.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-white border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                  <QrCode size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Digital Stamp Cards</h3>
                <p className="text-slate-600 mb-4">Create beautiful digital loyalty cards that work on any device without app downloads.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Customizable design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Works on all devices</span>
                  </li>
                </ul>
              </div>
            </Card>
            
            {/* Feature 2 */}
            <Card className="bg-white border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Analytics Dashboard</h3>
                <p className="text-slate-600 mb-4">Track customer engagement and program performance with real-time analytics.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Customer insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Revenue tracking</span>
                  </li>
                </ul>
              </div>
            </Card>
            
            {/* Feature 3 */}
            <Card className="bg-white border-0 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-5">
                  <Gift size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">Reward Management</h3>
                <p className="text-slate-600 mb-4">Create and manage rewards that keep customers coming back again and again.</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Flexible reward options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Automatic redemption</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">GETTING STARTED</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">How InStamp Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to launch your digital loyalty program</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Create Your Account</h3>
              <p className="text-slate-600">Sign up in minutes and customize your digital stamp card to match your brand.</p>
              
              {/* Connector line (only show on desktop) */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -ml-4 transform translate-x-2"></div>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Share Your Link</h3>
              <p className="text-slate-600">Invite customers to join your loyalty program via QR code or personalized link.</p>
              
              {/* Connector line (only show on desktop) */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200 -ml-4 transform translate-x-2"></div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">Reward Customers</h3>
              <p className="text-slate-600">Scan customer QR codes to add stamps and watch your customer loyalty grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Loved by Businesses & Customers</h2>
            <p className="text-lg text-slate-600">Join thousands of businesses that have increased customer retention with InStamp</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-white border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-4 text-yellow-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-slate-700">"Since implementing InStamp, we've seen a 35% increase in repeat customers. The digital loyalty cards are so much better than the paper ones we used to use!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  SJ
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Sarah Johnson</p>
                  <p className="text-xs text-slate-500">Bloom Coffee Shop</p>
                </div>
              </div>
            </Card>
            
            {/* Testimonial 2 */}
            <Card className="bg-white border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-4 text-yellow-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-slate-700">"The analytics alone made it worth switching to InStamp. We can now track which rewards drive customer loyalty and adjust our offerings accordingly."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                  MC
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Michael Chen</p>
                  <p className="text-xs text-slate-500">Urban Bakery</p>
                </div>
              </div>
            </Card>
            
            {/* Testimonial 3 */}
            <Card className="bg-white border border-gray-100 shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-4 text-yellow-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-slate-700">"Our customers love the convenience of digital stamp cards. No more lost paper cards, and they can check their progress anytime. It's a game-changer!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  AW
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Amanda Wilson</p>
                  <p className="text-xs text-slate-500">Sunshine Cafe</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-600">Choose the plan that works best for your business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="bg-white border border-gray-100 overflow-hidden shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Starter</h3>
                <div className="flex items-baseline mb-5">
                  <span className="text-3xl font-bold">$19</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <p className="text-slate-600 mb-6">Perfect for new businesses</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Up to 500 customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">1 loyalty card template</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Email support</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Button className="w-full" variant="heroGradient" onClick={() => navigate("/admin")}>
                  Get Started
                </Button>
              </div>
            </Card>
            
            {/* Growth Plan - Featured */}
            <Card className="bg-white border-2 border-blue-500 overflow-hidden shadow-2xl relative transform scale-105 z-10">
              <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center text-sm py-1 font-medium">
                MOST POPULAR
              </div>
              <div className="p-6 pt-10">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Growth</h3>
                <div className="flex items-baseline mb-5">
                  <span className="text-3xl font-bold">$49</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <p className="text-slate-600 mb-6">For established businesses</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Unlimited customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Advanced analytics & reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">3 custom card templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Priority email & chat support</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Button className="w-full" variant="heroGradient" size="lg" onClick={() => navigate("/admin")}>
                  Get Started
                </Button>
              </div>
            </Card>
            
            {/* Enterprise Plan */}
            <Card className="bg-white border border-gray-100 overflow-hidden shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-slate-800">Enterprise</h3>
                <div className="flex items-baseline mb-5">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-slate-500 ml-1">/month</span>
                </div>
                <p className="text-slate-600 mb-6">For multi-location businesses</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Unlimited customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Custom analytics & API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">Unlimited custom templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600">24/7 priority support</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Button className="w-full" variant="heroGradient" onClick={() => navigate("/admin")}>
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-slate-500">All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
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
      <footer className="bg-slate-900 text-white pt-16 pb-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/09d9d85d-a5be-4ff5-8719-cc0a75ecc273.png" alt="InStamp Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold">InStamp</span>
              </div>
              <p className="text-slate-400 mb-4">
                Helping businesses build customer loyalty with simple digital solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-slate-800 my-8" />
          
          <div className="text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} InStamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
