"use client";

import { useState } from "react";
import { Check, AlertTriangle, Shield, FileText, Lock, Link as LinkIcon, Ban } from "lucide-react";

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>("terms");

  const sections = [
    { id: "terms", title: "Terms of Use", icon: FileText },
    { id: "account", title: "Account Registration", icon: Shield },
    { id: "conduct", title: "Code of Conduct", icon: Check },
    { id: "content", title: "Content Ownership", icon: FileText },
    { id: "usage", title: "Content Usage", icon: Lock },
    { id: "privacy", title: "Privacy Policy", icon: Shield },
    { id: "limitations", title: "Limitations of Use", icon: AlertTriangle },
    { id: "links", title: "External Links", icon: LinkIcon },
    { id: "violation", title: "Violation of Terms", icon: Ban },
  ];

  const contentUsageItems = [
    "(a) Submit any software or other materials that contain any viruses, worms, Trojan horses, defects, date bombs, time bombs or other items of a destructive nature.",
    "(b) Manipulate identifiers, including by forging headers, in order to disguise the origin of any posting that you submit.",
    "(c) Link to any portion of the Portal other than the URL assigned to the home page of the Portal.",
    '(d) "Frame" or "mirror" any part of the Portal',
    "(e) Modify, adapt, sub-license, translate, sell, reverse engineer, decompile or disassemble any portion of the Portal, or otherwise attempt to derive any source code or underlying ideas or algorithms of any part of the Content.",
    "(f) Remove any copyright, trademark or other proprietary rights notices contained on the Portal.",
    "(g) Use any computer program, bot, robot, spider, offline reader, site search/retrieval application or other manual or automatic device, tool, or process to retrieve, index, data mine, or in any way reproduce or circumvent the security structure, navigational structure, or presentation of the Content or the Portal, including with respect to any CAPTCHA displayed on the Portal. Operators of public search engines may use spiders to copy materials from the Portal for the sole purpose of and solely to the extent necessary for creating publicly available searchable indices of the materials, but not caches or archives of such materials. We may revoke this exception at any time and require the removal of archived materials gathered in the past.",
    "(h) Use any automated software or computer system to search for or participate in activities including sending information from your computer to another computer where such software or system is active.",
    "(i) Take any action that imposes or may impose (in our sole discretion) an unreasonable or disproportionately large load on our infrastructure.",
    "(j) Reproduce, modify, display, publicly perform, distribute or create derivative works of the Portal or the Content.",
    "(l) Decode, decrypt, modify, or reverse engineer in an attempt to, or in conjunction with, any device, program or service designed to circumvent any technological measure that effectively controls access to, or the rights in, the Portal and/or Content in any way including, manually by use of or automatic device or process, for any purpose.",
    "(m) Use bot technology to search for activities through the Portal; for the avoidance of doubt, this specifically prohibits you from using automated software on the Portal, and prohibits you from circumventing any security measure, access control system, or other technological control or measure on the Portal."
  ];

  const cookieTypes = [
    "(a) Analytics cookies for anonymously remembering your computer or mobile device when you visit our website to keep track of browsing patterns, and track the pages you view",
    "(b) Service cookies for helping us to make our website work efficiently, remembering your registration and login details, settings preferences."
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
            <FileText className="h-8 w-8 text-red-700" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Alert Banner */}
        <div className="mb-10 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">
                Important Notice
              </h3>
              <p className="text-yellow-700 text-sm">
                These Terms and Conditions constitute a legally binding agreement between you and EdTrellis Global Private Limited. 
                By using our portal, you agree to be bound by these terms.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="sticky top-28 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4 pb-3 border-b">
                Quick Navigation
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
                          ? "bg-red-50 text-red-700 font-medium"
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
                <p className="text-sm text-gray-500 mb-3">
                  Need help understanding these terms?
                </p>
                <a 
                  href="/footer/contact" 
                  className="inline-flex items-center text-red-700 hover:text-red-800 font-medium"
                >
                  Contact Support
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              
              {/* Introduction */}
              <div className="mb-10 pb-8 border-b border-gray-200">
                <div className="flex items-start mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="h-6 w-6 text-red-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Agreement Overview
                    </h2>
                    <p className="text-gray-600">
                      EdTrellis Global Private Limited, hereinafter referred to as the Company, 
                      is the sole owner of this portal, hereinafter referred to as the Portal.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700">
                    Though all efforts have been made to ensure the accuracy and currency of the content 
                    on this Portal, the same should not be construed as a statement of law or used for 
                    any legal purposes. The Company accepts no responsibility in relation to the accuracy, 
                    completeness, usefulness or otherwise, of the contents posted by third parties.
                  </p>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Important:</span> Users are advised to verify/check 
                      any information with the relevant source(s) before acting on the information provided 
                      in the Portal. These terms and conditions shall be governed by and construed in 
                      accordance with the Indian Laws. Any dispute arising under these terms and conditions 
                      shall be subject to the exclusive jurisdiction of the courts of India.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms Sections */}
              <div className="space-y-12">
                
                {/* Section 1: Terms of Use */}
                <section id="terms" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Terms of Use</h3>
                  </div>
                  
                  <div className="ml-14">
                    <p className="text-gray-700 mb-4">
                      By using this Portal, either by visiting/accessing, using or by creating an account 
                      or by using its services in any manner, you expressly agree to all the Terms and 
                      Conditions, hereinafter referred as Terms, as updated from time to time.
                    </p>
                    
                    <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-4">
                      <p className="text-gray-700">
                        You also agree to enter into a legally binding contract with the Company (even if 
                        you are using third party credentials or using the Portal on behalf of a company).
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h4 className="font-semibold text-gray-900 mb-2">Updates to Terms</h4>
                      <p className="text-gray-700">
                        The Company can change or modify the terms of use at any time and such changes will 
                        be effective immediately on being posted or updated on the Portal. By continuing to 
                        use this site after that date, you agree to the changes.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2: Account Registration */}
                <section id="account" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Account Registration</h3>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">a</span>
                        </div>
                        <p className="text-gray-700">
                          By registering, you consent to the use of the information you provide as outlined in the terms and conditions.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">b</span>
                        </div>
                        <p className="text-gray-700">
                          You agree to provide accurate, complete, and up-to-date information during registration and to maintain its accuracy thereafter.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">c</span>
                        </div>
                        <p className="text-gray-700">
                          You are responsible for maintaining the confidentiality of your account and password and must immediately report 
                          us in writing if you discover any unauthorized use of your account or other account-related security breaches.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">d</span>
                        </div>
                        <p className="text-gray-700">
                          You must not share your account credentials, use another person's account, or use the Portal for unlawful purposes.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">e</span>
                        </div>
                        <p className="text-gray-700">
                          You are responsible for all the activities that occur under your account, and the Company shall not be liable 
                          for losses occurring due to the use of this Portal or from your failure to comply with these Terms.
                        </p>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                          <span className="text-sm font-medium text-gray-600">f</span>
                        </div>
                        <p className="text-gray-700">
                          In case of violation/contravention of the Terms, the Company has the right to take action, such as 
                          deactivating/terminating/blocking/suspending your account, or appropriate legal action.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Code of Conduct */}
                <section id="conduct" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Code of Conduct</h3>
                  </div>
                  
                  <div className="ml-14">
                    <p className="text-gray-700 mb-6">
                      Users must comply with applicable laws and regulations and refrain from engaging in 
                      unlawful activities on the Portal. By agreeing to use this Portal, you explicitly 
                      agree that you will comply with all applicable laws, rules and regulations and that you will not:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['Restrict or inhibit any other person from using the Portal.',
                        'Use the Site for any unlawful purpose',
                        'Post content or upload images that infringe or violate someone else\'s rights or otherwise violates the law.',
                        'Express or imply that any statements you make are endorsed by us, without our prior written consent.',
                        'Impersonate any person or entity, whether actual or fictitious.',
                        'Engage in spamming or flooding.',
                        'Harvest or collect information about Site users.',
                        'Violate someone else\'s rights'].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 4: Ownership of Content and Intellectual Property Rights */}
                <section id="content" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">4</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Ownership of Content and Intellectual Property Rights</h3>
                  </div>
                  
                  <div className="ml-14">
                    <p className="text-gray-700 mb-4">
                      The Portal and all registered and unregistered trademarks, logos, service marks, data, text, designs, pages, print screens, images, artwork, photographs, audio and video clips, content, codes, source code, or software that reside or are viewable or otherwise discoverable on the Portal, (collectively, termed as the "Content") are owned by the Company.
                    </p>
                    
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 mb-4">
                      <p className="text-gray-700">
                        The Company owns the copyright and other intellectual property in the Portal and its Content except those identified as being copyright of third party. You may not use our Content in any way without our prior written permission. Content and features of the Portal may be changed at any time.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Relevant content on this Portal may be reproduced free of charge after taking proper permission by sending a mail to us. However, the material has to be reproduced accurately and not to be used in a derogatory manner or in a misleading context. Wherever the material is being published or issued to others, the source must be prominently acknowledged.
                      </p>
                      
                      <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                        <p className="text-gray-700">
                          However, the permission to reproduce this material shall not extend to any material which is identified as being copyright of a third party. Authorisation to reproduce such material must be obtained from the departments/copyright holders concerned.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Content Usage */}
                <section id="usage" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">5</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Content Usage</h3>
                  </div>
                  
                  <div className="ml-14">
                    <p className="text-gray-700 mb-6">
                      By agreeing to use this Portal, you agree that you will not:
                    </p>
                    
                    <div className="space-y-4">
                      {contentUsageItems.map((item, index) => (
                        <div key={index} className="flex items-start bg-gray-50 rounded-xl p-4">
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-sm font-medium text-red-700">{String.fromCharCode(97 + index)}</span>
                          </div>
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Section 6: Privacy Policy */}
                <section id="privacy" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">6</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Privacy Policy</h3>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <p className="text-gray-700">
                        Your acceptance of these Terms amounts to your consent for use of the identity information provided by you for the use of such identity information. The Company is committed to protect the data submitted by the users on the Portal and shall make the best of efforts to ensure the same. However, in no event will the Company be liable for any expense, loss or damage including, without limitation, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising from use, or loss of use, of data, arising out of or in connection with the use of this Portal.
                      </p>
                      
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                        <p className="text-gray-700">
                          Your use of our Services is also subject to our Cookie Policy and our Privacy Policy, which covers how we collect, use, share, and store your personal information. This Portal does not automatically capture any specific personal information from you, (like name, phone number or e-mail address), that allows us to identify you individually.
                        </p>
                      </div>
                      
                      <p className="text-gray-700">
                        Your email address will only be used for the purpose for which you have provided it. Your email address will not be used for any other purpose, and will not be disclosed, without your consent. Any details like e-mail ID, mobile number etc, provided by you are personal to you and you will be responsible for the confidentiality and use of credentials for all activities that are conducted through your account. The Company will not be liable for any harm or damage caused owing to the disclosure of your credentials or use by anyone else.
                      </p>
                      
                      <div className="bg-gray-50 rounded-xl p-5">
                        <h4 className="font-semibold text-gray-900 mb-3">Information Collection</h4>
                        <p className="text-gray-700 mb-4">
                          We may gather certain information about the User, such as Internet protocol (IP) addresses, domain name, browser type, operating system, the date and time of the visit and the pages visited. We make no attempt to link these addresses with the identity of individuals visiting our site unless an attempt to damage the site has been detected. We do not sell or share any personally identifiable information provided by you to any third party. Adequate and all possible security measures will be taken to protect the personal information provided by you from loss, misuse, unauthorized access or disclosure, alteration, or destruction.
                        </p>
                        
                        <h4 className="font-semibold text-gray-900 mb-3">Cookie Usage</h4>
                        <p className="text-gray-700 mb-4">
                          A cookie is a piece of software code that an internet web site sends to your browser when you access information at that site. A cookie is stored as a simple text file on your computer or mobile device by a website's server and only that server will be able to retrieve or read the contents of that cookie. Cookies let you navigate between pages efficiently as they store your preferences, and generally improve your experience of a website. We may use following types of cookies in our Portal:
                        </p>
                        
                        <div className="space-y-3">
                          {cookieTypes.map((item, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                <span className="text-sm font-medium text-blue-700">{String.fromCharCode(97 + index)}</span>
                              </div>
                              <span className="text-gray-700 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 7: Limitations of Use */}
                <section id="limitations" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">7</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Limitations of Use</h3>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        You may use the Portal with or without registering for an account, however, there will be limitations on use of various features and availability of specific services for registered and unregistered users. The Company is committed to provide the best user experience as per the purpose of the Portal, however, the Portal may have design limitations and limitations with respect to features which may not meet specific client or user needs, Feedback and requests from users are welcome but the Company is not bound in any way to comply with the same.
                      </p>
                      
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
                        <p className="text-gray-700">
                          Users may face difficulty in navigating and processing information due to technical issues like information overload, development, upscaling or ongoing maintenance. Lack of familiarity with the tools of the Portal, contextual understanding, digital divide, user stress or anxiety, user hardware issues lack of reliable connectivity etc may also affect user experience.
                        </p>
                      </div>
                      
                      <p className="text-gray-700">
                        There may be errors in translations which are prepared by third-party translators and some files, and items cannot be translated. Some applications and/or services may not work as expected when translated due to language restrictions. We work constantly to rectify any errors, omissions, or ambiguities on the Portal.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 8: Links */}
                <section id="links" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">8</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">External Links</h3>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-xl p-5">
                        <p className="text-gray-700">
                          Links to other websites that have been included on this Portal are provided for convenience only. Company is not responsible for the content of external websites not owned, operated or controlled by it. Mere presence of the link or its listing on this Portal should not be assumed as approval or endorsement of those websites or the views expressed within them. We cannot guarantee the availability of such linked pages at all times. The Users are advised to verify/check any information with the relevant source(s) before acting on the information provided in the linked websites.
                        </p>
                      </div>
                      
                      <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                        <h4 className="font-semibold text-gray-900 mb-2">Linking to Our Portal</h4>
                        <p className="text-gray-700">
                          Users are permitted to link directly the homepage this Portal and no prior permission is required for the same. However, the Company does not permit the pages of the Portal to be loaded into frames on another site. The pages belonging to this Portal must load into a newly opened browser window of the User.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 9: Violation of The Terms */}
                <section id="violation" className="scroll-mt-24">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="font-bold text-red-700">9</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Violation of The Terms</h3>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                        <p className="text-gray-700">
                          In case of violation of these Terms or use of the portal for unauthorised or unlawful purposes, the Company has the right to investigate or caused to be investigated including sharing of information provide by you or that related to your transactions to law enforcement agencies or assist them in any other manner for investigation or prosecution. The Company may also take legal action if deemed appropriate.
                        </p>
                      </div>
                      
                      <div className="bg-gray-900 text-white rounded-xl p-6">
                        <h4 className="font-semibold text-white mb-3">Account Suspension</h4>
                        <p className="text-gray-300">
                          If we determine that you have violated these Terms or the law, or for any other related reason, we may block your account any time without any notice.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

              </div>

              {/* Acceptance Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gray-900 text-white rounded-2xl p-8">
                  <h3 className="text-xl font-bold mb-4">Acceptance of Terms</h3>
                  <p className="text-gray-300 mb-6">
                    By accessing or using the EdTrellis platform, you acknowledge that you have read, 
                    understood, and agree to be bound by these Terms and Conditions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="px-6 py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition"
                    >
                      Review Terms Again
                    </button>
                    <a
                      href="/footer/contact"
                      className="px-6 py-3 bg-red-700 text-white font-medium rounded-xl hover:bg-red-800 transition text-center"
                    >
                      Contact for Questions
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Download Section */}
        {/* <div className="mt-12">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Download Terms & Conditions
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Save a copy of our Terms and Conditions for your records
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-medium rounded-xl hover:bg-gray-50 transition inline-flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
              <button className="px-6 py-3 bg-red-700 text-white font-medium rounded-xl hover:bg-red-800 transition inline-flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Print Terms
              </button>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
}