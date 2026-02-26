"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "CANDIDATE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: "CANDIDATE" | "EMPLOYER") => {
    setForm({ ...form, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate phone number format (optional)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Send registration data (without confirmPassword)
      const { confirmPassword, ...registerData } = form;
      const res = await api.post("/auth/register", registerData);
      
      // Success - cookies are automatically set by backend
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-96 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-2">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl px-8 mt-22 pt-16 pb-10 relative">
        {/* CIRCULAR IMAGE AT TOP CENTER */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="relative w-40 h-40  rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-red-100">
            <Image
              src="/photo4.JPG"
              alt="Profile"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center mt-14 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500">
            Sign up to get started
          </p>
        </div>

        {/* ROLE TOGGLE */}
        <div className="flex rounded-full bg-red-50 p-1 mb-6">
          <button
            type="button"
            onClick={() => handleRoleChange("CANDIDATE")}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition ${
              form.role === "CANDIDATE"
                ? "bg-red-700 text-white shadow"
                : "text-red-700"
            }`}
          >
            Candidate
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("EMPLOYER")}
            className={`flex-1 py-2.5 rounded-full text-sm font-medium transition ${
              form.role === "EMPLOYER"
                ? "bg-red-700 text-white shadow"
                : "text-red-700"
            }`}
          >
            Employer
          </button>
        </div>

        {/* EMPLOYER INFO */}
        {form.role === "EMPLOYER" && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Register as employer to post jobs and manage candidates.
          </div>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
              required
            />
          </div>

          <div className="relative">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 text-white py-3.5 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-70 mt-2"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-sm text-gray-600 text-center mt-8">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-red-700 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}