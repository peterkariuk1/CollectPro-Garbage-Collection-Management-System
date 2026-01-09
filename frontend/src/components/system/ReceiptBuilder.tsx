import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";

export function buildReceipt(payment: any) {
  const encoder = new ReceiptPrinterEncoder({
    columns: 32, // 58mm printer
  });

  const qrUrl = `https://jobawu.vercel.app/valid-receipt?id=${payment.id}`;

  return (
    encoder
      .initialize()

      /* ---------- LOGO ---------- */
      .align("center")
      .bold(true)
      .size(2, 2)
      .text("JAWU\n")
      .size(1, 1)
      .bold(false)
      .text("PAYMENT RECEIPT\n\n")

      /* ---------- CUSTOMER ---------- */
      .align("left")
      .text("--------------------------------\n")
      .text(`Name: ${payment.name}\n`)
      .text(`Phone: ${payment.phone}\n`)
      .text(`Month Paid: ${payment.month}\n`)
      .text("--------------------------------\n")

      /* ---------- AMOUNTS ---------- */
      .bold(true)
      .text("Amount Breakdown\n")
      .bold(false)
      .text(`Cash:         ${payment.amount?.cash ?? 0}\n`)
      .text(`Mpesa:        ${payment.amount?.mpesa ?? 0}\n`)
      .text(`Overpayment:  ${payment.amount?.overpayment ?? 0}\n`)
      .text("--------------------------------\n")

      /* ---------- TOTAL ---------- */
      .bold(true)
      .text(`Total:        ${payment.amount?.cash ?? 0}\n`)
      .bold(false)
      .text("--------------------------------\n")

      /* ---------- META ---------- */
      .text(`Payment ID: ${payment.id}\n`)
      .text(`Date: ${payment.createdAt}\n`)
      .text(`Time: ${payment.time}\n`)
      .text("--------------------------------\n\n")

      /* ---------- FOOTER TEXT ---------- */
      .align("center")
      .text("......\n")
      .text("......\n\n")

      /* ---------- QR CODE ---------- */
      .qrcode(qrUrl, {
        model: 2,
        size: 6,
        errorCorrectionLevel: "M",
      })
      .text("\nScan to verify receipt\n\n")

      /* ---------- FINISH ---------- */
      .cut()
      .encode()
  );
}
