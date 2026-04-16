import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = `${import.meta.env.VITE_API_URL}/api`; // Tọa Độ Trạm Máy Chủ Ngầm

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [usersDb, setUsersDb] = useState([]);

  // Bắn Fetch Call tải danh sách Data Sống thay vì dùng Mock DB
  const fetchActiveUsers = async () => {
    if (user?.role !== 'ADMIN') return;
    try {
      const res = await fetch(`${API_URL}/users`);
      if(res.ok) {
        const data = await res.json();
        setUsersDb(data);
      }
    } catch (e) {
      console.error('Đứt mạng LAN Nội bộ Backend:', e);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, [user]);

  // Bộ Xác Thực Qua API
  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user)); 
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (e) {
      return { success: false, message: '⚠ Báo Động Khẩn. Core Backend Cổng 5000 bị Mất Nguồn!' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user'); 
  };

  // ----- CẦU NỐI MẠNG LƯỚI CRUD ADMIN TỚI BACKEND -----
  const systemAddUser = async (userData) => { 
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      
      if(data.success) {
         await fetchActiveUsers();
         return { success: true };
      }
      return { success: false, message: data.message };
    } catch(e) {
      return { success: false, message: 'Lỗi Truyền Gói Tin Kép' };
    }
  };
  
  const systemEditUser = async (id, updatedData) => { 
    try {
       await fetch(`${API_URL}/users/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(updatedData)
       });
       await fetchActiveUsers();

       if (user && user.id === id) {
         const uInfo = { id, username: updatedData.username, role: updatedData.role };
         setUser(uInfo);
         localStorage.setItem('auth_user', JSON.stringify(uInfo)); 
       }
    } catch(e) {}
  };
  
  const systemDeleteUser = async (id) => { 
    try {
      await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      await fetchActiveUsers();
    } catch(e) {}
  };

  return (
    <AuthContext.Provider value={{ 
        user, login, logout, isAdmin: user?.role === 'ADMIN',
        usersDb, systemAddUser, systemEditUser, systemDeleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
