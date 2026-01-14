"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<string[]>([
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

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "Full-time",
    category: "Technology",
    description: "",
    requirements: "",
    skills: "",
    experience: "0-1 years",
    education: "Any",
  });

  // Check if user is employer
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user.role !== "EMPLOYER") {
            router.push("/");
          }
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/auth/login");
      }
    };

    checkUserRole();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Format requirements and skills as arrays
      const jobData = {
        ...form,
        requirements: form.requirements.split("\n").filter(r => r.trim() !== ""),
        skills: form.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Job posted successfully!");
        setForm({
          title: "",
          company: "",
          location: "",
          salary: "",
          type: "Full-time",
          category: "Technology",
          description: "",
          requirements: "",
          skills: "",
          experience: "0-1 years",
          education: "Any",
        });
        
        // Redirect to jobs page after 2 seconds
        setTimeout(() => {
          router.push("/employer/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Failed to post job");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
            <p className="text-gray-600">Fill in the details below to post your job opening</p>
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

          {/* Job Posting Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
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
                  Company Name *
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                  required
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
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
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
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                placeholder="Describe the job responsibilities, tasks, and day-to-day activities..."
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements (one per line) *
              </label>
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                placeholder="• 3+ years of experience in React
• Strong knowledge of JavaScript
• Experience with Redux or Context API"
                required
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required (comma separated) *
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                placeholder="e.g., React, JavaScript, Node.js, CSS"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-700 text-white py-3 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Posting Job..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}