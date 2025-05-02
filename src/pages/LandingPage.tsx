import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Star, Gift, PieChart, ShieldCheck, Smartphone, Users, ChevronRight, Clock, Award, Mail, Phone, Check, CreditCard, QrCode, AreaChart, TrendingUp, BadgeCheck, Zap, Heart } from "lucide-react";
import SlugChecker from "@/components/SlugChecker";
import useWindowSize from "@/hooks/useWindowSize";

const LandingPage = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-coffee-dark text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/04523b06-63b5-485f-ac7d-8624e600ad0d.png" alt="InStamp Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">InStamp</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate("/admin")}>
              Log In
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with more vibrant colors and gradients */}
      <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-r from-ocean-light/10 via-white to-ocean-DEFAULT/10">
        {/* New decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-ocean-DEFAULT/10 blur-3xl"></div>
          <div className="absolute top-60 -right-20 w-60 h-60 rounded-full bg-purple-400/10 blur-3xl"></div>
          <div className="absolute -bottom-40 left-1/4 w-80 h-80 rounded-full bg-ocean-DEFAULT/10 blur-3xl"></div>
          
          {/* Decorative patterns */}
          <div className="absolute top-20 left-10 opacity-20">
            <div className="grid grid-cols-3 gap-10">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-ocean-DEFAULT"></div>
              ))}
            </div>
          </div>
          
          <div className="absolute bottom-20 right-10 opacity-20">
            <div className="grid grid-cols-3 gap-10">
              {Array(9).fill(0).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-ocean-DEFAULT"></div>
              ))}
            </div>
          </div>
          
          {/* Wavy line decoration */}
          <svg className="absolute bottom-10 left-0 w-full opacity-10" height="30" viewBox="0 0 1920 30">
            <path d="M0,0 C320,30 420,30 640,15 C880,0 980,30 1200,15 C1440,0 1540,30 1760,15 C1980,0 1920,30 1920,30 L1920,30 L0,30 Z" fill="#0EA5E9"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              {/* Decorative element with enhanced styling */}
              <div className="mb-6 relative">
                <div className="w-16 h-16 bg-gradient-to-br from-ocean-DEFAULT to-ocean-dark rounded-lg rotate-12 relative shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center -rotate-12">
                    <img src="/lovable-uploads/04523b06-63b5-485f-ac7d-8624e600ad0d.png" alt="InStamp Logo" className="w-10 h-10 object-contain" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-300 rounded-full opacity-20 blur-md"></div>
              </div>
              
              {/* Enhanced heading with text shadow */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                Committed To <span className="text-gradient-primary">Loyalty</span><br/>
                Committed To <span className="text-ocean-DEFAULT drop-shadow-sm">The Future</span>
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 max-w-lg">
                Powerful digital stamp cards that increase customer retention and drive repeat business for businesses of all sizes.
              </p>
              
              {/* Updated slug checker component with shadow */}
              <div className="mb-8 relative">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-ocean-light opacity-20 rounded-full blur-xl"></div>
                <SlugChecker />
              </div>
              
              {/* Enhanced check items with better icons */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="text-slate-600 text-sm">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                    <Check size={12} className="text-green-600" />
                  </div>
                  <span className="text-slate-600 text-sm">No need previous knowledge</span>
                </div>
              </div>
            </div>
            
            {/* Right side with redesigned floating stat cards with enhanced shadows and gradients */}
            <div className="relative h-[550px] md:h-[550px] sm:h-[650px]">
              {/* Background decorative elements with gradients */}
              <div className="absolute -right-20 top-10 w-60 h-60 rounded-full bg-gradient-to-br from-ocean-light to-ocean-light/20 opacity-60 blur-xl"></div>
              <div className="absolute -left-10 bottom-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 opacity-60 blur-xl"></div>
              <div className="absolute right-40 bottom-20 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-50 opacity-50 blur-lg"></div>
              
              {/* Decorative curved line with gradient */}
              <div className="absolute left-20 top-40 w-[200px] h-[180px] border-4 border-ocean-light border-dashed rounded-full opacity-20 -z-10" 
                   style={{clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)"}}></div>
              
              {/* Enhanced Card with graph - positioned strategically for mobile and desktop */}
              <div className={`${isMobile ? "absolute left-1/2 transform -translate-x-1/2 top-0" : "absolute left-5 top-1/2 transform -translate-y-1/2"} max-w-[280px] animate-fade-in z-10`}>
                <Card className="bg-white p-5 shadow-xl rounded-2xl border-0 overflow-hidden hover-scale bg-gradient-to-br from-white to-ocean-light/5">
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Growth</h3>
                  <div className="h-40 flex items-end justify-between gap-2 mb-4 relative">
                    {/* Enhanced graph with gradient bars */}
                    {[35, 48, 30, 25, 35, 22, 40, 50].map((h, i) => (
                      <div key={i} className="w-6 rounded-t-md bg-gradient-to-t from-ocean-DEFAULT to-ocean-light shadow-inner" style={{height: `${h}%`}}>
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 opacity-20"></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </Card>
              </div>
              
              {/* Enhanced Top-right card with gradient - repositioned for mobile */}
              <div className={`${isMobile ? "absolute left-1/2 transform -translate-x-1/2 top-[220px]" : "absolute right-0 top-10"} max-w-[280px] animate-fade-in`} style={{animationDelay: "0.3s"}}>
                <Card className="bg-gradient-to-br from-white to-ocean-light/5 p-5 shadow-xl rounded-2xl w-64 border-0 overflow-hidden hover-scale">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-green-50 rounded-full shadow-sm">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-1">New Customers</p>
                      <h3 className="text-3xl font-bold mb-1">2,938</h3>
                      <p className="text-green-500 text-xs flex items-center gap-1">
                        <span>▲</span> 4.3% vs last month
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Enhanced Top card with gradient - repositioned for mobile */}
              <div className={`${isMobile ? "absolute left-1/2 transform -translate-x-1/2 top-[340px]" : "absolute right-1/2 transform translate-x-1/2 top-0"} max-w-[200px] animate-fade-in`} style={{animationDelay: "0.2s"}}>
                <Card className="bg-gradient-to-br from-white to-ocean-light/5 p-5 shadow-xl rounded-2xl border-0 overflow-hidden hover-scale">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-red-100 to-red-50 rounded-full shadow-sm">
                      <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-1">Loyalty Rate</p>
                      <h3 className="text-3xl font-bold mb-1">15.9k</h3>
                      <p className="text-green-500 text-xs flex items-center gap-1">
                        <span>▲</span> 2.1% vs last 7 days
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Enhanced Bottom-right card with gradient - repositioned for mobile */}
              <div className={`${isMobile ? "absolute left-1/2 transform -translate-x-1/2 top-[460px]" : "absolute right-10 bottom-20"} max-w-[280px] animate-fade-in`} style={{animationDelay: "0.4s"}}>
                <Card className="bg-gradient-to-br from-white to-ocean-light/5 p-5 shadow-xl rounded-2xl border-0 overflow-hidden hover-scale">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full shadow-sm">
                      <Gift className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-1">Stamps Collected</p>
                      <h3 className="text-3xl font-bold mb-1">256.18k</h3>
                      <p className="text-green-500 text-xs flex items-center gap-1">
                        <span>▲</span> 2.1% vs last week
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Enhanced decorative dots with animation */}
              <div className="absolute bottom-0 left-10 opacity-30">
                <div className="grid grid-cols-6 gap-2">
                  {Array(18).fill(0).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-ocean-DEFAULT animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Keep existing Features Section but update colors */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 text-coffee-dark">Why Businesses Choose InStamp</h2>
            <p className="text-gray-600">Powerful features designed to increase customer loyalty and streamline your rewards program.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-xl bg-gray-50 hover:bg-coffee-dark hover:text-white transition-all duration-300">
              <div className="bg-coffee-dark text-white group-hover:bg-white group-hover:text-coffee-dark w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                <QrCode size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Scanning</h3>
              <p className="text-gray-500 group-hover:text-white/80">Simple QR code scanning system that works on any smartphone without app downloads.</p>
            </div>
            
            <div className="group p-8 rounded-xl bg-gray-50 hover:bg-coffee-dark hover:text-white transition-all duration-300">
              <div className="bg-coffee-dark text-white group-hover:bg-white group-hover:text-coffee-dark w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Custom Loyalty Cards</h3>
              <p className="text-gray-500 group-hover:text-white/80">Create beautiful digital loyalty cards that match your brand and delight customers.</p>
            </div>
            
            <div className="group p-8 rounded-xl bg-gray-50 hover:bg-coffee-dark hover:text-white transition-all duration-300">
              <div className="bg-coffee-dark text-white group-hover:bg-white group-hover:text-coffee-dark w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                <AreaChart size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Powerful Analytics</h3>
              <p className="text-gray-500 group-hover:text-white/80">Track customer engagement and program performance with actionable insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Keep remaining sections the same */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-coffee-dark">How InStamp Works</h2>
            <p className="text-gray-600">Three simple steps to launch your digital loyalty program</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative">
              <div className="bg-coffee-dark text-white w-12 h-12 rounded-full flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">Create Your Account</h3>
              <p className="text-gray-600">Sign up in minutes and customize your digital loyalty program to match your brand.</p>
              <div className="absolute top-6 left-12 h-0.5 bg-coffee-light/30 w-full hidden md:block"></div>
            </div>
            
            <div className="relative">
              <div className="bg-coffee-dark text-white w-12 h-12 rounded-full flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">Share Your Link</h3>
              <p className="text-gray-600">Invite customers to join your loyalty program via a custom URL or QR code.</p>
              <div className="absolute top-6 left-12 h-0.5 bg-coffee-light/30 w-full hidden md:block"></div>
            </div>
            
            <div>
              <div className="bg-coffee-dark text-white w-12 h-12 rounded-full flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">Scan & Reward</h3>
              <p className="text-gray-600">Use your business device to scan customer QR codes and add stamps with each purchase.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-coffee-dark text-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Loved by Businesses & Customers</h2>
            <p className="text-white/80">Join thousands of businesses that have increased customer retention with InStamp</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-4 text-yellow-300">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-white/90">"We've seen a 35% increase in repeat customers since implementing InStamp. The digital cards are so much better than paper ones!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-300"></div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-xs text-white/70">Bloom Coffee Shop</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/10 border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-4 text-yellow-300">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-white/90">"The analytics alone made it worth switching. Now we understand which rewards drive customer loyalty and adjust accordingly."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-300"></div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-xs text-white/70">Urban Bakery</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/10 border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-4 text-yellow-300">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={i <= 4 ? 18 : 0} fill="currentColor" />)}
              </div>
              <p className="mb-6 text-white/90">"Our customers love that they don't have to download another app. The web-based system is so easy and convenient for everyone."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-300"></div>
                <div>
                  <p className="font-semibold">Jessica Williams</p>
                  <p className="text-xs text-white/70">Sunset Salon</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-coffee-dark">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">Choose the plan that works best for your business</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="relative overflow-hidden border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-coffee-dark">Starter</h3>
                <div className="text-3xl font-bold mb-1">$19<span className="text-sm font-normal text-gray-500">/month</span></div>
                <p className="text-gray-500 mb-6">Perfect for new businesses</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Up to 500 customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>1 loyalty card template</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Email support</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Button className="w-full bg-coffee-dark hover:bg-coffee-medium" onClick={() => navigate("/admin")}>
                  Start Free Trial
                </Button>
              </div>
            </Card>
            
            <Card className="relative overflow-hidden border-coffee-medium shadow-lg transform md:-translate-y-4 scale-105">
              <div className="absolute -top-4 left-0 right-0 mx-auto w-max bg-coffee-dark text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-coffee-dark">Growth</h3>
                <div className="text-3xl font-bold mb-1">$49<span className="text-sm font-normal text-gray-500">/month</span></div>
                <p className="text-gray-500 mb-6">For established businesses</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Unlimited customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Advanced analytics & reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>3 custom card templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Priority email & chat support</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Button className="w-full bg-coffee-dark hover:bg-coffee-medium" onClick={() => navigate("/admin")}>
                  Start Free Trial
                </Button>
              </div>
            </Card>
            
            <Card className="relative overflow-hidden border-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-coffee-dark">Enterprise</h3>
                <div className="text-3xl font-bold mb-1">$99<span className="text-sm font-normal text-gray-500">/month</span></div>
                <p className="text-gray-500 mb-6">For multi-location businesses</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Unlimited customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Custom analytics & API access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Unlimited custom templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-green-500 mt-1 flex-shrink-0" />
                    <span>24/7 priority support</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 border-t border-gray-100">
                <Button className="w-full bg-coffee-dark hover:bg-coffee-medium" onClick={() => navigate("/admin")}>
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
          
          <p className="text-center mt-6 text-gray-500">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-coffee-dark to-coffee-medium text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Loyalty Program?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join thousands of businesses that have increased customer retention with our digital loyalty system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-coffee-dark hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-lg" onClick={() => navigate("/admin")}>
              <span>Get Started Free</span>
              <ChevronRight />
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full" onClick={() => navigate("/admin")}>
              <span>Book a Demo</span>
              <Clock />
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-coffee-dark text-white pt-12 pb-6 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/04523b06-63b5-485f-ac7d-8624e600ad0d.png" alt="InStamp Logo" className="h-8 w-8" />
                <span className="text-xl font-bold">InStamp</span>
              </div>
              <p className="text-sm opacity-70 mb-4">
                Helping businesses build customer loyalty with simple digital solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-coffee-light transition-colors" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-coffee-light transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-coffee-light transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:text-coffee-light transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">Testimonials</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:text-coffee-light transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:text-coffee-light transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-coffee-light transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-white/10 my-6" />
          
          <div className="text-center text-sm opacity-70">
            <p>&copy; {new Date().getFullYear()} InStamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
