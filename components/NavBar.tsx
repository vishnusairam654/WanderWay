import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/assets";

const nav_links = [
  { label: "Trip Planner", href: "/trip", isCTA: false },
  { label: "Loan", href: "/loans", isCTA: false },
  { label: "Sign In", href: "/login", isCTA: true },
];

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between w-full px-6 py-4 bg-background border-b border-border/50">
      {/* Left Side: Logo & Brand Name */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={ASSETS.logo}
            alt="WanderWay logo"
            fill
            sizes="40px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Fixed the font usage to use the Tailwind class */}
        <h1 className="text-secondary text-xl font-bold tracking-tight font-eagle">
          Wander<span className="text-foreground italic"> Way</span>
        </h1>
      </Link>

      <h1 className="font-mamenchisa text-3xl italic">
        Plan your <span className="text-secondary">Way</span>
      </h1>

      {/* Right Side: Navigation Links */}
      <div>
        <ul className="flex items-center gap-8">
          {nav_links.map((link, index) => (
            <li key={index}>
              {link.isCTA ? (
                /* The CTA Button Styling */
                <Link
                  href={link.href}
                  className="relative px-5 py-2.5 text-sm font-eagle font-medium tracking-wide text-secondary-foreground bg-secondary rounded-full group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  {link.label}
                  <span className="absolute left-1/2 bottom-1 h-[2px] w-0 bg-secondary-foreground/80 transition-all duration-300 ease-out group-hover:w-2/3 group-hover:left-1/6"></span>
                </Link>
              ) : (
                /* Standard Link Styling */
                <Link
                  href={link.href}
                  className="relative text-sm font-eagle font-medium tracking-wide text-foreground group"
                >
                  {link.label}
                  <span className="absolute left-1/2 -bottom-1 h-[2px] w-0 bg-secondary/80 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0"></span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
