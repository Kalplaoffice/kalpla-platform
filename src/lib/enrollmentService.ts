import { degreeProgramService, DegreeProgram } from './degreeProgramService';

export interface Enrollment {
  id: string;
  studentId: string;
  programId: string;
  programTitle: string;
  degreeType: string;
  field: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'suspended' | 'cancelled';
  enrollmentDate: string;
  startDate?: string;
  completionDate?: string;
  totalFee: number;
  paidAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'partial' | 'completed' | 'failed' | 'refunded';
  applicationData: any;
  progress: {
    completedPhases: number;
    totalPhases: number;
    completedCourses: number;
    totalCourses: number;
    creditsEarned: number;
    totalCredits: number;
  };
  documents: {
    applicationForm: boolean;
    paymentReceipt: boolean;
    identityProof: boolean;
    academicTranscripts: boolean;
    recommendationLetter: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  enrollmentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded';
  transactionId: string;
  payuTxnid?: string;
  paymentDate: string;
  description: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface EnrollmentProgress {
  enrollmentId: string;
  currentPhase: number;
  completedPhases: number[];
  currentCourse?: string;
  completedCourses: string[];
  nextMilestone?: string;
  estimatedCompletion?: string;
  gpa?: number;
  attendance: number;
  assignments: {
    total: number;
    submitted: number;
    graded: number;
  };
  exams: {
    total: number;
    completed: number;
    passed: number;
  };
}

class EnrollmentService {
  private enrollments: Enrollment[] = [];
  private payments: PaymentRecord[] = [];
  private progress: EnrollmentProgress[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock enrollment data
    this.enrollments = [
      {
        id: 'enrollment_1',
        studentId: 'student_1',
        programId: 'program_1',
        programTitle: 'Master of Science in Computer Science',
        degreeType: 'master',
        field: 'Computer Science',
        status: 'active',
        enrollmentDate: '2024-01-15T00:00:00Z',
        startDate: '2024-02-01T00:00:00Z',
        totalFee: 150000,
        paidAmount: 150000,
        currency: 'INR',
        paymentStatus: 'completed',
        applicationData: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+91-9876543210'
        },
        progress: {
          completedPhases: 2,
          totalPhases: 4,
          completedCourses: 8,
          totalCourses: 16,
          creditsEarned: 24,
          totalCredits: 48
        },
        documents: {
          applicationForm: true,
          paymentReceipt: true,
          identityProof: true,
          academicTranscripts: true,
          recommendationLetter: true
        },
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-03-15T00:00:00Z'
      },
      {
        id: 'enrollment_2',
        studentId: 'student_1',
        programId: 'program_2',
        programTitle: 'Bachelor of Technology in Data Science',
        degreeType: 'bachelor',
        field: 'Data Science',
        status: 'pending',
        enrollmentDate: '2024-03-01T00:00:00Z',
        totalFee: 200000,
        paidAmount: 50000,
        currency: 'INR',
        paymentStatus: 'partial',
        applicationData: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+91-9876543210'
        },
        progress: {
          completedPhases: 0,
          totalPhases: 6,
          completedCourses: 0,
          totalCourses: 24,
          creditsEarned: 0,
          totalCredits: 72
        },
        documents: {
          applicationForm: true,
          paymentReceipt: true,
          identityProof: true,
          academicTranscripts: false,
          recommendationLetter: false
        },
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z'
      }
    ];

    // Mock payment data
    this.payments = [
      {
        id: 'payment_1',
        enrollmentId: 'enrollment_1',
        amount: 150000,
        currency: 'INR',
        paymentMethod: 'Credit Card',
        status: 'success',
        transactionId: 'TXN_123456789',
        payuTxnid: 'PAYU_123456789',
        paymentDate: '2024-01-15T10:30:00Z',
        description: 'Full program fee payment',
        receiptUrl: '/receipts/payment_1.pdf',
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 'payment_2',
        enrollmentId: 'enrollment_2',
        amount: 50000,
        currency: 'INR',
        paymentMethod: 'UPI',
        status: 'success',
        transactionId: 'TXN_987654321',
        payuTxnid: 'PAYU_987654321',
        paymentDate: '2024-03-01T14:20:00Z',
        description: 'Initial payment - 25% of program fee',
        receiptUrl: '/receipts/payment_2.pdf',
        createdAt: '2024-03-01T14:20:00Z'
      }
    ];

    // Mock progress data
    this.progress = [
      {
        enrollmentId: 'enrollment_1',
        currentPhase: 3,
        completedPhases: [1, 2],
        currentCourse: 'Advanced Algorithms',
        completedCourses: ['Introduction to Programming', 'Data Structures', 'Database Systems', 'Web Development', 'Software Engineering', 'Computer Networks', 'Operating Systems', 'Machine Learning'],
        nextMilestone: 'Complete Phase 3 - Advanced Topics',
        estimatedCompletion: '2024-12-15',
        gpa: 3.8,
        attendance: 95,
        assignments: {
          total: 24,
          submitted: 22,
          graded: 20
        },
        exams: {
          total: 8,
          completed: 6,
          passed: 6
        }
      },
      {
        enrollmentId: 'enrollment_2',
        currentPhase: 1,
        completedPhases: [],
        currentCourse: 'Introduction to Data Science',
        completedCourses: [],
        nextMilestone: 'Complete Phase 1 - Foundation',
        estimatedCompletion: '2027-06-15',
        gpa: 0,
        attendance: 0,
        assignments: {
          total: 0,
          submitted: 0,
          graded: 0
        },
        exams: {
          total: 0,
          completed: 0,
          passed: 0
        }
      }
    ];
  }

