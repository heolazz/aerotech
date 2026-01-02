import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CustomOrder from './pages/CustomOrder';
import Tracking from './pages/Tracking';
import Support from './pages/Support';
import Portofolio from './pages/Portofolio';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';

// Komponen Wrapper agar Navbar & Footer bisa dikontrol (misal: sembunyi saat di Login)
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/login';

  // Hapus Navbar/Footer di halaman Login, tapi mungkin tetap mau ada di Dashboard?
  // Di sini saya setting Navbar tampil di semua kecuali Login page.
  const showNavbar = location.pathname !== '/login'; 
  const activePage = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {showNavbar && (
        // Note: Kamu perlu update Navbar.tsx agar menerima onNavigate yang kompatibel dgn router
        // atau ubah Navbar agar pakai <Link> dari react-router-dom. 
        // Untuk sementara kita biarkan props-nya dummy function jika pakai Link.
        <Navbar activePage={activePage} onNavigate={(path) => window.location.href = path === 'home' ? '/' : `/${path}`} />
      )}
      
      <main className="flex-grow">
        {children}
      </main>

      {showNavbar && !isAdminPage && <Footer onNavigate={() => {}} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home onNavigate={() => {}} />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/custom" element={<CustomOrder />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/support" element={<Support />} />
          <Route path="/portfolio" element={<Portofolio />} />
          
          {/* Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
    </CartProvider>
  );
};

export default App;