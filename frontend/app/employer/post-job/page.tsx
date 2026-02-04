"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Globe, 
  Briefcase, 
  FileText, 
  ExternalLink, 
  Calendar,
  Link as LinkIcon 
} from "lucide-react";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  description: string;
  requirements: string[];
  skills: string[];
  experience: string;
  education: string;
  createdAt: string;
  deadline: string | null;
  applicationLink: string;
  companyWebsite: string;
  jobReferenceLink: string;
  employer: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState("");

  useEffect(() => {
    //fetchJob();
    fetchUser();
  }, [params.id]);

  // const fetchJob = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}`
  //     );
  //     const data = await response.json();

  //     if (data.success) {
  //       setJob(data.job);
  //       // Debug: Check what data we're receiving
  //       console.log("Job Details Data:", data.job);
  //       console.log("Deadline from API:", data.job.deadline);
  //       console.log("Deadline type:", typeof data.job.deadline);
  //     } else {
  //       setError("Job not found");
  //     }
  //   } catch (err) {
  //     setError("Failed to fetch job details");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleApply = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (user.role !== "CANDIDATE") {
      alert("Only candidates can apply for jobs");
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setApplySuccess("Application submitted successfully!");
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  // Format date - Fixed to handle invalid dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date specified";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Calculate days remaining - Fixed to handle null/undefined
  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    
    try {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      
      // Check if date is valid
      if (isNaN(deadlineDate.getTime())) return null;
      
      const diffTime = deadlineDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return { text: "Expired", color: "text-red-600", bg: "bg-red-50" };
      if (diffDays === 0) return { text: "Today", color: "text-orange-600", bg: "bg-orange-50" };
      if (diffDays <= 7) return { text: `${diffDays} days left`, color: "text-orange-600", bg: "bg-orange-50" };
      return { text: `${diffDays} days left`, color: "text-green-600", bg: "bg-green-50" };
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return null;
    }
  };

  // Check if deadline is valid
  const isValidDeadline = (deadline: string | null) => {
    if (!deadline) return false;
    try {
      const date = new Date(deadline);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{error || "Job not found"}</h1>
          <Link
            href="/"
            className="inline-block text-red-700 hover:underline font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Job Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-700">
                  {job.type}
                </span>
                <span className="text-sm text-gray-500">
                  Posted {formatDate(job.createdAt)}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-800 mb-4">{job.company}</p>
            </div>
            
            {user?.role === "CANDIDATE" && !applySuccess && (
              <button
                onClick={handleApply}
                disabled={applying}
                className="bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>
            )}
          </div>

          {applySuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {applySuccess}
            </div>
          )}

          {/* Job Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Location</p>
              <p className="font-medium text-gray-900">{job.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Salary</p>
              <p className="font-medium text-gray-900">{job.salary}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Experience</p>
              <p className="font-medium text-gray-900">{job.experience}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Education</p>
              <p className="font-medium text-gray-900">{job.education}</p>
            </div>
          </div>

          {/* Deadline Section - Only show if deadline exists and is valid */}
          {isValidDeadline(job.deadline) && (
            <div className="mb-6 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-red-700 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Application Deadline</p>
                    <p className="text-sm text-gray-600">
                      Apply before {formatDate(job.deadline)}
                    </p>
                  </div>
                </div>
                {(() => {
                  const daysRemaining = getDaysRemaining(job.deadline);
                  if (!daysRemaining) return null;
                  return (
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${daysRemaining.bg} ${daysRemaining.color}`}>
                      {daysRemaining.text}
                    </span>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-block px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-700">
              {job.category}
            </span>
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-block px-4 py-2 text-sm rounded-full bg-red-50 text-red-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{job.description || "No description provided."}</p>
              </div>
            </div>

            {/* Requirements - Only show if requirements exist */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-red-700 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Links - Only show if any link exists */}
            {(job.applicationLink || job.companyWebsite || job.jobReferenceLink) && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Links</h2>
                <div className="space-y-4">
                  {job.applicationLink && (
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Application Link</p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {job.applicationLink}
                          </p>
                        </div>
                      </div>
                      <a
                        href={job.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-700 hover:text-red-800 ml-2"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  )}

                  {job.companyWebsite && (
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Company Website</p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {job.companyWebsite}
                          </p>
                        </div>
                      </div>
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-700 hover:text-red-800 ml-2"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  )}

                  {job.jobReferenceLink && (
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Job Reference</p>
                          <p className="text-sm text-gray-500 truncate max-w-md">
                            {job.jobReferenceLink}
                          </p>
                        </div>
                      </div>
                      <a
                        href={job.jobReferenceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-700 hover:text-red-800 ml-2"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Company Info */}
          <div className="space-y-6">
            {/* About Employer */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Employer</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <span className="text-red-700 font-bold text-lg">
                    {job.employer.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{job.employer.name}</p>
                  <p className="text-sm text-gray-500">{job.employer.email}</p>
                </div>
              </div>
            </div>

            {/* Job Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium">{job.type || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium">{job.category || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">{job.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Education</span>
                  <span className="font-medium">{job.education}</span>
                </div>
                {/* Show deadline in summary if exists and is valid */}
                {isValidDeadline(job.deadline) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-medium text-red-700">
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Apply Button for Mobile */}
            {user?.role === "CANDIDATE" && !applySuccess && (
              <div className="lg:hidden bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Apply?</h3>
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              </div>
            )}

            {/* Share Job */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share This Job</h3>
              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    alert("Link copied to clipboard!");
                  }}
                  className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out this job: ${job.title} at ${job.company}`;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}