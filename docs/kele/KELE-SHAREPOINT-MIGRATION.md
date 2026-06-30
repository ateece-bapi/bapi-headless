# Kele Distributor – SharePoint Asset Migration

**Date:** June 30, 2026  
**Requestor:** Christian Ellefson, Marketing Manager  
**Purpose:** Kele uses a spreadsheet to automatically pull product images, datasheets, and installation instructions. BAPI's WordPress site CAPTCHA was blocking Kele's automated program from fetching these files. Assets were migrated to SharePoint to provide reliable, public access.

---

## What Was Done

### 1. SharePoint Folder Setup
Three folders were created in the **BAPI Media Library** SharePoint site (`bapisensors.sharepoint.com/sites/BAPIMediaLibrary`):

| Folder | Contents |
|---|---|
| `Shared Documents/Product Images` | PNG product photos (83+ files) |
| `Shared Documents/Datasheets` | PDF product datasheets (75+ files) |
| `Shared Documents/Instructions` | PDF installation instructions (81+ files) |

### 2. Source Spreadsheet
**File:** `Kele_Contents_BAPI_Final.xlsx` (Terry's original)  
- 3,217 product rows  
- 3 URL columns: Product Image URL, Product Data Sheet PDF URL, Product Installation Instructions URL  
- All URLs originally pointed to `https://www.bapihvac.com/wp-content/uploads/[filename]`

### 3. SharePoint Export Files
SharePoint folder contents were exported and provided as:
- `query(datasheets).iqy.xlsx`
- `query(instructions).iqy.xlsx`
- `query(prodcutImages.iqy.xlsx` *(note: typo in filename — "prodcut")*

### 4. Files Added During Migration
The following files were missing from the initial SharePoint uploads and were added individually:

**Instructions folder:**
- `9546_ins_temp_rsz.pdf`
- `38242_ins_weather_shade.pdf`

**Datasheets folder:**
- `Thermowells_NoPrice-v17.pdf`
- `Water_Leak_Detector_BB_5Amp_NoPrice.pdf`
- `Wireless_BLE_Quantum_TempRH_NoPrice.pdf`

**Product Images folder:**
- `37-55-CDW.png`
- `Clamp_BB2_300pix.png`
- `Duct_Avg_BBX.png`
- `Immersion_BB2O.png`
- `Remote_Sensor_BB4-1.png`
- `Remote_Sensor_BB_300pix.png`
- `Remote_Sensor_WP_300pix.png`
- `Thermobuffer_BBX-_2inch_300pix.png`

### 5. URL Replacement Logic
A Python script (`build_updated.py`) was written to:
1. Parse the original spreadsheet (using column-reference-aware XML parsing to handle sparse rows)
2. Build an index of all files across all three SharePoint folders
3. For each URL in the spreadsheet, extract the filename and look it up in the index
4. Construct the new SharePoint URL in the correct folder
5. Write the updated spreadsheet preserving all other data exactly

**New URL format:**
```
https://bapisensors.sharepoint.com/sites/BAPIMediaLibrary/Shared%20Documents/[Folder]/[filename]
```

---

## Final Results

| Metric | Count |
|---|---|
| Total data rows | 3,217 |
| Total URL cells processed | 8,379 |
| Successfully mapped to SharePoint | 8,375 (99.95%) |
| Kept as original (corrupt/no filename) | 3 |

The 3 unmapped cells contained corrupt entries (bare `.pdf` and `.png` with no filename) that were never valid links in the original spreadsheet.

---

## Output File
**`Kele_Contents_BAPI_Updated.xlsx`** — ready to deliver to Kele.

---

## Notes
- The SharePoint folders should be set to **anonymous read access** so Kele's automated program can fetch files without authentication
- If BAPI adds new products or updates files in the future, new files must be uploaded to the appropriate SharePoint folder and Kele should be provided an updated spreadsheet
- The `build_updated.py` script can be re-run at any time to regenerate the spreadsheet — simply add new filenames to the manual additions list at the top of the file
