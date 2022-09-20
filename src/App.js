import React from 'react'
import './App.css';
import { BrowserRouter, Routes, Route,  Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { PrivateRoute } from './components/PrivateRoute';

import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { About } from './pages/About/About'
import { Details } from './pages/Details/Details'
import { NotFound } from './pages/NotFound/NotFound'
import { SignUp } from './pages/SignUp/SignUp'
import { SignIn } from './pages/SignIn/SignIn'
import { MyPage } from './pages/MyPage/MyPage'
import { DeleteAccount } from './pages/DeleteAccount/DeleteAccount';
import { AddWebsite } from './pages/AddWebsite/AddWebsite'
import { EditWebsite } from './pages/EditWebsite/EditWebsite';
import { Creator } from './pages/Creator/Creator'
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword'
import { Footer } from './components/Footer/Footer'
import { PrivacyPolicy } from './pages/PrivacyPolicy/PrivacyPolicy'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/creators/:id" element={<Creator />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/mypage" element={<PrivateRoute />}>
            <Route path="/mypage" element={<MyPage />} /> 
          </Route>
          <Route path="/delete-account" element={<PrivateRoute />}>
            <Route path="/delete-account" element={<DeleteAccount/>} />
          </Route>
          <Route path="/addwebsite" element={<PrivateRoute />}>
            <Route path="/addwebsite" element={<AddWebsite />} /> 
          </Route>
          <Route path="/edit-website/:id" element={<PrivateRoute />}>
            <Route path="/edit-website/:id" element={<EditWebsite />} />
          </Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/navigate" element={<Navigate to="/" />} />

        </Routes>
        <Footer />
      </BrowserRouter>
      <ToastContainer hideProgressBar />
    </div>
  );
}

export default App;
