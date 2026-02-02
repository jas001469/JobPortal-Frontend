"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    try {
      // REMOVE localStorage.setItem - we're using cookies now
      const res = await api.post("/auth/login", form);
      
      // Success - cookies are automatically set by backend
      router.push("/");
      router.refresh(); // IMPORTANT: This triggers navbar to update
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl px-8 py-10">

      {/* HEADER */}
      <h2 className="text-2xl font-bold mb-2 text-black">
        Welcome Back
      </h2>
      <p className="text-gray-500 mb-6">
        Sign in to continue
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
          Employer login allows job posting and candidate management.
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm mb-4">
          {error}
        </p>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-200 focus:border-red-700 focus:ring-2 focus:ring-red-700 px-4 py-3 rounded-xl outline-none transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-700 text-white py-3 rounded-full font-medium hover:bg-red-800 transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-sm text-gray-500 text-center mt-6">
        Don't have an account?{" "}
        <Link
          href="/auth/register"
          className="text-red-700 font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}