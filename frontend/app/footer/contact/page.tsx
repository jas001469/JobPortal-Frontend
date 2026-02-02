"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setLoading(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      details: "+91 12345 6789",
      description: "Monday to Friday, 9 AM to 6 PM IST",
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@edtrellis.com",
      description: "Response within 24 hours",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: "204-A, West End Road Meerut Cantt",
      description: "KUttar Pradesh, India (250001)",
      color: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "Monday to Friday",
      description: "9:00 AM - 6:00 PM IST",
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const faqs = [
    {
      question: "What is the average response time for support queries?",
      answer: "We aim to respond to all support queries within 24 hours during business days. Urgent matters are prioritized and typically receive a response within 2-4 hours."
    },
    {
      question: "Do you provide support for technical issues?",
      answer: "Yes, our technical support team is available to help with any platform-related issues, including login problems, payment processing, and technical difficulties."
    },
    {
      question: "Can I schedule a callback?",
      answer: "Absolutely! You can request a callback through our contact form. Please provide your availability, and our team will get back to you at the scheduled time."
    },
    {
      question: "Is there support available for employers and candidates?",
      answer: "Yes, we provide dedicated support for both employers and candidates. Please specify your user type in your query for faster assistance."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
            <MessageSquare className="h-8 w-8 text-red-700" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Support
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We're here to help! Get in touch with our support team for assistance with your account, 
            technical issues, or any questions you may have.
          </p>
        </div>

        {submitted && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1">
                  Message Sent Successfully!
                </h3>
                <p className="text-green-800">
                  Thank you for contacting us. Our support team will get back to you within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className={`${method.color} rounded-xl p-5`}>
                      <div className="flex items-start">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${method.color}`}>
                          <Icon className={`h-6 w-6 ${method.iconColor}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{method.title}</h4>
                          <p className="text-gray-800 font-medium mb-1">{method.details}</p>
                          <p className="text-gray-600 text-sm">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Help</h4>
                <div className="space-y-3">
                  <a 
                    href="/footer/faq" 
                    className="flex items-center text-gray-600 hover:text-red-700 transition"
                  >
                    <HelpCircle className="h-5 w-5 mr-3" />
                    <span>Browse FAQ</span>
                  </a>
                  <a 
                    href="/footer/terms" 
                    className="flex items-center text-gray-600 hover:text-red-700 transition"
                  >
                    <HelpCircle className="h-5 w-5 mr-3" />
                    <span>Terms & Conditions</span>
                  </a>
                  <a 
                    href="/footer/privacy" 
                    className="flex items-center text-gray-600 hover:text-red-700 transition"
                  >
                    <HelpCircle className="h-5 w-5 mr-3" />
                    <span>Privacy Policy</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    >
                      <option value="">Select a subject</option>
                      <option value="technical">Technical Support</option>
                      <option value="account">Account Issues</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="employer">Employer Support</option>
                      <option value="candidate">Candidate Support</option>
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none resize-none"
                    placeholder="Please describe your issue or question in detail..."
                  />
                </div>

                <div className="flex items-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-700 text-white px-8 py-4 rounded-xl font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                  
                  <p className="ml-6 text-sm text-gray-500">
                    We typically respond within 24 hours
                  </p>
                </div>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <HelpCircle className="h-6 w-6 text-red-700 mr-3" />
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-5 hover:border-red-200 transition">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        ?
                      </span>
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 ml-9">{faq.answer}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <a 
                  href="/footer/faq" 
                  className="inline-flex items-center text-red-700 hover:text-red-800 font-medium"
                >
                  View all FAQ
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map/Office Section */}
        {/* <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Visit Our Office</h3>
              <p className="text-gray-300 mb-6">
                Feel free to visit our office during business hours. We recommend scheduling an appointment in advance to ensure we can give you our full attention.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">EdTrellis Global Private Limited</p>
                    <p className="text-gray-300">123 Tech Park, Bangalore</p>
                    <p className="text-gray-300">Karnataka, India - 560001</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-300">Monday to Friday: 9:00 AM - 6:00 PM IST</p>
                    <p className="text-gray-300">Saturday & Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-xl p-6">
              <div className="aspect-video bg-gray-600 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Office Location Map</p>
                  <p className="text-gray-400 text-sm mt-2">(Interactive map would be integrated here)</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-red-400 hover:text-red-300"
                >
                  Open in Google Maps
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div> */}

        {/* Emergency Contact */}
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <Phone className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Urgent Security Issues</h4>
              <p className="text-red-800 mb-3">
                For urgent security matters, data breaches, or immediate account security concerns, 
                please contact our Security Team directly at:
              </p>
              <a 
                href="mailto:security@edtrellis.com" 
                className="text-red-700 font-medium hover:underline"
              >
                support@edtrellis.com
              </a>
              <p className="text-red-600 text-sm mt-2">Available 24/7 for critical security issues</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}