'use client';
import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Wallet, Clock, CreditCard, BarChart2, Calendar, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

// Mock data
const mockData = {
  currentBalance: 48500,
  availableForWithdrawal: 32500,
  totalWithdrawn: 123400,
  recentTransactions: [
    { id: 1, type: 'deposit', amount: 750, date: '2025-04-28', description: 'Haircut - Lisa Johnson' },
    { id: 2, type: 'deposit', amount: 1205, date: '2025-04-27', description: 'Color & Style - Michael Chen' },
    { id: 3, type: 'withdrawal', amount: 5000, date: '2025-04-25', description: 'Weekly Withdrawal' },
    { id: 4, type: 'deposit', amount: 650, date: '2025-04-24', description: 'Beard Trim - Alex Rodriguez' },
    { id: 5, type: 'deposit', amount: 2100, date: '2025-04-23', description: 'Full Treatment - Sarah Kim' },
  ],
  pendingPayments: [
    { id: 1, amount: 850, date: '2025-04-29', description: 'Haircut & Wash - Taylor Swift' },
    { id: 2, amount: 1550, date: '2025-04-30', description: 'Highlights - Jordan Lee' },
  ],
  withdrawalHistory: [
    { id: 1, amount: 5000, date: '2025-04-25', status: 'completed' },
    { id: 2, amount: 7500, date: '2025-04-18', status: 'completed' },
    { id: 3, amount: 10000, date: '2025-04-11', status: 'completed' },
  ]
};

