"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  ChevronRight
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubscribed(true);
    setEmail("");
    setLoading(false);
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info & Logo */}
         <div className="space-y-6">
  <div className="flex items-center space-x-1">
    {/* Logo Image - Larger version */}
    <div className="w-25 h-25 rounded-xl flex items-center justify-center overflow-hidden">
      <img 
        src="/edfooter1.png" 
        alt="EdTrellis Logo" 
        className="w-full h-full object-contain"
      />
    </div>
    <span className="text-4xl font-bold">EdTrellis</span>
  </div>
            
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting talent with opportunity. Find your dream job or the perfect candidate with our advanced hiring platform.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-red-700 rounded-full flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-red-700 rounded-full flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-red-700 rounded-full flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-gray-800 hover:bg-red-700 rounded-full flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/jobs/all-jobs" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/subscription" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link 
                  href="/employer/post-job" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  Post a Job
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800">
              Legal & Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/footer/terms" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  href="/footer/privacy" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/footer/faq" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/footer/contact" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  Contact Support
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="text-gray-400 hover:text-white flex items-center transition group"
                >
                  <ChevronRight size={16} className="mr-2 opacity-0 group-hover:opacity-100 transition" />
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 pb-2 border-b border-gray-800">
              Stay Updated
            </h3>
            
            <form onSubmit={handleSubscribe} className="mb-8">
              <p className="text-gray-400 text-sm mb-4">
                Subscribe to get job alerts and updates
              </p>
              
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-l-xl outline-none placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-r-xl transition disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : subscribed ? (
                    <span className="text-sm">✓</span>
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </div>
              
              {subscribed && (
                <p className="text-green-400 text-sm mt-2">
                  Thank you for subscribing!
                </p>
              )}
            </form>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-red-500 mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">support@edtrellis.com</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone size={18} className="text-red-500 mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">+91 123 456 7890</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-red-500 mt-1 shrink-0" />
                <span className="text-gray-400 text-sm">
                  204-A, West End Road Meerut Cantt<br />
                  Uttar Pradesh, India (250001)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} EdTrellis. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Sitemap
              </Link>
              <Link 
                href="/" 
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Accessibility
              </Link>
              <Link 
                href="/" 
                className="text-gray-400 hover:text-white text-sm transition"
              >
                Careers
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              EdTrellis is a registered trademark. All company names and logos are trademarks™ or registered® trademarks of their respective holders.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}