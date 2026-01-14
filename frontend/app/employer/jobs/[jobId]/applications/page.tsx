"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Application {
  _id: string;
  candidate: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    resume?: string;
    profile?: {
      title?: string;
      experience?: string;
    };
  };
  status: string;
  appliedAt: string;
  coverLetter?: string;
  resume?: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function EmployerJobApplications() {
  const { jobId } = useParams();
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAll();
  }, [jobId]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [jobRes, appRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/jobs/employer/applications/${jobId}`,
          { credentials: "include" }
        ),
      ]);

      const jobData = await jobRes.json();
      const appData = await appRes.json();

      if (jobData.success) {
        setJob(jobData.job);
      } else {
        setError("Failed to fetch job details");
      }

      if (appData.success) {
        setApplications(appData.applications);
      } else {
        setError("Failed to fetch applications");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update local state
        setApplications(applications.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
        
        // Update selected application if it's the one being viewed
        if (selectedApplication?._id === applicationId) {
          setSelectedApplication({ ...selectedApplication, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredApplications = statusFilter === "all" 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  const statusOptions = [
    { value: "all", label: "All Applications", color: "gray" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "reviewed", label: "Reviewed", color: "blue" },
    { value: "shortlisted", label: "Shortlisted", color: "green" },
    { value: "rejected", label: "Rejected", color: "red" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push("/employer/dashboard")}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          </div>

          {/* Job Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{job?.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{job?.company}</p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{job?.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{job?.type}</span>
                  </div>
                  
                  {job?.salary && (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{job.salary}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job?.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {job?.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600">{job?.description}</p>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-2">Posted on</div>
                <div className="text-lg font-semibold text-gray-900">
                  {job?.createdAt ? new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }) : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Applications ({applications.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage and review all applications for this position
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <button
                    onClick={fetchAll}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500">Applications will appear here when candidates apply for this position</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
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
                    {filteredApplications.map((application) => (
                      <tr 
                        key={application._id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                              <span className="text-red-700 font-medium">
                                {application.candidate.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {application.candidate.name}
                              </div>
                              {application.candidate.profile?.title && (
                                <div className="text-sm text-gray-500">
                                  {application.candidate.profile.title}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{application.candidate.email}</div>
                          {application.candidate.phone && (
                            <div className="text-sm text-gray-500">{application.candidate.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(application.appliedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={application.status}
                            onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={`text-xs font-medium rounded-full px-3 py-1 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${getStatusColor(application.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedApplication(application);
                            }}
                            className="text-red-700 hover:text-red-800 mr-4"
                          >
                            View Details
                          </button>
                          {application.resume && (
                            <a
                              href={application.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Resume
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedApplication.candidate.name}
                  </h3>
                  <p className="text-gray-600">{selectedApplication.candidate.email}</p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <p className="text-gray-900">
                      <span className="font-medium">Email:</span> {selectedApplication.candidate.email}
                    </p>
                    {selectedApplication.candidate.phone && (
                      <p className="text-gray-900">
                        <span className="font-medium">Phone:</span> {selectedApplication.candidate.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Application Status</h4>
                  <div className="flex items-center space-x-4">
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => handleStatusUpdate(selectedApplication._id, e.target.value)}
                      className={`text-sm font-medium rounded-full px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${getStatusColor(selectedApplication.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <span className="text-sm text-gray-500">
                      Applied {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedApplication.candidate.profile?.experience && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Experience</h4>
                  <p className="text-gray-900">{selectedApplication.candidate.profile.experience}</p>
                </div>
              )}

              {selectedApplication.coverLetter && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Cover Letter</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              {selectedApplication.resume && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Resume</h4>
                  <a
                    href={selectedApplication.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-red-700 hover:text-red-800"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Resume
                  </a>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}