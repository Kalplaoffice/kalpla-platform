// Investment Modal
function InvestmentModal({ 
  onClose, 
  onSave 
}: {
  onClose: () => void;
  onSave: (investmentData: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    investorId: 'current_investor',
    investorName: 'Current Investor',
    investorEmail: 'investor@example.com',
    investorRole: 'investor',
    startupId: '',
    startupName: '',
    startupEmail: '',
    investmentType: 'equity' as const,
    investmentStage: 'seed' as const,
    amount: 0,
    currency: 'INR',
    equityPercentage: 0,
    valuation: 0,
    investmentDate: new Date().toISOString(),
    closingDate: '',
    status: 'committed' as const,
    roundName: '',
    roundType: 'seed' as const,
    leadInvestor: false,
    coInvestors: [] as string[],
    investmentTerms: {} as any,
    dueDiligence: {} as any,
    legalDocuments: [] as any[],
    boardSeat: false,
    boardSeats: 0,
    votingRights: false,
    antiDilution: false,
    liquidationPreference: 0,
    participationRights: false,
    tagAlongRights: false,
    dragAlongRights: false,
    informationRights: false,
    proRataRights: false,
    exitStrategy: '',
    expectedReturn: 0,
    riskLevel: 'medium' as const,
    sector: '',
    geography: '',
    notes: '',
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Investment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ExclamationTriangleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Startup ID</label>
                <input
                  type="text"
                  value={formData.startupId}
                  onChange={(e) => setFormData({ ...formData, startupId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Startup Name</label>
                <input
                  type="text"
                  value={formData.startupName}
                  onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Startup Email</label>
                <input
                  type="email"
                  value={formData.startupEmail}
                  onChange={(e) => setFormData({ ...formData, startupEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Type</label>
                <select
                  value={formData.investmentType}
                  onChange={(e) => setFormData({ ...formData, investmentType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="equity">Equity</option>
                  <option value="convertible_note">Convertible Note</option>
                  <option value="safe">SAFE</option>
                  <option value="debt">Debt</option>
                  <option value="revenue_share">Revenue Share</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Investment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Stage</label>
                <select
                  value={formData.investmentStage}
                  onChange={(e) => setFormData({ ...formData, investmentStage: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="seed">Seed</option>
                  <option value="series_a">Series A</option>
                  <option value="series_b">Series B</option>
                  <option value="series_c">Series C</option>
                  <option value="growth">Growth</option>
                  <option value="late_stage">Late Stage</option>
                  <option value="pre_ipo">Pre-IPO</option>
                </select>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equity Percentage</label>
                <input
                  type="number"
                  value={formData.equityPercentage}
                  onChange={(e) => setFormData({ ...formData, equityPercentage: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valuation</label>
                <input
                  type="number"
                  value={formData.valuation}
                  onChange={(e) => setFormData({ ...formData, valuation: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Geography</label>
                <input
                  type="text"
                  value={formData.geography}
                  onChange={(e) => setFormData({ ...formData, geography: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Investment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Date</label>
              <input
                type="date"
                value={formData.investmentDate.split('T')[0]}
                onChange={(e) => setFormData({ ...formData, investmentDate: e.target.value + 'T00:00:00.000Z' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Investment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Funding Round Modal
function FundingRoundModal({ 
  onClose, 
  onSave 
}: {
  onClose: () => void;
  onSave: (roundData: Omit<FundingRound, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    startupId: 'current_startup',
    startupName: 'Current Startup',
    startupEmail: 'startup@example.com',
    roundName: '',
    roundType: 'seed' as const,
    targetAmount: 0,
    raisedAmount: 0,
    currency: 'INR',
    valuation: 0,
    preMoneyValuation: 0,
    postMoneyValuation: 0,
    roundDate: new Date().toISOString(),
    closingDate: '',
    status: 'announced' as const,
    leadInvestor: '',
    leadInvestorAmount: 0,
    coInvestors: [] as any[],
    minimumInvestment: 0,
    maximumInvestment: 0,
    useOfFunds: '',
    milestones: [] as string[],
    timeline: '',
    documents: [] as any[],
    legalStructure: '',
    sharePrice: 0,
    totalShares: 0,
    newShares: 0,
    dilutionPercentage: 0,
    antiDilution: false,
    liquidationPreference: 0,
    boardComposition: {} as any,
    votingRights: {} as any,
    informationRights: {} as any,
    exitStrategy: '',
    expectedReturn: 0,
    riskAssessment: {} as any,
    sector: '',
    geography: '',
    notes: '',
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create Funding Round</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ExclamationTriangleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Round Name</label>
                <input
                  type="text"
                  value={formData.roundName}
                  onChange={(e) => setFormData({ ...formData, roundName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Round Type</label>
                <select
                  value={formData.roundType}
                  onChange={(e) => setFormData({ ...formData, roundType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pre_seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="series_a">Series A</option>
                  <option value="series_b">Series B</option>
                  <option value="series_c">Series C</option>
                  <option value="series_d">Series D</option>
                  <option value="series_e">Series E</option>
                  <option value="growth">Growth</option>
                  <option value="late_stage">Late Stage</option>
                  <option value="bridge">Bridge</option>
                  <option value="convertible">Convertible</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Funding Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raised Amount</label>
                <input
                  type="number"
                  value={formData.raisedAmount}
                  onChange={(e) => setFormData({ ...formData, raisedAmount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Valuation Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valuation</label>
                <input
                  type="number"
                  value={formData.valuation}
                  onChange={(e) => setFormData({ ...formData, valuation: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pre-Money Valuation</label>
                <input
                  type="number"
                  value={formData.preMoneyValuation}
                  onChange={(e) => setFormData({ ...formData, preMoneyValuation: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post-Money Valuation</label>
                <input
                  type="number"
                  value={formData.postMoneyValuation}
                  onChange={(e) => setFormData({ ...formData, postMoneyValuation: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Geography</label>
                <input
                  type="text"
                  value={formData.geography}
                  onChange={(e) => setFormData({ ...formData, geography: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Use of Funds */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Use of Funds</label>
              <textarea
                value={formData.useOfFunds}
                onChange={(e) => setFormData({ ...formData, useOfFunds: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
              <input
                type="text"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 6 months"
              />
            </div>

            {/* Round Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Round Date</label>
              <input
                type="date"
                value={formData.roundDate.split('T')[0]}
                onChange={(e) => setFormData({ ...formData, roundDate: e.target.value + 'T00:00:00.000Z' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Funding Round
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Investment Details Modal
function InvestmentDetailsModal({ 
  investment,
  onClose, 
  onUpdate 
}: {
  investment: Investment;
  onClose: () => void;
  onUpdate: (investmentId: string, updates: Partial<Investment>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: investment.status,
    amount: investment.amount,
    valuation: investment.valuation || 0,
    equityPercentage: investment.equityPercentage || 0,
    expectedReturn: investment.expectedReturn || 0,
    exitStrategy: investment.exitStrategy || '',
    notes: investment.notes || ''
  });

  const handleSave = () => {
    onUpdate(investment.id, editData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Investment Details</h2>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <ExclamationTriangleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Startup</p>
                  <p className="text-sm text-gray-900">{investment.startupName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Investment Type</p>
                  <p className="text-sm text-gray-900">{investment.investmentType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Stage</p>
                  <p className="text-sm text-gray-900">{investment.investmentStage.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Sector</p>
                  <p className="text-sm text-gray-900">{investment.sector}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Geography</p>
                  <p className="text-sm text-gray-900">{investment.geography}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Risk Level</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${investmentTrackingService.getRiskLevelColor(investment.riskLevel)}`}>
                    {investment.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Amount</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.amount}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {investmentTrackingService.formatCurrency(investment.amount, investment.currency)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Valuation</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.valuation}
                      onChange={(e) => setEditData({ ...editData, valuation: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {investment.valuation ? investmentTrackingService.formatCurrency(investment.valuation, investment.currency) : 'N/A'}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Equity Percentage</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.equityPercentage}
                      onChange={(e) => setEditData({ ...editData, equityPercentage: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      step="0.1"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {investment.equityPercentage ? `${investment.equityPercentage}%` : 'N/A'}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Expected Return</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.expectedReturn}
                      onChange={(e) => setEditData({ ...editData, expectedReturn: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">
                      {investment.expectedReturn ? `${investment.expectedReturn}%` : 'N/A'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Investment Terms */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Lead Investor</p>
                  <p className="text-sm text-gray-900">{investment.leadInvestor ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Board Seat</p>
                  <p className="text-sm text-gray-900">{investment.boardSeat ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Voting Rights</p>
                  <p className="text-sm text-gray-900">{investment.votingRights ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Anti-Dilution</p>
                  <p className="text-sm text-gray-900">{investment.antiDilution ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Information Rights</p>
                  <p className="text-sm text-gray-900">{investment.informationRights ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Pro Rata Rights</p>
                  <p className="text-sm text-gray-900">{investment.proRataRights ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            {/* Status and Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status and Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  {isEditing ? (
                    <select
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="committed">Committed</option>
                      <option value="invested">Invested</option>
                      <option value="active">Active</option>
                      <option value="exited">Exited</option>
                      <option value="written_off">Written Off</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${investmentTrackingService.getStatusColor(investment.status)}`}>
                      {investment.status}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Investment Date</p>
                  <p className="text-sm text-gray-900">{investmentTrackingService.formatDate(investment.investmentDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Closing Date</p>
                  <p className="text-sm text-gray-900">
                    {investment.closingDate ? investmentTrackingService.formatDate(investment.closingDate) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Exit Strategy</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.exitStrategy}
                      onChange={(e) => setEditData({ ...editData, exitStrategy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{investment.exitStrategy || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
              {isEditing ? (
                <textarea
                  value={editData.notes}
                  onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-sm text-gray-900">{investment.notes || 'No notes available'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Round Details Modal
function RoundDetailsModal({ 
  round,
  onClose 
}: {
  round: FundingRound;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Funding Round Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ExclamationTriangleIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Round Name</p>
                  <p className="text-sm text-gray-900">{round.roundName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Round Type</p>
                  <p className="text-sm text-gray-900">{round.roundType.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${investmentTrackingService.getRoundStatusColor(round.status)}`}>
                    {round.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Sector</p>
                  <p className="text-sm text-gray-900">{round.sector}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Geography</p>
                  <p className="text-sm text-gray-900">{round.geography}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Round Date</p>
                  <p className="text-sm text-gray-900">{investmentTrackingService.formatDate(round.roundDate)}</p>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Target Amount</p>
                  <p className="text-sm text-gray-900">
                    {investmentTrackingService.formatCurrency(round.targetAmount, round.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Raised Amount</p>
                  <p className="text-sm text-gray-900">
                    {investmentTrackingService.formatCurrency(round.raisedAmount, round.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Valuation</p>
                  <p className="text-sm text-gray-900">
                    {investmentTrackingService.formatCurrency(round.valuation, round.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Progress</p>
                  <p className="text-sm text-gray-900">
                    {((round.raisedAmount / round.targetAmount) * 100).toFixed(1)}%
                  </p>
                </div>
                {round.preMoneyValuation && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Pre-Money Valuation</p>
                    <p className="text-sm text-gray-900">
                      {investmentTrackingService.formatCurrency(round.preMoneyValuation, round.currency)}
                    </p>
                  </div>
                )}
                {round.postMoneyValuation && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Post-Money Valuation</p>
                    <p className="text-sm text-gray-900">
                      {investmentTrackingService.formatCurrency(round.postMoneyValuation, round.currency)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Investors */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investors</h3>
              <div className="space-y-2">
                {round.leadInvestor && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Lead Investor</span>
                    <span className="text-sm text-gray-600">{round.leadInvestor}</span>
                  </div>
                )}
                {round.coInvestors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Co-Investors</p>
                    <div className="space-y-1">
                      {round.coInvestors.map((investor: any, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                          <span className="text-sm text-gray-900">{investor.name}</span>
                          <span className="text-sm text-gray-600">
                            {investmentTrackingService.formatCurrency(investor.amount, round.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Use of Funds */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Use of Funds</h3>
              <p className="text-sm text-gray-900">{round.useOfFunds}</p>
            </div>

            {/* Milestones */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestones</h3>
              <ul className="space-y-1">
                {round.milestones.map((milestone, index) => (
                  <li key={index} className="text-sm text-gray-900">• {milestone}</li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <p className="text-sm text-gray-900">{round.timeline}</p>
            </div>

            {/* Notes */}
            {round.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-sm text-gray-900">{round.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
