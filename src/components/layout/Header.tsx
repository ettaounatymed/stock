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
    <header className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <Image 
            src={logo} 
            alt="M & Y Stock Tracker" 
            width={90} 
            height={75} 
            className="h-14 w-14 rounded-full sm:h-[75px] sm:w-[90px]" 
          />
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-sm transition hover:border-cyan-400/40 hover:bg-cyan-400/10 sm:hidden"
          >
            Sign out
          </button>
        </div>

        <p className="text-center text-sm font-medium tracking-wide text-cyan-200 sm:text-left">
          {currentDate || "Loading date..."}
        </p>

        <div className="hidden items-center gap-3 sm:flex">
          <button type="button" onClick={signOut} className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 transition hover:border-cyan-400/40 hover:bg-cyan-400/10">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}