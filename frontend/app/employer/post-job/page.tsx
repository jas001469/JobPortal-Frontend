"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ExternalLink, Link as LinkIcon, Globe, Briefcase, ChevronRight, FileText, List, Tag } from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "links">("basic");
  const [categories, setCategories] = useState<string[]>([
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Design",
    "Sales",
    "Customer Service",
    "Operations",
    "Other",
  ]);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full-time",
    category: "Technology",
    description: "",
    requirements: "",
    skills: "",
    experience: "0-1 years",
    education: "Any",
    applicationLink: "",
    companyWebsite: "",
    jobReferenceLink: "",
  });

  // Check if user is employer
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user.role !== "EMPLOYER") {
            router.push("/");
          }
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/auth/login");
      }
    };

    checkUserRole();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateUrl = (url: string) => {
    if (!url) return true; // Empty is valid (optional field)
    
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
    return urlPattern.test(url);
  };

  const validateCurrentTab = () => {
    if (activeTab === "basic") {
      return form.title && form.company && form.location && form.salary;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate URLs
    if (!validateUrl(form.applicationLink)) {
      setError("Please enter a valid application link URL (e.g., https://example.com/apply)");
      setLoading(false);
      return;
    }

    if (!validateUrl(form.companyWebsite)) {
      setError("Please enter a valid company website URL");
      setLoading(false);
      return;
    }

    if (!validateUrl(form.jobReferenceLink)) {
      setError("Please enter a valid job reference link URL");
      setLoading(false);
      return;
    }

    try {
      // Format requirements and skills as arrays
      const jobData = {
        ...form,
        requirements: form.requirements.split("\n").filter(r => r.trim() !== ""),
        skills: form.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Job posted successfully!");
        setForm({
          title: "",
          company: "",
          location: "",
          salary: "",
          type: "Full-time",
          category: "Technology",
          description: "",
          requirements: "",
          skills: "",
          experience: "0-1 years",
          education: "Any",
          applicationLink: "",
          companyWebsite: "",
          jobReferenceLink: "",
        });
        
        // Redirect to jobs page after 2 seconds
        setTimeout(() => {
          router.push("/employer/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Failed to post job");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
            <p className="text-gray-600">Fill in the details below to post your job opening</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeTab === "basic" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  1
                </div>
                <span className={`font-medium ${activeTab === "basic" ? "text-red-700" : "text-gray-600"}`}>
                  Basic Info
                </span>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeTab === "details" ? "bg-red-700 text-white" : activeTab === "links" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  2
                </div>
                <span className={`font-medium ${
                  activeTab === "details" || activeTab === "links" ? "text-red-700" : "text-gray-600"
                }`}>
                  Job Details
                </span>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeTab === "links" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  3
                </div>
                <span className={`font-medium ${activeTab === "links" ? "text-red-700" : "text-gray-600"}`}>
                  Additional Links
                </span>
              </div>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-red-700 transition-all duration-300 ${
                  activeTab === "basic" ? "w-1/3" : activeTab === "details" ? "w-2/3" : "w-full"
                }`}
              ></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === "basic"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Basic Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === "details"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Job Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("links")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === "links"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Additional Links
            </button>
          </div>

          {/* Job Posting Form */}
          <form onSubmit={handleSubmit}>
            {/* Tab 1: Basic Information */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., Senior Frontend Developer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., Google"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., Remote, New York, NY"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary *
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={form.salary}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g. ₹ 80,000 - 1,00,000"

                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type *
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Required *
                    </label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      required
                    >
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Required *
                    </label>
                    <select
                      name="education"
                      value={form.education}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      required
                    >
                      <option value="Any">Any</option>
                      <option value="High School">High School</option>
                      <option value="Associate">Associate</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <div></div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    disabled={!validateCurrentTab()}
                    className="bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Job Description
                    <ChevronRight className="w-4 h-4 inline ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Job Description */}
            {activeTab === "details" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-blue-700 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 text-sm">
                        <span className="font-medium">Tip:</span> Be specific and detailed in your job description. 
                        Clear descriptions attract better candidates and improve application quality.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder="Describe the job responsibilities, tasks, and day-to-day activities..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <List className="h-4 w-4 mr-2 text-gray-500" />
                    Requirements (one per line) *
                  </label>
                  <textarea
                    name="requirements"
                    value={form.requirements}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder="• 3+ years of experience in React
• Strong knowledge of JavaScript
• Experience with Redux or Context API"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-500" />
                    Skills Required (comma separated) *
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder="e.g., React, JavaScript, Node.js, CSS"
                    required
                  />
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("basic")}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
                  >
                    <ChevronRight className="w-4 h-4 inline mr-2 rotate-180" />
                    Back to Basic Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("links")}
                    className="bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition"
                  >
                    Next: Additional Links
                    <ChevronRight className="w-4 h-4 inline ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Additional Links */}
            {activeTab === "links" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start">
                    <LinkIcon className="h-5 w-5 text-green-700 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 text-sm">
                        <span className="font-medium">Optional but recommended:</span> Adding links helps candidates learn more about your company and increases application rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Application Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      Application Link
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        🔗
                      </div>
                      <input
                        type="url"
                        name="applicationLink"
                        value={form.applicationLink}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://yourcompany.com/apply"
                      />
                      {form.applicationLink && (
                        <a
                          href={form.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-700 hover:text-red-800"
                          title="Open link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      External application portal URL
                    </p>
                  </div>

                  {/* Company Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      Company Website
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        🌐
                      </div>
                      <input
                        type="url"
                        name="companyWebsite"
                        value={form.companyWebsite}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://yourcompany.com"
                      />
                      {form.companyWebsite && (
                        <a
                          href={form.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-700 hover:text-red-800"
                          title="Open website"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Official company website
                    </p>
                  </div>

                  {/* Job Reference Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      Job Reference Link
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        📄
                      </div>
                      <input
                        type="url"
                        name="jobReferenceLink"
                        value={form.jobReferenceLink}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://drive.google.com/job-description"
                      />
                      {form.jobReferenceLink && (
                        <a
                          href={form.jobReferenceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-700 hover:text-red-800"
                          title="Open reference"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Link to detailed job description or additional resources
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
                  >
                    <ChevronRight className="w-4 h-4 inline mr-2 rotate-180" />
                    Back to Job Description
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Posting Job...
                      </>
                    ) : (
                      "Post Job"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Form Summary */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Title: {form.title || "Not filled"}</li>
                  <li>Company: {form.company || "Not filled"}</li>
                  <li>Location: {form.location || "Not filled"}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Description: {form.description ? "✓ Added" : "Not filled"}</li>
                  <li>Requirements: {form.requirements ? "✓ Added" : "Not filled"}</li>
                  <li>Skills: {form.skills ? "✓ Added" : "Not filled"}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Additional Links</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Application Link: {form.applicationLink ? "✓ Added" : "Optional"}</li>
                  <li>Company Website: {form.companyWebsite ? "✓ Added" : "Optional"}</li>
                  <li>Reference Link: {form.jobReferenceLink ? "✓ Added" : "Optional"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}