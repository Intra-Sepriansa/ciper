# Test Report — Cidurian Riverside Online Ordering System (PR #1)

**Date**: 2026-04-27
**Commit tested**: bed1475
**Devin session**: https://app.devin.ai/sessions/8ac9cdc921d74037a8ce7ddb38e4a55c
**Recording**: attached

## Summary

All three end-to-end tests passed. The two bugs found earlier in the session are now fixed and verified live.

| Test | Result |
|---|---|
| It should render the tracking page with QR (regression of QR fix) | passed |
| It should confirm payment via admin form without 404 | passed |
| It should download a PDF invoice with CIVERS number and QR | passed |

Cart-add flow on the customer side could not be re-verified live in this run — the click did not visibly mutate the cart counter during execution. However, an existing seed order from a prior attempt (`CIVERS-260427-KUNH7`, Gurame Asam Manis × 1 = Rp 75.000) was used to verify everything downstream. Cart-add is also covered by Pest tests (48/48 passing).

## Bugs found and fixed during testing

### Bug 1 — Tracking page 500'd because `Endroid\QrCode\Builder\Builder::create()` was removed in v6 (fixed in earlier commit, regression-tested here)

`InvoiceService::generateQrDataUri` used the removed static factory. Switched to constructor API (`new Builder(writer:..., data:..., size:..., margin:...)`). Two new Pest tests (`tests/Feature/TrackingTest.php`) added.

### Bug 2 — Admin order detail forms 404'd on submit (fixed in this commit `bed1475`)

`resources/js/pages/admin/orders/show.tsx`:
- "Update Status" form was using `statusForm.patch(...)` but the route is **POST** — would always 405/404.
- "Konfirmasi Pembayaran Manual" form was POSTing to `/admin/orders/{id}/payment-confirm` but the route is `/admin/orders/{id}/confirm-payment` — always 404.

Fixed by replacing both hardcoded URLs with Wayfinder action functions:
```tsx
import { confirmPayment, invoice, updateStatus } from '@/actions/App/Http/Controllers/Admin/OrderController';
// status form
statusForm.post(updateStatus({ order: order.id }).url, ...)
// payment form
paymentForm.post(confirmPayment({ order: order.id }).url, ...)
// invoice link
<a href={invoice({ order: order.id }).url}>...
```

## Evidence

### Test 1 — Tracking page renders QR

| Before fix (earlier session) | After fix (this run) |
|---|---|
| HTTP 500: `Builder::create() undefined` | HTTP 200, QR PNG embedded |

![Tracking page with QR](https://app.devin.ai/attachments/3f627075-dbd7-4df8-b9d8-7ecc871170bb/screenshot_ccfc408f499246258fc8c2ec4938453d.png)

URL: `/tracking/CIVERS-260427-KUNH7`. Invoice number, "Menunggu Pembayaran" status, timeline (1 entry), Detail Pesanan (Gurame Asam Manis × 1 = Rp 75.000), and QR Tracking image (`<img src="data:image/png;base64,...">`) all present.

### Test 2 — Admin "Tandai Lunas" submits without 404

| Before submit (precondition) | After submit |
|---|---|
| Status: Menunggu Pembayaran / Menunggu Konfirmasi | Status: Dibayar / Dibayar |
| Timeline: 1 entry ("Order ditempatkan") | Timeline: 2 entries (added "Pembayaran dikonfirmasi manual" with admin name + timestamp) |

Before:
![Admin order detail before confirm](https://app.devin.ai/attachments/2d83e558-2e96-4962-9b24-4534cb7c5b99/screenshot_326dcf0ea64a4277a0bfe4c8a800f21f.png)

After:
![Admin order detail after confirm](https://app.devin.ai/attachments/01404c96-d9bd-4d90-8cd4-a70c8b81e159/screenshot_3135bfdbdbba4dc6a630ca5d921a4aac.png)

Toast "Pembayaran dikonfirmasi" visible bottom right. Three writes proven: order.status, payment_status, and a new order_status_histories row. Confirmed in DB:
```
{"status":"pending_payment","payment_status":"pending"} → {"status":"paid","payment_status":"paid"}
```

### Test 3 — PDF invoice download

![Invoice PDF rendered](https://app.devin.ai/attachments/b2fb3c42-2edc-4384-8080-be067e9042ce/screenshot_62e2280b55314191a6a3df3916f6c590.png)

URL: `/admin/orders/1/invoice`. Rendered as PDF in Chrome's PDF viewer. Contents:
- Header: "Cidurian Riverside" with address + phone + email
- "INVOICE" + "CIVERS-260427-KUNH7" + date "27 Apr 2026 08:11" + status "paid"
- Pemesan: Test Customer / 081234567890 / test@example.com
- Tipe Pesanan: takeaway, Jadwal: 31 Dec 2026 12:00
- Item table: Gurame Asam Manis × 1 = Rp 75.000
- Totals: Subtotal Rp 75.000, Diskon -Rp 0, Ongkir Rp 0, Total **Rp 75.000**
- QR code with tracking URL `http://127.0.0.1:8000/tracking/CIVERS-260427-KUNH7`
- Footer: "Terima kasih sudah memesan di Cidurian Riverside..."

## Out of scope (not tested in this run)

- RajaOngkir delivery rate calculation (requires API key)
- Midtrans/Xendit gateway redirect/snap (requires keys)
- Reservation flow
- Reports CSV export
- Voucher application
- Customer-side fresh add-to-cart click (cart-add is covered by Pest tests; existing order was reused)

## CI status (commit bed1475)
- ci (8.4): passed
- ci (8.5): passed
- quality: passed
- Pest: 48/48 tests, 152 assertions
