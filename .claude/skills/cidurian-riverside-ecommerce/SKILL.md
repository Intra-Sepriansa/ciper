---
name: cidurian-riverside-ecommerce
description: "Activate when building, reviewing, planning, or extending the Cidurian Riverside Online Ordering System. Use for Laravel 13 + React TypeScript + Inertia e-commerce work involving menu catalog, cart, guest checkout, payment gateways, RajaOngkir/local delivery, PDF invoices, order tracking, reservation, admin dashboard, reports, activity logs, PWA, SEO, and restaurant-specific UI flows for Cidurian Riverside."
license: MIT
metadata:
  author: project
---

# Cidurian Riverside E-Commerce

Use this skill as the product and architecture guardrail for the Cidurian Riverside Online Ordering System.

## Product Context

- Brand: Cidurian Riverside.
- Business: cafe and resto / riverside dining in Jasinga, Bogor.
- Address: Jl. Letnan Sayuti, Pamagersari, Jasinga, Kabupaten Bogor, Jawa Barat 16670.
- Public positioning: river view, lesehan pinggir sungai, family dining, dine-in, takeaway, delivery, small events.
- Public proof points: Google rating around 4.3 from 845 reviews, price range around Rp25.000-50.000 per person, broader public listing range Rp10.000-80.000.
- Signature menu: Gurame Asam Manis.
- Tone: short, direct, warm, premium, never text-heavy.

## Stack Contract

- Backend: Laravel 13, MySQL, Laravel Queue, Pest.
- Frontend: React 19, TypeScript, Inertia v3, Vite, Tailwind CSS v4, shadcn/Radix-style components.
- Routing from React: use Wayfinder route/action helpers where generated.
- Auth: Laravel Breeze/Fortify-style Inertia auth. Add Spatie Permission for roles.
- Tables: TanStack Table for admin grids.
- Forms: React Hook Form + Zod when building rich client-side forms; server validation still uses Form Requests.
- Charts: Recharts for dashboard and reports.
- Animation: Framer Motion only for subtle transitions and state changes.
- Payments: abstract Midtrans/Xendit/manual/pay-at-store behind a PaymentService.
- Shipping: abstract RajaOngkir and local Jasinga delivery rules behind a ShippingService.
- PDF: DomPDF for invoices.
- Export: Laravel Excel for reports.
- Images: Laravel Storage + Intervention Image.
- QR: invoice/order tracking QR code.
- PWA: installable mobile-first app shell and offline-aware fallback.

## Implementation Order

Build in vertical slices, not isolated screens.

1. Domain schema: migrations, enums/constants, models, relationships, factories, seeders.
2. Public catalog: home, menu index, product detail, category/filter/search/sort.
3. Cart: persistent session/customer cart, item notes, variants, add-ons, stock validation.
4. Checkout: guest/customer identity, order method, delivery/takeaway/dine-in details, voucher, totals.
5. Payment: payment intent, manual payment, gateway redirect/webhook skeleton, signature validation.
6. Tracking and invoice: public invoice lookup, timeline, PDF download, QR, WhatsApp fallback.
7. Admin operations: dashboard, products, categories, orders, payments, shipping, promos, reservations.
8. Reports and maintenance: exports, backup command, activity logs, analytics, queue jobs, PWA, SEO.
9. Tests and hardening: checkout totals, stock validation, order status transitions, webhook handling, auth/roles.

## Domain Rules

- Support guest checkout as a first-class flow; login must be optional.
- Order tracking must work without login by invoice/order number.
- WhatsApp fallback must be visible on checkout, payment, tracking, and contact flows.
- Never store card data. Store only gateway references, status, payload metadata, and audit logs.
- Validate stock, operational hours, minimum order, voucher limits, delivery area, and payment availability server-side.
- Wrap checkout/order creation in a database transaction.
- Generate invoice numbers server-side and make them unique/indexed.
- Keep order status and payment status separate.
- Store order status history for every meaningful transition.
- Queue heavy work: invoice generation, email notification, image optimization, report export.
- Use soft deletes for important operational data: products, categories, vouchers, reservations, reviews, galleries, orders when appropriate.

## Data Model Baseline

Create or maintain these core tables unless the project already has equivalent names:

