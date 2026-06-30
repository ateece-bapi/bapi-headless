import zipfile, re, xml.etree.ElementTree as ET, os
from collections import defaultdict

def get_shared_strings(z):
    with z.open('xl/sharedStrings.xml') as f:
        content = f.read().decode('utf-8')
    return re.findall(r'<t[^>]*>(.*?)</t>', content, re.DOTALL)

def col_letter_to_index(col_str):
    result = 0
    for ch in col_str:
        result = result * 26 + (ord(ch) - ord('A') + 1)
    return result - 1

def get_sheet_data(z, strings):
    with z.open('xl/worksheets/sheet1.xml') as f:
        tree = ET.parse(f)
    ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    root = tree.getroot()
    rows = []
    for row in root.findall('.//s:row', ns):
        row_data = {}
        for cell in row.findall('s:c', ns):
            ref = cell.get('r', '')
            col_letters = re.match(r'([A-Z]+)', ref).group(1) if ref else None
            if not col_letters:
                continue
            col_idx = col_letter_to_index(col_letters)
            t = cell.get('t', '')
            v_el = cell.find('s:v', ns)
            if v_el is not None:
                if t == 's':
                    row_data[col_idx] = strings[int(v_el.text)]
                else:
                    row_data[col_idx] = v_el.text
        if row_data:
            max_col = max(row_data.keys())
            rows.append([row_data.get(i, '') for i in range(max_col + 1)])
        else:
            rows.append([])
    return rows

# ---- Load SharePoint file lists ----
sp_files = {}
for key, fname in [
    ('datasheets', 'query(datasheets).iqy.xlsx'),
    ('instructions', 'query(instructions).iqy.xlsx'),
    ('images', 'query(prodcutImages.iqy.xlsx'),
]:
    with zipfile.ZipFile(fname) as z:
        ss = get_shared_strings(z)
        sp_rows = get_sheet_data(z, ss)
    name_col = sp_rows[0].index('Name')
    sp_files[key] = set(r[name_col] for r in sp_rows[1:] if name_col < len(r) and r[name_col])

# ---- Load main spreadsheet ----
with zipfile.ZipFile('Kele_Contents_BAPI_Final.xlsx') as z:
    strings = get_shared_strings(z)
    rows = get_sheet_data(z, strings)

headers = rows[0]
img_col = headers.index('Product Image URL')
ds_col = headers.index('Product Data Sheet PDF URL')
ins_col = headers.index('Product Installation Instructions URL')

def filename_from_url(url):
    if not url:
        return None
    return url.rstrip('/').split('/')[-1]

# ---- Analyze ----
img_urls_seen = defaultdict(int)
ds_urls_seen = defaultdict(int)
ins_urls_seen = defaultdict(int)

for r in rows[1:]:
    img_url = r[img_col] if img_col < len(r) else ''
    ds_url = r[ds_col] if ds_col < len(r) else ''
    ins_url = r[ins_col] if ins_col < len(r) else ''
    if img_url:
        img_urls_seen[img_url] += 1
    if ds_url:
        ds_urls_seen[ds_url] += 1
    if ins_url:
        ins_urls_seen[ins_url] += 1

print(f"=== SPREADSHEET SUMMARY ===")
print(f"Data rows: {len(rows)-1}")
print(f"Unique image URLs: {len(img_urls_seen)}")
print(f"Unique datasheet URLs: {len(ds_urls_seen)}")
print(f"Unique instruction URLs: {len(ins_urls_seen)}")
print(f"Rows with image URL: {sum(1 for r in rows[1:] if img_col < len(r) and r[img_col])}")
print(f"Rows with datasheet URL: {sum(1 for r in rows[1:] if ds_col < len(r) and r[ds_col])}")
print(f"Rows with instruction URL: {sum(1 for r in rows[1:] if ins_col < len(r) and r[ins_col])}")

print(f"\n=== SHAREPOINT FILE COUNTS ===")
for k, v in sp_files.items():
    print(f"  {k}: {len(v)} files")

# ---- Check what image URLs reference (PDF vs image files) ----
img_is_pdf = [(u, c) for u, c in img_urls_seen.items() if u.lower().endswith('.pdf')]
img_is_img = [(u, c) for u, c in img_urls_seen.items() if not u.lower().endswith('.pdf')]
print(f"\n=== IMAGE URL COLUMN ANALYSIS ===")
print(f"URLs pointing to PDFs (wrong!): {len(img_is_pdf)}")
print(f"URLs pointing to images: {len(img_is_img)}")
if img_is_pdf:
    print("Sample PDF-in-image-column URLs:")
    for u, c in list(img_is_pdf)[:5]:
        print(f"  [{c}x] {u}")

