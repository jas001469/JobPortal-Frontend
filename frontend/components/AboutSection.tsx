import {
  UserPlus,
  Search,
  CheckCircle,
  Briefcase,
  Building2,
  FileText,
  Eye,
  Users,
} from "lucide-react";

export default function AboutPage() {
  return (
    <section id="about" className="bg-zinc-100 py-20">
      <div className="mx-auto max-w-7xl px-6">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-black mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Our platform makes it easy for job seekers to find jobs and for employers to hire quality talent.
          </p>
        </div>

        {/* BOTH SECTIONS SIDE BY SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* JOB SEEKERS */}
          <div className="bg-white rounded-[2.5rem] px-10 py-12 shadow-sm">
            <h3 className="text-center text-xl font-semibold mb-2">
              For Job Seekers
            </h3>

            <div className="flex justify-center mb-10">
              <span className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                Easy Process
              </span>
            </div>

            <div className="grid grid-cols-2 gap-10 text-center">
              <Feature
                icon={<UserPlus className="h-6 w-6" />}
                title="Create Your Profile"
                desc="Sign up and build your profile with skills, experience and availability."
               
              />
              <Feature
                icon={<Search className="h-6 w-6" />}
                title="Discover Jobs"
                desc="Search and filter opportunities that match your skills and preferences."
               
              />
              <Feature
                icon={<CheckCircle className="h-6 w-6" />}
                title="Apply Quickly"
                desc="Submit applications with just a few clicks, no lengthy forms."
                
              />
              <Feature
                icon={<Briefcase className="h-6 w-6" />}
                title="Start Working"
                desc="Get hired and begin earning with essential service roles."
                
              />
            </div>
          </div>

          {/* EMPLOYERS */}
          <div className="bg-white rounded-[2.5rem] px-10 py-12 shadow-sm">
            <h3 className="text-center text-xl font-semibold mb-2">
              For Employers
            </h3>

            <div className="flex justify-center mb-10">
              <span className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                Hiring Made Simple
              </span>
            </div>

            <div className="grid grid-cols-2 gap-10 text-center">
              <Feature
                icon={<Building2 className="h-6 w-6" />}
                title="Register Company"
                desc="Create your employer account with company details and requirements."
              />
              <Feature
                icon={<FileText className="h-6 w-6" />}
                title="Post Job Openings"
                desc="Create detailed job listings with clear requirements and benefits."
              />
              <Feature
                icon={<Eye className="h-6 w-6" />}
                title="Review Candidates"
                desc="Browse profiles, review applications and connect easily."
              />
              <Feature
                icon={<Users className="h-6 w-6" />}
                title="Hire Quality Workers"
                desc="Select qualified candidates and build your workforce."
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  desc,
  step,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  step?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-14 w-14 rounded-full bg-red-700 hover:bg-red-800 transition flex items-center justify-center text-white mb-4">
        {icon}
      </div>

      <h4 className="font-semibold mb-2">{title}</h4>

      <p className="text-sm text-gray-600 mb-4 max-w-xs">
        {desc}
      </p>

      {step && (
        <span className="text-4xl font-bold text-red-200">{step}</span>
      )}
    </div>
  );
}
