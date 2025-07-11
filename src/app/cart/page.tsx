"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStorage } from "../stores/CartStorage";
import LoadingSpinner from "../component/LoadingSpinner";
import Link from "next/link";
import { NavBar } from "../component/NavBar";
import { CartItem } from "../../types/cart";

const CartPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    removeItem,
  } : {
    cartItems: CartItem[];
    incrementQuantity: (id: number) => void;
    decrementQuantity: (id: number) => void;
    removeItem: (id: number) => void;
  } = useCartStorage();

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
  <>
      <NavBar session={session} />

    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Shopping Cart</h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner /> {/* Show loading spinner while loading */}
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border rounded-lg p-4 shadow-sm"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-gray-700 mt-1">Price: ${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                    aria-label={`Decrease quantity of ${item.title}`}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
                    aria-label={`Increase quantity of ${item.title}`}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-6 text-red-600 hover:text-red-800 font-semibold"
                  aria-label={`Remove ${item.title} from cart`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-4 mb-6">
            <h2 className="text-2xl font-semibold">Total:</h2>
            <span className="text-xl font-semibold">${total.toFixed(2)}</span>
          </div>

          <div className="text-right">
            <Link href={"/checkout"}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  </>
  );
};

export default CartPage;
