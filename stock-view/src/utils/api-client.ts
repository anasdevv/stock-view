import { auth } from '@/firebase.config';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3009',
});

api.interceptors.request.use(async (config) => {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  //   console.log('user ', auth, user, auth?.currentUser?.getIdToken());
  console.log('user', user);
  if (user) {
    config.headers.Authorization = `Bearer ${
      user?.stsTokenManager?.accessToken ?? ''
    }`;
  }
  return config;
});

export default api;
