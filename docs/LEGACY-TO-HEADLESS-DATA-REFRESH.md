# Legacy to Headless WordPress Data Refresh

**Status:** Rehearsal complete; production cutover planning
**Created:** August 20, 2026
**Source:** Legacy live WordPress on SpinupWP
**Target:** Headless WordPress on Kinsta
**Rule:** No production data changes until a rehearsed merge and rollback test are approved

## Decision

Do not overwrite the Headless database with a Legacy export. The November 2025 copy was a shared
starting point, but both systems have accepted changes since then. Refresh the data through a
selective content ETL performed first in an isolated Kinsta environment.

The Legacy database is a read-only source, not a database restore candidate. Only explicitly
allowlisted business records and fields may cross the boundary. The importer extracts source data,
converts it to the Headless content model, rejects contamination, and writes through supported
WordPress APIs. It must not copy Legacy tables or rows wholesale.

The February 2026 full-overwrite proposal in `DATABASE-SYNC-STAGING.md` is retained only as history.
Repository history documents the completed November migration as DDEV to Kinsta with WP-CLI
serialized replacements and a separate media transfer; no execution record was found for the
February refresh proposal.

## Refresh Objective and Baseline

The refresh is limited to business-data changes since the original November 2025 Headless seed:

1. Legacy-only WooCommerce orders (sales).
2. Legacy-only products and variations required by the storefront.
3. Approved price changes for existing SKUs.
4. New or changed approved product documents.

Use `2025-11-01 00:00:00` as the conservative discovery cutoff. The repository proves that the
shared copy occurred in November 2025 and was complete by November 29, but it does not preserve the
exact source snapshot timestamp. The cutoff therefore selects candidates; it does not prove that a
record is absent from Headless or authorize a write. Determine the actual delta by comparing both
systems with stable keys and field/file hashes.

Existing Headless records win unless an approved field-level rule says otherwise. Do not refresh
pages, posts, navigation, layout, styling, themes, plugins, options, or general media. No candidate
outside the four business-data stages above may enter the production package.

## Non-Negotiable Controls

1. Never import the Legacy SQL dump directly into the active Headless database.
2. Never run migration commands first on either live environment.
3. Take database and uploads backups of both systems and test restoring the target backup.
4. Keep source IDs as provenance only; merge by stable business keys.
5. Produce machine-readable before/after manifests and a conflict report.
6. Preserve Headless security metadata and environment-specific configuration.
7. Treat uploads as a separate migration with collision and checksum reporting.
8. Use a short Legacy content freeze only after a successful rehearsal.
9. Never copy Legacy plugins, themes, MU plugins, drop-ins, `wp-config.php`, cron events, snippets,
   plugin tables, plugin options, or generated/cache directories.
10. Never import Visual Composer/WPBakery shortcodes, metadata, templates, CSS, JavaScript, caches,
    or upload artifacts. A contaminated record fails closed until converted to clean content.

## Headless Content Boundary

The Headless WordPress installation remains the content system. Its runtime is managed separately
through the repository and Kinsta. The Legacy plugin stack is inventory evidence only and is never
a migration source.

### Allowed Only Through an Explicit Mapping

- Approved WordPress post fields for an allowlisted post type.
- Approved WooCommerce product and variation fields required by the Headless storefront.
- Approved taxonomy assignments mapped by taxonomy and slug.
- Approved ACF/custom fields mapped individually to the current Headless schema.
- Approved original media assets referenced by accepted content, after type and hash validation.
- Approved user or order business data only through a separate, reviewed migration pipeline.

### Always Rejected

- Files under `wp-content/plugins`, `wp-content/themes`, `wp-content/mu-plugins`, and drop-ins.
- Legacy plugin/theme tables and options, including serialized settings and license data.
- `wp_posts` records whose post types exist only because a Legacy plugin registered them, unless
  the business content is explicitly remodeled into a Headless-owned post type.
