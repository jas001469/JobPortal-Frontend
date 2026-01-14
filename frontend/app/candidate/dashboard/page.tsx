"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Application {
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    type: string;
  };
  application: {
    status: string;
    appliedAt: string;
    coverLetter: string;
  };
}

export default function CandidateDashboard() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
  });

  useEffect(() => {
    fetchCandidate();
    fetchApplications();
  }, []);

  const fetchCandidate = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.candidate.role === "CANDIDATE") {
          setCandidate(data.candidate);
        } else {
          router.push("/");
        }
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
      router.push("/auth/login");
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/applications`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
        calculateStats(data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps: Application[]) => {
    const totalApplications = apps.length;
    const pending = apps.filter(app => app.application.status === "Pending").length;
    const reviewed = apps.filter(app => app.application.status === "Reviewed").length;
    const accepted = apps.filter(app => app.application.status === "Accepted").length;

    setStats({
      totalApplications,
      pending,
      reviewed,
      accepted,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Reviewed":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, <span className="font-semibold">{candidate?.name}</span>!
                {!candidate?.resume && (
                  <span className="ml-4 text-sm text-red-600">
                    <Link href="/candidate/profile" className="underline hover:text-red-800">
                      Upload your resume to apply for jobs
                    </Link>
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/jobs"
                className="bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition"
              >
                Find Jobs
              </Link>
              <Link
                href="/candidate/profile"
                className="bg-white text-red-700 border-2 border-red-700 px-6 py-3 rounded-full font-medium hover:bg-red-50 transition"
              >
                Update Profile
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 mr-4">
                  <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 mr-4">
                  <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reviewed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reviewed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Accepted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Job Applications</h2>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500 mb-4">Start applying for jobs to track your applications here</p>
              <Link
                href="/jobs"
                className="inline-block bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition"
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{app.job.title}</div>
                        <div className="text-sm text-gray-500">{app.job.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.job.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.job.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(app.application.appliedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.application.status)}`}>
                          {app.application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/jobs/${app.job._id}`}
                          className="text-red-700 hover:text-red-800 mr-4"
                        >
                          View Job
                        </Link>
                        <button className="text-gray-600 hover:text-gray-800">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Profile Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Profile Completion</span>
                <span className="font-medium">{
                  candidate?.resume ? "Complete" : "Incomplete"
                }</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Resume Uploaded</span>
                <span className={`font-medium ${candidate?.resume ? "text-green-600" : "text-red-600"}`}>
                  {candidate?.resume ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Skills Added</span>
                <span className="font-medium">{candidate?.skills?.length || 0} skills</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Experience Added</span>
                <span className="font-medium">{candidate?.experience?.length || 0} experiences</span>
              </div>
              {!candidate?.resume && (
                <Link
                  href="/candidate/profile"
                  className="block text-center bg-red-700 text-white py-2 rounded-lg font-medium hover:bg-red-800 transition mt-4"
                >
                  Complete Your Profile
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/jobs"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition"
              >
                <svg className="w-5 h-5 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-medium">Search for Jobs</span>
              </Link>
              <Link
                href="/candidate/profile"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition"
              >
                <svg className="w-5 h-5 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="font-medium">Upload Resume</span>
              </Link>
              <Link
                href="/candidate/profile"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50 transition"
              >
                <svg className="w-5 h-5 text-red-700 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">Update Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}