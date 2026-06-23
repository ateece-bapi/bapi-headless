#!/bin/bash
# ================================================================
# ETA Line Datasheet Attachment Script — Legacy Site (www.bapihvac.com)
# ================================================================
# Generated: 2026-06-23
# Purpose: Import PDFs into WP Media Library and attach to products
#          via ACF product_documents repeater field
# Run on: prod-2025.bapihvac.com | user: bapihvac
# WP Path: /sites/www.bapihvac.com/files
# ================================================================
# Usage:
#   bash attach-eta-datasheets.sh --dry-run   # Preview only
#   bash attach-eta-datasheets.sh             # Apply changes
# ================================================================
# Prerequisites:
#   PDFs uploaded to ~/eta-datasheets/ on the server first:
#   scp -r /path/to/desktop/folder/ bapihvac@104.248.14.80:~/eta-datasheets/
# ================================================================

WP_PATH="/sites/www.bapihvac.com/files"
PDF_DIR="$HOME/eta-datasheets"
DRY_RUN=false
ATTACH_COUNT=0
SKIP_COUNT=0
WARN_COUNT=0

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "DRY RUN MODE — no changes will be made"
  echo ""
fi

# ----------------------------------------------------------------
# Helper: get WP post ID by SKU
# ----------------------------------------------------------------
get_post_id() {
  local sku="$1"
  wp db query \
    "SELECT post_id FROM wp_postmeta WHERE meta_key='_sku' AND meta_value='${sku}' LIMIT 1;" \
    --skip-column-names \
    --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]'
}

