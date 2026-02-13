# Region Selector Testing Guide

**Branch**: `feature/mobile-region-language-selector`  
**Date**: February 13, 2026  
**Purpose**: Verify Region selector changes currency and persists correctly

---

## 🎯 What Should Happen When Region Changes

### **Expected Behavior**

1. **Currency Updates**: Prices should convert to the selected region's currency
2. **LocalStorage Persists**: Region choice saved to `bapi-region-storage`
3. **Page Refresh**: Region persists after refresh
4. **Smart Language Suggestion**: Toast suggests matching language (e.g., MENA → Arabic)
5. **Visual Feedback**: Dropdown shows current selection with flag

---

## 🧪 Test Scenarios

### **Test 1: Basic Region Change**

**Steps:**
1. Open: http://localhost:3000/en
2. Click **Region** dropdown (top-right, desktop)
3. Select **🇪🇺 Europe**
4. Check that dropdown shows: `🇪🇺 Europe`

**Expected Results:**
- ✅ Region dropdown displays "🇪🇺 Europe"
- ✅ Currency internally set to EUR (check localStorage)

**How to Verify:**
```javascript
// Open DevTools Console (F12)
JSON.parse(localStorage.getItem('bapi-region-storage'))

// Should show:
{
  "state": {
    "regionCode": "eu",
    "region": {
      "code": "eu",
      "name": "Europe",
      "currency": "EUR",
      "language": "en",
      "locale": "en-GB",
      "flag": "🇪🇺"
    },
    "languageCode": "en"
  },
  "version": 0
}
```

---

### **Test 2: Region Persistence After Refresh**

**Steps:**
1. Select **🌏 Asia Pacific**
2. Refresh page (F5 or Ctrl+R)
3. Check Region dropdown

**Expected Results:**
- ✅ Region still shows "🌏 Asia Pacific" after refresh
- ✅ Currency still SGD

**Fail Condition:**
- ❌ Region reverts to "🇺🇸 United States"
- ❌ Currency reverts to USD

---

### **Test 3: Smart Language Suggestion (MENA Region)**

**Steps:**
1. Ensure Language is **English**
2. Select **Region** → **🇦🇪 Middle East**
3. Look for toast notification (top-right corner)

**Expected Results:**
- ✅ Toast appears: "Switch to العربية for this region?"
- ✅ Toast has **[Switch]** button
- ✅ Clicking [Switch] changes language to Arabic
- ✅ URL changes to `/ar` (Arabic route)

**Fail Condition:**
- ❌ No toast appears
- ❌ Toast shows but button doesn't work

---

### **Test 4: Currency Display (If Prices Visible)**

**Test Page**: http://localhost:3000/en/region-test (if exists)  
**Alternative**: Any product page with prices

**Steps:**
1. Select **Region** → **🇺🇸 United States**
2. Note the product price (e.g., $149.99)
3. Select **Region** → **🇯🇵 Japan** (Currency: JPY)
4. Check if price updates

**Expected Results:**
- ✅ Price converts from USD to JPY
- ✅ Currency symbol changes from $ to ¥
- ✅ No decimals for JPY (¥22,357 not ¥22,357.00)

**Example Conversions** (at current exchange rates):

| USD | EUR | GBP | JPY | SGD | AED | VND |
|-----|-----|-----|-----|-----|-----|-----|
| $100 | €92 | £79 | ¥14,950 | S$134 | د.إ367 | ₫2,532,000 |

---

### **Test 5: Mobile Region Selector**

**Steps:**
1. Open Chrome DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Select "iPhone 14 Pro" or any mobile device
4. Look for globe button: `🌏 🇺🇸` in header (top-right)
5. Tap the globe button
6. Bottom sheet should slide up
7. Change region in the modal
8. Tap **Done**

**Expected Results:**
- ✅ Globe button visible on mobile
- ✅ Bottom sheet opens smoothly
- ✅ Region selector works in modal
- ✅ Current selection displays at bottom
- ✅ Region persists after closing modal
- ✅ Globe button shows new flag

---

### **Test 6: All Regions Work**

Test each region option:

| Region | Flag | Currency | Should Work? |
|--------|------|----------|--------------|
| United States | 🇺🇸 | USD ($) | ✅ Yes |
| Europe | 🇪🇺 | EUR (€) | ✅ Yes |
| Asia Pacific | 🌏 | SGD (S$) | ✅ Yes |
| Middle East | 🇦🇪 | AED (د.إ) | ✅ Yes (+ Arabic suggestion) |

**Steps:**
1. Select each region one by one
2. Check localStorage after each change
3. Verify flag updates in dropdown
4. Refresh page and verify persistence

---

## 🐛 Known Issues to Check

### **Issue 1: Region Not Persisting**

**Symptom**: Region resets to US after refresh

**Possible Causes:**
- localStorage not working (incognito mode?)
- Zustand persist middleware not configured
- Browser blocking storage

**Debug:**
```javascript
// Check if localStorage works
localStorage.setItem('test', 'works');
console.log(localStorage.getItem('test')); // Should show "works"

// Check if key exists
console.log(localStorage.getItem('bapi-region-storage'));
```

