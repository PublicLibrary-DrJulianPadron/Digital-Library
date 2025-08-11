import api from '@/common/api/apiClient';
import type { paths } from '@/common/types/generated-api-types';

export type LoginResponse = paths['/api/users/login/']['post']['responses']['200']['content']['application/json'];
export type SingupResponse = paths['/api/users/register/']['post']['responses']['201']['content']['application/json'];

export const signUp = async (data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const res = await api.post('users/register/', { json: data }).json<SingupResponse>();
  return res;
};

export const logIn = async (data: { username: string, password: string }) => {
  const res = await api.post('users/login/', { json: { data } }).json<LoginResponse>();
  return res;
};

export const storeAuthData = (auth: LoginResponse) => {
  localStorage.setItem("accessToken", auth.access);
  localStorage.setItem("refreshToken", auth.refresh);
  localStorage.setItem("email", auth.user.email);
  localStorage.setItem("user_id", auth.user.id);
  localStorage.setItem("first_name", auth.user.first_name);
  localStorage.setItem("last_name", auth.user.last_name);
};