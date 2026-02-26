"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Link as LinkIcon, Globe, Briefcase, ChevronRight, FileText, List, Tag, Calendar, MapPin, Search, Edit2 } from "lucide-react";

// Indian locations data (keeping as is)
const INDIAN_LOCATIONS = [
  // ... (keep your existing locations array)
  "Mumbai, Maharashtra",
  "Delhi, Delhi",
  "New Delhi",
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Surat, Gujarat",
  "Lucknow, Uttar Pradesh",
  "Kanpur, Uttar Pradesh",
  "Nagpur, Maharashtra",
  "Indore, Madhya Pradesh",
  "Thane, Maharashtra",
  "Bhopal, Madhya Pradesh",
  "Visakhapatnam, Andhra Pradesh",
  "Pimpri-Chinchwad, Maharashtra",
  "Patna, Bihar",
  "Vadodara, Gujarat",
  
  // State Capitals
  "Chandigarh, Chandigarh",
  "Bhubaneswar, Odisha",
  "Guwahati, Assam",
  "Shimla, Himachal Pradesh",
  "Dehradun, Uttarakhand",
  "Ranchi, Jharkhand",
  "Raipur, Chhattisgarh",
  "Gandhinagar, Gujarat",
  "Panaji, Goa",
  "Port Blair, Andaman and Nicobar",
  
  // Educational Hubs
  "Coimbatore, Tamil Nadu",
  "Mysore, Karnataka",
  "Vijayawada, Andhra Pradesh",
  "Kochi, Kerala",
  "Kozhikode, Kerala",
  "Trivandrum, Kerala",
  "Warangal, Telangana",
  "Guntur, Andhra Pradesh",
  "Salem, Tamil Nadu",
  "Tiruchirappalli, Tamil Nadu",
  
  // Other Important Cities
  "Noida, Uttar Pradesh",
  "Gurgaon, Haryana",
  "Faridabad, Haryana",
  "Ghaziabad, Uttar Pradesh",
  "Ludhiana, Punjab",
  "Amritsar, Punjab",
  "Nashik, Maharashtra",
  "Aurangabad, Maharashtra",
  "Rajkot, Gujarat",
  "Jammu, Jammu and Kashmir",
  
  // States (for broader search)
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Kerala",
  "Telangana",
  "Andhra Pradesh",
  "Madhya Pradesh",
  "Punjab",
  "Haryana",
  "Bihar",
  "Odisha",
  "Assam",
];

// Updated Job categories - all positions as separate categories
const JOB_CATEGORIES = [
  "Vice-Chancellor",
  "Pro-VC",
  "Registrar",
  "Principal",
  "Dean",
  "Joint Registrar",
  "Deputy Registrar",
  "Assistant Registrar",
  "Director",
  "Campus Director",
  "Joint Director",
  "Assistant Director",
  "Admission Counsellor",
  "Auditor",
  "Chief Administrative Officer",
  "Chief Engineer",
  "Executive Engineer",
  "Assistant Engineer",
  "Junior Engineer",
  "Establishment Assistant",
  "Estate Officer",
  "Controller Of Examination",
  "Assistant Controller of Examinations",
  "Controller of Finance",
  "Finance Officer",
  "Director Finance & Accounts",
  "Accounts officer",
  "Assistant Accounts Officer",
  "Senior Accounts Officer",
  "Accountant",
  "Cashier",
  "Accounts Clerk",
  "Receptionist",
  "Cook",
  "Care Taker",
  "Manager",
  "Chief Executive Officer",
  "Assistant Hostel Warden",
  "Hostel Warden",
  "Chief Hostel Warden",
  "Librarian",
  "Assistant Librarian",
  "Senior Librarian",
  "System Administrator",
  "System Analyst",
  "MIS Coordinator",
  "Computer Engineer",
  "Legal Adviser",
  "Law Officer",
  "Judicial Assistant",
  "Planning and Development Officer",
  "Public Relations Officer",
  "Project Assistant",
  "Proctor",
  "Dean Student Welfare",
  "Chief Security Officer",
  "Security Officer",
  "Assistant Security Officer",
  "Security Assistant",
  "Watch & Ward Assistant",
  "Gunman",
  "Security Guard",
  "Training and Placement Officer",
  "Head Training and Placement",
  "Transport Manager",
  "Driver",
  "Chief Vigilance Officer",
  "Vigilance Officer",
  "Director IQAC",
  "Multi-Tasking Staff",
  "Medical Officer",
  "Nurse",
  "Purchase Officer",
  "Senior Store Officer",
  "Store Officer",
  "Store Keeper",
  "Junior Hindi Translator",
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Guest Faculty",
  "Adjunct Faculty",
  "Professor Emeritus",
  "Professor of Practice",
  "Lecturer",
  "TGT (Trained Graduate Teacher)",
  "PGT (Post Graduate Teacher)",
  "NTT (Nursery Teacher)",
  "Research Assistant",
  "Junior Assistant",
  "Teaching Assistant",
  "Lab Engineer",
  "Lab Assistant"
];

