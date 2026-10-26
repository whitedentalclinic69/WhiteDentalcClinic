export type BookingDocumentData = {
  name: string;
  email: string;
  phone: string;
  ticketNumber: string;
  service: string;
  description: string;
  totalCost: number;
  depositAmount: number;
  date: string;
  time: string;
  paymentStatus: string;
  paidAt?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function createBookingDocument(
  booking: BookingDocumentData,
  type: "ticket" | "receipt",
) {
  const receipt = type === "receipt";
  const heading = receipt ? "Deposit payment receipt" : "Appointment booking ticket";
  const paymentStatus = booking.paymentStatus === "paid" ? "Paid" : "Awaiting deposit";
  const amountLabel = receipt || paymentStatus === "Paid" ? "Booking fee paid" : "Booking fee due (30%)";
  const amount = booking.depositAmount;
  const details = [
    ["Booking code", booking.ticketNumber],
    ["Patient", booking.name],
    ["Email", booking.email],
    ["Phone", booking.phone],
    ["Service", booking.service],
    ["Appointment date", booking.date],
    ["Appointment time", booking.time],
    ["Total service cost", `$${booking.totalCost.toFixed(2)}`],
    [amountLabel, `$${amount.toFixed(2)}`],
    ["Balance due at visit", `$${(booking.totalCost - booking.depositAmount).toFixed(2)}`],
    ["Payment status", paymentStatus],
    ...(receipt && booking.paidAt ? [["Payment received", booking.paidAt]] : []),
  ];
  const rows = details
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${heading} · White Dental Clinic</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:32px;background:linear-gradient(135deg,#e5fbf7,#f5f9ff 55%,#fff6e3);color:#17202b;font:16px/1.6 Arial,sans-serif}
.ticket{max-width:720px;margin:auto;background:#fff;border:1px solid #c7eee8;border-radius:24px;overflow:hidden;box-shadow:0 20px 56px #12343a1c}
header{position:relative;padding:34px 38px;background:linear-gradient(115deg,#12343a,#176d70 58%,#58b4a7);color:#fff}header p{margin:0;color:#c8fff3;font-size:12px;font-weight:bold;letter-spacing:.16em;text-transform:uppercase}
h1{margin:12px 0 0;font-size:28px}.badge{display:inline-block;margin-top:16px;padding:7px 13px;border-radius:999px;background:#fff;color:#126d69;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.08em}
main{padding:28px 38px}.description{padding:16px;background:linear-gradient(110deg,#e9fbf7,#eff8ff);border-left:4px solid #58b4a7;border-radius:12px}
table{width:100%;margin-top:22px;border-collapse:collapse}th,td{padding:12px 0;border-bottom:1px solid #e5eeee;text-align:left;vertical-align:top}th{width:42%;color:#64717e;font-weight:500}td{font-weight:700;color:#12343a}
footer{padding:18px 38px;background:#f4fbfa;color:#526872;font-size:13px}.print{display:block;margin:0 auto 18px;padding:12px 20px;border:0;border-radius:999px;background:#126d69;color:white;font-weight:700;cursor:pointer}
@media print{body{padding:0;background:#fff}.ticket{border:0;box-shadow:none}.print{display:none}}
</style>
</head>
<body>
<button class="print" onclick="window.print()">Print or save as PDF</button>
<article class="ticket">
<header><p>White Dental Clinic · Dallas</p><h1>${heading}</h1><span class="badge">${paymentStatus === "Paid" ? "Appointment confirmed" : "Payment pending"}</span></header>
<main><p class="description">${escapeHtml(booking.description)}</p><table><tbody>${rows}</tbody></table></main>
<footer>Thank you for choosing White Dental Clinic. Your booking fee reserves your appointment time and helps our team prepare for your visit. It is credited toward your service total; the remaining balance is payable at your visit.</footer>
</article>
</body>
</html>`;
}
