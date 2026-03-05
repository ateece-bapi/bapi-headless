#!/bin/bash
# Fix duplicate <main> elements in all [locale] pages
# The layout already provides <main id="main-content">, so pages shouldn't have their own

set -e

echo "Fixing duplicate <main> elements..."

# Find all page.tsx files under [locale] that contain <main
pages=$(find src/app/\[locale\] -name "page.tsx" -exec grep -l "<main" {} \;)

# Configure portable in-place sed command (GNU vs BSD/macOS)
if sed --version 2>/dev/null | grep -q "GNU"; then
  SED_INPLACE=(sed -i)
else
  # BSD sed (e.g., macOS) requires an explicit (possibly empty) backup suffix
  SED_INPLACE=(sed -i '')
fi

for file in $pages; do
  echo "Fixing: $file"
  
  # Replace opening main tags with div or fragment
  # Pattern 1: <main className="..."> -> <div className="...">
  "${SED_INPLACE[@]}" 's/<main className="/<div className="/g' "$file"
  
  # Pattern 2: <main> -> <div>
  "${SED_INPLACE[@]}" 's/<main>/<div>/g' "$file"
  
  # Replace closing main tags
  "${SED_INPLACE[@]}" 's/<\/main>/<\/div>/g' "$file"
done

echo "✅ Fixed $(echo "$pages" | wc -l) files"
echo ""
echo "Changed <main> -> <div> in all [locale] pages"
echo "The layout's <main id=\"main-content\"> wrapper provides the semantic main landmark"
