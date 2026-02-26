"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

const employerPlans = [
  {
    id: "recruit-basic",
    name: "Recruit Basic",
    isFree: true,
    monthly: 0,
    yearly: 0,
    features: [
      { label: "30 job postings", enabled: true },
      { label: "3 featured jobs", enabled: true },
      { label: "Job displayed for 15 days", enabled: true },
      { label: "Email support", enabled: false },
      { label: "Employee record management", enabled: false },
      { label: "Access to core HR features", enabled: false },
    ],
  },
  {
    id: "talent-pro",
    name: "Talent Pro",
    monthly: 2999,
    yearly: 29990,
    popular: true,
    features: [
      { label: "40 job postings", enabled: true },
      { label: "5 featured jobs", enabled: true },
      { label: "Job displayed for 30 days", enabled: true },
      { label: "Email support", enabled: true },
      { label: "Employee record management", enabled: false },
      { label: "Access to core HR features", enabled: false },
    ],
  },
  {
    id: "enterprise",
    name: "HR Master",
    monthly: 5999,
    yearly: 59990,
    features: [
      { label: "50 job postings", enabled: true },
      { label: "10 featured jobs", enabled: true },
      { label: "Job displayed for 60 days", enabled: true },
      { label: "Email support", enabled: true },
      { label: "Employee record management", enabled: true },
      { label: "Access to core HR features", enabled: true },
    ],
  },
];

