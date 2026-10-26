"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function BookingOptions() {
  const searchParams = useSearchParams();
  const [bookingCode, setBookingCode] = useState(searchParams.get("ticketNumber")?.trim().toUpperCase() ?? "");
  const normalizedCode = bookingCode.trim().toUpperCase();
  const hasBookingCode = normalizedCode.length > 0;

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#d6f4ef,_transparent_42%),linear-gradient(135deg,_#f8fbff_0%,_#eef7f5_55%,_#fff8e8_100%)] px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-black tracking-[0.12em] text-[#12343a]">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-lg text-teal-800">✦</span>
          WHITE DENTAL CLINIC
        </Link>
        <section className="mt-9 overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-2xl shadow-teal-950/10 sm:mt-12">
          <div className="bg-gradient-to-r from-[#12343a] via-[#176d70] to-[#58b4a7] px-6 py-8 text-white sm:px-10 sm:py-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-100">Your booking, one easy step</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">What would you like to do?</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50 sm:text-base">
              Enter the 10-character booking code from your email, then choose to pay your deposit or check your appointment status.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <label htmlFor="booking-code" className="block text-sm font-bold text-[#12343a]">Booking code
              <input
                id="booking-code"
                autoComplete="off"
                maxLength={64}
                value={bookingCode}
                onChange={(event) => setBookingCode(event.target.value.toUpperCase())}
                placeholder="e.g. A1B2C3D4E5"
                className="mt-2 min-h-14 w-full rounded-2xl border border-teal-100 bg-teal-50/60 px-4 font-mono text-lg font-bold tracking-[0.12em] text-[#12343a] outline-none transition placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal focus:border-teal-600 focus:ring-2 focus:ring-teal-700/15"
              />
            </label>
            <p className="mt-2 text-xs leading-5 text-slate-500">New booking codes contain 10 letters and numbers. Older bookings can use their original code.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Link
                aria-disabled={!hasBookingCode}
                href={hasBookingCode ? `/pay?ticketNumber=${encodeURIComponent(normalizedCode)}` : "#booking-code"}
                className={`group rounded-2xl border p-5 transition ${hasBookingCode ? "border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-900/10" : "pointer-events-none border-slate-200 bg-slate-50 opacity-60"}`}
                tabIndex={hasBookingCode ? undefined : -1}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-700 text-xl text-white" aria-hidden="true">$</span>
                <span className="mt-4 block text-lg font-black text-[#12343a]">Pay your deposit</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">Review your booking and continue to secure PayPal or card payment.</span>
              </Link>
              <Link
                aria-disabled={!hasBookingCode}
                href={hasBookingCode ? `/track?ticketNumber=${encodeURIComponent(normalizedCode)}` : "#booking-code"}
                className={`group rounded-2xl border p-5 transition ${hasBookingCode ? "border-sky-200 bg-gradient-to-br from-sky-50 to-violet-50 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-900/10" : "pointer-events-none border-slate-200 bg-slate-50 opacity-60"}`}
                tabIndex={hasBookingCode ? undefined : -1}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-700 text-xl text-white" aria-hidden="true">✓</span>
                <span className="mt-4 block text-lg font-black text-[#12343a]">Check booking status</span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">Enter the email used for booking to view payment and appointment status.</span>
              </Link>
            </div>
          </div>
        </section>
        <p className="mt-6 text-center text-xs text-slate-500">Questions? Contact White Dental Clinic · 2717 Main Street, Dallas, TX 75226</p>
      </div>
    </main>
  );
}

export default function BookingOptionsPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f3f6f5]" />}><BookingOptions /></Suspense>;
}
