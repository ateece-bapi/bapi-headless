# WordPress Data Refresh Production Cutover

**Status:** Cutover planning authorized; production apply not authorized
**Planning decision:** August 24, 2026
**Source:** Legacy WordPress on SpinupWP
**Target:** Active Headless WordPress on Kinsta

This run sheet turns the completed `refresh0826` rehearsal into a controlled production plan. It
does not authorize a production write. The release manager must record a final GO only after every
required approval and precondition below is complete.

The operating model is a soft freeze with automated hash-based monitoring and independently
approved catch-up batches, followed by a short final freeze. Manual observation is not monitoring
evidence and cannot authorize a batch or advance its accepted baseline.

## Scope Boundary

The only eligible changes are:

- approved ETA price fields for reviewed SKUs;
- approved product-document files and additive parent-product mappings; and
- approved Legacy-only WooCommerce orders.

No new product or variation is currently approved. A catch-up batch must preserve the zero-write
product policy; a future product scope would require separate rehearsal and approval.

Use `2025-11-01 00:00:00` as a conservative candidate-discovery cutoff, not as proof that a record
is missing from Headless. Confirm the delta by unique SKU, order identity, explicit document
mapping, and field/file hashes against the current Headless state.

The cutover must not transfer Legacy plugins, themes, MU plugins, drop-ins, options, plugin tables,
Visual Composer/WPBakery data or files, generated builder media, customer groups, inventory,
variation-level product documents, users, passwords, tokens, sessions, or 2FA secrets.

No SQL database overwrite, broad uploads copy, or direct table-copy operation is permitted.

## Rehearsal Sign-Off

| Gate | Disposition | Evidence |
|---|---|---|
| New-product stage | Current evidence: zero candidates | August 20 manifests have identical 5,576-SKU sets; final frozen-source comparison still required |
| ETA stage | Pass | 73 updates; rerun produced zero writes |
| Product-document stage | Pass | 58 file actions and 17 mappings; hashes reconciled; rerun produced zero writes |
| Order stage | Pass | Production-contract rehearsal applied 684 orders; exact rerun reported 684 unchanged and zero conflicts |
| Excluded surfaces | Pass | No Legacy plugin, theme, option, builder, generated-media, customer-group, inventory, or user import |
| Public application smoke | Pass | GraphQL, products, documents, cart, shipping validation, and checkout entry |
| Authenticated smoke | Pass with exception | Login, account, favorites persistence/cleanup, and empty order history passed |
| Imported-order UI | Accepted from pre-restore evidence | Exact order reconciliation passed before the required baseline restore removed rehearsal orders |
| 2FA UI status | Separate application issue | `/api/auth/me` omits the field expected by the dashboard; protected 2FA metadata remained unchanged |
| Rollback | Pass | Earlier baseline rehearsal removed all 669 imported orders and restored stable business data exactly; the separate 684-order production-contract rehearsal passed transactional rollback probes and exact idempotency reconciliation |

The imported-order UI evidence is accepted for planning because relational reconciliation was exact
before restore. The 2FA response-shape issue does not authorize changing 2FA data and does not waive
the production requirement that protected usermeta and encryption configuration remain unchanged.

## Required Approvals

| Approval | Owner | Status |
|---|---|---|
| Technical rehearsal and rollback evidence | Andrew | Pending final signature |
| New-product zero-write policy | Andrew | Approved August 27, 2026; final frozen-source SKU comparison required |
| Rehearsed 73-SKU ETA price scope | Andrew | Approved August 27, 2026; final frozen-source delta required |
| Final order count, statuses, and account-linking totals | Customer Service/Finance | Pending final export |
| Order metadata mappings and exclusions | Andrew | Approved August 27, 2026; final frozen-source inventory required |
| Rehearsed 58 document actions and 17 additive mappings | Andrew | Approved August 27, 2026; final frozen-source hashes required |
| Soft-freeze start and final-freeze window | Business owner | Pending schedule |
| Kinsta backup and restore operator | Andrew | Assigned |
| Production execution and stop authority | Andrew | Assigned |
| Final production apply | Release manager plus business owner | **Not approved** |

## Production Preconditions

- [x] Merge the rehearsal scripts, policy, and runbooks through the required branch and PR review.
- [x] Create a separately guarded production runner. The rehearsal defaults remain clone-only;
      it rejects the active hostname and requires the clone marker by design.
- [x] Require an exact active-target hostname allowlist, a production-only marker, and a distinct
      apply confirmation such as `BAPI_PRODUCTION_APPLY=YES` in the production runner.
- [x] Add a temporary production side-effect guard for imported orders. It suppresses
      customer/admin mail, outbound webhooks, payment actions, exports, and queued order automation
      during apply without importing or replacing any Legacy plugin data. Final acceptance remains
      conditional on fresh-clone testing and PR review.
