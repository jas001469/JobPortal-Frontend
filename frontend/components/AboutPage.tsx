"use client";

import { useState } from "react";
import { Users, Target, Shield, Globe, Award, Lightbulb, ChevronRight, Briefcase, GraduationCap, Building } from "lucide-react";
import Link from "next/link";


export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState("mission");

  const stats = [
    { number: "10K+", label: "Job Opportunities", icon: <Briefcase className="h-8 w-8 text-red-600" /> },
    { number: "5K+", label: "Educational Institutions", icon: <Building className="h-8 w-8 text-red-600" /> },
    { number: "50K+", label: "Academic Professionals", icon: <Users className="h-8 w-8 text-red-600" /> },
    { number: "100+", label: "Cities Covered", icon: <Globe className="h-8 w-8 text-red-600" /> },
  ];

  const values = [
    {
      icon: <Target className="h-10 w-10 text-red-700" />,
      title: "Our Mission",
      description: "To revolutionize education sector recruitment by creating transparent, efficient connections between academic professionals and institutions.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-red-700" />,
      title: "Our Vision",
      description: "To become the most trusted global platform where every educational opportunity finds its perfect match with exceptional talent.",
    },
    {
      icon: <Shield className="h-10 w-10 text-red-700" />,
      title: "Transparency",
      description: "We champion salary transparency and clear job descriptions to build trust between employers and job seekers.",
    },
    {
      icon: <Award className="h-10 w-10 text-red-700" />,
      title: "Excellence",
      description: "Dedicated exclusively to education sector recruitment, ensuring specialized expertise and tailored solutions.",
    },
  ];

  const tabs = [
    { id: "mission", label: "Our Mission" },
    { id: "team", label: "Our Team" },
    { id: "story", label: "Our Story" },
  ];

  const educationLevels = {
    "School Education": [
      { level: "Foundational", description: "Early childhood education and foundational learning" },
      { level: "Preparatory", description: "Primary education building basic academic skills" },
      { level: "Middle", description: "Upper primary and middle school education" },
      { level: "Secondary", description: "High school and senior secondary education" },
    ],
    "Higher Education": [
      { level: "Undergraduate", description: "Bachelor's degree programs and college education" },
      { level: "Post Graduate", description: "Master's degree and advanced specialized programs" },
      { level: "Doctoral", description: "PhD and research-focused doctoral studies" },
      { level: "Post Doctoral", description: "Advanced research and academic positions" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
  {/* Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-blue-600/10" />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid md:grid-cols-2 gap-12 items-center">
      
      {/* LEFT SIDE - TEXT */}
      <div>
        <div className="flex items-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <GraduationCap className="h-15 w-15 text-red-700" />
          </div>
        </div>

        <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6">
          About <span className="text-red-700">EdTrellis</span>
        </h1>

        <p className="text-lg text-gray-600 leading-relaxed">
          Connecting academic excellence with opportunity.
          The first and only job portal exclusively built for the education sector.
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE SPACE */}
      <div className="flex justify-center">
  <div className="w-95 h-95 rounded-full overflow-hidden shadow-lg">
    <img
      src="/photo.JPG"
      alt="Education illustration"
      className="w-full h-full object-cover"
    />
  </div>
</div>

    </div>
  </div>
</section>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 pb-20">
        {/* Stats Section */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div> */}

        {/* Company Description */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center mb-8">
                <div className="bg-red-100 rounded-xl p-3 mr-4">
                  <Building className="h-8 w-8 text-red-700" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">EdTrellis Global Pvt. Ltd.</h2>
              </div>
              
              <div className="space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed">
                  EdTrellis Global Pvt. Ltd. was established with the vision of transforming how education professionals connect with opportunities. We serve as the essential bridge between dedicated job seekers and forward-thinking talent hunters in the academic world.
                </p>
                
                <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-700">
                  <p className="font-medium text-gray-900">
                    Our primary mission is to simplify the job search process in education by consolidating all opportunities onto a single, intuitive platform.
                  </p>
                </div>
                
                <p className="text-lg leading-relaxed">
                  We champion transparency in educational recruitment, encouraging employers to clearly communicate their terms, conditions, and compensation packages. This transparency not only builds trust but also helps institutions attract precisely the right talent for their needs.
                </p>
                
                <p className="text-lg leading-relaxed">
                  At EdTrellis, we understand that job seekers have unique requirements and career aspirations. We're committed to respecting these individual needs while providing tools and resources that make finding the perfect educational position more efficient and rewarding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Education Sectors */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Serving All Levels of <span className="text-red-700">Education</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(educationLevels).map(([sector, levels], index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-8 border border-gray-200"
              >
                <div className="flex items-center mb-8">
                  <div className={`p-3 rounded-xl ${index === 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {index === 0 ? (
                      <GraduationCap className="h-8 w-8 text-red-700" />
                    ) : (
                      <Award className="h-8 w-8 text-blue-700" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 ml-4">{sector}</h3>
                </div>
                
                <div className="space-y-4">
                  {levels.map((level, idx) => (
                    <div
                      key={idx}
                      className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full mt-2 mr-4 ${index === 0 ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{level.level}</h4>
                        <p className="text-gray-600 text-sm">{level.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our <span className="text-red-700">Core Values</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-6">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Who We Serve */}
        {/* <div className="bg-gradient-to-r from-red-700 to-red-700 rounded-2xl p-8 md:p-8 mb-16">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Who We Serve</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Academicians</h3>
                <p className="text-white/90">Professors, lecturers, teachers, and researchers</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Building className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Administrators</h3>
                <p className="text-white/90">Deans, principals, department heads, and directors</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Specialists</h3>
                <p className="text-white/90">Curriculum developers, educational consultants, and domain experts</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        {/* <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join the Education Revolution
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Whether you're seeking your next academic position or looking for exceptional educational talent, EdTrellis is your dedicated partner.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/employer/post-job"
              className="bg-red-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-800 transition-all duration-300 inline-flex items-center justify-center"
            >
              Post a Job
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/"
              className="bg-white text-red-700 px-8 py-4 rounded-full font-semibold border-2 border-red-700 hover:bg-red-50 transition-all duration-300 inline-flex items-center justify-center"
            >
              Browse Jobs
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/footer/contact"
              className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 inline-flex items-center justify-center"
            >
              Contact Us
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div> */}

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            <span className="font-semibold text-red-700">EdTrellis Global Pvt. Ltd.</span> – Redefining education sector recruitment since our inception.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            The first dedicated job portal exclusively for academic professionals worldwide.
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-1/4 left-4 w-72 h-72 bg-red-200/20 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-1/4 right-4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10" />
    </div>
  );
}