const candidatePlans = [
  {
    id: "standard",
    name: "Standard",
    isFree: true,
    monthly: 0,
    yearly: 0,
    features: [
      { label: "Free registration", enabled: true },
      { label: "Unlimited free job search", enabled: true },
      { label: "Save Jobs", enabled: true },
      { label: "Email support", enabled: false },
      { label: "Resume builder", enabled: false },
    ],
  },
  {
    id: "advantage",
    name: "Advantage",
    monthly: 199,
    yearly: 1990,
    popular: true,
    features: [
      { label: "Free registration", enabled: true },
      { label: "Unlimited free job search", enabled: true },
      { label: "Save Jobs", enabled: true },
      { label: "Email support", enabled: true },
      { label: "Resume builder", enabled: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthly: 399,
    yearly: 3990,
    features: [
      { label: "Free registration", enabled: true },
      { label: "Unlimited free job search", enabled: true },
      { label: "Save Jobs", enabled: true },
      { label: "Email support", enabled: true },
      { label: "Resume builder", enabled: true },
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"employer" | "candidate">("employer");
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("subscriptionCart") || "[]");
        setCartCount(cart.length);
      } catch (error) {
        console.error("Error reading cart:", error);
        setCartCount(0);
      }
    };

    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const plans = userType === "employer" ? employerPlans : candidatePlans;

  // Add to cart function
 // In subscription page, update the addToCart function:

const addToCart = (plan: any) => {
  try {
    console.log("Adding to cart:", plan.name, "Billing:", billing);
    
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem("subscriptionCart") || "[]");
    console.log("Existing cart:", existingCart);
    
    const cartItem = {
      id: `${plan.id}-${billing}-${Date.now()}`,
      name: plan.name,
      plan: "Employer Subscription",
      price: billing === "yearly" ? Math.round(plan.yearly / 12) : plan.monthly,
      billing: billing,
      quantity: 1,
      features: plan.features.filter((f: any) => f.enabled).map((f: any) => f.label)
    };
    
    console.log("New cart item:", cartItem);
    
    // Check if same plan with same billing already exists
    const existingPlanIndex = existingCart.findIndex(
      (item: any) => item.name === plan.name && item.billing === billing
    );
    
    let newCart;
    if (existingPlanIndex >= 0) {
      // Increment quantity if exists
      newCart = [...existingCart];
      newCart[existingPlanIndex].quantity += 1;
      console.log("Incremented existing item quantity");
    } else {
      // Add new item
      newCart = [...existingCart, cartItem];
      console.log("Added new item to cart");
    }
    
    // Save to localStorage
    localStorage.setItem("subscriptionCart", JSON.stringify(newCart));
    console.log("Saved new cart:", newCart);
    
    // Verify it was saved
    const verifyCart = localStorage.getItem("subscriptionCart");
    console.log("Verified cart after save:", JSON.parse(verifyCart || "[]"));
    
    // Update cart count
    setCartCount(newCart.length);
    
    // Show success message
    setMessage({
      type: "success",
      text: `${plan.name} added to cart! Redirecting...`
    });
    
    // Dispatch storage event for other tabs
    window.dispatchEvent(new Event('storage'));
    
    // Redirect to cart after 1 second
    setTimeout(() => {
      router.push("/cart");
    }, 1000);
    
  } catch (error) {
    console.error("Error adding to cart:", error);
    setMessage({
      type: "error",
      text: "Failed to add to cart. Please try again."
    });
  }
};
  // Check if CTA should be enabled
  const isCtaEnabled = () => {
    if (!user) return false;
    return user.role === "EMPLOYER" && userType === "employer";
  };

  const handleCtaClick = (plan: any) => {
    if (!user) {
      setMessage({
        type: "error",
        text: "Please login as employer to subscribe"
      });
      setTimeout(() => router.push("/auth/login"), 2000);
      return;
    }
    
    if (user.role === "CANDIDATE") {
      setMessage({
        type: "error",
        text: "You need an employer account to access employer plans"
      });
      return;
    }
    
    addToCart(plan);
  };

  const getCtaText = (plan: any) => {
    if (!user) return "Login to Subscribe";
    if (user.role === "CANDIDATE") return "Employer Only";
    if (plan.isFree) return "Get Started Free";
    return "Add to Cart";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-zinc-100 py-23 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-left mb-10">
          <h1 className="text-4xl font-semibold text-center text-gray-900 mb-4">
            Plans & Pricing
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            {userType === "employer" 
              ? "Streamline hiring with plans that grow with your team"
              : "Find your dream job with plans designed for your career growth"}
          </p>

          {/* Message Alert */}
          {message && (
            <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg animate-slideIn ${
              message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Cart Icon */}
          {user?.role === "EMPLOYER" && (
            <div className="absolute top-24 right-4">
              <button
                onClick={() => router.push("/cart")}
                className="relative bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* USER TYPE TOGGLE */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center bg-white rounded-full shadow p-1">
              <button
                onClick={() => setUserType("employer")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                  userType === "employer"
                    ? "bg-red-700 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                For Employers
              </button>
              <button
                onClick={() => setUserType("candidate")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                  userType === "candidate"
                    ? "bg-red-700 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                For Candidates
              </button>
            </div>
          </div>

          {/* BILLING TOGGLE */}
          {userType === "employer" && (
            <div className="flex justify-center mt-4">
              <div className="inline-flex items-center bg-white rounded-full mb-4 shadow p-1">
                <button
                  onClick={() => setBilling("yearly")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                    billing === "yearly"
                      ? "bg-red-700 text-white"
                      : "text-gray-600"
                  }`}
                >
                  Annual (Save 20%)
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
          )}
        </div>

        {/* PRICING CARDS */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${
          userType === "candidate" ? "mt-16" : "mt-0"
        }`}>
          {plans.map((plan) => {
            const isPopular = plan.popular;
            const isFree = plan.isFree;

            return (
              <div
                key={plan.name}
                className={`
                  rounded-3xl p-8 border relative
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                  ${
                    isPopular
                      ? "bg-gray-900 text-white border-red-700 shadow-lg scale-105 md:scale-110 z-10"
                      : "bg-white text-gray-700 border-gray-300"
                  }
                `}
              >
                {isPopular && (
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
                    Most Popular
                  </span>
                )}

                <h3 className="text-xl font-semibold mb-4">
                  {plan.name}
                </h3>

                <div className="mb-6">
                  {isFree ? (
                    <>
                      <span className="text-4xl font-bold">
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
                          <span className="text-green-500 ml-2">Save 20%</span>
                        </p>
                      )}
                    </>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.label}
                      className="flex items-center gap-3 text-sm"
                    >
                      {feature.enabled ? (
                        <Check className={`h-5 w-5 flex-shrink-0 ${
                          isPopular ? "text-green-400" : "text-green-500"
                        }`} />
                      ) : (
                        <X className={`h-5 w-5 flex-shrink-0 ${
                          isPopular ? "text-gray-500" : "text-gray-400"
                        }`} />
                      )}
                      <span className={feature.enabled ? "" : "opacity-50"}>
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>

                {userType === "employer" ? (
                  <button
                    onClick={() => handleCtaClick(plan)}
                    disabled={!isCtaEnabled() && !plan.isFree}
                    className={`w-full py-3 rounded-full font-medium transition ${
                      !isCtaEnabled() && !plan.isFree
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : plan.isFree
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                        : isPopular
                        ? "bg-red-700 hover:bg-red-800 text-white"
                        : "bg-gray-800 hover:bg-gray-900 text-white"
                    }`}
                  >
                    {getCtaText(plan)}
                  </button>
                ) : (
                  <div className="h-12"></div>
                )}

                {!user && userType === "employer" && !plan.isFree && (
                  <p className="text-xs text-center mt-4 text-gray-500">
                    <button 
                      onClick={() => router.push("/auth/login")}
                      className="text-red-700 hover:underline"
                    >
                      Login
                    </button>{" "}
                    as employer to subscribe
                  </p>
                )}

                {user && user.role === "CANDIDATE" && userType === "employer" && !plan.isFree && (
                  <p className="text-xs text-center mt-4 text-gray-500">
                    <button 
                      onClick={() => {
                        setMessage({
                          type: "error",
                          text: "Please login with an employer account"
                        });
                        setTimeout(() => router.push("/auth/login"), 2000);
                      }}
                      className="text-red-700 hover:underline"
                    >
                      Switch to employer account
                    </button>
                  </p>
                )}

                {user && user.role === "EMPLOYER" && plan.isFree && (
                  <p className="text-xs text-center mt-4 text-green-600">
                    ✓ Included in your current plan
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}

// "use client";

// import { useState } from "react";
// import { Check, X } from "lucide-react";

// const plans = [
//   {
//     name: "Recruit Basic",
//     isFree: true,
//     monthly: 0,
//     yearly: 0,
//     features: [
//       { label: "Access to core HR features", enabled: true },
//       { label: "Employee record management", enabled: true },
//       { label: "Basic reporting tools", enabled: true },
//       { label: "Manage up to 10 team members", enabled: true },
//       { label: "Track employee attendance", enabled: false },
//       { label: "Assign and monitor tasks", enabled: false },
//       { label: "Email support", enabled: false },
//     ],
//   },
//   {
//     name: "Talent Pro",
//     monthly: 499,
//     yearly: 5390,
//     popular: true,
//     features: [
//       { label: "Access to core HR features", enabled: true },
//       { label: "Employee record management", enabled: true },
//       { label: "Basic reporting tools", enabled: true },
//       { label: "Manage up to 10 team members", enabled: true },
//       { label: "Track employee attendance", enabled: true },
//       { label: "Assign and monitor tasks", enabled: true },
//       { label: "Email support", enabled: false },
//     ],
//   },
//   {
//     name: "HR Master",
//     monthly: 799,
//     yearly: 8990,
//     features: [
//       { label: "Access to core HR features", enabled: true },
//       { label: "Employee record management", enabled: true },
//       { label: "Basic reporting tools", enabled: true },
//       { label: "Manage up to 10 team members", enabled: true },
//       { label: "Track employee attendance", enabled: true },
//       { label: "Assign and monitor tasks", enabled: true },
//       { label: "Email support", enabled: true },
//     ],
//   },
// ];

// export default function SubscriptionPage() {
//   const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

//   return (
//     <section className="bg-zinc-100 py-23">
//       <div className="max-w-7xl mx-auto px-6">

//         {/* HEADER */}
//         <div className="text-left mb-10">
//           <h1 className="text-4xl font-semibold text-center text-gray-900 mb-4">
//             Plans & Pricing
//           </h1>
//           <p className="text-gray-600 text-center max-w-2xl mx-auto">
//             Streamline hiring with plans that grow with your team
//           </p>

//           {/* TOGGLE */}
//           <div className="flex justify-center mt-6">
//             <div className="inline-flex items-center bg-white rounded-full shadow p-1">
//               <button
//                 onClick={() => setBilling("yearly")}
//                 className={`px-5 py-2 rounded-full text-sm font-medium transition ${
//                   billing === "yearly"
//                     ? "bg-red-700 text-white"
//                     : "text-gray-600"
//                 }`}
//               >
//                 Annual
//               </button>
//               <button
//                 onClick={() => setBilling("monthly")}
//                 className={`px-5 py-2 rounded-full text-sm font-medium transition ${
//                   billing === "monthly"
//                     ? "bg-red-700 text-white"
//                     : "text-gray-600"
//                 }`}
//               >
//                 Monthly
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* PRICING CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           {plans.map((plan) => {
//             const isPopular = plan.popular;
//             const isFree = plan.isFree;

//             return (
//               <div
//                 key={plan.name}
//                 className={`
//                   rounded-3xl p-8 cursor-pointer border
//                   transition-shadow hover:shadow-xl
//                   ${
//                     isPopular
//                       ? "bg-gray-900 text-white border-red-700 shadow-lg"
//                       : "bg-white text-gray-700 border-gray-300"
//                   }
//                 `}
//               >
//                 {isPopular && (
//                   <span className="absolute top-4 right-4 text-xs bg-red-700 text-white px-3 py-1 rounded-full">
//                     Popular
//                   </span>
//                 )}

//                 {/* TITLE */}
//                 <h3 className="text-xl font-semibold mb-4">
//                   {plan.name}
//                 </h3>

//                 {/* PRICE */}
//                 <div className="mb-6">
//                   {isFree ? (
//                     <>
//                       <span className="text-4xl font-bold text-grey-900">
//                         Free
//                       </span>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Free forever
//                       </p>
//                     </>
//                   ) : (
//                     <>
//                       <span className="text-4xl font-bold">
//                         ₹
//                         {billing === "yearly"
//                           ? Math.round(plan.yearly / 12).toLocaleString("en-IN")
//                           : plan.monthly.toLocaleString("en-IN")}
//                       </span>
//                       <span className="text-sm opacity-60"> / month</span>

//                       {billing === "yearly" && (
//                         <p className="text-xs opacity-50 mt-1">
//                           ₹{plan.yearly.toLocaleString("en-IN")} billed annually
//                         </p>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* FEATURES */}
//                 <ul className="space-y-3 mb-8">
//                   {plan.features.map((feature) => (
//                     <li
//                       key={feature.label}
//                       className="flex items-center gap-3 text-sm"
//                     >
//                       {feature.enabled ? (
//                         <Check className="h-5 w-5 text-green-500" />
//                       ) : (
//                         <X className="h-5 w-5 text-gray-400" />
//                       )}
//                       {feature.label}
//                     </li>
//                   ))}
//                 </ul>

//                 {/* CTA */}
//                 <button
//                   className={`w-full py-3 rounded-full font-medium transition ${
//                     isFree
//                       ? "bg-gray-700 hover:bg-gray-800 text-white"
//                       : isPopular
//                       ? "bg-red-700 hover:bg-red-800 text-white"
//                       : "bg-gray-800 hover:bg-gray-900 text-white opacity-80"
//                   }`}
//                 >
//                   {isFree ? "Get Started Free" : "Start 7-days Free Trial"}
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }