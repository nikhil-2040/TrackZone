import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (payload) => api.post("/api/auth/register", payload),
  login: (payload) => api.post("/api/auth/login", payload),
  me: () => api.get("/api/users/me"),
  profile: (id) => api.get(`/api/users/${id}`),
};

export const itemApi = {
  list: (params) => api.get("/api/items", { params }),
  create: (payload, token) =>
    api.post("/api/items", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  match: (payload) => api.post("/api/items/match", payload),
  getById: (id) => api.get(`/api/items/${id}`),
};

export const contactApi = {
  list: (params) => api.get("/api/contact-requests", { params }),
  create: (itemId, payload) => api.post(`/api/contact-requests/${itemId}`, payload),
  share: (id, payload) => api.post(`/api/contact-requests/${id}/share`, payload),
};

export default api;
