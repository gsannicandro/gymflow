import axios from 'axios';

const liveUrl = process.env.REACT_APP_LIVE_URL || 'http://localhost:5003';

const liveClient = axios.create({
  baseURL: `${liveUrl}/internal`,
});

liveClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const liveApi = {
  getChatHistory: (courseId) => liveClient.get(`/chat/${courseId}/messages`),
};
