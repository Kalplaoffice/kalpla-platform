'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import useRoleBasedAccess from '@/hooks/useRoleBasedAccess';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  BriefcaseIcon,
  BanknotesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function InvestorsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { role, isAuthenticated } = useRoleBasedAccess();
  const [loading, setLoading] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);
  
  // CRUD Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [investors, setInvestors] = useState<any[]>([]);
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'angel',
    company: '',
    investmentRange: '',
    sectors: [],
    status: 'active',
    experience: '',
    location: '',
    portfolio: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userLoading) return;
    if (hasRedirected) return;

    if (!isAuthenticated()) {
      router.push('/auth/signin');
      setHasRedirected(true);
      return;
    }
    
    if (role !== 'Admin') {
      router.push('/dashboard');
      setHasRedirected(true);
      return;
    }
    
    setLoading(false);
  }, [user, userLoading, router, hasRedirected, role, isAuthenticated]);

  // Initialize investors data
  useEffect(() => {
    const initialInvestors = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@venturecapital.com',
        phone: '+91 98765 43230',
        type: 'angel',
        company: 'Kumar Ventures',
        investmentRange: '₹10L - ₹50L',
        sectors: ['EdTech', 'FinTech', 'HealthTech'],
        status: 'active',
        totalInvestments: 15,
        totalAmount: '₹2.5Cr',
        avgTicketSize: '₹16.7L',
        joinDate: '2023-03-15',
        lastInvestment: '2024-01-15',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        portfolio: ['EduTech Startup A', 'FinTech Startup B', 'HealthTech Startup C'],
        experience: '12+ years',
        location: 'Mumbai'
      },
      {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya@techfund.com',
        phone: '+91 98765 43231',
        type: 'vc',
        company: 'TechFund Capital',
        investmentRange: '₹1Cr - ₹10Cr',
        sectors: ['AI/ML', 'SaaS', 'EdTech'],
        status: 'active',
        totalInvestments: 8,
        totalAmount: '₹15Cr',
        avgTicketSize: '₹1.9Cr',
        joinDate: '2023-05-20',
        lastInvestment: '2024-01-10',
        profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        portfolio: ['AI Startup X', 'SaaS Startup Y', 'EdTech Startup Z'],
        experience: '15+ years',
        location: 'Bangalore'
      },
      {
        id: '3',
        name: 'Amit Patel',
        email: 'amit@seedfund.com',
        phone: '+91 98765 43232',
        type: 'seed',
        company: 'SeedFund Partners',
        investmentRange: '₹5L - ₹2Cr',
        sectors: ['EdTech', 'AgriTech', 'CleanTech'],
        status: 'pending',
        totalInvestments: 0,
        totalAmount: '₹0',
        avgTicketSize: '₹0',
        joinDate: '2024-01-10',
        lastInvestment: 'N/A',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        portfolio: [],
        experience: '8+ years',
        location: 'Delhi'
      },
      {
        id: '4',
        name: 'Sneha Gupta',
        email: 'sneha@corporate.com',
        phone: '+91 98765 43233',
        type: 'corporate',
        company: 'TechCorp Ventures',
        investmentRange: '₹5Cr - ₹50Cr',
        sectors: ['EdTech', 'Enterprise Software'],
        status: 'active',
        totalInvestments: 5,
        totalAmount: '₹25Cr',
        avgTicketSize: '₹5Cr',
        joinDate: '2023-08-10',
        lastInvestment: '2023-12-20',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        portfolio: ['Enterprise Startup 1', 'EdTech Startup 2'],
        experience: '20+ years',
        location: 'Pune'
      }
    ];
    setInvestors(initialInvestors);
  }, []);

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || investor.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'angel': return 'text-blue-600 bg-blue-100';
      case 'vc': return 'text-purple-600 bg-purple-100';
      case 'seed': return 'text-green-600 bg-green-100';
      case 'corporate': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'inactive': return <XCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleSelectAll = () => {
    if (selectedInvestors.length === filteredInvestors.length) {
      setSelectedInvestors([]);
    } else {
      setSelectedInvestors(filteredInvestors.map(investor => investor.id));
    }
  };

  const handleSelectInvestor = (investorId: string) => {
    setSelectedInvestors(prev => 
      prev.includes(investorId) 
        ? prev.filter(id => id !== investorId)
        : [...prev, investorId]
    );
  };

  // CRUD Functions
  const handleCreateInvestor = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'angel',
      company: '',
      investmentRange: '',
      sectors: [],
      status: 'active',
      experience: '',
      location: '',
      portfolio: []
    });
    setSelectedInvestor(null);
    setShowCreateModal(true);
  };

  const handleEditInvestor = (investor: any) => {
    setSelectedInvestor(investor);
    setFormData({
      name: investor.name,
      email: investor.email,
      phone: investor.phone,
      type: investor.type,
      company: investor.company,
      investmentRange: investor.investmentRange,
      sectors: investor.sectors,
      status: investor.status,
      experience: investor.experience,
      location: investor.location,
      portfolio: investor.portfolio
    });
    setShowEditModal(true);
  };

  const handleViewInvestor = (investor: any) => {
    setSelectedInvestor(investor);
    setShowViewModal(true);
  };

  const handleDeleteInvestor = (investor: any) => {
    setSelectedInvestor(investor);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (showCreateModal) {
        // Create new investor
        const newInvestor = {
          id: (investors.length + 1).toString(),
          ...formData,
          totalInvestments: 0,
          totalAmount: '₹0',
          avgTicketSize: '₹0',
          joinDate: new Date().toISOString().split('T')[0],
          lastInvestment: 'N/A',
          profileImage: `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=150&h=150&fit=crop&crop=face`
        };
        setInvestors(prev => [...prev, newInvestor]);
        setShowCreateModal(false);
      } else if (showEditModal) {
        // Update existing investor
        setInvestors(prev => prev.map(investor => 
          investor.id === selectedInvestor.id 
            ? { ...investor, ...formData }
            : investor
        ));
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error saving investor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInvestors(prev => prev.filter(investor => investor.id !== selectedInvestor.id));
      setShowDeleteModal(false);
      setSelectedInvestor(null);
    } catch (error) {
      console.error('Error deleting investor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectorChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.map((sector, i) => 
        i === index ? value : sector
      )
    }));
  };

  const addSector = () => {
    setFormData(prev => ({
      ...prev,
      sectors: [...prev.sectors, '']
    }));
  };

  const removeSector = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.filter((_, i) => i !== index)
    }));
  };

  const handlePortfolioChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map((company, i) => 
        i === index ? value : company
      )
    }));
  };

  const addPortfolio = () => {
    setFormData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, '']
    }));
  };

  const removePortfolio = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter((_, i) => i !== index)
    }));
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    setShowDeleteModal(false);
    setSelectedInvestor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'angel',
      company: '',
      investmentRange: '',
      sectors: [],
      status: 'active',
      experience: '',
      location: '',
      portfolio: []
    });
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Investors Management</h1>
                <p className="text-gray-600 mt-1">Manage investor profiles, portfolios, and investment activities</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Investors</p>
                    <p className="text-2xl font-bold text-gray-900">{investors.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Investors</p>
                    <p className="text-2xl font-bold text-gray-900">{investors.filter(i => i.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BanknotesIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Investments</p>
                    <p className="text-2xl font-bold text-gray-900">{investors.reduce((acc, i) => acc + i.totalInvestments, 0)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CurrencyDollarIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹42.5Cr</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search investors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="angel">Angel Investors</option>
                  <option value="vc">Venture Capital</option>
                  <option value="seed">Seed Fund</option>
                  <option value="corporate">Corporate VC</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={handleCreateInvestor}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  Add Investor
                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Investors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestors.map((investor) => (
              <div key={investor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={investor.profileImage}
                      alt={investor.name}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{investor.name}</h3>
                      <p className="text-sm text-gray-600">{investor.company}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(investor.type)}`}>
                          {investor.type.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investor.status)}`}>
                          {getStatusIcon(investor.status)}
                          <span className="ml-1 capitalize">{investor.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      <span>{investor.experience}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                      <span>{investor.location}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Investment Range:</span> {investor.investmentRange}
                    </div>
                  </div>

                  {/* Investment Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{investor.totalInvestments}</p>
                      <p className="text-xs text-gray-600">Investments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{investor.totalAmount}</p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{investor.avgTicketSize}</p>
                      <p className="text-xs text-gray-600">Avg Ticket</p>
                    </div>
                  </div>

                  {/* Sectors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">Sectors</p>
                    <div className="flex flex-wrap gap-1">
                      {investor.sectors.map((sector, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Preview */}
                  {investor.portfolio.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Portfolio</p>
                      <div className="space-y-1">
                        {investor.portfolio.slice(0, 2).map((company, index) => (
                          <p key={index} className="text-xs text-gray-600 truncate">{company}</p>
                        ))}
                        {investor.portfolio.length > 2 && (
                          <p className="text-xs text-gray-500">+{investor.portfolio.length - 2} more</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex space-x-2">
                    <button 
                      onClick={() => handleViewInvestor(investor)}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      title="View Investor"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => handleEditInvestor(investor)}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      title="Edit Investor"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteInvestor(investor)}
                      className="px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                      title="Delete Investor"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredInvestors.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No investors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by adding your first investor.'
                }
              </p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add Investor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Investor Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Investor</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="angel">Angel Investor</option>
                  <option value="vc">Venture Capital</option>
                  <option value="seed">Seed Fund</option>
                  <option value="corporate">Corporate VC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Range</label>
                <input
                  type="text"
                  name="investmentRange"
                  value={formData.investmentRange}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g., ₹10L - ₹50L"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g., 12+ years"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Investor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Investor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Investor</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="angel">Angel Investor</option>
                  <option value="vc">Venture Capital</option>
                  <option value="seed">Seed Fund</option>
                  <option value="corporate">Corporate VC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Range</label>
                <input
                  type="text"
                  name="investmentRange"
                  value={formData.investmentRange}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sectors</label>
                <div className="space-y-2">
                  {formData.sectors.map((sector, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={sector}
                        onChange={(e) => handleSectorChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter sector"
                      />
                      <button
                        type="button"
                        onClick={() => removeSector(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSector}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Sector
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                <div className="space-y-2">
                  {formData.portfolio.map((company, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => handlePortfolioChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter company name"
                      />
                      <button
                        type="button"
                        onClick={() => removePortfolio(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPortfolio}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Portfolio Company
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Investor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Investor Modal */}
      {showViewModal && selectedInvestor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Investor Details</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={selectedInvestor.profileImage}
                  alt={selectedInvestor.name}
                />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{selectedInvestor.name}</h4>
                  <p className="text-sm text-gray-500">ID: {selectedInvestor.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedInvestor.type)}`}>
                    {selectedInvestor.type.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedInvestor.status)}`}>
                    {getStatusIcon(selectedInvestor.status)}
                    <span className="ml-1 capitalize">{selectedInvestor.status}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.company}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Investment Range</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.investmentRange}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.experience}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Investments</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.totalInvestments}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.totalAmount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Avg Ticket Size</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.avgTicketSize}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Join Date</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.joinDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Investment</label>
                  <p className="text-sm text-gray-900">{selectedInvestor.lastInvestment}</p>
                </div>
              </div>
              {selectedInvestor.sectors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sectors</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedInvestor.sectors.map((sector: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedInvestor.portfolio.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio</label>
                  <div className="space-y-1">
                    {selectedInvestor.portfolio.map((company: string, index: number) => (
                      <p key={index} className="text-sm text-gray-600">{company}</p>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end pt-4">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInvestor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Delete Investor</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <strong>{selectedInvestor.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={closeModals}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete Investor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
