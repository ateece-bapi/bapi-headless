#!/bin/bash
# ================================================================
# Pressure Sensor Datasheet/Instruction Update — Headless Backend
# ================================================================
# Purpose: Legacy site (bapihvac.com) has newer datasheet/instruction
#          revisions for these 4 pressure sensor products than the
#          headless site (Kinsta). This overwrites/attaches the
#          updated PDFs via WP-CLI so no manual WP-Admin editing
#          is required.
# Run on: bapiheadlessstaging@35.224.70.159 (port 17338), WP root ~/public
# ================================================================
# Usage:
#   bash update-pressure-sensor-datasheets.sh --dry-run   # Preview only
#   bash update-pressure-sensor-datasheets.sh             # Apply changes
# ================================================================
# Prerequisites:
#   1. Download the newer PDFs from the legacy site and drop them here:
#      scp /path/to/*.pdf bapiheadlessstaging@35.224.70.159:~/pressure-datasheets/ -P 17338
#   2. Fill in PRODUCT SLUG -> PDF mappings below.
# ================================================================

WP_PATH="$HOME/public"
PDF_DIR="$HOME/pressure-datasheets"
DRY_RUN=false
UPDATE_COUNT=0
SKIP_COUNT=0
WARN_COUNT=0

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "DRY RUN MODE — no changes will be made"
  echo ""
fi

# ----------------------------------------------------------------
# Helper: get parent product post ID by slug (variable products
# store product_documents on the parent, not the variation)
# ----------------------------------------------------------------
get_post_id_by_slug() {
  local slug="$1"
  wp post list --post_type=product --name="$slug" --field=ID --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]'
}

# ----------------------------------------------------------------
# Helper: replace an existing attachment's file content in place,
# preserving attachment ID + all ACF references (used when the
# new PDF has the same filename as the currently attached one).
# ----------------------------------------------------------------
replace_file_in_place() {
  local pdf_path="$1"
  local filename
  filename=$(basename "$pdf_path")
  local uploads_dir
  uploads_dir=$(wp eval 'echo wp_upload_dir()["basedir"];' --path="$WP_PATH" 2>/dev/null)
  local target
  target=$(find "$uploads_dir" -type f -name "$filename" 2>/dev/null | head -n1)

  if [[ -z "$target" ]]; then
    echo "  WARN  No existing upload found matching $filename — will import as new instead"
    return 1
  fi

  if [[ ! -f "$pdf_path" ]]; then
    echo "  ERROR  Source not found: $pdf_path"
    (( WARN_COUNT++ ))
    return 1
  fi

  if [[ "$DRY_RUN" == true ]]; then
    echo "  [DRY]  Would overwrite $target with $pdf_path"
    return 0
  fi

  if ! cp "$pdf_path" "$target"; then
    echo "  ERROR  Failed to overwrite $target"
    (( WARN_COUNT++ ))
    return 1
  fi
  echo "  OK     Overwrote $target (attachment ID + ACF refs unchanged)"
  (( UPDATE_COUNT++ ))
  return 0
}

