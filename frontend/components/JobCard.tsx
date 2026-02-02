"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  };
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

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

  const handleQuickApply = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (!user) {
    router.push("/auth/login?redirect=/jobs");
    return;
  }

  if (user.role !== "CANDIDATE") {
    alert("Only candidates can apply for jobs. Please login as a candidate.");
    return;
  }

//   // Check if candidate has resume
//   try {
//     const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`, {
//       credentials: "include",
//     });
    
//     if (profileResponse.ok) {
//       const profileData = await profileResponse.json();
//       if (!profileData.candidate?.resume) {
//         if (confirm("You need to upload your resume before applying. Go to your profile now?")) {
//           router.push("/candidate/profile");
//         }
//         return;
//       }
//     }
//   } catch (error) {
//     console.error("Error checking resume:", error);
//   }

  setApplying(true);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/jobs/${job._id}/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverLetter: `I am interested in the ${job.title} position at ${job.company}. I believe my skills and experience make me a strong candidate for this role.`,
        }),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Application submitted successfully!");
      // Refresh applications
      if (window.location.pathname === "/candidate/dashboard") {
        window.location.reload();
      }
    } else {
      alert(data.message || "Failed to apply");
    }
  } catch (err) {
    alert("Something went wrong");
  } finally {
    setApplying(false);
  }
};
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Posted today";
    if (diffDays <= 7) return `Posted ${diffDays} days ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Truncate description
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100">
      {/* Job Type Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
          {job.type}
        </span>
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
      </div>

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
          {job.category}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Link
          href={`/jobs/${job._id}`}
          className="inline-block text-red-700 font-medium hover:text-red-800 transition"
        >
          View Details →
        </Link>
        
        {/* {user?.role === "CANDIDATE" && (
          <button
            onClick={handleQuickApply}
            disabled={applying}
            className="bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-800 transition disabled:opacity-50"
          >
            {applying ? "Applying..." : "Quick Apply"}
          </button>
        )} */}
      </div>
    </div>
  );
}