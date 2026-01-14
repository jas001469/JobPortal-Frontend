"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  status: string;
  createdAt: string;
  applications: any[];
}

export default function EmployerDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newApplications: 0,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [jobToUpdate, setJobToUpdate] = useState<{id: string, status: string} | null>(null);
  const [activeTab, setActiveTab] = useState("all"); // "all", "active", "closed"

  useEffect(() => {
    fetchUser();
    fetchJobs();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user.role === "EMPLOYER") {
          setUser(data.user);
        } else {
          router.push("/");
        }
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/auth/login");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/employer/my-jobs`, {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setJobs(data.jobs);
        calculateStats(data.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (jobs: Job[]) => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(job => job.status === "Active").length;
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
    
    // Calculate new applications (last 7 days)
    const newApplications = jobs.reduce((sum, job) => {
      const recentApps = (job.applications || []).filter(app => {
        const appDate = new Date(app.appliedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return appDate >= weekAgo;
      });
      return sum + recentApps.length;
    }, 0);

    setStats({
      totalJobs,
      activeJobs,
      totalApplications,
      newApplications,
    });
  };

  const handleEditJob = (jobId: string) => {
    router.push(`/employer/edit-job/${jobId}`);
  };

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setJobs(jobs.filter(job => job._id !== jobToDelete));
        calculateStats(jobs.filter(job => job._id !== jobToDelete));
        alert("Job deleted successfully!");
      } else {
        alert("Failed to delete job. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("An error occurred while deleting the job.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    }
  };

  const handleStatusChange = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Closed" : "Active";
    setJobToUpdate({ id: jobId, status: newStatus });
    setShowStatusConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!jobToUpdate) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobToUpdate.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: jobToUpdate.status }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setJobs(jobs.map(job => 
          job._id === jobToUpdate.id 
            ? { ...job, status: jobToUpdate.status }
            : job
        ));
        calculateStats(jobs.map(job => 
          job._id === jobToUpdate.id 
            ? { ...job, status: jobToUpdate.status }
            : job
        ));
        alert(`Job status updated to ${jobToUpdate.status}`);
      } else {
        alert("Failed to update job status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("An error occurred while updating job status.");
    } finally {
      setShowStatusConfirm(false);
      setJobToUpdate(null);
    }
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
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return job.status === "Active";
    if (activeTab === "closed") return job.status === "Closed";
    return true;
  });

  const recentApplications = jobs
    .flatMap(job =>
      (job.applications || []).map(app => ({
        ...app,
        jobTitle: job.title,
        jobId: job._id,
      }))
    )
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-100 border-t-red-700 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-red-700"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading your dashboard...</p>
          <p className="mt-2 text-gray-400 text-sm">Preparing your insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Confirmation Modals */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Job?</h3>
                  <p className="text-gray-600 text-sm mt-1">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this job posting? All associated applications will also be removed.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setJobToDelete(null);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteJob}
                  className="px-5 py-2.5 bg-linear-to-r from-red-600 to-red-700 text-white rounded-full font-medium hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : "Delete Job"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showStatusConfirm && jobToUpdate && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Update Job Status</h3>
                  <p className="text-gray-600 text-sm mt-1">Change visibility for applicants</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to change this job status to{" "}
                <span className={`font-semibold px-2 py-1 rounded-full ${getStatusColor(jobToUpdate.status)}`}>
                  {jobToUpdate.status}
                </span>
                ?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowStatusConfirm(false);
                    setJobToUpdate(null);
                  }}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Employer Dashboard
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                Welcome back, <span className="font-semibold text-red-700">{user?.name}</span>!
                <span className="ml-2 text-sm bg-red-50 text-red-700 px-3 py-1 rounded-full">
                  {user?.email}
                </span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/employer/post-job"
                className="group relative bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post New Job
              </Link>
              <Link
                href="/employer/profile"
                className="group border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-red-100 to-red-50 mr-4">
                  <svg className="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalJobs}</p>
                  <p className="text-xs text-gray-400 mt-1">All posted positions</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-green-100 to-green-50 mr-4">
                  <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeJobs}</p>
                  <p className="text-xs text-gray-400 mt-1">Currently accepting applications</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 mr-4">
                  <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.83.63-1.874 1-3 1s-2.17-.37-3-1m-6 0c-.83.63-1.874 1-3 1s-2.17-.37-3-1m0 0v-1m0 0c.83.63 1.874 1 3 1s2.17-.37 3-1m-6 0v-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalApplications}</p>
                  <p className="text-xs text-gray-400 mt-1">All time candidates</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 mr-4">
                  <svg className="w-7 h-7 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">New Applications</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.newApplications}</p>
                  <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Posted Jobs</h2>
                <p className="text-sm text-gray-600 mt-1">Manage all your job postings in one place</p>
              </div>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-full">
                {["all", "active", "closed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                      activeTab === tab
                        ? "bg-white text-red-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "active" && stats.activeJobs > 0 && (
                      <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                        {stats.activeJobs}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start building your team by posting your first job opportunity. Reach qualified candidates in minutes.
              </p>
              <Link
                href="/employer/post-job"
                className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-full font-medium hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Job Title", "Type", "Location", "Status", "Applications", "Posted Date", "Actions"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr 
                      key={job._id} 
                      className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500">{job.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border border-gray-200">
                          {job.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusChange(job._id, job.status)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:shadow-md transition-all ${
                            getStatusColor(job.status)
                          }`}
                        >
                          {job.status}
                          <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-semibold text-gray-900 mr-2">
                            {job.applications?.length || 0}
                          </div>
                          <Link
                            href={`/employer/jobs/${job._id}/applications`}
                            className="text-xs text-red-700 hover:text-red-800 font-medium flex items-center"
                          >
                            View
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(job.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditJob(job._id)}
                            className="text-gray-600 hover:text-red-700 transition-colors flex items-center group"
                            title="Edit Job"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(job._id)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center group"
                            title="Delete Job"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-100 to-red-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                href="/employer/post-job"
                className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-white transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 group-hover:text-red-700">Post New Job</span>
                  <p className="text-xs text-gray-500 mt-1">Create a new job posting</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/employer/profile"
                className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-white transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 group-hover:text-blue-700">Update Profile</span>
                  <p className="text-xs text-gray-500 mt-1">Manage your company profile</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/employer/analytics"
                className="flex items-center p-4 rounded-xl border border-gray-200 hover:border-green-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-white transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 group-hover:text-green-700">View Analytics</span>
                  <p className="text-xs text-gray-500 mt-1">Track job performance</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
                <p className="text-sm text-gray-500 mt-1">Latest candidate submissions</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-purple-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.83.63-1.874 1-3 1s-2.17-.37-3-1m-6 0c-.83.63-1.874 1-3 1s-2.17-.37-3-1m0 0v-1m0 0c.83.63 1.874 1 3 1s2.17-.37 3-1m-6 0v-1" />
                  </svg>
                </div>
                {recentApplications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {recentApplications.length}
                  </span>
                )}
              </div>
            </div>

            {stats.totalApplications === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <p className="text-gray-500">No applications received yet</p>
                <p className="text-sm text-gray-400 mt-1">Applications will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app, i) => (
                  <div 
                    key={i} 
                    className="group flex items-center p-4 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-white transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/employer/jobs/${app.jobId}/applications`)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                      <span className="text-purple-700 font-medium text-sm">
                        {app.candidate?.name?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                        {app.candidate?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Applied for {app.jobTitle}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-700 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                ))}
                {recentApplications.length > 0 && (
                  <Link
                    href="/employer/applications"
                    className="block text-center mt-4 text-red-700 hover:text-red-800 text-sm font-medium"
                  >
                    View all applications →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}