"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import { useUser, useClerk, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { History, LogIn, UserPlus, BookmarkCheck } from "lucide-react";
import TripHistoryModal from "@/components/planning/TripHistoryModal";

const nav_links = [
  { label: "Trip Planner", href: "/", isCTA: false },
  { label: "Loan", href: "/loans", isCTA: false },
];

const NavBar = () => {
  const { isSignedIn, user } = useUser();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between w-full px-6 py-4 bg-background border-b border-border/50 z-50 sticky top-0 backdrop-blur-sm">
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
          <h1 className="text-secondary text-xl font-bold tracking-tight font-eagle">
            Wander<span className="text-foreground italic"> Way</span>
          </h1>
        </Link>

        <h1 className="font-mamenchisa text-3xl italic hidden lg:block">
          Plan your <span className="text-secondary">Way</span>
        </h1>

        {/* Right Side: Nav + Auth */}
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6">
            {nav_links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.href}
                  className="relative text-sm font-eagle font-medium tracking-wide text-foreground group"
                >
                  {link.label}
                  <span className="absolute left-1/2 -bottom-1 h-[2px] w-0 bg-secondary/80 transition-all duration-300 ease-out group-hover:w-full group-hover:left-0" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Section */}
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              {/* Trip History */}
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-eagle font-medium text-foreground bg-accent hover:bg-accent/80 border border-border/50 rounded-xl transition-all"
                title="Trip History"
              >
                <History size={15} className="text-primary" />
                <span className="hidden sm:block">My Trips</span>
              </button>

              {/* Clerk UserButton — styled avatar */}
              <div className="[&_.cl-avatarBox]:w-9 [&_.cl-avatarBox]:h-9 [&_.cl-avatarBox]:ring-2 [&_.cl-avatarBox]:ring-primary/20 [&_.cl-avatarBox]:rounded-full">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 ring-2 ring-primary/20",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-eagle font-medium text-foreground hover:text-primary border border-border/60 rounded-xl hover:border-primary/40 hover:bg-accent transition-all">
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-eagle font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <UserPlus size={14} />
                  <span className="hidden sm:block">Get Started</span>
                  <span className="sm:hidden">Join</span>
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </nav>

      {/* Trip History Modal */}
      {showHistory && (
        <TripHistoryModal onClose={() => setShowHistory(false)} />
      )}
    </>
  );
};

export default NavBar;