#!/usr/bin/env node

import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql';

const GET_PRODUCT_BY_ID = `
  query GetProductVariations($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
      __typename
      ... on VariableProduct {
        id
        databaseId
        name
        attributes {
          nodes {
            id
            name
            label
            options
            variation
          }
        }
        variations(first: 500) {
          nodes {
            id
            databaseId
            name
            price
            attributes {
              nodes {
                name
                label
                value
              }
            }
          }
        }
      }
    }
  }
`;

async function testProduct(productId) {
  const client = new GraphQLClient(GRAPHQL_ENDPOINT);
  
  console.log(`🔍 Fetching product ID ${productId}...\n`);
  
  try {
    const result = await client.request(GET_PRODUCT_BY_ID, { id: productId });
    const product = result.product;
    
    if (!product) {
      console.error('❌ Product not found');
      return;
    }
    
    console.log(`✅ Product: ${product.name} (ID: ${product.databaseId})`);
    console.log(`   Type: ${product.__typename}\n`);
    
    console.log('📋 ATTRIBUTES:');
    product.attributes.nodes.forEach((attr, i) => {
      console.log(`\n${i + 1}. ${attr.label || attr.name}`);
      console.log(`   Name (slug): ${attr.name}`);
      console.log(`   Variation: ${attr.variation}`);
      console.log(`   Options count: ${attr.options?.length || 0}`);
      if (attr.options && attr.options.length > 0) {
        console.log(`   Options from attribute:`);
        attr.options.forEach((opt, j) => {
          console.log(`     ${j + 1}. "${opt}"`);
        });
      }
    });
    
    console.log(`\n\n📦 VARIATIONS: ${product.variations.nodes.length} total`);
    
    // Analyze valid combinations
    console.log(`\n\n🔍 ANALYZING VALID COMBINATIONS:`);
    
    const variationAttributes = product.attributes.nodes.filter(a => a.variation);
    console.log(`\nVariation attributes: ${variationAttributes.length}`);
    variationAttributes.forEach((attr, i) => {
      console.log(`  ${i + 1}. ${attr.label || attr.name} (${attr.options?.length || 0} options)`);
    });
    
    console.log(`\n📊 All ${product.variations.nodes.length} valid combinations:`);
    product.variations.nodes.forEach((variation, i) => {
      const config = variation.attributes.nodes
        .filter(a => variationAttributes.some(va => va.name.toLowerCase() === a.name.toLowerCase()))
        .map(a => `${a.name}: "${a.value}"`)
        .join(' | ');
      console.log(`${i + 1}. ${config}`);
    });
    
    console.log(`\n\n🔍 CHECKING FOR EMPTY DROPDOWNS:`);
    product.attributes.nodes.forEach((attr) => {
      // Collect actual values from variations
      const actualValues = new Set();
      product.variations.nodes.forEach((variation) => {
        const varAttr = variation.attributes.nodes.find(va => va.name === attr.name);
        if (varAttr?.value) {
          actualValues.add(varAttr.value);
        }
      });
      
      console.log(`\n${attr.label || attr.name}:`);
      console.log(`  Options from attribute: ${attr.options?.length || 0}`);
      console.log(`  Actual values from variations: ${actualValues.size}`);
      
      if (actualValues.size === 0) {
        console.log(`  ⚠️  WARNING: No values found in variations!`);
      } else if (actualValues.size !== attr.options?.length) {
        console.log(`  ⚠️  MISMATCH: Attribute has ${attr.options?.length}, variations have ${actualValues.size}`);
      } else {
        console.log(`  ✅ OK`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(JSON.stringify(error.response, null, 2));
    }
  }
}

const productId = process.argv[2] || '137299';
testProduct(productId);
