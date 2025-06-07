"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStorage } from "../stores/CartStorage";
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCartStorage();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession()
  const [form, setForm] = useState({ paymentMethod: "card" });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, paymentMethod: e.target.value });
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    // Here you would normally process the payment/order...

    // Simulate async operation
    setTimeout(() => {
      clearCart();
      setLoading(false);
      alert('Thank you for shopping!');
      router.push("/");
    }, 1000);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Order Summary</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="mb-2 border-b pb-2">
                <p>{item.name}</p>
                <p>
                  {item.quantity} x ${item.price.toFixed(2)}
                </p>
                <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="font-bold mt-4 flex justify-between">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Payment method selector */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Payment Method:</label>
        <div className="space-y-2">
          {["card", "transfer", "cod", "wallet"].map((method) => (
            <label key={method} className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={form.paymentMethod === method}
                onChange={handleChange}
              />
              <span>
                {{
                  card: "Credit/Debit Card",
                  transfer: "Bank Transfer",
                  cod: "Cash On Delivery",
                  wallet: "e-Wallet",
                }[method]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || cartItems.length === 0}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing Order..." : "Place Order"}
      </button>
    </div>
  );
}
