import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { StoreProvider } from '@/lib/store'
import Navbar from '@/components/Navbar'
import Home from '@/pages/Home'
import Register from '@/pages/Register'
import Login from '@/pages/Login'
import OnboardingProfil from '@/pages/OnboardingProfil'
import Dashboard from '@/pages/Dashboard'
import Members from '@/pages/Members'
import MemberDetail from '@/pages/MemberDetail'
import Events, { EventManage } from '@/pages/Events'
import Community from '@/pages/Community'
import Marketplace from '@/pages/Marketplace'
import Donate from '@/pages/Donate'
import Admin from '@/pages/Admin'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <StoreProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding-profil" element={<OnboardingProfil />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/community" element={<Community />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/events/:id/manage" element={<EventManage />} />
        </Routes>
      </StoreProvider>
    </HashRouter>
  </React.StrictMode>
)