- Visual Composer/WPBakery shortcodes such as `[vc_*]`, `[/vc_*]`, `[wpb_*]`, and `[/wpb_*]`.
- Visual Composer/WPBakery metadata such as `_wpb_*`, `wpb_*`, `_vc_*`, and `vc_*`.
- Composer templates, generated custom CSS/JS, grid templates, and plugin cache artifacts.
- Slider Revolution, page-builder, widget, sidebar, menu-theme, and theme-mod configuration.
- Executable uploads and generated plugin directories; media migration uses an asset allowlist.

### Content Acceptance Gate

Every candidate record must pass all of these checks before import:

1. Its post type and destination model are allowlisted.
2. Its source fields are individually mapped; unmapped metadata is dropped, not copied.
3. Its content contains no Visual Composer/WPBakery or other unsupported shortcodes.
4. Its rendered HTML contains no scripts, event-handler attributes, unsafe URL schemes, or
   page-builder classes that the Headless frontend does not own.
5. Every referenced asset is approved, exists, passes file-type validation, and has a recorded hash.
6. The transformed result passes editorial preview and automated contamination scanning.

## Data Ownership Matrix

Ownership must be confirmed by the named business owner before implementation. `Merge` means the
record requires explicit conflict rules; it does not mean that all source fields win.

| Dataset | Stable key | Proposed authority | Initial rule |
|---|---|---|---|
| New products | SKU | Legacy for confirmed Legacy-only records | Insert allowlisted storefront fields only; never clone the source post or metadata set |
| New variations | Variation SKU | Legacy for confirmed Legacy-only records | Resolve parent by parent SKU; never copy numeric parent IDs |
| Prices | SKU | Legacy only for approved differences | Update only approved price fields; preserve stock and unrelated product data |
| Stock | SKU | Headless | Outside this refresh; never change with a product or price stage |
| Product categories | Taxonomy + slug | Merge | Preserve cleaned Headless hierarchy; map Legacy assignments by slug |
| Product attributes | Taxonomy + slug | Merge | Reconcile definitions before assigning terms |
| Customer-group product fields | SKU + meta key | Merge | Compare both sides; require Product owner approval for conflicts |
| Pages/posts | Post type + slug | Content ETL | Allowlisted fields only; reject page-builder contamination |
| Application notes | Post type + slug | Headless pending review | Preserve Headless CPT registration and validate content overlap |
| Service bulletins | Post type + slug | Headless | Preserve CPT, taxonomy, content, and media migrated August 2026 |
| Media attachments | Relative upload path + hash | Content ETL | Import only approved referenced originals; never bulk-copy uploads |
| Users | Normalized email | Merge | Preserve Headless ID and security metadata; add/update approved profile fields |
| Favorites | User email + `bapi_favorites` | Headless | Never overwrite from Legacy |
| 2FA | User email + `two_factor_*` | Headless | Never overwrite; encryption key must remain unchanged |
| Orders | Order number, then source ID | Legacy pending review | Detect HPOS first; migrate as a relational dataset |
| Quotes/account activity | Business identifier | Merge | Inventory storage and owner before deciding |
| WordPress options | Option name | Headless | No Legacy options migrate |
| Plugin/theme settings | Option name | Headless | No Legacy plugin or theme settings migrate |
| Sessions/tokens/transients | N/A | Neither | Do not migrate; clear only as an approved cutover action |
| MU plugins and `wp-config.php` | File/config key | Headless | Deploy from repository and Kinsta configuration, never from Legacy DB/files |
| Legacy plugin files/tables/data | N/A | Rejected | Inventory only; never migrate |
| Visual Composer/WPBakery data | N/A | Rejected | Convert content to clean Headless-owned HTML/fields or exclude it |

## Phase 0: Read-Only Discovery

Run the repository inventory script independently on each WordPress host. It reads WordPress and
MySQL metadata but does not export secrets or change data.

```bash
# Legacy host
bash scripts/inventory-wordpress-migration.sh \
  --label legacy \
  --path /sites/www.bapihvac.com/files

# Kinsta host (use the actual public directory shown by MyKinsta)
bash scripts/inventory-wordpress-migration.sh \
  --label headless \
  --path /www/[KINSTA_SITE]/public
```

Each run creates a timestamped directory under `migration-inventory/`. Keep these reports outside
Git because they describe production data. Transfer them through the approved secure channel.

