#!/usr/bin/env node

/**
 * Test script to fetch product variations from WordPress GraphQL
 * Tests the ZPM product configuration data
 */

import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL || 'https://bapiheadlessstaging.kinsta.cloud/graphql';

const GET_PRODUCT_VARIATIONS = `
  query GetProductVariations($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
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
        variations {
          nodes {
            id
            databaseId
            name
            price
            regularPrice
            stockStatus
            partNumber
            sku
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

async function testVariations() {
  const client = new GraphQLClient(GRAPHQL_ENDPOINT);
  
  // Test with ZPM product (ID: 137933 on production, may differ on staging)
  // We'll use a product slug first to find the ID
  const FIND_PRODUCT = `
    query FindProduct($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        id
        databaseId
        name
        ... on VariableProduct {
          __typename
        }
      }
    }
  `;
  
  try {
    console.log('🔍 Looking for ZPM product...\n');
    
    const findResult = await client.request(FIND_PRODUCT, {
      slug: 'zpm-differential-pressure-sensor-field-selected-range-and-output'
    });
    
    if (!findResult.product) {
      console.error('❌ Product not found');
      return;
    }
    
    console.log(`✅ Found product:`);
    console.log(`   ID: ${findResult.product.databaseId}`);
    console.log(`   Name: ${findResult.product.name}`);
    console.log(`   Type: ${findResult.product.__typename || 'Unknown'}\n`);
    
    if (findResult.product.__typename !== 'VariableProduct') {
      console.log('⚠️  Not a variable product');
      return;
    }
    
    console.log('📊 Fetching variations...\n');
    
    const result = await client.request(GET_PRODUCT_VARIATIONS, {
      id: findResult.product.databaseId
    });
    
    const product = result.product;
    
    if (!product) {
      console.error('❌ No product data returned');
      return;
    }
    
    // Display attributes
    console.log('🏷️  Product Attributes:');
    if (product.attributes?.nodes) {
      product.attributes.nodes.forEach((attr, index) => {
        console.log(`\n  ${index + 1}. ${attr.label || attr.name}`);
        console.log(`     Name: ${attr.name}`);
        console.log(`     Is Variation: ${attr.variation}`);
        console.log(`     Options: ${attr.options?.length || 0}`);
        if (attr.options && attr.options.length > 0) {
          attr.options.forEach((opt, i) => {
            console.log(`       ${i + 1}. ${opt}`);
          });
        }
      });
    } else {
      console.log('   ⚠️  No attributes found');
    }
    
    // Display variations
    console.log(`\n\n📦 Product Variations: ${product.variations?.nodes?.length || 0} found`);
    if (product.variations?.nodes) {
      product.variations.nodes.slice(0, 3).forEach((variation, index) => {
        console.log(`\n  ${index + 1}. ${variation.name || variation.sku}`);
        console.log(`     SKU: ${variation.sku}`);
        console.log(`     Price: ${variation.price}`);
        console.log(`     Part Number: ${variation.partNumber || 'N/A'}`);
        console.log(`     Stock: ${variation.stockStatus}`);
        
        if (variation.attributes?.nodes) {
          console.log(`     Configuration:`);
          variation.attributes.nodes.forEach(attr => {
            console.log(`       - ${attr.label || attr.name}: ${attr.value}`);
          });
        }
      });
      
      if (product.variations.nodes.length > 3) {
        console.log(`\n  ... and ${product.variations.nodes.length - 3} more variations`);
      }
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
  }
}

testVariations();
