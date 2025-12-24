import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Trash2, Plus, Minus, ChevronRight, FileText, MessageCircle, Printer, Download, CreditCard, User } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Checkout & Invoice State
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Mock Cart Data State
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'SkyMaster Pro', price: 15000000, image: 'https://picsum.photos/id/1/200/200', qty: 1 },
    { id: 2, name: 'Baterai Cadangan 5000mAh', price: 1500000, image: 'https://picsum.photos/id/200/200/200', qty: 2 }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'catalog', label: 'Model S' },
    { id: 'custom', label: 'Custom' },
    { id: 'tracking', label: 'Lacak' },
    { id: 'portfolio', label: 'Portofolio' },
    { id: 'support', label: 'Bantuan' },
  ];

  const showSolidNav = scrolled || activePage !== 'home' || isOpen;
  
  const textColorClass = showSolidNav ? 'text-slate-900' : 'text-white';
  const hoverColorClass = showSolidNav ? 'hover:bg-slate-100' : 'hover:bg-white/10';
  const navBgClass = showSolidNav ? 'bg-white shadow-sm' : 'bg-transparent';

  // Cart Logic
  const updateQty = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.11; // PPN 11%
  const total = subtotal + tax;

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleCheckoutClick = () => {
    setIsCartOpen(false); // Close cart drawer
    setInvoiceId(`INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`); // Generate more realistic Invoice ID
    setShowInvoice(true); // Open Invoice Modal
  };

  const handleWhatsAppOrder = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert("Mohon lengkapi Nama dan Nomor Telepon pada invoice.");
      return;
    }

    const itemList = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.name} (x${item.qty}) - ${formatRupiah(item.price * item.qty)}`
    ).join('\n');

    const message = `Halo AeroTech, saya ingin konfirmasi pesanan:

*INVOICE: ${invoiceId}*
---------------------------
Nama: ${customerInfo.name}
No. HP: ${customerInfo.phone}
Alamat: ${customerInfo.address}
---------------------------
*Detail Pesanan:*
${itemList}

