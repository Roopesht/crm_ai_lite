import api from './api';

export const interactionsApi = {
  list: (leadId) => api.get(`/leads/${leadId}/interactions`),
  get: (id) => api.get(`/interactions/${id}`),
  create: (leadId, data) => api.post(`/leads/${leadId}/interactions`, data),
  update: (id, data) => api.put(`/interactions/${id}`, data),
  delete: (id) => api.delete(`/interactions/${id}`),
};

export default interactionsApi;
