/**
 * Mock user data for testing and development
 * This provides sample account information for team members testing the site
 */

export interface MockUserProfile {
  userId: string; // Clerk user ID
  companyName: string;
  accountNumber: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  shippingAddresses: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }>;
  orderHistory: Array<{
    orderId: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered';
    total: number;
    items: Array<{
      sku: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  }>;
  savedQuotes: Array<{
    quoteId: string;
    date: string;
    expiresAt: string;
    total: number;
    items: number;
  }>;
  preferences: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    newsletter: boolean;
  };
}

/**
 * Mock user data - add your team members' Clerk user IDs here
 */
export const MOCK_USER_DATA: Record<string, MockUserProfile> = {
  // BAPI Test Customer
  'user_37zABTP9A6DS7FEGh6wAFzZdfRg': {
    userId: 'user_37zABTP9A6DS7FEGh6wAFzZdfRg',
    companyName: 'BAPI Test Customer',
    accountNumber: 'ACCT-TEST-001',
    billingAddress: {
      street: '123 Main Street',
      city: 'Madison',
      state: 'WI',
      zip: '53703',
      country: 'US'
    },
    shippingAddresses: [
      {
        id: 'addr_1',
        label: 'Main Warehouse',
        street: '123 Main Street',
        city: 'Madison',
        state: 'WI',
        zip: '53703',
        country: 'US',
        isDefault: true
      },
      {
        id: 'addr_2',
        label: 'Secondary Location',
        street: '456 Oak Avenue',
        city: 'Milwaukee',
        state: 'WI',
        zip: '53202',
        country: 'US',
        isDefault: false
      }
    ],
    orderHistory: [
      {
        orderId: 'ORDER-20260105-001',
        date: '2026-01-05',
        status: 'delivered',
        total: 1250.00,
        items: [
          {
            sku: 'BA/10K-2-O-B',
            name: 'Temperature Sensor, Outdoor',
            quantity: 5,
            price: 250.00
          }
        ]
      },
      {
        orderId: 'ORDER-20260103-045',
        date: '2026-01-03',
        status: 'shipped',
        total: 875.50,
        items: [
          {
            sku: 'BA/HQX-D-C-X-XX-X',
            name: 'Humidity Sensor',
            quantity: 2,
            price: 437.75
          }
        ]
      },
      {
        orderId: 'ORDER-20251220-102',
        date: '2025-12-20',
        status: 'delivered',
        total: 3240.00,
        items: [
          {
            sku: 'BA/APSW1',
            name: 'Application Software',
            quantity: 1,
            price: 25.00
          },
          {
            sku: 'BA/10K-3-O-8',
            name: 'Temperature Sensor Pack',
            quantity: 10,
            price: 321.50
          }
        ]
      }
    ],
    savedQuotes: [
      {
        quoteId: 'QUOTE-20260107-A',
        date: '2026-01-07',
        expiresAt: '2026-02-07',
        total: 5430.00,
        items: 15
      },
      {
        quoteId: 'QUOTE-20251215-B',
        date: '2025-12-15',
        expiresAt: '2026-01-15',
        total: 2180.00,
        items: 8
      }
    ],
    preferences: {
      emailNotifications: true,
      orderUpdates: true,
      newsletter: false
    }
  },

  // Add more test users here
  // 'user_clerk_id_2': { ... },
};

/**
 * Get mock data for a user, or null if not found
 */
export function getMockUserData(userId: string): MockUserProfile | null {
  return MOCK_USER_DATA[userId] || null;
}

/**
 * Check if a user has mock data configured
 */
export function hasMockData(userId: string): boolean {
  return userId in MOCK_USER_DATA;
}

/**
 * In production, this would check an environment variable
 * For now, always return true in development
 */
export function isMockDataEnabled(): boolean {
  return process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true';
}
