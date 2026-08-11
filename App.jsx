import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Education from './pages/public/Education';
import Skills from './pages/public/Skills';
import Projects from './pages/public/Projects';
import Certificates from './pages/public/Certificates';
import Achievements from './pages/public/Achievements';
import Internship from './pages/public/Internship';
import Resume from './pages/public/Resume';
import Contact from './pages/public/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Portfolio Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/education" element={<Education />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/internship" element={<Internship />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}
