import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Menu, X, ShoppingBag, Trash2, Plus, Minus, ChevronRight, Loader2, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const navigate = useNavigate();
  const { cartItems, updateQty, removeFromCart, totalPrice, clearCart } = useCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format Rupiah
  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  // Navigation Handler
  const handleNavClick = (path: string) => {
    onNavigate(path);
    navigate(path === 'home' ? '/' : `/${path}`);
    setIsOpen(false);
    setIsCartOpen(false);
  };

  // Checkout Logic
  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Mohon lengkapi Nama, WhatsApp, dan Alamat.");
      return;
    }

    setIsCheckoutLoading(true);

    try {
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const itemsSummary = cartItems.map(item => `${item.name} (${item.qty}x)`).join(', ');

      await addDoc(collection(db, "orders"), {
        orderId: orderId,
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        items: itemsSummary,
        totalPrice: totalPrice,
        status: 'PENDING',
        type: 'CATALOG',
        createdAt: serverTimestamp()
      });

      alert(`Pesanan Berhasil!\nKode Tracking Anda: ${orderId}`);
      clearCart();
      setCustomerInfo({ name: '', phone: '', address: '' });
      setIsCartOpen(false);
      navigate('/tracking');

    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Styling Classes
  const showSolidNav = scrolled || activePage !== 'home' || isOpen;
  const textColorClass = showSolidNav ? 'text-slate-900' : 'text-white';
  const navBgClass = showSolidNav ? 'bg-white shadow-sm' : 'bg-transparent';

  const navItems = [
    { id: 'catalog', label: 'Model S' },
    { id: 'custom', label: 'Custom' },
    { id: 'tracking', label: 'Lacak' },
    { id: 'portfolio', label: 'Portofolio' },
    { id: 'support', label: 'Bantuan' },
  ];

  return (
    <>
      {/* --- MAIN NAVBAR --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out py-4 ${navBgClass}`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-10">
            
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer z-50 relative" onClick={() => handleNavClick('home')}>
              {/* <span className={`text-xl font-bold tracking-[0.2em] lowercase transition-colors duration-300 ${textColorClass}`}>
                Gdrone
              </span> */}
              <img 
                src="/images/logo.png" 
                alt="Gdrone Logo" 
                className={`
                  transition-all duration-300 w-auto object-contain
                  h-12 md:h-16  /* <-- UKURAN DIPERBESAR (Tadi h-8 md:h-10) */
                  ${showSolidNav ? '' : 'brightness-0 invert'} /* <-- EFEK JADI PUTIH */
                `} 
              />
            </div>
            
            {/* Desktop Menu (Center Links) */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 hover:bg-black/5 ${textColorClass} ${activePage === item.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                >
                  {item.label === 'Model S' ? 'Katalog' : item.label}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <button onClick={() => setIsCartOpen(true)} className={`p-2 rounded-full transition-all relative hover:bg-black/5 ${textColorClass}`}>
                <ShoppingBag size={20} strokeWidth={2} />
                {cartItems.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
              
              <button 
                onClick={() => setIsOpen(true)}
                className={`ml-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-slate-200/20 backdrop-blur hover:bg-slate-200/40 transition-all flex items-center gap-2 ${textColorClass}`}
              >
                Menu
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="lg:hidden z-50 flex items-center gap-4">
               <button onClick={() => setIsCartOpen(true)} className={`p-2 transition-colors relative ${textColorClass}`}>
                <ShoppingBag size={22} strokeWidth={2} />
                 {cartItems.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>

               <button onClick={() => setIsOpen(true)} className={`p-2 rounded-md focus:outline-none transition-colors ${textColorClass} ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
                 <span className="text-xs font-bold uppercase tracking-widest border border-current px-3 py-1 rounded">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- FULLSCREEN MENU OVERLAY (FIXED) --- */}
      <div 
        className={`fixed inset-0 bg-white z-[60] transition-all duration-500 ease-in-out flex flex-col ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-5'
        }`}
      >
        {/* Header Overlay - Fixed Height agar tidak gerak */}
        <div className="w-full flex-shrink-0 border-b border-gray-100 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-between items-center">
             <span className="text-xl font-bold tracking-[0.2em] uppercase text-slate-900">
                Gdrone
             </span>
             <button 
               onClick={() => setIsOpen(false)}
               className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group"
             >
                <X size={24} className="text-slate-500 group-hover:text-slate-900 transition-colors" />
             </button>
          </div>
        </div>

        {/* Content Links - Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          
          {/* --- BAGIAN PENGATUR POSISI VERTIKAL --- */}
          <div className="max-w-[1400px] mx-auto px-6 h-full flex flex-col justify-start">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
              {/* Left: Main Links */}
              <div className="flex flex-col space-y-2">
                {navItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="text-left py-3 md:py-4 border-b border-gray-100 group flex items-center justify-between transition-all hover:pl-4"
                    style={{ animationDelay: `${idx * 50}ms` }} 
                  >
                    <span className="text-3xl md:text-5xl font-bold text-slate-900 group-hover:text-black">
                      {item.label === 'Model S' ? 'Katalog' : item.label}
                    </span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 text-slate-400" />
                  </button>
                ))}
                <button 
                  onClick={() => handleNavClick('home')} 
                  className="text-left py-3 md:py-4 border-b border-gray-100 group flex items-center justify-between transition-all hover:pl-4"
                >
                  <span className="text-3xl md:text-5xl font-bold text-slate-900 group-hover:text-black">Beranda</span>
                </button>
              </div>

              {/* Right: Extra Info (Visible on Desktop) */}
              <div className="hidden md:flex flex-col justify-start items-start space-y-8 pl-12 border-l border-gray-100 pt-4">
                 <div className="w-full">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Featured</h4>
                    
                    {/* --- BAGIAN GANTI LOGO --- */}
                    <div 
                      className="w-full p-6 bg-gray-50 rounded-lg overflow-hidden relative cursor-pointer group flex items-center justify-center"
                      onClick={() => handleNavClick('custom')}
                    >
                       {/* Ganti src dengan path logo Anda, dan gunakan object-contain */}
                       <img 
                        src="/images/logo.png" 
                        className="w-auto h-32 object-contain group-hover:scale-105 transition-transform duration-700" 
                        alt="Gdrone Logo"
                       />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 w-full">
                    <div>
                       <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Kontak</h4>
                       <p className="text-sm font-medium text-slate-900">+62 21 5555 8888</p>
                       <p className="text-sm text-slate-500">hello@gdrone.id</p>
                    </div>
                    <div>
                       <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Lokasi</h4>
                       <p className="text-sm font-medium text-slate-900">Jakarta Selatan, ID</p>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer Overlay */}
        <div className="border-t border-gray-100 bg-gray-50 flex-shrink-0">
           <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-between items-center">
              <button onClick={() => handleNavClick('login')} className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">Admin Login</button>
              <div className="flex space-x-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                 <button className="hover:text-slate-900 transition-colors">Instagram</button>
                 <button className="hover:text-slate-900 transition-colors">Twitter</button>
              </div>
           </div>
        </div>
      </div>

      {/* --- CART DRAWER (Tetap Sama) --- */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className={`fixed inset-y-0 right-0 z-[71] w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Keranjang ({cartItems.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                   <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-50"/>
                   <p className="text-sm">Keranjang Anda kosong.</p>
                   <button onClick={() => {setIsCartOpen(false); handleNavClick('catalog');}} className="mt-4 text-slate-900 font-bold text-xs uppercase underline">Belanja Sekarang</button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 border border-gray-50 rounded-lg hover:border-gray-100 transition-colors">
                    <div className="w-16 h-16 bg-gray-100 rounded-sm flex-shrink-0 overflow-hidden">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                       </div>
                       <div className="flex justify-between items-end mt-2">
                          <p className="text-xs font-medium text-slate-600">{formatRupiah(item.price)}</p>
                          <div className="flex items-center border border-gray-200 rounded">
                             <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-100 text-slate-500"><Minus size={12}/></button>
                             <span className="text-xs w-6 text-center font-medium">{item.qty}</span>
                             <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-100 text-slate-500"><Plus size={12}/></button>
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              )}
           </div>

           {cartItems.length > 0 && (
             <div className="p-6 border-t border-gray-100 bg-slate-50">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">Data Pengiriman</h3>
                <div className="space-y-3 mb-6">
                  <input type="text" placeholder="Nama Lengkap" className="w-full text-sm p-3 border border-gray-200 rounded focus:border-slate-900 focus:outline-none bg-white" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  <input type="tel" placeholder="Nomor WhatsApp" className="w-full text-sm p-3 border border-gray-200 rounded focus:border-slate-900 focus:outline-none bg-white" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  <textarea placeholder="Alamat Lengkap" rows={2} className="w-full text-sm p-3 border border-gray-200 rounded focus:border-slate-900 focus:outline-none resize-none bg-white" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                </div>
                <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
                   <span className="text-sm font-medium text-slate-600">Total Pembayaran</span>
                   <span className="text-lg font-bold text-slate-900">{formatRupiah(totalPrice)}</span>
                </div>
                <button onClick={handleCheckout} disabled={isCheckoutLoading} className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded font-bold uppercase tracking-widest text-xs transition-all flex justify-between px-6 items-center group disabled:bg-slate-400">
                  <span>{isCheckoutLoading ? 'Memproses...' : 'Buat Pesanan'}</span>
                  {isCheckoutLoading ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>
             </div>
           )}
        </div>
      </div>
    </>
  );
};

export default Navbar;