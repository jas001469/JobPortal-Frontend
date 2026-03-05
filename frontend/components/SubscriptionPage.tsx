"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Plan {
  _id: string;
  name: string;
  type: string;
  isFree: boolean;
  monthly: number;
  yearly: number;
  discount: string | null;
  popular: boolean;
  features: Array<{ label: string; enabled: boolean }>;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"employer" | "candidate">("employer");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
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
      }
    };

    fetchUser();
  }, []);

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = `${process.env.NEXT_PUBLIC_API_URL}/plans/type/${userType}`;
        console.log("Fetching plans from:", url);
        
        const response = await fetch(url, {
          credentials: "include",
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Response data:", data);
        
        if (data.success) {
          setPlans(data.plans);
          console.log("Plans set:", data.plans.length);
        } else {
          setError(data.message || "Failed to fetch plans");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [userType]);

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
    
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  // Add to cart function
  const addToCart = (plan: Plan) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("subscriptionCart") || "[]");
      
      const cartItem = {
        id: `${plan._id}-yearly-${Date.now()}`,
        name: plan.name,
        plan: userType === "employer" ? "Employer Subscription" : "Candidate Subscription",
        price: Math.round(plan.yearly / 12),
        billing: "yearly",
        quantity: 1,
        features: plan.features.filter((f) => f.enabled).map((f) => f.label)
      };
      
      const existingPlanIndex = existingCart.findIndex(
        (item: any) => item.name === plan.name
      );
      
      let newCart;
      if (existingPlanIndex >= 0) {
        newCart = [...existingCart];
        newCart[existingPlanIndex].quantity += 1;
      } else {
        newCart = [...existingCart, cartItem];
      }
      
      localStorage.setItem("subscriptionCart", JSON.stringify(newCart));
      setCartCount(newCart.length);
      
      setMessage({
        type: "success",
        text: `${plan.name} added to cart! Redirecting...`
      });
      
      window.dispatchEvent(new Event('storage'));
      
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
  
  const isCtaEnabled = () => {
    if (!user) return false;
    return user.role === "EMPLOYER" && userType === "employer";
  };

  const handleCtaClick = (plan: Plan) => {
    if (!user) {
      setMessage({
        type: "error",
        text: "Please login as employer to subscribe"
      });
      setTimeout(() => router.push("/auth/login"), 2000);
      return;
    }
    
    if (user.role === "CANDIDATE" && userType === "employer") {
      setMessage({
        type: "error",
        text: "You need an employer account to access employer plans"
      });
      return;
    }
    
    addToCart(plan);
  };

  const getCtaText = (plan: Plan) => {
    if (!user) return "Login to Subscribe";
    if (user.role === "CANDIDATE" && userType === "employer") return "Employer Only";
    if (plan.isFree) return "Get Started Free";
    return "Add to Cart";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Error Loading Plans</h2>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
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
              ? "Streamline hiring with plan that suits your needs"
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
          <div className="flex justify-center mt-6 mb-15">
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
        </div>

        {/* PRICING CARDS */}
        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isPopular = plan.popular;
              const isFree = plan.isFree;

              return (
                <div
                  key={plan._id}
                  className={`
                    rounded-3xl p-8 border relative
                    transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                    ${
                      isPopular
                        ? "bg-gray-900 text-white border-red-700 shadow-lg md:scale-105 z-10"
                        : "bg-white text-gray-700 border-gray-300"
                    }
                  `}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center">
                      <span className="bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
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
                          ₹{plan.monthly.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm opacity-60"> / month</span>
                        
                        {plan.discount && (
                          <div className="mt-2">
                            <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                              {plan.discount}
                            </span>
                          </div>
                        )}
                        
                        <div className="mt-3 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium">₹{plan.yearly.toLocaleString("en-IN")}</span>
                            <span className="text-xs opacity-60 ml-1">/year</span>
                          </p>
                          <p className="text-xs text-green-500 font-medium">
                            Save 20% (effective ₹{Math.round(plan.yearly/12).toLocaleString("en-IN")}/month)
                          </p>
                        </div>
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
        )}
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

// import { useState, useEffect } from "react";
// import { Check, X } from "lucide-react";
// import { useRouter } from "next/navigation";

// const employerPlans = [
//   {
//     id: "recruit-basic",
//     name: "Recruit Basic",
//     isFree: false,
//     monthly: 999,
//     yearly: 9590,
//     discount: "FREE LAUNCH OFFER",
//     features: [
//       { label: "30 job postings", enabled: true },
//       { label: "3 featured jobs", enabled: true },
//       { label: "Job displayed for 15 days", enabled: true },
//       { label: "Email support", enabled: false },
//       { label: "Employee record management", enabled: false },
//       { label: "Access to core HR features", enabled: false },
//     ],
//   },
//   {
//     id: "talent-pro",
//     name: "Talent Pro",
//     monthly: 1599,
//     yearly: 15350,
//     popular: true,
//     discount: null,
//     features: [
//       { label: "2 job postings", enabled: true },
//       { label: "5 featured jobs", enabled: true },
//       { label: "Job displayed for 30 days", enabled: true },
//       { label: "Email support", enabled: true },
//       { label: "Employee record management", enabled: false },
//       { label: "Access to core HR features", enabled: false },
//     ],
//   },
//   {
//     id: "enterprise",
//     name: "HR Master",
//     monthly: 1999,
//     yearly: 19190,
//     discount: null,
//     features: [
//       { label: "50 job postings", enabled: true },
//       { label: "10 featured jobs", enabled: true },
//       { label: "Job displayed for 60 days", enabled: true },
//       { label: "Email support", enabled: true },
//       { label: "Employee record management", enabled: true },
//       { label: "Access to core HR features", enabled: true },
//     ],
//   },
// ];

// const candidatePlans = [
//   {
//     id: "standard",
//     name: "Standard",
//     isFree: true,
//     monthly: 0,
//     yearly: 0,
//     discount: null,
//     features: [
//       { label: "Free registration", enabled: true },
//       { label: "Unlimited free job search", enabled: true },
//       { label: "Save Jobs", enabled: true },
//       { label: "Email support", enabled: false },
//       { label: "Resume builder", enabled: false },
//     ],
//   },
//   {
//     id: "advantage",
//     name: "Advantage",
//     monthly: 149,
//     yearly: 1430,
//     popular: true,
//     discount: null,
//     features: [
//       { label: "Free registration", enabled: true },
//       { label: "Unlimited free job search", enabled: true },
//       { label: "Save Jobs", enabled: true },
//       { label: "Email support", enabled: true },
//       { label: "Resume builder", enabled: false },
//     ],
//   },
//   {
//     id: "premium",
//     name: "Premium",
//     monthly: 249,
//     yearly: 2390,
//     discount: null,
//     features: [
//       { label: "Free registration", enabled: true },
//       { label: "Unlimited free job search", enabled: true },
//       { label: "Save Jobs", enabled: true },
//       { label: "Email support", enabled: true },
//       { label: "Resume builder", enabled: true },
//     ],
//   },
// ];

// export default function SubscriptionPage() {
//   const router = useRouter();
//   const [userType, setUserType] = useState<"employer" | "candidate">("employer");
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
//   const [cartCount, setCartCount] = useState(0);

//   // Fetch current user
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//           credentials: "include",
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           if (data.success) {
//             setUser(data.user);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Update cart count from localStorage
//   useEffect(() => {
//     const updateCartCount = () => {
//       try {
//         const cart = JSON.parse(localStorage.getItem("subscriptionCart") || "[]");
//         setCartCount(cart.length);
//       } catch (error) {
//         console.error("Error reading cart:", error);
//         setCartCount(0);
//       }
//     };

//     updateCartCount();
    
//     // Listen for storage changes
//     window.addEventListener('storage', updateCartCount);
    
//     return () => {
//       window.removeEventListener('storage', updateCartCount);
//     };
//   }, []);

//   const plans = userType === "employer" ? employerPlans : candidatePlans;

//   // Add to cart function
//   const addToCart = (plan: any) => {
//     try {
//       console.log("Adding to cart:", plan.name);
      
//       // Get existing cart
//       const existingCart = JSON.parse(localStorage.getItem("subscriptionCart") || "[]");
//       console.log("Existing cart:", existingCart);
      
//       const cartItem = {
//         id: `${plan.id}-yearly-${Date.now()}`,
//         name: plan.name,
//         plan: "Employer Subscription",
//         price: Math.round(plan.yearly / 12),
//         billing: "yearly",
//         quantity: 1,
//         features: plan.features.filter((f: any) => f.enabled).map((f: any) => f.label)
//       };
      
//       console.log("New cart item:", cartItem);
      
//       // Check if same plan already exists
//       const existingPlanIndex = existingCart.findIndex(
//         (item: any) => item.name === plan.name
//       );
      
//       let newCart;
//       if (existingPlanIndex >= 0) {
//         // Increment quantity if exists
//         newCart = [...existingCart];
//         newCart[existingPlanIndex].quantity += 1;
//         console.log("Incremented existing item quantity");
//       } else {
//         // Add new item
//         newCart = [...existingCart, cartItem];
//         console.log("Added new item to cart");
//       }
      
//       // Save to localStorage
//       localStorage.setItem("subscriptionCart", JSON.stringify(newCart));
//       console.log("Saved new cart:", newCart);
      
//       // Verify it was saved
//       const verifyCart = localStorage.getItem("subscriptionCart");
//       console.log("Verified cart after save:", JSON.parse(verifyCart || "[]"));
      
//       // Update cart count
//       setCartCount(newCart.length);
      
//       // Show success message
//       setMessage({
//         type: "success",
//         text: `${plan.name} added to cart! Redirecting...`
//       });
      
//       // Dispatch storage event for other tabs
//       window.dispatchEvent(new Event('storage'));
      
//       // Redirect to cart after 1 second
//       setTimeout(() => {
//         router.push("/cart");
//       }, 1000);
      
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       setMessage({
//         type: "error",
//         text: "Failed to add to cart. Please try again."
//       });
//     }
//   };
  
//   // Check if CTA should be enabled
//   const isCtaEnabled = () => {
//     if (!user) return false;
//     return user.role === "EMPLOYER" && userType === "employer";
//   };

//   const handleCtaClick = (plan: any) => {
//     if (!user) {
//       setMessage({
//         type: "error",
//         text: "Please login as employer to subscribe"
//       });
//       setTimeout(() => router.push("/auth/login"), 2000);
//       return;
//     }
    
//     if (user.role === "CANDIDATE") {
//       setMessage({
//         type: "error",
//         text: "You need an employer account to access employer plans"
//       });
//       return;
//     }
    
//     addToCart(plan);
//   };

//   const getCtaText = (plan: any) => {
//     if (!user) return "Login to Subscribe";
//     if (user.role === "CANDIDATE") return "Employer Only";
//     if (plan.isFree) return "Get Started Free";
//     return "Add to Cart";
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className="bg-zinc-100 py-23 min-h-screen">
//       <div className="max-w-7xl mx-auto px-6">

//         {/* HEADER */}
//         <div className="text-left mb-10">
//           <h1 className="text-4xl font-semibold text-center text-gray-900 mb-4">
//             Plans & Pricing
//           </h1>
//           <p className="text-gray-600 text-center max-w-2xl mx-auto">
//             {userType === "employer" 
//               ? "Streamline hiring with plan that suits your needs"
//               : "Find your dream job with plans designed for your career growth"}
//           </p>

//           {/* Message Alert */}
//           {message && (
//             <div className={`fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg animate-slideIn ${
//               message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
//             }`}>
//               {message.text}
//             </div>
//           )}

//           {/* Cart Icon */}
//           {user?.role === "EMPLOYER" && (
//             <div className="absolute top-24 right-4">
//               <button
//                 onClick={() => router.push("/cart")}
//                 className="relative bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition"
//               >
//                 <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//                 </svg>
//                 {cartCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                     {cartCount}
//                   </span>
//                 )}
//               </button>
//             </div>
//           )}

//           {/* USER TYPE TOGGLE */}
//           <div className="flex justify-center mt-6 mb-15">
//             <div className="inline-flex items-center bg-white rounded-full shadow p-1">
//               <button
//                 onClick={() => setUserType("employer")}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition ${
//                   userType === "employer"
//                     ? "bg-red-700 text-white"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 For Employers
//               </button>
//               <button
//                 onClick={() => setUserType("candidate")}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition ${
//                   userType === "candidate"
//                     ? "bg-red-700 text-white"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 For Candidates
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* PRICING CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {plans.map((plan) => {
//             const isPopular = plan.popular;
//             const isFree = plan.isFree;

//             return (
//               <div
//                 key={plan.name}
//                 className={`
//                   rounded-3xl p-8 border relative
//                   transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
//                   ${
//                     isPopular
//                       ? "bg-gray-900 text-white border-red-700 shadow-lg md:scale-105 z-10"
//                       : "bg-white text-gray-700 border-gray-300"
//                   }
//                 `}
//               >
//                 {isPopular && (
//                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-full flex justify-center">
//                     <span className="bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
//                       Most Popular
//                     </span>
//                   </div>
//                 )}

//                 <h3 className="text-xl font-semibold mb-4">
//                   {plan.name}
//                 </h3>

//                 <div className="mb-6">
//                   {isFree ? (
//                     <>
//                       <span className="text-4xl font-bold">
//                         Free
//                       </span>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Free forever
//                       </p>
//                     </>
//                   ) : (
//                     <>
//                       {/* Show monthly price first */}
//                       <span className="text-4xl font-bold">
//                         ₹{plan.monthly.toLocaleString("en-IN")}
//                       </span>
//                       <span className="text-sm opacity-60"> / month</span>
                      
//                       {/* Show discount/highlight below monthly price */}
//                       {plan.discount && (
//                         <div className="mt-2">
//                           <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
//                             {plan.discount}
//                           </span>
//                         </div>
//                       )}
                      
//                       {/* Show yearly pricing with savings */}
//                       <div className="mt-3 space-y-1">
//                         <p className="text-sm">
//                           <span className="font-medium">₹{plan.yearly.toLocaleString("en-IN")}</span>
//                           <span className="text-xs opacity-60 ml-1">/year</span>
//                         </p>
//                         <p className="text-xs text-green-500 font-medium">
//                           Save 20% (effective ₹{Math.round(plan.yearly/12).toLocaleString("en-IN")}/month)
//                         </p>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 <ul className="space-y-3 mb-8">
//                   {plan.features.map((feature) => (
//                     <li
//                       key={feature.label}
//                       className="flex items-center gap-3 text-sm"
//                     >
//                       {feature.enabled ? (
//                         <Check className={`h-5 w-5 flex-shrink-0 ${
//                           isPopular ? "text-green-400" : "text-green-500"
//                         }`} />
//                       ) : (
//                         <X className={`h-5 w-5 flex-shrink-0 ${
//                           isPopular ? "text-gray-500" : "text-gray-400"
//                         }`} />
//                       )}
//                       <span className={feature.enabled ? "" : "opacity-50"}>
//                         {feature.label}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>

//                 {userType === "employer" ? (
//                   <button
//                     onClick={() => handleCtaClick(plan)}
//                     disabled={!isCtaEnabled() && !plan.isFree}
//                     className={`w-full py-3 rounded-full font-medium transition ${
//                       !isCtaEnabled() && !plan.isFree
//                         ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         : plan.isFree
//                         ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
//                         : isPopular
//                         ? "bg-red-700 hover:bg-red-800 text-white"
//                         : "bg-gray-800 hover:bg-gray-900 text-white"
//                     }`}
//                   >
//                     {getCtaText(plan)}
//                   </button>
//                 ) : (
//                   <div className="h-12"></div>
//                 )}

//                 {!user && userType === "employer" && !plan.isFree && (
//                   <p className="text-xs text-center mt-4 text-gray-500">
//                     <button 
//                       onClick={() => router.push("/auth/login")}
//                       className="text-red-700 hover:underline"
//                     >
//                       Login
//                     </button>{" "}
//                     as employer to subscribe
//                   </p>
//                 )}

//                 {user && user.role === "CANDIDATE" && userType === "employer" && !plan.isFree && (
//                   <p className="text-xs text-center mt-4 text-gray-500">
//                     <button 
//                       onClick={() => {
//                         setMessage({
//                           type: "error",
//                           text: "Please login with an employer account"
//                         });
//                         setTimeout(() => router.push("/auth/login"), 2000);
//                       }}
//                       className="text-red-700 hover:underline"
//                     >
//                       Switch to employer account
//                     </button>
//                   </p>
//                 )}

//                 {user && user.role === "EMPLOYER" && plan.isFree && (
//                   <p className="text-xs text-center mt-4 text-green-600">
//                     ✓ Included in your current plan
//                   </p>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slideIn {
//           animation: slideIn 0.3s ease-out;
//         }
//       `}</style>
//     </section>
//   );
// }