- [x] Rehearse the production runner and side-effect guard on a fresh disposable clone.
- [ ] Start the soft freeze: prohibit ETA, product/SKU, and product-document edits while allowing
      normal Legacy order entry and approved order corrections.
- [ ] Capture fresh Legacy and active Headless inventories and establish the first accepted Legacy
      monitoring baseline.
- [ ] Identify post-November product/variation candidates and prove each approved insert is absent
      from Headless by a unique nonblank SKU. Existing SKUs are not eligible for this stage.
- [ ] Approve every new-product destination field, taxonomy/attribute mapping, referenced original
      media hash, sanitized-content preview, and explicit rejection. Unmapped metadata is dropped.
- [ ] Rehearse the new-product stage on a fresh disposable clone and prove pre-existing products,
      stock, customer groups, design, plugins, themes, options, and unrelated media are unchanged.
- [ ] Run automated Legacy scans on the agreed schedule and after each operational event. Compare
      every scan with the last accepted baseline using the hash monitor below.
- [ ] Generate a fresh approved-field package and order payload for each closed catch-up batch.
- [ ] Confirm the final order manifest contains a fresh `source_state_hash` for every order. The
      exporter must recompute the hash across the complete source order, postmeta, items/itemmeta,
      notes/commentmeta, and resolved line SKUs before and after extracting the approved transfer allowlist.
- [ ] Capture a key-only inventory of order and line-item metadata for the exact final order set.
      Explicitly map required variation/configuration fields and reject all plugin-owned or
      unapproved metadata; no metadata may be silently assumed transferable.
- [ ] Review and pin new policy and payload SHA-256 values. The rehearsal hashes and fixed count of
      684 orders cannot authorize a later production payload.
- [ ] Confirm both systems still use the rehearsed classic WooCommerce order storage.
- [ ] Confirm zero proposed writes outside the allowlist and zero Visual Composer/WPBakery matches
      in every candidate record and asset.
- [ ] Create Kinsta database and files backups of active Headless and record their identifiers.
- [ ] Verify the assigned operator can start the restore without waiting for new access.
- [ ] Define the monitoring schedule, catch-up cadence, short final-freeze window, customer
      communication, maintenance behavior, and rollback deadline.

### Order Metadata Inventory Gate

Before designing the production order mapping, run the key-only inventory against the exact fresh
order manifest on Legacy WordPress:

```bash
wp eval-file scripts/inventory-wordpress-order-metadata.php \
      /secure/final-order-dry-run.tsv \
      /secure/final-order-metadata-inventory \
      --path=/sites/www.bapihvac.com/files
```

The scanner is read-only and requires the Legacy hostname, loaded WooCommerce, classic order
storage, a new output directory, and a one-to-one source order resolution for every manifest row.
It outputs aggregate schema labels and counts only; metadata values, order IDs, known customer
identity fields, and samples are excluded. Treat the permission-restricted report as sensitive:
custom schema labels can contain unexpected dynamic text, and labels that fail the scanner's
conservative structural checks stop the inventory rather than being written.

Review both TSV files and explicitly disposition every `review-required` and
`plugin-pattern-review` key. A key classification is inventory evidence, not transfer approval.
Required variation/configuration data must receive a field-by-field destination mapping and test;
plugin-owned, sensitive, derived, and source-ID fields must remain excluded. Any unresolved key is
an automatic NO-GO for the order stage.

The August 26 rehearsal-manifest inventory resolved all 669 expected orders and reported 79 order
metadata keys plus 114 order-item key/type combinations. The restricted draft disposition matrix
proposes explicit mappings for four business order fields and 87 line-item configuration keys, and
explicit exclusions for the remaining 31 order review keys and two order-item review keys. This is
mapping evidence only. Andrew approved the proposed policy on August 27, 2026; production still
requires a new inventory that matches the approved policy for the fresh frozen-source manifest.

## Automated Catch-Up Monitor

Use one immutable `--since` floor for every Legacy monitoring scan. Do not advance this query floor:
the full overlap is intentional and allows a later scan to detect changes to any previously selected
order. The accepted cursor is the complete reconciled baseline scan directory and its
`captured_at_utc`, not a date-only filter.

```bash
bash scripts/scan-wordpress-approved-deltas.sh \
      --label legacy-production \
      --path /sites/www.bapihvac.com/files \
      --since '2025-11-01 00:00:00' \
      --output-dir /secure/data-refresh-scans

php scripts/compare-wordpress-approved-scans.php \
      --baseline /secure/data-refresh-scans/<last-accepted-scan> \
      --current /secure/data-refresh-scans/<new-scan> \
      --output /secure/data-refresh-ledgers/<batch-id>.json
```

