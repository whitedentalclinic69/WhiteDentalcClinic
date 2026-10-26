import nodemailer, { type SendMailOptions } from "nodemailer";
import { createBookingDocument, type BookingDocumentData } from "./booking-documents";

function appUrl() {
  const configuredUrl = process.env.APP_URL?.trim();
  const isLocalUrl = (value: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(value);
  const configuredPublicUrl = configuredUrl && !isLocalUrl(configuredUrl)
    ? configuredUrl
    : undefined;
  const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const candidate = configuredPublicUrl || deploymentHost;

  if (!candidate) {
    throw new Error("Public email links are not configured. Set APP_URL to the clinic's public HTTPS website URL.");
  }

  const normalizedUrl = /^[a-z][a-z\d+.-]*:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;
  let url: URL;
  try {
    url = new URL(normalizedUrl);
  } catch {
    throw new Error("APP_URL must be a valid public website URL.");
  }

  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    isLocalUrl(url.toString())
  ) {
    throw new Error("APP_URL must be a public HTTPS website URL, not a localhost address.");
  }

  return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

async function sendConfiguredEmail({
  to,
  subject,
  html,
  text,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  attachments?: SendMailOptions["attachments"];
}) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("Email delivery is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port,
    secure: port === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || smtpUser,
    to,
    subject,
    text,
    html,
    attachments,
  });
}

