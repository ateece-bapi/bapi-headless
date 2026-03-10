// checkPartNumber.ts

import 'dotenv/config';
import { getProductBySlug } from './src/lib/graphql/queries';

console.log('GRAPHQL ENDPOINT:', process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL);

(async () => {
  try {
    const result = await getProductBySlug('water-leak-detector-with-a-rope-sensor');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error fetching product:', err);
  }
})();