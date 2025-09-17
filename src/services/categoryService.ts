import api from '../lib/api';

export async function getAllCategories(): Promise<any> {
  const res = await api.get('/api/categories');
  return res.data;
}

export async function getCategoryById(id: string): Promise<any> {
  const res = await api.get(`/api/categories/${id}`);
  return res.data;
}

export async function createCategory(data: any): Promise<any> {
  const res = await api.post('/api/categories', data);
  return res.data;
}

export async function updateCategory(id: string, data: any): Promise<any> {
  const res = await api.put(`/api/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: string): Promise<any> {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
}

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