### Phase 0 Findings — August 20, 2026

The first inventory comparison supports a narrow delta migration, not a general content refresh.

| Area | Evidence | Disposition |
|---|---|---|
| Catalog identity | Both systems contain the same 5,576 unique usable SKU values; neither has a SKU absent from the other | No new SKU-addressable product was present in the August 20 snapshots |
| Duplicate SKUs | 52 duplicate usable SKU groups exist on both systems | Require an exception key for affected records |
| Orders | 689 keys only on Legacy and 3 only on Headless; 667 Legacy-only orders modified after November 1, 2025 | Separate WooCommerce order ETL and reconciliation |
| Users | 188 unique email hashes only on Legacy; 183 registered after November 1, 2025 | Migrate only accounts required by approved order/account behavior |
| Product changes | 9 products and 14 variations have newer Legacy timestamps | Compare approved fields by SKU; never copy post rows or all metadata |
| ETA catalog update | Repository log confirms 73 price updates were applied to Legacy only on June 23, 2026; 26 requested SKUs were not found | Legacy is authoritative only for the 73 confirmed successful SKU updates; use a dedicated price importer |
| Product documents | Repository log records revised ETA PDFs and ACF document updates | Map approved document fields and referenced attachments only |
| Legacy-only uploads | 2,430 paths total; 2,361 modified after November 1, 2025 | Do not bulk-copy uploads |
| PDF/image candidates | 1,022 post-November paths; 770 look like generated image derivatives and 252 look like originals | Resolve attachment references; import approved originals only |
| Same-path media changes | 3,925 shared paths have different byte sizes | Hash and review; never overwrite by path alone |
| Editorial candidates | One Application Note (`thermowells-explained`) and one news post about the Da Nang facility | Editorial review, clean-content scan, then explicit import decision |
| Service Bulletins | Legacy uses plugin-defined `service-bulletin`; Headless uses `service_bulletin` and the two bulletins were already remodeled | Preserve Headless records; do not import Legacy CPT data |
| Plugin/development content | Four `job-estimate` records and `development-ins` are Legacy-only after the baseline | Reject by default |
| Extensions | Legacy and Headless plugin/MU-plugin stacks are substantially different | No Legacy code, settings, tables, or generated artifacts migrate |

These findings do not prove product-field equality. WooCommerce metadata changes may not update the
post modification timestamp, so a field-level hash comparison remains mandatory.

### New Product Authority

A post-November timestamp is candidate evidence only. A product or variation is eligible for the
new-product stage only when its unique nonblank SKU is absent from Headless and Product approves it.
For every eligible record:

- Resolve variation parents, categories, and attributes by approved stable keys, never numeric IDs.
- Map only the reviewed product, commerce, taxonomy, attribute, image, and document fields required
  by the Headless storefront. Unmapped fields are rejected.
- Sanitize descriptions and reject Visual Composer/WPBakery shortcodes, metadata, classes, generated
  CSS/JavaScript, templates, and assets rather than attempting to preserve the Legacy design.
- Reject plugin-defined fields or dependencies unless the business value has an explicit mapping
  into a Headless-owned field.
- Import only approved referenced original media after file-type validation and SHA-256 review.
- Produce a preview plus insert/reject/conflict report and obtain Product/Content approval.

An SKU already present in Headless is not a new product. Differences on existing products remain
review-only unless separately authorized as a named field-level update.

The exact August 20 manifest comparison found 5,702 product/variation rows on each system and zero
Legacy-only nonblank SKUs. Of 24 Legacy rows modified on or after the discovery cutoff, all 20 with
usable SKUs already exist in Headless; the remaining four have blank SKUs and are ineligible for
automatic import. A fresh frozen-source comparison must repeat this check. If it remains unchanged,
the production `new-products` stage is an approved zero-write stage, not an importer operation.

### ETA Price Authority

The June 23, 2026 ETA price update is a known intentional Legacy-only change. For this batch:

- `scripts/update-eta-prices-legacy.sh` is the reviewed source list.
- Only the 73 SKUs recorded as successfully updated are eligible for a Legacy-to-Headless price
  change; the 26 not-found SKUs are exceptions, not insert candidates.
