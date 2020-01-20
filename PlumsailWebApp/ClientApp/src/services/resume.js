import request from '@/utils/request';

export default Object.freeze({
  queryList: () => {
    return request('/api/resume');
  },
  queryItem: (id) => {
    return request(`/api/resume/${id}`);
  },
  insertItem: item => {
    return request('/api/resume', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },
  updateItem: item => {
    const { id } = item;
    return request(`/api/resume/${id}`, {
      method: 'PUT',
      body: item
    });
  },
  removeItem: (id) => {
    return request(`/api/resume/${id}`, {
      method: 'DELETE'
    });
  },
});

