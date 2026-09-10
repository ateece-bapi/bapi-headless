/**
 * Easy Order Form access control
 *
 * The Easy Order Form (bulk SKU + quantity reorder tool) is currently scoped to
 * specific B2B customers only. Lennox NAS requested this feature to quickly
 * reorder frequently-purchased parts (see docs/products-to-import-priority.xlsx).
 *
 * Customer group values come from the WordPress ACF `customer_group1/2/3` fields
 * on the user's account, slugified (e.g. "Lennox" -> "lennox"). To grant a new
 * customer access, add their slugified group here.
 */
export const EASY_ORDER_FORM_CUSTOMER_GROUPS = ['lennox'] as const;

/** Whether a user's customer groups grant access to the Easy Order Form. */
export function canUseEasyOrderForm(customerGroups: string[] | undefined | null): boolean {
  if (!customerGroups || customerGroups.length === 0) return false;
  return customerGroups.some((group) =>
    (EASY_ORDER_FORM_CUSTOMER_GROUPS as readonly string[]).includes(group)
  );
}
