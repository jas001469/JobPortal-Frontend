"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";

interface JobCardProps {
  job: {
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
    deadline: string | null; // Added deadline
    applicationLink?: string;
    companyWebsite?: string;
    jobReferenceLink?: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchUser();
    // Debug: Check what job data we're receiving
    console.log("Job Card Data:", job);
    console.log("Job Deadline:", job.deadline);
    console.log("Deadline type:", typeof job.deadline);
  }, [job]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays <= 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format deadline - Fixed to handle null/undefined
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "No deadline";
    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting deadline:", error);
      return "Invalid date";
    }
  };

  // Calculate days remaining until deadline - Fixed to handle null/undefined
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
      if (diffDays <= 3) return { text: `${diffDays}d`, color: "text-orange-600", bg: "bg-orange-50" };
      if (diffDays <= 7) return { text: `${diffDays}d`, color: "text-yellow-600", bg: "bg-yellow-50" };
      return { text: `${diffDays}d`, color: "text-green-600", bg: "bg-green-50" };
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return null;
    }
  };

  // Check if job has links
  const hasLinks = job.applicationLink || job.companyWebsite || job.jobReferenceLink;

  // Truncate description
  const truncateDescription = (text: string, maxLength: number) => {
    if (!text) return "No description provided.";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
      {/* Job Type Badge and Posted Date */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            {job.type || "Not specified"}
          </span>
          {/* Deadline Badge - Only show if deadline exists and is valid */}
          {isValidDeadline(job.deadline) && (() => {
            const daysRemaining = getDaysRemaining(job.deadline);
            if (!daysRemaining) return null;
            return (
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${daysRemaining.bg} ${daysRemaining.color} flex items-center`}>
                <Calendar className="h-3 w-3 mr-1" />
                {daysRemaining.text}
              </span>
            );
          })()}
        </div>
        <span className="text-sm text-gray-500">{formatDate(job.createdAt)}</span>
      </div>

      {/* Job Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
        {job.title}
      </h3>

      {/* Company */}
      <p className="text-lg font-medium text-gray-800 mb-4">
        {job.company}
      </p>

      {/* Location and Salary */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{job.salary}</span>
        </div>
        {/* Deadline Date - Only show if deadline exists and is valid */}
        {isValidDeadline(job.deadline) && (
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">
              Apply by: {formatDeadline(job.deadline)}
            </span>
          </div>
        )}
      </div>

      {/* Links Indicator - Only show if job has links */}
      {hasLinks && (
        <div className="mb-4">
          <span className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Has additional links
          </span>
        </div>
      )}

      {/* Description Preview */}
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
        {truncateDescription(job.description, 120)}
      </p>

      {/* Experience and Category */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
          {job.experience} exp
        </span>
        <span className="inline-block px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
          {job.category || "Uncategorized"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Link
          href={`/jobs/${job._id}`}
          className="inline-block text-red-700 font-medium hover:text-red-800 transition flex items-center"
        >
          View Details
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}