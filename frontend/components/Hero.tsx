"use client";

import Image from "next/image";
import {
  Search,
  ArrowRight,
  Briefcase,
  Building2,
  Users,
  PlusCircle,
  MapPin,
  Briefcase as JobIcon,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Indian cities and states dataset
const INDIAN_LOCATIONS = [
  // Major Cities
  "Mumbai, Maharashtra",
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

export default function Hero() {
  const router = useRouter();
  const [stats, setStats] = useState({
    liveJobs: 0,
    companies: 0,
    candidates: 0,
    newJobs: 0,
  });
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/home`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setActiveSuggestionIndex(-1);
    
    if (value.trim().length > 1) {
      const filtered = INDIAN_LOCATIONS.filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Show only top 8 suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocation(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const handleClearLocation = () => {
    setLocation("");
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    locationInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.append("search", keyword);
    if (location.trim()) params.append("location", location);
    router.push(`/jobs/all-jobs?${params.toString()}`);
  };

  return (
    <section className="bg-zinc-100">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* HERO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div className="md:mt-10">
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-black mb-6">
              <span className="inline-flex items-center gap-4">
                Find Jobs in{" "}
                <a
                  href="#about"
                  className="inline-flex items-center justify-center h-10 w-36 rounded-full border-2 border-red-700 hover:bg-red-700 transition group"
                >
                  <ArrowRight
                    className="h-5 w-5 text-red-700 group-hover:text-white"
                    strokeWidth={2.5}
                  />
                </a>
              </span>
              <br />
              education sector through
              <br />
              <span className="text-red-700"> EdTrellis</span>
            </h1>
            <p className="text-gray-600 mb-10 max-w-md">
              Create trackable resumes and enrich your applications for
              educational, research or training institutes!
            </p>

            {/* SEARCH BAR */}
            <div className="relative max-w-md">
              <div className="relative flex items-center bg-white shadow-lg rounded-full overflow-hidden">
                {/* Job Input */}
                <div className="flex items-center flex-1 px-5">
                  <JobIcon className="h-5 w-5 text-red-700 mr-3" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    type="text"
                    placeholder="Job Title or Keyword"
                    className="w-full py-4 text-sm text-black placeholder-gray-400 outline-none bg-transparent"
                  />
                </div>
                <div className="h-8 w-px bg-gray-300" />

                {/* Location Input with Autocomplete */}
                <div className="flex items-center flex-1 px-5 pr-16 relative">
                  <MapPin className="h-5 w-5 text-red-700 mr-3" />
                  <input
                    ref={locationInputRef}
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown(e);
                      if (e.key === "Enter" && activeSuggestionIndex === -1) {
                        handleSearch();
                      }
                    }}
                    onFocus={() => {
                      if (location.trim().length > 1 && suggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    type="text"
                    placeholder="Location"
                    className="w-full py-4 text-sm text-black placeholder-gray-400 outline-none bg-transparent"
                  />
                  
                  {/* Clear button */}
                  {location && (
                    <button
                      onClick={handleClearLocation}
                      className="absolute right-14 p-1 text-gray-400 hover:text-gray-600 transition"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="absolute right-1 top-1 bottom-1 w-12 flex items-center justify-center rounded-full bg-red-700 hover:bg-red-800 transition"
                >
                  <Search
                    className="h-6 w-6 text-white"
                    strokeWidth={2.8}
                  />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto"
                >
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-500 px-3 py-2">
                      Popular Indian Locations
                    </p>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
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

            {/* Quick Location Tags */}
            {/* <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Try:</span>
              {["Delhi", "Bangalore", "Mumbai", "Hyderabad", "Pune"].map((city) => (
                <button
                  key={city}
                  onClick={() => handleSuggestionClick(`${city}`)}
                  className="text-xs bg-white px-3 py-1.5 rounded-full border border-gray-300 hover:border-red-600 hover:text-red-700 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div> */}
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">
            <Image
              src="/edheroimage3.png"
              alt="Job search illustration"
              width={500}
              height={600}
              priority
            />
          </div>
        </div>

        {/* 🔴 LIVE STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-28 mt-30">
          <StatCard
            icon={<Briefcase className="h-7 w-7 text-red-700" />}
            value={stats.liveJobs.toLocaleString()}
            label="Live Jobs"
          />
          <StatCard
            icon={<Building2 className="h-7 w-7 text-red-700" />}
            value={stats.companies.toLocaleString()}
            label="Institutes"
          />
          <StatCard
            icon={<Users className="h-7 w-7 text-red-700" />}
            value={stats.candidates.toLocaleString()}
            label="Candidates"
          />
          <StatCard
            icon={<PlusCircle className="h-7 w-7 text-red-700" />}
            value={stats.newJobs.toLocaleString()}
            label="New Jobs"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xl font-semibold text-gray-900 leading-tight">
          {value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}