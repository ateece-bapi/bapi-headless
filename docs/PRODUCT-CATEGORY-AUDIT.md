# Product Category & Navigation Audit

**Date:** January 30, 2026  
**Purpose:** Audit current WordPress product category structure and plan Next.js implementation  
**Source:** WordPress WP-CLI export from production site

---

## Category Hierarchy Overview

WordPress has **8 main product categories** with 3-level hierarchy:

```
Main Category (Level 1)
├── Subcategory (Level 2)
    └── Series/Type (Level 3)
```

---

## 1. Temperature Sensors (302)

**Total Products:** 115  
**URL:** `/products/temperature-sensors`  
**Subcategories:** 2 (Room, Non-Room)

### 1.1 Room (303) - 30 products
**URL:** `/products/temperature-sensors/temp-room`

**Series/Types (Level 3):**
- BAPI-Stat "Quantum" Series (413) - 5 products
- BAPI-Stat 4 (320) - 9 products  
- Delta Style (324) - 3 products
- Button Sensor (327) - 3 products
- Decora Style (326) - 2 products
- Wall Plates (314) - 8 products
- Transmitters (328) - 4 products

### 1.2 Non-Room (319) - 85 products
**URL:** `/products/temperature-sensors/temp-non-room`

**Series/Types (Level 3):**
- Duct (401) - 20 products
- Immersion (402) - 16 products
- Averaging (329) - 18 products
- Outside Air (403) - 7 products
- Strap (404) - 7 products
- Submersible (330) - 8 products
- Thermobuffer (405) - 5 products
- Remote Probes and Sensors (406) - 16 products
- Extreme Temperature (407) - 4 products
- Transmitters (341) - 26 products
- Replacement Probes (408) - 0 products ⚠️ Empty

---

## 2. Humidity Sensors (305)

**Total Products:** 33  
**URL:** `/products/humidity-sensors`  
**Subcategories:** 2 (Room, Non-Room)

### 2.1 Room (315) - 15 products
**URL:** `/products/humidity-sensors/humidity-room`

**Series/Types (Level 3):**
- BAPI-Stat "Quantum" Series (414) - 3 products
- BAPI-Stat 4 (333) - 6 products
- Delta Style (334) - 4 products

### 2.2 Non-Room (331) - 19 products
**URL:** `/products/humidity-sensors/humidity-non-room`

**Series/Types (Level 3):**
- Duct (399) - 10 products
- Outside Air (400) - 8 products

---

## 3. Pressure Sensors (306)

**Total Products:** 29  
**URL:** `/products/pressure-sensors`  
**No Level 2 subcategories** - All types are Level 2

**Types (Level 2):**
- Differential Pressure Switch (336) - 4 products
- Differential Pressure Sensors (335) - 7 products
- Pickup Ports and Probes (337) - 18 products

---

## 4. Wireless Sensors (310)

**Total Products:** 24  
**URL:** `/products/wireless-sensors`  
**Subcategories:** 2 systems

### 4.1 Wireless System - Bluetooth Low Energy (674) - 24 products
**URL:** `/products/wireless-sensors/bluetooth-wireless`

**Types (Level 3):**
- Gateway (678) - 1 product
- Receivers (677) - 1 product
- Output Modules (679) - 6 products
- Room (675) - 5 products
- Non-Room (676) - 7 products
- Food Probe (680) - 2 products
- Accessories (682) - 5 products

### 4.2 WAM - Wireless Asset Monitoring (348) - 0 products ⚠️ Empty
**URL:** `/products/wireless-sensors/wam-wireless-asset-monitoring1`  
**Note:** Has subcategories but no products

- WAM Local (349) - 0 products
- WAM Remote (409) - 0 products

---

## 5. Air Quality Sensors (307)

**Total Products:** 32  
**URL:** `/products/air-quality-sensors`  
**No Level 2 subcategories** - All types are Level 2

**Types (Level 2):**
- VOC (344) - 10 products
- Carbon Dioxide (345) - 7 products
- Particulate (636) - 2 products
- Nitrogen Dioxide (412) - 3 products
- Carbon Monoxide (346) - 7 products
- Refrigerant Leak Det. (347) - 3 products

---

## 6. ETA Line (309)

