# Test Plan — Cidurian Riverside Online Ordering System

## What changed
- New end-to-end ordering platform — guest takeaway/dine-in/delivery checkout, public order tracking with QR, admin manual payment confirmation, DomPDF invoice with embedded QR.
- Real photos added under `/storage/menu/` and `/storage/gallery/` (33 files); `CategoryProductSeeder` sets `image_path` on every product/category.
- Bug fix: `InvoiceService::generateQrDataUri` now uses endroid/qr-code v6 constructor API (`new Builder(...)` with named args) instead of removed `Builder::create()` static factory. Fix verified by 2 new Pest tests in `tests/Feature/TrackingTest.php`.

## Existing order to reuse
- `CIVERS-260427-KUNH7` already exists from a previous test attempt: 1 × Gurame Asam Manis, total Rp 75.000, status `pending_payment` / `unpaid`, customer "Test Customer" / 081234567890. Can be reused for tracking + admin confirmation tests.

## Phase A — Customer guest takeaway + tracking
1. Open `http://127.0.0.1:8000/menu`. **Expect**: 12 product cards, each with a `/storage/menu/*.jpg` image (no broken icons).
2. Click "Gurame Asam Manis" card → product detail at `/menu/gurame-asam-manis`. **Expect**: hero photo loads from `/storage/menu/gurame-asam-manis.jpg`, price `Rp 75.000`, "Tambah ke Keranjang" button.
3. Click "Tambah ke Keranjang • Rp 75.000". **Expect**: redirect to `/cart`, header cart counter shows `1`, toast "Ditambahkan ke keranjang", line shows Gurame Asam Manis × 1 = Rp 75.000.  *(PASSED earlier — re-verify)*
4. Click "Checkout" → `/checkout`. Fill name "Test Customer", WhatsApp "081234567890", click Lanjut. Step 2: select Takeaway, set Jam ambil to a future datetime (use console: `setter.call(input, '2026-12-31T12:00')` → dispatch input/change). Step 3: Transfer Manual selected by default. Click "Bayar Sekarang". **Expect**: redirect URL matches `/checkout/CIVERS-\d{6}-[A-Z0-9]{5}/payment`, page heading "Pembayaran", invoice number prefix `CIVERS-`, total `Rp 75.000`, BCA transfer instructions visible, cart counter resets to `0`.  *(PASSED earlier — re-verify)*
5. Click "Lacak Pesanan" → `/tracking/CIVERS-...`. **Expect** (this is what was broken before): HTTP 200 (not 500), invoice number visible, status "Menunggu Pembayaran", QR code image visible, timeline shows ≥1 history entry. **Pass/fail discriminator**: A broken QR generator returned 500 with "Builder::create() undefined". A fixed one renders the page with a `data:image/png;base64,...` `<img>` for the QR. → If we see a real PNG QR rendered, fix is proven. If 500 again, fix is broken.

## Phase B — Admin manual payment confirmation + invoice PDF
6. Navigate to `/login`. Submit `admin@cidurianriverside.id` / `password`. **Expect**: redirect to `/admin/dashboard`.
7. Open `/admin/orders`. **Expect**: row for `CIVERS-260427-KUNH7` (or the order created in Phase A) with status badge `pending_payment` and payment badge `unpaid`.
8. Click into the order detail. **Expect**: line item "Gurame Asam Manis × 1 = Rp 75.000", "Konfirmasi Pembayaran" form visible.
9. Submit "Konfirmasi Pembayaran" with note "Confirmed via test". **Expect** (three writes must all happen — proves CheckoutService.confirmPayment touches order, payment, history): payment badge changes `unpaid → paid`, order status badge changes `pending_payment → paid`, a new entry appears in the status history list.
10. Click "Download Invoice". **Expect**: HTTP 200 with `Content-Type: application/pdf`, filename `Invoice-CIVERS-...pdf`, PDF size > 5 KB. Open the PDF and verify it contains the `CIVERS-` invoice number, the "Gurame Asam Manis" line, total Rp 75.000, and a visible QR code square.

## Pass/fail summary discriminators (per step)
| Step | What a BROKEN system would show | What a FIXED system shows |
|---|---|---|
| 1 | Broken-image icons | All 12 cards render real food photos |
| 5 | 500 error: `Builder::create() undefined` | 200 OK with QR PNG `<img src="data:image/png;base64,...">` |
| 9 | Badge stays `unpaid`, status stays `pending_payment`, no history row | Both badges flip to `paid`, new "Pembayaran dikonfirmasi" history entry |
| 10 | Empty/HTML response, or 500 from QR generation | Valid PDF with CIVERS-... number, line item, QR |

## Out of scope (do not test in this run)
- RajaOngkir delivery rates (requires API key)
- Midtrans/Xendit gateway redirects (requires keys)
- Reservation flow
- Reports CSV export
- Voucher application
