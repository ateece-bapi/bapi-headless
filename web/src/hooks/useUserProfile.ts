import { useAuth } from '@/hooks/useAuth';
import { getMockUserData, isMockDataEnabled, type MockUserProfile } from '@/lib/mock-user-data';

/**
 * Hook to get user profile data
 * Returns mock data in development, real data in production
 */
export function useUserProfile() {
  const { user, isLoaded, isSignedIn } = useAuth();
  
  // If mock data is enabled and user has mock data, return it
  if (isSignedIn && user && isMockDataEnabled()) {
    const mockData = getMockUserData(user.id);
    if (mockData) {
      return {
        isLoaded: true,
        isSignedIn: true,
        user,
        profile: mockData,
        isMockData: true
      };
    }
  }

  // In production, you would fetch real user data from your API/database here
  // For now, return null profile data
  return {
    isLoaded,
    isSignedIn,
    user,
    profile: null,
    isMockData: false
  };
}
