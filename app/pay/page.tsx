"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PayPalCheckout } from "../../components/paypal-checkout";

type Booking = {
  ticketNumber: string;
  name: string;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  depositAmount: number;
  balanceAmount: number;
  appointmentDate: string;
  appointmentTime: string;
  bookingStatus: string;
  paymentStatus: string;
};

function isBooking(value: unknown): value is Booking {
  if (!value || typeof value !== "object") return false;
  const booking = value as Partial<Booking>;
  return typeof booking.ticketNumber === "string"
    && typeof booking.name === "string"
    && typeof booking.serviceName === "string"
    && typeof booking.serviceDescription === "string"
    && typeof booking.servicePrice === "number"
    && typeof booking.depositAmount === "number"
    && typeof booking.balanceAmount === "number"
    && typeof booking.appointmentDate === "string"
    && typeof booking.appointmentTime === "string"
    && typeof booking.bookingStatus === "string"
    && typeof booking.paymentStatus === "string";
}

function PaymentPage() {
  const searchParams = useSearchParams();
  const ticketNumber = searchParams.get("ticketNumber")?.trim() ?? "";
  const emailDeliveryFailed = searchParams.get("emailStatus") === "failed";
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!ticketNumber) return;
    const controller = new AbortController();

    async function loadBooking() {
      setIsLoading(true);
      setBooking(null);
      setError("");
      try {
        const response = await fetch(`/api/bookings/checkout?ticketNumber=${encodeURIComponent(ticketNumber)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "We could not load your booking.");
        if (!isBooking(result.booking)) throw new Error("The booking details could not be loaded.");
        setBooking(result.booking);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setBooking(null);
          setError(cause instanceof Error ? cause.message : "We could not load your booking.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadBooking();
    return () => controller.abort();
  }, [ticketNumber]);

  const handlePaymentConfirmed = useCallback((message: string) => {
    setBooking((current) => current ? { ...current, paymentStatus: "paid", bookingStatus: "confirmed" } : current);
    setNotice(message);
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#d6f4ef,_transparent_42%),linear-gradient(135deg,_#f8fbff_0%,_#eef7f5_55%,_#fff8e8_100%)] px-4 py-8 text-slate-900 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-black tracking-[0.12em] text-[#12343a]">
          <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-lg text-teal-800">✦</span>
          WHITE DENTAL CLINIC
        </Link>
        <section className="mt-7 overflow-hidden rounded-[2rem] border border-white/80 bg-white/95 shadow-2xl shadow-teal-950/10 sm:mt-10">
          <div className="bg-gradient-to-r from-[#12343a] via-[#176d70] to-[#58b4a7] px-6 py-8 text-white sm:px-10 sm:py-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-teal-100">Your visit, your way</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Your appointment &amp; payment</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50 sm:text-base">
              The 30% booking fee reserves your chosen appointment time and helps our team prepare for your visit. It is applied toward your service total; the remaining balance is due at your visit.
            </p>
          </div>

          <div className="p-5 sm:p-10">
            {emailDeliveryFailed && (
              <p role="status" className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                Your booking was saved, but we could not send the confirmation email. You can still complete payment below.
              </p>
            )}
            {isLoading && (
              <p role="status" className="mb-5 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
                Loading your appointment details…
              </p>
            )}
            {error && (
              <p role="alert" className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-900">{error}</p>
            )}
            {notice && (
              <p role="status" className="mb-5 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950">{notice}</p>
            )}

            {!ticketNumber ? (
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 text-sm leading-6 text-sky-950">
                Complete the booking form first, and we’ll bring you here to review your appointment and pay the deposit.
                <Link href="/book" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-teal-800 px-5 font-bold text-white hover:bg-[#12343a]">Book an appointment</Link>
              </div>
            ) : booking ? (
              <article className="overflow-hidden rounded-3xl border border-teal-100 bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3 bg-gradient-to-r from-teal-50 via-cyan-50 to-amber-50 p-5 sm:p-7">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">Your selected service</p>
                    <h2 className="mt-2 text-2xl font-black text-[#12343a]">{booking.serviceName}</h2>
                    <p className="mt-1 text-sm text-slate-600">{booking.serviceDescription}</p>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-teal-900 shadow-sm">
                    Booking {booking.ticketNumber}
                  </span>
                </div>

                <div className="p-5 sm:p-7">
                  <p className="text-lg font-bold text-[#12343a]">Appointment details</p>
                  <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="min-w-0 rounded-2xl bg-teal-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-teal-800">Booked for</dt><dd className="mt-1 break-words font-bold text-slate-900">{booking.name}</dd></div>
                    <div className="rounded-2xl bg-sky-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-sky-800">Appointment date</dt><dd className="mt-1 font-bold text-slate-900">{booking.appointmentDate}</dd></div>
                    <div className="rounded-2xl bg-violet-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-violet-800">Appointment time</dt><dd className="mt-1 font-bold text-slate-900">{booking.appointmentTime}</dd></div>
                    <div className="rounded-2xl bg-teal-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-teal-800">Full service cost</dt><dd className="mt-1 font-bold text-slate-900">${booking.servicePrice.toFixed(2)}</dd></div>
                    <div className="rounded-2xl bg-amber-50 p-4"><dt className="text-xs font-semibold uppercase tracking-wide text-amber-800">Balance due at visit</dt><dd className="mt-1 font-bold text-slate-900">${booking.balanceAmount.toFixed(2)}</dd></div>
                  </dl>

                  {booking.paymentStatus === "paid" ? (
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <p className="font-bold text-emerald-950">Payment confirmed—congratulations, your appointment is booked!</p>
                      <p className="mt-1 text-sm leading-6 text-emerald-900">We look forward to welcoming you on {booking.appointmentDate}. Your colorful booking ticket and receipt are ready.</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a href={`/api/bookings/${encodeURIComponent(booking.ticketNumber)}/ticket`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-800 px-5 text-center text-sm font-bold text-white hover:bg-emerald-900">Download booking ticket</a>
                        <a href={`/api/bookings/${encodeURIComponent(booking.ticketNumber)}/receipt`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-800 px-5 text-center text-sm font-bold text-emerald-900 hover:bg-emerald-100">Download receipt</a>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-5">
                      <h3 className="font-bold text-[#12343a]">Choose your secure payment method</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        Pay the 30% booking fee of <strong>${booking.depositAmount.toFixed(2)}</strong> to reserve this appointment time and allow our team to prepare for your visit. The fee is credited toward your service total; the remaining balance is due at the clinic.
                      </p>
                      <PayPalCheckout ticketNumber={booking.ticketNumber} onPaid={handlePaymentConfirmed} />
                    </div>
                  )}
                </div>
              </article>
            ) : null}

            <p className="mt-6 text-center text-sm text-slate-600">
              Questions? Contact White Dental Clinic · 2717 Main Street, Dallas, TX 75226
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function PayPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f3f6f5]" />}><PaymentPage /></Suspense>;
}
