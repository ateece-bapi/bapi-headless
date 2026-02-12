'use client';

/**
 * User profile settings component
 *
 * TODO: Implement custom profile editor after Clerk removal.
 * For now, shows placeholder message.
 */
export default function UserProfileClient() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold text-neutral-900">Profile Settings</h2>
      <p className="text-neutral-600">
        Profile settings page is being rebuilt after Clerk removal.
      </p>
      <p className="mt-2 text-neutral-600">
        For now, please contact support to update your profile.
      </p>
    </div>
  );
}
