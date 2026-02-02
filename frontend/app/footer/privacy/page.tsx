"use client";

import { useState } from "react";
import { Shield, Lock, Eye, Globe, Database, Key, Bell, CheckCircle } from "lucide-react";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections = [
    { id: "overview", title: "Overview", icon: Shield },
    { id: "collection", title: "Information Collection", icon: Database },
    { id: "usage", title: "How We Use Information", icon: Eye },
    { id: "sharing", title: "Information Sharing", icon: Globe },
    { id: "security", title: "Data Security", icon: Lock },
    { id: "cookies", title: "Cookies Policy", icon: Key },
    { id: "rights", title: "Your Rights", icon: CheckCircle },
    { id: "updates", title: "Policy Updates", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-6">
            <Shield className="h-8 w-8 text-blue-700" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Introduction Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Protecting Your Privacy
              </h2>
              <p className="text-gray-700 mb-6">
                At EdTrellis, we are committed to protecting your personal information and being transparent about what we collect and how we use it. This Privacy Policy explains our practices regarding the collection, use, and disclosure of your information.
              </p>
              <div className="flex items-center text-blue-700 font-medium">
                <Lock className="h-5 w-5 mr-2" />
                Your privacy is our priority
              </div>
            </div>
            <div className="md:w-1/3 mt-6 md:mt-0 flex justify-center">
              <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="h-16 w-16 text-blue-700" />
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
                Policy Sections
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
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Need help understanding our privacy policy?
                  </p>
                  <a 
                    href="/footer/contact" 
                    className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium text-sm"
                  >
                    Contact our Privacy Team
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              
              {/* Overview Section */}
              <section id="overview" className="scroll-mt-24 mb-12">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                    <p className="text-gray-600">Our commitment to your privacy</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700">
                    EdTrellis Global Private Limited ("we", "our", or "us") operates the EdTrellis portal. This Privacy Policy describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of our platform.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">Scope and Consent</h3>
                    <p className="text-blue-800">
                      By using our services, you consent to the collection, use, and sharing of your personal information as described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Database className="h-6 w-6 text-blue-700" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Transparent Collection</h4>
                      <p className="text-gray-600 text-sm">We clearly explain what data we collect and why</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-6 w-6 text-blue-700" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Strong Security</h4>
                      <p className="text-gray-600 text-sm">Enterprise-grade security to protect your data</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-6 w-6 text-blue-700" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Your Control</h4>
                      <p className="text-gray-600 text-sm">You have control over your personal information</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Information Collection Section */}
              <section id="collection" className="scroll-mt-24 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Database className="h-6 w-6 text-blue-700 mr-3" />
                  Information We Collect
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Information You Provide</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Account Information: Name, email address, phone number, password</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Profile Information: Resume/CV, work experience, education, skills, preferences</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Communication Data: Messages, emails, and other communications</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <span>Payment Information: For premium services (processed through secure payment gateways)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Automatically Collected Information</h4>
                    <p className="text-blue-800 mb-3">
                      When you use our services, we automatically collect certain information, including:
                    </p>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span>Device Information: IP address, browser type, operating system</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span>Usage Data: Pages visited, time spent, click patterns</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span>Location Data: General location based on IP address</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                        <span>Cookies and Tracking Technologies</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information Section */}
              <section id="usage" className="scroll-mt-24 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Eye className="h-6 w-6 text-blue-700 mr-3" />
                  How We Use Your Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                    <h4 className="font-semibold text-green-900 mb-3">Service Provision</h4>
                    <ul className="space-y-2 text-green-800">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <span>Create and manage your account</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <span>Match candidates with job opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                        <span>Process payments for premium services</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
                    <h4 className="font-semibold text-purple-900 mb-3">Communication</h4>
                    <ul className="space-y-2 text-purple-800">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                        <span>Send important service updates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                        <span>Respond to your inquiries</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                        <span>Send job alerts and recommendations</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                    <h4 className="font-semibold text-orange-900 mb-3">Improvement & Analytics</h4>
                    <ul className="space-y-2 text-orange-800">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                        <span>Analyze usage patterns</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                        <span>Improve our services</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                        <span>Develop new features</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                    <h4 className="font-semibold text-red-900 mb-3">Security & Compliance</h4>
                    <ul className="space-y-2 text-red-800">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                        <span>Detect and prevent fraud</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                        <span>Comply with legal obligations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                        <span>Enforce our terms and conditions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Information Sharing Section */}
              <section id="sharing" className="scroll-mt-24 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Globe className="h-6 w-6 text-blue-700 mr-3" />
                  Information Sharing and Disclosure
                </h3>
                
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-yellow-900 mb-3">We Do NOT Sell Your Data</h4>
                  <p className="text-yellow-800">
                    We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-semibold text-gray-900 mb-2">With Your Consent</h4>
                    <p className="text-gray-700">
                      We share information when you give us explicit permission to do so, such as when you apply for a job and share your profile with employers.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                    <p className="text-gray-700">
                      We share information with trusted third-party service providers who assist us in operating our platform, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                    <p className="text-gray-700">
                      We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Security Section */}
              <section id="security" className="scroll-mt-24 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lock className="h-6 w-6 text-blue-700 mr-3" />
                  Data Security
                </h3>
                
                <div className="bg-gray-900 text-white rounded-2xl p-8 mb-6">
                  <h4 className="text-xl font-bold mb-4">Our Security Measures</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-2 text-blue-300">Technical Security</h5>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Encryption of sensitive data</li>
                        <li>• Regular security audits</li>
                        <li>• Secure server infrastructure</li>
                        <li>• DDoS protection</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2 text-blue-300">Administrative Security</h5>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Limited access to personal data</li>
                        <li>• Employee training on data protection</li>
                        <li>• Regular policy reviews</li>
                        <li>• Incident response plan</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700">
                    While we implement appropriate technical and organizational measures to protect your personal information, no security system is impenetrable. We cannot guarantee the security of our databases, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet.
                  </p>
                </div>
              </section>

              {/* Your Rights Section */}
              <section id="rights" className="scroll-mt-24 mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="h-6 w-6 text-blue-700 mr-3" />
                  Your Rights and Choices
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Access and Control</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-blue-700 font-bold">✓</span>
                        </div>
                        <span className="text-gray-700">Access your personal information</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-blue-700 font-bold">✓</span>
                        </div>
                        <span className="text-gray-700">Correct inaccurate data</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-blue-700 font-bold">✓</span>
                        </div>
                        <span className="text-gray-700">Request deletion of your data</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-blue-700 font-bold">✓</span>
                        </div>
                        <span className="text-gray-700">Object to processing of your data</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Communication Preferences</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-green-700 font-bold">✉</span>
                        </div>
                        <span className="text-gray-700">Manage email notifications</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-green-700 font-bold">🔔</span>
                        </div>
                        <span className="text-gray-700">Control job alert frequency</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-green-700 font-bold">⚙</span>
                        </div>
                        <span className="text-gray-700">Adjust privacy settings</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-green-700 font-bold">📱</span>
                        </div>
                        <span className="text-gray-700">Opt-out of marketing communications</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 rounded-xl p-6">
                  <p className="text-blue-800">
                    To exercise any of these rights, please contact us at{' '}
                    <a href="mailto:privacy@edtrellis.com" className="text-blue-700 font-medium hover:underline">
                      privacy@edtrellis.com
                    </a>
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
                  <p className="text-gray-700 mb-6">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact our Privacy Team:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                      <a href="mailto:privacy@edtrellis.com" className="text-blue-700 hover:underline">
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
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}