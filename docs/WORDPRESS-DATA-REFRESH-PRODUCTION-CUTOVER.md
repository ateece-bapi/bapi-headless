# WordPress Data Refresh Production Cutover

**Status:** Cutover planning authorized; production apply not authorized
**Planning decision:** August 24, 2026
**Source:** Legacy WordPress on SpinupWP
**Target:** Active Headless WordPress on Kinsta

This run sheet turns the completed `refresh0826` rehearsal into a controlled production plan. It
does not authorize a production write. The release manager must record a final GO only after every
required approval and precondition below is complete.

## Scope Boundary

The only eligible changes are:

- approved ETA price fields for reviewed SKUs;
- approved product-document files and additive parent-product mappings; and
- approved Legacy-only WooCommerce orders.

The cutover must not transfer Legacy plugins, themes, MU plugins, drop-ins, options, plugin tables,
Visual Composer/WPBakery data or files, generated builder media, customer groups, inventory,
variation-level product documents, users, passwords, tokens, sessions, or 2FA secrets.

No SQL database overwrite, broad uploads copy, or direct table-copy operation is permitted.

## Rehearsal Sign-Off

| Gate | Disposition | Evidence |
|---|---|---|
| ETA stage | Pass | 73 updates; rerun produced zero writes |
| Product-document stage | Pass | 58 file actions and 17 mappings; hashes reconciled; rerun produced zero writes |
| Order stage | Pass | 669 orders, 902 lines, 1,673 notes, and all relationships reconciled; rerun produced zero writes |
| Excluded surfaces | Pass | No Legacy plugin, theme, option, builder, generated-media, customer-group, inventory, or user import |
| Public application smoke | Pass | GraphQL, products, documents, cart, shipping validation, and checkout entry |
| Authenticated smoke | Pass with exception | Login, account, favorites persistence/cleanup, and empty order history passed |
| Imported-order UI | Accepted from pre-restore evidence | Exact order reconciliation passed before the required baseline restore removed rehearsal orders |
| 2FA UI status | Separate application issue | `/api/auth/me` omits the field expected by the dashboard; protected 2FA metadata remained unchanged |
| Rollback | Pass | Baseline restore removed all 669 imported orders and restored stable business data exactly |

The imported-order UI evidence is accepted for planning because relational reconciliation was exact
before restore. The 2FA response-shape issue does not authorize changing 2FA data and does not waive
the production requirement that protected usermeta and encryption configuration remain unchanged.

## Required Approvals

| Approval | Owner | Status |
|---|---|---|
| Technical rehearsal and rollback evidence | Andrew | Pending final signature |
| Final ETA SKU and price delta | Product/Sales | Pending final export |
| Final order count, statuses, and account-linking totals | Customer Service/Finance | Pending final export |
| Final product-document list and hashes | Product/Content | Pending final export |
| Legacy freeze start and end | Business owner | Blocked: approver unavailable; schedule TBD |
| Kinsta backup and restore operator | Andrew | Assigned |
| Production execution and stop authority | Andrew | Assigned |
| Final production apply | Release manager plus business owner | **Not approved** |

## Production Preconditions

- [x] Merge the rehearsal scripts, policy, and runbooks through the required branch and PR review.
- [ ] Create a separately reviewed production runner. The rehearsal runner must remain clone-only;
      it rejects the active hostname and requires the clone marker by design.
- [ ] Require an exact active-target hostname allowlist, a production-only marker, and a distinct
      apply confirmation such as `BAPI_PRODUCTION_APPLY=YES` in the production runner.
- [ ] Add a reviewed, temporary production side-effect guard for imported orders. It must suppress
      customer/admin mail, outbound webhooks, payment actions, exports, and queued order automation
      during apply without importing or replacing any Legacy plugin data.
- [ ] Rehearse the production runner and side-effect guard on a fresh disposable clone.
- [ ] Capture fresh Legacy and active Headless inventories immediately before the freeze.
- [ ] Generate a fresh approved-field package and order payload from the frozen source.
- [ ] Capture a key-only inventory of order and line-item metadata for the exact final order set.
      Explicitly map required variation/configuration fields and reject all plugin-owned or
      unapproved metadata; no metadata may be silently assumed transferable.
- [ ] Review and pin new policy and payload SHA-256 values. The rehearsal hashes and fixed count of
      669 orders cannot authorize a later production payload.
- [ ] Confirm both systems still use the rehearsed classic WooCommerce order storage.
- [ ] Confirm zero proposed writes outside the allowlist and zero Visual Composer/WPBakery matches
      in every candidate record and asset.
- [ ] Create Kinsta database and files backups of active Headless and record their identifiers.
- [ ] Verify the assigned operator can start the restore without waiting for new access.
- [ ] Define the freeze window, customer communication, maintenance behavior, and rollback deadline.

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

## Cutover Schedule

Replace every placeholder before final approval.

