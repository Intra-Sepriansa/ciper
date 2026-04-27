# Test Plan — Cidurian Riverside Online Ordering

PR: https://github.com/Intra-Sepriansa/ciper/pull/1

## What changed (user-visible)

A complete online ordering platform: customers can browse the menu, add items to a cart, check out as a guest (dine-in / takeaway / delivery), see a payment instruction page, and track their order via a public timeline. Admins can sign in to a dashboard, see incoming orders, manually confirm transfer payments, and download a DomPDF invoice with QR code.

## Primary flow (one continuous recording)

### A. Customer end-to-end (guest checkout — takeaway)

1. Open `http://127.0.0.1:8000/`.
   - **Pass:** Hero shows "Cidurian Riverside" branding and CTA "Pesan Sekarang"; rating 4,3 / 845 ulasan visible.
2. Click "Lihat Menu" (or navigate to `/menu`).
   - **Pass:** Grid of seeded products renders with prices like `Rp75.000`. At least the "Gurame Asam Manis" card is visible.
3. Click the "Gurame Asam Manis" card.
   - **Pass:** Product detail page shows large image, name, price `Rp75.000`, deskripsi, and "Tambah ke Keranjang" button.
4. Click "Tambah ke Keranjang".
   - **Pass:** Toast/redirect; cart counter in header increments to **1**.
5. Open `/cart`.
   - **Pass:** Cart page lists 1 row for "Gurame Asam Manis" qty 1, subtotal `Rp75.000`, "Lanjut Checkout" button visible.
6. Click "Lanjut Checkout".
   - **Pass:** Checkout page shows stepper / customer-data form.
7. Fill: Nama = `Test Customer`, WhatsApp = `081234567890`, choose `Bawa Pulang` (takeaway), pick the earliest pickup time, payment method `Transfer Manual`. Submit.
   - **Pass:** Redirects to `/payment/{order}`. URL contains an order id. Page shows invoice number starting with `CIVERS-`, total = `Rp75.000` + any service charge from settings, and a transfer instruction block.
8. Click "Lacak Pesanan" link / open `/tracking/{invoiceNumber}` from the page (or from the success redirect).
   - **Pass:** Tracking page shows the invoice number, current status `pending_payment` (Indonesian label "Menunggu Pembayaran"), timeline with at least one entry, and "Download Invoice" link.

**This sequence would look different if broken:** if checkout silently failed, no `/payment/...` redirect would happen; if InvoiceService were broken, the invoice number would not start with `CIVERS-`; if status histories were missing, the timeline list would be empty.

### B. Admin manual-payment confirmation + invoice PDF

9. Open `/login` in the same browser (or new tab). Login as `admin@cidurianriverside.id` / `password`.
   - **Pass:** Redirects to `/admin/dashboard`.
10. Navigate to `/admin/orders`.
    - **Pass:** Table contains the order created in step 7, with status badge `pending_payment` and payment status badge `unpaid`.
11. Click that order row → opens `/admin/orders/{id}`.
    - **Pass:** Detail shows items table with Gurame Asam Manis qty 1 = `Rp75.000`, customer name `Test Customer`, "Konfirmasi Pembayaran" form visible (manual transfer).
12. Submit "Konfirmasi Pembayaran" with note `Transfer diterima`.
    - **Pass:** Page reloads; payment status badge changes to `paid` (green) and status badge to `paid`. Status history list grows by one entry attributed to "admin".
13. Click "Download Invoice".
    - **Pass:** Browser downloads or opens a PDF. Filename contains the `CIVERS-…` invoice number; the PDF (open it briefly to verify) renders the store header, the line item, totals matching the order, and a QR code box.

**This sequence would look different if broken:** if `confirmPayment` were not wired, the status badge wouldn't change and the new history row wouldn't appear; if `InvoiceService::stream()` or DomPDF view were broken, the invoice route would 500 or return a blank/HTML response instead of a PDF.

## Out of scope for this run (will not test)

- Live Midtrans / Xendit / RajaOngkir calls (no real keys, structurally integrated only).
- Delivery flow ongkir math against RajaOngkir API (uses local rates fallback in seeded data).
- PWA, maintenance mode, DB backup command — not in this PR.
