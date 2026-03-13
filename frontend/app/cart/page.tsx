"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Shield, Truck, Lock, Calendar, Gift } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  plan: string;
  price: number;
  billing: "monthly" | "yearly";
  quantity: number;
  features: string[];
  monthlyPrice?: number;
  yearlyPrice?: number;
}

interface PromoConfig {
  plan: string;
  discount: number;
  type: string;
}

// Promo codes
const PROMO_CODES: Record<string, PromoConfig> = {
  "EDTRELLISBASIC": {
    plan: "Recruit Basic",
    discount: 100,
    type: "free"
  },
  "EDTRELLISPRO": {
    plan: "Talent Pro",
    discount: 100,
    type: "free"
  },
  "EDTRELLISMASTER": {
    plan: "HR Master",
    discount: 100,
    type: "free"
  }
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [appliedPromoDetails, setAppliedPromoDetails] = useState<PromoConfig | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);

  // Pricing data for plans
  const planPricing = {
    "Recruit Basic": { monthly: 999, yearly: 9590 },
    "Talent Pro": { monthly: 1599, yearly: 15350 },
    "HR Master": { monthly: 1999, yearly: 19190 },
    "Standard": { monthly: 0, yearly: 0 },
    "Advantage": { monthly: 149, yearly: 1430 },
    "Premium": { monthly: 249, yearly: 2390 },
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("subscriptionCart", JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  // Load cart data
  useEffect(() => {
    loadCartData();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "subscriptionCart") {
        loadCartData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadCartData = () => {
    try {
      const savedCart = localStorage.getItem("subscriptionCart");
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          // Validate and fix cart items if needed
          const validatedCart = parsedCart.map(item => {
            // Ensure price matches the billing type
            const pricing = planPricing[item.name as keyof typeof planPricing];
            if (pricing) {
              const correctPrice = item.billing === "yearly" ? pricing.yearly : pricing.monthly;
              // If price doesn't match, update it
              if (item.price !== correctPrice) {
                return { ...item, price: correctPrice };
              }
            }
            return item;
          });
          setCartItems(validatedCart);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: "include",
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    
    if (promoApplied) {
      setPromoApplied(false);
      setAppliedPromoDetails(null);
    }
  };

  const updateBillingType = (id: string, newBilling: "monthly" | "yearly") => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const pricing = planPricing[item.name as keyof typeof planPricing];
          if (pricing) {
            return {
              ...item,
              billing: newBilling,
              price: newBilling === "yearly" ? pricing.yearly : pricing.monthly
            };
          }
        }
        return item;
      })
    );
    
    if (promoApplied) {
      setPromoApplied(false);
      setAppliedPromoDetails(null);
    }
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
    
    if (promoApplied && appliedPromoDetails) {
      const remainingItems = cartItems.filter(item => item.id !== id);
      const promoPlanStillExists = remainingItems.some(
        item => item.name === appliedPromoDetails.plan
      );
      
      if (!promoPlanStillExists || remainingItems.length === 0) {
        setPromoApplied(false);
        setAppliedPromoDetails(null);
      }
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("subscriptionCart");
    setPromoApplied(false);
    setAppliedPromoDetails(null);
    setPromoMessage(null);
  };

  const applyPromoCode = async () => {
    const upperCode = promoCode.toUpperCase().trim();
    
    if (!upperCode) {
      setPromoMessage({
        type: "error",
        text: "Please enter a promo code"
      });
      setTimeout(() => setPromoMessage(null), 3000);
      return;
    }

    setApplyingPromo(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const promoConfig = PROMO_CODES[upperCode];
    
    if (!promoConfig) {
      setPromoMessage({
        type: "error",
        text: `Invalid promo code "${upperCode}"`
      });
      setApplyingPromo(false);
      setTimeout(() => setPromoMessage(null), 3000);
      return;
    }

    const planInCart = cartItems.some(item => item.name === promoConfig.plan);
    
    if (!planInCart) {
      setPromoMessage({
        type: "error",
        text: `This promo code is for ${promoConfig.plan} plan only. Please add it to your cart first.`
      });
      setApplyingPromo(false);
      setTimeout(() => setPromoMessage(null), 3000);
      return;
    }

    if (promoApplied) {
      setPromoMessage({
        type: "error",
        text: "Only one promo code can be applied at a time"
      });
      setApplyingPromo(false);
      setTimeout(() => setPromoMessage(null), 3000);
      return;
    }

    setPromoApplied(true);
    setAppliedPromoDetails(promoConfig);
    setPromoMessage({
      type: "success",
      text: `🎉 ${promoConfig.plan} plan is now FREE! You've unlocked all features.`
    });
    
    setPromoCode("");
    setApplyingPromo(false);
    
    setTimeout(() => setPromoMessage(null), 5000);
  };

  const calculateSubtotal = () => {
    if (!promoApplied || !appliedPromoDetails) {
      return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    return cartItems.reduce((sum, item) => {
      if (item.name === appliedPromoDetails.plan) {
        return sum;
      }
      return sum + item.price * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleActivateSubscription = async () => {
    if (!user) {
      router.push("/auth/login?redirect=cart");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!promoApplied || !appliedPromoDetails) {
      alert("Please apply a promo code first");
      return;
    }

    setActivating(true);
    
    try {
      // Call backend API to activate subscription
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employer/subscription/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          planName: appliedPromoDetails.plan,
          billingType: cartItems.find(item => item.name === appliedPromoDetails.plan)?.billing || "monthly",
          promoCode: Object.keys(PROMO_CODES).find(
            key => PROMO_CODES[key] === appliedPromoDetails
          )
        })
      });

      const data = await response.json();

      if (data.success) {
        // Clear the cart
        localStorage.removeItem("subscriptionCart");
        setCartItems([]);
        
        // Show success message
        alert(`🎉 Your ${appliedPromoDetails.plan} subscription has been activated!`);
        
        // Redirect to post job page
        router.push("/employer/post-job");
      } else {
        alert(data.message || "Failed to activate subscription");
      }
    } catch (error) {
      console.error("Error activating subscription:", error);
      alert("Failed to activate subscription. Please try again.");
    } finally {
      setActivating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDisplayPrice = (item: CartItem) => {
    if (item.billing === "yearly") {
      return {
        total: item.price * item.quantity,
        perMonth: Math.round((item.price / 12) * item.quantity),
        label: "year"
      };
    } else {
      return {
        total: item.price * item.quantity,
        perMonth: item.price * item.quantity,
        label: "month"
      };
    }
  };

  // Helper functions for billing period display
  const getBillingPeriod = () => {
    if (cartItems.length === 0) return "month";
    
    // Check if all items have the same billing type
    const allYearly = cartItems.every(item => item.billing === "yearly");
    const allMonthly = cartItems.every(item => item.billing === "monthly");
    
    if (allYearly) {
      return "year";
    } else if (allMonthly) {
      return "month";
    } else {
      return "mixed";
    }
  };

  const getBillingLabel = () => {
    const period = getBillingPeriod();
    if (period === "year") return "Annual";
    if (period === "month") return "Monthly";
    return "Mixed Billing";
  };

  if (loading || activating) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">{activating ? "Activating subscription..." : "Loading cart..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-red-700 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">
            {cartItems.length === 0 
              ? "Your cart is empty" 
              : `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`
            }
          </p>
        </div>

        {/* Promo Message Alert */}
        {promoMessage && (
          <div className={`mb-6 p-4 rounded-xl ${
            promoMessage.type === "success" 
              ? "bg-green-50 border border-green-200 text-green-800" 
              : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            {promoMessage.text}
          </div>
        )}

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-6 rounded-full">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any subscription plans to your cart yet.
            </p>
            <button
              onClick={() => router.push("/subscription")}
              className="bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition inline-flex items-center"
            >
              Browse Plans
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
            </button>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const pricing = planPricing[item.name as keyof typeof planPricing];
                const isPromoPlan = promoApplied && appliedPromoDetails && item.name === appliedPromoDetails.plan;
                const displayPrice = getDisplayPrice(item);
                
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition ${
                      isPromoPlan ? "border-2 border-green-400" : ""
                    }`}
                  >
                    {isPromoPlan && (
                      <div className="mb-4 inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        <Gift className="w-4 h-4 mr-2" />
                        FREE with promo code
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-500">{item.plan}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Billing Type Selection */}
                        {!item.name.includes("Standard") && pricing && (
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              <Calendar className="w-4 h-4 inline mr-2" />
                              Select Billing Type
                            </label>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => updateBillingType(item.id, "monthly")}
                                className={`flex-1 border rounded-xl p-3 transition ${
                                  item.billing === "monthly"
                                    ? "border-red-700 bg-red-50 ring-2 ring-red-700 ring-opacity-20"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <span className="block font-medium text-gray-900">Monthly</span>
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(pricing.monthly)}
                                </span>
                                <span className="text-xs text-gray-500">/month</span>
                                {item.billing === "monthly" && (
                                  <span className="block text-xs text-green-600 mt-1">Selected</span>
                                )}
                              </button>
                              
                              <button
                                onClick={() => updateBillingType(item.id, "yearly")}
                                className={`flex-1 border rounded-xl p-3 transition relative ${
                                  item.billing === "yearly"
                                    ? "border-red-700 bg-red-50 ring-2 ring-red-700 ring-opacity-20"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <span className="absolute -top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                  Save 20%
                                </span>
                                <span className="block font-medium text-gray-900">Annual</span>
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(pricing.yearly)}
                                </span>
                                <span className="text-xs text-gray-500">/year</span>
                                <span className="block text-xs text-gray-500 mt-1">
                                  ({formatPrice(Math.round(pricing.yearly / 12))}/month)
                                </span>
                                {item.billing === "yearly" && (
                                  <span className="block text-xs text-green-600 mt-1">Selected</span>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Features Preview */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Key Features:
                          </p>
                          <ul className="grid grid-cols-2 gap-2">
                            {item.features.slice(0, 4).map((feature, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                {feature}
                              </li>
                            ))}
                            {item.features.length > 4 && (
                              <li className="text-sm text-gray-400">
                                +{item.features.length - 4} more features
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">Current Billing:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              item.billing === "yearly" 
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {item.billing === "yearly" ? "Annual Plan" : "Monthly Plan"}
                            </span>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-50 transition"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="px-4 py-2 text-gray-900 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-50 transition"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>

                            <div className="text-right">
                              {isPromoPlan ? (
                                <>
                                  <span className="text-2xl font-bold text-green-600">
                                    {formatPrice(0)}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-1">
                                    /{item.billing === "yearly" ? "year" : "month"}
                                  </span>
                                  <div className="text-xs text-gray-400 line-through">
                                    {formatPrice(displayPrice.total)}/{displayPrice.label}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span className="text-2xl font-bold text-gray-900">
                                    {formatPrice(displayPrice.total)}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-1">
                                    /{displayPrice.label}
                                  </span>
                                  {item.billing === "yearly" && (
                                    <div className="text-xs text-gray-500">
                                      ({formatPrice(displayPrice.perMonth)}/month)
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-gray-500 hover:text-red-700 text-sm font-medium transition flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
                      disabled={promoApplied}
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode || applyingPromo}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        promoApplied || !promoCode || applyingPromo
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {applyingPromo ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  
                  {promoApplied && appliedPromoDetails && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-800 flex items-center">
                        <Gift className="w-4 h-4 mr-2" />
                        {appliedPromoDetails.plan} plan is FREE!
                      </p>
                    </div>
                  )}
                </div>

                {/* Billing Summary */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Billing Summary</h3>
                  {cartItems.map((item) => {
                    const isPromoPlan = promoApplied && appliedPromoDetails && item.name === appliedPromoDetails.plan;
                    const displayPrice = getDisplayPrice(item);
                    
                    return (
                      <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          {item.name} x{item.quantity}
                          {isPromoPlan && (
                            <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                              FREE
                            </span>
                          )}
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            item.billing === "yearly" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {item.billing === "yearly" ? "Annual" : "Monthly"}
                          </span>
                        </span>
                        {isPromoPlan ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          <span>{formatPrice(displayPrice.total)}/{displayPrice.label}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown - Updated to show annual billing */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getBillingLabel()})</span>
                    <div className="text-right">
                      <span>{formatPrice(subtotal)}</span>
                      {getBillingPeriod() !== "mixed" && (
                        <span className="text-sm text-gray-500 ml-1">
                          /{getBillingPeriod()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {getBillingPeriod() === "mixed" && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg space-y-2">
                      <p className="font-medium text-gray-700">Your cart contains:</p>
                      {cartItems.map(item => {
                        const displayPrice = getDisplayPrice(item);
                        return (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.name} x{item.quantity}:</span>
                            <span>{formatPrice(displayPrice.total)}/{displayPrice.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total ({getBillingLabel()})</span>
                      <div className="text-right">
                        <span className={total === 0 ? "text-green-600" : ""}>
                          {formatPrice(total)}
                        </span>
                        {getBillingPeriod() !== "mixed" && (
                          <span className={`text-sm ml-1 ${total === 0 ? "text-green-600" : "text-gray-500"}`}>
                            /{getBillingPeriod()}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes
                    </p>
                  </div>
                </div>

                {/* Activate Button */}
                <button
                  onClick={handleActivateSubscription}
                  disabled={!promoApplied || cartItems.length === 0}
                  className={`w-full py-4 rounded-xl font-medium mb-4 flex items-center justify-center transition ${
                    !promoApplied || cartItems.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  }`}
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Activate Free Subscription
                </button>

                {/* Payment Methods */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-3">
                    Secure payment powered by
                  </p>
                  <div className="flex justify-center space-x-4">
                    <span className="text-sm font-medium text-gray-400">Visa</span>
                    <span className="text-sm font-medium text-gray-400">Mastercard</span>
                    <span className="text-sm font-medium text-gray-400">UPI</span>
                    <span className="text-sm font-medium text-gray-400">Razorpay</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <Shield className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Secure Payment</p>
                    </div>
                    <div className="text-center">
                      <Truck className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Instant Access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Shield, Truck, Lock, Calendar } from "lucide-react";

// interface CartItem {
//   id: string;
//   name: string;
//   plan: string;
//   price: number;
//   billing: "monthly" | "yearly";
//   quantity: number;
//   features: string[];
//   monthlyPrice?: number;
//   yearlyPrice?: number;
// }

// export default function CartPage() {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<any>(null);
//   const [promoCode, setPromoCode] = useState("");
//   const [promoApplied, setPromoApplied] = useState(false);
//   const [promoDiscount, setPromoDiscount] = useState(0);

//   // Pricing data for plans (this would ideally come from an API)
//   const planPricing = {
//     "Recruit Basic": { monthly: 999, yearly: 9590 },
//     "Talent Pro": { monthly: 1599, yearly: 15350 },
//     "HR Master": { monthly: 1999, yearly: 19190 },
//     "Standard": { monthly: 0, yearly: 0 },
//     "Advantage": { monthly: 149, yearly: 1430 },
//     "Premium": { monthly: 249, yearly: 2390 },
//   };

//   // Load cart data immediately when component mounts
//   useEffect(() => {
//     loadCartData();
    
//     // Listen for storage changes
//     const handleStorageChange = () => {
//       console.log("Storage changed, reloading cart");
//       loadCartData();
//     };

//     window.addEventListener('storage', handleStorageChange);
    
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   const loadCartData = () => {
//     try {
//       console.log("Loading cart data...");
//       const savedCart = localStorage.getItem("subscriptionCart");
//       console.log("Raw cart from localStorage:", savedCart);
      
//       if (savedCart) {
//         const parsedCart = JSON.parse(savedCart);
//         console.log("Parsed cart:", parsedCart);
        
//         // Validate that parsedCart is an array
//         if (Array.isArray(parsedCart)) {
//           setCartItems(parsedCart);
//           console.log("Cart loaded successfully:", parsedCart.length, "items");
//         } else {
//           console.error("Cart is not an array:", parsedCart);
//           setCartItems([]);
//         }
//       } else {
//         console.log("No cart found in localStorage");
//         setCartItems([]);
//       }
//     } catch (error) {
//       console.error("Error loading cart:", error);
//       setCartItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch user
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//           credentials: "include",
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setUser(data.user);
//         }
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       }
//     };

//     fetchUser();
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     if (cartItems.length > 0) {
//       localStorage.setItem("subscriptionCart", JSON.stringify(cartItems));
//       console.log("Saved cart to localStorage:", cartItems);
//     } else {
//       localStorage.removeItem("subscriptionCart");
//       console.log("Removed cart from localStorage");
//     }
//   }, [cartItems]);

//   const updateQuantity = (id: string, newQuantity: number) => {
//     if (newQuantity < 1) return;
//     setCartItems(items =>
//       items.map(item =>
//         item.id === id ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   };

//   const updateBillingType = (id: string, newBilling: "monthly" | "yearly") => {
//     setCartItems(items =>
//       items.map(item => {
//         if (item.id === id) {
//           const pricing = planPricing[item.name as keyof typeof planPricing];
//           if (pricing) {
//             return {
//               ...item,
//               billing: newBilling,
//               price: newBilling === "yearly" 
//                 ? Math.round(pricing.yearly / 12) 
//                 : pricing.monthly
//             };
//           }
//         }
//         return item;
//       })
//     );
//   };

//   const removeItem = (id: string) => {
//     setCartItems(items => items.filter(item => item.id !== id));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     localStorage.removeItem("subscriptionCart");
//     console.log("Cart cleared");
//   };

//   const applyPromoCode = () => {
//     if (promoCode.toUpperCase() === "SAVE20") {
//       setPromoApplied(true);
//       setPromoDiscount(20);
//     } else if (promoCode.toUpperCase() === "WELCOME10") {
//       setPromoApplied(true);
//       setPromoDiscount(10);
//     } else {
//       alert("Invalid promo code");
//     }
//   };

//   // Calculate totals
//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const discount = promoApplied ? (subtotal * promoDiscount) / 100 : 0;
//   const tax = (subtotal - discount) * 0.18;
//   const total = subtotal - discount + tax;

//   const handleCheckout = () => {
//     if (!user) {
//       router.push("/auth/login?redirect=cart");
//       return;
//     }
    
//     // Store billing preferences in session storage for checkout
//     sessionStorage.setItem("checkoutItems", JSON.stringify(cartItems));
//     router.push("/checkout");
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const calculateYearlySavings = (item: CartItem) => {
//     if (item.billing === "yearly") {
//       const pricing = planPricing[item.name as keyof typeof planPricing];
//       if (pricing) {
//         const monthlyTotal = pricing.monthly * 12;
//         const savings = monthlyTotal - pricing.yearly;
//         return savings;
//       }
//     }
//     return 0;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading cart...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-12">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-gray-600 hover:text-red-700 mb-4 transition"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Continue Shopping
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
//           <p className="text-gray-600">
//             {cartItems.length === 0 
//               ? "Your cart is empty" 
//               : `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`
//             }
//           </p>
//         </div>

//         {cartItems.length === 0 ? (
//           // Empty Cart
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//             <div className="flex justify-center mb-6">
//               <div className="bg-gray-100 p-6 rounded-full">
//                 <ShoppingBag className="w-16 h-16 text-gray-400" />
//               </div>
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//               Your cart is empty
//             </h2>
//             <p className="text-gray-600 mb-8">
//               Looks like you haven't added any subscription plans to your cart yet.
//             </p>
//             <button
//               onClick={() => router.push("/subscription")}
//               className="bg-red-700 text-white px-8 py-3 rounded-full font-medium hover:bg-red-800 transition inline-flex items-center"
//             >
//               Browse Plans
//               <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
//             </button>
//           </div>
//         ) : (
//           // Cart with Items
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 space-y-4">
//               {cartItems.map((item) => {
//                 const yearlySavings = calculateYearlySavings(item);
//                 const pricing = planPricing[item.name as keyof typeof planPricing];
                
//                 return (
//                   <div
//                     key={item.id}
//                     className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
//                   >
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between mb-4">
//                           <div>
//                             <h3 className="text-xl font-semibold text-gray-900 mb-1">
//                               {item.name}
//                             </h3>
//                             <p className="text-sm text-gray-500">{item.plan}</p>
//                           </div>
//                           <button
//                             onClick={() => removeItem(item.id)}
//                             className="text-gray-400 hover:text-red-700 transition"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </div>

//                         {/* Billing Type Selection */}
//                         {!item.name.includes("Standard") && pricing && (
//                           <div className="mb-6">
//                             <label className="block text-sm font-medium text-gray-700 mb-3">
//                               <Calendar className="w-4 h-4 inline mr-2" />
//                               Select Billing Type
//                             </label>
//                             <div className="flex space-x-3">
//                               <button
//                                 onClick={() => updateBillingType(item.id, "monthly")}
//                                 className={`flex-1 border rounded-xl p-3 transition ${
//                                   item.billing === "monthly"
//                                     ? "border-red-700 bg-red-50 ring-2 ring-red-700 ring-opacity-20"
//                                     : "border-gray-200 hover:border-gray-300"
//                                 }`}
//                               >
//                                 <span className="block font-medium text-gray-900">Monthly</span>
//                                 <span className="text-lg font-bold text-gray-900">
//                                   {formatPrice(pricing.monthly)}
//                                 </span>
//                                 <span className="text-xs text-gray-500">/month</span>
//                                 {item.billing === "monthly" && (
//                                   <span className="block text-xs text-green-600 mt-1">Selected</span>
//                                 )}
//                               </button>
                              
//                               <button
//                                 onClick={() => updateBillingType(item.id, "yearly")}
//                                 className={`flex-1 border rounded-xl p-3 transition relative ${
//                                   item.billing === "yearly"
//                                     ? "border-red-700 bg-red-50 ring-2 ring-red-700 ring-opacity-20"
//                                     : "border-gray-200 hover:border-gray-300"
//                                 }`}
//                               >
//                                 <span className="absolute -top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
//                                   Save 20%
//                                 </span>
//                                 <span className="block font-medium text-gray-900">Annual</span>
//                                 <span className="text-lg font-bold text-gray-900">
//                                   {formatPrice(Math.round(pricing.yearly / 12))}
//                                 </span>
//                                 <span className="text-xs text-gray-500">/month</span>
//                                 <span className="block text-xs text-gray-500 mt-1">
//                                   {formatPrice(pricing.yearly)}/year
//                                 </span>
//                                 {item.billing === "yearly" && (
//                                   <span className="block text-xs text-green-600 mt-1">Selected</span>
//                                 )}
//                               </button>
//                             </div>
                            
//                             {/* Savings Message */}
//                             {item.billing === "yearly" && yearlySavings > 0 && (
//                               <p className="text-sm text-green-600 mt-3 flex items-center">
//                                 <span className="bg-green-100 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
//                                   Save {formatPrice(yearlySavings)}/year
//                                 </span>
//                                 Compared to monthly billing
//                               </p>
//                             )}
//                           </div>
//                         )}

//                         {/* Features Preview */}
//                         <div className="mb-4">
//                           <p className="text-sm font-medium text-gray-700 mb-2">
//                             Key Features:
//                           </p>
//                           <ul className="grid grid-cols-2 gap-2">
//                             {item.features.slice(0, 4).map((feature, index) => (
//                               <li key={index} className="text-sm text-gray-600 flex items-center">
//                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
//                                 {feature}
//                               </li>
//                             ))}
//                             {item.features.length > 4 && (
//                               <li className="text-sm text-gray-400">
//                                 +{item.features.length - 4} more features
//                               </li>
//                             )}
//                           </ul>
//                         </div>

//                         {/* Price and Quantity */}
//                         <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                           <div className="flex items-center space-x-4">
//                             <span className="text-sm text-gray-500">Current Billing:</span>
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                               item.billing === "yearly" 
//                                 ? "bg-green-100 text-green-700"
//                                 : "bg-blue-100 text-blue-700"
//                             }`}>
//                               {item.billing === "yearly" ? "Annual Plan" : "Monthly Plan"}
//                             </span>
//                           </div>

//                           <div className="flex items-center space-x-6">
//                             {/* Quantity Controls */}
//                             <div className="flex items-center border border-gray-200 rounded-lg">
//                               <button
//                                 onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                                 className="p-2 hover:bg-gray-50 transition"
//                               >
//                                 <Minus className="w-4 h-4 text-gray-600" />
//                               </button>
//                               <span className="px-4 py-2 text-gray-900 font-medium">
//                                 {item.quantity}
//                               </span>
//                               <button
//                                 onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                                 className="p-2 hover:bg-gray-50 transition"
//                               >
//                                 <Plus className="w-4 h-4 text-gray-600" />
//                               </button>
//                             </div>

//                             {/* Price */}
//                             <div className="text-right">
//                               <span className="text-2xl font-bold text-gray-900">
//                                 {formatPrice(item.price * item.quantity)}
//                               </span>
//                               <span className="text-sm text-gray-500 ml-1">/mo</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* Clear Cart Button */}
//               <div className="flex justify-end">
//                 <button
//                   onClick={clearCart}
//                   className="text-gray-500 hover:text-red-700 text-sm font-medium transition flex items-center"
//                 >
//                   <Trash2 className="w-4 h-4 mr-2" />
//                   Clear Cart
//                 </button>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
//                 <h2 className="text-xl font-bold text-gray-900 mb-6">
//                   Order Summary
//                 </h2>

//                 {/* Promo Code */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Promo Code
//                   </label>
//                   <div className="flex space-x-2">
//                     <input
//                       type="text"
//                       value={promoCode}
//                       onChange={(e) => setPromoCode(e.target.value)}
//                       placeholder="Enter code"
//                       className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none"
//                       disabled={promoApplied}
//                     />
//                     <button
//                       onClick={applyPromoCode}
//                       disabled={promoApplied || !promoCode}
//                       className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Apply
//                     </button>
//                   </div>
//                   {promoApplied && (
//                     <p className="text-sm text-green-600 mt-2">
//                       Promo code applied! {promoDiscount}% discount
//                     </p>
//                   )}
//                 </div>

//                 {/* Billing Summary */}
//                 <div className="mb-6">
//                   <h3 className="text-sm font-medium text-gray-700 mb-3">Billing Summary</h3>
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-2">
//                       <span className="flex items-center">
//                         {item.name} x{item.quantity}
//                         <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
//                           item.billing === "yearly" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
//                         }`}>
//                           {item.billing === "yearly" ? "Annual" : "Monthly"}
//                         </span>
//                       </span>
//                       <span>{formatPrice(item.price * item.quantity)}/mo</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 mb-6">
//                   <div className="flex justify-between text-gray-600">
//                     <span>Subtotal</span>
//                     <span>{formatPrice(subtotal)}/mo</span>
//                   </div>
                  
//                   {promoApplied && (
//                     <div className="flex justify-between text-green-600">
//                       <span>Discount ({promoDiscount}%)</span>
//                       <span>-{formatPrice(discount)}/mo</span>
//                     </div>
//                   )}
                  
//                   <div className="flex justify-between text-gray-600">
//                     <span>GST (18%)</span>
//                     <span>{formatPrice(tax)}</span>
//                   </div>
                  
//                   <div className="border-t border-gray-200 pt-3">
//                     <div className="flex justify-between text-lg font-bold text-gray-900">
//                       <span>Total (Monthly)</span>
//                       <span>{formatPrice(total)}/mo</span>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Including all taxes
//                     </p>
//                   </div>

//                   {/* Annual Equivalent */}
//                   {cartItems.some(item => item.billing === "yearly") && (
//                     <div className="bg-green-50 rounded-lg p-3 mt-4">
//                       <p className="text-xs text-green-800 font-medium mb-1">Annual Billing Advantage</p>
//                       <p className="text-sm text-green-700">
//                         You're saving approximately{' '}
//                         {formatPrice(
//                           cartItems.reduce((sum, item) => {
//                             if (item.billing === "yearly") {
//                               const pricing = planPricing[item.name as keyof typeof planPricing];
//                               if (pricing) {
//                                 return sum + ((pricing.monthly * 12) - pricing.yearly) * item.quantity;
//                               }
//                             }
//                             return sum;
//                           }, 0)
//                         )}{' '}
//                         per year with annual plans
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Checkout Button */}
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full bg-red-700 text-white py-4 rounded-xl font-medium hover:bg-red-800 transition mb-4 flex items-center justify-center"
//                 >
//                   <Lock className="w-4 h-4 mr-2" />
//                   Proceed to Checkout
//                 </button>

//                 {/* Payment Methods */}
//                 <div className="text-center">
//                   <p className="text-xs text-gray-500 mb-3">
//                     Secure payment powered by
//                   </p>
//                   <div className="flex justify-center space-x-4">
//                     <span className="text-sm font-medium text-gray-400">Visa</span>
//                     <span className="text-sm font-medium text-gray-400">Mastercard</span>
//                     <span className="text-sm font-medium text-gray-400">UPI</span>
//                     <span className="text-sm font-medium text-gray-400">Razorpay</span>
//                   </div>
//                 </div>

//                 {/* Trust Badges */}
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="text-center">
//                       <Shield className="w-5 h-5 text-gray-400 mx-auto mb-2" />
//                       <p className="text-xs text-gray-500">Secure Payment</p>
//                     </div>
//                     <div className="text-center">
//                       <Truck className="w-5 h-5 text-gray-400 mx-auto mb-2" />
//                       <p className="text-xs text-gray-500">Instant Access</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }