import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3636/v1/application',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (data: { email: string; password: string }) => 
    api.post('/login', data),
  signup: (data: { email: string; password: string; name: string }) => 
    api.post('/signup', data),
};

export const profile = {
  get: () => api.get('/profile'),
  updateSkills: (skills: string[]) => 
    api.put('/profile/update/skill', { skills }),
  updateLinks: (links: { title: string; url: string }[]) => 
    api.put('/profile/update/link', { links }),
};

export const issues = {
  get: () => api.get('/issues/read'),
  create: (data: { title: string; description: string }) => 
    api.post('/issues/create', data),
};

export const employer = {
  createJob: (data: any) => api.post('/employer/jobs/create', data),
  getJobs: () => api.get('/employer/jobs/read'),
  updateJob: (jobId: string, data: any) => 
    api.put(`/employer/jobs/update/${jobId}`, data),
  sendAgreement: (jobId: string) => 
    api.post(`/employer/jobs/read/send-agreement/${jobId}`),
  getAgreed: () => api.get('/employer/jobs/read/agreed'),
  provideProject: (jobId: string, data: any) => 
    api.post(`/employer/jobs/read/provied-project/${jobId}`, data),
  getApplicants: (jobId: string) => 
    api.get(`/employer/jobs/read/applicants/${jobId}`),
};

export const freelancer = {
  getApplications: () => api.get('/freelancer/application/read'),
  applyJob: (jobId: string, data: any) => 
    api.post('/freelancer/application/create', { jobId, ...data }),
  updateApplication: (applicationId: string, data: any) => 
    api.put(`/freelancer/application/update/${applicationId}`, data),
  getJobs: () => api.get('/freelancer/job/read'),
  agreeToJob: (jobId: string) => 
    api.post(`/freelancer/job/agreement/apply/${jobId}`),
};

export default api;