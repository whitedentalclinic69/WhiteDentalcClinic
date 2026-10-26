import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(request: Request) {
  const ticketNumber = new URL(request.url).searchParams.get("ticketNumber")?.trim() ?? "";
  if (!ticketNumber || ticketNumber.length > 64) {
    return NextResponse.json({ error: "Enter a valid booking number." }, { status: 400 });
  }
  if (!supabase) {
    return NextResponse.json({ error: "Booking payment service is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("ticket_number, service_name, service_description, service_price, deposit_amount, balance_amount, appointment_date, appointment_time, booking_status, payment_status")
    .eq("ticket_number", ticketNumber)
    .maybeSingle();

  if (error) {
    console.error("Booking checkout lookup failed:", error.message);
    return NextResponse.json({ error: "We could not load this booking. Please try again." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Booking not found. Check the booking number and try again." }, { status: 404 });
  }

  return NextResponse.json({
    booking: {
      ticketNumber: data.ticket_number,
      serviceName: data.service_name,
      serviceDescription: data.service_description,
      servicePrice: Number(data.service_price),
      depositAmount: Number(data.deposit_amount),
      balanceAmount: Number(data.balance_amount),
      appointmentDate: data.appointment_date,
      appointmentTime: data.appointment_time,
      bookingStatus: data.booking_status,
      paymentStatus: data.payment_status,
    },
  });
}