# ----------------------------------------------------------------
# Helper: import a new PDF and attach it to the product's
# product_documents ACF repeater (appends a row)
# ----------------------------------------------------------------
attach_new_document() {
  local slug="$1"
  local pdf_path="$2"
  local heading="${3:-Datasheet for Submittal}"

  local post_id
  post_id=$(get_post_id_by_slug "$slug")

  if [[ -z "$post_id" ]]; then
    echo "  WARN  Product slug not found: $slug — SKIPPED"
    (( WARN_COUNT++ ))
    return 1
  fi

  if [[ "$DRY_RUN" == true ]]; then
    echo "  [DRY]  $slug (ID: $post_id) | attach $(basename "$pdf_path") -> heading: \"$heading\""
    return 0
  fi

  local att_id
  att_id=$(wp media import "$pdf_path" --path="$WP_PATH" --porcelain --quiet 2>/dev/null | tr -d '[:space:]')
  if [[ -z "$att_id" ]]; then
    echo "  ERROR  Failed to import $(basename "$pdf_path")"
    return 1
  fi

  local row_count
  row_count=$(wp post meta get "$post_id" product_documents --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')
  row_count=${row_count:-0}
  local new_row=$row_count

  wp post meta update "$post_id" product_documents $(( row_count + 1 )) --path="$WP_PATH" --quiet
  wp post meta update "$post_id" "product_documents_${new_row}_document_heading" "$heading" --path="$WP_PATH" --quiet
  wp post meta update "$post_id" "product_documents_${new_row}_document_file_repeater" 1 --path="$WP_PATH" --quiet
  wp post meta update "$post_id" "product_documents_${new_row}_document_file_repeater_0_document_file" "$att_id" --path="$WP_PATH" --quiet

  echo "  OK     $slug (ID: $post_id) | $(basename "$pdf_path") -> row $new_row (attachment $att_id)"
  (( UPDATE_COUNT++ ))
}

# ================================================================
echo "=================================================="
echo "Pressure Sensor Datasheet/Instruction Update"
echo "PDFs: $PDF_DIR"
echo "=================================================="

# ----------------------------------------------------------------
# PRODUCT SLUG -> PDF mappings
# Fill in once the updated PDFs (from legacy site) are downloaded
# into $PDF_DIR. If the filename matches what's already attached,
# replace_file_in_place() is the safer option (no ACF changes).
# ----------------------------------------------------------------

# zpm-standard-accuracy-±1-pressure-sensor-in-a-bapi-box-ip66-or-nema-4-rated-field-selected-range-and-output
# Confirmed stale: legacy Rev. 06/30/26, same filenames as headless -> overwrite in place
replace_file_in_place "$PDF_DIR/ZPM_BB_StandardAccuracy_NoPrice.pdf"           # Datasheet for Submittal
replace_file_in_place "$PDF_DIR/ZPM_BB_StandardAccuracy.pdf"                   # Datasheet with Pricing
replace_file_in_place "$PDF_DIR/51699_ins_ZPMB_LR_BB.pdf"                      # Instructions - Low Range
replace_file_in_place "$PDF_DIR/51698_ins_ZPMB_SR_BB.pdf"                      # Instructions - Standard Range
replace_file_in_place "$PDF_DIR/51700_ins_ZPMB_HR_BB.pdf"                      # Instructions - High Range
# Dimensions sheet not among the 5 newer files - not updated for this product

# zpm-in-a-bapi-box-ip66-or-nema-4-rated-differential-pressure-sensor-field-selected-range-and-output
replace_file_in_place "$PDF_DIR/ZPM_BB_PrecisionAccuracy_NoPrice.pdf"        # Datasheet for Submittal
replace_file_in_place "$PDF_DIR/ZPM_BB_PrecisionAccuracy.pdf"                # Datasheet with Pricing
replace_file_in_place "$PDF_DIR/47139_ins_ZPM_LR_BB.pdf"                     # Instructions - Low Range
replace_file_in_place "$PDF_DIR/47138_ins_ZPM_SR_BB.pdf"                     # Instructions - Standard Range
replace_file_in_place "$PDF_DIR/47140_ins_ZPM_HR_BB.pdf"                     # Instructions - High Range

# ez-differential-pressure-sensor-field-selected-range-and-output
replace_file_in_place "$PDF_DIR/ZPS_EZ_NoPrice-v17.pdf"                      # Datasheet for Submittal
replace_file_in_place "$PDF_DIR/ZPS_EZ-v17.pdf"                              # Datasheet with Pricing
replace_file_in_place "$PDF_DIR/49584_ins_EZPS_Standard_Range.pdf"           # Instructions - Standard Range
replace_file_in_place "$PDF_DIR/49583_ins_EZPS_Low_Range.pdf"                # Instructions - Low Range

# zone-pressure-multi-sensor-zpm-differential-pressure-sensor-field-selected-range-and-output
replace_file_in_place "$PDF_DIR/ZPM_Pressure_NoPrice-v17.pdf"                # Datasheet for Submittal
replace_file_in_place "$PDF_DIR/ZPM_Pressure-v17.pdf"                        # Datasheet with Pricing
replace_file_in_place "$PDF_DIR/38926_ins_ZPM_LR.pdf"                        # Instructions - Low Range
replace_file_in_place "$PDF_DIR/38927_ins_ZPM_HR.pdf"                        # Instructions - High Range
replace_file_in_place "$PDF_DIR/38592_ins_ZPM_SR.pdf"                        # Instructions - Standard Range

echo ""
echo "=================================================="
echo "Updated: $UPDATE_COUNT | Skipped: $SKIP_COUNT | Warnings: $WARN_COUNT"
echo "=================================================="
echo "Remember: wp cache flush --path=$WP_PATH, then hit"
echo "POST /api/revalidate with the affected product-{slug} tags."
