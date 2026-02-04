'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import JobCard from "@/components/JobCard";
import { Search, MapPin, Briefcase, Filter } from "lucide-react";

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
  };

  /* -----------------------------
     5️⃣ Apply filters immediately for select inputs
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
     6️⃣ Search submit (for search and location inputs)
  ------------------------------*/
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
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
     7️⃣ Handle Enter key in search inputs
  ------------------------------*/
  const handleKeyDown = (e: React.KeyboardEvent, field: 'search' | 'location') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(e);
    }
  };

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
              {/* Location */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={tempFilters.location}
                  onChange={(e) => updateTempFilter("location", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'location')}
                  placeholder="City or country"
                  className="w-full pl-12 pr-4 py-3 text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
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
                      <option value="Short-Term Contarct">Short-Term Contract</option>
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
      </div>
    </div>
  );
}