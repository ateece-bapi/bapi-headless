import zipfile, re, xml.etree.ElementTree as ET, os, json

def get_shared_strings(z):
    with z.open('xl/sharedStrings.xml') as f:
        content = f.read().decode('utf-8')
    vals = re.findall(r'<t[^>]*>(.*?)</t>', content, re.DOTALL)
    return vals

def get_sheet_data(z, strings):
    with z.open('xl/worksheets/sheet1.xml') as f:
        tree = ET.parse(f)
    ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    root = tree.getroot()
    rows = []
    for row in root.findall('.//s:row', ns):
        row_data = []
        for cell in row.findall('s:c', ns):
            t = cell.get('t', '')
            v_el = cell.find('s:v', ns)
            if v_el is not None:
                if t == 's':
                    row_data.append(strings[int(v_el.text)])
                else:
                    row_data.append(v_el.text)
            else:
                row_data.append('')
        rows.append(row_data)
    return rows

# ---- Main Kele spreadsheet ----
print('===== Kele_Contents_BAPI_Final.xlsx =====')
with zipfile.ZipFile('Kele_Contents_BAPI_Final.xlsx') as z:
    strings = get_shared_strings(z)
    rows = get_sheet_data(z, strings)

print(f'Total rows (including header): {len(rows)}')
print(f'Headers: {rows[0]}')

headers = rows[0]
img_col = headers.index('Product Image URL') if 'Product Image URL' in headers else -1
ds_col = headers.index('Product Data Sheet PDF URL') if 'Product Data Sheet PDF URL' in headers else -1
ins_col = headers.index('Product Installation Instructions URL') if 'Product Installation Instructions URL' in headers else -1

print(f'\nURL column indices: image={img_col}, datasheet={ds_col}, instructions={ins_col}')
print(f'\nSample image URLs:')
for r in rows[1:5]:
    if img_col < len(r): print(' ', r[img_col])
print(f'\nSample datasheet URLs:')
for r in rows[1:5]:
    if ds_col < len(r): print(' ', r[ds_col])
print(f'\nSample instruction URLs:')
for r in rows[1:5]:
    if ins_col < len(r): print(' ', r[ins_col])

# Collect all unique URLs
img_urls = set()
ds_urls = set()
ins_urls = set()
for r in rows[1:]:
    if img_col >= 0 and img_col < len(r) and r[img_col]:
        img_urls.add(r[img_col])
    if ds_col >= 0 and ds_col < len(r) and r[ds_col]:
        ds_urls.add(r[ds_col])
    if ins_col >= 0 and ins_col < len(r) and r[ins_col]:
        ins_urls.add(r[ins_col])

print(f'\nUnique image URLs: {len(img_urls)}')
print(f'Unique datasheet URLs: {len(ds_urls)}')
print(f'Unique instruction URLs: {len(ins_urls)}')

# Show all unique URLs
print('\n--- All unique image URLs ---')
for u in sorted(img_urls):
    print(' ', u)
print('\n--- All unique datasheet URLs ---')
for u in sorted(ds_urls):
    print(' ', u)
print('\n--- All unique instruction URLs ---')
for u in sorted(ins_urls):
    print(' ', u)

# ---- SharePoint exports ----
sp_files = {
    'datasheets': 'query(datasheets).iqy.xlsx',
    'instructions': 'query(instructions).iqy.xlsx',
    'images': 'query(prodcutImages.iqy.xlsx',
}

sp_data = {}
for key, fname in sp_files.items():
    print(f'\n===== SharePoint: {key} ({fname}) =====')
    with zipfile.ZipFile(fname) as z:
        ss = get_shared_strings(z)
        sp_rows = get_sheet_data(z, ss)
    print(f'Rows: {len(sp_rows)}')
    if sp_rows:
        print(f'Headers: {sp_rows[0]}')
    # Collect file names (Name column)
    if sp_rows and 'Name' in sp_rows[0]:
        name_col = sp_rows[0].index('Name')
        path_col = sp_rows[0].index('Path') if 'Path' in sp_rows[0] else -1
        names = [r[name_col] for r in sp_rows[1:] if name_col < len(r) and r[name_col]]
        paths = [r[path_col] for r in sp_rows[1:] if path_col >= 0 and path_col < len(r) and r[path_col]]
        sp_data[key] = {'names': names, 'paths': paths}
        print(f'File count: {len(names)}')
        print(f'Sample path: {paths[0] if paths else "N/A"}')
        print('All filenames:')
        for n in sorted(names):
            print(' ', n)
