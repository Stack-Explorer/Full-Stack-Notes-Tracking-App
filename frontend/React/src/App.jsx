import SignupPage from './pages/SignupPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store.js';
import { useEffect } from 'react';
import { Loader } from "lucide-react";
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import OTPVerification from './components/OTPVerification.jsx';
import { useThemeStore } from './store/useThemeStore.js';
import HomePage from './pages/HomePage.jsx';
import { ToastContainer, Bounce } from "react-toastify";
import About from './components/About.jsx';

function App() {
  const { authUser, checkAuth, isCheckingAuth, isVerified, isOtpPending } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex h-screen justify-center items-center'>
        <Loader className='animate-spin size-10' />
      </div>
    );
  }

  return (
    <>
      <div data-theme={theme}>
        <Navbar />
        <Routes>
          <Route 
            index 
            element={authUser && !isOtpPending? <HomePage /> : <SignupPage />} 
          />
          <Route 
            path='/home' 
            element={authUser && !isOtpPending? <HomePage /> : <Navigate to="/signup" />} 
          />
          <Route path="/about" element={<About />} />
          <Route 
            path='/signup' 
            element={authUser && !isOtpPending? <Navigate to="/home" /> : <SignupPage />} 
          />
          <Route 
            path='/login' 
            element={authUser && !isOtpPending? <Navigate to="/home" /> : <LoginPage />} 
          />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/otp-verification' element={<OTPVerification />}  />
        </Routes> 
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss  
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;