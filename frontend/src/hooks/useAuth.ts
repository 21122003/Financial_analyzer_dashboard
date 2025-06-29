// File: src/hooks/useAuth.ts

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { login, logout } from '../features/auth/authSlice';
import { LoginCredentials } from '../types/User';

export const useAuth = () => {
 const dispatch = useDispatch<AppDispatch>();
 const { user, token, isAuthenticated, isLoading, error } = useSelector(
  (state: RootState) => state.auth
 );

 const handleLogin = async (credentials: LoginCredentials) => {
  return dispatch(login(credentials));
 };

 const handleLogout = () => {
  dispatch(logout());
 };

 return {
  user,
  token,
  isAuthenticated,
  isLoading,
  error,
  login: handleLogin,
  logout: handleLogout,
 };
};