// All categories for dropdown
const ALL_CATEGORIES = [...JOB_CATEGORIES].sort();

// Job type options
const JOB_TYPE_OPTIONS = [
  "Internship",
  "Temporary",
  "Consultant",
  "Freelance",
  "Full-time",
  "Part-time",
  "Contract",
  "Deputation",
  "Regular",
  "Short-Term Contract",
  "Long-Term Contract",
  "Tenure",
  "Remote",
  "Others"
];

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "details" | "links">("basic");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [showOtherTypeInput, setShowOtherTypeInput] = useState(false);
  
  // Refs for autocomplete
  const locationInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const categorySuggestionsRef = useRef<HTMLDivElement>(null);
  const otherTypeInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with empty optional fields and job deadline
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    otherType: "", // New field for custom job type
    category: "",
    description: "",
    requirements: "",
    skills: "",
    experience: "0-1 years",
    education: "Any",
    deadline: "",
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

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Location suggestions
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
      
      // Category suggestions
      if (
        categorySuggestionsRef.current && 
        !categorySuggestionsRef.current.contains(event.target as Node) &&
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target as Node)
      ) {
        setShowCategorySuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus on other type input when "Others" is selected
  useEffect(() => {
    if (form.type === "Others") {
      setShowOtherTypeInput(true);
      // Focus on the other type input after a short delay to ensure it's rendered
      setTimeout(() => {
        if (otherTypeInputRef.current) {
          otherTypeInputRef.current.focus();
        }
      }, 100);
    } else {
      setShowOtherTypeInput(false);
      // Clear otherType when not in "Others" mode
      if (form.type !== "Others") {
        setForm(prev => ({ ...prev, otherType: "" }));
      }
    }
  }, [form.type]);

  // Handle location input with autocomplete
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, location: value });
    
    // Filter location suggestions
    if (value.length > 0) {
      const filtered = INDIAN_LOCATIONS.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    setForm({ ...form, location });
    setShowLocationSuggestions(false);
    setLocationSuggestions([]);
    
    if (locationInputRef.current) {
      locationInputRef.current.focus();
    }
  };

  // Handle category input with autocomplete
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm({ ...form, category: value });
    
    if (value.length > 0) {
      const filtered = ALL_CATEGORIES.filter(category =>
        category.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 15);
      setCategorySuggestions(filtered);
      setShowCategorySuggestions(true);
    } else {
      setCategorySuggestions([]);
      setShowCategorySuggestions(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setForm({ ...form, category });
    setShowCategorySuggestions(false);
    setCategorySuggestions([]);
    
    if (categoryInputRef.current) {
      categoryInputRef.current.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateUrl = (url: string) => {
    if (!url) return true;
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
      // Determine the final job type value
      let finalJobType = form.type;
      if (form.type === "Others" && form.otherType.trim()) {
        finalJobType = form.otherType.trim();
      }

      // Format requirements and skills as arrays
      const { otherType, ...jobData } = {
        ...form,
        type: finalJobType,
        requirements: form.requirements.split("\n").filter(r => r.trim() !== ""),
        skills: form.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
        deadline: form.deadline ? new Date(form.deadline) : null,
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
          type: "",
          otherType: "",
          category: "",
          description: "",
          requirements: "",
          skills: "",
          experience: "0-1 years",
          education: "Any",
          deadline: "",
          applicationLink: "",
          companyWebsite: "",
          jobReferenceLink: "",
        });
        
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
                  Job Details
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
                  Eligibility
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
                  Important Links
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
              Job Details
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
              Eligibility
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
              Important Links
            </button>
          </div>

          {/* Job Posting Form */}
          <form onSubmit={handleSubmit}>
            {/* Tab 1: Basic Information */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full border text-gray-900 border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., Assistant Professor"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Institute Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full border text-gray-900 border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., University of Delhi"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Location *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        ref={locationInputRef}
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleLocationChange}
                        onFocus={() => {
                          if (form.location.length > 0 && locationSuggestions.length > 0) {
                            setShowLocationSuggestions(true);
                          }
                        }}
                        className="w-full border text-gray-900 border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="e.g., Mumbai, Maharashtra"
                        required
                        autoComplete="off"
                      />
                    </div>
                    
                    {/* Location Autocomplete Suggestions */}
                    {showLocationSuggestions && locationSuggestions.length > 0 && (
                      <div 
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                      >
                        {locationSuggestions.map((location, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center space-x-2 cursor-pointer"
                          >
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-900">{location}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Salary/Pay Level *
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={form.salary}
                      onChange={handleChange}
                      className="w-full border border-gray-300 text-gray-900 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., ₹80,000 - ₹100,000"
                      required
                    />
                  </div>

                  {/* Job Type with Others option */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Job Type
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full border text-gray-900 border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    >
                      <option value="">Select job type</option>
                      {JOB_TYPE_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Job Type Input for "Others" */}
                  {showOtherTypeInput && (
                    <div className="animate-fadeIn">
                      <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                        <Edit2 className="h-4 w-4 mr-2 text-gray-400" />
                        Specify Job Type
                      </label>
                      <input
                        ref={otherTypeInputRef}
                        type="text"
                        name="otherType"
                        value={form.otherType}
                        onChange={handleChange}
                        className="w-full border text-gray-900 border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="Enter custom job type..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will be saved as the job type
                      </p>
                    </div>
                  )}

                  {/* Category - with Autocomplete */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        ref={categoryInputRef}
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleCategoryChange}
                        onFocus={() => {
                          if (form.category.length > 0 && categorySuggestions.length > 0) {
                            setShowCategorySuggestions(true);
                          }
                        }}
                        className="w-full border text-gray-900 border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="Type to search categories..."
                        autoComplete="off"
                      />
                    </div>
                    
                    {/* Category Autocomplete Suggestions */}
                    {showCategorySuggestions && categorySuggestions.length > 0 && (
                      <div 
                        ref={categorySuggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                      >
                        {categorySuggestions.map((category, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center space-x-2 cursor-pointer"
                          >
                            <Briefcase className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-900">{category}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Deadline Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border text-gray-900 border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    />
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
                        <span className="font-medium">Note:</span> These fields are optional but recommended for better candidate understanding.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Qualification & Experience
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border text-gray-900 border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <List className="h-4 w-4 mr-2 text-gray-900" />
                    Attributes & Skills
                  </label>
                  <textarea
                    name="requirements"
                    value={form.requirements}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border text-gray-900 border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-900" />
                    Job Profile
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    className="w-full border text-gray-900 border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder=""
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
                    Next: Important Links
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
                    <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-900" />
                      Institute Website
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
                        className="w-full border text-gray-900 border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://yourinstitute.edu.in"
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
                  </div>

                  {/* Company Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-900" />
                      Detailed Advertisement
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Globe className="h-4 w-4" />
                      </div>
                      <input
                        type="url"
                        name="companyWebsite"
                        value={form.companyWebsite}
                        onChange={handleChange}
                        className="w-full border text-gray-900 border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://yourinstitute.edu.in/careers"
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
                  </div>

                  {/* Job Reference Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-900" />
                      Application
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
                        className="w-full border text-gray-900 border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://yourinstitute.edu.in/careers/application"
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

          {/* Updated Form Summary */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Title: {form.title || "Not filled"}</li>
                  <li>Institute: {form.company || "Not filled"}</li>
                  <li>Location: {form.location || "Not filled"}</li>
                  <li>Job Type: {form.type === "Others" && form.otherType ? form.otherType : (form.type || "Optional")}</li>
                  <li>Category: {form.category || "Optional"}</li>
                  <li>Deadline: {form.deadline || "Optional"}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Eligibility</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Qualification & Experience {form.description ? "✓ Added" : "Optional"}</li>
                  <li>Attributes & Skills: {form.requirements ? "✓ Added" : "Optional"}</li>
                  <li>Job Profile: {form.skills ? "✓ Added" : "Optional"}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Important Links</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Institute Website: {form.applicationLink ? "✓ Added" : "Optional"}</li>
                  <li>Detailed Advertisement: {form.companyWebsite ? "✓ Added" : "Optional"}</li>
                  <li>Application: {form.jobReferenceLink ? "✓ Added" : "Optional"}</li>
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