- The importer may update only `_regular_price` and the active `_price` value according to the same
  sale-price rule used by the original script.
- Product rows, descriptions, status, stock, customer groups, variations, and unrelated metadata
  must not be copied with the price update.
- Every proposed before/after price change requires a dry-run report and Product/Sales approval.
- Price differences outside this confirmed batch remain review-only until another source-of-truth
  change record is identified.

The read-only page-builder scan found:

- 110 current Legacy pages with Visual Composer/WPBakery markers: 66 published, 43 drafts, and one
  private page.
- 756 contaminated revisions and one `vc_grid_item` record.
- 443 records carrying `_wpb_shortcodes_custom_css`, plus other `vc`/`wpb` metadata keys.
- 38 builder-related option names, 15 builder-related tables, and 1,342 builder-generated upload
  files.
- No builder markers in the narrowed editorial candidates: `thermowells-explained`, the Da Nang
  news post, either Service Bulletin, or `development-ins`.

The clean scan result for a candidate does not authorize import. It only clears the page-builder
gate; post-type ownership, field mapping, HTML sanitization, and editorial approval still apply.

### Approved-Field Dry Run — August 21, 2026

The local rehearsal package was generated from the captured, read-only Legacy and Headless reports:

- ETA prices: 99 scripted attempts resolve to 73 unique candidate updates and 26 source-missing
  rejections. No ETA candidate has a duplicate SKU.
- Inventory: zero approved-field hash differences; inventory is excluded from the ETL.
- Customer groups: 67 hash differences; all are excluded because Headless owns access control.
- Product documents: the corrected parent-product scan approved nine additions and 49 same-path
  replacements. Fifty-three newly discovered differences remain excluded pending separate review.
- Product-document mappings: 17 resolved heading/path pairs were added across 14 parent products.
  Existing Headless mappings were preserved; no document metadata was deleted or replaced wholesale.
- Broken document reference: `Wireless_QuantumSlim-v17.pdf` is missing on both systems and must be
  repaired or explicitly excluded.
- Variation document metadata: excluded. Shared product documents belong on parent products.
- Orders: the August 21 refresh found 669 Legacy candidates since November 1, 2025: 358 processing,
  308 pending, and three failed. This is one processing order newer than the original 668-row dry
  run, so order apply requires a fresh final export and reconciliation.
- Order accounts: 216 orders can link to an existing Headless user by normalized-email hash, 123
  reference a Legacy account not present on Headless, and 330 are guest orders.
- WordPress `post_author` is not a customer key for these orders and will not be migrated.

Approved policy decisions on August 21, 2026:

- Import the 123 Legacy-account orders as guest orders without creating Headless accounts.
- Preserve all 330 existing guest orders as guests.
- Include the three failed orders with their source status unchanged.
- Approve nine PDF additions and 49 replacements subject to per-file SHA-256 verification.
- Keep `PMPB5_TS1_ETA.pdf` and `PS17RF_ETA.pdf` excluded because their Legacy references exist only
  on product variations. They were removed from the rehearsal clone after discovery.
- Exclude `Wireless_QuantumSlim-v17.pdf` until the source file is recovered.
- Continue to exclude customer groups and all plugin/page-builder surfaces.

The machine-readable policy is `scripts/wordpress-rehearsal-policy.json`.

Generated reports live under the ignored `migration-inventory/rehearsal-20260821/` directory. They
contain hashes and migration dispositions, not customer email addresses or plugin data.

### Clone Rehearsal Evidence — August 21-24, 2026

- Created the disposable Kinsta Standard environment `refresh0826` from Live and captured a baseline
  with zero SKU, user, content-key, taxonomy-key, or upload-size differences.
- Created the manual Kinsta backup `Pre-ETL baseline 2026-08-21`.
- Installed a clone-bound isolation guard: WordPress reports staging, cron is disabled, outbound
  HTTP and mail are blocked, and no payment gateways are available.
- Applied 73 ETA price changes; the second run reported 73 unchanged, 26 rejected, and zero conflicts.
- Applied 58 approved PDF actions and 17 additive parent-product mappings. The corrected second run
  reported 58 files unchanged, 17 mappings unchanged, one missing PDF rejected, and zero conflicts.