function bookingEmailLayout(
  title: string,
  name: string,
  message: string,
  ticketNumber: string,
  primaryLink: string,
  primaryLabel: string,
  secondaryLink: string,
  secondaryLabel: string,
) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:28px;background:#f3f5f7;color:#17202b;font:16px/1.6 Arial,sans-serif">
<div style="max-width:640px;margin:auto;background:white;border:1px solid #e2e7ed;border-radius:18px;overflow:hidden">
<div style="padding:22px;text-align:center;background:#102c35;color:white;font-weight:bold;letter-spacing:.12em">WHITE DENTAL CLINIC</div>
<div style="padding:30px"><p style="margin-top:0;color:#126d69;font-size:12px;font-weight:bold;letter-spacing:.14em;text-transform:uppercase">Dallas · Thoughtful dental care</p>
<h1 style="color:#102c35">${escapeHtml(title)}</h1><p>Hello ${escapeHtml(name)},</p><p>${message}</p>
<p><strong>Booking code: ${escapeHtml(ticketNumber)}</strong></p>
<p><a href="${escapeHtml(primaryLink)}" style="display:inline-block;padding:13px 20px;border-radius:999px;background:#126d69;color:white;text-decoration:none;font-weight:bold">${escapeHtml(primaryLabel)}</a></p>
<p><a href="${escapeHtml(secondaryLink)}" style="display:inline-block;padding:11px 18px;border:1px solid #126d69;border-radius:999px;color:#126d69;text-decoration:none;font-weight:bold">${escapeHtml(secondaryLabel)}</a></p>
<p>If you don’t see our email, please check your spam or junk folder.</p>
<p>Warm regards,<br><strong>White Dental Clinic</strong></p></div></div></body></html>`;
}

export async function sendBookingConfirmationEmail(booking: BookingDocumentData) {
  const bookingActionsLink = `${appUrl()}/booking-options?ticketNumber=${encodeURIComponent(booking.ticketNumber)}`;
  await sendConfiguredEmail({
    to: booking.email,
    subject: `Thank you for choosing White Dental Clinic`,
    html: bookingEmailLayout(
      "Your care begins with a warm welcome",
      booking.name,
      `We’re pleased to have received your appointment request for ${escapeHtml(booking.service)} on ${escapeHtml(booking.date)} at ${escapeHtml(booking.time)}. At White Dental Clinic, we want every visit to feel welcoming, thoughtful, and tailored to you. Your service total is $${booking.totalCost.toFixed(2)}, with a 30% booking deposit of $${booking.depositAmount.toFixed(2)}. Choose an option below to continue.`,
      booking.ticketNumber,
      bookingActionsLink,
      "Pay your deposit",
      bookingActionsLink,
      "View or check your booking",
    ),
    text: `Hello ${booking.name},\n\nThank you for choosing White Dental Clinic. We’re pleased to have received your appointment request, and we look forward to making your visit welcoming and comfortable.\n\nService: ${booking.service}\n${booking.description}\nAppointment requested: ${booking.date} at ${booking.time}\nService total: $${booking.totalCost.toFixed(2)}\nBooking deposit (30%): $${booking.depositAmount.toFixed(2)}\nBooking code: ${booking.ticketNumber}\n\nUse this page to pay your deposit or check your booking status:\n${bookingActionsLink}\n\nTo check your status, enter your booking code and the email address used when booking. Your appointment is confirmed once your deposit payment is verified. We’ll then email your booking ticket and receipt.\n\nWarm regards,\nWhite Dental Clinic`,
  });
}

export async function sendPaymentConfirmationEmail(
  booking: BookingDocumentData,
) {
  const link = `${appUrl()}/booking-options?ticketNumber=${encodeURIComponent(booking.ticketNumber)}`;
  const ticketLink = `${appUrl()}/api/bookings/${encodeURIComponent(booking.ticketNumber)}/ticket`;
  const ticket = createBookingDocument(booking, "ticket");
  const receipt = createBookingDocument(booking, "receipt");
  await sendConfiguredEmail({
    to: booking.email,
    subject: `Your appointment is confirmed | White Dental Clinic`,
    html: bookingEmailLayout(
      "Your smile is in good hands",
      booking.name,
      `Your $${booking.depositAmount.toFixed(2)} deposit for ${escapeHtml(booking.service)} has been securely confirmed. Your appointment is booked for ${escapeHtml(booking.date)} at ${escapeHtml(booking.time)}. Thank you for trusting White Dental Clinic with your care—we look forward to welcoming you and providing a thoughtful, comfortable visit. Your booking ticket and payment receipt are attached.`,
      booking.ticketNumber,
      link,
      "View your booking",
      ticketLink,
      "Download booking ticket",
    ),
    text: `Hello ${booking.name},\n\nYour $${booking.depositAmount.toFixed(2)} deposit for ${booking.service} has been securely confirmed. Your appointment is booked for ${booking.date} at ${booking.time}.\nBooking code: ${booking.ticketNumber}\n\nThank you for trusting White Dental Clinic with your care. We look forward to welcoming you and providing a thoughtful, comfortable visit. Your booking ticket and payment receipt are attached.\n\nTo check your booking status or download your documents again, visit this page and enter your booking code and the email address used when booking:\n${link}\n\nWarm regards,\nWhite Dental Clinic`,
    attachments: [
      {
        filename: `White-Dental-Clinic-ticket-${booking.ticketNumber}.html`,
        content: ticket,
        contentType: "text/html",
      },
      {
        filename: `White-Dental-Clinic-receipt-${booking.ticketNumber}.html`,
        content: receipt,
        contentType: "text/html",
      },
    ],
  });
}

export async function sendVisitorQuestionResponseEmail({
  name,
  email,
  question,
  response,
}: {
  name: string;
  email: string;
  question: string;
  response: string;
}) {
  const greeting = name ? `Hello ${escapeHtml(name)},` : "Hello,";
  await sendConfiguredEmail({
    to: email,
    subject: "A reply from White Dental Clinic",
    html: `<!doctype html><html lang="en"><body style="font:16px/1.6 Arial,sans-serif;color:#17202b"><h1>White Dental Clinic</h1><p>${greeting}</p><p>${escapeHtml(response).replace(/\n/g, "<br>")}</p><hr><p><strong>Your message</strong></p><p>${escapeHtml(question).replace(/\n/g, "<br>")}</p></body></html>`,
    text: `${name ? `Hello ${name},` : "Hello,"}\n\n${response}\n\nYour message:\n${question}\n\nWhite Dental Clinic`,
  });
}
