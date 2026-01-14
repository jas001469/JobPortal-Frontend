"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user data on component mount and when pathname changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/me`, {
          method: "GET",
          credentials: "include", // This sends cookies
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [pathname]); // Re-fetch when route changes

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        setUser(null);
        setIsDropdownOpen(false);
        router.push("/");
        router.refresh(); // Refresh the page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get dynamic dashboard link based on role
  const getDashboardLink = () => {
    if (user?.role === "EMPLOYER") {
      return "/employer/dashboard";
    } else if (user?.role === "CANDIDATE") {
      return "/candidate/dashboard";
    }
    return "/dashboard";
  };

  // Get dynamic profile link based on role
  const getProfileLink = () => {
    if (user?.role === "EMPLOYER") {
      return "/employer/profile";
    } else if (user?.role === "CANDIDATE") {
      return "/candidate/profile";
    }
    return "/profile";
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/edfooter1.png" 
            alt="EdTrellis Logo" 
            width={48} 
            height={48} 
            priority 
          />
          <span className="text-2xl font-bold">
            <span className="text-black">Ed</span>
            <span className="text-red-700">Trellis</span>
          </span>
        </Link>

        {/* NAV LINKS - Always show Jobs link */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-800">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <Link href="/#about" className="hover:text-black">
            About Us
          </Link>
          <Link href="/#jobs" className="hover:text-black">
            Jobs
          </Link>
          
          {/* Show role-specific links */}
          {user?.role === "CANDIDATE" && (
            <Link href="/jobs" className="hover:text-black">
              Apply for Job
            </Link>
          )}
          
          {user?.role === "EMPLOYER" && (
            <Link href="/employer/post-job" className="hover:text-black">
              Post a Job
            </Link>
          )}
        </nav>

        {/* USER SECTION OR AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Welcome message with role - hidden on mobile */}
              <div className="hidden md:block text-sm text-gray-700">
                Welcome, <span className="font-semibold">{user.name}</span>
                <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                  {user.role.toLowerCase()}
                </span>
              </div>
              
              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-700 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                      {/* Role indicator */}
                      <div className="px-4 py-2 text-xs text-gray-500 border-b">
                        Signed in as <span className="font-medium capitalize">{user.role.toLowerCase()}</span>
                      </div>
                      
                      <Link
                        href={getProfileLink()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href={getDashboardLink()}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      
                      {/* Show role-specific links */}
                      {user.role === "CANDIDATE" && (
                        <Link
                          href="/jobs"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Browse Jobs
                        </Link>
                      )}
                      
                      {user.role === "EMPLOYER" && (
                        <Link
                          href="/employer/post-job"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Post New Job
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-red-700 px-6 py-2.5 text-red-700 text-sm font-medium hover:bg-red-700 hover:text-white transition"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="rounded-full bg-red-700 px-6 py-2.5 text-white text-sm font-medium hover:bg-red-800 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}