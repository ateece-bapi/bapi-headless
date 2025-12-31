#!/bin/bash
cd /home/ateece/bapi-headless/cms

echo "Installing WPGraphQL Smart Cache..."
wp plugin install wp-graphql-smart-cache --activate

echo "Installing Redis Cache..."
wp plugin install redis-cache --activate

echo "Installing WPGraphQL CORS..."
wp plugin install wp-graphql-cors --activate

echo "Installing Query Monitor..."
wp plugin install query-monitor --activate

echo "✅ All plugins installed!"
echo ""
echo "Next steps:"
echo "1. Check if Redis is running: redis-cli ping"
echo "2. Enable Redis: cd /home/ateece/bapi-headless/cms && wp redis enable"
echo "3. Configure Smart Cache: Settings → GraphQL → Cache"
echo "4. Configure CORS: Settings → GraphQL → CORS"
echo "5. Test performance: Load a product page"
