/**
 * Bulk Import WordPress/WooCommerce Users to Clerk
 * 
 * This script exports WordPress users and imports them to Clerk,
 * linking WordPress customer IDs for order history access.
 * 
 * Usage:
 * 1. Export users: wp user list --format=json > wordpress-users.json
 * 2. Set environment variables (CLERK_SECRET_KEY)
 * 3. Run: node scripts/bulk-import-users.mjs
 */

import fs from 'fs/promises';
import { Clerk } from '@clerk/clerk-sdk-node';

const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

async function importUsers() {
  try {
    // Read WordPress users export
    const usersData = await fs.readFile('./wordpress-users.json', 'utf-8');
    const wpUsers = JSON.parse(usersData);

    console.log(`Found ${wpUsers.length} WordPress users to import`);

    const results = {
      success: [],
      skipped: [],
      failed: [],
    };

    for (const wpUser of wpUsers) {
      try {
        // Skip admin and editor roles (they only need WordPress access)
        if (wpUser.roles?.includes('administrator') || wpUser.roles?.includes('editor')) {
          results.skipped.push({
            email: wpUser.user_email,
            reason: 'Admin/Editor role',
          });
          continue;
        }

        // Check if already exists in Clerk
        const existingUsers = await clerk.users.getUserList({
          emailAddress: [wpUser.user_email],
        });

        if (existingUsers.data.length > 0) {
          results.skipped.push({
            email: wpUser.user_email,
            reason: 'Already exists in Clerk',
          });
          continue;
        }

        // Create Clerk user without password (they'll set it on first login)
        const clerkUser = await clerk.users.createUser({
          emailAddress: [wpUser.user_email],
          firstName: wpUser.first_name || undefined,
          lastName: wpUser.last_name || undefined,
          username: wpUser.user_login || undefined,
          skipPasswordRequirement: true, // User will set password via email
          publicMetadata: {
            wordpressUserId: parseInt(wpUser.ID),
            wordpressCustomerId: parseInt(wpUser.ID), // WP user ID = customer ID
            importedAt: new Date().toISOString(),
            importedFrom: 'wordpress',
            roles: wpUser.roles || ['customer'],
          },
          privateMetadata: {
            wordpressRegistered: wpUser.user_registered,
          },
        });

        // Send password setup email
        await clerk.users.updateUser(clerkUser.id, {
          notify: true,
        });

        results.success.push({
          email: wpUser.user_email,
          clerkId: clerkUser.id,
          wpUserId: wpUser.ID,
        });

        console.log(`✓ Imported: ${wpUser.user_email}`);

        // Rate limit: Wait 100ms between API calls
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        results.failed.push({
          email: wpUser.user_email,
          error: error.message,
        });
        console.error(`✗ Failed: ${wpUser.user_email} - ${error.message}`);
      }
    }

    // Write results to file
    await fs.writeFile(
      './import-results.json',
      JSON.stringify(results, null, 2)
    );

    // Summary
    console.log('\n=== Import Summary ===');
    console.log(`✓ Successfully imported: ${results.success.length}`);
    console.log(`- Skipped: ${results.skipped.length}`);
    console.log(`✗ Failed: ${results.failed.length}`);
    console.log('\nDetailed results saved to: import-results.json');

  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Run import
importUsers();
