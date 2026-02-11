"use client";

import { useState } from "react";
import { ChevronDown, Search, HelpCircle, User, Briefcase, CreditCard, Shield, FileText, MessageSquare } from "lucide-react";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter(item => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const categories = [
    { id: "general", name: "General", icon: HelpCircle, color: "bg-blue-50", textColor: "text-blue-700" },
    { id: "candidate", name: "For Candidates", icon: User, color: "bg-green-50", textColor: "text-green-700" },
    { id: "employer", name: "For Employers", icon: Briefcase, color: "bg-red-50", textColor: "text-red-700" },
    { id: "account", name: "Account & Billing", icon: CreditCard, color: "bg-purple-50", textColor: "text-purple-700" },
    { id: "security", name: "Security & Privacy", icon: Shield, color: "bg-orange-50", textColor: "text-orange-700" },
    { id: "technical", name: "Technical Issues", icon: FileText, color: "bg-indigo-50", textColor: "text-indigo-700" },
  ];

  const faqs = {
    general: [
      {
        question: "What is EdTrellis?",
        answer: "EdTrellis is a comprehensive job portal that connects talented candidates with employers. We provide a platform for job searching, recruitment, and career development for both job seekers and companies."
      },
      {
        question: "Is EdTrellis free to use?",
        answer: "Yes, basic features are free for both candidates and employers. Candidates can create profiles, search jobs, and apply for free. Employers have access to basic posting features with our free plan, while premium features are available through our subscription plans."
      },
      {
        question: "How do I get started?",
        answer: "Getting started is easy! Simply click on 'Sign Up' in the top navigation, choose whether you're a candidate or employer, fill in your details, and you'll be ready to start using EdTrellis. No credit card required for the free plan."
      },
      {
        question: "Which countries does EdTrellis operate in?",
        answer: "Currently, EdTrellis primarily serves the Indian job market. However, we are expanding our services and welcome users from around the world. Most features are available globally, but some services may be region-specific."
      },
      {
        question: "How can I contact customer support?",
        answer: "You can reach our customer support team through the Contact Support page, email us at support@edtrellis.com, or call our support line at +91 98765 43210 during business hours (Monday to Friday, 9 AM to 6 PM IST)."
      },
      {
        question: "Do you have a mobile app?",
        answer: "Currently, EdTrellis is a web-based platform optimized for mobile browsers. We are developing native mobile apps for iOS and Android, which will be released soon. Stay tuned for updates!"
      }
    ],
    candidate: [
      {
        question: "How do I create an effective profile?",
        answer: "To create an effective profile:\n1. Upload a professional photo\n2. Complete all sections including education, experience, and skills\n3. Write a compelling professional summary\n4. Upload your resume\n5. Keep your profile updated regularly\n\nA complete profile increases your visibility to employers by 70%."
      },
      {
        question: "How can I apply for jobs?",
        answer: "To apply for jobs:\n1. Search for jobs using keywords, location, or filters\n2. Click on a job posting to view details\n3. Click 'Apply Now' or 'Quick Apply'\n4. Follow the application instructions\n5. Track your applications in your dashboard\n\nYou can apply to multiple jobs simultaneously."
      },
      {
        question: "Can I track my job applications?",
        answer: "Yes! All your job applications are tracked in your candidate dashboard. You can see:\n• Application status (Submitted, Viewed, Shortlisted, Rejected)\n• Employer activity\n• Interview schedules\n• Application history\n\nYou'll also receive email notifications for updates."
      },
      {
        question: "How do I set up job alerts?",
        answer: "To set up job alerts:\n1. Go to your profile settings\n2. Navigate to 'Job Alerts'\n3. Set your preferences (keywords, location, job type)\n4. Choose notification frequency (daily/weekly)\n5. Save your settings\n\nYou'll receive email notifications when matching jobs are posted."
      },
      {
        question: "Is my profile visible to all employers?",
        answer: "You can control your profile visibility in privacy settings:\n• Public: Visible to all registered employers\n• Private: Only visible to employers you apply to\n• Hidden: Not visible to any employers\n\nYou can change these settings anytime in your profile."
      }
    ],
    employer: [
      {
        question: "How do I post a job opening?",
        answer: "To post a job:\n1. Go to 'Post a Job' from your employer dashboard\n2. Fill in job details (title, description, requirements)\n3. Set location, salary, and job type\n4. Choose application method\n5. Review and publish\n\nFree plan allows limited postings. Upgrade for more features."
      },
      {
        question: "How can I search for candidates?",
        answer: "Use our advanced search features:\n• Search by skills, experience, education\n• Filter by location, availability\n• Use Boolean search operators\n• Save search criteria for future use\n\nPremium plans offer enhanced search capabilities."
      },
      {
        question: "What are the subscription plans for employers?",
        answer: "We offer three plans:\n1. Recruit Basic (Free): Basic posting and candidate management\n2. Talent Pro (₹499/month): Advanced features and analytics\n3. HR Master (₹799/month): Complete HR solution with premium support\n\nAll paid plans include a 7-day free trial."
      },
      {
        question: "How do I manage applications received?",
        answer: "Use our application management system:\n• View all applications in one dashboard\n• Shortlist, reject, or schedule interviews\n• Send bulk emails to candidates\n• Track application status\n• Generate reports\n\nThis streamlines your hiring process significantly."
      },
      {
        question: "Can I schedule interviews through EdTrellis?",
        answer: "Yes! Premium plans include interview scheduling:\n• Send interview invitations\n• Schedule multiple rounds\n• Integration with calendar apps\n• Automated reminders\n• Video interview options\n\nSaves time and improves candidate experience."
      }
    ],
    account: [
      {
        question: "How do I reset my password?",
        answer: "To reset your password:\n1. Click 'Log In' on the homepage\n2. Click 'Forgot Password?'\n3. Enter your registered email\n4. Check your email for reset link\n5. Create a new password\n\nIf you don't receive the email, check your spam folder or contact support."
      },
      {
        question: "How can I update my account information?",
        answer: "Update your account information:\n1. Log into your account\n2. Go to 'Account Settings'\n3. Click 'Edit Profile'\n4. Update your information\n5. Save changes\n\nSome changes may require verification for security purposes."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods:\n• Credit/Debit Cards (Visa, MasterCard, RuPay)\n• Net Banking\n• UPI Payments\n• Digital Wallets\n• International cards for global users\n\nAll payments are processed securely through encrypted channels."
      },
      {
        question: "How do I cancel my subscription?",
        answer: "To cancel your subscription:\n1. Go to 'Account Settings'\n2. Select 'Billing & Subscription'\n3. Click 'Cancel Subscription'\n4. Follow the prompts\n5. Receive confirmation\n\nYou can continue using premium features until the end of your billing cycle."
      },
      {
        question: "Will I get a refund if I cancel?",
        answer: "Refund policy:\n• 7-day free trial: No charges if cancelled within trial period\n• Monthly subscriptions: No refunds for partial months\n• Annual subscriptions: Pro-rated refunds available\n• Special circumstances: Contact support for assistance\n\nRefer to our Terms & Conditions for complete details."
      }
    ],
    security: [
      {
        question: "How is my data protected?",
        answer: "We use multiple layers of security:\n• 256-bit SSL encryption for all data transmission\n• Secure server infrastructure with regular audits\n• Two-factor authentication available\n• Regular security updates and patches\n• Compliance with data protection regulations\n\nYour privacy and security are our top priorities."
      },
      {
        question: "Who can see my personal information?",
        answer: "We strictly control data access:\n• Only necessary personnel have access\n• Employers see only information you choose to share\n• No selling of personal data to third parties\n• Anonymized data used for analytics\n• Complete transparency in data usage\n\nReview our Privacy Policy for detailed information."
      },
      {
        question: "How do I enable two-factor authentication?",
        answer: "Enable 2FA for enhanced security:\n1. Go to 'Account Settings'\n2. Select 'Security'\n3. Click 'Enable Two-Factor Authentication'\n4. Follow setup instructions\n5. Verify with your mobile device\n\nRecommended for all users, especially employers handling sensitive data."
      },
      {
        question: "What should I do if I suspect unauthorized access?",
        answer: "If you suspect unauthorized access:\n1. Immediately change your password\n2. Enable two-factor authentication\n3. Check recent account activity\n4. Contact our security team at security@edtrellis.com\n5. Review connected devices and sessions\n\nWe'll help secure your account and investigate."
      }
    ],
    technical: [
      {
        question: "The website isn't loading properly. What should I do?",
        answer: "Try these troubleshooting steps:\n1. Refresh the page (Ctrl+F5 for hard refresh)\n2. Clear browser cache and cookies\n3. Try a different browser\n4. Check your internet connection\n5. Disable browser extensions temporarily\n\nIf issues persist, contact technical support with error details."
      },
      {
        question: "I can't upload my resume. What's wrong?",
        answer: "Resume upload requirements:\n• File size: Maximum 5MB\n• Formats: PDF, DOC, DOCX\n• File name: Avoid special characters\n• Content: Ensure it's not password protected\n\nIf you meet these requirements but still can't upload, try:\n1. Renaming the file\n2. Saving in a different format\n3. Scanning for viruses\n4. Contacting support with file details"
      },
      {
        question: "Why am I not receiving email notifications?",
        answer: "If you're not receiving emails:\n1. Check your spam/junk folder\n2. Add notifications@edtrellis.com to contacts\n3. Verify your email address in account settings\n4. Check notification preferences\n5. Ensure mailbox isn't full\n\nYou can also enable SMS notifications as backup."
      },
      {
        question: "How do I delete my account permanently?",
        answer: "To delete your account:\n1. Go to 'Account Settings'\n2. Scroll to 'Account Management'\n3. Click 'Delete Account'\n4. Read the consequences carefully\n5. Confirm deletion\n\nNote: Account deletion is permanent and irreversible. All data will be removed according to our data retention policy."
      }
    ]
  };

  const currentFAQs = faqs[activeCategory as keyof typeof faqs];
  const filteredFAQs = currentFAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularFAQs = [
    { question: "How do I apply for jobs?", category: "candidate" },
    { question: "What are the subscription plans?", category: "employer" },
    { question: "How do I reset my password?", category: "account" },
    { question: "Is my data secure?", category: "security" },
    { question: "How do I contact support?", category: "general" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
       <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-30 mb-16">

  {/* LEFT SIDE - TEXT */}
  <div>
    <div className="inline-flex items-center justify-center w-18 h-18 bg-red-50 rounded-full mb-6">
      <HelpCircle className="h-10 w-10 text-red-700" />
    </div>

    <h1 className="text-6xl font-bold text-gray-900 mb-4">
      Frequently Asked Questions
    </h1>

    <p className="text-gray-600 max-w-xl">
      Find quick answers to common questions about using EdTrellis. 
      Can't find what you're looking for?
      <a
        href="/footer/contact"
        className="text-red-700 font-medium hover:underline ml-1"
      >
        Contact our support team
      </a>
    </p>
  </div>

  {/* RIGHT SIDE - IMAGE */}
 <div className="flex justify-center">
  <div className="w-95 h-95 rounded-full overflow-hidden shadow-lg">
    <img
      src="/photo2.JPG"
      alt="Education illustration"
      className="w-full h-full object-cover"
    />
  </div>
</div>
</div>


        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-2xl focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-center text-gray-500 text-sm mt-3">
            Search through {Object.values(faqs).flat().length} frequently asked questions
          </p>
        </div>

        {/* Popular FAQs */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 text-red-700 mr-3" />
            Popular Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularFAQs.map((faq, index) => {
              const category = categories.find(cat => cat.id === faq.category);
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveCategory(faq.category);
                    const faqIndex = faqs[faq.category as keyof typeof faqs].findIndex(f => f.question === faq.question);
                    if (faqIndex !== -1) {
                      toggleItem(faqIndex);
                    }
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-red-200 hover:shadow-md transition group"
                >
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${category?.color} flex-shrink-0`}>
                      {category && <category.icon className={`h-5 w-5 ${category.textColor}`} />}
                    </div>
                    <div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${category?.color} ${category?.textColor} mb-2 inline-block`}>
                        {category?.name}
                      </span>
                      <h3 className="font-medium text-gray-900 group-hover:text-red-700 transition">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Categories Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-28 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 pb-3 border-b">
                FAQ Categories
              </h3>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center ${
                        activeCategory === category.id
                          ? `${category.color} ${category.textColor} font-medium`
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {category.name}
                      <span className="ml-auto text-sm text-gray-500">
                        {faqs[category.id as keyof typeof faqs]?.length || 0}
                      </span>
                    </button>
                  );
                })}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Still have questions?
                  </p>
                  <a 
                    href="/footer/contact" 
                    className="inline-flex items-center justify-center w-full bg-red-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-800 transition text-sm"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Category Header */}
              <div className="flex items-center mb-8">
                {categories.map((category) => {
                  if (category.id === activeCategory) {
                    const Icon = category.icon;
                    return (
                      <>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${category.color}`}>
                          <Icon className={`h-6 w-6 ${category.textColor}`} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{category.name} FAQs</h2>
                          <p className="text-gray-600">
                            {filteredFAQs.length} questions in this category
                          </p>
                        </div>
                      </>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Search Results Info */}
              {searchQuery && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <p className="text-blue-800">
                    Found <span className="font-bold">{filteredFAQs.length}</span> results for "<span className="font-bold">{searchQuery}</span>"
                    {filteredFAQs.length === 0 && (
                      <span className="ml-2">Try different keywords or browse categories</span>
                    )}
                  </p>
                </div>
              )}

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-xl overflow-hidden hover:border-red-200 transition"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-red-700 font-bold">Q</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-lg pr-8">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${
                          expandedItems.includes(index) ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedItems.includes(index) && (
                      <div className="px-6 pb-6">
                        <div className="flex">
                          <div className="w-8 flex justify-center mr-4">
                            <div className="w-0.5 h-full bg-gray-200"></div>
                          </div>
                          <div className="flex-1 pt-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-4">
                              <span className="text-green-700 font-bold">A</span>
                            </div>
                            <div className="text-gray-700 whitespace-pre-line bg-gray-50 rounded-xl p-5">
                              {faq.answer}
                            </div>
                            {index === 0 && activeCategory === "candidate" && (
                              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <p className="text-sm text-blue-800">
                                  💡 <span className="font-medium">Pro Tip:</span> Complete profiles receive 3x more employer views!
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* No Results Message */}
              {filteredFAQs.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We couldn't find any FAQs matching "<span className="font-medium">{searchQuery}</span>". Try different keywords or browse the categories.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-6 py-3 bg-red-700 text-white font-medium rounded-xl hover:bg-red-800 transition"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Help Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Still Need Help?</h3>
                    <p className="text-gray-700 mb-4">
                      Our support team is ready to assist you with any questions not covered in our FAQs.
                    </p>
                    <a 
                      href="/footer/contact" 
                      className="inline-flex items-center text-red-700 hover:text-red-800 font-medium"
                    >
                      Contact Support Team
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Browse Documentation</h3>
                    <p className="text-gray-700 mb-4">
                      Check out our comprehensive guides and tutorials for detailed instructions.
                    </p>
                    <a 
                      href="#" 
                      className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
                    >
                      View Help Center
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-900 mb-4">Related Pages</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a 
                    href="/footer/terms" 
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 flex items-center transition"
                  >
                    <FileText className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Terms & Conditions</span>
                  </a>
                  <a 
                    href="/footer/privacy" 
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 flex items-center transition"
                  >
                    <Shield className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Privacy Policy</span>
                  </a>
                  <a 
                    href="/subscription" 
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 flex items-center transition"
                  >
                    <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">Pricing Plans</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Statistics */}
        {/* <div className="mt-12">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">FAQs at a Glance</h3>
              <p className="text-gray-300">Quick stats about our help resources</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400 mb-2">{Object.values(faqs).flat().length}</div>
                <p className="text-gray-300">Total Questions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">{categories.length}</div>
                <p className="text-gray-300">Categories</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">24h</div>
                <p className="text-gray-300">Average Response Time</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
                <p className="text-gray-300">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
}