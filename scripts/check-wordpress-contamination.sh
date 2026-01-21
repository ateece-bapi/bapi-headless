#!/bin/bash

# WordPress Style Contamination Checker
# Ensures NO WordPress styles leak into our Next.js frontend

echo "🔍 Checking for WordPress style contamination..."
echo ""

ERRORS=0

# Check 1: No WordPress classes in components
echo "✓ Checking for WordPress CSS classes..."
WP_CLASSES=$(grep -r 'className=".*wp-.*"' web/src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
if [ "$WP_CLASSES" -gt 0 ]; then
  echo "  ❌ Found $WP_CLASSES WordPress classes in components"
  grep -r 'className=".*wp-.*"' web/src --include="*.tsx" --include="*.ts" 2>/dev/null
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ No WordPress classes found"
fi

# Check 2: All dangerouslySetInnerHTML uses sanitization
echo ""
echo "✓ Checking content sanitization..."
UNSAFE_HTML=$(grep -r "dangerouslySetInnerHTML" web/src --include="*.tsx" | grep -v "sanitizeWordPressContent\|sanitizeDescription\|JSON.stringify" | wc -l)
if [ "$UNSAFE_HTML" -gt 0 ]; then
  echo "  ⚠️  Found $UNSAFE_HTML unsanitized HTML renders"
  grep -r "dangerouslySetInnerHTML" web/src --include="*.tsx" | grep -v "sanitizeWordPressContent\|sanitizeDescription\|JSON.stringify"
  echo "  Note: These should use sanitizeWordPressContent()"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ All HTML content is sanitized"
fi

# Check 3: No arbitrary color values (should use design tokens)
echo ""
echo "✓ Checking for arbitrary color values..."
ARBITRARY_COLORS=$(grep -r 'className=".*\[#[0-9a-fA-F]' web/src/components --include="*.tsx" 2>/dev/null | wc -l)
if [ "$ARBITRARY_COLORS" -gt 0 ]; then
  echo "  ⚠️  Found $ARBITRARY_COLORS arbitrary color values"
  echo "  Should use semantic tokens (primary-500, accent-500, etc.)"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✅ All colors use design tokens"
fi

# Check 4: No hardcoded inline styles
echo ""
echo "✓ Checking for inline styles..."
INLINE_STYLES=$(grep -r 'style={{' web/src/components web/src/app --include="*.tsx" | grep -v "sanitize\|test\|transform:\|zIndex:" | wc -l)
if [ "$INLINE_STYLES" -gt 5 ]; then
  echo "  ⚠️  Found $INLINE_STYLES inline style objects"
  echo "  Prefer Tailwind classes for consistency"
else
  echo "  ✅ Minimal inline styles (acceptable for dynamic values)"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ All checks passed! Clean architecture maintained."
  echo "   WordPress = CMS only, Next.js = Full presentation control"
  exit 0
else
  echo "⚠️  Found $ERRORS potential issues"
  echo "   Review and apply sanitization/design tokens as needed"
  exit 1
fi
