function NavLink({ href, children }) {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`text-white hover:text-gray-500 transition-colors ${
          isActive ? "text-gray-500" : ""
        }`}
      >
        {children}
      </Link>
    );
  }

  if (loading) return <div className="p-4 text-lg"><LoadingSpinner /></div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <main>
      <nav className="bg-gray-900 border-b border-gray-500 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/">
            <span className="text-white text-2xl font-bold hover:text-gray-500">RevoShop</span>
          </Link>
          <div className="flex gap-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/contact">Contact Us</NavLink>
            <NavLink href="/cart"><CartIcon /></NavLink>
            <NavLink href="/login">Log In</NavLink>
            <NavLink href="/register">Sign Up</NavLink>
          </div>
        </div>
      </nav>
    </main>
  )