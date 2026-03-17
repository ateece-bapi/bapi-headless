#!/usr/bin/env node
/**
 * WordPress Category Analysis Script
 * Analyzes product attributes to determine optimal subcategory structure
 */

const query = `
  query AnalyzeAllProducts {
    products(first: 200) {
      nodes {
        id
        name
        slug
        attributes {
          nodes {
            id
            name
            options
          }
        }
        productCategories {
          nodes {
            name
            slug
            parent {
              node {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

async function analyzeProducts() {
  const graphqlUrl = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL;
  
  if (!graphqlUrl) {
    console.error('❌ NEXT_PUBLIC_WORDPRESS_GRAPHQL not set');
    console.log('Set it in .env.local or run:');
    console.log('export NEXT_PUBLIC_WORDPRESS_GRAPHQL="https://your-site.com/graphql"');
    process.exit(1);
  }

  console.log('🔍 Analyzing all products...\n');

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const { data } = await response.json();
    const allProducts = data?.products?.nodes || [];

    console.log(`📊 Found ${allProducts.length} total products\n`);

    // Filter for temperature products
    const tempProducts = allProducts.filter(product => {
      const cats = product.productCategories?.nodes || [];
      return cats.some(cat => 
        cat.slug?.includes('temperature') ||
        cat.parent?.node?.slug?.includes('temperature')
      );
    });
    
    console.log(`🌡️  Temperature products: ${tempProducts.length}\n`);

    // Group by subcategory
    const subcategoryBreakdown = {};
    const attributeBreakdown = {};
    
    tempProducts.forEach(product => {
      // Track subcategories
      const subcats = product.productCategories?.nodes.filter(cat => {
        const parentSlug = cat.parent?.node?.slug;
        return parentSlug && parentSlug.includes('temperature');
      }) || [];
      
      if (subcats.length > 0) {
        subcats.forEach(subcat => {
          const key = `${subcat.name} (${subcat.slug})`;
          subcategoryBreakdown[key] = (subcategoryBreakdown[key] || 0) + 1;
        });
      } else {
        subcategoryBreakdown['❌ No Subcategory'] = (subcategoryBreakdown['❌ No Subcategory'] || 0) + 1;
      }
      
      // Track applications
      const attributes = product.attributes?.nodes || [];
      const appAttr = attributes.find(a => 
        a.name?.toLowerCase().includes('application') ||
        a.name === 'pa_application'
      );
      
      if (appAttr?.options) {
        appAttr.options.forEach(option => {
          attributeBreakdown[option] = (attributeBreakdown[option] || 0) + 1;
        });
      } else {
        attributeBreakdown['❌ No Application'] = (attributeBreakdown['❌ No Application'] || 0) + 1;
      }
    });

    console.log('📂 Current Subcategory Distribution:\n');
    Object.entries(subcategoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat.padEnd(45)} ${count} products`);
      });

    console.log('\n📋 Application Attribute Distribution:\n');
    Object.entries(attributeBreakdown)
      .sort((a, b) => b[1] - a[1])
      .forEach(([attr, count]) => {
        console.log(`   ${attr.padEnd(40)} ${count} products`);
      });

    console.log('\n💡 Recommended Subcategories:\n');
    
    // Generate recommendations
    const recommendations = [];
    Object.keys(attributeBreakdown).forEach(attr => {
      const slug = attr.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      if (attr !== 'No Application Attribute') {
        recommendations.push({
          name: attr,
          slug: `temp-${slug}`,
          count: attributeBreakdown[attr],
        });
      }
    });

    recommendations.forEach(rec => {
      console.log(`   ├─ ${rec.name}`);
      console.log(`   │  Slug: ${rec.slug}`);
      console.log(`   │  Products: ${rec.count}`);
      console.log('   │');
    });

    console.log('\n✅ Analysis complete\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

analyzeProducts();
