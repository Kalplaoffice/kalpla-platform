'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { applicationService } from '@/lib/applicationService';
import { 
  DocumentArrowUpIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  UserIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

interface MentorOnboardingData {
  name: string;
  email: string;
  phone: string;
  expertise: string;
  linkedin: string;
  portfolio: string;
  bio: string;
  availability: string;
  documents: {
    // Mandatory Documents (from checklist)
    panCard: File | null;
    aadhaarCard: File | null;
    bankAccountDetails: File | null;
    cancelledCheque: File | null;
    educationalCertificate: File | null;
    experienceProof: File | null;
    passportPhoto: File | null;
    digitalSignature: File | null;
    
    // Optional Documents
    gstRegistration: File | null;
    professionalTaxRegistration: File | null;
  };
  declaration: boolean;
  signature: string;
  signatureImage: string;
}

export default function MentorOnboardingPage() {
  const { user, signInWithGoogle } = useUser();
  const router = useRouter();
  
  const [formData, setFormData] = useState<MentorOnboardingData>({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    linkedin: '',
    portfolio: '',
    bio: '',
    availability: '',
    documents: {
      // Mandatory Documents
      panCard: null,
      aadhaarCard: null,
      bankAccountDetails: null,
      cancelledCheque: null,
      educationalCertificate: null,
      experienceProof: null,
      passportPhoto: null,
      digitalSignature: null,
      
      // Optional Documents
      gstRegistration: null,
      professionalTaxRegistration: null
    },
    declaration: false,
    signature: '',
    signatureImage: ''
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const steps = [
    { id: 1, name: 'Basic Information', icon: UserIcon },
    { id: 2, name: 'Documents', icon: DocumentArrowUpIcon },
    { id: 3, name: 'Declaration', icon: CheckCircleIcon },
    { id: 4, name: 'Review & Submit', icon: AcademicCapIcon }
  ];

  useEffect(() => {
    // Pre-fill email if user is logged in
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim()
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, documentType: keyof MentorOnboardingData['documents']) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload only PDF, JPEG, or PNG files');
        return;
      }
      
      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentType]: file
        }
      }));
      setError('');
    }
  };

  const handleDeclarationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      declaration: e.target.checked
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || 
            !formData.expertise.trim() || !formData.bio.trim() || !formData.availability.trim()) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        // Check all mandatory documents
        const mandatoryDocs = [
          'panCard', 'aadhaarCard', 'bankAccountDetails', 'cancelledCheque',
          'educationalCertificate', 'experienceProof', 'passportPhoto', 'digitalSignature'
        ];
        
        const missingDocs = mandatoryDocs.filter(doc => !formData.documents[doc as keyof typeof formData.documents]);
        
        if (missingDocs.length > 0) {
          setError(`Please upload all mandatory documents: ${missingDocs.join(', ')}`);
          return false;
        }
        break;
      case 3:
        if (!formData.declaration || !formData.signature.trim()) {
          setError('Please accept the declaration and provide your signature');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError('');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setLoading(true);
    setError('');

    try {
      // Upload documents to S3
      const documentUrls = await uploadDocuments();
      
      // Submit mentor application
      await submitMentorApplication(documentUrls);
      
      // Redirect to success page
      router.push('/mentor-onboarding/success');
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocuments = async (): Promise<{[key: string]: string}> => {
    const uploads: {[key: string]: string} = {};
    
    for (const [docType, file] of Object.entries(formData.documents)) {
      if (file) {
        try {
          // This would use Amplify Storage to upload to S3
          // For now, we'll simulate the upload
          const fileName = `${docType}_${Date.now()}.${file.name.split('.').pop()}`;
          const fileUrl = `s3://kalpla-mentor-documents/${user?.id || 'anonymous'}/${fileName}`;
          
          uploads[docType] = fileUrl;
          setUploadProgress(prev => ({ ...prev, [docType]: 100 }));
        } catch (error) {
          throw new Error(`Failed to upload ${docType} document`);
        }
      }
    }
    
    return uploads;
  };

  const submitMentorApplication = async (documentUrls: {[key: string]: string}) => {
    const applicationData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      expertise: formData.expertise,
      linkedin: formData.linkedin,
      portfolio: formData.portfolio,
      bio: formData.bio,
      availability: formData.availability,
      documents: documentUrls,
      signature: formData.signature,
      status: 'PENDING'
    };
    
    console.log('Submitting mentor application:', applicationData);
    
    // Call the actual GraphQL API
    await applicationService.submitMentorApplication(applicationData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                  Expertise / Domain *
                </label>
                <input
                  type="text"
                  id="expertise"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  placeholder="e.g., Startup Strategy, Product Management"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                  Portfolio / Website
                </label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Short Bio *
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about your background, experience, and what makes you a great mentor..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability per Week *
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select availability</option>
                <option value="1-5 hours">1-5 hours</option>
                <option value="5-10 hours">5-10 hours</option>
                <option value="10-15 hours">10-15 hours</option>
                <option value="15+ hours">15+ hours</option>
              </select>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Mandatory Document Requirements</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Please upload clear, readable documents. Accepted formats: PDF, JPEG, PNG (max 10MB each)</p>
                    <p className="mt-1 font-medium">All documents marked with * are mandatory for compliance.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PAN Card */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Card * (Mandatory)
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="panCard" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload PAN</span>
                        <input
                          id="panCard"
                          name="panCard"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'panCard')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.panCard && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.documents.panCard.name}</p>
                )}
              </div>

              {/* Aadhaar Card */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Card * (ID + Address Proof)
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="aadhaarCard" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload Aadhaar</span>
                        <input
                          id="aadhaarCard"
                          name="aadhaarCard"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'aadhaarCard')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.aadhaarCard && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.documents.aadhaarCard.name}</p>
                )}
              </div>

              {/* Bank Account Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Account Details *
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="bankAccountDetails" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload Bank Details</span>
                        <input
                          id="bankAccountDetails"
                          name="bankAccountDetails"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'bankAccountDetails')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.bankAccountDetails && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.documents.bankAccountDetails.name}</p>
                )}
              </div>

              {/* Cancelled Cheque */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancelled Cheque / Bank Passbook *
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="cancelledCheque" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload Cheque</span>
                        <input
                          id="cancelledCheque"
                          name="cancelledCheque"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'cancelledCheque')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.cancelledCheque && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.documents.cancelledCheque.name}</p>
                )}
              </div>

              {/* Educational Certificate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Educational Qualification Certificate *
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="educationalCertificate" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload Certificate</span>
                        <input
                          id="educationalCertificate"
                          name="educationalCertificate"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'educationalCertificate')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.educationalCertificate && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.documents.educationalCertificate.name}</p>
                )}
              </div>

              {/* Experience Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Proof * (Employment Letter / LinkedIn)
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="experienceProof" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload Experience</span>
                        <input
                          id="experienceProof"
                          name="experienceProof"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'experienceProof')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.experienceProof && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.documents.experienceProof.name}</p>
                )}
              </div>

              {/* Passport Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passport-size Photograph *
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="passportPhoto" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload Photo</span>
                        <input
                          id="passportPhoto"
                          name="passportPhoto"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'passportPhoto')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.passportPhoto && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.documents.passportPhoto.name}</p>
                )}
              </div>

              {/* Digital Signature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Signature / Scanned Signature *
                </label>
                <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="digitalSignature" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload Signature</span>
                        <input
                          id="digitalSignature"
                          name="digitalSignature"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, 'digitalSignature')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {formData.documents.digitalSignature && (
                  <p className="mt-2 text-sm text-green-600">✓ {formData.documents.digitalSignature.name}</p>
                )}
              </div>
            </div>

            {/* Optional Documents */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Registration (if applicable)
                  </label>
                  <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="gstRegistration" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload GST</span>
                          <input
                            id="gstRegistration"
                            name="gstRegistration"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'gstRegistration')}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {formData.documents.gstRegistration && (
                    <p className="mt-2 text-sm text-green-600">✓ {formData.documents.gstRegistration.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Tax Registration (if applicable)
                  </label>
                  <div className="mt-1 flex justify-center px-4 pt-4 pb-4 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <DocumentArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="professionalTaxRegistration" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload Tax Reg</span>
                          <input
                            id="professionalTaxRegistration"
                            name="professionalTaxRegistration"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'professionalTaxRegistration')}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  {formData.documents.professionalTaxRegistration && (
                    <p className="mt-2 text-sm text-green-600">✓ {formData.documents.professionalTaxRegistration.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Self-Declaration Agreement</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <p>
                  I, <strong>{formData.name}</strong>, hereby declare that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All the documents submitted are true and correct to the best of my knowledge.</li>
                  <li>I accept that all classes, recordings, and course content rights belong solely to <strong>Learncap Academy Private Limited (Kalpla)</strong>.</li>
                  <li>I understand that I am entering into a mentorship agreement with Learncap Academy Private Limited.</li>
                  <li>I have the necessary qualifications and experience to serve as a mentor in the Kalpla Startup Mentorship Program (KSMP).</li>
                  <li>I understand that my role as a mentor involves guiding and supporting startup founders through the KSMP phases.</li>
                  <li>I commit to maintaining confidentiality regarding any sensitive information shared by mentees.</li>
                  <li>I will adhere to the Kalpla Code of Conduct and professional standards.</li>
                  <li>I understand that my application will be reviewed and approval is subject to Learncap Academy Private Limited's discretion.</li>
                  <li>I acknowledge that providing false information may result in immediate termination of my mentor status.</li>
                  <li>I consent to the collection, storage, and processing of my personal data as per the Privacy Policy.</li>
                </ul>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Legal Notice:</strong> This declaration is legally binding and will be stored as proof of your agreement. 
                    By accepting this declaration, you are entering into a legal agreement with Learncap Academy Private Limited.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  id="declaration"
                  name="declaration"
                  type="checkbox"
                  checked={formData.declaration}
                  onChange={handleDeclarationChange}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="declaration" className="ml-3 text-sm text-gray-700">
                  I AGREE to the above Self-Declaration Agreement and accept all terms and conditions. *
                </label>
              </div>
              
              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
                  Digital Signature *
                </label>
                <input
                  type="text"
                  id="signature"
                  name="signature"
                  value={formData.signature}
                  onChange={handleInputChange}
                  placeholder="Type your full name as digital signature"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  By typing your name, you are providing a digital signature agreeing to the above declaration. 
                  This will be logged with timestamp, IP address, and device information for legal compliance.
                </p>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Review Your Application</h3>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-600">{formData.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{formData.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{formData.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Expertise:</span>
                    <p className="text-gray-600">{formData.expertise}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Availability:</span>
                    <p className="text-gray-600">{formData.availability}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">LinkedIn:</span>
                    <p className="text-gray-600">{formData.linkedin || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Bio:</span>
                  <p className="text-gray-600 mt-1">{formData.bio}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Documents:</span>
                  <ul className="text-gray-600 mt-1 space-y-1">
                    <li>✓ Government ID: {formData.documents.govId?.name}</li>
                    <li>✓ Degree/Certification: {formData.documents.degree?.name}</li>
                    <li>✓ Resume/CV: {formData.documents.resume?.name}</li>
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Declaration:</span>
                  <p className="text-gray-600 mt-1">✓ Accepted and signed by {formData.signature}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      After submission, your application will be reviewed by our admin team. 
                      You will receive an email notification once your application is approved or rejected. 
                      This process typically takes 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Become a Mentor
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Join our community of experienced professionals and help guide the next generation of entrepreneurs
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-8">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="flex items-center">
                  <div className={`flex items-center ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
                      currentStep >= step.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="ml-4 text-sm font-medium">{step.name}</span>
                  </div>
                  {stepIdx < steps.length - 1 && (
                    <div className={`ml-8 w-16 h-0.5 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>

        {/* Login Prompt */}
        {!user && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => signInWithGoogle()}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in with Google
              </button>
              {' '}or{' '}
              <a href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
