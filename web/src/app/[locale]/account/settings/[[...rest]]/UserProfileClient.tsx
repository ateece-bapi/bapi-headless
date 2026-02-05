'use client';

/**
 * User profile settings component
 * 
 * TODO: Implement custom profile editor after Clerk removal.
 * For now, shows placeholder message.
 */
export default function UserProfileClient() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-neutral-900 mb-4">Profile Settings</h2>
      <p className="text-neutral-600">
        Profile settings page is being rebuilt after Clerk removal.
      </p>
      <p className="text-neutral-600 mt-2">
        For now, please contact support to update your profile.
      </p>
    </div>
  );
}
