"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  experience: string;
  education: string;
  deadline: string;
  status: string;
}

type ActiveSection = "basic" | "description" | "requirements" | "skills" | "preferences";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: [""],
    responsibilities: [""],
    skills: [""],
    experience: "",
    education: "",
    deadline: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSection, setActiveSection] = useState<ActiveSection>("basic");

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success && data.job) {
        const job = data.job;
        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          type: job.type || "Full-time",
          salary: job.salary || "",
          description: job.description || "",
          requirements: job.requirements?.length ? job.requirements : [""],
          responsibilities: job.responsibilities?.length ? job.responsibilities : [""],
          skills: job.skills?.length ? job.skills : [""],
          experience: job.experience || "",
          education: job.education || "",
          deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "",
          status: job.status || "Active",
        });
      } else {
        setError("Failed to fetch job details");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError("An error occurred while fetching job details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayFieldChange = (field: keyof JobFormData, index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] as string[])];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayField = (field: keyof JobFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  const removeArrayField = (field: keyof JobFormData, index: number) => {
    if (formData[field].length <= 1) return;
    setFormData((prev) => {
      const newArray = [...(prev[field] as string[])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const filteredFormData = {
        ...formData,
        requirements: formData.requirements.filter(req => req.trim() !== ""),
        responsibilities: formData.responsibilities.filter(resp => resp.trim() !== ""),
        skills: formData.skills.filter(skill => skill.trim() !== ""),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(filteredFormData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Job updated successfully!");
        setTimeout(() => {
          router.push("/employer/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Failed to update job");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      setError("An error occurred while updating the job");
    } finally {
      setSubmitting(false);
    }
  };

  const sections: { id: ActiveSection; label: string; icon: string }[] = [
    { id: "basic", label: "Basic Info", icon: "📝" },
    { id: "description", label: "Description", icon: "📄" },
    { id: "requirements", label: "Requirements", icon: "✅" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "preferences", label: "Preferences", icon: "🎯" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-100 border-t-red-700 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-red-700"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-lg font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center">
              <Link
                href="/employer/dashboard"
                className="flex items-center text-gray-600 hover:text-red-700 mr-6 group transition-colors"
              >
                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Job Posting</h1>
                <p className="text-gray-600 mt-1">Update your job listing details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.status === "Active" 
                  ? "bg-green-100 text-green-800" 
                  : formData.status === "Closed" 
                  ? "bg-red-100 text-red-800" 
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {formData.status}
              </span>
              <button
                type="submit"
                form="job-form"
                disabled={submitting}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : "Update Job"}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg animate-in slide-in-from-left-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg animate-in slide-in-from-left-2">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">{success}</p>
                  <p className="text-xs text-green-600 mt-1">Redirecting to dashboard...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeSection === section.id
                        ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-l-4 border-red-500"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-3 text-lg">{section.icon}</span>
                    {section.label}
                    {activeSection === section.id && (
                      <svg className="ml-auto w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Quick Actions</div>
                <div className="space-y-2">
                  <Link
                    href="/employer/dashboard"
                    className="flex items-center text-sm text-gray-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Return to Dashboard
                  </Link>
                  <button
                    type="submit"
                    form="job-form"
                    disabled={submitting}
                    className="w-full flex items-center justify-center text-sm bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2.5 rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:w-3/4">
            <form id="job-form" onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Progress Indicator */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{formData.title || "Untitled Job"}</h2>
                    <p className="text-sm text-gray-600 mt-1">{formData.company}</p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">Section:</span>
                      <span className="font-medium text-gray-900">
                        {sections.find(s => s.id === activeSection)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Basic Information Section */}
                <div className={`space-y-6 ${activeSection !== "basic" ? "hidden" : "block"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="e.g., Senior Frontend Developer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="e.g., San Francisco, CA or Remote"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salary Range
                        </label>
                        <input
                          type="text"
                          name="salary"
                          value={formData.salary}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="e.g., $80,000 - $120,000"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          >
                            <option value="Active">Active</option>
                            <option value="Closed">Closed</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Deadline
                          </label>
                          <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveSection("description")}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all flex items-center"
                    >
                      Next: Job Description
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Job Description Section */}
                <div className={`space-y-6 ${activeSection !== "description" ? "hidden" : "block"}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="Describe the role, responsibilities, company culture, and what makes this position exciting..."
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Provide a compelling description to attract the best candidates.
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveSection("basic")}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("requirements")}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all flex items-center"
                    >
                      Next: Requirements
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Requirements Section */}
                <div className={`space-y-6 ${activeSection !== "requirements" ? "hidden" : "block"}`}>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Requirements</h3>
                        <button
                          type="button"
                          onClick={() => addArrayField("requirements")}
                          className="text-sm text-red-700 hover:text-red-800 font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Requirement
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.requirements.map((requirement, index) => (
                          <div key={index} className="flex items-center gap-3 group">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={requirement}
                                onChange={(e) => handleArrayFieldChange("requirements", index, e.target.value)}
                                placeholder={`Requirement ${index + 1}`}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeArrayField("requirements", index)}
                              className="px-3 py-3 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                              disabled={formData.requirements.length <= 1}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Responsibilities</h3>
                        <button
                          type="button"
                          onClick={() => addArrayField("responsibilities")}
                          className="text-sm text-red-700 hover:text-red-800 font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add Responsibility
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.responsibilities.map((responsibility, index) => (
                          <div key={index} className="flex items-center gap-3 group">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={responsibility}
                                onChange={(e) => handleArrayFieldChange("responsibilities", index, e.target.value)}
                                placeholder={`Responsibility ${index + 1}`}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeArrayField("responsibilities", index)}
                              className="px-3 py-3 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                              disabled={formData.responsibilities.length <= 1}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveSection("description")}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("skills")}
                      className="px-5 py-2.5 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all flex items-center"
                    >
                      Next: Skills
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Skills Section */}
                <div className={`space-y-6 ${activeSection !== "skills" ? "hidden" : "block"}`}>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">Required Skills</h3>
                        <p className="text-sm text-gray-500 mt-1">Add technical and soft skills required for this role</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addArrayField("skills")}
                        className="text-sm text-red-700 hover:text-red-800 font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Skill
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-3 group">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={skill}
                              onChange={(e) => handleArrayFieldChange("skills", index, e.target.value)}
                              placeholder={`Skill ${index + 1} (e.g., React, Communication, Problem-solving)`}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeArrayField("skills", index)}
                            className="px-3 py-3 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                            disabled={formData.skills.length <= 1}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveSection("requirements")}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection("preferences")}
                      className="px-5 py-2.5 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all flex items-center"
                    >
                      Next: Preferences
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className={`space-y-6 ${activeSection !== "preferences" ? "hidden" : "block"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Required
                      </label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="e.g., 3+ years of experience"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Specify minimum experience level
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education Required
                      </label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="e.g., Bachelor's degree in Computer Science"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Educational qualifications needed
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveSection("skills")}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </button>
                    <div className="flex space-x-3">
                      <Link
                        href="/employer/dashboard"
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-linear-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating Job...
                          </>
                        ) : "Update Job Posting"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Mobile Navigation */}
            <div className="lg:hidden mt-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Navigate Sections:</span>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const sections = ["basic", "description", "requirements", "skills", "preferences"];
                        const currentIndex = sections.indexOf(activeSection);
                        if (currentIndex > 0) setActiveSection(sections[currentIndex - 1] as ActiveSection);
                      }}
                      className="p-2 text-gray-600 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sections = ["basic", "description", "requirements", "skills", "preferences"];
                        const currentIndex = sections.indexOf(activeSection);
                        if (currentIndex < sections.length - 1) setActiveSection(sections[currentIndex + 1] as ActiveSection);
                      }}
                      className="p-2 text-gray-600 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex overflow-x-auto pb-2 space-x-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                        activeSection === section.id
                          ? "bg-red-100 text-red-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}