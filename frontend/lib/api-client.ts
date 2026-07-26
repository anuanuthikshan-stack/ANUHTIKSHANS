import axios from 'axios';

// Default to internal Next.js Route Handlers (/api) for self-contained Vercel serverless deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT bearer token if present
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// API Helper Methods
export const api = {
  // Auth
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
  register: (userData: any) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me'),

  // Dataset
  uploadCSV: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getStatistics: (plant?: string) =>
    apiClient.get('/statistics', { params: { plant } }),

  // EDA
  getEDACharts: (plant?: string) =>
    apiClient.get('/eda/charts', { params: { plant } }),

  // Forecasting
  getARIMAForecast: (horizon = 6, plant?: string) =>
    apiClient.get('/forecast/arima', { params: { horizon, plant } }),
  getProphetForecast: (horizon = 6, plant?: string) =>
    apiClient.get('/forecast/prophet', { params: { horizon, plant } }),
  getXGBoostForecast: (horizon = 6, plant?: string) =>
    apiClient.get('/forecast/xgboost', { params: { horizon, plant } }),
  getComparison: (horizon = 6, plant?: string) =>
    apiClient.get('/comparison', { params: { horizon, plant } }),
  getABCAnalysis: () => apiClient.get('/abc-analysis'),

  // Reports
  downloadReport: (format = 'pdf', plant?: string, horizon = 6) =>
    apiClient.get('/generate-report', {
      params: { format, plant, horizon },
      responseType: 'blob',
    }),
};