The comparator validates exact report schemas and unique catalog/order keys, compares full order
`source_state_hash` values, and compares catalog, document mapping, document reference, and media
file hashes. Its machine-readable result and process exit code are:

| Exit | Status | Required action |
|---|---|---|
| `0` | `clean` | No source change; retain the ledger and keep the existing accepted baseline |
| `10` | `catch-up-required` | New or modified orders exist; build a new independently approved batch |
| `20` | `no-go` | A source order disappeared, a frozen catalog/document surface changed, or an excluded inventory/customer-group hash changed; investigate and do not apply |
| `2` | Input failure | Scan is incomplete, malformed, mismatched, ambiguous, or would overwrite evidence; investigate and do not apply |

Run the scan and comparator from a scheduler that records command status and alerts on every
nonzero exit. An operator reading timestamps, order counts, or WordPress screens is not an
acceptable substitute. Keep scan directories and ledgers owner-only and immutable after capture.

For each `catch-up-required` result:

1. Assign a unique batch ID and retain the baseline scan, current scan, and decision ledger.
2. Capture a fresh active-Headless approved-delta scan.
3. Build a new package and order payload from the current Legacy scan. Rehearsal package hashes,
       counts, policies, and payloads do not authorize this batch.
4. Record fresh source scan, target scan, package, policy, and payload SHA-256 values.
5. Review the added and modified order hashes, metadata inventory, exclusions, and target conflicts.
6. Dry-run, record GO, apply the order stage, and reconcile exact after-state and zero-write rerun.
7. Capture another Legacy scan. If it contains a later change, leave the current baseline in place
       and process another batch.
8. Only after the batch reconciles with zero conflicts, designate its current Legacy scan as the
       accepted baseline. Never advance the baseline for a failed, partial, or unapproved batch.

## Cutover Schedule

Replace every placeholder before final approval.

| Time | Action | Owner | Evidence |
|---|---|---|---|
| T-5 business days | Merge reviewed tooling and complete fresh-clone proof | Andrew | PR and clone report |
| T-2 business days | Confirm owners, communications, and restore access | Andrew | Completed approval table |
| T-5 business days | Start soft freeze and automated monitoring | `<business owner>` / Andrew | Notice, baseline scan, scheduler evidence |
| Daily or agreed cadence | Scan, compare, and close independently approved catch-up batches | Andrew plus reviewers | Batch ledgers and reconciliations |
| T-1 business day | Confirm final-freeze owners, communications, and restore access | Andrew | Completed approval table |
| T-0 | Start short final freeze of all relevant Legacy writes | `<business owner>` | Freeze notice and UTC timestamp |
| T+15 min | Capture final Legacy scan, active Headless scan, and Kinsta backups | Andrew | Scan paths and backup IDs |
| T+30 min | Compare, build/hash any final batch, and run dry-run | Andrew plus reviewers | Decision ledger and zero-conflict logs |
| Approval gate | Record GO or NO-GO for the final batch | Release manager plus `<business owner>` | Written decision |
| After GO | Apply and reconcile the final batch; rescan until clean | Andrew | Stage logs, manifests, clean ledger |
| Final gate | Move authority to Headless and lift freeze, or start rollback | Andrew | Written decision and UTC timestamp |

## Execution Sequence

1. Start the soft freeze and automated monitor. Record the immutable query floor, baseline scan,
   cadence, scheduler, alert destination, and owners.
2. Process catch-up batches using the protocol above while Legacy order entry remains open.
3. Start the approved short final freeze. Pause all relevant Legacy writes and record UTC time.
4. Capture final Legacy database/uploads snapshots and read-only inventories.
5. Capture active Headless database/uploads backups and before-state inventories.
6. Enable the reviewed production side-effect guard and prove mail, webhooks, payment actions,
      exports, and queued order automation are suppressed. Stop all external cron/Action Scheduler
      workers first; the runner requires zero running actions and zero claims and verifies the complete
      scheduler state inside each transaction.
7. Run the final source comparison. A `no-go` or input failure stops cutover. Build and hash a fresh
      final package if the result is `catch-up-required`.
8. Review the exact order/order-item metadata-key inventory. Any required field without an explicit
      mapping, or any plugin-owned metadata proposed for transfer, is an automatic NO-GO.
9. Run contamination scans in fail-on-findings mode. Any plugin, builder, generated-media, or
      unapproved-field candidate is an automatic NO-GO.
10. Run production dry runs in this order: `eta-prices`, `product-documents`, then `orders`. The
      new-product stage must remain zero-write.
