
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-2">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: May 4, 2025</p>
        </div>
        
        <div className="prose prose-blue max-w-none">
          <h2>1. Introduction</h2>
          <p>At InStamp ("we", "us", "our"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our loyalty program platform services ("Services").</p>
          
          <p>Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access our Services.</p>
          
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Data</h3>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul>
            <li>Register for an account as a business owner</li>
            <li>Sign up for a loyalty program as a customer</li>
            <li>Fill out forms on our platform</li>
            <li>Contact us for support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          
          <p>The personal information we collect may include:</p>
          <ul>
            <li>Contact information (name, email address, phone number)</li>
            <li>Business information (business name, address, industry)</li>
            <li>Account credentials (username, password)</li>
            <li>Payment information (processed through secure third-party payment processors)</li>
            <li>Customer loyalty data (visit history, purchase history, reward redemptions)</li>
          </ul>
          
          <h3>2.2 Usage Data</h3>
          <p>We automatically collect certain information when you visit, use, or navigate our platform. This information may include:</p>
          <ul>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage patterns (pages visited, time spent on pages, click patterns)</li>
            <li>Location data (if permitted by your device settings)</li>
            <li>Performance data (system crashes, feature usage statistics)</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our Services</li>
            <li>Improve, personalize, and expand our Services</li>
            <li>Understand how you use our Services</li>
            <li>Develop new features, products, and services</li>
            <li>Communicate with you about updates, security alerts, and support</li>
            <li>Process transactions and manage your account</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity</li>
            <li>Send marketing and promotional communications (with your consent)</li>
            <li>Respond to your comments or inquiries</li>
          </ul>
          
          <h2>4. How We Share Your Information</h2>
          <p>We may share your information in the following situations:</p>
          
          <h3>4.1 Business Users and End Users</h3>
          <p>When End Users (customers) participate in a Business User's (business owner's) loyalty program, relevant loyalty program data is shared between these parties to facilitate the loyalty program operations.</p>
          
          <h3>4.2 Third-Party Service Providers</h3>
          <p>We may share your information with third-party vendors, service providers, and other business partners who perform services on our behalf, such as:</p>
          <ul>
            <li>Payment processing</li>
            <li>Data analytics</li>
            <li>Email delivery</li>
            <li>Customer service</li>
            <li>Marketing</li>
            <li>Hosting and cloud storage</li>
          </ul>
          
          <h3>4.3 Legal Requirements</h3>
          <p>We may disclose your information where required to comply with applicable law, governmental requests, judicial proceedings, court orders, or legal process.</p>
          
          <h3>4.4 Business Transfers</h3>
          <p>If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
          
          <h2>5. Data Security</h2>
          <p>We implement appropriate technical and organizational security measures designed to protect your personal information from accidental loss, unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</p>
          
          <h2>6. Your Privacy Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>The right to access information we have about you</li>
            <li>The right to rectify inaccurate or incomplete information</li>
            <li>The right to erase your personal data (subject to certain conditions)</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          
          <p>To exercise these rights, please contact us using the details provided in the "Contact Us" section.</p>
          
          <h2>7. Cookie Policy</h2>
          <p>We use cookies and similar tracking technologies to track activity on our Services and store certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.</p>
          
          <h2>8. Children's Privacy</h2>
          <p>Our Services are not intended for individuals under the age of 18. We do not knowingly collect or solicit personal information from anyone under the age of 18. If you are under 18, please do not attempt to register for the Services or send any personal information about yourself to us.</p>
          
          <h2>9. International Data Transfers</h2>
          <p>Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. If you are located outside South Africa and choose to provide information to us, please note that we transfer the data to South Africa and process it there.</p>
          
          <h2>10. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>
          
          <h2>11. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:</p>
          <p>Email: tananakacamesgapara@gmail.com<br />
          Phone: +27 67 632 4068</p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
