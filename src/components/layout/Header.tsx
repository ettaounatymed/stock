"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "@/images/logo.png";
type HeaderProps = {
  signOut: () => void;
};
export function Header({ signOut }: HeaderProps) {
  const [currentDate, setCurrentDate] = useState("");

  // Safely handle the date on the client side to avoid hydration mismatch
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString(undefined, options));
  }, []);
  

  return (
    <header className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="grid grid-cols-3 items-center w-full">
        
        {/* LEFT: Logo */}
        <div className="flex items-center justify-start">
          <Image 
            src={logo} 
            alt="M & Y Stock Tracker" 
            width={90} 
            height={75} 
            className="rounded-full" 
          />
        </div>

        {/* CENTER: Date of the day */}
        <div className="flex items-center justify-center">
          <p className="text-sm font-medium tracking-wide text-cyan-200">
            {currentDate || "Loading date..."}
          </p>
        </div>

        {/* RIGHT: Notification & Connected User */}
        <div className="flex items-center justify-end gap-4 text-white">
          {/* Notification Placeholder */}
          <button className="p-2 hover:bg-white/10 rounded-full transition" aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>

          {/* User Placeholder */}
         
            
          <div className="flex items-center gap-3">
            <button type="button" onClick={signOut} className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 transition hover:border-cyan-400/40 hover:bg-cyan-400/10">
              Sign out
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}