  /**
   * Get all enrollments for a student
   */
  async getStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      const studentEnrollments = this.enrollments.filter(e => e.studentId === studentId);
      
      // Enrich with program details
      const enrichedEnrollments = await Promise.all(
        studentEnrollments.map(async (enrollment) => {
          try {
            const program = await degreeProgramService.getDegreeProgram(enrollment.programId);
            return {
              ...enrollment,
              programDetails: program
            };
          } catch (error) {
            console.error('Error fetching program details:', error);
            return enrollment;
          }
        })
      );

      return enrichedEnrollments;
    } catch (error) {
      console.error('Error fetching student enrollments:', error);
      return [];
    }
  }

  /**
   * Get enrollment by ID
   */
  async getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
    try {
      const enrollment = this.enrollments.find(e => e.id === enrollmentId);
      if (!enrollment) return null;

      // Enrich with program details
      try {
        const program = await degreeProgramService.getDegreeProgram(enrollment.programId);
        return {
          ...enrollment,
          programDetails: program
        };
      } catch (error) {
        console.error('Error fetching program details:', error);
        return enrollment;
      }
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      return null;
    }
  }

  /**
   * Get payment history for an enrollment
   */
  async getPaymentHistory(enrollmentId: string): Promise<PaymentRecord[]> {
    try {
      return this.payments.filter(p => p.enrollmentId === enrollmentId);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  /**
   * Get enrollment progress
   */
  async getEnrollmentProgress(enrollmentId: string): Promise<EnrollmentProgress | null> {
    try {
      return this.progress.find(p => p.enrollmentId === enrollmentId) || null;
    } catch (error) {
      console.error('Error fetching enrollment progress:', error);
      return null;
    }
  }

  /**
   * Create new enrollment
   */
  async createEnrollment(data: {
    studentId: string;
    programId: string;
    applicationData: any;
    totalFee: number;
    currency: string;
  }): Promise<Enrollment> {
    try {
      const enrollment: Enrollment = {
        id: `enrollment_${Date.now()}`,
        studentId: data.studentId,
        programId: data.programId,
        programTitle: '', // Will be populated from program data
        degreeType: '', // Will be populated from program data
        field: '', // Will be populated from program data
        status: 'pending',
        enrollmentDate: new Date().toISOString(),
        totalFee: data.totalFee,
        paidAmount: 0,
        currency: data.currency,
        paymentStatus: 'pending',
        applicationData: data.applicationData,
        progress: {
          completedPhases: 0,
          totalPhases: 0,
          completedCourses: 0,
          totalCourses: 0,
          creditsEarned: 0,
          totalCredits: 0
        },
        documents: {
          applicationForm: true,
          paymentReceipt: false,
          identityProof: false,
          academicTranscripts: false,
          recommendationLetter: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Get program details
      try {
        const program = await degreeProgramService.getDegreeProgram(data.programId);
        if (program) {
          enrollment.programTitle = program.title;
          enrollment.degreeType = program.degreeType;
          enrollment.field = program.field;
          enrollment.progress.totalPhases = program.curriculumPhases.length;
          enrollment.progress.totalCredits = program.totalCredits;
          
          // Calculate total courses
          const totalCourses = program.curriculumPhases.reduce((sum, phase) => sum + phase.courses.length, 0);
          enrollment.progress.totalCourses = totalCourses;
        }
      } catch (error) {
        console.error('Error fetching program details:', error);
      }

      this.enrollments.push(enrollment);
      return enrollment;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw new Error('Failed to create enrollment');
    }
  }

  /**
   * Update enrollment status
   */
  async updateEnrollmentStatus(enrollmentId: string, status: Enrollment['status']): Promise<boolean> {
    try {
      const enrollment = this.enrollments.find(e => e.id === enrollmentId);
      if (!enrollment) return false;

      enrollment.status = status;
      enrollment.updatedAt = new Date().toISOString();

      // Set start date if approved
      if (status === 'approved' && !enrollment.startDate) {
        enrollment.startDate = new Date().toISOString();
      }

      // Set completion date if completed
      if (status === 'completed' && !enrollment.completionDate) {
        enrollment.completionDate = new Date().toISOString();
      }

      return true;
    } catch (error) {
      console.error('Error updating enrollment status:', error);
      return false;
    }
  }

  /**
   * Add payment record
   */
  async addPaymentRecord(data: {
    enrollmentId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: PaymentRecord['status'];
    transactionId: string;
    payuTxnid?: string;
    description: string;
    receiptUrl?: string;
  }): Promise<PaymentRecord> {
    try {
      const payment: PaymentRecord = {
        id: `payment_${Date.now()}`,
        enrollmentId: data.enrollmentId,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        status: data.status,
        transactionId: data.transactionId,
        payuTxnid: data.payuTxnid,
        paymentDate: new Date().toISOString(),
        description: data.description,
        receiptUrl: data.receiptUrl,
        createdAt: new Date().toISOString()
      };

      this.payments.push(payment);

      // Update enrollment payment status
      const enrollment = this.enrollments.find(e => e.id === data.enrollmentId);
      if (enrollment) {
        if (data.status === 'success') {
          enrollment.paidAmount += data.amount;
          
          // Update payment status
          if (enrollment.paidAmount >= enrollment.totalFee) {
            enrollment.paymentStatus = 'completed';
          } else if (enrollment.paidAmount > 0) {
            enrollment.paymentStatus = 'partial';
          }
        }
        
        enrollment.updatedAt = new Date().toISOString();
      }

      return payment;
    } catch (error) {
      console.error('Error adding payment record:', error);
      throw new Error('Failed to add payment record');
    }
  }

  /**
   * Update enrollment progress
   */
  async updateEnrollmentProgress(enrollmentId: string, progress: Partial<EnrollmentProgress>): Promise<boolean> {
    try {
      const existingProgress = this.progress.find(p => p.enrollmentId === enrollmentId);
      if (!existingProgress) {
        // Create new progress record
        const newProgress: EnrollmentProgress = {
          enrollmentId,
          currentPhase: 1,
          completedPhases: [],
          completedCourses: [],
          attendance: 0,
          assignments: { total: 0, submitted: 0, graded: 0 },
          exams: { total: 0, completed: 0, passed: 0 },
          ...progress
        };
        this.progress.push(newProgress);
      } else {
        // Update existing progress
        Object.assign(existingProgress, progress);
      }

      // Update enrollment progress summary
      const enrollment = this.enrollments.find(e => e.id === enrollmentId);
      if (enrollment) {
        const updatedProgress = this.progress.find(p => p.enrollmentId === enrollmentId);
        if (updatedProgress) {
          enrollment.progress.completedPhases = updatedProgress.completedPhases.length;
          enrollment.progress.completedCourses = updatedProgress.completedCourses.length;
          enrollment.updatedAt = new Date().toISOString();
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
      return false;
    }
  }

  /**
   * Get enrollment statistics
   */
  async getEnrollmentStats(studentId: string): Promise<{
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    totalPaid: number;
    totalDue: number;
    averageGPA: number;
  }> {
    try {
      const studentEnrollments = this.enrollments.filter(e => e.studentId === studentId);
      const studentProgress = this.progress.filter(p => 
        studentEnrollments.some(e => e.id === p.enrollmentId)
      );

      const stats = {
        totalEnrollments: studentEnrollments.length,
        activeEnrollments: studentEnrollments.filter(e => e.status === 'active').length,
        completedEnrollments: studentEnrollments.filter(e => e.status === 'completed').length,
        totalPaid: studentEnrollments.reduce((sum, e) => sum + e.paidAmount, 0),
        totalDue: studentEnrollments.reduce((sum, e) => sum + (e.totalFee - e.paidAmount), 0),
        averageGPA: 0
      };

      // Calculate average GPA
      const gpas = studentProgress.map(p => p.gpa).filter(gpa => gpa > 0);
      if (gpas.length > 0) {
        stats.averageGPA = gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length;
      }

      return stats;
    } catch (error) {
      console.error('Error calculating enrollment stats:', error);
      return {
        totalEnrollments: 0,
        activeEnrollments: 0,
        completedEnrollments: 0,
        totalPaid: 0,
        totalDue: 0,
        averageGPA: 0
      };
    }
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number, currency: string = 'INR'): string {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN')}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  }

  /**
   * Get status color
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get payment status color
   */
  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

export const enrollmentService = new EnrollmentService();
