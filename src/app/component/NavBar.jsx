"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import CartIcon from "./CartIcon";

export function NavBar({ session }) {
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "admin";

  function NavLink({ href, children }) {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`text-white hover:text-gray-400 transition-colors ${
          isActive ? "text-gray-400" : ""
        }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4">
        <Link href="/">
          <span className="text-white text-2xl font-bold hover:text-gray-400">
            RevoShop
          </span>
        </Link>

        <div className="flex gap-4 items-center">
          <NavLink href="/">Home</NavLink>

          {isAdmin ? (
            <>
              <NavLink href={"/dashboard/products"}>Products</NavLink>
            </>
          ) : (
            <>
              <NavLink href="/">FAQ</NavLink>
              <NavLink href="/cart"><CartIcon /></NavLink>
            </>
          )}
          
          <NavLink href={isAdmin ? "/dashboard" : "/profile"}>
            {session?.user?.name?.split(" ")[0] || "Profile"}
          </NavLink>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-white hover:text-gray-400 transition-colors"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}
