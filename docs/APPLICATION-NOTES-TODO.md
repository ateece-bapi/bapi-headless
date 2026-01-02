# Application Notes Integration - TODO

## Current Situation

The BAPI WordPress site has 57 Application Note articles that exist in the database but are **NOT exposed to GraphQL** yet.

From the database, we know:
- **Post Type**: `application_note` (custom post type)
- **Count**: 57 articles  
- **Taxonomy**: `application_note_category` 
- **Status**: Post type exists in WordPress DB but not registered with WPGraphQL

## Problem

The custom post type needs to be exposed to GraphQL. Currently:
- ❌ `applicationNotes` field doesn't exist in GraphQL schema
- ❌ Cannot query these posts from Next.js frontend
- ✅ Data exists in WordPress database
- ✅ Old site displays them properly

## Solutions (Choose One)

### Option A: Add WPGraphQL Show In setting (RECOMMENDED - No Plugin Needed)

If the post type was registered by a plugin or theme, you can expose it to GraphQL via WordPress Admin:

1. **Check if post type is registered**: Go to WordPress Admin and look for "Application Notes" in the menu
2. **If it exists**: The post type is already registered, just needs GraphQL exposure
3. **Enable GraphQL**:
   - Add this to your theme's `functions.php` or active child theme:
   
   ```php
   add_filter('register_post_type_args', function($args, $post_type) {
       if ($post_type === 'application_note') {
           $args['show_in_graphql'] = true;
           $args['graphql_single_name'] = 'applicationNote';
           $args['graphql_plural_name'] = 'applicationNotes';
       }
       return $args;
   }, 10, 2);
   
   add_filter('register_taxonomy_args', function($args, $taxonomy) {
       if ($taxonomy === 'application_note_category') {
           $args['show_in_graphql'] = true;
           $args['graphql_single_name'] = 'applicationNoteCategory';
           $args['graphql_plural_name'] = 'applicationNoteCategories';
       }
       return $args;
   }, 10, 2);
   ```

4. **Flush permalinks**: Go to Settings → Permalinks → Save

### Option B: Check Existing Plugin Settings

The application notes might be managed by an existing plugin. Check:
- Advanced Custom Fields (already installed)
- Any custom BAPI plugins
- Theme settings

Look for post type registration settings that might have a "Show in GraphQL" checkbox.

### Option C: Reinstall from Backup

If the old WordPress site is still available:
1. Export the application_note post type configuration
2. Re-register it with GraphQL enabled

## Implementation Timeline

**After GraphQL exposure is fixed:**

1. ✅ GraphQL query already created: `web/src/lib/graphql/queries/applicationNotes.graphql`
2. Run `npm run codegen` to generate TypeScript types
3. Build `/application-notes` list page
4. Build `/application-notes/[slug]` article pages  
5. Add CTA on Resources page
6. Update navigation

**Estimated time after GraphQL exposure**: 2-3 hours

## Next Steps

**USER ACTION REQUIRED**: 
1. Access your Kinsta WordPress Admin
2. Check if "Application Notes" appears in the admin menu
3. Report back what you find, and I'll provide specific instructions

## Files Ready

- ✅ `web/src/lib/graphql/queries/applicationNotes.graphql` - GraphQL query (will work once exposed)
- ⏳ Frontend pages (waiting for GraphQL exposure)