# ---- Match datasheet URLs to SharePoint ----
print(f"\n=== DATASHEET URL → SHAREPOINT MATCH ===")
in_sp_ds = []
not_in_sp_ds = []
for url in sorted(ds_urls_seen.keys()):
    fname = filename_from_url(url)
    if fname in sp_files['datasheets']:
        in_sp_ds.append((url, fname))
    elif fname in sp_files['instructions']:
        in_sp_ds.append((url, fname + ' [IN INSTRUCTIONS FOLDER]'))
    else:
        not_in_sp_ds.append((url, fname))

print(f"Matched in SharePoint: {len(in_sp_ds)}")
print(f"NOT in SharePoint: {len(not_in_sp_ds)}")
if not_in_sp_ds:
    print("Missing from SharePoint datasheets & instructions:")
    for url, fname in not_in_sp_ds:
        print(f"  {fname}")

# ---- Match instruction URLs to SharePoint ----
print(f"\n=== INSTRUCTION URL → SHAREPOINT MATCH ===")
in_sp_ins = []
not_in_sp_ins = []
for url in sorted(ins_urls_seen.keys()):
    fname = filename_from_url(url)
    if fname in sp_files['instructions']:
        in_sp_ins.append((url, fname))
    elif fname in sp_files['datasheets']:
        in_sp_ins.append((url, fname + ' [IN DATASHEETS FOLDER]'))
    else:
        not_in_sp_ins.append((url, fname))
print(f"Matched in SharePoint: {len(in_sp_ins)}")
print(f"NOT in SharePoint: {len(not_in_sp_ins)}")

# ---- Match image URLs to SharePoint ----
print(f"\n=== IMAGE URL → SHAREPOINT MATCH ===")
in_sp_img = []
not_in_sp_img = []
for url in sorted(img_urls_seen.keys()):
    fname = filename_from_url(url)
    if fname in sp_files['images']:
        in_sp_img.append((url, fname))
    elif fname in sp_files['datasheets']:
        in_sp_img.append((url, fname + ' [IN DATASHEETS FOLDER]'))
    else:
        not_in_sp_img.append((url, fname))
print(f"Matched in SharePoint: {len(in_sp_img)}")
print(f"NOT in SharePoint: {len(not_in_sp_img)}")
if not_in_sp_img:
    print("Missing from SharePoint images:")
    for url, fname in not_in_sp_img:
        print(f"  {fname}")

# ---- SharePoint files NOT referenced in spreadsheet ----
print(f"\n=== SHAREPOINT FILES NOT IN SPREADSHEET ===")
all_ds_fnames = set(filename_from_url(u) for u in ds_urls_seen)
all_img_fnames = set(filename_from_url(u) for u in img_urls_seen)
all_ins_fnames = set(filename_from_url(u) for u in ins_urls_seen)

unreferenced_ds = sp_files['datasheets'] - all_ds_fnames - all_img_fnames - all_ins_fnames
unreferenced_ins = sp_files['instructions'] - all_ins_fnames - all_ds_fnames - all_img_fnames
unreferenced_img = sp_files['images'] - all_img_fnames

print(f"Datasheets in SharePoint but not in spreadsheet: {len(unreferenced_ds)}")
for f in sorted(unreferenced_ds):
    print(f"  {f}")
print(f"Instructions in SharePoint but not in spreadsheet: {len(unreferenced_ins)}")
for f in sorted(unreferenced_ins):
    print(f"  {f}")
print(f"Images in SharePoint but not in spreadsheet: {len(unreferenced_img)}")
for f in sorted(unreferenced_img):
    print(f"  {f}")

# ---- Duplicate URL analysis ----
print(f"\n=== MOST REUSED DATASHEET URLS (top 10) ===")
top_ds = sorted(ds_urls_seen.items(), key=lambda x: -x[1])[:10]
for url, count in top_ds:
    print(f"  [{count}x] {filename_from_url(url)}")

print(f"\n=== MOST REUSED IMAGE URLS (top 10) ===")
top_img = sorted(img_urls_seen.items(), key=lambda x: -x[1])[:10]
for url, count in top_img:
    print(f"  [{count}x] {filename_from_url(url)}")
