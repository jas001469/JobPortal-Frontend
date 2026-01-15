"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import JobCard from "@/components/JobCard";

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
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs`,
        {
          credentials: 'include'
        }
      );
      const data = await res.json();
      
      if (data.success) {
        setJobs(data.jobs);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-red-700 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Browse All Jobs</h1>
          <div className="bg-white p-8 rounded-xl shadow">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchJobs}
              className="bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Browse All Jobs</h1>
        
        <p className="mb-8 text-center text-gray-600">
          Found <span className="font-bold">{jobs.length}</span> jobs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found</p>
            <Link 
              href="/" 
              className="inline-block mt-4 text-red-700 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}