**Total Products:** 70  
**URL:** `/products/eta-line`  
**No subcategories**

---

## 7. Accessories (308)

**Total Products:** 74  
**URL:** `/products/accessories`  
**No subcategories**

---

## 8. Test Instruments (600)

**Total Products:** 3  
**URL:** `/products/test-instruments`  
**No subcategories**

---

## Routing Architecture

### Next.js App Router Structure

```
app/[locale]/products/
├── page.tsx                              # Main products landing (all categories)
├── [category]/
    ├── page.tsx                          # Category page (e.g., temperature-sensors)
    ├── [subcategory]/
        ├── page.tsx                      # Subcategory page (e.g., temp-room)
        └── [slug]/
            └── page.tsx                  # Individual product page
```

### URL Patterns

**Main Category:**
- `/products/temperature-sensors` → Shows subcategories (Room/Non-Room)
- Shows product grid + sidebar filters

**Subcategory:**
- `/products/temperature-sensors/temp-room` → Shows all Room temperature sensors
- Shows product grid + sidebar filters for series/types

**Product Series (Level 3):**
- Option 1: Filter on subcategory page (`?series=bapi-stat-quantum-series`)
- Option 2: Dedicated page `/products/temperature-sensors/temp-room/bapi-stat-quantum-series`

**Individual Product:**
- `/products/[slug]` (e.g., `/products/ba10k-2-duct-temperature-sensor`)

---

## Sidebar Filter Requirements

Based on screenshot and WordPress data, sidebar should include:

### 1. Subcategories (Always visible)
- "Room" / "Non-Room" clickable subcategory buttons with product counts
- Example: Room (30), Non-Room (85)

### 2. Temperature Application Filter (`pa_application`)
**WordPress taxonomy terms:**
- Duct Temp (29)
- Immersion (16)
- Averaging (17)
- Outside Air Temp (10)
- Extreme Temperature (4)
- Remote Probes and Sensors (18)
- Room Temp (27)
- Strap (6)
- Submersible (9)
- Thermobuffer Freezer/Cooler (8)

**Display:** Checkboxes with counts, collapsible section

### 3. Temperature Room Enclosure (`pa_room-enclosure-style`)
**WordPress taxonomy terms:**
- BAPI-Stat Quantum (5)
- BAPI-Stat 4 (7)
- Delta Style or RuP (2)
- Decora Style (2)
- Button Sensor (2)
- Wall Plates (4)
- BAPI-Com (0)

**Display:** Checkboxes with counts, collapsible section

### 4. Temperature Sensor/Output (`pa_temperature-sensor-output`)
**WordPress taxonomy terms:**
- Thermistor or RTD Temperature Output (64)
- 4-20mA/0-5V/0-10V Temperature (30)
- RTD Extreme Temperature (4)
- Modbus (2)
- Echelon (0)

**Display:** Checkboxes with counts, collapsible section

### 5. Display Options (`pa_display`)
**WordPress taxonomy terms:**
- Display (24)
- No Display (30)

**Display:** Radio buttons or checkboxes

---

## Humidity Sensor Filters

### 1. Humidity Application (`pa_humidity-application`)
**WordPress taxonomy terms:**
- Duct Humidity (12)
- Room Humidity (11)
- Outside Air Humidity (8)

### 2. Humidity Sensor Output (`pa_humidity-sensor-output`)
**WordPress taxonomy terms:**
- 4-20mA/0-5V/0-10V Humidity Output (7)
- Modbus Humidity Output (2)
- Echelon Humidity Output (0)

---

## Pressure Sensor Filters

### 1. Pressure Application (`pa_pressure-application`)
**WordPress taxonomy terms:**
- Pickup Ports, Probes and Accessories (17)
- Differential Pressure Sensor (7)
- Differential Pressure Switch (4)

---

## Air Quality Sensor Filters

### 1. Air Quality Sensor Type (`pa_air-quality-sensor-type`)
**WordPress taxonomy terms:**
- VOC (10)
- Carbon Monoxide (CO) (8)
- Carbon Dioxide (CO2) (7)
- Nitrogen Dioxide (NO2) (3)
- Refrigerant Leak (3)
- Particulate (2)

