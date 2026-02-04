"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  ExternalLink, 
  Link as LinkIcon, 
  Globe, 
  Briefcase, 
  ChevronRight, 
  FileText, 
  List, 
  Tag, 
  Calendar 
} from "lucide-react";

interface JobFormData {
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
  deadline: string;
  status: string;
  applicationLink: string;
  companyWebsite: string;
  jobReferenceLink: string;
}

type ActiveTab = "basic" | "details" | "links";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [form, setForm] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    category: "",
    description: "",
    requirements: [],
    skills: [],
    experience: "0-1 years",
    education: "Any",
    deadline: "",
    status: "Active",
    applicationLink: "",
    companyWebsite: "",
    jobReferenceLink: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("basic");

  const [categories] = useState<string[]>([
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Design",
    "Sales",
    "Customer Service",
    "Operations",
    "Other",
  ]);

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
        setForm({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          salary: job.salary || "",
          type: job.type || "",
          category: job.category || "",
          description: job.description || "",
          requirements: job.requirements || [],
          skills: job.skills || [],
          experience: job.experience || "0-1 years",
          education: job.education || "Any",
          deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "",
          status: job.status || "Active",
          applicationLink: job.applicationLink || "",
          companyWebsite: job.companyWebsite || "",
          jobReferenceLink: job.jobReferenceLink || "",
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const requirements = e.target.value.split("\n").filter(r => r.trim() !== "");
    setForm((prev) => ({
      ...prev,
      requirements,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
    setForm((prev) => ({
      ...prev,
      skills,
    }));
  };

  const validateUrl = (url: string) => {
    if (!url) return true; // Empty is valid (optional field)
    
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
    return urlPattern.test(url);
  };

  const validateCurrentTab = () => {
    if (activeTab === "basic") {
      return form.title && form.company && form.location && form.salary;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    // Validate URLs
    if (!validateUrl(form.applicationLink)) {
      setError("Please enter a valid application link URL (e.g., https://example.com/apply)");
      setSubmitting(false);
      return;
    }

    if (!validateUrl(form.companyWebsite)) {
      setError("Please enter a valid company website URL");
      setSubmitting(false);
      return;
    }

    if (!validateUrl(form.jobReferenceLink)) {
      setError("Please enter a valid job reference link URL");
      setSubmitting(false);
      return;
    }

    try {
      const jobData = {
        ...form,
        deadline: form.deadline ? new Date(form.deadline) : null,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(jobData),
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Job Posting</h1>
            <p className="text-gray-600">Update the details of your job opening</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeTab === "basic" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  1
                </div>
                <span className={`font-medium ${activeTab === "basic" ? "text-red-700" : "text-gray-600"}`}>
                  Basic Info
                </span>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeTab === "details" ? "bg-red-700 text-white" : activeTab === "links" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  2
                </div>
                <span className={`font-medium ${
                  activeTab === "details" || activeTab === "links" ? "text-red-700" : "text-gray-600"
                }`}>
                  Job Details
                </span>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
              
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeTab === "links" ? "bg-red-700 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  3
                </div>
                <span className={`font-medium ${activeTab === "links" ? "text-red-700" : "text-gray-600"}`}>
                  Additional Links
                </span>
              </div>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-red-700 transition-all duration-300 ${
                  activeTab === "basic" ? "w-1/3" : activeTab === "details" ? "w-2/3" : "w-full"
                }`}
              ></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === "basic"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Basic Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === "details"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Job Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("links")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                activeTab === "links"
                  ? "border-red-700 text-red-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Additional Links
            </button>
          </div>

          {/* Job Editing Form */}
          <form onSubmit={handleSubmit}>
            {/* Tab 1: Basic Information */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., Senior Frontend Developer"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institute Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., Google"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., Remote, New York, NY"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary *
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={form.salary}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      placeholder="e.g., $80,000 - $100,000"
                      required
                    />
                  </div>

                  {/* Job Type - Optional */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    >
                      <option value="">Select job type (optional)</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  {/* Category - Optional */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    >
                      <option value="">Select category (optional)</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Deadline Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Last date to apply for this position
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Required *
                    </label>
                    <select
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      required
                    >
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Required *
                    </label>
                    <select
                      name="education"
                      value={form.education}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      required
                    >
                      <option value="Any">Any</option>
                      <option value="High School">High School</option>
                      <option value="Associate">Associate</option>
                      <option value="Bachelor's">Bachelor's</option>
                      <option value="Master's">Master's</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  {/* Status Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Status
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <Link
                    href="/employer/dashboard"
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    disabled={!validateCurrentTab()}
                    className="bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Job Description
                    <ChevronRight className="w-4 h-4 inline ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Job Description - Optional Fields */}
            {activeTab === "details" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-blue-700 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-blue-800 text-sm">
                        <span className="font-medium">Note:</span> These fields are optional but recommended for better candidate understanding.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder="Describe the job responsibilities, tasks, and day-to-day activities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <List className="h-4 w-4 mr-2 text-gray-500" />
                    Requirements (one per line)
                  </label>
                  <textarea
                    name="requirements"
                    value={form.requirements.join("\n")}
                    onChange={handleRequirementsChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder="• 3+ years of experience in React
• Strong knowledge of JavaScript
• Experience with Redux or Context API"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-gray-500" />
                    Skills Required (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={form.skills.join(", ")}
                    onChange={handleSkillsChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                    placeholder="e.g., React, JavaScript, Node.js, CSS"
                  />
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("basic")}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
                  >
                    <ChevronRight className="w-4 h-4 inline mr-2 rotate-180" />
                    Back to Basic Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("links")}
                    className="bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition"
                  >
                    Next: Additional Links
                    <ChevronRight className="w-4 h-4 inline ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Additional Links */}
            {activeTab === "links" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start">
                    <LinkIcon className="h-5 w-5 text-green-700 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-800 text-sm">
                        <span className="font-medium">Optional but recommended:</span> Adding links helps candidates learn more about your company and increases application rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Application Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                      Application Link
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        🔗
                      </div>
                      <input
                        type="url"
                        name="applicationLink"
                        value={form.applicationLink}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://yourcompany.com/apply"
                      />
                      {form.applicationLink && (
                        <a
                          href={form.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-700 hover:text-red-800"
                          title="Open link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      External application portal URL
                    </p>
                  </div>

                  {/* Company Website */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      Institute Website
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        🌐
                      </div>
                      <input
                        type="url"
                        name="companyWebsite"
                        value={form.companyWebsite}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://yourcompany.com"
                      />
                      {form.companyWebsite && (
                        <a
                          href={form.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-700 hover:text-red-800"
                          title="Open website"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Official Institute Website
                    </p>
                  </div>

                  {/* Job Reference Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      Job Reference Link
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        📄
                      </div>
                      <input
                        type="url"
                        name="jobReferenceLink"
                        value={form.jobReferenceLink}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-10 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                        placeholder="https://drive.google.com/job-description"
                      />
                      {form.jobReferenceLink && (
                        <a
                          href={form.jobReferenceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-700 hover:text-red-800"
                          title="Open reference"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Link to detailed job description or additional resources
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
                  >
                    <ChevronRight className="w-4 h-4 inline mr-2 rotate-180" />
                    Back to Job Description
                  </button>
                  <div className="flex space-x-3">
                    <Link
                      href="/employer/dashboard"
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Updating Job...
                        </>
                      ) : (
                        "Update Job"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Form Summary */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Title: {form.title || "Not filled"}</li>
                  <li>Company: {form.company || "Not filled"}</li>
                  <li>Location: {form.location || "Not filled"}</li>
                  <li>Job Type: {form.type || "Optional"}</li>
                  <li>Category: {form.category || "Optional"}</li>
                  <li>Deadline: {form.deadline || "Optional"}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Description: {form.description ? "✓ Added" : "Optional"}</li>
                  <li>Requirements: {form.requirements.length > 0 ? "✓ Added" : "Optional"}</li>
                  <li>Skills: {form.skills.length > 0 ? "✓ Added" : "Optional"}</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">Additional Links</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>Application Link: {form.applicationLink ? "✓ Added" : "Optional"}</li>
                  <li>Website: {form.companyWebsite ? "✓ Added" : "Optional"}</li>
                  <li>Reference Link: {form.jobReferenceLink ? "✓ Added" : "Optional"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}