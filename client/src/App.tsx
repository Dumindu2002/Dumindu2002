import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import styled from 'styled-components';
import Dashboard from './components/Dashboard/Dashboard';
import ItemManagement from './components/Items/ItemManagement';
import UserManagement from './components/Users/UserManagement';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContainer>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <MainContent>
                    <Header />
                    <Content>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/items" element={<ItemManagement />} />
                        <Route path="/users" element={<UserManagement />} />
                      </Routes>
                    </Content>
                  </MainContent>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </AppContainer>
      </Router>
    </AuthProvider>
  );
}

export default App;
