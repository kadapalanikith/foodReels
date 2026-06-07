import api from './axiosInstance';

export const getFeedItems = (page = 1, limit = 10) =>
  api.get('/food', { params: { page, limit } });

export const likeFood = (foodId) =>
  api.post('/food/like', { foodId });

export const saveFood = (foodId) =>
  api.post('/food/save', { foodId });

export const incrementView = (foodId) =>
  api.post('/food/view', { foodId });

export const createFoodReel = (formData) =>
  api.post('/food', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