Subtotal: ${formatRupiah(subtotal)}
PPN (11%): ${formatRupiah(tax)}
*TOTAL: ${formatRupiah(total)}*
---------------------------
Mohon info rekening pembayaran. Terima kasih.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/6281234567890?text=${encodedMessage}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out py-4 ${navBgClass} print:hidden`}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between h-10">
            
            {/* 1. Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer z-50 relative" 
              onClick={() => {
                onNavigate('home'); 
                setIsOpen(false);
                setIsCartOpen(false);
              }}
            >
              <span className={`text-xl font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${textColorClass}`}>
                Gdrone
              </span>
            </div>
            
            {/* 2. Desktop Menu (Centered) */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-all duration-300 ${textColorClass} ${hoverColorClass} ${activePage === item.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                >
                  {item.label === 'Model S' ? 'Katalog' : item.label}
                </button>
              ))}
            </div>

            {/* 3. Right Actions (Desktop) */}
            <div className="hidden lg:flex items-center space-x-2">
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`p-2 rounded-full transition-all relative ${textColorClass} ${hoverColorClass}`}
              >
                <ShoppingBag size={20} strokeWidth={2} />
                {cartItems.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`ml-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-slate-200/20 backdrop-blur ${textColorClass} hover:bg-slate-200/40 transition-all`}
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

        {/* Mobile/Side Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-white z-40 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          } flex flex-col pt-24 px-6 pb-6`}
        >
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className="text-left text-2xl font-bold text-slate-900 py-4 border-b border-gray-100 active:bg-gray-50 flex justify-between group"
              >
                <span>{item.label === 'Model S' ? 'Katalog' : item.label}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">&rarr;</span>
              </button>
            ))}
            <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="text-left text-2xl font-bold text-slate-900 py-4 border-b border-gray-100 flex justify-between group">
              <span>Beranda</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">&rarr;</span>
            </button>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-4">
              <button className="py-4 bg-gray-100 rounded text-slate-900 font-bold uppercase tracking-widest text-xs">Akun</button>
              <button className="py-4 bg-slate-900 rounded text-white font-bold uppercase tracking-widest text-xs">Pengaturan</button>
          </div>
        </div>
      </nav>

      {/* SHOPPING CART DRAWER */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'} print:hidden`}
        onClick={() => setIsCartOpen(false)}
      />
      
      <div 
        className={`fixed inset-y-0 right-0 z-[61] w-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} print:hidden`}
      >
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
                   <button onClick={() => {setIsCartOpen(false); onNavigate('catalog');}} className="mt-4 text-slate-900 font-bold text-xs uppercase underline">Belanja Sekarang</button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-sm flex-shrink-0 overflow-hidden">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{item.name}</h3>
                          <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors ml-2">
                            <Trash2 size={16} />
                          </button>
                       </div>
                       <div className="flex justify-between items-end mt-2">
                          <p className="text-sm font-medium text-slate-600">{formatRupiah(item.price)}</p>
                          <div className="flex items-center border border-gray-200 rounded">
                             <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-100 text-slate-500"><Minus size={14}/></button>
                             <span className="text-xs w-8 text-center font-medium">{item.qty}</span>
                             <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-100 text-slate-500"><Plus size={14}/></button>
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              )}
           </div>

           {cartItems.length > 0 && (
             <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-sm font-medium text-slate-500">Subtotal</span>
                   <span className="text-lg font-bold text-slate-900">{formatRupiah(subtotal)}</span>
                </div>
                <button 
                  onClick={handleCheckoutClick}
                  className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-[4px] font-bold uppercase tracking-widest text-xs transition-all flex justify-between px-6 items-center group"
                >
                  <span>Checkout</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-3">PPN dan rincian ditampilkan di invoice.</p>
             </div>
           )}
        </div>
      </div>

      {/* SIMPLE & CLEAN INVOICE MODAL */}
      {showInvoice && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:p-0">
          <div className="absolute inset-0" onClick={() => setShowInvoice(false)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col print:max-h-none print:shadow-none print:w-full print:max-w-none print:static">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-slate-50 print:bg-white print:border-none">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">INVOICE</h2>
                <p className="text-sm text-slate-500 mt-1">Order #{invoiceId}</p>
              </div>
              <div className="text-right">
                 <h3 className="font-bold text-slate-900">AeroTech Indonesia</h3>
                 <p className="text-xs text-slate-500 mt-1">Jakarta, Indonesia</p>
                 <p className="text-xs text-slate-500">{new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto flex-1">
              
              {/* Customer Inputs */}
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase text-slate-400">Tagihan Kepada</label>
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap" 
                      className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-slate-900 placeholder:text-slate-300 bg-transparent"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                    />
                    <input 
                      type="tel" 
                      placeholder="No. WhatsApp" 
                      className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-slate-900 placeholder:text-slate-300 bg-transparent"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase text-slate-400">Alamat Pengiriman</label>
                    <textarea 
                      placeholder="Alamat Lengkap..." 
                      rows={3}
                      className="w-full border border-gray-200 rounded p-3 text-sm focus:outline-none focus:border-slate-900 placeholder:text-slate-300 resize-none bg-transparent"
                      value={customerInfo.address}
                      onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                    />
                 </div>
              </div>

              {/* Items */}
              <table className="w-full text-sm text-left mb-8">
                <thead>
                  <tr className="border-b border-gray-200 text-slate-500">
                    <th className="py-3 font-medium">Item</th>
                    <th className="py-3 text-center">Qty</th>
                    <th className="py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-4 text-slate-900">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-slate-500">{formatRupiah(item.price)} / unit</div>
                      </td>
                      <td className="py-4 text-center text-slate-500">{item.qty}</td>
                      <td className="py-4 text-right font-medium text-slate-900">{formatRupiah(item.price * item.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary */}
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-t border-gray-100 pt-6">
                 <div className="text-sm text-slate-500 max-w-xs">
                    <p className="font-bold text-slate-900 mb-1">Pembayaran:</p>
                    <p>BCA 883-091-2234</p>
                    <p>a/n PT AeroTech Indonesia</p>
                 </div>
                 
                 <div className="w-full md:w-auto min-w-[200px] space-y-2 text-right">
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span>Subtotal</span>
                      <span>{formatRupiah(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-sm">
                      <span>PPN (11%)</span>
                      <span>{formatRupiah(tax)}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold text-lg pt-2 border-t border-gray-100 mt-2">
                      <span>Total</span>
                      <span>{formatRupiah(total)}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Actions (Hidden on Print) */}
            <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-end gap-3 print:hidden flex-shrink-0">
               <button onClick={() => setShowInvoice(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                 Tutup
               </button>
               <button onClick={handlePrint} className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-slate-700 hover:bg-gray-50 flex items-center transition-colors">
                  <Printer size={16} className="mr-2"/> Cetak
               </button>
               <button onClick={handleWhatsAppOrder} className="px-6 py-2 bg-slate-900 text-white rounded text-sm font-bold hover:bg-black flex items-center transition-colors shadow-sm">
                  <MessageCircle size={16} className="mr-2"/> Order WhatsApp
               </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;