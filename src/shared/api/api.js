import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore.js';

// Instancia de axios para Auth Service (Node.js en puerto 3007)
const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL || 'http://localhost:3007/api/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Instancia de axios para User API (ServerUser en puerto 3003)
const axiosUser = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL || 'http://localhost:3003/restauranteUser/v1',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

let _isRefreshing = false;
let failedQueue = [];

function _processQueue(_error, token = null) {
  failedQueue.forEach(({ resolve, reject }) =>
    _error ? reject(_error) : resolve(token)
  );
  failedQueue = [];
}

const handleRefreshToken = async function (_error) {
  const _original = _error.config;
  if (!_original || _original._retry) {
    return Promise.reject(_error);
  }
  const status = _error.response?.status;
  const errorCode = _error.response?.data?.error;
  const requestUrl = _original.url || '';
  const isRefreshEndpoint = requestUrl.includes('/auth/refresh');
  
  const shouldAttemptRefresh = !isRefreshEndpoint && status === 401;
  const shouldAttemptRefreshFrom403 = !isRefreshEndpoint && status === 403 && errorCode === 'TOKEN_EXPIRED';

  const shouldRefresh = shouldAttemptRefresh || shouldAttemptRefreshFrom403;

  if (shouldRefresh) {
    const retryClient = _original._axiosClient === 'user' ? axiosUser : axiosAuth;
    if (_isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return retryClient(_original);
        })
        .catch((err) => Promise.reject(err));
    }
    _original._retry = true;
    _isRefreshing = true;
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      useAuthStore.getState().logout();
      return Promise.reject(_error);
    }
    try {
      const response = await axiosAuth.post('/auth/refresh', { refreshToken });
      const {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn,
        userDetails,
      } = response.data;
      
      useAuthStore.setState({
        token: accessToken || response.data.token,
        refreshToken: newRefreshToken || refreshToken,
        expiresAt: expiresIn,
        user: userDetails || useAuthStore.getState().user,
        isAuthenticated: true,
      });
      
      _processQueue(null, accessToken || response.data.token);
      return retryClient(_original);
    } catch (err) {
      _processQueue(err, null);
      useAuthStore.getState().logout();
      return Promise.reject(err);
    } finally {
      _isRefreshing = false;
    }
  }
  return Promise.reject(_error);
};

// Request interceptors para inyectar JWT Token
axiosAuth.interceptors.request.use(
  (config) => {
    config._axiosClient = 'auth';
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Content-Type', 'multipart/form-data');
      } else if (config.headers) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosUser.interceptors.request.use(
  (config) => {
    config._axiosClient = 'user';
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Content-Type', 'multipart/form-data');
      } else if (config.headers) {
        config.headers['Content-Type'] = 'multipart/form-data';
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosAuth.interceptors.response.use((res) => res, handleRefreshToken);
axiosUser.interceptors.response.use((res) => res, handleRefreshToken);

export { axiosAuth, axiosUser, handleRefreshToken };