---

### **Issue 2: Toast Not Appearing**

**Symptom**: No language suggestion when switching to MENA

**Possible Causes:**
- Toast provider not mounted
- Language already Arabic (no suggestion needed)
- Toast dismissed too quickly

**Debug:**
1. Check if `ToastProvider` wraps the app
2. Open React DevTools → Check for toast component
3. Try switching to MENA multiple times

---

### **Issue 3: Currency Not Converting Prices**

**Symptom**: Prices don't change when region changes

**Possible Causes:**
- Prices hardcoded (not using `formatConvertedPrice`)
- Component not re-rendering on region change
- Using wrong currency prop

**Debug:**
```typescript
// Check if component gets region updates
const region = useRegion();
console.log('Current region:', region.currency); // Should update on change
```

**Fix Pattern:**
```typescript
// ❌ Wrong: Hardcoded currency
<span>${product.price}</span>

// ✅ Correct: Using region currency
import { useRegion } from '@/store/regionStore';
import { formatConvertedPrice } from '@/lib/utils/currency';

const region = useRegion();
<span>{formatConvertedPrice(product.priceUSD, region.currency)}</span>
```

---

## ✅ Testing Checklist

Before merging this branch, confirm:

### **Desktop Tests**
- [ ] Region dropdown opens on click
- [ ] All 4 regions selectable
- [ ] Flag emoji shows in dropdown
- [ ] Selected region persists after refresh
- [ ] localStorage contains correct region data
- [ ] MENA region shows Arabic suggestion toast
- [ ] Toast "Switch" button works
- [ ] No console errors when changing region

### **Mobile Tests**
- [ ] Globe button visible in header
- [ ] Globe button shows current region flag
- [ ] Bottom sheet opens on tap
- [ ] Region selector works in modal
- [ ] Current selection displays correctly
- [ ] Done button closes modal
- [ ] Region persists after closing modal

### **Currency Tests**
- [ ] Currency updates in localStorage
- [ ] Prices convert if visible on page
- [ ] Currency symbols correct per region
- [ ] Decimal places correct (0 for JPY/VND, 2 for others)

### **Edge Cases**
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in incognito/private mode
- [ ] Works after clearing localStorage
- [ ] Works on first visit (defaults to US)

---

## 🔍 Quick Debug Commands

### **Check Current Region State**
```javascript
// Open DevTools Console
window.localStorage.getItem('bapi-region-storage')
```

### **Reset Region to Default**
```javascript
// Clear region storage
localStorage.removeItem('bapi-region-storage');
location.reload();
```

### **Force Set Region**
```javascript
// Manually set region (for testing)
const regionData = {
  state: {
    regionCode: "asia",
    region: {
      code: "asia",
      name: "Asia Pacific", 
      currency: "SGD",
      language: "en",
      locale: "en-SG",
      flag: "🌏"
    },
    languageCode: "en"
  },
  version: 0
};
localStorage.setItem('bapi-region-storage', JSON.stringify(regionData));
location.reload();
```

### **Check If Prices Use Region Currency**
```javascript
// Search for currency usage in rendered HTML
document.body.innerHTML.includes('€') // Europe
document.body.innerHTML.includes('¥') // Japan
document.body.innerHTML.includes('S$') // Singapore
document.body.innerHTML.includes('د.إ') // UAE
```

---

## 📊 Test Page (If Available)

**URL**: http://localhost:3000/en/region-test

**What It Should Show:**
- Current region and currency
- Sample product prices in current currency
- Buttons to test all regions
- Real-time currency conversion examples

**If Page Doesn't Exist**: That's okay! Test with:
- Homepage (if prices visible)
- Any product page
- Cart page (if products added)

---

## 🚀 Expected Commit Status

**Current Branch**: `feature/mobile-region-language-selector`

**Commits:**
1. ✅ Mobile bottom sheet selector
2. ✅ Desktop flag emojis  
3. ✅ Jitter fix for hover effects

**Ready to Merge When:**
- All tests pass ✅
- No console errors
- Region persists correctly
- Mobile works smoothly

---

## 📝 Testing Notes Template

Use this to document your test results:

```
Date: February 13, 2026
Tester: [Your Name]
Browser: Chrome 121 / Firefox 122 / Safari 17
Device: Desktop / iPhone / iPad

Desktop Region Selector:
[ ] Opens on click
[ ] Shows all 4 regions
[ ] Persists after refresh
[ ] MENA toast works

Mobile Region Selector:
[ ] Globe button visible
[ ] Modal opens smoothly
[ ] Selection works
[ ] Persists correctly

Issues Found:
1. [None / Describe issue]
2. 

Notes:
- 
```

---

## 🎬 Next Steps After Testing

1. **If all tests pass** ✅
   - Merge branch to main
   - Push to production
   - Move to translation scaling phase

2. **If issues found** 🐛
   - Document issues in this file
   - Fix issues on this branch
   - Re-test
   - Then merge

---

**Test the region selector and report back what you find!** 🧪
