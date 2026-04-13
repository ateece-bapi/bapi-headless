#!/bin/bash
# Update remaining test user customer groups

WP_PATH="${WP_PATH:-/www/bapiheadlessstaging_582/public}"

echo "Finding and updating test users..."

# Find user IDs and update customer_group1 field
wp --path="$WP_PATH" user list --search='test-acs@bapihvac.com' --field=ID | while read user_id; do
    echo "Setting ACS for user $user_id"
    wp --path="$WP_PATH" user meta update "$user_id" customer_group1 'ACS'
done

wp --path="$WP_PATH" user list --search='test-emc@bapihvac.com' --field=ID | while read user_id; do
    echo "Setting EMC for user $user_id"
    wp --path="$WP_PATH" user meta update "$user_id" customer_group1 'EMC'
done

wp --path="$WP_PATH" user list --search='test-ccg@bapihvac.com' --field=ID | while read user_id; do
    echo "Setting CCG for user $user_id"
    wp --path="$WP_PATH" user meta update "$user_id" customer_group1 'CCG'
done

wp --path="$WP_PATH" user list --search='test-ccga@bapihvac.com' --field=ID | while read user_id; do
    echo "Setting CCGA for user $user_id"
    wp --path="$WP_PATH" user meta update "$user_id" customer_group1 'CCGA'
done

echo ""
echo "Verification:"
for email in test-alc@bapihvac.com test-acs@bapihvac.com test-emc@bapihvac.com test-ccg@bapihvac.com test-ccga@bapihvac.com; do
    user_id=$(wp --path="$WP_PATH" user list --search="$email" --field=ID)
    if [ -n "$user_id" ]; then
        group=$(wp --path="$WP_PATH" user meta get "$user_id" customer_group1 2>/dev/null || echo "NOT SET")
        echo "$email (ID: $user_id) -> customer_group1 = $group"
    fi
done

echo ""
echo "Clearing WordPress cache..."
wp --path="$WP_PATH" cache flush
