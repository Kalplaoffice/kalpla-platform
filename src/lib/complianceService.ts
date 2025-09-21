/**
 * Compliance Service for Mentor Onboarding
 * Handles IP address, device ID, and timestamp logging for legal compliance
 */

export interface ComplianceData {
  ipAddress: string;
  deviceId: string;
  userAgent: string;
  timestamp: string;
}

export interface DeviceFingerprint {
  deviceId: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
}

class ComplianceService {
  private deviceId: string | null = null;

  /**
   * Get client IP address
   */
  async getClientIP(): Promise<string> {
    try {
      // Try to get IP from a public service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch (error) {
      console.error('Error getting IP address:', error);
      return 'unknown';
    }
  }

  /**
   * Generate device fingerprint
   */
  generateDeviceFingerprint(): DeviceFingerprint {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device fingerprint', 10, 10);
    
    const fingerprint = {
      deviceId: this.generateDeviceId(),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform
    };

    return fingerprint;
  }

  /**
   * Generate unique device ID
   */
  private generateDeviceId(): string {
    if (this.deviceId) {
      return this.deviceId;
    }

    // Create device ID from various browser characteristics
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('Device ID', 10, 10);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform,
      navigator.cookieEnabled,
      typeof(Storage) !== 'undefined'
    ].join('|');

    // Create hash from fingerprint
    this.deviceId = this.hashString(fingerprint);
    return this.deviceId;
  }

  /**
   * Simple hash function for device ID
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get comprehensive compliance data
   */
  async getComplianceData(): Promise<ComplianceData> {
    const ipAddress = await this.getClientIP();
    const deviceFingerprint = this.generateDeviceFingerprint();
    
    return {
      ipAddress,
      deviceId: deviceFingerprint.deviceId,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Log compliance event to CloudWatch
   */
  async logComplianceEvent(event: string, data: any): Promise<void> {
    try {
      const complianceData = await this.getComplianceData();
      
      const logData = {
        event,
        timestamp: new Date().toISOString(),
        compliance: complianceData,
        data
      };

      // In a real implementation, this would send to CloudWatch
      console.log('Compliance Event:', logData);
      
      // You could also send to a Lambda function for logging
      // await API.graphql(graphqlOperation(logComplianceEvent, { input: logData }));
      
    } catch (error) {
      console.error('Error logging compliance event:', error);
    }
  }

  /**
   * Validate compliance requirements
   */
  validateComplianceRequirements(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.ipAddress || data.ipAddress === 'unknown') {
      errors.push('IP address is required for compliance');
    }

    if (!data.deviceId) {
      errors.push('Device ID is required for compliance');
    }

    if (!data.userAgent) {
      errors.push('User agent is required for compliance');
    }

    if (!data.timestamp) {
      errors.push('Timestamp is required for compliance');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(applicationData: any): string {
    const report = `
COMPLIANCE REPORT - MENTOR APPLICATION
=====================================

Application ID: ${applicationData.id}
Applicant: ${applicationData.name}
Email: ${applicationData.email}
Submission Date: ${applicationData.submittedDate}

COMPLIANCE DATA:
- IP Address: ${applicationData.consentData?.ipAddress || 'N/A'}
- Device ID: ${applicationData.consentData?.deviceId || 'N/A'}
- User Agent: ${applicationData.consentData?.userAgent || 'N/A'}
- Declaration Timestamp: ${applicationData.consentData?.declarationTimestamp || 'N/A'}
- Signature Timestamp: ${applicationData.consentData?.signatureTimestamp || 'N/A'}

DOCUMENTS SUBMITTED:
- PAN Card: ${applicationData.documents?.panCard ? '✓' : '✗'}
- Aadhaar Card: ${applicationData.documents?.aadhaarCard ? '✓' : '✗'}
- Bank Account Details: ${applicationData.documents?.bankAccountDetails ? '✓' : '✗'}
- Cancelled Cheque: ${applicationData.documents?.cancelledCheque ? '✓' : '✗'}
- Educational Certificate: ${applicationData.documents?.educationalCertificate ? '✓' : '✗'}
- Experience Proof: ${applicationData.documents?.experienceProof ? '✓' : '✗'}
- Passport Photo: ${applicationData.documents?.passportPhoto ? '✓' : '✗'}
- Digital Signature: ${applicationData.documents?.digitalSignature ? '✓' : '✗'}

LEGAL COMPLIANCE:
- Declaration Accepted: ${applicationData.consentData?.declarationAccepted ? '✓' : '✗'}
- Digital Signature: ${applicationData.consentData?.signatureImage ? '✓' : '✗'}

Report Generated: ${new Date().toISOString()}
    `;

    return report;
  }
}

// Export singleton instance
export const complianceService = new ComplianceService();
export default complianceService;
