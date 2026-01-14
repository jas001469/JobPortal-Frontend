import { Suspense } from "react";
import JobsClient from "./JobsClient";

export const dynamic = "force-dynamic";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading jobs…</div>}>
      <JobsClient />
    </Suspense>
  );
}



// export const dynamic = "force-dynamic";


// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import JobCard from "@/components/JobCard";

// interface Job {
//   _id: string;
//   title: string;
//   company: string;
//   location: string;
//   salary: string;
//   type: string;
//   category: string;
//   description: string;
//   experience: string;
//   createdAt: string;
//   employer: {
//     name: string;
//     email: string;
//   };
// }

// export default function JobsPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [user, setUser] = useState<any>(null);

//   const [filters, setFilters] = useState({
//     category: "",
//     type: "",
//     location: "",
//     search: "",
//   });

//   /* -----------------------------
//      1️⃣ Read URL → Filters
//   ------------------------------*/
//   useEffect(() => {
//     setFilters({
//       search: searchParams.get("search") || "",
//       location: searchParams.get("location") || "",
//       category: searchParams.get("category") || "",
//       type: searchParams.get("type") || "",
//     });
//   }, [searchParams]);

//   /* -----------------------------
//      2️⃣ Fetch user
//   ------------------------------*/
//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//         credentials: "include",
//       });
//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) setUser(data.user);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* -----------------------------
//      3️⃣ Fetch jobs when filters change
//   ------------------------------*/
//   useEffect(() => {
//     fetchJobs();
//   }, [filters]);

//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams(filters);
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/jobs?${params.toString()}`
//       );
//       const data = await res.json();
//       if (data.success) setJobs(data.jobs);
//       else setError("Failed to fetch jobs");
//     } catch (err) {
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* -----------------------------
//      4️⃣ When user changes filters
//         → update URL
//   ------------------------------*/
//   const updateFilter = (key: string, value: string) => {
//     const newFilters = { ...filters, [key]: value };
//     setFilters(newFilters);

//     const params = new URLSearchParams(newFilters);
//     router.push(`/jobs?${params.toString()}`);
//   };

//   /* -----------------------------
//      5️⃣ Search submit
//   ------------------------------*/
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const params = new URLSearchParams(filters);
//     router.push(`/jobs?${params.toString()}`);
//   };

//   /* -----------------------------
//      UI
//   ------------------------------*/

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-24 flex justify-center items-center">
//         <div className="animate-spin h-12 w-12 border-b-2 border-red-700 rounded-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-12">
//       <div className="max-w-7xl mx-auto px-4">

//         <h1 className="text-4xl font-bold mb-6 text-center">Browse All Jobs</h1>

//         {/* SEARCH + FILTERS */}
//         <div className="bg-white p-6 rounded-xl shadow mb-8">
//           <form onSubmit={handleSearch} className="space-y-4">
//             <div className="flex gap-4">
//               <input
//                 value={filters.search}
//                 onChange={(e) => updateFilter("search", e.target.value)}
//                 placeholder="Search jobs"
//                 className="flex-1 border px-5 py-3 rounded-xl"
//               />
//               <button className="bg-red-700 text-white px-8 rounded-xl">
//                 Search
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <input
//                 value={filters.location}
//                 onChange={(e) => updateFilter("location", e.target.value)}
//                 placeholder="Location"
//                 className="border px-4 py-3 rounded-xl"
//               />

//               <select
//                 value={filters.category}
//                 onChange={(e) => updateFilter("category", e.target.value)}
//                 className="border px-4 py-3 rounded-xl"
//               >
//                 <option value="">All Categories</option>
//                 <option>Technology</option>
//                 <option>Marketing</option>
//                 <option>Finance</option>
//               </select>

//               <select
//                 value={filters.type}
//                 onChange={(e) => updateFilter("type", e.target.value)}
//                 className="border px-4 py-3 rounded-xl"
//               >
//                 <option value="">All Types</option>
//                 <option>Full-time</option>
//                 <option>Internship</option>
//                 <option>Remote</option>
//               </select>
//             </div>
//           </form>
//         </div>

//         <p className="mb-4 text-gray-600">
//           Found <b>{jobs.length}</b> jobs
//         </p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {jobs.map(job => (
//             <JobCard key={job._id} job={job} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
