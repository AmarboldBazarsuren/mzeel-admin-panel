// admin-panel/src/api/client.js

import axios from 'axios';
import { storage } from '../utils/storage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token нэмэх
client.interceptors.request.use(
  async (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAll();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || { message: 'Network error' });
  }
);

// API functions
export const api = {
  // Auth
  login: (phone, password) => client.post('/auth/login', { phone, password }),
  getMe: () => client.get('/auth/me'),

  // Dashboard
  getDashboard: () => client.get('/admin/dashboard'),

  // Users
  getAllUsers: (page, search) => 
    client.get(`/admin/users?page=${page}${search ? `&search=${search}` : ''}`),
  getUserDetails: (id) => client.get(`/admin/users/${id}`),
  toggleUserStatus: (id) => client.put(`/admin/users/${id}/toggle-status`),
  getUserWallet: (id) => client.get(`/admin/users/${id}/wallet`),

  // ✅ Profiles
  getPendingProfiles: (page) => client.get(`/admin/profiles/pending?page=${page}`),
  getProfileDetails: (id) => client.get(`/admin/profiles/${id}`),
  verifyProfile: (id) => client.put(`/admin/profiles/${id}/verify`), // ✅ Body хоосон байх
  rejectProfile: (id, data) => client.put(`/admin/profiles/${id}/reject`, data),

  // ✅ Loan Verification
  getPendingVerificationLoans: (page) => 
    client.get(`/admin/loans/pending-verification?page=${page}`),
  startLoanReview: (id) => client.put(`/admin/loans/${id}/start-review`),
getPendingDisbursementLoans: (page) => 
  client.get(`/admin/loans/pending-disbursement?page=${page}`),
  // Loans
  getAllLoans: (page, status) => 
    client.get(`/loans/admin/all?page=${page}${status ? `&status=${status}` : ''}`),
  getLoanDetails: (id) => client.get(`/loans/${id}`),
  approveLoan: (id, data) => client.put(`/loans/${id}/approve`, data),
  approveLoanDisbursement: (id) => client.put(`/loans/${id}/approve-disbursement`),

  rejectLoan: (id, data) => client.put(`/loans/${id}/reject`, data),

  // Withdrawals
  getAllWithdrawals: (page, status) => 
    client.get(`/withdrawals/admin/all?page=${page}${status ? `&status=${status}` : ''}`),
  approveWithdrawal: (id, data) => client.put(`/withdrawals/${id}/approve`, data),
  rejectWithdrawal: (id, data) => client.put(`/withdrawals/${id}/reject`, data),

  // Transactions
  getAllTransactions: (page, type) => 
    client.get(`/transactions/admin/all?page=${page}${type ? `&type=${type}` : ''}`),
};

export default client;