**Note:** Filters should dynamically show/hide based on selected category and available product attributes

---

## GraphQL Schema Additions Needed

### 1. Category Parent/Child Relationships
```graphql
query GetProductCategoryTree {
  productCategories(first: 100, where: { parent: 0 }) {
    nodes {
      id
      name
      slug
      count
      children {
        nodes {
          id
          name
          slug
          count
          children {
            nodes {
              id
              name
              slug
              count
            }
          }
        }
      }
    }
  }
}
```

### 2. Product Attributes for Sidebar Filters
```graphql
query GetProductAttributes {
  productAttributes {
    nodes {
      id
      name
      slug
      terms {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  }
}
```

### 3. Products by Category with Attributes
```graphql
query GetProductsByCategory($slug: String!, $first: Int = 20) {
  products(where: { category: $slug }, first: $first) {
    nodes {
      id
      name
      slug
      ... on SimpleProduct {
        price
        attributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
}
```

---

## Implementation Phases

### Phase 1: Basic Category Pages ✅ (Current)
- [x] Main products landing page (`/products`)
- [x] Simple category cards with mock data
- [x] Individual product pages working

### Phase 2: Category Hierarchy (Next)
- [ ] Dynamic category pages (`/products/[category]`)
- [ ] Subcategory pages (`/products/[category]/[subcategory]`)
- [ ] Category tree navigation
- [ ] GraphQL queries for category hierarchy

### Phase 3: Sidebar Filters
- [ ] Subcategory filter buttons (Room/Non-Room)
- [ ] Product attribute filters (Application, Type, Output, etc.)
- [ ] Filter state management (URL params)
- [ ] Filter count badges
- [ ] Clear filters button

### Phase 4: Product Grid Enhancement
- [ ] Sorting options (Name, Price, Newest)
- [ ] Pagination
- [ ] Grid/List view toggle
- [ ] Quick view modal
- [ ] Compare products feature

---

## Database Schema Notes

### WordPress Product Attributes (Custom Taxonomies) ✅ VERIFIED

**Temperature Sensors:**
- `pa_application` - Temperature Application (10 terms)
  - Duct Temp (29), Immersion (16), Averaging (17), Outside Air Temp (10)
  - Extreme Temperature (4), Remote Probes and Sensors (18), Room Temp (27)
  - Strap (6), Submersible (9), Thermobuffer Freezer/Cooler (8)
- `pa_room-enclosure-style` - Temperature Room Enclosure
- `pa_temperature-sensor-output` - Temperature Sensor/Output
- `pa_temp-setpoint-and-override` - Temp Setpoint and Override
- `pa_optional-temp-sensor-output` - Optional Temp Sensor & Output

**Humidity Sensors:**
- `pa_humidity-application` - Humidity Application
- `pa_humidity-room-enclosure` - Humidity Room Enclosure
- `pa_humidity-sensor-output` - Humidity Sensor Output
- `pa_optional-temp-humidity` - Optional Temp & Humidity

**Pressure Sensors:**
- `pa_pressure-application` - Pressure Application
- `pa_pressure-sensor-style` - Pressure Sensor Style

**Air Quality Sensors:**
- `pa_air-quality-application` - Air Quality Application
- `pa_air-quality-sensor-type` - Air Quality Sensor Type

**Wireless Sensors:**
- `pa_wireless-application` - Wireless Application

**General:**
- `pa_display` - Display options (used across multiple product types)

---

## Screenshots Reference

From current site (screenshot provided):
- **Main Layout:** Category header + Subcategory boxes (Room/Non-Room) + Product grid
- **Sidebar:** Filters with checkboxes, counts in parentheses
- **Product Cards:** Image, name, price, "Configure" button
- **Pagination:** Bottom of page

---

## Next Steps - Implementation Plan

### ✅ Phase 0: Audit Complete (DONE)
- [x] Map WordPress category hierarchy (8 main categories, 2-3 levels deep)
- [x] Identify all product attributes (13 taxonomies mapped)
- [x] Document sidebar filter requirements
- [x] Plan Next.js routing architecture

### 📋 Phase 1: GraphQL Schema Updates (Next)

