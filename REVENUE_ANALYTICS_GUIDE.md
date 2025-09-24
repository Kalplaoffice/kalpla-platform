# Revenue Analytics - Per-Course, Per-Degree & Overall Growth

This document provides a comprehensive guide for the Kalpla revenue analytics system that tracks per-course, per-degree, and overall growth metrics.

## Overview

The revenue analytics system provides:
- **Per-Course Revenue Tracking**: Monitor revenue from individual courses
- **Per-Degree Revenue Analytics**: Track revenue from degree programs
- **Overall Growth Analytics**: Analyze overall revenue growth trends
- **Revenue Forecasting**: Predict future revenue based on historical data
- **Growth Metrics**: Track key growth indicators and KPIs
- **Revenue Sources**: Analyze revenue by different sources
- **Regional Analytics**: Track revenue by geographic regions
- **Channel Analytics**: Monitor revenue by marketing channels

## Architecture

```
Frontend (React) → Revenue Analytics Service → GraphQL API Gateway
                                              ↓
                                      Lambda Functions
                                              ↓
                                          DynamoDB Tables
```

## Components

### 1. Revenue Analytics Service (`revenueAnalyticsService.ts`)

**Location**: `src/lib/revenueAnalyticsService.ts`

**Features**:
- Per-course revenue tracking
- Per-degree revenue analytics
- Overall growth analytics
- Revenue forecasting
- Growth metrics calculation
- Revenue source analysis
- Regional and channel analytics

**Key Methods**:
- `getRevenueAnalytics()`: Get comprehensive revenue analytics
- `getCourseRevenue()`: Get course-specific revenue data
- `getDegreeRevenue()`: Get degree-specific revenue data
- `getRevenueTransactions()`: Get revenue transaction data
- `getRevenueGrowth()`: Get revenue growth trends
- `getRevenueForecast()`: Get revenue forecasts
- `generateRevenueReport()`: Generate comprehensive revenue report
- `calculateRevenueGrowthRate()`: Calculate growth rates
- `calculateAverageRevenuePerUser()`: Calculate ARPU
- `calculateCustomerLifetimeValue()`: Calculate CLV

### 2. Revenue Analytics Dashboard (`RevenueAnalyticsDashboard.tsx`)

**Location**: `src/components/revenue/RevenueAnalyticsDashboard.tsx`

**Features**:
- Multi-tab analytics interface
- Per-course revenue visualization
- Per-degree revenue tracking
- Overall growth analytics
- Revenue forecasting
- Growth trends analysis

## Database Schema

### DynamoDB Tables