- users, customers, categories, products, product_images, product_variants, product_addons
- carts, cart_items, orders, order_items, order_status_histories
- payments, payment_logs, shipping_addresses, shipping_rates
- vouchers, voucher_usages, reservations, reviews, galleries, settings, activity_logs, notifications
- role and permission tables from Spatie Permission

Important indexes:

- orders: order_number unique, status, payment_status, order_method, created_at, customer_id nullable.
- payments: order_id, status, provider, provider_reference.
- products: category_id, slug unique, is_available, is_popular, deleted_at.
- vouchers: code unique, starts_at, expires_at, is_active.
- reservations: reservation_date, status.

## Status Values

Order statuses:

- pending_payment
- paid
- processing
- ready_for_pickup
- delivering
- completed
- cancelled
- expired
- refunded

Payment statuses:

- unpaid
- pending
- paid
- failed
- expired
- refunded

## Public UX Requirements

- Pages: Home, Menu Index, Menu Detail, Cart, Checkout, Payment, Tracking, Reservation, About, Gallery, Contact.
- Homepage must lead with the restaurant and ordering action, not a generic landing page.
- Keep copy short: "Pesan Sekarang", "Lihat Menu", "Tambah", "Checkout", "Lacak Pesanan", "Hubungi Admin".
- Menu cards need image, name, price, availability, popular badge, and a clear add button.
- Checkout should use a stepper: customer, order method, delivery/time, payment, review.
- Tracking should show a clear timeline, invoice download, and WhatsApp admin action.
- Reservation should support indoor, lesehan, and riverside area choices.

## Admin UX Requirements

- Dashboard: today's sales, today's orders, pending/processing counts, best sellers, 7-day sales chart, category chart, low stock alerts.
- Products: image upload, variants, add-ons, stock, discount, availability, popular/recommended flags.
- Orders: searchable/filterable table, detail panel, status update, print/download invoice, WhatsApp customer action.
- Payments: status, gateway reference, manual confirmation, proof upload, logs.
- Shipping: RajaOngkir config, local delivery rates, minimum order, courier/status.
- Promos: code, percentage/fixed discount, minimum purchase, validity, quota.
- Reports: daily/monthly sales, products, payments, PDF/Excel export.
- Settings: store identity, WhatsApp, address, hours, tax/service, minimum order, gateway keys, SEO, social links.

## UI Direction

- Mobile-first restaurant commerce app, clean and premium.
- Palette: emerald green, river blue, warm cream, dark charcoal.
- Use large real food/place imagery where possible; avoid decorative abstract hero graphics.
- Use cards only for repeated items, tools, tables, modals, and framed order summaries.
- Avoid long paragraphs. Every section should support browsing, trust, checkout, tracking, or admin operations.
- Buttons and controls must be compact, obvious, and thumb-friendly.
- Admin should be dense, calm, and operational; avoid marketing-style hero layouts inside admin.

## Security And Reliability

- Use CSRF protection, Form Requests, policies/gates, and Spatie roles/permissions.
- Rate limit checkout, tracking lookup, payment webhook, login, and reservation submission.
- Validate payment webhook signatures before mutating orders.
- Sanitize uploads and restrict MIME/size.
- Cache settings and navigation/catalog metadata carefully; invalidate on admin updates.
- Add database backup command and document scheduler expectation.
- Use activity logs for admin mutations and payment/order transitions.

## Testing Focus

Prioritize tests for:

- Product availability and stock checks.
- Cart persistence for guest and customer flows.
- Checkout total calculation: subtotal, voucher, tax/service, shipping, grand total.
- Voucher constraints and usage recording.
- Payment webhook success/failure/expired/refunded transitions.
- Public tracking access by invoice number.
- Role authorization for admin/staff/customer.
- Admin order status transition rules.

## Seed Data

Seed realistic categories and menu examples:

- Paket Nasi Ayam Bakar
- Paket Keluarga
- Gurame Asam Manis
- Pecak Lele
- Chicken Steak
- Pizza Civers Supreme
- Paket Ramen
- Sop Durian Original
- Es Cendol Durian Alpukat
- Minuman Segar

Use realistic prices between Rp10.000 and Rp80.000.

