"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Shield, Truck, Lock } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  plan: string;
  price: number;
  billing: "monthly" | "yearly";
  quantity: number;
  features: string[];
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Load cart data immediately when component mounts
  useEffect(() => {
    loadCartData();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      console.log("Storage changed, reloading cart");
      loadCartData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadCartData = () => {
    try {
      console.log("Loading cart data...");
      const savedCart = localStorage.getItem("subscriptionCart");
      console.log("Raw cart from localStorage:", savedCart);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log("Parsed cart:", parsedCart);
        
        // Validate that parsedCart is an array
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
          console.log("Cart loaded successfully:", parsedCart.length, "items");
        } else {
          console.error("Cart is not an array:", parsedCart);
          setCartItems([]);
        }
      } else {
        console.log("No cart found in localStorage");
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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("subscriptionCart", JSON.stringify(cartItems));
      console.log("Saved cart to localStorage:", cartItems);
    } else {
      localStorage.removeItem("subscriptionCart");
      console.log("Removed cart from localStorage");
    }
  }, [cartItems]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("subscriptionCart");
    console.log("Cart cleared");
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE20") {
      setPromoApplied(true);
      setPromoDiscount(20);
    } else if (promoCode.toUpperCase() === "WELCOME10") {
      setPromoApplied(true);
      setPromoDiscount(10);
    } else {
      alert("Invalid promo code");
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = promoApplied ? (subtotal * promoDiscount) / 100 : 0;
  const tax = (subtotal - discount) * 0.18;
  const total = subtotal - discount + tax;

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/login?redirect=cart");
      return;
    }
    router.push("/checkout");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
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
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-mono">
                Cart Items: {cartItems.length}<br/>
                Cart Data: {JSON.stringify(cartItems)}
              </p>
            </div>
          )}
        </div>

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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Billing:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.billing === "yearly" 
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {item.billing === "yearly" ? "Annual" : "Monthly"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-6">
                          {/* Quantity Controls */}
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

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">/mo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
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
                      disabled={promoApplied || !promoCode}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-600 mt-2">
                      Promo code applied! {promoDiscount}% discount
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({promoDiscount}%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Including all taxes
                    </p>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-700 text-white py-4 rounded-xl font-medium hover:bg-red-800 transition mb-4 flex items-center justify-center"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Proceed to Checkout
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