#### 1. Revenue Analytics Table (`REVENUE_ANALYTICS_TABLE`)
```json
{
  "id": "period",
  "period": "daily|weekly|monthly|quarterly|yearly",
  "totalRevenue": "number",
  "grossRevenue": "number",
  "netRevenue": "number",
  "refunds": "number",
  "discounts": "number",
  "taxes": "number",
  "currency": "string",
  "revenueBySource": {
    "courseSales": "number",
    "degreeEnrollments": "number",
    "subscriptions": "number",
    "certifications": "number",
    "consulting": "number",
    "partnerships": "number",
    "other": "number"
  },
  "revenueByCourse": [
    {
      "courseId": "string",
      "courseName": "string",
      "totalRevenue": "number",
      "enrollments": "number",
      "averagePrice": "number",
      "refunds": "number",
      "netRevenue": "number",
      "growthRate": "number",
      "revenuePerStudent": "number",
      "conversionRate": "number"
    }
  ],
  "revenueByDegree": [
    {
      "degreeId": "string",
      "degreeName": "string",
      "totalRevenue": "number",
      "enrollments": "number",
      "averagePrice": "number",
      "refunds": "number",
      "netRevenue": "number",
      "growthRate": "number",
      "revenuePerStudent": "number",
      "completionRate": "number"
    }
  ],
  "revenueByRegion": [
    {
      "region": "string",
      "totalRevenue": "number",
      "enrollments": "number",
      "averagePrice": "number",
      "growthRate": "number",
      "marketShare": "number"
    }
  ],
  "revenueByChannel": [
    {
      "channel": "string",
      "totalRevenue": "number",
      "enrollments": "number",
      "averagePrice": "number",
      "growthRate": "number",
      "conversionRate": "number",
      "costPerAcquisition": "number"
    }
  ],
  "growthMetrics": {
    "revenueGrowthRate": "number",
    "enrollmentGrowthRate": "number",
    "averageRevenuePerUser": "number",
    "customerLifetimeValue": "number",
    "monthlyRecurringRevenue": "number",
    "annualRecurringRevenue": "number",
    "churnRate": "number",
    "retentionRate": "number",
    "expansionRevenue": "number",
    "newCustomerRevenue": "number"
  },
  "forecastMetrics": {
    "nextMonthRevenue": "number",
    "nextQuarterRevenue": "number",
    "nextYearRevenue": "number",
    "confidenceLevel": "number",
    "growthTrend": "string",
    "seasonalFactors": [
      {
        "month": "string",
        "factor": "number",
        "description": "string"
      }
    ]
  },
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

#### 2. Revenue Transactions Table (`REVENUE_TRANSACTIONS_TABLE`)
```json
{
  "id": "transactionId",
  "transactionId": "string",
  "studentId": "string",
  "studentName": "string",
  "courseId": "string",
  "courseName": "string",
  "degreeId": "string",
  "degreeName": "string",
  "amount": "number",
  "currency": "string",
  "transactionType": "course_purchase|degree_enrollment|subscription|certification|consulting|partnership|refund|discount",
  "paymentMethod": "credit_card|debit_card|paypal|bank_transfer|crypto|installment|scholarship|other",
  "status": "pending|completed|failed|refunded|cancelled",
  "region": "string",
  "channel": "string",
  "discountApplied": "number",
  "taxAmount": "number",
  "netAmount": "number",
  "refundAmount": "number",
  "refundDate": "ISO string",
  "transactionDate": "ISO string",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

## Usage

### 1. Basic Revenue Analytics

```typescript
import { revenueAnalyticsService } from '@/lib/revenueAnalyticsService';

// Get revenue analytics
const analytics = await revenueAnalyticsService.getRevenueAnalytics('monthly');

// Get course revenue
const courseRevenue = await revenueAnalyticsService.getCourseRevenue(courseId);

// Get degree revenue
const degreeRevenue = await revenueAnalyticsService.getDegreeRevenue(degreeId);
```

### 2. Revenue Growth Analysis

```typescript
// Get revenue growth trends
const growthTrends = await revenueAnalyticsService.getRevenueGrowth('monthly');

// Calculate revenue growth rate
const growthRate = revenueAnalyticsService.calculateRevenueGrowthRate(
  currentRevenue, 
  previousRevenue
);

// Generate revenue report
const report = await revenueAnalyticsService.generateRevenueReport(
  startDate, 
  endDate, 
  'monthly'
);
```

### 3. Revenue Forecasting

```typescript
// Get revenue forecast
const forecast = await revenueAnalyticsService.getRevenueForecast('monthly');

// Calculate revenue forecast
const forecastData = revenueAnalyticsService.calculateRevenueForecast(
  historicalData, 
  seasonalFactors
);
```

## Analytics Features

### 1. Per-Course Revenue Tracking

#### Course Revenue Calculation
```typescript
const calculateCourseRevenue = (transactions: RevenueTransaction[]): CourseRevenueSummary[] => {
  const courseMap = new Map<string, CourseRevenueSummary>();

  transactions
    .filter(t => t.courseId && t.status === 'completed')
    .forEach(transaction => {
      const courseId = transaction.courseId!;
      
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          courseId,
          courseName: transaction.courseName || 'Unknown Course',
          totalRevenue: 0,
          enrollments: 0,
          averagePrice: 0,
          refunds: 0,
          netRevenue: 0,
          growthRate: 0,
          revenuePerStudent: 0,
          conversionRate: 0
        });
      }

      const course = courseMap.get(courseId)!;
      course.totalRevenue += transaction.amount;
      course.enrollments += 1;
      course.refunds += transaction.refundAmount || 0;
    });

  // Calculate derived metrics
  courseMap.forEach(course => {
    course.averagePrice = course.totalRevenue / course.enrollments;
    course.netRevenue = course.totalRevenue - course.refunds;
    course.revenuePerStudent = course.netRevenue / course.enrollments;
  });

  return Array.from(courseMap.values());
};
```

#### Course Performance Analysis
```typescript
const analyzeCoursePerformance = (courses: CourseRevenueSummary[]) => {
  const analysis = {
    topPerformers: courses
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10),
    highGrowthCourses: courses
      .filter(c => c.growthRate > 20)
      .sort((a, b) => b.growthRate - a.growthRate),
    lowPerformingCourses: courses
      .filter(c => c.totalRevenue < 10000)
      .sort((a, b) => a.totalRevenue - b.totalRevenue),
    averageMetrics: {
      averageRevenue: courses.reduce((sum, c) => sum + c.totalRevenue, 0) / courses.length,
      averageEnrollments: courses.reduce((sum, c) => sum + c.enrollments, 0) / courses.length,
      averagePrice: courses.reduce((sum, c) => sum + c.averagePrice, 0) / courses.length
    }
  };

  return analysis;
};
```

### 2. Per-Degree Revenue Analytics

#### Degree Revenue Calculation
```typescript
const calculateDegreeRevenue = (transactions: RevenueTransaction[]): DegreeRevenueSummary[] => {
  const degreeMap = new Map<string, DegreeRevenueSummary>();

  transactions
    .filter(t => t.degreeId && t.status === 'completed')
    .forEach(transaction => {
      const degreeId = transaction.degreeId!;
      
      if (!degreeMap.has(degreeId)) {
        degreeMap.set(degreeId, {
          degreeId,
          degreeName: transaction.degreeName || 'Unknown Degree',
          totalRevenue: 0,
          enrollments: 0,
          averagePrice: 0,
          refunds: 0,
          netRevenue: 0,
          growthRate: 0,
          revenuePerStudent: 0,
          completionRate: 0
        });
      }

      const degree = degreeMap.get(degreeId)!;
      degree.totalRevenue += transaction.amount;
      degree.enrollments += 1;
      degree.refunds += transaction.refundAmount || 0;
    });

  // Calculate derived metrics
  degreeMap.forEach(degree => {
    degree.averagePrice = degree.totalRevenue / degree.enrollments;
    degree.netRevenue = degree.totalRevenue - degree.refunds;
    degree.revenuePerStudent = degree.netRevenue / degree.enrollments;
  });

  return Array.from(degreeMap.values());
};
```

#### Degree Performance Analysis
```typescript
const analyzeDegreePerformance = (degrees: DegreeRevenueSummary[]) => {
  const analysis = {
    topPerformingDegrees: degrees
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5),
    highCompletionDegrees: degrees
      .filter(d => d.completionRate > 80)
      .sort((a, b) => b.completionRate - a.completionRate),
    lowPerformingDegrees: degrees
      .filter(d => d.totalRevenue < 50000)
      .sort((a, b) => a.totalRevenue - b.totalRevenue),
    averageMetrics: {
      averageRevenue: degrees.reduce((sum, d) => sum + d.totalRevenue, 0) / degrees.length,
      averageEnrollments: degrees.reduce((sum, d) => sum + d.enrollments, 0) / degrees.length,
      averageCompletionRate: degrees.reduce((sum, d) => sum + d.completionRate, 0) / degrees.length
    }
  };

  return analysis;
};
```

### 3. Overall Growth Analytics

#### Growth Rate Calculation
```typescript
const calculateRevenueGrowthRate = (currentRevenue: number, previousRevenue: number): number => {
  if (previousRevenue === 0) return 0;
  return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
};
```

#### Growth Metrics Analysis
```typescript
const analyzeGrowthMetrics = (analytics: RevenueAnalytics) => {
  const growthAnalysis = {
    revenueGrowth: analytics.growthMetrics.revenueGrowthRate,
    enrollmentGrowth: analytics.growthMetrics.enrollmentGrowthRate,
    averageRevenuePerUser: analytics.growthMetrics.averageRevenuePerUser,
    customerLifetimeValue: analytics.growthMetrics.customerLifetimeValue,
    monthlyRecurringRevenue: analytics.growthMetrics.monthlyRecurringRevenue,
    annualRecurringRevenue: analytics.growthMetrics.annualRecurringRevenue,
    churnRate: analytics.growthMetrics.churnRate,
    retentionRate: analytics.growthMetrics.retentionRate,
    expansionRevenue: analytics.growthMetrics.expansionRevenue,
    newCustomerRevenue: analytics.growthMetrics.newCustomerRevenue
  };

  return growthAnalysis;
};
```

### 4. Revenue Forecasting

#### Forecast Calculation
```typescript
const calculateRevenueForecast = (
  historicalData: GrowthTrend[],
  seasonalFactors: SeasonalFactor[]
): RevenueForecast => {
  if (historicalData.length < 3) {
    return {
      period: 'Next Month',
      forecastedRevenue: 0,
      confidenceLevel: 0,
      factors: [],
      scenarios: []
    };
  }

  // Simple linear regression for trend
  const n = historicalData.length;
  const sumX = historicalData.reduce((sum, _, i) => sum + i, 0);
  const sumY = historicalData.reduce((sum, d) => sum + d.revenue, 0);
  const sumXY = historicalData.reduce((sum, d, i) => sum + i * d.revenue, 0);
  const sumXX = historicalData.reduce((sum, _, i) => sum + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const nextPeriodRevenue = intercept + slope * n;

  // Calculate confidence level based on historical variance
  const variance = historicalData.reduce((sum, d) => {
    const predicted = intercept + slope * historicalData.indexOf(d);
    return sum + Math.pow(d.revenue - predicted, 2);
  }, 0) / n;

  const confidenceLevel = Math.max(0, Math.min(100, 100 - Math.sqrt(variance) / nextPeriodRevenue * 100));

  return {
    period: 'Next Month',
    forecastedRevenue: Math.max(0, nextPeriodRevenue),
    confidenceLevel,
    factors: [
      {
        factor: 'Historical Trend',
        impact: slope > 0 ? 1 : -1,
        description: slope > 0 ? 'Positive growth trend' : 'Negative growth trend'
      },
      {
        factor: 'Seasonal Factors',
        impact: 0.5,
        description: 'Seasonal variations in revenue'
      }
    ],
    scenarios: [
      {
        scenario: 'Optimistic',
        probability: 25,
        revenue: nextPeriodRevenue * 1.2,
        description: 'Best case scenario with 20% growth'
      },
      {
        scenario: 'Realistic',
        probability: 50,
        revenue: nextPeriodRevenue,
        description: 'Most likely scenario based on trends'
      },
      {
        scenario: 'Pessimistic',
        probability: 25,
        revenue: nextPeriodRevenue * 0.8,
        description: 'Worst case scenario with 20% decline'
      }
    ]
  };
};
```

## Dashboard Features

### 1. Overview Tab
- **Key Metrics**: Total revenue, enrollments, growth rate, refunds
- **Revenue Sources**: Course sales, degree enrollments, subscriptions, certifications
- **Top Performing Courses**: Highest revenue generating courses
- **Recommendations**: AI-generated revenue optimization recommendations

### 2. Courses Tab
- **Course Revenue Summary**: Total course revenue, enrollments, average price
- **Course Performance Table**: Detailed course performance metrics
- **Course Growth Analysis**: Growth rates and trends by course

### 3. Degrees Tab
- **Degree Revenue Summary**: Total degree revenue, enrollments, completion rate
- **Degree Performance Table**: Detailed degree performance metrics
- **Degree Growth Analysis**: Growth rates and trends by degree

### 4. Growth Tab
- **Growth Trends**: Visual growth trend analysis
- **Growth Metrics**: Revenue growth rate, enrollment growth rate, CLV, MRR
- **Retention Metrics**: Churn rate, retention rate, expansion revenue

### 5. Forecast Tab
- **Forecast Summary**: Forecasted revenue, confidence level, growth trend
- **Forecast Scenarios**: Optimistic, realistic, pessimistic scenarios
- **Forecast Factors**: Factors influencing revenue forecasts

## Key Metrics

### 1. Revenue Metrics
- **Total Revenue**: Overall revenue from all sources
- **Gross Revenue**: Revenue before deductions
- **Net Revenue**: Revenue after refunds, discounts, and taxes
- **Refunds**: Total refunded amount
- **Discounts**: Total discount amount applied
- **Taxes**: Total tax amount collected

### 2. Growth Metrics
- **Revenue Growth Rate**: Percentage change in revenue
- **Enrollment Growth Rate**: Percentage change in enrollments
- **Average Revenue Per User**: Revenue per enrolled student
- **Customer Lifetime Value**: Total value of a customer over time
- **Monthly Recurring Revenue**: Recurring monthly revenue
- **Annual Recurring Revenue**: Recurring annual revenue

### 3. Retention Metrics
- **Churn Rate**: Percentage of customers who stop using the service
- **Retention Rate**: Percentage of customers retained
- **Expansion Revenue**: Revenue from existing customers
- **New Customer Revenue**: Revenue from new customers

### 4. Course Metrics
- **Course Revenue**: Revenue from individual courses
- **Course Enrollments**: Number of course enrollments
- **Average Course Price**: Average price per course
- **Course Growth Rate**: Growth rate for individual courses
- **Revenue Per Student**: Revenue per enrolled student

### 5. Degree Metrics
- **Degree Revenue**: Revenue from degree programs
- **Degree Enrollments**: Number of degree enrollments
- **Average Degree Price**: Average price per degree
- **Degree Completion Rate**: Percentage of degree completions
- **Degree Growth Rate**: Growth rate for degree programs

## Recommendation Engine

### 1. Revenue Optimization Recommendations
```typescript
const generateRevenueRecommendations = (
  totalRevenue: number,
  netRevenue: number,
  refunds: number,
  discounts: number,
  growthTrends: GrowthTrend[]
): string[] => {
  const recommendations: string[] = [];

  // Refund rate recommendations
  const refundRate = (refunds / totalRevenue) * 100;
  if (refundRate > 10) {
    recommendations.push('High refund rate detected. Review course quality and student satisfaction');
    recommendations.push('Implement better course previews and refund policies');
  }

  // Discount recommendations
  const discountRate = (discounts / totalRevenue) * 100;
  if (discountRate > 20) {
    recommendations.push('High discount rate. Consider optimizing pricing strategy');
    recommendations.push('Implement targeted discounts instead of blanket discounts');
  }

  // Growth recommendations
  if (growthTrends.length > 1) {
    const recentGrowth = growthTrends[growthTrends.length - 1].growthRate;
    if (recentGrowth < 0) {
      recommendations.push('Negative growth detected. Review marketing and product strategy');
      recommendations.push('Consider launching new courses or improving existing ones');
    } else if (recentGrowth < 5) {
      recommendations.push('Low growth rate. Implement growth strategies');
      recommendations.push('Consider expanding to new markets or channels');
    }
  }

  return recommendations;
};
```

### 2. Course Optimization Recommendations
```typescript
const generateCourseRecommendations = (courses: CourseRevenueSummary[]): string[] => {
  const recommendations: string[] = [];

  // High-performing courses
  const topCourses = courses
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3);
  
  if (topCourses.length > 0) {
    recommendations.push(`Promote top-performing courses: ${topCourses.map(c => c.courseName).join(', ')}`);
  }

  // Low-performing courses
  const lowCourses = courses.filter(c => c.totalRevenue < 10000);
  if (lowCourses.length > 0) {
    recommendations.push(`Review low-performing courses: ${lowCourses.map(c => c.courseName).join(', ')}`);
  }

  // High-growth courses
  const growthCourses = courses.filter(c => c.growthRate > 20);
  if (growthCourses.length > 0) {
    recommendations.push(`Scale high-growth courses: ${growthCourses.map(c => c.courseName).join(', ')}`);
  }

  return recommendations;
};
```

## Best Practices

### 1. Data Collection
- **Real-time Updates**: Update revenue data in real-time
- **Data Validation**: Validate all transaction data
- **Error Handling**: Handle errors gracefully
- **Performance**: Optimize queries for large datasets

### 2. Analytics Accuracy
- **Consistent Metrics**: Use consistent calculation methods
- **Data Quality**: Ensure data quality and accuracy
- **Regular Updates**: Update analytics regularly
- **Validation**: Validate analytics results

### 3. Privacy and Security
- **Data Privacy**: Protect customer financial data
- **Access Control**: Implement proper access controls
- **Data Retention**: Follow data retention policies
- **Compliance**: Ensure regulatory compliance

### 4. Performance Optimization
- **Caching**: Cache frequently accessed data
- **Pagination**: Use pagination for large datasets
- **Indexing**: Optimize database indexes
- **Query Optimization**: Optimize database queries

## API Reference

### Revenue Analytics Service

#### Methods
- `getRevenueAnalytics(period)`: Get comprehensive revenue analytics
- `getCourseRevenue(courseId)`: Get course-specific revenue data
- `getDegreeRevenue(degreeId)`: Get degree-specific revenue data
- `getRevenueTransactions(filters)`: Get revenue transaction data
- `getRevenueGrowth(period)`: Get revenue growth trends
- `getRevenueForecast(period)`: Get revenue forecasts
- `generateRevenueReport(startDate, endDate, period)`: Generate revenue report
- `calculateRevenueGrowthRate(current, previous)`: Calculate growth rate
- `calculateAverageRevenuePerUser(totalRevenue, totalUsers)`: Calculate ARPU
- `calculateCustomerLifetimeValue(arpu, retentionRate, churnRate)`: Calculate CLV
- `calculateMonthlyRecurringRevenue(subscriptions)`: Calculate MRR
- `calculateAnnualRecurringRevenue(mrr)`: Calculate ARR
- `calculateChurnRate(totalCustomers, churnedCustomers)`: Calculate churn rate
- `calculateRetentionRate(totalCustomers, retainedCustomers)`: Calculate retention rate
- `formatCurrency(amount, currency)`: Format currency
- `formatPercentage(value)`: Format percentage
- `formatNumber(value)`: Format number with commas
- `getGrowthTrendDirection(growthRate)`: Get growth trend direction
- `calculateRevenueForecast(historicalData, seasonalFactors)`: Calculate forecast

## Future Enhancements

1. **Advanced Analytics**: Machine learning insights
2. **Predictive Analytics**: Predict revenue trends
3. **Real-time Dashboards**: Real-time revenue updates
4. **Custom Reports**: Customizable report generation
5. **Benchmarking**: Compare against industry standards
6. **AI Recommendations**: AI-powered revenue optimization
7. **Mobile Analytics**: Mobile-specific analytics
8. **Integration**: Third-party analytics integration

## Support

For issues or questions:
1. Check analytics configuration
2. Verify data sources
3. Check calculation methods
4. Review error logs
5. Contact technical support

The revenue analytics system provides comprehensive insights into per-course, per-degree, and overall revenue growth with actionable recommendations for revenue optimization!
