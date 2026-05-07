import axios from 'axios';

const API_BASE = 'https://ajay-backend-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,

  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  timeout: 30000,

  withCredentials: false,
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(

  (config) => {

    const token = localStorage.getItem('pmajay_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error('API ERROR:', error);

    // Handle unauthorized
    if (error.response?.status === 401) {

      localStorage.removeItem('pmajay_token');
      localStorage.removeItem('pmajay_user');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ===============================
// AUTH
// ===============================

export const authAPI = {

  login: (data) =>
    api.post('/auth/login', data),

  register: (data) =>
    api.post('/auth/register', data),
};

// ===============================
// AGENCIES
// ===============================

export const agencyAPI = {

  getAll: () =>
    api.get('/agencies'),

  getById: (id) =>
    api.get(`/agencies/${id}`),

  create: (data) =>
    api.post('/agencies', data),

  update: (id, data) =>
    api.put(`/agencies/${id}`, data),

  delete: (id) =>
    api.delete(`/agencies/${id}`),

  getByState: (stateId) =>
    api.get(`/agencies/state/${stateId}`),

  getByComponent: (component) =>
    api.get(`/agencies/component/${component}`),
};

// ===============================
// PROJECTS
// ===============================

export const projectAPI = {

  getAll: () =>
    api.get('/projects'),

  getById: (id) =>
    api.get(`/projects/${id}`),

  create: (data) =>
    api.post('/projects', data),

  update: (id, data) =>
    api.put(`/projects/${id}`, data),

  getByStatus: (status) =>
    api.get(`/projects/status/${status}`),

  getDelayed: () =>
    api.get('/projects/delayed'),

  updateProgress: (id, progress) =>
    api.put(`/projects/${id}/progress`, {
      progress,
    }),

  getByState: (stateId) =>
    api.get(`/projects/state/${stateId}`),

  getByAgency: (agencyId) =>
    api.get(`/projects/agency/${agencyId}`),
};

// ===============================
// FUNDS
// ===============================

export const fundAPI = {

  getAll: () =>
    api.get('/funds'),

  getByProject: (projectId) =>
    api.get(`/funds/project/${projectId}`),

  create: (data) =>
    api.post('/funds', data),

  update: (id, data) =>
    api.put(`/funds/${id}`, data),

  getSummary: () =>
    api.get('/funds/summary'),
};

// ===============================
// DASHBOARD
// ===============================

export const dashboardAPI = {

  getSummary: () =>
    api.get('/dashboard/summary'),

  getFundFlow: () =>
    api.get('/dashboard/fund-flow'),

  getProjectStats: () =>
    api.get('/dashboard/project-stats'),
};

// ===============================
// AUDIT
// ===============================

export const auditAPI = {

  getAll: () =>
    api.get('/audit'),

  getByUser: (userId) =>
    api.get(`/audit/user/${userId}`),
};

// ===============================
// NOTIFICATIONS
// ===============================

export const notificationAPI = {

  getForUser: (userId) =>
    api.get(`/notifications/user/${userId}`),

  markAsRead: (id) =>
    api.put(`/notifications/${id}/read`),
};

// ===============================
// STATES
// ===============================

export const stateAPI = {

  getAll: () =>
    api.get('/states'),
};

// ===============================
// APPROVALS
// ===============================

export const approvalAPI = {

  getAll: () =>
    api.get('/approvals'),

  getByStatus: (status) =>
    api.get(`/approvals/status/${status}`),

  getByState: (stateId) =>
    api.get(`/approvals/state/${stateId}`),

  getByUser: (userId) =>
    api.get(`/approvals/user/${userId}`),

  create: (data) =>
    api.post('/approvals', data),

  approve: (id, reviewerId) =>
    api.put(`/approvals/${id}/approve`, {
      reviewerId,
    }),

  reject: (id, reviewerId) =>
    api.put(`/approvals/${id}/reject`, {
      reviewerId,
    }),
};

// ===============================
// DOCUMENTS
// ===============================

export const documentAPI = {

  getAll: () =>
    api.get('/documents'),

  getByAgency: (agencyId) =>
    api.get(`/documents/agency/${agencyId}`),

  getByProject: (projectId) =>
    api.get(`/documents/project/${projectId}`),

  getByType: (type) =>
    api.get(`/documents/type/${type}`),

  create: (data) =>
    api.post('/documents', data),

  verify: (id) =>
    api.put(`/documents/${id}/verify`),
};

// ===============================
// EXPENSES
// ===============================

export const expenseAPI = {

  getAll: () =>
    api.get('/expenses'),

  getByAgency: (agencyId) =>
    api.get(`/expenses/agency/${agencyId}`),

  getByProject: (projectId) =>
    api.get(`/expenses/project/${projectId}`),

  create: (data) =>
    api.post('/expenses', data),

  totalByProject: (projectId) =>
    api.get(`/expenses/total/project/${projectId}`),

  totalByAgency: (agencyId) =>
    api.get(`/expenses/total/agency/${agencyId}`),
};

// ===============================
// REPORTS
// ===============================

export const reportAPI = {

  getAll: () =>
    api.get('/reports'),

  getByState: (stateId) =>
    api.get(`/reports/state/${stateId}`),

  getByType: (type) =>
    api.get(`/reports/type/${type}`),

  create: (data) =>
    api.post('/reports', data),

  verify: (id) =>
    api.put(`/reports/${id}/verify`),
};

export default api;