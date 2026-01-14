"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import JobCard from "./JobCard";

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
  employer: {
    name: string;
    email: string;
  };
}

export default function JobsSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/jobs?limit=9`
      );
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
      } else {
        setError("Failed to load jobs");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="jobs" className="py-20 bg-zinc-100">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-black mb-4">
            Latest Job Opportunities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our curated list of job openings from top companies. 
            Find the perfect match for your skills and career aspirations.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
            <p className="mt-4 text-gray-600">Loading job opportunities...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={fetchFeaturedJobs}
              className="text-red-700 hover:underline font-medium"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 mb-6">Be the first to post a job opportunity!</p>
            <Link
              href="/employer/post-job"
              className="inline-block bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <>
            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center gap-2 bg-red-700 text-white px-8 py-4 rounded-full font-medium hover:bg-red-800 transition group"
              >
                View All Jobs
                <svg 
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}