11. Compare dry-run totals to the newly approved policy. Any conflict or unexplained delta is NO-GO.
12. Record the final GO from the release manager and business owner.
13. Apply `eta-prices`; reconcile prices and prove inventory/customer groups are unchanged.
14. Apply `product-documents`; verify every destination hash and additive mapping.
      This stage additionally requires an owner-only `BAPI_PRODUCTION_FILESYSTEM_LOCK` file with the
      exact approved marker text, an exclusive lock acquired by the runner, and a maintenance window
      in which no other process may mutate the approved quarantine or uploads paths.
15. Apply `orders`; reconcile orders, lines, shipping, fees, taxes, notes, statuses, and user links.
16. Rerun all stages. They must propose zero additional writes and zero conflicts.
17. Capture another Legacy scan and compare it with the final package scan. Repeat the final batch
    until the result is `clean`; do not lift the final freeze while any delta remains.
18. Verify protected usermeta, users, plugins, themes, options, tables, taxonomies, and excluded
    business fields remain unchanged.
19. Confirm the side-effect guard produced no mail, webhook, payment, export, or queued-job leak.
20. Clear only approved caches, trigger required Next.js revalidation, and run critical-path smoke.
21. Move write authority to Headless. Remove the temporary side-effect guard only after
    reconciliation passes. Confirm normal runtime
    integrations are healthy without replaying imported-order events.
22. Obtain business sign-off, lift the final freeze, and record the UTC completion time.

The exact production commands belong in the reviewed production-runner PR. Do not adapt or bypass
the clone-only checks in `run-wordpress-rehearsal-etl.php` during the cutover window.

## GO Criteria

- All required approvals have a named owner and recorded decision.
- Fresh policy, manifests, media, and order payload hashes are approved.
- Every approved new-product and variation SKU is absent from the pre-cutover Headless inventory,
  has a complete destination-field mapping, and passed clean-content preview on a fresh clone.
- Kinsta database and files backup identifiers are recorded and restorable.
- Dry runs report only approved writes, expected rejections, zero conflicts, and zero deletions.
- Every monitoring interval has a retained machine-readable ledger, and every applied batch has a
      fresh hash-pinned policy/payload plus exact reconciliation evidence.
- The final frozen-source comparison converges to `clean` before authority moves to Headless.
- Candidate contamination scans report no Legacy plugin or Visual Composer/WPBakery transfer.
- Production side effects are demonstrably suppressed for the import window.
- The rollback operator, release manager, and business owner are present.

## NO-GO and Rollback Triggers

Stop before apply for any failed GO criterion. Stop after apply and assess rollback when:

- a stage writes or proposes an unapproved field, record, file, deletion, or count;
- any plugin, theme, option, table, builder data/file, or generated media crosses the boundary;
- duplicate keys cannot be resolved by the approved deterministic rule;
- user IDs, protected usermeta, customer groups, inventory, or 2FA data change;
- file hashes, order relationships, statuses, totals, lines, or notes fail reconciliation;
- any customer email, webhook, payment, export, or queued integration fires; or
- any scheduler claim/action state changes, the filesystem lock cannot be acquired, or an approved
      package/upload path is symlinked, insecurely owned, or changes during apply; or
- GraphQL, authentication, product, document, cart, checkout, or account smoke checks regress.

## Rollback Procedure

1. Keep the final Legacy freeze active and disable public writes to active Headless.
2. Preserve failed-run logs and after-state inventories outside the restore target.
3. Restore both the recorded pre-cutover Kinsta database and files backups.
4. Clear runtime caches and revalidate the frontend against the restored backend.
5. Rerun baseline inventory, approved-field, protected-usermeta, media-hash, and order-count checks.
6. Confirm GraphQL, authentication, products, documents, cart, checkout, and account paths.
7. Re-enable runtime integrations only after the restored baseline is verified.
8. Record the incident disposition before lifting the Legacy freeze or scheduling another attempt.

## Post-Cutover Evidence

- [ ] Final source and target inventory identifiers
- [ ] Soft-freeze baseline, scheduled-monitor evidence, and all catch-up decision ledgers
- [ ] Accepted-baseline advancement record for every reconciled catch-up batch
- [ ] Approved policy and payload SHA-256 values
- [ ] Kinsta pre-cutover database and files backup identifiers
- [ ] Dry-run and apply logs for all four stages
- [ ] Idempotency rerun logs
- [ ] New-product, variation, price, document, PDF, order, user, and protected-usermeta reconciliation reports
- [ ] Plugin and Visual Composer/WPBakery zero-transfer reports
- [ ] Side-effect suppression and re-enable evidence
- [ ] Application smoke results
- [ ] Business sign-off and freeze-lift timestamp
- [ ] Backup retention and secure evidence-deletion dates