- Post-apply reconciliation found zero selected-PDF hash mismatches, zero missing mapping pairs, zero
  inventory/customer-group changes, and no order changes before the order stage.
- Captured a fresh 669-order manifest immediately before export; it matched the reviewed v7 manifest
  byte-for-byte. The accepted JSONL payload contained 669 unique order keys and was pinned by
  SHA-256 before transfer.
- The order dry run proposed 669 inserts and zero conflicts. One duplicate target SKU was resolved
  only because exactly one target product title matched the source line name; no source numeric ID
  crossed environments.
- Applied 669 orders in one database transaction on `refresh0826`: 358 processing, 308 pending, and
  three failed. Two hundred sixteen linked to existing Headless users and 453 remained guests.
- The second order dry run reported zero inserts, 669 unchanged, and zero conflicts. Reconciliation
  found 902 product lines, 669 shipping rows, 669 fees, 20 tax rows, all 1,673 source notes, and zero
  duplicate order keys.
- All 5,446 users and protected usermeta were unchanged. Product prices, inventory, customer groups,
  product-document metadata, resolved mappings, and selected PDF hashes were unchanged from the
  final document baseline.
- Mail, outbound HTTP, webhooks, payments, cron, and Action Scheduler remained blocked after apply;
  no payment gateways were available.
- No Legacy plugins, themes, options, builder metadata/files, generated media, or variation-level
  document metadata crossed into the clone.
- After baseline restore, a dedicated clone-only account passed login, `/api/auth/me`, account
  access, favorites persistence and cleanup, and empty order-history checks. Imported-order UI
  evidence was accepted from the exact pre-restore reconciliation. The missing `twoFactorEnabled`
  response field was classified as a separate application contract issue; protected 2FA metadata
  remained unchanged.
- The restore returned stable business data to its pre-ETL state and removed all 669 rehearsed
  orders. The clone isolation marker and guard were then reinstalled.

### Discovery Exit Criteria

- Both reports complete without an `ERROR` line.
- WordPress table prefixes and WooCommerce HPOS status are known.
- Product and variation SKU duplicates are identified.
- Post types and taxonomies present on only one side are explained.
- Headless protected usermeta counts are captured.
- Order storage and counts are reconciled.
- Plugin, MU-plugin, and option-presence differences are reviewed.
- Visual Composer/WPBakery contamination counts and affected record keys are reported.
- Legacy plugin-generated post types and upload directories are classified as reject or remodel.
- Product, Customer Service, Sales, and Engineering approve the ownership matrix.

## Phase 1: Isolated Rehearsal Environment

1. Create a fresh, disposable Kinsta environment cloned from the current Headless backend.
2. Record the clone timestamp and disable outgoing email, webhooks, payment capture, scheduled jobs,
   analytics, and external order integrations.
3. Restore-test the clone's database backup before migration work begins.
4. Load the Legacy export into a separate, network-restricted temporary database with read-only
  importer credentials; do not replace or connect it as the clone's WordPress database.
5. Inventory Legacy uploads in place. Copy only importer-approved candidate assets to quarantine,
  never the complete uploads tree and never directly into Headless uploads.
6. Generate row-level comparison and contamination reports from the two databases.

## Phase 2: Reconciliation Design

The ETL implementation must be idempotent: rerunning it with the same inputs produces no further
changes. Every proposed write must be classified as `insert`, `update`, `unchanged`, `conflict`, or
`rejected` before apply mode is enabled.

Required conflict rules:

- Products and variations map by SKU; blank or duplicate SKUs are manual exceptions.
- New-product candidates must be absent from Headless by unique SKU; existing SKUs are never
  overwritten by the new-product stage.
- Users map by normalized email and retain their Headless IDs.
- Posts map by post type and slug; content conflicts require editorial review.
- Terms map by taxonomy and slug; numeric IDs never cross environments.
- Media maps by relative path and SHA-256 hash.
- Orders are migrated only after HPOS/storage compatibility is proven.
- Legacy options, plugin metadata, and plugin-generated files have no import mode.
- Source content is scanned before and after transformation for Visual Composer/WPBakery markers.
- The importer writes mapped values through WordPress APIs; direct table-copy operations are banned.

