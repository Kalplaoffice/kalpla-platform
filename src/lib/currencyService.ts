// Multi-Currency Support Service

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to base currency (USD)
  decimalPlaces: number;
  isActive: boolean;
}

export interface CurrencyConversion {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  timestamp: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'net_banking' | 'wallet' | 'upi' | 'paypal';
  name: string;
  icon: string;
  isActive: boolean;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
}

class CurrencyService {
  private baseCurrency = 'INR';
  private exchangeRates: Map<string, number> = new Map();
  private lastUpdate: Date | null = null;
  private updateInterval = 30 * 60 * 1000; // 30 minutes

  // Supported currencies
  private currencies: Currency[] = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1, decimalPlaces: 2, isActive: true },
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.012, decimalPlaces: 2, isActive: true },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.011, decimalPlaces: 2, isActive: true },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.0095, decimalPlaces: 2, isActive: true },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.016, decimalPlaces: 2, isActive: true },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 0.018, decimalPlaces: 2, isActive: true },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 0.016, decimalPlaces: 2, isActive: true },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 1.8, decimalPlaces: 0, isActive: true },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 0.086, decimalPlaces: 2, isActive: true },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 0.044, decimalPlaces: 2, isActive: true }
  ];

  // Payment methods by region
  private paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      type: 'credit_card',
      name: 'Credit Card',
      icon: '💳',
      isActive: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'JPY', 'CNY', 'AED'],
      fees: { percentage: 2.9, fixed: 0.30 }
    },
    {
      id: 'debit_card',
      type: 'debit_card',
      name: 'Debit Card',
      icon: '💳',
      isActive: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'JPY', 'CNY', 'AED'],
      fees: { percentage: 2.5, fixed: 0.25 }
    },
    {
      id: 'net_banking',
      type: 'net_banking',
      name: 'Net Banking',
      icon: '🏦',
      isActive: true,
      supportedCurrencies: ['INR'],
      fees: { percentage: 1.5, fixed: 0 }
    },
    {
      id: 'upi',
      type: 'upi',
      name: 'UPI',
      icon: '📱',
      isActive: true,
      supportedCurrencies: ['INR'],
      fees: { percentage: 0.5, fixed: 0 }
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      isActive: true,
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      fees: { percentage: 3.4, fixed: 0.35 }
    },
    {
      id: 'wallet',
      type: 'wallet',
      name: 'Digital Wallet',
      icon: '👛',
      isActive: true,
      supportedCurrencies: ['USD', 'INR', 'EUR', 'GBP'],
      fees: { percentage: 1.8, fixed: 0.15 }
    }
  ];

  constructor() {
    this.initializeExchangeRates();
  }

  /**
   * Initialize exchange rates
   */
  private async initializeExchangeRates() {
    try {
      await this.updateExchangeRates();
    } catch (error) {
      console.error('Failed to initialize exchange rates:', error);
      // Use default rates
      this.currencies.forEach(currency => {
        this.exchangeRates.set(currency.code, currency.rate);
      });
    }
  }

  /**
   * Update exchange rates from external API
   */
  async updateExchangeRates(): Promise<void> {
    try {
      // Check if we need to update
      if (this.lastUpdate && Date.now() - this.lastUpdate.getTime() < this.updateInterval) {
        return;
      }

      // Use a free exchange rate API (replace with your preferred service)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();

      if (data.rates) {
        // Update exchange rates
        Object.entries(data.rates).forEach(([currency, rate]) => {
          this.exchangeRates.set(currency, rate as number);
        });

        // Update currency objects
        this.currencies.forEach(currency => {
          if (this.exchangeRates.has(currency.code)) {
            currency.rate = this.exchangeRates.get(currency.code) || currency.rate;
          }
        });

        this.lastUpdate = new Date();
        console.log('Exchange rates updated successfully');
      }
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      throw error;
    }
  }

  /**
   * Convert amount from one currency to another
   */
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): CurrencyConversion {
    if (fromCurrency === toCurrency) {
      return {
        from: fromCurrency,
        to: toCurrency,
        amount,
        convertedAmount: amount,
        rate: 1,
        timestamp: new Date().toISOString()
      };
    }

    const fromRate = this.exchangeRates.get(fromCurrency) || 1;
    const toRate = this.exchangeRates.get(toCurrency) || 1;
    const rate = toRate / fromRate;
    const convertedAmount = amount * rate;

    return {
      from: fromCurrency,
      to: toCurrency,
      amount,
      convertedAmount: this.roundToDecimalPlaces(convertedAmount, this.getDecimalPlaces(toCurrency)),
      rate,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Format amount with currency symbol
   */
  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.getCurrency(currencyCode);
    if (!currency) {
      return `${amount} ${currencyCode}`;
    }

    const formattedAmount = this.roundToDecimalPlaces(amount, currency.decimalPlaces);
    
    // Format number with appropriate decimal places
    const numberFormatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currency.decimalPlaces,
      maximumFractionDigits: currency.decimalPlaces
    });

    return `${currency.symbol}${numberFormatter.format(formattedAmount)}`;
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): Currency[] {
    return this.currencies.filter(currency => currency.isActive);
  }

  /**
   * Get currency by code
   */
  getCurrency(currencyCode: string): Currency | undefined {
    return this.currencies.find(currency => currency.code === currencyCode);
  }

  /**
   * Get payment methods for a specific currency/region
   */
  getPaymentMethods(currencyCode: string, region?: string): PaymentMethod[] {
    return this.paymentMethods.filter(method => 
      method.isActive && 
      method.supportedCurrencies.includes(currencyCode)
    );
  }

  /**
   * Calculate payment fees
   */
  calculatePaymentFees(amount: number, paymentMethod: PaymentMethod, currencyCode: string): number {
    const currency = this.getCurrency(currencyCode);
    if (!currency) return 0;

    const percentageFee = (amount * paymentMethod.fees.percentage) / 100;
    const fixedFee = paymentMethod.fees.fixed;
    
    // Convert fixed fee to target currency if needed
    const convertedFixedFee = currencyCode !== 'USD' 
      ? this.convertCurrency(fixedFee, 'USD', currencyCode).convertedAmount
      : fixedFee;

    return this.roundToDecimalPlaces(percentageFee + convertedFixedFee, currency.decimalPlaces);
  }

  /**
   * Get user's preferred currency based on location
   */
  getUserPreferredCurrency(userLocation?: string): string {
    const locationCurrencyMap: { [key: string]: string } = {
      'IN': 'INR',
      'US': 'USD',
      'GB': 'GBP',
      'CA': 'CAD',
      'AU': 'AUD',
      'SG': 'SGD',
      'JP': 'JPY',
      'CN': 'CNY',
      'AE': 'AED',
      'DE': 'EUR',
      'FR': 'EUR',
      'IT': 'EUR',
      'ES': 'EUR'
    };

    return locationCurrencyMap[userLocation || ''] || 'USD';
  }

  /**
   * Get regional payment preferences
   */
  getRegionalPaymentPreferences(region: string): {
    preferredCurrency: string;
    preferredPaymentMethods: string[];
    supportedCurrencies: string[];
  } {
    const regionalPreferences: { [key: string]: any } = {
      'IN': {
        preferredCurrency: 'INR',
        preferredPaymentMethods: ['upi', 'net_banking', 'debit_card', 'credit_card'],
        supportedCurrencies: ['INR', 'USD']
      },
      'US': {
        preferredCurrency: 'USD',
        preferredPaymentMethods: ['credit_card', 'debit_card', 'paypal'],
        supportedCurrencies: ['USD', 'EUR', 'GBP']
      },
      'EU': {
        preferredCurrency: 'EUR',
        preferredPaymentMethods: ['credit_card', 'debit_card', 'paypal'],
        supportedCurrencies: ['EUR', 'USD', 'GBP']
      },
      'GB': {
        preferredCurrency: 'GBP',
        preferredPaymentMethods: ['credit_card', 'debit_card', 'paypal'],
        supportedCurrencies: ['GBP', 'USD', 'EUR']
      }
    };

    return regionalPreferences[region] || regionalPreferences['US'];
  }

  /**
   * Round amount to specified decimal places
   */
  private roundToDecimalPlaces(amount: number, decimalPlaces: number): number {
    return Math.round(amount * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  }

  /**
   * Get decimal places for currency
   */
  private getDecimalPlaces(currencyCode: string): number {
    const currency = this.getCurrency(currencyCode);
    return currency?.decimalPlaces || 2;
  }

  /**
   * Get exchange rate between two currencies
   */
  getExchangeRate(fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return 1;
    
    const fromRate = this.exchangeRates.get(fromCurrency) || 1;
    const toRate = this.exchangeRates.get(toCurrency) || 1;
    
    return toRate / fromRate;
  }

  /**
   * Check if currency is supported
   */
  isCurrencySupported(currencyCode: string): boolean {
    return this.currencies.some(currency => 
      currency.code === currencyCode && currency.isActive
    );
  }

  /**
   * Get currency conversion history (mock implementation)
   */
  getConversionHistory(limit: number = 10): CurrencyConversion[] {
    // Mock conversion history - replace with actual database queries
    return [
      {
        from: 'USD',
        to: 'INR',
        amount: 100,
        convertedAmount: 8350,
        rate: 83.5,
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        from: 'EUR',
        to: 'USD',
        amount: 50,
        convertedAmount: 54.35,
        rate: 1.087,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      }
    ];
  }
}

export const currencyService = new CurrencyService();
export default currencyService;