| Time | Action | Owner | Evidence |
|---|---|---|---|
| T-5 business days | Merge reviewed tooling and complete fresh-clone proof | Andrew | PR and clone report |
| T-2 business days | Confirm owners, communications, and restore access | Andrew | Completed approval table |
| T-1 business day | Announce Legacy editing/commerce freeze | `<business owner>` | Freeze notice |
| T-0 | Start freeze and capture final source snapshots | `<source operator>` | Snapshot IDs and timestamps |
| T+30 min | Capture active Headless inventories and Kinsta backups | Andrew | Inventory paths and backup IDs |
| T+60 min | Build, hash, and review final package | `<engineering + business reviewers>` | Signed delta report |
| T+90 min | Run all stages in dry-run mode | Andrew | Zero-conflict dry-run logs |
| Approval gate | Record GO or NO-GO | Andrew plus `<business owner>` | Written decision |
| After GO | Apply one stage at a time with reconciliation between stages | Andrew | Stage logs and manifests |
| Post-apply | Run application smoke, cache refresh, and business review | `<QA + business owners>` | Acceptance report |
| Final gate | Lift freeze or start rollback | Andrew | Written decision |

## Execution Sequence

1. Start the approved freeze. Record UTC time and final Legacy order identifier.
2. Capture final Legacy database/uploads snapshots and read-only inventories.
3. Capture active Headless database/uploads backups and before-state inventories.
4. Enable the reviewed production side-effect guard and prove mail, webhooks, payment actions,
   exports, and queued order automation are suppressed.
5. Generate the final package from the frozen source. Review all changed counts and hashes.
6. Review the exact order/order-item metadata-key inventory. Any required field without an explicit
      mapping, or any plugin-owned metadata proposed for transfer, is an automatic NO-GO.
7. Run contamination scans in fail-on-findings mode. Any plugin, builder, generated-media, or
      unapproved-field candidate is an automatic NO-GO.
8. Run production dry runs in this order: `eta-prices`, `product-documents`, then `orders`.
9. Compare dry-run totals to the newly approved policy. Any conflict or unexplained delta is NO-GO.
10. Record the final GO from the release manager and business owner.
11. Apply `eta-prices`; reconcile prices and prove inventory/customer groups are unchanged.
12. Apply `product-documents`; verify every destination hash and additive mapping.
13. Apply `orders`; reconcile orders, lines, shipping, fees, taxes, notes, statuses, and user links.
14. Rerun all three dry runs. They must propose zero additional writes and zero conflicts.
15. Verify protected usermeta, users, plugins, themes, options, tables, taxonomies, and excluded
    business fields remain unchanged.
16. Confirm the side-effect guard produced no mail, webhook, payment, export, or queued-job leak.
17. Clear only approved caches, trigger required Next.js revalidation, and run critical-path smoke.
18. Remove the temporary side-effect guard only after reconciliation passes. Confirm normal runtime
    integrations are healthy without replaying imported-order events.
19. Obtain business sign-off, lift the freeze, and record the UTC completion time.

The exact production commands belong in the reviewed production-runner PR. Do not adapt or bypass
the clone-only checks in `run-wordpress-rehearsal-etl.php` during the cutover window.

## GO Criteria

- All required approvals have a named owner and recorded decision.
- Fresh policy, manifests, media, and order payload hashes are approved.
- Kinsta database and files backup identifiers are recorded and restorable.
- Dry runs report only approved writes, expected rejections, zero conflicts, and zero deletions.
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
- GraphQL, authentication, product, document, cart, checkout, or account smoke checks regress.

## Rollback Procedure

1. Keep the Legacy freeze active and disable public writes to active Headless.
2. Preserve failed-run logs and after-state inventories outside the restore target.
3. Restore both the recorded pre-cutover Kinsta database and files backups.
4. Clear runtime caches and revalidate the frontend against the restored backend.
5. Rerun baseline inventory, approved-field, protected-usermeta, media-hash, and order-count checks.
6. Confirm GraphQL, authentication, products, documents, cart, checkout, and account paths.
7. Re-enable runtime integrations only after the restored baseline is verified.
8. Record the incident disposition before lifting the Legacy freeze or scheduling another attempt.

## Post-Cutover Evidence

- [ ] Final source and target inventory identifiers
- [ ] Approved policy and payload SHA-256 values
- [ ] Kinsta pre-cutover database and files backup identifiers
- [ ] Dry-run and apply logs for all three stages
- [ ] Idempotency rerun logs
- [ ] Price, document, PDF, order, user, and protected-usermeta reconciliation reports
- [ ] Plugin and Visual Composer/WPBakery zero-transfer reports
- [ ] Side-effect suppression and re-enable evidence
- [ ] Application smoke results
- [ ] Business sign-off and freeze-lift timestamp
- [ ] Backup retention and secure evidence-deletion dates
