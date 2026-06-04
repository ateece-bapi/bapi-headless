# Temperature Sensors Landing Page - Required Images

**Created:** June 4, 2026  
**Branch:** `feat/temperature-sensors-landing-page`  
**Page Location:** `/temperature`

## Overview

Based on Elly's design layout (Web Page Temperature-01.png), we need product images for 12 different temperature sensor categories organized into two main sections.

---

## 1. Hero Section

### Main Hero Image
- **Path:** `/web/public/images/temperature/temperature-hero.png`
- **Dimensions:** 640x640px (recommended)
- **Description:** Collection of various temperature sensors similar to Elly's design showing different product types
- **Reference:** Use the design from `web/public/images/temperature/Web Page Temperature-01.png` (hero section)

---

## 2. Room Temperature Sensors (6 products)

### 2.1 BAC-Net Guardian Series
- **Path:** `/web/public/images/temperature/room/bacnet-guardian.png`
- **Product Slug:** `bacnet-guardian-series`
- **Description:** BACnet MS/TP or BACnet/IP room sensor with display

### 2.2 BAC-Net Guardian Slim
- **Path:** `/web/public/images/temperature/room/bacnet-slim.png`
- **Product Slug:** `bacnet-guardian-slim`
- **Description:** Slim profile BACnet MS/TP sensor

### 2.3 BAC-Wall-4
- **Path:** `/web/public/images/temperature/room/bac-wall-4.png`
- **Product Slug:** `bac-wall-4`
- **Description:** 4-pipe fan coil BACnet sensor with integrated fan control

### 2.4 Low Profile Button Series
- **Path:** `/web/public/images/temperature/room/low-profile.png`
- **Product Slug:** `low-profile-button-series`
- **Description:** Flush wall mount sensor with discrete design

### 2.5 Discrete Style Room Stat
- **Path:** `/web/public/images/temperature/room/discrete-style.png`
- **Product Slug:** `discrete-style-room-stat`
- **Description:** Room thermostat with decorator wallplate

### 2.6 Wall Plates
- **Path:** `/web/public/images/temperature/room/wall-plates.png`
- **Product Slug:** `wall-plates`
- **Description:** NEMA and decorator style wall plates

---

## 3. Non-Room Temperature Sensors (6 products)

### 3.1 Duct Sensors
- **Path:** `/web/public/images/temperature/nonroom/duct-sensors.png`
- **Product Slug:** `duct-sensors`
- **Description:** Direct mount duct temperature sensors

### 3.2 Averaging Sensors
- **Path:** `/web/public/images/temperature/nonroom/averaging.png`
- **Product Slug:** `averaging-sensors`
- **Description:** 5-40 ft averaging sensors for ducts and large areas

### 3.3 Immersion Sensors
- **Path:** `/web/public/images/temperature/nonroom/immersion.png`
- **Product Slug:** `immersion-sensors`
- **Description:** Brass or stainless steel immersion probes

### 3.4 Remote Probes
- **Path:** `/web/public/images/temperature/nonroom/remote-probes.png`
- **Product Slug:** `remote-probes`
- **Description:** Wall mount with remote probe capability

### 3.5 Temperature/Humidity Sensor
- **Path:** `/web/public/images/temperature/nonroom/temp-humidity.png`
- **Product Slug:** `temperature-humidity-sensor`
- **Description:** Combined temp/humidity for duct or outside air

### 3.6 Outside Air Sensors
- **Path:** `/web/public/images/temperature/nonroom/outside-air.png`
- **Product Slug:** `outside-air-sensors`
- **Description:** NEMA 4X outdoor rated sensors with optional sun shade

---

## Image Specifications

### General Guidelines
- **Format:** PNG (preferred) or JPG
- **Background:** Transparent or white (#FFFFFF)
- **Dimensions:** Consistent sizing for product cards (recommended: 400x400px minimum)
- **Quality:** High resolution for retina displays (2x pixel density)
- **Alignment:** Product centered in frame
- **Lighting:** Even lighting, professional product photography

### Image Usage
All images will be displayed in:
- 3-column grid on desktop (lg:grid-cols-3)
- 2-column grid on tablet (md:grid-cols-2)
- Single column on mobile
- Yellow accent bar below each image (already implemented in code)

---

## Reference Materials

**Original Design:** `/web/public/images/temperature/Web Page Temperature-01.png`
- Refer to this design for layout and styling reference
- Product arrangement matches the design's two-section layout

**Similar Implementation:** See `/web/src/app/[locale]/wireless/page.tsx` for reference
- Same layout pattern used for Wireless landing page
- Consistent card styling and grid structure

---

## Next Steps

1. **Source Product Images:**
   - Contact Graphics Designer (Elly) for optimized product images
   - Ensure images match naming convention above
   - Verify all 12 products are available

2. **Upload Images:**
   - Place images in appropriate directories:
     - Room sensors → `/web/public/images/temperature/room/`
     - Non-room sensors → `/web/public/images/temperature/nonroom/`
     - Hero image → `/web/public/images/temperature/`

3. **Test Page:**
   - Run `pnpm run dev` to test locally at `http://localhost:3000/temperature`
   - Verify all images load correctly
   - Check responsive behavior on mobile/tablet/desktop

4. **Alternative: Placeholder Images:**
   - If final images not ready, use temporary placeholders
   - Update filenames in `/web/src/app/[locale]/temperature/page.tsx` as needed

---

## Status

- ✅ Page component created
- ✅ Translations added (all 11 languages)
- ✅ Image directories created
- ✅ **Room sensor images downloaded and in place**
- ✅ **Non-room sensor images downloaded and in place**
- ✅ **Temporary hero image using Elly's design layout**
- ⏳ **Awaiting optimized hero image from Graphics Designer**
- ⏳ Testing and verification pending

## Current Image Mapping

### Room Sensors (✅ Complete)
1. BAC-Net Guardian Series → `Quantum-Temp-Main.png`
2. BAC-Net Guardian Slim → `Quantum-Slim-temp.png`
3. BAC-Wall-4 → `BAPIStat4MB.png`
4. Low Profile Button Series → `button_sensors.png`
5. Discrete Style Room Stat → `Decora-1.png`
6. Wall Plates → `WallPlates-1.png`

### Non-Room Sensors (✅ Complete)
1. Duct Sensors → `Duct_Trans_BBX_2020.png`
2. Averaging Sensors → `Duct_Avg_BBX.png`
3. Immersion Sensors → `Immersion_BBX_2020.png`
4. Remote Probes → `Remote_Probe_Trans_BBX.png`
5. Temperature/Humidity Sensor → `Thermobuffer_1inch_BB2_Blue.png`
6. Outside Air Sensors → `Outside_Air_Temp_BB_300pix.png`

### Hero Image (⏳ Pending)
- **Current:** Using `Web Page Temperature-01.png` (Elly's full design)
- **Needed:** Cropped/optimized hero image showing just the product collection
- **Recommended dimensions:** 640x640px or 1280x1280px (2x for retina)
