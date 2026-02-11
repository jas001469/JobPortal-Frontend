"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { Search, MapPin, Briefcase, Filter, X } from "lucide-react";

// Indian locations dataset
const INDIAN_LOCATIONS = [
  // Major Cities
  "Mumbai, Maharashtra",
  "New Delhi, Delhi",
  "Delhi, Delhi",
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
  
  // States
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

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  description: string;
  experience: string;
  createdAt: string;
  deadline: string | null;
  applicationLink?: string;
  companyWebsite?: string;
  jobReferenceLink?: string;
  employer: {
    name: string;
    email: string;
  };
}

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  const [filters, setFilters] = useState({
    category: "",
    type: "",
    location: "",
    search: "",
  });

  const [tempFilters, setTempFilters] = useState({
    search: "",
    location: "",
  });

  // Auto-complete states
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  /* -----------------------------
     1️⃣ Read URL → Filters
  ------------------------------*/
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      category: searchParams.get("category") || "",
      type: searchParams.get("type") || "",
    };
    
    setFilters(urlFilters);
    setTempFilters({
      search: urlFilters.search,
      location: urlFilters.location,
    });
  }, [searchParams]);

  /* -----------------------------
     2️⃣ Fetch user
  ------------------------------*/
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) setUser(data.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* -----------------------------
     3️⃣ Fetch jobs when filters change
  ------------------------------*/
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Only add filters that have values
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs?${params.toString()}`
      );
      const data = await res.json();
      if (data.success) setJobs(data.jobs);
      else setError("Failed to fetch jobs");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     4️⃣ Update temp filters for search inputs
  ------------------------------*/
  const updateTempFilter = (key: string, value: string) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
    
    // Handle location suggestions
    if (key === "location") {
      setActiveSuggestionIndex(-1);
      
      if (value.trim().length > 1) {
        const filtered = INDIAN_LOCATIONS.filter((loc) =>
          loc.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 6); // Show only top 6 suggestions
        setLocationSuggestions(filtered);
        setShowLocationSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      }
    }
  };

  /* -----------------------------
     5️⃣ Handle location suggestion selection
  ------------------------------*/
  const handleLocationSuggestionClick = (suggestion: string) => {
    setTempFilters(prev => ({ ...prev, location: suggestion }));
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setActiveSuggestionIndex(-1);
    
    // Apply filter immediately when suggestion is selected
    const newFilters = {
      ...filters,
      location: suggestion,
    };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) {
        params.append(k, v);
      }
    });
    
    router.push(`/jobs/all-jobs?${params.toString()}`);
  };

  /* -----------------------------
     6️⃣ Clear location input
  ------------------------------*/
  const handleClearLocation = () => {
    setTempFilters(prev => ({ ...prev, location: "" }));
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
    setActiveSuggestionIndex(-1);
    
    // Remove location filter
    const newFilters = { ...filters, location: "" };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) {
        params.append(k, v);
      }
    });
    
    router.push(`/jobs/all-jobs?${params.toString()}`);
    locationInputRef.current?.focus();
  };

  /* -----------------------------
     7️⃣ Click outside to close suggestions
  ------------------------------*/
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* -----------------------------
     8️⃣ Keyboard navigation for suggestions
  ------------------------------*/
  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (!showLocationSuggestions || locationSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < locationSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < locationSuggestions.length) {
          handleLocationSuggestionClick(locationSuggestions[activeSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case "Escape":
        setShowLocationSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  /* -----------------------------
     9️⃣ Apply filters immediately for select inputs
  ------------------------------*/
  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) {
        params.append(k, v);
      }
    });
    
    router.push(`/jobs/all-jobs?${params.toString()}`);
  };

  /* -----------------------------
     🔟 Search submit (for search and location inputs)
  ------------------------------*/
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLocationSuggestions(false);
    
    const newFilters = {
      ...filters,
      search: tempFilters.search,
      location: tempFilters.location,
    };
    
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) {
        params.append(k, v);
      }
    });
    
    router.push(`/jobs/all-jobs?${params.toString()}`);
  };

  /* -----------------------------
     1️⃣1️⃣ Handle Enter key in search inputs
  ------------------------------*/
  const handleKeyDown = (e: React.KeyboardEvent, field: 'search' | 'location') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowLocationSuggestions(false);
      handleSearch(e);
    }
  };

  /* -----------------------------
     1️⃣2️⃣ Quick location tags
  ------------------------------*/
  const popularLocations = ["Delhi", "Bangalore", "Mumbai", "Hyderabad", "Pune", "Chennai"];

  /* -----------------------------
     UI
  ------------------------------*/

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full" />
        <p className="mt-4 text-gray-600 font-medium">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your <span className="text-red-600">Dream Job</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover thousands of job opportunities with all the information you need. 
            It's your future, come find it.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-10 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-800">Search & Filter Jobs</h2>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Main Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={tempFilters.search}
                onChange={(e) => updateTempFilter("search", e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'search')}
                placeholder="Job title, keywords, or company"
                className="w-full pl-12 pr-4 py-4 text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location with Autocomplete */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={locationInputRef}
                  value={tempFilters.location}
                  onChange={(e) => updateTempFilter("location", e.target.value)}
                  onKeyDown={(e) => {
                    handleLocationKeyDown(e);
                    if (e.key === 'Enter' && activeSuggestionIndex === -1) {
                      handleKeyDown(e, 'location');
                    }
                  }}
                  onFocus={() => {
                    if (tempFilters.location.trim().length > 1 && locationSuggestions.length > 0) {
                      setShowLocationSuggestions(true);
                    }
                  }}
                  placeholder="City or state"
                  className="w-full pl-12 pr-10 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 relative z-0"
                />
                
                {/* Clear location button */}
                {tempFilters.location && (
                  <button
                    type="button"
                    onClick={handleClearLocation}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition z-20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Suggestions Dropdown */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto"
                  >
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-500 px-3 py-2">
                        Popular Locations
                      </p>
                      {locationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleLocationSuggestionClick(suggestion)}
                          className={`w-full text-left px-4 py-3 hover:bg-red-50 transition-colors rounded-md flex items-center gap-2 ${
                            index === activeSuggestionIndex
                              ? "bg-red-50 text-red-700"
                              : "text-gray-700"
                          }`}
                          onMouseEnter={() => setActiveSuggestionIndex(index)}
                        >
                          <MapPin className="h-4 w-4 text-red-600" />
                          <span className="text-sm">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter("category", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              {/* Job Type */}
              <select
                value={filters.type}
                onChange={(e) => updateFilter("type", e.target.value)}
                className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200"
              >
                <option value="">All Job Types</option>
                <option value="Internship">Internship</option>
                <option value="Temporary">Temporary</option>
                <option value="Consultant">Consultant</option>
                <option value="Freelance">Freelance</option>
                <option value="Full-time">Full-time</option>
                <option value="Deputation">Deputation</option>
                <option value="Regular">Regular</option>
                <option value="Short-Term Contract">Short-Term Contract</option>
                <option value="Long-Term Contract">Long-Term Contract</option>
                <option value="Tenure">Tenure</option>
                <option value="Remote">Remote</option>
                <option value="Others">Others</option>
              </select>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Search Jobs
              </button>
            </div>
          </form>

          {/* Quick Location Tags */}
          {/* <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Try:</span>
            {popularLocations.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleLocationSuggestionClick(city)}
                className="text-xs bg-white px-3 py-1.5 rounded-full border border-gray-300 hover:border-red-600 hover:text-red-700 transition-colors"
              >
                {city}
              </button>k
            ))}
          </div> */}

          {/* Active Filters */}
          {(filters.search || filters.location || filters.category || filters.type) && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                    Search: {filters.search}
                    <button
                      type="button"
                      onClick={() => updateFilter("search", "")}
                      className="hover:text-red-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    Location: {filters.location}
                    <button
                      type="button"
                      onClick={() => updateFilter("location", "")}
                      className="hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    {filters.category}
                    <button
                      type="button"
                      onClick={() => updateFilter("category", "")}
                      className="hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                    {filters.type}
                    <button
                      type="button"
                      onClick={() => updateFilter("type", "")}
                      className="hover:text-purple-900"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Job Opportunities
            </h2>
            <p className="text-gray-600">
              Showing <span className="font-semibold text-red-600">{jobs.length}</span> jobs
              {(filters.search || filters.location || filters.category || filters.type) && (
                <span className="text-gray-500">
                  {" "}matching your criteria
                </span>
              )}
            </p>
          </div>
          
          {error && (
            <div className="mt-4 sm:mt-0 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Loading State During Refinement */}
        {loading && jobs.length > 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin h-10 w-10 border-3 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Refining search results...</p>
          </div>
        ) : jobs.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilters({ search: "", location: "", category: "", type: "" });
                setTempFilters({ search: "", location: "" });
                router.push('/jobs/all-jobs');
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          // Jobs Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div
                key={job._id}
                className="transform hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


{/* Quick Stats Footer */}
        {/* {jobs.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-red-600">{jobs.length}</div>
                <div className="text-sm text-gray-600 mt-1">Total Jobs</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {jobs.filter(j => j.type === 'Remote').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Remote Positions</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {jobs.filter(j => j.type === 'Internship').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Internships</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(jobs.map(j => j.location)).size}
                </div>
                <div className="text-sm text-gray-600 mt-1">Locations</div>
              </div>
            </div>
          </div>
        )} */}