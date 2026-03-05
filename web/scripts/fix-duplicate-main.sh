#!/bin/bash
# Fix duplicate <main> elements in all [locale] pages
# The layout already provides <main id="main-content">, so pages shouldn't have their own

set -e

echo "Fixing duplicate <main> elements..."

# Find all page.tsx files under [locale] that contain <main
pages=$(find src/app/\[locale\] -name "page.tsx" -exec grep -l "<main" {} \;)

for file in $pages; do
  echo "Fixing: $file"
  
  # Replace opening main tags with div or fragment
  # Pattern 1: <main className="..."> -> <div className="...">
  sed -i 's/<main className="/<div className="/g' "$file"
  
  # Pattern 2: <main> -> <div>
  sed -i 's/<main>/<div>/g' "$file"
  
  # Replace closing main tags
  sed -i 's/<\/main>/<\/div>/g' "$file"
done

echo "✅ Fixed $(echo "$pages" | wc -l) files"
echo ""
echo "Changed <main> -> <div> in all [locale] pages"
echo "The layout's <main id=\"main-content\"> wrapper provides the semantic main landmark"
