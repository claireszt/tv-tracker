"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "./Button";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Watchlist", href: "/watchlist" },
  { label: "Search", href: "/search" },
  { label: "Profile", href: "/profile" },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    router.push(path);
    setMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-light-background dark:bg-dark-background border-b border-light-border dark:border-dark-border py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="cursor-pointer flex items-center" onClick={() => navigate("/")}>
            <Logo size="sm" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant="nav"
                  text={item.label}
                  onClick={() => navigate(item.href)}
                  isActive={isActive}
                />
              );
            })}
          </div>

          {/* Right: Theme toggle & mobile menu button */}
          <div className="flex items-center">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden ml-2 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 📌 Mobile Navigation (Sliding Dropdown) */}
        <div
          className={`md:hidden flex flex-col items-center gap-3 transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-60 py-4" : "max-h-0"
          }`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant="nav"
                text={item.label}
                onClick={() => navigate(item.href)}
                isActive={isActive}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
