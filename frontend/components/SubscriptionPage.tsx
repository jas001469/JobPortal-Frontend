"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Recruit Basic",
    isFree: true,
    monthly: 0,
    yearly: 0,
    features: [
      { label: "Access to core HR features", enabled: true },
      { label: "Employee record management", enabled: true },
      { label: "Basic reporting tools", enabled: true },
      { label: "Manage up to 10 team members", enabled: true },
      { label: "Track employee attendance", enabled: false },
      { label: "Assign and monitor tasks", enabled: false },
      { label: "Email support", enabled: false },
    ],
  },
  {
    name: "Talent Pro",
    monthly: 499,
    yearly: 5390,
    popular: true,
    features: [
      { label: "Access to core HR features", enabled: true },
      { label: "Employee record management", enabled: true },
      { label: "Basic reporting tools", enabled: true },
      { label: "Manage up to 10 team members", enabled: true },
      { label: "Track employee attendance", enabled: true },
      { label: "Assign and monitor tasks", enabled: true },
      { label: "Email support", enabled: false },
    ],
  },
  {
    name: "HR Master",
    monthly: 799,
    yearly: 8990,
    features: [
      { label: "Access to core HR features", enabled: true },
      { label: "Employee record management", enabled: true },
      { label: "Basic reporting tools", enabled: true },
      { label: "Manage up to 10 team members", enabled: true },
      { label: "Track employee attendance", enabled: true },
      { label: "Assign and monitor tasks", enabled: true },
      { label: "Email support", enabled: true },
    ],
  },
];

export default function SubscriptionPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <section className="bg-zinc-100 py-23">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-left mb-10">
          <h1 className="text-4xl font-semibold text-center text-gray-900 mb-4">
            Plans & Pricing
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Streamline hiring with plans that grow with your team
          </p>

          {/* TOGGLE */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center bg-white rounded-full shadow p-1">
              <button
                onClick={() => setBilling("yearly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  billing === "yearly"
                    ? "bg-red-700 text-white"
                    : "text-gray-600"
                }`}
              >
                Annual
              </button>
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  billing === "monthly"
                    ? "bg-red-700 text-white"
                    : "text-gray-600"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan) => {
            const isPopular = plan.popular;
            const isFree = plan.isFree;

            return (
              <div
                key={plan.name}
                className={`
                  rounded-3xl p-8 cursor-pointer border
                  transition-shadow hover:shadow-xl
                  ${
                    isPopular
                      ? "bg-gray-900 text-white border-red-700 shadow-lg"
                      : "bg-white text-gray-700 border-gray-300"
                  }
                `}
              >
                {isPopular && (
                  <span className="absolute top-4 right-4 text-xs bg-red-700 text-white px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}

                {/* TITLE */}
                <h3 className="text-xl font-semibold mb-4">
                  {plan.name}
                </h3>

                {/* PRICE */}
                <div className="mb-6">
                  {isFree ? (
                    <>
                      <span className="text-4xl font-bold text-grey-900">
                        Free
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Free forever
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">
                        ₹
                        {billing === "yearly"
                          ? Math.round(plan.yearly / 12).toLocaleString("en-IN")
                          : plan.monthly.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm opacity-60"> / month</span>

                      {billing === "yearly" && (
                        <p className="text-xs opacity-50 mt-1">
                          ₹{plan.yearly.toLocaleString("en-IN")} billed annually
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* FEATURES */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-sm"
                    >
                      {feature.enabled ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400" />
                      )}
                      {feature.label}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 rounded-full font-medium transition ${
                    isFree
                      ? "bg-gray-700 hover:bg-gray-800 text-white"
                      : isPopular
                      ? "bg-red-700 hover:bg-red-800 text-white"
                      : "bg-gray-800 hover:bg-gray-900 text-white opacity-80"
                  }`}
                >
                  {isFree ? "Get Started Free" : "Start 7-days Free Trial"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