**1. Update WPGraphQL queries to support:**
```graphql
# Add to products.graphql

query GetProductCategoryWithChildren($slug: ID!) {
  productCategory(id: $slug, idType: SLUG) {
    id
    name
    slug
    count
    description
    image { sourceUrl altText }
    parent { node { id name slug } }
    children {
      nodes {
        id
        name
        slug
        count
        image { sourceUrl altText }
      }
    }
  }
}

query GetProductAttributes {
  # Temperature attributes
  paApplicationTerms: terms(taxonomies: PA_APPLICATION, first: 100) {
    nodes { id name slug count }
  }
  paRoomEnclosureStyleTerms: terms(taxonomies: PA_ROOM_ENCLOSURE_STYLE, first: 100) {
    nodes { id name slug count }
  }
  paTemperatureSensorOutputTerms: terms(taxonomies: PA_TEMPERATURE_SENSOR_OUTPUT, first: 100) {
    nodes { id name slug count }
  }
  paDisplayTerms: terms(taxonomies: PA_DISPLAY, first: 100) {
    nodes { id name slug count }
  }
  
  # Humidity attributes
  paHumidityApplicationTerms: terms(taxonomies: PA_HUMIDITY_APPLICATION, first: 100) {
    nodes { id name slug count }
  }
  
  # Add others as needed...
}

query GetProductsWithFilters(
  $categorySlug: String!
  $application: [String]
  $enclosure: [String]
  $output: [String]
  $display: [String]
  $first: Int = 20
  $after: String
) {
  products(
    where: {
      category: $categorySlug
      taxonomyFilter: {
        filters: [
          { taxonomy: PA_APPLICATION, terms: $application }
          { taxonomy: PA_ROOM_ENCLOSURE_STYLE, terms: $enclosure }
          { taxonomy: PA_TEMPERATURE_SENSOR_OUTPUT, terms: $output }
          { taxonomy: PA_DISPLAY, terms: $display }
        ]
      }
    }
    first: $first
    after: $after
  ) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id
      name
      slug
      price
      image { sourceUrl altText }
      ... on SimpleProduct {
        attributes {
          nodes {
            name
            options
          }
        }
      }
    }
  }
}
```

**2. Run GraphQL codegen:**
```bash
cd web
pnpm run codegen
```

### 🎨 Phase 2: Create Category Page Components

**File structure:**
```
web/src/app/[locale]/products/
├── [category]/
│   ├── page.tsx                    # Category landing (shows subcategories)
│   ├── loading.tsx                 # Loading skeleton
│   ├── error.tsx                   # Error boundary
│   └── [subcategory]/
│       ├── page.tsx                # Subcategory products grid
│       ├── loading.tsx
│       └── error.tsx

web/src/components/products/
├── CategoryHeader.tsx              # Category hero section
├── SubcategoryGrid.tsx             # Room/Non-Room cards
├── ProductSidebar/
│   ├── index.tsx                   # Main sidebar component
│   ├── SubcategoryFilter.tsx       # Room/Non-Room toggle buttons
│   ├── AttributeFilter.tsx         # Generic checkbox filter
│   ├── FilterGroup.tsx             # Collapsible filter section
│   └── ClearFilters.tsx            # Reset button
├── ProductGrid/
│   ├── index.tsx                   # Product grid layout
│   ├── ProductCard.tsx             # Individual product card
│   ├── ProductCardSkeleton.tsx     # Loading state
│   └── GridControls.tsx            # Sort, view toggle, per-page
└── Pagination.tsx                  # Pagination controls
```

**Component examples:**