const SalonFinanceDashboard = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState('transactions');

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleWithdraw = () => {
    // Handle withdrawal logic here
    alert(`Withdrawing ₹${withdrawAmount}`);
    setWithdrawAmount('');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#CE145B]">Salon Finance</h1>
            <div className="hidden md:block">
              <div className="flex space-x-4">
                <button 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'transactions' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'}`}
                  onClick={() => setActiveTab('transactions')}
                >
                  Transactions
                </button>
                <button 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'withdrawals' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'}`}
                  onClick={() => setActiveTab('withdrawals')}
                >
                  Withdrawals
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Navigation */}
          <div className="md:hidden mt-4">
            <div className="grid grid-cols-3 gap-2 w-full">
              <button 
                className={`px-2 py-2 rounded-md text-sm font-medium ${activeTab === 'overview' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`px-2 py-2 rounded-md text-sm font-medium ${activeTab === 'transactions' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'}`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
              <button 
                className={`px-2 py-2 rounded-md text-sm font-medium ${activeTab === 'withdrawals' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'}`}
                onClick={() => setActiveTab('withdrawals')}
              >
                Withdrawals
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Section */}
        {activeTab === 'overview' && (
          <div>
            {/* Financial Summary Cards - Stack on mobile, grid on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#CE145B]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Current Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(mockData.currentBalance)}</p>
                  </div>
                  <div className="bg-[#F7D1E0] p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-[#CE145B]" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Available for Withdrawal</p>
                    <p className="text-xl font-bold">{formatCurrency(mockData.availableForWithdrawal)}</p>
                  </div>
                  <div className="bg-green-100 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Withdrawn</p>
                    <p className="text-xl font-bold">{formatCurrency(mockData.totalWithdrawn)}</p>
                  </div>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <ArrowUpCircle className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Withdrawal Form */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4">
                <h2 className="text-lg font-medium mb-4">Withdraw Funds</h2>
                <div className="flex flex-col gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="focus:ring-[#CE145B] focus:border-[#CE145B] block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                        placeholder="0"
                        min="0"
                        max={mockData.availableForWithdrawal}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">INR</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > mockData.availableForWithdrawal}
                      className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#CE145B] hover:bg-[#B0124E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CE145B] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDownCircle className="mr-2 h-4 w-4" />
                      Withdraw Funds
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Withdrawals are typically processed within 1-2 business days.
                </p>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div>
              {/* Recent Transactions */}
              <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
                <button 
                  className="w-full px-4 py-3 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleSection('transactions')}
                >
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-[#CE145B] mr-2" />
                    <h2 className="text-lg font-medium">Recent Transactions</h2>
                  </div>
                  {expandedSection === 'transactions' ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </button>
                
                {expandedSection === 'transactions' && (
                  <div className="px-4 pb-4">
                    {/* Mobile view - card style */}
                    <div className="md:hidden space-y-3">
                      {mockData.recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="bg-gray-50 rounded-md p-3 border-l-4 border-gray-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">{transaction.description}</p>
                              <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                            <p className={`text-sm font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Desktop view - table */}
                    <div className="hidden md:block">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mockData.recentTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {transaction.description}
                              </td>
                              <td className={`px-6 py-4 text-sm font-medium text-right ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <button className="text-sm text-[#CE145B] hover:text-[#B0124E] flex items-center">
                        View All Transactions
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pending Payments */}
              <div className="bg-white rounded-lg shadow mb-4 overflow-hidden">
                <button 
                  className="w-full px-4 py-3 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleSection('pending')}
                >
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-[#CE145B] mr-2" />
                    <h2 className="text-lg font-medium">Pending Payments</h2>
                  </div>
                  {expandedSection === 'pending' ? 
                    <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  }
                </button>
                
                {expandedSection === 'pending' && (
                  <div className="px-4 pb-4">
                    {mockData.pendingPayments.length > 0 ? (
                      <>
                        {/* Mobile view - card style */}
                        <div className="md:hidden space-y-3">
                          {mockData.pendingPayments.map((payment) => (
                            <div key={payment.id} className="bg-gray-50 rounded-md p-3 border-l-4 border-yellow-400">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">{payment.description}</p>
                                  <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-700">
                                  {formatCurrency(payment.amount)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Desktop view - table */}
                        <div className="hidden md:block">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {mockData.pendingPayments.map((payment) => (
                                <tr key={payment.id}>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(payment.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-900">
                                    {payment.description}
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium text-right text-gray-600">
                                    {formatCurrency(payment.amount)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <p className="text-center py-4 text-gray-500">No pending payments</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Section */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">All Transactions</h2>
            {/* Filter Controls - Stack on mobile */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search transactions..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CE145B] focus:border-[#CE145B]"
                />
              </div>
              <div className="relative">
                <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CE145B] focus:border-[#CE145B] appearance-none">
                  <option value="">All Types</option>
                  <option value="deposit">Deposits</option>
                  <option value="withdrawal">Withdrawals</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#CE145B] focus:border-[#CE145B]"
                />
              </div>
            </div>
            
            {/* Mobile view - cards */}
            <div className="md:hidden space-y-3 mb-4">
              {mockData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-gray-50 rounded-md p-3 border-l-4 border-gray-200">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <p className={`text-sm font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop view - table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockData.recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-sm font-medium text-right ${
                        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination - Simplified for mobile */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                Showing 5 of 120 transactions
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-[#CE145B] text-white">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Withdrawals Section */}
        {activeTab === 'withdrawals' && (
          <div>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-xl font-bold mb-4">Withdrawal History</h2>
              
              {/* Mobile view - cards */}
              <div className="md:hidden space-y-3 mb-4">
                {mockData.withdrawalHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="bg-gray-50 rounded-md p-3 border-l-4 border-blue-400">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm text-gray-500">{new Date(withdrawal.date).toLocaleDateString()}</p>
                      <p className="text-sm font-medium">{formatCurrency(withdrawal.amount)}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        withdrawal.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : withdrawal.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop view - table */}
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockData.withdrawalHistory.map((withdrawal) => (
                      <tr key={withdrawal.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(withdrawal.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            withdrawal.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : withdrawal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}>
                            {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right text-gray-900">
                          {formatCurrency(withdrawal.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Monthly Withdrawal Summary */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Monthly Withdrawal Summary</h2>
              <div className="h-48 flex items-center justify-center border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="text-center">
                  <BarChart2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Chart would display here with monthly withdrawal data</p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Average Withdrawal</p>
                  <p className="text-xl font-bold">{formatCurrency(7500)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Largest Withdrawal</p>
                  <p className="text-xl font-bold">{formatCurrency(10000)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Total This Month</p>
                  <p className="text-xl font-bold">{formatCurrency(22500)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500">Projected Next Month</p>
                  <p className="text-xl font-bold">{formatCurrency(30000)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Salon Finance Dashboard. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="text-sm text-gray-500 hover:text-[#CE145B]">
                Help Center
              </button>
              <button className="text-sm text-gray-500 hover:text-[#CE145B]">
                Privacy Policy
              </button>
              <button className="text-sm text-gray-500 hover:text-[#CE145B]">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalonFinanceDashboard;