import api from './axiosInstance';

export const getMyProfile = () =>
  api.get('/food-partner/profile');

export const getPartnerById = (id) =>
  api.get(`/food-partner/${id}`);