```tsx
// CategoryHeader.tsx
export function CategoryHeader({ category }) {
  return (
    <section className="bg-gradient-to-r from-primary-700 via-primary-500 to-primary-700 text-white py-16">
      <div className="max-w-container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-xl text-primary-50">{category.description}</p>
        <div className="mt-4 text-sm">
          {category.count} products available
        </div>
      </div>
    </section>
  );
}

// SubcategoryGrid.tsx
export function SubcategoryGrid({ subcategories }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {subcategories.map(sub => (
        <Link 
          key={sub.id}
          href={`/products/${category.slug}/${sub.slug}`}
          className="group border-2 border-neutral-200 rounded-xl p-8 hover:border-primary-500"
        >
          <h3 className="text-2xl font-bold mb-2">{sub.name}</h3>
          <p className="text-neutral-600">{sub.count} products</p>
        </Link>
      ))}
    </div>
  );
}

// ProductSidebar/index.tsx
export function ProductSidebar({ 
  category, 
  subcategories, 
  attributes, 
  filters, 
  onFilterChange 
}) {
  return (
    <aside className="w-full lg:w-64 space-y-6">
      {subcategories && (
        <SubcategoryFilter 
          subcategories={subcategories}
          selected={filters.subcategory}
          onChange={onFilterChange}
        />
      )}
      
      {attributes.map(attr => (
        <FilterGroup key={attr.slug} title={attr.label}>
          <AttributeFilter
            attribute={attr}
            selected={filters[attr.slug] || []}
            onChange={(values) => onFilterChange(attr.slug, values)}
          />
        </FilterGroup>
      ))}
      
      <ClearFilters onClick={() => onFilterChange('clear')} />
    </aside>
  );
}
```

### 🔧 Phase 3: State Management & URL Params

**Use Next.js searchParams for filters:**
```tsx
// app/[locale]/products/[category]/[subcategory]/page.tsx
export default async function SubcategoryPage({ 
  params, 
  searchParams 
}: {
  params: { category: string; subcategory: string }
  searchParams: { 
    application?: string[]
    enclosure?: string[]
    output?: string[]
    page?: string
  }
}) {
  // Parse filters from URL
  const filters = {
    application: Array.isArray(searchParams.application) 
      ? searchParams.application 
      : searchParams.application ? [searchParams.application] : [],
    enclosure: Array.isArray(searchParams.enclosure)
      ? searchParams.enclosure
      : searchParams.enclosure ? [searchParams.enclosure] : [],
    // ... etc
  };
  
  // Fetch products with filters
  const { data } = await getProductsWithFilters({
    categorySlug: params.subcategory,
    ...filters,
    first: 20,
  });
  
  return (
    <div className="flex gap-8">
      <ProductSidebar 
        filters={filters}
        attributes={getAttributesForCategory(params.category)}
      />
      <ProductGrid products={data.products.nodes} />
    </div>
  );
}
```

**URL format:**
```
/products/temperature-sensors/temp-room?application=room-temp&enclosure=bapi-stat-quantum&display=display&page=1
```

### 🧪 Phase 4: Testing & Validation

**Test cases:**
- [ ] Category page loads with subcategories
- [ ] Subcategory page shows filtered products
- [ ] Sidebar filters update URL params
- [ ] URL params persist on page refresh
- [ ] Filter counts update dynamically
- [ ] Clear filters resets to base URL
- [ ] Pagination works with filters
- [ ] Mobile responsive sidebar (drawer)
- [ ] Loading states for all async operations
- [ ] Error boundaries catch GraphQL failures

### 📱 Phase 5: Mobile Optimization

**Sidebar → Drawer on mobile:**
```tsx
// Mobile: Floating "Filters" button opens drawer
<button className="lg:hidden fixed bottom-4 right-4 bg-primary-500 text-white px-6 py-3 rounded-full shadow-lg">
  Filters ({activeFilterCount})
</button>

// Drawer slides in from left/bottom
<Drawer open={showFilters} onClose={() => setShowFilters(false)}>
  <ProductSidebar {...props} />
</Drawer>
```

---

## Timeline Estimate

**Phase 1: GraphQL (1-2 days)**
- Update queries
- Run codegen
- Test in GraphiQL

**Phase 2: Components (3-4 days)**
- Build category/subcategory pages
- Create sidebar components
- Product grid with cards
- Pagination

**Phase 3: State Management (2-3 days)**
- URL param handling
- Filter logic
- Clear filters
- Count updates

**Phase 4: Testing (2-3 days)**
- Unit tests
- Integration tests
- Manual QA
- Mobile testing

**Phase 5: Polish (1-2 days)**
- Loading states
- Error states
- Animations
- Accessibility

**Total: 9-14 days** (2-3 weeks)

---

**Status:** 📋 Audit Complete - Ready for implementation planning  
**Blockers:** Need product attribute list from WordPress  
**Next Milestone:** Phase 2 - Dynamic category pages with hierarchy
