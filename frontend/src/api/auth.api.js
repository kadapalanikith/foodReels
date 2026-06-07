import api from './axiosInstance';

export const loginUser = (data) =>
  api.post('/auth/user/login', data);

export const registerUser = (data) =>
  api.post('/auth/user/register', data);

export const logoutUser = () =>
  api.post('/auth/user/logout');

export const loginPartner = (data) =>
  api.post('/auth/food-partner/login', data);

export const registerPartner = (data) =>
  api.post('/auth/food-partner/register', data);

export const logoutPartner = () =>
  api.post('/auth/food-partner/logout');

export const getMe = () =>
  api.get('/auth/me');
