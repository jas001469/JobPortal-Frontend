"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CandidateProfilePage() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    summary: "",
    skills: "",
  });

  const [education, setEducation] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    fetchCandidate();
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
          populateForm(data.candidate);
        } else {
          router.push("/");
        }
      } else {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (candidateData: any) => {
    setForm({
      name: candidateData.name || "",
      email: candidateData.email || "",
      phone: candidateData.phone || "",
      address: candidateData.address || "",
      city: candidateData.city || "",
      state: candidateData.state || "",
      country: candidateData.country || "",
      pincode: candidateData.pincode || "",
      summary: candidateData.summary || "",
      skills: candidateData.skills?.join(", ") || "",
    });
    setEducation(candidateData.education || []);
    setExperience(candidateData.experience || []);
    setResumeUrl(candidateData.resume || "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setResume(file);
    }
  };

  const uploadResume = async () => {
    if (!resume) {
      setError("Please select a resume file");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/upload-resume`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Resume uploaded successfully!");
        setResumeUrl(data.resumeUrl);
        setResume(null);
        // Update candidate data
        fetchCandidate();
      } else {
        setError(data.message || "Failed to upload resume");
      }
    } catch (err) {
      setError("Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formattedData = {
        ...form,
        skills: form.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
        education,
        experience,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Profile updated successfully!");
        setCandidate(data.candidate);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const addEducation = () => {
    setEducation([
      ...education,
      { degree: "", institution: "", year: "", grade: "" }
    ]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      { title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }
    ]);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Profile</h1>
          <p className="text-gray-600">
            Complete your profile to increase your chances of getting hired
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 outline-none"
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                  placeholder="+91"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                  placeholder="Your country"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                placeholder="Your full address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Resume</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
              {resumeUrl ? (
                <div className="mb-4">
                  <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-700 mb-2">Resume uploaded successfully</p>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}${resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-700 hover:underline"
                  >
                    View Resume
                  </a>
                </div>
              ) : (
                <div className="mb-4">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-700 mb-2">No resume uploaded</p>
                  <p className="text-sm text-gray-500 mb-4">Upload your resume to apply for jobs</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <label className="cursor-pointer bg-red-700 text-white px-6 py-3 rounded-full font-medium hover:bg-red-800 transition">
                  Choose File
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                </label>
                
                {resume && (
                  <button
                    type="button"
                    onClick={uploadResume}
                    disabled={uploading}
                    className="bg-green-700 text-white px-6 py-3 rounded-full font-medium hover:bg-green-800 transition disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload Resume"}
                  </button>
                )}
              </div>
              
              {resume && (
                <p className="text-sm text-gray-500 mt-4">
                  Selected: {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
              
              <p className="text-xs text-gray-400 mt-4">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Skills</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                placeholder="e.g., React, JavaScript, Node.js, Python, UI/UX Design"
              />
              <p className="text-sm text-gray-500 mt-2">
                Add your skills separated by commas
              </p>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Summary</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About You
              </label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                placeholder="Describe your professional background, career goals, and what you're looking for in your next role..."
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-red-700 text-white px-12 py-4 rounded-full text-lg font-medium hover:bg-red-800 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}