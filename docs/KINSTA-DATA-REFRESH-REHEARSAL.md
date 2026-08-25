# Kinsta Data Refresh Rehearsal

This checklist creates an isolated target for the Legacy-to-Headless content ETL. It does not
authorize changes to the active Headless WordPress environment.

## Create the Environment

- [ ] In MyKinsta, create a new **Standard staging environment** cloned from the current Headless
  WordPress environment.
- [ ] Name it clearly, for example `data-refresh-rehearsal-202608`.
- [ ] Record the source environment, clone timestamp, generated hostname, SSH path, and backup ID.
- [ ] Add password protection and restrict access to the project team.
- [ ] Confirm the active Headless hostname and database were not selected as the destination.

## Isolate External Effects

- [ ] Disable outbound email or route it to a test mailbox.
- [ ] Disable payment capture and use test credentials only.
- [ ] Disable FileMaker/order export, CRM, ERP, analytics, chat, and marketing webhooks.
- [ ] Disable WordPress cron and run only explicitly approved jobs manually.
- [ ] Disable outgoing cache-revalidation calls to the production Next.js site.
- [ ] Add a visible `REHEARSAL` environment marker in WordPress Admin.

## Establish the Baseline

- [ ] Create a database-only backup of the new rehearsal environment.
- [ ] Run `scripts/inventory-wordpress-migration.sh` against the clone.
- [ ] Compare the clone inventory to the captured Headless baseline.
- [ ] Confirm favorites, 2FA metadata, users, Service Bulletins, Application Notes, GraphQL options,
  MU plugins, and product taxonomies are present before testing the ETL.
- [ ] Test restoring the rehearsal database backup and rerun the baseline comparison.

## Approve the Dry Run

- [x] Approve the 73 ETA updates and reject the 26 source-missing SKUs.
- [x] Approve nine PDF additions and 49 hash-different replacements with hash verification.
- [x] Import the 123 Legacy-account orders as guests; do not create customer accounts.
- [x] Preserve the 330 existing guest orders as guests and retain all three failed orders unchanged.
- [x] Exclude `Wireless_QuantumSlim-v17.pdf` until the source file is recovered.
- [x] Keep all customer-group differences Headless-owned and excluded.

These decisions are versioned in `scripts/wordpress-rehearsal-policy.json`.

## Run the ETA Stage

- [ ] On the disposable clone only, set the marker:
  `wp option add bapi_data_refresh_rehearsal bapi-data-refresh-20260821 --path=<clone-path>`.
- [ ] Copy `run-wordpress-rehearsal-etl.php` and the complete generated rehearsal package to a
  private directory on the clone. The importer rejects an absent or modified approved policy.
- [ ] Run dry-run mode and reconcile 73 candidate rows and 26 rejected rows.
- [ ] Apply only after dry-run approval by setting `BAPI_REHEARSAL_APPLY=YES` and selecting `apply`.
- [ ] Rerun dry-run mode; all 73 approved products must report `unchanged`.

## Rehearsal Acceptance

- [x] Run the ETA, product-document, and order ETL stages in dry-run mode against the clone.
- [x] Apply each approved stage separately. No user-import stage was approved or run.
- [x] Rerun all three stages to prove idempotency: each proposed zero writes.
- [ ] Verify GraphQL, product pages, documents, authentication, favorites, 2FA, cart, and checkout.
  Public GraphQL/product/document/cart/checkout paths and unauthenticated security guards passed on
  August 24. A dedicated clone-only E2E user subsequently passed login, `/api/auth/me`, account
  access, favorites persistence and cleanup, and empty order-history query/page checks. The dashboard
  expects a `twoFactorEnabled` field that `/api/auth/me` does not return, so 2FA status remains open.
  Imported-order detail was not retested because baseline restore removed the 669 rehearsed orders.
- [x] Verify the clone continued blocking mail, outbound HTTP, payments, webhooks, cron, and Action
  Scheduler; zero payment gateways were available after order apply.
- [x] Reconcile ETA, product-document, and order applied, unchanged, rejected, and failed totals.
- [x] Restore the baseline backup and verify the pre-rehearsal inventory is recovered exactly.
  The two omitted empty-slug auto-drafts and rotating WooCommerce logs were classified as ephemeral;
  all stable keys and approved business-field/document/PDF hashes matched their pre-apply snapshots.

Do not schedule production cutover until every acceptance item has evidence and an owner.

## Planning Disposition

The technical rehearsal and restore are accepted for cutover planning. The exact pre-restore order
reconciliation is accepted in place of repeating the 669-order import solely for an order-detail UI
check. The missing 2FA status field is tracked as a separate application contract issue; no 2FA data
was migrated or changed. Production execution remains unauthorized pending the named approvals and
preconditions in `WORDPRESS-DATA-REFRESH-PRODUCTION-CUTOVER.md`.