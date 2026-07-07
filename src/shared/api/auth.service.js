import { axiosAuth } from './api.js';

export const loginRequest = async (data) => {
  return await axiosAuth.post('/auth/login', data);
};

export const registerRequest = async (formData) => {
  return await axiosAuth.post('/auth/register', formData);
};

export const verifyEmailRequest = async (token) => {
  return await axiosAuth.post('/auth/verify-email', { token });
};

export const resendVerificationRequest = async (email) => {
  return await axiosAuth.post('/auth/resend-verification', { email });
};

export const forgotPasswordRequest = async (email) => {
  return await axiosAuth.post('/auth/forgot-password', { email });
};

export const resetPasswordRequest = async (payload) => {
  return await axiosAuth.post('/auth/reset-password', payload);
};

export const getProfileRequest = async () => {
  return await axiosAuth.get('/auth/profile');
};
