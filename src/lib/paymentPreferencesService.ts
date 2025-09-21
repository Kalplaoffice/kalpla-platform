// Payment Preferences Service

export interface PaymentPreference {
  id: string;
  userId: string;
  type: 'saved_card' | 'saved_account' | 'preferred_method' | 'currency_preference';
  name: string;
  data: any;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedCard {
  id: string;
  userId: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover';
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  isDefault: boolean;
  isActive: boolean;
  // Note: Never store actual card numbers or CVV
  token?: string; // Payment gateway token
}

export interface SavedAccount {
  id: string;
  userId: string;
  bankName: string;
  accountType: 'savings' | 'current';
  accountNumber: string; // Masked
  ifscCode: string;
  accountHolderName: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface PaymentMethodPreference {
  userId: string;
  preferredMethods: string[];
  defaultMethod: string;
  autoSelectMethod: boolean;
  rememberPaymentMethod: boolean;
  currencyPreferences: {
    [currency: string]: {
      preferredMethods: string[];
      defaultMethod: string;
    };
  };
}

class PaymentPreferencesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * Get user's payment preferences
   */
  async getPaymentPreferences(userId: string): Promise<PaymentMethodPreference> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/preferences/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payment preferences');
      }

      return data;
    } catch (error) {
      console.error('Payment preferences fetch error:', error);
      throw error;
    }
  }

  /**
   * Update payment preferences
   */
  async updatePaymentPreferences(userId: string, preferences: Partial<PaymentMethodPreference>): Promise<PaymentMethodPreference> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/preferences/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update payment preferences');
      }

      return data;
    } catch (error) {
      console.error('Payment preferences update error:', error);
      throw error;
    }
  }

  /**
   * Get saved payment methods
   */
  async getSavedPaymentMethods(userId: string): Promise<(SavedCard | SavedAccount)[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/methods/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch saved payment methods');
      }

      return data;
    } catch (error) {
      console.error('Saved payment methods fetch error:', error);
      throw error;
    }
  }

  /**
   * Save a new payment method
   */
  async savePaymentMethod(userId: string, methodData: Partial<SavedCard | SavedAccount>): Promise<SavedCard | SavedAccount> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/methods/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(methodData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save payment method');
      }

      return data;
    } catch (error) {
      console.error('Save payment method error:', error);
      throw error;
    }
  }

  /**
   * Update saved payment method
   */
  async updatePaymentMethod(userId: string, methodId: string, updates: Partial<SavedCard | SavedAccount>): Promise<SavedCard | SavedAccount> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/methods/${userId}/${methodId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update payment method');
      }

      return data;
    } catch (error) {
      console.error('Update payment method error:', error);
      throw error;
    }
  }

  /**
   * Delete saved payment method
   */
  async deletePaymentMethod(userId: string, methodId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/methods/${userId}/${methodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete payment method');
      }
    } catch (error) {
      console.error('Delete payment method error:', error);
      throw error;
    }
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/methods/${userId}/${methodId}/default`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set default payment method');
      }
    } catch (error) {
      console.error('Set default payment method error:', error);
      throw error;
    }
  }

  /**
   * Get payment method icon
   */
  getPaymentMethodIcon(methodType: string): string {
    const icons: { [key: string]: string } = {
      'visa': '💳',
      'mastercard': '💳',
      'amex': '💳',
      'discover': '💳',
      'net_banking': '🏦',
      'upi': '📱',
      'wallet': '👛',
      'paypal': '🅿️',
      'credit_card': '💳',
      'debit_card': '💳'
    };

    return icons[methodType] || '💳';
  }

  /**
   * Format card number for display
   */
  formatCardNumber(cardNumber: string): string {
    // Remove all non-digits
    const cleaned = cardNumber.replace(/\D/g, '');
    
    // Show only last 4 digits
    if (cleaned.length >= 4) {
      return '**** **** **** ' + cleaned.slice(-4);
    }
    
    return '**** **** **** ****';
  }

  /**
   * Format account number for display
   */
  formatAccountNumber(accountNumber: string): string {
    // Show only last 4 digits
    if (accountNumber.length >= 4) {
      return '****' + accountNumber.slice(-4);
    }
    
    return '****';
  }

  /**
   * Get payment method display name
   */
  getPaymentMethodDisplayName(method: SavedCard | SavedAccount): string {
    if ('cardType' in method) {
      // It's a saved card
      return `${method.cardType.toUpperCase()} •••• ${method.lastFour}`;
    } else {
      // It's a saved account
      return `${method.bankName} •••• ${method.accountNumber.slice(-4)}`;
    }
  }

  /**
   * Validate payment method data
   */
  validatePaymentMethodData(methodData: any, type: 'card' | 'account'): string[] {
    const errors: string[] = [];

    if (type === 'card') {
      if (!methodData.cardholderName) {
        errors.push('Cardholder name is required');
      }
      if (!methodData.expiryMonth || methodData.expiryMonth < 1 || methodData.expiryMonth > 12) {
        errors.push('Valid expiry month is required');
      }
      if (!methodData.expiryYear || methodData.expiryYear < new Date().getFullYear()) {
        errors.push('Valid expiry year is required');
      }
    } else if (type === 'account') {
      if (!methodData.bankName) {
        errors.push('Bank name is required');
      }
      if (!methodData.accountNumber) {
        errors.push('Account number is required');
      }
      if (!methodData.ifscCode) {
        errors.push('IFSC code is required');
      }
      if (!methodData.accountHolderName) {
        errors.push('Account holder name is required');
      }
    }

    return errors;
  }

  /**
   * Get recommended payment methods for user
   */
  getRecommendedPaymentMethods(userLocation?: string, currency?: string): string[] {
    const recommendations: { [key: string]: string[] } = {
      'IN': ['upi', 'net_banking', 'debit_card', 'credit_card'],
      'US': ['credit_card', 'debit_card', 'paypal'],
      'EU': ['credit_card', 'debit_card', 'paypal'],
      'GB': ['credit_card', 'debit_card', 'paypal'],
      'default': ['credit_card', 'debit_card']
    };

    return recommendations[userLocation || 'default'] || recommendations['default'];
  }

  /**
   * Check if payment method is supported for currency
   */
  isPaymentMethodSupportedForCurrency(methodType: string, currency: string): boolean {
    const supportedMethods: { [key: string]: string[] } = {
      'INR': ['upi', 'net_banking', 'debit_card', 'credit_card', 'wallet'],
      'USD': ['credit_card', 'debit_card', 'paypal'],
      'EUR': ['credit_card', 'debit_card', 'paypal'],
      'GBP': ['credit_card', 'debit_card', 'paypal'],
      'CAD': ['credit_card', 'debit_card', 'paypal'],
      'AUD': ['credit_card', 'debit_card', 'paypal']
    };

    return supportedMethods[currency]?.includes(methodType) || false;
  }

  /**
   * Get payment method fees
   */
  getPaymentMethodFees(methodType: string, currency: string): { percentage: number; fixed: number } {
    const fees: { [key: string]: { [key: string]: { percentage: number; fixed: number } } } = {
      'credit_card': {
        'INR': { percentage: 2.9, fixed: 2.5 },
        'USD': { percentage: 2.9, fixed: 0.30 },
        'EUR': { percentage: 2.9, fixed: 0.30 },
        'default': { percentage: 2.9, fixed: 0.30 }
      },
      'debit_card': {
        'INR': { percentage: 2.5, fixed: 2.0 },
        'USD': { percentage: 2.5, fixed: 0.25 },
        'EUR': { percentage: 2.5, fixed: 0.25 },
        'default': { percentage: 2.5, fixed: 0.25 }
      },
      'upi': {
        'INR': { percentage: 0.5, fixed: 0 },
        'default': { percentage: 0.5, fixed: 0 }
      },
      'net_banking': {
        'INR': { percentage: 1.5, fixed: 0 },
        'default': { percentage: 1.5, fixed: 0 }
      },
      'paypal': {
        'USD': { percentage: 3.4, fixed: 0.35 },
        'EUR': { percentage: 3.4, fixed: 0.35 },
        'GBP': { percentage: 3.4, fixed: 0.35 },
        'default': { percentage: 3.4, fixed: 0.35 }
      }
    };

    return fees[methodType]?.[currency] || fees[methodType]?.['default'] || { percentage: 0, fixed: 0 };
  }

  /**
   * Get authentication token
   */
  private getAuthToken(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  }
}

export const paymentPreferencesService = new PaymentPreferencesService();
export default paymentPreferencesService;
