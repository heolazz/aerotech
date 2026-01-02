import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Pastikan path ini benar
import { db } from '../firebase'; // Pastikan path ini benar
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Menu, X, ShoppingBag, Trash2, Plus, Minus, ChevronRight, Loader2, User } from 'lucide-react';

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
  
  // Checkout Logic State
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper Formatting
  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  // Navigation Handler
  const handleNavClick = (path: string) => {
    onNavigate(path); // Update parent state (optional depending on App structure)
    navigate(path === 'home' ? '/' : `/${path}`);
    setIsOpen(false);
    setIsCartOpen(false);
  };

  // CHECKOUT PROCESS
  const handleCheckout = async () => {
    // Validasi
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Mohon lengkapi Nama, WhatsApp, dan Alamat.");
      return;
    }

    setIsCheckoutLoading(true);

    try {
      // 1. Generate ID (Client Side)
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      // 2. Prepare Items String
      const itemsSummary = cartItems.map(item => `${item.name} (${item.qty}x)`).join(', ');

      // 3. Save to Firestore
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

      // 4. Success Action
      alert(`Pesanan Berhasil!\nKode Tracking Anda: ${orderId}\nSilakan simpan kode ini.`);
      
      clearCart();
      setCustomerInfo({ name: '', phone: '', address: '' });
      setIsCartOpen(false);
      navigate('/tracking'); // Redirect ke tracking agar user bisa langsung cek

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
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out py-4 ${navBgClass}`}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-10">
            
            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer z-50 relative" 
              onClick={() => handleNavClick('home')}
            >
              <span className={`text-xl font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${textColorClass}`}>
                Gdrone
              </span>
            </div>
            
            {/* Desktop Menu */}
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
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`p-2 rounded-full transition-all relative hover:bg-black/5 ${textColorClass}`}
              >
                <ShoppingBag size={20} strokeWidth={2} />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`ml-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-slate-200/20 backdrop-blur hover:bg-slate-200/40 transition-all ${textColorClass}`}
              >
                Menu
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden z-50 flex items-center gap-4">
               <button 
                onClick={() => setIsCartOpen(true)}
                className={`p-2 transition-colors relative ${textColorClass}`}
              >
                <ShoppingBag size={22} strokeWidth={2} />
                 {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

               <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md focus:outline-none transition-colors ${textColorClass} ${isOpen ? 'bg-transparent' : 'bg-white/10 backdrop-blur-sm'}`}
              >
                {isOpen ? <X className="h-6 w-6" /> : <span className="text-xs font-bold uppercase tracking-widest border border-current px-3 py-1 rounded">Menu</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen Menu */}
        <div className={`fixed inset-0 bg-white z-40 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'} flex flex-col pt-24 px-6 pb-6`}>
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left text-2xl font-bold text-slate-900 py-4 border-b border-gray-100 active:bg-gray-50 flex justify-between group"
              >
                <span>{item.label === 'Model S' ? 'Katalog' : item.label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">&rarr;</span>
              </button>
            ))}
            <button onClick={() => handleNavClick('home')} className="text-left text-2xl font-bold text-slate-900 py-4 border-b border-gray-100 flex justify-between group">
              <span>Beranda</span>
            </button>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-4">
              <button onClick={() => handleNavClick('login')} className="py-4 bg-gray-100 rounded text-slate-900 font-bold uppercase tracking-widest text-xs">Admin Login</button>
              <button className="py-4 bg-slate-900 rounded text-white font-bold uppercase tracking-widest text-xs">Settings</button>
          </div>
        </div>
      </nav>

      {/* CART DRAWER + CHECKOUT FORM */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />
      
      <div className={`fixed inset-y-0 right-0 z-[61] w-full sm:w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
           {/* Header */}
           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">Keranjang ({cartItems.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-500">
                <X size={20} />
              </button>
           </div>

           {/* Items List */}
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
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
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

           {/* Checkout Section */}
           {cartItems.length > 0 && (
             <div className="p-6 border-t border-gray-100 bg-slate-50">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500">Data Pengiriman</h3>
                
                <div className="space-y-3 mb-6">
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    className="w-full text-sm p-3 border border-gray-200 rounded focus:border-slate-900 focus:outline-none bg-white"
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Nomor WhatsApp (Aktif)" 
                    className="w-full text-sm p-3 border border-gray-200 rounded focus:border-slate-900 focus:outline-none bg-white"
                    value={customerInfo.phone}
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                  <textarea 
                    placeholder="Alamat Lengkap Pengiriman" 
                    rows={2}
                    className="w-full text-sm p-3 border border-gray-200 rounded focus:border-slate-900 focus:outline-none resize-none bg-white"
                    value={customerInfo.address}
                    onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                  />
                </div>

                <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
                   <span className="text-sm font-medium text-slate-600">Total Pembayaran</span>
                   <span className="text-lg font-bold text-slate-900">{formatRupiah(totalPrice)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded font-bold uppercase tracking-widest text-xs transition-all flex justify-between px-6 items-center group disabled:bg-slate-400"
                >
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