"use client";

import { FaShoppingCart } from "react-icons/fa";
import { useCartStorage } from "@/app/stores/CartStorage";
import Link from "next/link";

export default function CartIcon() {

    const cartItems = useCartStorage((state) => state.cartItems || []);

    const total = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Link href="/cart" className="relative inline-block">
            <FaShoppingCart className="text-xl"/>
            {total > 0 && (
                <span className="absolute bottom-3 left-4 bg-red-500 text-white rounded-full w-4 h-4 flex justify-center items-center">
                    {total}
                </span>
            )}
        </Link>
    );
}