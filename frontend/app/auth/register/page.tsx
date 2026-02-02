"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

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
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl px-8 py-10">
      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-2 text-black">
        Create Account
      </h2>
      <p className="text-gray-600 mb-6">
        Sign up to get started
      </p>

      {/* ROLE TOGGLE */}
      <div className="flex rounded-full bg-red-50 p-1 mb-6">
        <button
          type="button"
          onClick={() => handleRoleChange("CANDIDATE")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
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
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
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
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Register as employer to post jobs and manage candidates.
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm mb-4">
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
            className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
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
            className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
            required
          />
        </div>
{/* 
        <div className="relative">
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number (Optional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
          />
        </div> */}

        <div className="relative">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
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
            className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-full font-medium hover:bg-red-800 transition disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-sm text-gray-600 text-center mt-6">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-red-700 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}