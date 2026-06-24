# Current Switch — Product QR Code

**Asana Task:** Update Product QR Code For Production Representative Models  
**Requested by:** Christian Ellefson  
**Date created:** 2026-06-23

---

## QR Code Details

| Field | Value |
|-------|-------|
| **Target URL** | `https://www.bapihvac.com/product/current-switch/` |
| **Error Correction** | High (H) — recommended for printed QR codes |
| **QR Code File** | `current-switch-qr.svg` (repo root) |
| **Product Category** | Accessories |
| **WordPress Status** | Draft (not publicly visible until sales release) |

---

## QR Code File

The file `current-switch-qr.svg` in the repo root is the source QR code.

**To generate the `.ai` file for the vendor:**
1. Open `current-switch-qr.svg` in Adobe Illustrator
2. **File → Save As** → select **Adobe Illustrator (.ai)** format
3. Attach the `.ai` file to the Asana task

---

## Headless Site Compatibility

The QR code URL (`/product/current-switch/`) **will continue to work** after the migration to the headless Next.js site.

The headless site uses `localePrefix: 'always'`, meaning all product pages are served at `/en/product/:slug`. A permanent redirect has been added to `web/next.config.ts`:

```
/product/:slug  →  /en/product/:slug  (301 permanent)
```

This means the printed QR code never needs to be reprinted — the redirect handles it transparently.

---

## WordPress Draft Page

The product page was created as a **Draft** in WordPress legacy (`bapihvac.com`).

- Preview URL (internal only): `https://www.bapihvac.com/?post_type=product&p=422911&preview=true`
- Live URL (once published): `https://www.bapihvac.com/product/current-switch/`

The QR code points to the **live URL**. It will return a 404 until the product is published for sale — this is expected and intentional.
