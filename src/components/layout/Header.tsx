"use client";
import Image from "next/image";
import logo from "@/images/logo.png";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

type HeaderProps = {
  signOut: () => void;
};
export function Header({ signOut }: HeaderProps) {
  const currentDate = dateFormatter.format(new Date());

  return (
    <header className="app-header rounded-3xl border p-4 sm:px-6 sm:py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="M & Y Stock Tracker"
              width={64}
              height={64}
              className="h-12 w-12 rounded-2xl border border-blue-300/15 object-cover shadow-lg shadow-blue-950/30 sm:h-14 sm:w-14"
            />
            <div>
              <p className="text-sm font-semibold tracking-wide text-white sm:text-base">M &amp; Y Stock</p>
              <p className="mt-0.5 text-xs text-slate-400">Inventory &amp; sales dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="rounded-xl border border-blue-300/15 bg-blue-500/[0.07] px-3 py-2 text-sm text-blue-100 transition hover:border-blue-300/30 hover:bg-blue-500/15 sm:hidden"
          >
            Sign out
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-300">Today</p>
            <p className="mt-1 text-sm font-medium text-slate-200">{currentDate}</p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <button type="button" onClick={signOut} className="rounded-xl border border-blue-300/15 bg-blue-500/[0.07] px-4 py-2 text-sm font-medium text-blue-100 transition hover:border-blue-300/30 hover:bg-blue-500/15">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}