#!/bin/bash
# ================================================================
# ETA Line Price Update — Legacy Site (www.bapihvac.com)
# ================================================================
# Generated: 2026-06-22
# Source: "PID NID PRODUCTS::NameDescription Salesname Updated List Price" PDF
# Run on: prod-2025.bapihvac.com | user: bapihvac
# WP Path: /sites/bapihvac/files/public (SpinupWP standard)
# ================================================================
# Usage:
#   bash update-eta-prices-legacy.sh --dry-run   # Preview changes only
#   bash update-eta-prices-legacy.sh              # Apply changes
# ================================================================

WP_PATH="/sites/www.bapihvac.com/files"
DRY_RUN=false
SKIP_COUNT=0
UPDATE_COUNT=0
ERROR_COUNT=0

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "DRY RUN MODE — no changes will be made"
  echo ""
fi

update_price() {
  local sku="$1"
  local price="$2"

  # Look up product post ID by SKU via direct SQL (more reliable with special chars like /)
  local post_id
  post_id=$(wp db query \
    "SELECT post_id FROM wp_postmeta WHERE meta_key='_sku' AND meta_value='${sku}' LIMIT 1;" \
    --skip-column-names \
    --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')

  if [[ -z "$post_id" ]]; then
    echo "  WARN  SKU not found: $sku — SKIPPED"
    (( SKIP_COUNT++ ))
    return 1
  fi

  if [[ "$DRY_RUN" == true ]]; then
    local current
    current=$(wp post meta get "$post_id" _regular_price --path="$WP_PATH" 2>/dev/null)
    echo "  [DRY]  $sku (ID: $post_id) | \$$current → \$$price"
    return 0
  fi

  # Update regular price
  wp post meta update "$post_id" _regular_price "$price" --path="$WP_PATH" --quiet

  # Only update _price (active displayed price) if no sale price is active
  local sale_price
  sale_price=$(wp post meta get "$post_id" _sale_price --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')
  if [[ -z "$sale_price" ]]; then
    wp post meta update "$post_id" _price "$price" --path="$WP_PATH" --quiet
  else
    echo "  INFO   $sku has active sale price \$$sale_price — _price not touched"
  fi

  echo "  OK     $sku (ID: $post_id) → \$$price"
  (( UPDATE_COUNT++ ))
}

echo "=================================================="
echo "ETA Line Price Update — Legacy WordPress"
echo "Site: www.bapihvac.com"
echo "Path: $WP_PATH"
echo "=================================================="

# --- BACKPLATES & MOUNTING ---
echo -e "\n--- Backplates & Mounting ---"
update_price "BA/BP185X285"  "465"
update_price "BA/BP6X185"    "370"
update_price "BA/BCG"        "35"
update_price "BA/BLR"        "65"
update_price "BA/CMBP"       "60"
update_price "BA/CMBP2"      "250"

# --- SNAP TRACK ---
echo -e "\n--- Snap Track ---"
update_price "BA/TRK01"  "6"
update_price "BA/TRK02"  "10"
update_price "BA/TRK04"  "15"
update_price "BA/TRK06"  "18"
update_price "BA/TRK08"  "20"
update_price "BA/TRK12"  "30"
update_price "BA/TRK18"  "45"
update_price "BA/TRK48"  "120"

# --- POWER SUPPLIES ---
echo -e "\n--- Power Supplies ---"
update_price "BA/PS17"        "620"
update_price "BA/PS17CB"      "725"
update_price "BA/PS17RF"      "500"
update_price "BA/PS18RF"      "550"
update_price "BA/PS19RF"      "385"
update_price "BA/PSOCL"       "45"
update_price 'BA/PWR-CORD-36"' "40"

# --- POWER DISTRIBUTION ---
echo -e "\n--- Power Distribution ---"
update_price "BA/PDM-3-B"  "450"
update_price "BA/PDM-3-F"  "290"
update_price "BA/PDM-5-B"  "650"
update_price "BA/PDM-5-F"  "390"
update_price "BA/LVTM"     "330"
update_price "BA/LVTM-TB"  "180"
update_price "BA/TB4"      "160"

# --- RELAY/BRIDGE PANELS ---
echo -e "\n--- Relay/Bridge Panels ---"
update_price "BA/3324VC"   "200"
update_price "BA/CDSP2"    "260"
update_price "BA/RBP4"     "135"
update_price "BA/RBP4-TRK" "150"
update_price "BA/RBP8"     "190"
update_price "BA/RBP8-TRK" "210"
update_price "BA/SRBP"     "90"
update_price "BA/SRBP-TRK" "100"
update_price "BA/RBP-PB"   "105"
update_price "BA/RBPCX"    "85"
update_price "BA/RBPCX2"   "85"

# --- REPEATERS / FOX ---
echo -e "\n--- Repeaters / FOX ---"
update_price "BA/RPTR"     "315"
update_price "BA/RPTR-KIT" "470"
update_price "BA/FOX"      "850"
update_price "BA/FOX-KIT"  "980"
update_price "BA/COMSRG"   "125"

# --- TRANSIENT SUPPRESSORS ---
echo -e "\n--- Transient Suppressors ---"
update_price "BA/TS1"     "28"
update_price "BA/TS1-TRK" "35"
update_price "BA/TS2"     "25"
update_price "BA/TS2-TRK" "35"
update_price "BA/TS24"    "25"

# --- COMMUNICATION ---
echo -e "\n--- Communication ---"
update_price "BA/COMBLK"  "105"
update_price "BA/COMBLK2" "90"
update_price "BA/TUCOM"   "52"
update_price "BA/TUCOM2"  "52"
update_price "BA/LRCA"    "65"

# --- TB18 TERMINAL BLOCKS ---
echo -e "\n--- TB18 Terminal Blocks ---"
update_price "BA/TB18"       "95"
update_price "BA/TB18-TRK"   "105"
update_price "BA/TB18C"      "120"
update_price "BA/TB18C2"     "140"
update_price "BA/TB18C2-TRK" "150"
update_price "BA/TB18R"      "100"

# --- CONTROLLERS / MISC ---
echo -e "\n--- Controllers / Misc ---"
update_price "BA/PLCON1"    "190"
update_price "BA/PLCON2"    "150"
update_price "BA/TURB"      "150"
update_price "BA/TURB-TRK"  "165"
update_price "BA/AVI"       "250"
update_price "BA/AVI-TRK"   "265"
update_price "BA/PMPB5"     "65"
update_price "BA/PMPB5-TRK" "72"
update_price "BA/UCRB2"     "150"

# --- ALC ETA PRODUCTS ---
echo -e "\n--- ALC ETA Products ---"
update_price "OUT64A" "155"
update_price "OUT66"  "165"
update_price "UIUO4"  "70"

# --- BACKPLANES ---
echo -e "\n--- Backplanes ---"
update_price "BA/BP2"   "50"
update_price "BA/BP4"   "60"
update_price "BA/BP8"   "90"
update_price "BA/BPCX"  "60"
update_price "BA/BP4-V" "65"
update_price "BA/BP-BR" "50"

# --- DUAL SETPOINT ---
echo -e "\n--- Dual Setpoint ---"
update_price "BA/DS8"           "215"
update_price "BA/DS5R"          "200"
update_price "BA/DS6R"          "250"
update_price "BA/DS6R-KIT1"     "300"
update_price "BA/DS6R-KIT2"     "335"
update_price "BA/DS6R-10K"      "250"
update_price "BA/DS6R-10K-KIT1" "300"
update_price "BA/DS6R-10K-KIT2" "305"
update_price "BA/MXV"           "280"
update_price "BA/SS-AC"         "260"

# --- RELAY / SEQUENCER ---
echo -e "\n--- Relay / Sequencer ---"
update_price "BA/PE4"       "260"
update_price "BA/IRM4"      "315"
update_price "BA/EA1"       "250"
update_price "BA/EA2"       "230"
update_price "BA/R49"       "270"
update_price "BA/SQ4"       "330"
update_price "BA/SQ4-R"     "330"
update_price "ACC-RLY-S4QR" "330"
update_price "BA/SQ4-A"     "400"
update_price "BA/SQ4-RA"    "400"
update_price "BA/SD2"       "410"

# ----------------------------------------------------------------
# PRODUCTS MISSING SALESNAME IN PDF — update manually in WP-Admin
# or look up SKU first with:
#   wp post list --post_type=product --s="BP2-TRK" --fields=ID,post_title --path=/sites/bapihvac/files/public
# ----------------------------------------------------------------
echo -e "\n--- Products without Salesname — MANUAL UPDATE REQUIRED ---"
echo "  SKIP   COMMBLK-TRK (PDF PID 16097): target \$105 — find SKU then re-run"
echo "  SKIP   BP2-TRK     (PDF PID 16360): target \$60  — find SKU then re-run"
echo "  SKIP   BP4-TRK     (PDF PID 16094): target \$75  — find SKU then re-run"
echo "  SKIP   BP8-TRK     (PDF PID 16096): target \$110 — find SKU then re-run"

# ----------------------------------------------------------------
echo -e "\n=================================================="
if [[ "$DRY_RUN" == true ]]; then
  echo "DRY RUN complete — no changes were made."
else
  echo "Done. Updated: $UPDATE_COUNT | Skipped (not found): $SKIP_COUNT"
  echo "Verify a few prices in WP-Admin > Products before calling it done."
fi
echo "=================================================="
