"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  FileText, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  MapPin,
  IndianRupee,
  Calendar,
  Mail,
  Phone,
  User,
  Building2,
  GraduationCap,
  ExternalLink,
   Globe,
  Award
} from "lucide-react";


interface Job {
  _id: string;
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
  createdAt: string;
  deadline: string | null;
  applicationLink: string;
  companyWebsite: string;
  jobReferenceLink: string;
  employer: {
    _id: string;
    name: string;
    email: string;
  };
}

interface CandidateProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  skills?: string[];
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  summary?: string;
}

export default function ConfirmApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  useEffect(() => {
    fetchJobAndUser();
  }, [params.id]);

  const fetchJobAndUser = async () => {
    try {
      setLoading(true);
      
      // Fetch job details
      const jobResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}`
      );
      const jobData = await jobResponse.json();

      if (jobData.success) {
        setJob(jobData.job);
      } else {
        setError("Job not found");
      }

      // Fetch user
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        credentials: "include",
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.success) {
          setUser(userData.user);
          // If user is a candidate, fetch their profile and check application status
          if (userData.user.role === "CANDIDATE") {
            await fetchCandidateProfile();
            await checkIfApplied();
          } else {
            setCheckingApplication(false);
          }
        }
      } else {
        setCheckingApplication(false);
      }
    } catch (err) {
      setError("Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidate/profile`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCandidateProfile(data.candidate);
        }
      }
    } catch (error) {
      console.error("Error fetching candidate profile:", error);
    }
  };

  const checkIfApplied = async () => {
    try {
      setCheckingApplication(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}/has-applied`,
        {
          credentials: "include",
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setHasApplied(data.hasApplied);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    } finally {
      setCheckingApplication(false);
    }
  };

  const handleApply = async () => {
    // Check if candidate has resume
    if (!candidateProfile?.resume) {
      alert("Please add a resume to your profile before applying");
      router.push("/candidate/profile");
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jobs/${params.id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setApplySuccess(true);
        setTimeout(() => {
          router.push("/candidate/applications");
        }, 2000);
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{error || "Job not found"}</h1>
          <Link
            href="/jobs"
            className="inline-block text-red-700 hover:underline font-medium"
          >
            ← Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is logged in and is a candidate
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <AlertCircle className="h-16 w-16 text-red-700 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-8">
              Please login as a candidate to apply for this job.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/auth/login?redirect=/jobs/confirm-apply/${params.id}`}
                className="bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition"
              >
                Login
              </Link>
              <Link
                href={`/auth/register?redirect=/jobs/confirm-apply/${params.id}`}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-medium hover:bg-gray-300 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "CANDIDATE") {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <AlertCircle className="h-16 w-16 text-red-700 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Employer Account</h1>
            <p className="text-gray-600 mb-8">
              Only candidates can apply for jobs. Please switch to a candidate account.
            </p>
            <Link
              href="/jobs"
              className="inline-block bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hasApplied && !applySuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Already Applied!</h1>
            <p className="text-gray-600 mb-8">
              You have already submitted an application for {job.title} at {job.company}.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/candidate/applications"
                className="bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition"
              >
                View My Applications
              </Link>
              <Link
                href="/jobs"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-medium hover:bg-gray-300 transition"
              >
                Browse More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (applySuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-8">
              Your application for {job.title} at {job.company} has been successfully submitted.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Redirecting to your applications page...
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/candidate/applications"
                className="bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition"
              >
                View Applications
              </Link>
              <Link
                href="/jobs"
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-medium hover:bg-gray-300 transition"
              >
                Browse More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Job Details
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-t-2xl px-8 py-6">
          <h1 className="text-2xl font-bold text-white mb-2">Confirm Your Application</h1>
          <p className="text-red-100">
            Please review all information below before submitting your application
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          {/* Job Information Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Briefcase className="h-6 w-6 text-red-700 mr-2" />
              Job Information
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job Title</p>
                  <p className="font-semibold text-gray-900 text-lg">{job.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Company</p>
                  <p className="font-semibold text-gray-900">{job.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-800 flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    {job.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Salary</p>
                  <p className="text-gray-800 flex items-center">
                    <IndianRupee className="w-4 h-4 text-gray-400 mr-1" />
                    {job.salary}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Job Type</p>
                  <p className="text-gray-800">{job.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Category</p>
                  <p className="text-gray-800">{job.category}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500 mb-1">Experience Required</p>
                  <p className="text-gray-800">{job.experience}</p>
                </div> */}
                {/* <div>
                  <p className="text-sm text-gray-500 mb-1">Education Required</p>
                  <p className="text-gray-800">{job.education}</p>
                </div> */}
                {job.deadline && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Application Deadline</p>
                    <p className="text-gray-800 flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                      {formatDate(job.deadline)}
                    </p>
                  </div>
                )}
              </div>

              {/* Skills */}
              {/* {job.skills && job.skills.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )} */}
              {job.skills && job.skills.length > 0 && (
              <div className="bg-white mt-10 rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-5">Job Profile</h2>
                <ul className="space-y-1 list-disc pl-5">
                  {job.skills.map((skill, index) => (
                    <li key={index} className="text-gray-700">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            </div>
          </div>

          {/* Employer Information Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Institute</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                  <Building2 className="w-6 h-6 text-red-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-lg">{job.company}</p>
                  <p className="text-sm text-gray-500">Educational Institute</p>
                </div>
              </div>
              {job.companyWebsite && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-red-700 hover:text-red-800 text-sm font-medium"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Institute Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>

          {/* Candidate Information Section */}
          <div className="mt-10 mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <User className="h-6 w-6 text-red-700 mr-2" />
              Your Information
            </h2>
            
            <div className="bg-gray-50 rounded-xl p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">{candidateProfile?.name || user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800 flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    {candidateProfile?.email || user?.email}
                  </p>
                </div>
                {candidateProfile?.phone && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="text-gray-800 flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      {candidateProfile.phone}
                    </p>
                  </div>
                )}
              </div>

              {/* Resume */}
              {candidateProfile?.resume ? (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800">Resume uploaded</span>
                    </div>
                    <a
                      href={candidateProfile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 hover:text-red-800 font-medium text-sm"
                    >
                      View Resume
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    You haven't added a resume to your profile. 
                    <Link href="/candidate/profile" className="text-red-700 font-medium hover:underline ml-1">
                      Add resume
                    </Link>
                  </p>
                </div>
              )}

              {/* Skills */}
              {candidateProfile?.skills && candidateProfile.skills.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-2">Your Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {candidateProfile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {candidateProfile?.education && candidateProfile.education.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    Education
                  </p>
                  <div className="space-y-3">
                    {candidateProfile.education.map((edu, index) => (
                      <div key={index} className="bg-white rounded-lg p-3">
                        <p className="font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {candidateProfile?.experience && candidateProfile.experience.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3 flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    Work Experience
                  </p>
                  <div className="space-y-3">
                    {candidateProfile.experience.map((exp, index) => (
                      <div key={index} className="bg-white rounded-lg p-3">
                        <p className="font-medium text-gray-900">{exp.title}</p>
                        <p className="text-sm text-gray-600">{exp.company} • {exp.duration}</p>
                        <p className="text-sm text-gray-500 mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Professional Summary */}
              {candidateProfile?.summary && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Professional Summary</p>
                  <p className="text-gray-700 bg-white p-4 rounded-lg border">
                    {candidateProfile.summary}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            
            <button
              onClick={handleApply}
              disabled={applying || !candidateProfile?.resume}
              className="flex-1 bg-red-700 text-white px-6 py-4 rounded-xl font-medium hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {applying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Confirm & Submit Application
                </>
              )}
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By submitting this application, you confirm that all information provided is accurate and complete.
            Your profile information and resume will be shared with the employer.
          </p>
        </div>
      </div>
    </div>
  );
}