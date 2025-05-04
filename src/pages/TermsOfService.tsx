
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-2">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: May 4, 2025</p>
        </div>
        
        <div className="prose prose-blue max-w-none">
          <h2>1. Introduction</h2>
          <p>Welcome to InStamp ("Company", "we", "our", "us")! As you have clicked "I agree" to these Terms of Service, you have entered into a binding contract with InStamp. These Terms of Service, together with our Privacy Policy and any other documents referred to herein, govern your use of the InStamp platform, including all features, applications, and services offered through our website at instamp.co (collectively, the "Services").</p>
          
          <p>Please read these Terms carefully before using our Services. By accessing or using the Services, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Services.</p>
          
          <h2>2. Definitions</h2>
          <p>"Business User" refers to businesses that use our platform to create and manage loyalty programs.</p>
          <p>"End User" refers to customers of Business Users who participate in loyalty programs through our platform.</p>
          <p>"User", "you", and "your" refer to both Business Users and End Users, as applicable.</p>
          <p>"Content" includes text, graphics, logos, images, audio, video, software, and other material.</p>
          
          <h2>3. Account Registration and Eligibility</h2>
          <p>3.1. To access certain features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
          
          <p>3.2. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
          
          <p>3.3. You must be at least 18 years old to create a Business User account. End Users must comply with the minimum age requirements of their jurisdiction.</p>
          
          <h2>4. Subscription and Payments</h2>
          <p>4.1. Business Users may access the Services through a paid subscription plan. Details of subscription plans, including pricing and features, are available on our website.</p>
          
          <p>4.2. You agree to pay all fees associated with your subscription plan. All payments are non-refundable unless expressly stated otherwise in these Terms or required by applicable law.</p>
          
          <p>4.3. We may change our subscription fees at any time. Any price changes will be communicated to you in advance and will apply to the next billing cycle.</p>
          
          <h2>5. User Content</h2>
          <p>5.1. Our Services allow you to create, upload, post, send, and store content. You retain all rights in, and are solely responsible for, the content you post to the Services.</p>
          
          <p>5.2. By uploading content to the Services, you grant InStamp a non-exclusive, worldwide, royalty-free license to use, copy, modify, create derivative works based on, distribute, publicly display, and publicly perform your content in connection with operating and providing the Services.</p>
          
          <p>5.3. You represent and warrant that: (i) you own the content posted by you on or through the Services or otherwise have the right to grant the rights and licenses set forth in these Terms; (ii) your content does not violate the privacy rights, publicity rights, copyrights, trademark rights, or any other rights of any person or entity; and (iii) posting your content on or through the Services does not violate these Terms or any applicable law.</p>
          
          <h2>6. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Services for any illegal purpose or in violation of any local, state, national, or international law;</li>
            <li>Violate or encourage others to violate the rights of third parties, including intellectual property rights;</li>
            <li>Upload, post, or transmit any content that is illegal, fraudulent, defamatory, obscene, or otherwise objectionable;</li>
            <li>Interfere with or disrupt the Services or servers or networks connected to the Services;</li>
            <li>Attempt to gain unauthorized access to any portion of the Services or any other accounts, systems, or networks;</li>
            <li>Use any robot, spider, or other automated device or process to access the Services for any purpose;</li>
            <li>Impersonate another person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
            <li>Collect or store personal data about other users without their consent.</li>
          </ul>
          
          <h2>7. Intellectual Property</h2>
          <p>7.1. The Services and all Content, features, and functionality thereof (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by InStamp, its licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          
          <p>7.2. These Terms permit you to use the Services for your personal, non-commercial use, or legitimate business purposes related to your role as a Business User of InStamp. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as it is created and owned by you.</p>
          
          <h2>8. Termination</h2>
          <p>8.1. We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          
          <p>8.2. Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using the Services or contact us to request account deletion.</p>
          
          <h2>9. Limitation of Liability</h2>
          <p>9.1. In no event shall InStamp, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
          <ul>
            <li>Your access to or use of or inability to access or use the Services;</li>
            <li>Any conduct or content of any third party on the Services;</li>
            <li>Any content obtained from the Services; and</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
          </ul>
          
          <h2>10. Disclaimer</h2>
          <p>10.1. Your use of the Services is at your sole risk. The Services are provided on an "AS IS" and "AS AVAILABLE" basis. The Services are provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
          
          <h2>11. Changes to Terms</h2>
          <p>11.1. We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          
          <h2>12. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>Email: tananakacamesgapara@gmail.com<br />
          Phone: +27 67 632 4068</p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
