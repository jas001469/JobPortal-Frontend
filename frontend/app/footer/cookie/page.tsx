"use client";

import { useState, useEffect } from "react";
import { Cookie, Info, Settings, Shield, Clock, Lock, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CookiePolicyPage() {
  const [activeSection, setActiveSection] = useState<string>("what-is-cookie");

  const sections = [
    { id: "what-is-cookie", title: "What is a Cookie", icon: Info },
    { id: "cookie-usage", title: "Cookie Usage", icon: Settings },
    { id: "types", title: "Types of Cookies", icon: Cookie },
    { id: "manage", title: "Managing Cookies", icon: Shield },
    { id: "retention", title: "Cookie Retention", icon: Clock },
    { id: "privacy", title: "Privacy & Cookies", icon: Lock },
    { id: "consent", title: "Your Consent", icon: CheckCircle },
    { id: "contact", title: "Contact Us", icon: AlertCircle },
  ];

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Use 'instant' instead of 'smooth' for immediate scroll to top
    });
  }, []);

  // Scroll to section when activeSection changes
  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 mb-16">
          {/* LEFT SIDE - TEXT */}
          <div>
            <div className="inline-flex items-center justify-center w-18 h-18 bg-amber-50 rounded-full mb-6">
              <Cookie className="h-10 w-10 text-amber-700" />
            </div>

            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>

            <p className="text-gray-600 max-w-xl">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Introduction Card */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How We Use Cookies
              </h2>
              <p className="text-gray-700 mb-6">
                This Cookie Policy explains how EdTrellis uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
              <div className="flex items-center text-amber-700 font-medium">
                <Cookie className="h-5 w-5 mr-2" />
                Transparency about our cookie usage
              </div>
            </div>
            <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center">
                  <Cookie className="h-16 w-16 text-amber-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-28 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 pb-3 border-b">
                Cookie Policy Sections
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${
                        activeSection === section.id
                          ? "bg-amber-50 text-amber-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
              
              {/* Related Policy Links */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Related Policies
                  </p>
                  <div className="space-y-2">
                    <Link 
                      href="/footer/privacy" 
                      className="flex items-center text-gray-600 hover:text-amber-700 transition px-4 py-2 rounded-lg hover:bg-white"
                    >
                      <Shield className="h-4 w-4 mr-3" />
                      Privacy Policy
                    </Link>
                    <Link 
                      href="/footer/terms" 
                      className="flex items-center text-gray-600 hover:text-amber-700 transition px-4 py-2 rounded-lg hover:bg-white"
                    >
                      <Info className="h-4 w-4 mr-3" />
                      Terms & Conditions
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              
              {/* Section 1: What is a Cookie (from Terms & Conditions) */}
              <section id="what-is-cookie" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-amber-700">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">What is a Cookie</h3>
                </div>
                
                <div className="ml-14">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                    <p className="text-gray-800 leading-relaxed">
                      A cookie is a piece of software code that an internet web site sends to your browser when you access information at that site. A cookie is stored as a simple text file on your computer or mobile device by a website's server and only that server will be able to retrieve or read the contents of that cookie.
                    </p>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    Cookies let you navigate between pages efficiently as they store your preferences, and generally improve your experience of a website. They help make websites work more effectively and provide valuable information to website owners.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        Session Cookies
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Temporary cookies that expire when you close your browser. They remember your actions during a single browsing session.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-blue-600 text-sm">⟲</span>
                        </div>
                        Persistent Cookies
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Remain on your device between browsing sessions. They remember your preferences and actions across multiple sites.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Cookie Usage (from Terms & Conditions) */}
              <section id="cookie-usage" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-amber-700">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Cookie Usage</h3>
                </div>
                
                <div className="ml-14">
                  <p className="text-gray-700 mb-6">
                    We may use following types of cookies in our Portal:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="font-bold text-amber-700">a</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
                          <p className="text-gray-700">
                            For anonymously remembering your computer or mobile device when you visit our website to keep track of browsing patterns, and track the pages you view. These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                          </p>
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <span className="bg-white px-3 py-1 rounded-full">_ga</span>
                            <span className="bg-white px-3 py-1 rounded-full ml-2">_gid</span>
                            <span className="bg-white px-3 py-1 rounded-full ml-2">_gat</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="font-bold text-blue-700">b</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Service Cookies</h4>
                          <p className="text-gray-700">
                            For helping us to make our website work efficiently, remembering your registration and login details, settings preferences. These cookies are essential for the functionality of the website and cannot be switched off in our systems.
                          </p>
                          <div className="mt-3 flex items-center text-sm text-gray-500">
                            <span className="bg-white px-3 py-1 rounded-full">session_id</span>
                            <span className="bg-white px-3 py-1 rounded-full ml-2">login_token</span>
                            <span className="bg-white px-3 py-1 rounded-full ml-2">preferences</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-5 bg-gray-50 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Third-Party Cookies</h4>
                    <p className="text-gray-700">
                      In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3: Types of Cookies */}
              <section id="types" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-amber-700">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Types of Cookies We Use</h3>
                </div>
                
                <div className="ml-14">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Strictly Necessary Cookies</h4>
                      <p className="text-gray-600 text-sm">
                        These cookies are essential for you to browse the website and use its features, such as accessing secure areas of the site. Without these cookies, services like shopping carts or e-billing cannot be provided.
                      </p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Performance Cookies</h4>
                      <p className="text-gray-600 text-sm">
                        These cookies collect information about how you use our website, for instance which pages you go to most often. This data may be used to optimize our website and make it easier for you to navigate.
                      </p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Functionality Cookies</h4>
                      <p className="text-gray-600 text-sm">
                        These cookies allow our website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.
                      </p>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Targeting/Advertising Cookies</h4>
                      <p className="text-gray-600 text-sm">
                        These cookies are used to deliver content that is more relevant to you and your interests. They may be used to deliver targeted advertisements or limit the number of times you see an advertisement.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Managing Cookies */}
              <section id="manage" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-amber-700">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Managing Cookies</h3>
                </div>
                
                <div className="ml-14">
                  <div className="bg-gray-900 text-white rounded-2xl p-8 mb-6">
                    <h4 className="text-xl font-bold mb-4">How to Control Cookies</h4>
                    <p className="text-gray-300 mb-6">
                      You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by adjusting your browser settings.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 rounded-xl p-4">
                        <h5 className="font-semibold mb-2">Google Chrome</h5>
                        <p className="text-sm text-gray-400">Settings → Privacy and Security → Cookies</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4">
                        <h5 className="font-semibold mb-2">Mozilla Firefox</h5>
                        <p className="text-sm text-gray-400">Options → Privacy & Security → Cookies</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4">
                        <h5 className="font-semibold mb-2">Safari</h5>
                        <p className="text-sm text-gray-400">Preferences → Privacy → Cookies</p>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-4">
                        <h5 className="font-semibold mb-2">Microsoft Edge</h5>
                        <p className="text-sm text-gray-400">Settings → Site permissions → Cookies</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                    <p className="text-amber-800">
                      <span className="font-bold">Note:</span> If you choose to reject cookies, you may still use our website, but your access to some functionality and areas may be restricted.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5: Cookie Retention */}
              <section id="retention" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-amber-700">5</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Cookie Retention Period</h3>
                </div>
                
                <div className="ml-14">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      The length of time a cookie stays on your device depends on whether it is a "session" or "persistent" cookie. Session cookies only last for the duration of your visit and are deleted when you close your browser. Persistent cookies stay on your device until they expire or are deleted.
                    </p>
                    
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-3">Typical Retention Periods:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-700"><strong>Session cookies:</strong> Deleted when you close your browser</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-700"><strong>Analytics cookies:</strong> Up to 2 years</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-700"><strong>Preference cookies:</strong> Up to 1 year</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3"></div>
                          <span className="text-gray-700"><strong>Security cookies:</strong> As long as necessary for security purposes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6: Privacy & Cookies */}
              <section id="privacy" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-amber-700">6</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Privacy & Cookies</h3>
                </div>
                
                <div className="ml-14">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <p className="text-blue-800 mb-4">
                      Our use of cookies is closely tied to our Privacy Policy. The information collected through cookies may be considered personal data under certain laws.
                    </p>
                    <p className="text-blue-800">
                      For more information about how we handle your personal data, please review our{' '}
                      <Link href="/footer/privacy" className="text-blue-700 font-medium hover:underline">
                        Privacy Policy
                      </Link>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7: Your Consent */}
              <section id="consent" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-amber-700">7</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Consent</h3>
                </div>
                
                <div className="ml-14">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <p className="text-gray-700 mb-4">
                      By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. When you first visit our website, you will be presented with a cookie banner that allows you to accept or manage your cookie preferences.
                    </p>
                    
                    <div className="flex items-center justify-center space-x-4 mt-6">
                      <button className="px-6 py-3 bg-amber-700 text-white rounded-xl font-medium hover:bg-amber-800 transition">
                        Accept All Cookies
                      </button>
                      <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition">
                        Manage Preferences
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      You can change your cookie preferences at any time by clicking the "Cookie Settings" link in the footer of our website.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 8: Contact Us */}
              <section id="contact" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="font-bold text-amber-700">8</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
                </div>
                
                <div className="ml-14">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8">
                    <p className="text-gray-700 mb-6">
                      If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                        <a href="mailto:privacy@edtrellis.com" className="text-amber-700 hover:underline">
                          support@edtrellis.com
                        </a>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Mailing Address</h4>
                        <p className="text-gray-700">
                          EdTrellis Global Private Limited<br />
                          204-A, West End Road Meerut Cantt<br />
                          Uttar Pradesh, India (250001)
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-amber-200">
                      <p className="text-sm text-gray-600">
                        This Cookie Policy was last updated on{' '}
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}