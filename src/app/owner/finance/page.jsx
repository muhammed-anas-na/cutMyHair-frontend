'use client';
import React, { useEffect, useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, DollarSign, Wallet, Clock, CreditCard, BarChart2, Calendar, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useSalon } from '@/context/SalonContext';
import { GET_FINANCE_DATA_FN, WITHDRAW_AMOUNT_FN } from '@/services/ownerService';

const SalonFinanceDashboard = () => {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState('transactions');
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalError, setModalError] = useState('');

  const { salon_id } = useSalon();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await GET_FINANCE_DATA_FN(salon_id);
        setFinancialData(response.data.data);
      } catch (err) {
        setError('An error occurred while fetching financial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (salon_id) {
      fetchData();
    }
  }, [salon_id]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const validateUpiId = (upi) => {
    // Basic UPI ID validation (e.g., user@bank)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upi);
  };

  const handleWithdraw = () => {
    setIsModalOpen(true); // Open the UPI ID modal
    setModalError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUpiId('');
    setModalError('');
  };

  const confirmWithdraw = async () => {
    if (!validateUpiId(upiId)) {
      setModalError('Please enter a valid UPI ID (e.g., user@bank)');
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > financialData.availableForWithdrawal) {
      setModalError('Invalid withdrawal amount');
      return;
    }

    setIsProcessing(true);
    try {
      // Note: Consider using an environment variable for the API URL in production (e.g., process.env.NEXT_PUBLIC_API_URL)
      const response = await WITHDRAW_AMOUNT_FN(salon_id, parseFloat(withdrawAmount) * 100, upiId)
      console.log(response);

      // const response = await fetch('/api/withdraw', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     salonId: salon_id,
      //     amount: parseFloat(withdrawAmount) * 100, // Convert to paise for Razorpay
      //     upiId,
      //   }),
      // });

      // const result = await response.json();
      // if (response.ok) {
      //   alert(`Withdrawal of ₹${withdrawAmount} to ${upiId} initiated successfully!`);
      //   closeModal();
      //   setWithdrawAmount('');
      //   // Refresh financial data
      //   const updatedData = await GET_FINANCE_DATA_FN(salon_id);
      //   setFinancialData(updatedData.data.data);
      // } else {
      //   setModalError(result.error || 'Withdrawal failed. Please try again.');
      // }
    } catch (err) {
      setModalError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CE145B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl text-red-600 font-semibold mb-3">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-[#CE145B] text-white rounded-md hover:bg-[#B0124E]"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">No Data Available</h2>
          <p className="text-gray-700">Financial data could not be loaded for this salon.</p>
        </div>
      </div>
    );
  }

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
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'overview' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'transactions' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'
                  }`}
                  onClick={() => setActiveTab('transactions')}
                >
                  Transactions
                </button>
                {/* <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'withdrawals' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'
                  }`}
                  onClick={() => setActiveTab('withdrawals')}
                >
                  Withdrawals
                </button> */}
              </div>
            </div>
          </div>
          <div className="md:hidden mt-4">
            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                className={`px-2 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'overview' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-2 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'transactions' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'
                }`}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </button>
              {/* <button
                className={`px-2 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'withdrawals' ? 'bg-[#CE145B] text-white' : 'text-gray-600 hover:bg-[#F7D1E0] hover:text-[#CE145B]'
                }`}
                onClick={() => setActiveTab('withdrawals')}
              >
                Withdrawals
              </button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-[#CE145B]">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Balance</p>
                    <p className="text-xl font-bold">{formatCurrency(financialData.currentBalance)}</p>
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
                    <p className="text-xl font-bold">{formatCurrency(financialData.availableForWithdrawal)}</p>
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
                    <p className="text-xl font-bold">{formatCurrency(financialData.totalWithdrawn)}</p>
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
                        max={financialData.availableForWithdrawal}
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
                      disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > financialData.availableForWithdrawal}
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

            {/* UPI ID Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-10">
                  <h2 className="text-lg font-medium mb-4">Enter UPI ID</h2>
                  <div className="mb-4">
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                      UPI ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="focus:ring-[#CE145B] focus:border-[#CE145B] block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                      placeholder="e.g., user@bank"
                    />
                    {modalError && <p className="mt-2 text-sm text-red-600">{modalError}</p>}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmWithdraw}
                      disabled={isProcessing || !upiId}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#CE145B] rounded-md hover:bg-[#B0124E] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing...' : 'Confirm Withdrawal'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {financialData.pendingPayments && financialData.pendingPayments.length > 0 && (
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4">
                  <h2 className="text-lg font-medium mb-4">Pending Payments</h2>
                  <div className="space-y-3">
                    {financialData.pendingPayments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="text-sm font-medium">{payment.description}</p>
                          <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm font-medium text-blue-600">{formatCurrency(payment.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">All Transactions</h2>
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

            <div className="md:hidden space-y-3 mb-4">
              {financialData.recentTransactions.map((transaction) => (
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
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

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
                  {financialData.recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium text-right ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
              <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                Showing {financialData.recentTransactions.length} of {financialData.recentTransactions.length} transactions
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">Previous</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-[#CE145B] text-white">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* {activeTab === 'withdrawals' && (
          <div>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-xl font-bold mb-4">Withdrawal History</h2>
              <div className="md:hidden space-y-3 mb-4">
                {financialData.withdrawalHistory.map((withdrawal) => (
                  <div key={withdrawal.id} className="bg-gray-50 rounded-md p-3 border-l-4 border-blue-400">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm text-gray-500">{new Date(withdrawal.date).toLocaleDateString()}</p>
                      <p className="text-sm font-medium">{formatCurrency(withdrawal.amount)}</p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          withdrawal.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : withdrawal.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
                    {financialData.withdrawalHistory.map((withdrawal) => (
                      <tr key={withdrawal.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(withdrawal.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              withdrawal.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : withdrawal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
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

            {financialData.monthlySummary && (
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
                    <p className="text-xl font-bold">{formatCurrency(financialData.metrics.averageWithdrawal)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Largest Withdrawal</p>
                    <p className="text-xl font-bold">{formatCurrency(financialData.metrics.largestWithdrawal)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Total This Month</p>
                    <p className="text-xl font-bold">{formatCurrency(financialData.metrics.totalThisMonth)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Projected Next Month</p>
                    <p className="text-xl font-bold">{formatCurrency(financialData.metrics.projectedNextMonth)}</p>
                    <p className="text-xs text-gray-500 mt-1">{financialData.metrics.growthRate}% growth</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )} */}
      </main>
    </div>
  );
};

export default SalonFinanceDashboard;