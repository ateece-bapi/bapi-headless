#!/bin/bash
# ================================================================
# Fix ETA Datasheet Headings — Legacy Site (www.bapihvac.com)
# ================================================================
# Generated: 2026-06-24
# Purpose: Change "Datasheet for Submittal" → "Datasheet with Pricing"
#          for rows where the attached file is an _ETA.pdf (with pricing)
#          and NOT a _NoPrice.pdf (submittal version)
# Run on: prod-2025.bapihvac.com | user: bapihvac
# ================================================================
# Usage:
#   bash fix-eta-datasheet-headings.sh --dry-run   # Preview only
#   bash fix-eta-datasheet-headings.sh             # Apply changes
# ================================================================

WP_PATH="/sites/www.bapihvac.com/files"
DRY_RUN=false
FIX_COUNT=0
SKIP_COUNT=0
WARN_COUNT=0

if [[ "$1" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "DRY RUN MODE — no changes will be made"
  echo ""
fi

# ----------------------------------------------------------------
# Fix headings for a product by SKU or post ID
# Finds all "Datasheet for Submittal" rows where the attached file
# is an _ETA.pdf (pricing version, not _NoPrice) and renames them
# ----------------------------------------------------------------
fix_headings() {
  local sku="$1"

  # Get post ID by SKU
  local post_id
  post_id=$(wp db query \
    "SELECT post_id FROM wp_postmeta WHERE meta_key='_sku' AND meta_value='${sku}' LIMIT 1;" \
    --skip-column-names \
    --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')

  # Fall back to treating input as a raw post ID (for variable product parents)
  if [[ -z "$post_id" ]]; then
    if [[ "$sku" =~ ^[0-9]+$ ]]; then
      post_id="$sku"
    else
      echo "  WARN  SKU not found: $sku — SKIPPED"
      (( WARN_COUNT++ ))
      return 1
    fi
  fi

  # Get total document row count
  local row_count
  row_count=$(wp post meta get "$post_id" product_documents --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')
  row_count=${row_count:-0}

  if [[ "$row_count" -eq 0 ]]; then
    echo "  SKIP   $sku (ID: $post_id) — no document rows"
    (( SKIP_COUNT++ ))
    return 0
  fi

  local i=0
  local fixed_any=false
  while [[ $i -lt $row_count ]]; do
    local heading
    heading=$(wp post meta get "$post_id" "product_documents_${i}_document_heading" \
      --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')

    if [[ "$heading" == "DatasheetforSubmittal" || "$heading" == "Datasheet for Submittal" ]]; then
      # Get the file repeater count for this row
      local file_count
      file_count=$(wp post meta get "$post_id" "product_documents_${i}_document_file_repeater" \
        --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')
      file_count=${file_count:-0}

      # Check each file in this row
      local j=0
      while [[ $j -lt $file_count ]]; do
        local att_id
        att_id=$(wp post meta get "$post_id" \
          "product_documents_${i}_document_file_repeater_${j}_document_file" \
          --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')

        if [[ -n "$att_id" ]]; then
          # Get the attachment filename from guid
          local att_guid
          att_guid=$(wp db query \
            "SELECT guid FROM wp_posts WHERE ID=${att_id} AND post_type='attachment' LIMIT 1;" \
            --skip-column-names \
            --path="$WP_PATH" 2>/dev/null | tr -d '[:space:]')

          # Check: is this an _ETA.pdf (pricing) but NOT a _NoPrice.pdf?
          if [[ "$att_guid" == *"_ETA.pdf"* ]] && [[ "$att_guid" != *"_NoPrice"* ]] && [[ "$att_guid" != *"_noprice"* ]]; then
            if [[ "$DRY_RUN" == true ]]; then
              echo "  [DRY]  $sku (ID: $post_id) row $i | \"Datasheet for Submittal\" → \"Datasheet with Pricing\" | file: $(basename "$att_guid")"
            else
              wp post meta update "$post_id" "product_documents_${i}_document_heading" \
                "Datasheet with Pricing" --path="$WP_PATH" --quiet
              echo "  OK     $sku (ID: $post_id) row $i | → \"Datasheet with Pricing\" | $(basename "$att_guid")"
              (( FIX_COUNT++ ))
            fi
            fixed_any=true
            break  # Only need to check one file per row to determine heading
          fi
        fi
        (( j++ ))
      done
    fi
    (( i++ ))
  done

  if [[ "$fixed_any" == false ]]; then
    echo "  SKIP   $sku (ID: $post_id) — no rows need fixing"
    (( SKIP_COUNT++ ))
  fi
}

echo "=================================================="
echo "Fix ETA Datasheet Headings"
echo "Site: www.bapihvac.com"
echo "=================================================="

# All SKUs that were attached by attach-eta-datasheets.sh
# Variable product parents included by post ID where SKU lookup won't work

echo -e "\n--- Backplates & Mounting ---"
fix_headings "BA/BCG"

echo -e "\n--- Snap Track ---"
fix_headings "BA/TRK01"
fix_headings "BA/TRK02"
fix_headings "BA/TRK04"
fix_headings "BA/TRK08"
fix_headings "BA/TRK12"
fix_headings "BA/TRK18"
fix_headings "BA/TRK48"

echo -e "\n--- Power Supplies ---"
fix_headings "BA/PS17RF"
fix_headings "BA/PS18RF"
fix_headings "BA/PSOCL"

echo -e "\n--- Relay/Bridge Panels ---"
fix_headings "BA/3324VC"
fix_headings "BA/CDSP2"
fix_headings "BA/RBP4"
fix_headings "BA/RBP4-TRK"
fix_headings "BA/RBP8"
fix_headings "BA/RBP8-TRK"
fix_headings "BA/SRBP"
fix_headings "BA/SRBP-TRK"
fix_headings "BA/RBP-PB"
fix_headings "BA/RBPCX"
fix_headings "BA/RBPCX2"

echo -e "\n--- Repeaters / FOX ---"
fix_headings "BA/RPTR"
fix_headings "BA/RPTR-KIT"
fix_headings "50128"   # FOX variable product parent (covers BA/FOX + BA/FOX-KIT)
fix_headings "BA/COMSRG"

echo -e "\n--- Transient Suppressors ---"
fix_headings "BA/TS1"
fix_headings "BA/TS1-TRK"
fix_headings "BA/TS2"
fix_headings "BA/TS2-TRK"

echo -e "\n--- Communication ---"
fix_headings "BA/COMBLK"
fix_headings "BA/COMBLK2"
fix_headings "BA/TUCOM"
fix_headings "BA/BELCON"
fix_headings "BA/LRCA"
fix_headings "BA/PSOCL"

echo -e "\n--- TB18 Terminal Blocks ---"
fix_headings "BA/TB18"
fix_headings "BA/TB18C"
fix_headings "BA/TB18C2"

echo -e "\n--- Controllers / Misc ---"
fix_headings "BA/PLCON1"
fix_headings "BA/PLCON2"
fix_headings "BA/TURB"
fix_headings "BA/TURB-TRK"
fix_headings "BA/AVI"
fix_headings "BA/AVI-TRK"
fix_headings "BA/PMPB5"
fix_headings "BA/PMPB5-TRK"
fix_headings "BA/UCRB2"

echo -e "\n--- ALC ETA Products ---"
fix_headings "OUT66"
fix_headings "UIUO4"

echo -e "\n--- Backplanes ---"
fix_headings "BA/BP2"
fix_headings "BA/BP4"
fix_headings "BA/BP8"
fix_headings "BA/BP4-V"
fix_headings "BA/BP-BR"

echo -e "\n--- Dual Setpoint ---"
fix_headings "BA/DS8"
fix_headings "BA/DS6R"
fix_headings "BA/DS6R-KIT1"
fix_headings "BA/DS6R-KIT2"
fix_headings "BA/DS6R-10K"
fix_headings "BA/DS6R-10K-KIT1"
fix_headings "BA/DS6R-10K-KIT2"
fix_headings "BA/MXV"
fix_headings "BA/SS-AC"

echo -e "\n--- Relay / Sequencer ---"
fix_headings "BA/PE4"
fix_headings "BA/IRM4"
fix_headings "BA/EA1"
fix_headings "BA/EA2"
fix_headings "BA/R49"
fix_headings "BA/SQ4"
fix_headings "BA/SQ4-R"
fix_headings "BA/SQ4-A"
fix_headings "BA/SQ4-RA"
fix_headings "BA/SD2"

echo ""
echo "=================================================="
if [[ "$DRY_RUN" == true ]]; then
  echo "DRY RUN complete — no changes were made."
else
  echo "Done. Fixed: $FIX_COUNT | Already correct / no action: $SKIP_COUNT | Not found: $WARN_COUNT"
fi
echo "=================================================="
