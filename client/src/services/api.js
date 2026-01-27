import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const login = (email) => api.post('/auth/login', { email });
export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });

export const getPOs = () => api.get('/orders/po');
export const createPO = (data) => api.post('/orders/po', data);

export const getSOs = () => api.get('/orders/so');
export const createSO = (data) => api.post('/orders/so', data);
export const verifySO = (id) => api.post(`/orders/so/${id}/verify`);

export const getInvoices = (customerId) => api.get('/invoices', { params: { customer_id: customerId } });
export const createInvoice = (data) => api.post('/invoices', data);
export const updatePaymentStatus = (id, data) => api.patch(`/invoices/${id}/payment`, data);

export const getQueries = () => api.get('/queries');
export const createQuery = (data) => api.post('/queries', data);
export const respondToQuery = (id, data) => api.patch(`/queries/${id}/respond`, data);

export default api;