## Phase 3: Rehearsal and Validation

Run the merge against the disposable clone, then verify:

- Product, variation, user, order, content, taxonomy, and media reconciliation totals.
- Every approved new product/variation appears once by SKU and every pre-existing SKU is unchanged
  outside separately approved price or document fields.
- GraphQL schema and representative product/content queries.
- Guest and customer-group product visibility.
- Existing user login, token refresh, 2FA, and favorites.
- Product configuration, pricing, documents, images, cart, checkout, and order creation.
- Service Bulletins and Application Notes directory/detail pages.
- SMTP remains sandboxed and no external webhook or payment was sent.
- Redis, GraphQL Smart Cache, Next.js revalidation, and CDN caches can be safely cleared.
- Database-only rollback restores the exact pre-rehearsal manifest.

All unresolved conflicts must have an owner and disposition. A successful page load is not a data
reconciliation test.

## Phase 4: Cutover

The timed execution, approval, side-effect, and rollback gates are defined in
`WORDPRESS-DATA-REFRESH-PRODUCTION-CUTOVER.md`. The current importer is rehearsal-only and must not
be modified ad hoc or run against active Headless.

1. Announce a short Legacy editing and commerce freeze appropriate to the approved order strategy.
2. Capture final Legacy database and uploads snapshots.
3. Generate and review the delta from the rehearsed snapshot.
4. Back up the active Headless database and uploads; record restore identifiers.
5. Run the separately reviewed production runner that preserves the rehearsed transformations and
  reconciliation behavior while enforcing production-only target and approval controls. Never
  adapt or bypass the clone-only runner during cutover.
6. Copy only approved missing/changed media and verify hashes.
7. Run automated reconciliation and the critical-path smoke suite.
8. Clear/rebuild caches and trigger required Next.js revalidation.
9. Obtain business sign-off before lifting the freeze.
10. Retain backups and reports according to the agreed rollback window, then securely delete dumps.

## Stop Conditions

Stop and restore or investigate when any of these occur:

- A script proposes deleting Headless-owned records.
- Duplicate or blank SKUs prevent deterministic product matching.
- User matching would replace a Headless user ID or protected usermeta.
- 2FA encryption configuration differs or encrypted values fail validation.
- Order storage mode differs without a tested conversion path.
- Media collisions cannot be explained.
- A candidate contains Visual Composer/WPBakery shortcodes, metadata, classes, or generated assets.
- A candidate depends on a Legacy plugin-defined post type or field without an approved remodel.
- A proposed operation copies a Legacy table, option, plugin/theme file, or uploads directory.
- Reconciliation totals differ from the approved plan.
- Any external email, payment, webhook, or order integration fires during rehearsal.

## Required Deliverables

- [x] Legacy and Headless Phase 0 inventory bundles
- [ ] Approved ownership matrix
- [x] Field-level product and user merge rules proposed
- [ ] Order/HPOS migration decision
- [x] Media collision report
- [x] Visual Composer/WPBakery contamination and disposition report
- [ ] Approved post-type and field allowlist
- [ ] Legacy plugin-generated content reject/remodel list
- [x] Dry-run reconciliation report
- [ ] Versioned, reviewed, idempotent content ETL
- [x] Rehearsal test evidence and technical disposition
- [ ] Named business and release sign-off
- [x] Draft timed cutover and rollback plan
- [ ] Post-cutover reconciliation report

## Immediate Next Step

Obtain Customer Service/Finance, Product, and technical approval for the restricted August 26
order-metadata disposition matrix. It proposes four business order-field mappings, 87 line-item
configuration mappings, and explicit rejection of all remaining review keys, including plugin and
payment state. The 669-order inventory is mapping evidence only; repeat it against the exact fresh
frozen-source manifest before final approval. In parallel, assign the named cutover owners and
schedule the freeze. Only after the metadata gate is approved should a separate production runner
and temporary side-effect guard be designed, reviewed, and rehearsed on a fresh disposable clone.

Do not export full databases, migrate plugin data, or copy upload directories.