# ----------------------------------------------------------------
# Helper: import PDF into Media Library, return attachment ID
# ----------------------------------------------------------------
import_pdf() {
  local pdf_path="$1"
  local filename
  filename=$(basename "$pdf_path")

  # Check if already imported (by filename in guid)
  local existing_id
  existing_id=$(wp db query \
    "SELECT ID FROM wp_posts WHERE post_type='attachment' AND guid LIKE '%${filename}%' LIMIT 1;" \
    --skip-column-names \
    --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')

  if [[ -n "$existing_id" ]]; then
    echo "$existing_id"
    return 0
  fi

  if [[ "$DRY_RUN" == true ]]; then
    echo "NEW"
    return 0
  fi

  local att_id
  att_id=$(wp media import "$pdf_path" \
    --path="$WP_PATH" \
    --porcelain \
    --quiet 2>/dev/null | tr -d '[:space:]')
  echo "$att_id"
}

# ----------------------------------------------------------------
# Helper: attach PDF to product via ACF product_documents repeater
# Appends a new row if docs already exist; skips if this PDF
# attachment ID is already attached.
# ----------------------------------------------------------------
attach_to_product() {
  local sku="$1"
  local att_id="$2"
  local pdf_name="$3"
  local heading="${4:-Datasheet for Submittal}"

  local post_id
  post_id=$(get_post_id "$sku")

  if [[ -z "$post_id" ]]; then
    echo "  WARN  SKU not found: $sku — SKIPPED"
    (( WARN_COUNT++ ))
    return 1
  fi

  if [[ "$DRY_RUN" == true ]]; then
    local current_docs
    current_docs=$(wp post meta get "$post_id" product_documents --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')
    echo "  [DRY]  $sku (ID: $post_id) | attach $pdf_name → heading: \"$heading\" | existing rows: ${current_docs:-0}"
    return 0
  fi

  # Get current row count
  local row_count
  row_count=$(wp post meta get "$post_id" product_documents --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')
  row_count=${row_count:-0}

  # Check if this attachment is already set on this product
  local i=0
  while [[ $i -lt $row_count ]]; do
    local existing_file
    existing_file=$(wp post meta get "$post_id" "product_documents_${i}_document_file_repeater_0_document_file" --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')
    if [[ "$existing_file" == "$att_id" ]]; then
      echo "  SKIP   $sku (ID: $post_id) | $pdf_name already attached at row $i"
      (( SKIP_COUNT++ ))
      return 0
    fi
    (( i++ ))
  done

  # Append new row
  local new_row=$row_count
  wp post meta update "$post_id" product_documents $(( row_count + 1 )) --path="$WP_PATH" --quiet
  wp post meta update "$post_id" "product_documents_${new_row}_document_heading" "$heading" --path="$WP_PATH" --quiet
  wp post meta update "$post_id" "product_documents_${new_row}_document_file_repeater" 1 --path="$WP_PATH" --quiet
  wp post meta update "$post_id" "product_documents_${new_row}_document_file_repeater_0_document_file" "$att_id" --path="$WP_PATH" --quiet

  echo "  OK     $sku (ID: $post_id) | $pdf_name → row $new_row"
  (( ATTACH_COUNT++ ))
}

# ----------------------------------------------------------------
# Helper: process one PDF → multiple SKUs
# ----------------------------------------------------------------
attach_pdf_to_skus() {
  local pdf_file="$1"
  shift
  local skus=("$@")
  local pdf_path="$PDF_DIR/$pdf_file"

  echo ""
  echo "--- $pdf_file ---"

  if [[ ! -f "$pdf_path" ]]; then
    echo "  ERROR  File not found: $pdf_path"
    return 1
  fi

  local att_id
  att_id=$(import_pdf "$pdf_path")

  if [[ -z "$att_id" ]]; then
    echo "  ERROR  Failed to import $pdf_file"
    return 1
  fi

  if [[ "$att_id" == "NEW" ]]; then
    echo "  [DRY]  Would import: $pdf_file → new attachment"
  elif [[ "$att_id" =~ ^[0-9]+$ ]]; then
    if [[ "$DRY_RUN" != true ]]; then
      echo "  MEDIA  $pdf_file → attachment ID: $att_id"
    fi
  fi

  for sku in "${skus[@]}"; do
    attach_to_product "$sku" "$att_id" "$pdf_file"
  done
}

# ================================================================
echo "=================================================="
echo "ETA Datasheet Attachment"
echo "Site: www.bapihvac.com"
echo "PDFs: $PDF_DIR"
echo "=================================================="

# ----------------------------------------------------------------
# PDF → SKU mappings
# ----------------------------------------------------------------

attach_pdf_to_skus "3312VC_3324VC_ETA.pdf" \
  "BA/3324VC"

attach_pdf_to_skus "Backplate_Bracket_ETA.pdf" \
  "BA/BP185X285" "BA/BP6X185" "BA/BCG" "BA/BLR" "BA/CMBP" "BA/CMBP2"

attach_pdf_to_skus "BELCON_TUCOM_ETA.pdf" \
  "BA/BELCON" "BA/TUCOM" "BA/TUCOM2"

attach_pdf_to_skus "BP4_BP8_ETA.pdf" \
  "BA/BP2" "BA/BP4" "BA/BP8" \
  "BA/BP2-TRK" "BA/BP4-TRK" "BA/BP8-TRK"

attach_pdf_to_skus "BP4V_BR_ETA.pdf" \
  "BA/BP4-V" "BA/BP-BR"

attach_pdf_to_skus "CDSP2_ETA.pdf" \
  "BA/CDSP2"

attach_pdf_to_skus "COMBLK_ETA.pdf" \
  "BA/COMBLK" "BA/COMBLK2" "BA/COMBLK-TRK"

attach_pdf_to_skus "COMSRG_ETA.pdf" \
  "BA/COMSRG"

attach_pdf_to_skus "DS6R_ETA.pdf" \
  "BA/DS5R" "BA/DS6R" "BA/DS6R-KIT1" "BA/DS6R-KIT2" \
  "BA/DS6R-10K" "BA/DS6R-10K-KIT1" "BA/DS6R-10K-KIT2"

attach_pdf_to_skus "DS8_ETA.pdf" \
  "BA/DS8"

attach_pdf_to_skus "EA1_ETA.pdf" \
  "BA/EA1"

attach_pdf_to_skus "EA2_ETA.pdf" \
  "BA/EA2"

attach_pdf_to_skus "FOX_ETA.pdf" \
  "BA/FOX"

attach_pdf_to_skus "FOX_Kit_ETA.pdf" \
  "BA/FOX-KIT"

attach_pdf_to_skus "IRM4_ETA.pdf" \
  "BA/IRM4"

attach_pdf_to_skus "LRCA_PSOCL_ETA.pdf" \
  "BA/LRCA" "BA/PSOCL"

attach_pdf_to_skus "MXV_ETA.pdf" \
  "BA/MXV"

attach_pdf_to_skus "PDM_Module.pdf" \
  "BA/PDM-3-B" "BA/PDM-3-F" "BA/PDM-5-B" "BA/PDM-5-F" \
  "BA/LVTM" "BA/LVTM-TB" "BA/TB4"

attach_pdf_to_skus "PMPB5_TS1_ETA.pdf" \
  "BA/PMPB5" "BA/PMPB5-TRK"

attach_pdf_to_skus "PS17_PS18_PS19_Accessories.pdf" \
  "BA/PS17" "BA/PS17CB"

attach_pdf_to_skus "PS17RF_ETA.pdf" \
  "BA/PS17RF" "BA/PS18RF" "BA/PS19RF"

attach_pdf_to_skus "R49_ETA.pdf" \
  "BA/R49"

attach_pdf_to_skus "RBP_ETA.pdf" \
  "BA/RBP4" "BA/RBP4-TRK" "BA/RBP8" "BA/RBP8-TRK" \
  "BA/RBPCX" "BA/RBPCX2"

attach_pdf_to_skus "RBP-PB_ETA.pdf" \
  "BA/RBP-PB"

attach_pdf_to_skus "RPTR_ETA.pdf" \
  "BA/RPTR"

attach_pdf_to_skus "RPTR_Kit_ETA.pdf" \
  "BA/RPTR-KIT"

attach_pdf_to_skus "SD2_ETA.pdf" \
  "BA/SD2"

attach_pdf_to_skus "SQ4_ETA.pdf" \
  "BA/SQ4" "BA/SQ4-R" "BA/SQ4-A" "BA/SQ4-RA" "ACC-RLY-S4QR"

attach_pdf_to_skus "SRBP_ETA.pdf" \
  "BA/SRBP" "BA/SRBP-TRK"

attach_pdf_to_skus "SS-AC_ETA.pdf" \
  "BA/SS-AC"

attach_pdf_to_skus "TB18_ETA.pdf" \
  "BA/TB18" "BA/TB18-TRK" "BA/TB18C" "BA/TB18C2" \
  "BA/TB18C2-TRK" "BA/TB18R"

attach_pdf_to_skus "TRK18_ETA.pdf" \
  "BA/TRK01" "BA/TRK02" "BA/TRK04" "BA/TRK06" \
  "BA/TRK08" "BA/TRK12" "BA/TRK18" "BA/TRK48"

attach_pdf_to_skus "TS1_TS2.pdf" \
  "BA/TS1" "BA/TS1-TRK" "BA/TS2" "BA/TS2-TRK" "BA/TS24"

attach_pdf_to_skus "TURB_ETA.pdf" \
  "BA/TURB" "BA/TURB-TRK"

attach_pdf_to_skus "UCRB2_ETA.pdf" \
  "BA/UCRB2"

# ----------------------------------------------------------------
# NOTE: BAPI_Catalog_2026_Full_Web.pdf is a general catalog —
# not attached to individual products. Upload manually if needed.
# ----------------------------------------------------------------

echo ""
echo "=================================================="
if [[ "$DRY_RUN" == true ]]; then
  echo "DRY RUN complete — no changes were made."
else
  echo "Done. Attached: $ATTACH_COUNT | Already present (skipped): $SKIP_COUNT | SKU not found: $WARN_COUNT"
  echo "Verify a few products in WP-Admin > Products before calling it done."
fi
echo "=================================================="
