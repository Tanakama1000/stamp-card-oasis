import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Image, Star, Gift, PieChart, ShieldCheck, Smartphone, Users, ChevronRight, Clock, Award, Mail, Phone } from "lucide-react";
const LandingPage = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-cream-light">
      {/* Header/Navigation */}
      <header className="bg-coffee-dark text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/04523b06-63b5-485f-ac7d-8624e600ad0d.png" alt="InStamp Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">InStamp</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate("/admin")}>
              Log In
            </Button>
            <Button className="bg-white text-coffee-dark hover:bg-white/90" onClick={() => navigate("/admin")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-coffee-light to-orange text-white">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Digital Loyalty Cards Made Simple for Your Business
            </h1>
            <p className="text-xl opacity-90">
              Increase customer retention and repeat business with our easy-to-use digital stamp card system.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-white text-coffee-dark hover:bg-white/90 text-lg px-8 py-6" onClick={() => navigate("/admin")}>
                Try It Free
              </Button>
              <Button variant="outline" className="border-white text-lg px-8 py-6 text-white bg-white/0">
                Schedule a Demo
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <Card className="overflow-hidden shadow-xl bg-white/10 backdrop-blur-sm border-white/20">
              <div className="h-64 md:h-80 bg-coffee-dark/20 flex items-center justify-center">
                <img src="/lovable-uploads/04523b06-63b5-485f-ac7d-8624e600ad0d.png" alt="InStamp Logo" className="h-24 w-24 opacity-75" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem → Solution Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-coffee-dark mb-8">
            Say Goodbye to Paper Loyalty Cards
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 text-left shadow-md border-coffee-light/20">
              <h3 className="text-xl font-semibold mb-4 text-coffee-dark">The Problems</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Customers always forget or lose paper cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>No data insights on your loyalty program</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>No way to message loyal customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">✗</span>
                  <span>Stamp fraud and forgery concerns</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6 text-left shadow-md border-coffee-light/20 bg-gradient-to-br from-slate-50 to-white">
              <h3 className="text-xl font-semibold mb-4 text-coffee-dark">Our Solution</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Digital cards that customers can't lose</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Detailed analytics on your loyalty program</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Direct messaging to loyal customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>Secure, tamper-proof digital stamps</span>
                </li>
              </ul>
            </Card>
          </div>
          
          <Button className="bg-coffee-dark hover:bg-coffee-medium text-white text-lg px-8 py-6" onClick={() => navigate("/admin")}>
            Start Solving These Problems Today
          </Button>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-cream-light">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-coffee-dark mb-2">Powerful Features for Your Business</h2>
          <p className="text-coffee-light mb-12 max-w-2xl mx-auto">
            Everything you need to run an effective loyalty program that keeps customers coming back
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white card-shadow">
              <div className="mb-4 text-coffee-dark">
                <Gift size={42} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">Digital Stamp Cards</h3>
              <p className="text-coffee-light">
                Fully customizable digital cards that match your brand and reward structure
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white card-shadow">
              <div className="mb-4 text-coffee-dark">
                <PieChart size={42} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">Analytics Dashboard</h3>
              <p className="text-coffee-light">
                Track program performance with data on stamps, rewards and customer engagement
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white card-shadow">
              <div className="mb-4 text-coffee-dark">
                <Smartphone size={42} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">QR Code System</h3>
              <p className="text-coffee-light">
                Simple scan-to-stamp system through QR codes - no app download required
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white card-shadow">
              <div className="mb-4 text-coffee-dark">
                <Users size={42} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">Customer Management</h3>
              <p className="text-coffee-light">
                Build customer profiles and track their loyalty program engagement
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white card-shadow">
              <div className="mb-4 text-coffee-dark">
                <Award size={42} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">Flexible Rewards</h3>
              <p className="text-coffee-light">
                Create milestone rewards, bonus stamps, and special promotions easily
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white card-shadow">
              <div className="mb-4 text-coffee-dark">
                <ShieldCheck size={42} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-coffee-dark">Secure & Reliable</h3>
              <p className="text-coffee-light">
                Fraud-proof stamp system with data backup and easy recovery
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Screenshots/Demo */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-coffee-dark mb-2">See It In Action</h2>
          <p className="text-coffee-light text-center mb-12 max-w-2xl mx-auto">
            Our intuitive interface makes managing your loyalty program simple
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden shadow-lg card-shadow">
              <div className="bg-coffee-dark text-white p-2 text-center font-semibold">
                Business Dashboard
              </div>
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <PieChart size={40} className="text-coffee-medium opacity-50" />
              </div>
            </Card>
            
            <Card className="overflow-hidden shadow-lg card-shadow">
              <div className="bg-coffee-dark text-white p-2 text-center font-semibold">
                Customer View
              </div>
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <Smartphone size={40} className="text-coffee-medium opacity-50" />
              </div>
            </Card>
            
            <Card className="overflow-hidden shadow-lg card-shadow">
              <div className="bg-coffee-dark text-white p-2 text-center font-semibold">
                Mobile Experience
              </div>
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <Users size={40} className="text-coffee-medium opacity-50" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-coffee-dark text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
          <p className="opacity-80 mb-12 max-w-2xl mx-auto">
            Businesses like yours are loving our digital loyalty solution
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-left">
              <div className="flex items-center gap-1 mb-3 text-yellow-300">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="mb-4">
                "Our customers love the digital cards! We've seen a 30% increase in repeat visits since switching from paper cards."
              </p>
              <div>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm opacity-80">Bloom Coffee House</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-left">
              <div className="flex items-center gap-1 mb-3 text-yellow-300">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
              </div>
              <p className="mb-4">
                "The analytics alone made it worth switching. I finally understand which rewards drive the most business!"
              </p>
              <div>
                <p className="font-semibold">Michael Chen</p>
                <p className="text-sm opacity-80">Urban Bakery</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-left">
              <div className="flex items-center gap-1 mb-3 text-yellow-300">
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} />
              </div>
              <p className="mb-4">
                "Setup was incredibly easy and the customer support team was there to help every step of the way."
              </p>
              <div>
                <p className="font-semibold">Jessica Williams</p>
                <p className="text-sm opacity-80">Sunset Salon</p>
              </div>
            </Card>
          </div>
          
          <div className="mt-12 inline-block border border-white/20 rounded-full px-6 py-2 bg-white/5">
            Trusted by 500+ businesses around the world
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-coffee-dark mb-2">Simple, Transparent Pricing</h2>
          <p className="text-coffee-light mb-12 max-w-2xl mx-auto">
            Choose a plan that works for your business
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 border border-coffee-light/20 hover:shadow-lg transition-shadow bg-white">
              <h3 className="text-xl font-bold text-coffee-dark mb-2">Starter</h3>
              <div className="text-3xl font-bold mb-1">$19<span className="text-sm font-normal">/month</span></div>
              <p className="text-coffee-light mb-6">Perfect for new businesses</p>
              <Separator className="mb-6" />
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Up to 500 customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>1 loyalty card template</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Email support</span>
                </li>
              </ul>
              <Button className="w-full bg-coffee-dark hover:bg-coffee-medium" onClick={() => navigate("/admin")}>
                Start Free Trial
              </Button>
            </Card>
            
            <Card className="p-6 border-2 border-coffee-light relative bg-white shadow-lg transform scale-105">
              <div className="absolute -top-4 left-0 right-0 mx-auto w-max bg-coffee-dark text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-coffee-dark mb-2">Growth</h3>
              <div className="text-3xl font-bold mb-1">$49<span className="text-sm font-normal">/month</span></div>
              <p className="text-coffee-light mb-6">For established businesses</p>
              <Separator className="mb-6" />
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Unlimited customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Advanced analytics & reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>3 custom card templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Priority email & chat support</span>
                </li>
              </ul>
              <Button className="w-full bg-coffee-dark hover:bg-coffee-medium" onClick={() => navigate("/admin")}>
                Start Free Trial
              </Button>
            </Card>
            
            <Card className="p-6 border border-coffee-light/20 hover:shadow-lg transition-shadow bg-white">
              <h3 className="text-xl font-bold text-coffee-dark mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-1">$99<span className="text-sm font-normal">/month</span></div>
              <p className="text-coffee-light mb-6">For multi-location businesses</p>
              <Separator className="mb-6" />
              <ul className="space-y-3 text-left mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Unlimited customers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Custom analytics & API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>Unlimited custom templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-coffee-dark mt-1">✓</span>
                  <span>24/7 priority support</span>
                </li>
              </ul>
              <Button className="w-full bg-coffee-dark hover:bg-coffee-medium" onClick={() => navigate("/admin")}>
                Contact Sales
              </Button>
            </Card>
          </div>
          
          <p className="mt-8 text-coffee-light">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-coffee-light to-orange text-white text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Loyalty Program?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that have increased customer retention with our digital loyalty system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="text-coffee-dark bg-white hover:bg-white/90 text-lg px-8 py-6" onClick={() => navigate("/admin")}>
              <span>Get Started Free</span>
              <ChevronRight />
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              <span>Book a Free Demo</span>
              <Clock />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="opacity-70 hover:opacity-100 transition-opacity">About Us</Link></li>
                <li><Link to="/features" className="opacity-70 hover:opacity-100 transition-opacity">Features</Link></li>
                <li><a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Careers</a></li>
                <li><a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Help Center</a></li>
                <li><a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Documentation</a></li>
                <li><a href="#" className="opacity-70 hover:opacity-100 transition-opacity">Pricing</a></li>
                <li><Link to="/privacy" className="opacity-70 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Mail size={18} className="flex-shrink-0 opacity-70" />
                  <a href="mailto:support@stampcardoasis.com" className="hover:underline">
                    support@stampcardoasis.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={18} className="flex-shrink-0 opacity-70" />
                  <a href="tel:+1234567890" className="hover:underline">
                    +1 (234) 567-890
                  </a>
                </li>
                <li>
                  <Button className="w-full mt-2 bg-white text-coffee-dark hover:bg-white/90" onClick={() => window.location.href = "https://wa.me/1234567890"}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.9 12C3.9 10.29 4.5 8.6 5.64 7.25L4.2 4L7.5 5.25C8.76 4.5 10.26 4 11.9 4C16.74 4 20.65 7.95 20.65 12.79C20.65 17.63 16.74 21.58 11.9 21.58C7.06 21.58 3.5 17.63 3.5 12.79C3.5 12.5 3.5 12.26 3.54 12H3.9L3.9 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.06 14.32L10.15 14.87C11.5 15.34 12.96 15.03 13.99 14C15.01 12.97 15.32 11.5 14.85 10.14L14.29 8.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Chat on WhatsApp
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-sm opacity-70">
              &copy; {new Date().getFullYear()} InStamp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default LandingPage;