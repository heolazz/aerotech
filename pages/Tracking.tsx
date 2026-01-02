import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Truck, 
  Settings, 
  MapPin, 
  ArrowRight,
  Box,
  ChevronRight,
  Loader2
} from 'lucide-react';

const Tracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false); // State untuk animasi transisi

  // Fungsi Mencari Data di Firebase
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);
    setSearched(true);

    try {
      const q = query(collection(db, "orders"), where("orderId", "==", orderId.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setOrderData(data);
      } else {
        setError('ID Pesanan tidak ditemukan.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  // Helper Timeline
  const getStepStatus = (currentStatus: string, step: string) => {
    const levels = ['PENDING', 'PROCESS', 'SHIPPED', 'DELIVERED'];
    const currentIdx = levels.indexOf(currentStatus);
    const stepIdx = levels.indexOf(step);

    if (currentIdx > stepIdx) return 'completed'; // Sudah lewat
    if (currentIdx === stepIdx) return 'current'; // Sedang di sini
    return 'upcoming'; // Belum
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-sans text-slate-900 selection:bg-black selection:text-white">
      
      {/* 1. HERO SECTION (Search) */}
      <div className={`transition-all duration-700 ease-in-out ${searched && orderData ? 'pt-0 pb-12' : 'min-h-[60vh] flex flex-col justify-center items-center'}`}>
        
        <div className="max-w-2xl w-full px-6 text-center">
          <h1 className={`text-3xl md:text-5xl font-bold tracking-tight mb-4 transition-all duration-500 ${searched && orderData ? 'scale-75 opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            Lacak Pesanan
          </h1>
          <p className={`text-slate-500 mb-10 font-light text-lg transition-all duration-500 ${searched && orderData ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            Masukkan Nomor Resi atau Order ID Anda
          </p>

          <form onSubmit={handleTrack} className="relative group z-20">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Contoh: ORD-12345"
              className="w-full bg-gray-50 border border-gray-200 text-slate-900 text-lg py-5 px-6 rounded-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-gray-400 font-mono"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-black text-white px-6 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors disabled:bg-gray-300"
            >
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </button>
          </form>

          {error && (
            <div className="mt-6 text-red-500 bg-red-50 py-3 px-4 rounded-sm text-sm border border-red-100 animate-in slide-in-from-top-2">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* 2. RESULT SECTION */}
      {orderData && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 animate-in slide-in-from-bottom-10 duration-700 fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: STATUS & MAP */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Status Header */}
              <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
                        {orderData.type}
                      </span>
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                        #{orderData.orderId}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                      {orderData.status === 'PENDING' && 'Pesanan Diterima'}
                      {orderData.status === 'PROCESS' && 'Sedang Diproses'}
                      {orderData.status === 'SHIPPED' && 'Dalam Perjalanan'}
                      {orderData.status === 'DELIVERED' && 'Tiba di Tujuan'}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Estimasi</p>
                    <p className="text-lg font-bold">
                      {orderData.status === 'DELIVERED' ? 'Selesai' : '3-5 Hari Kerja'}
                    </p>
                  </div>
                </div>

                {/* Decorative Background Pattern */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gray-50 rounded-full blur-3xl opacity-50 z-0"></div>
              </div>

              {/* Visual Map Mockup (Agar terlihat 'Pro') */}
              <div className="aspect-video bg-gray-100 rounded-sm border border-gray-200 relative overflow-hidden group">
                 {/* Gambar Peta Statis (Bisa ganti image map asli jika mau) */}
                 <img 
                   src="https://maps.googleapis.com/maps/api/staticmap?center=-6.2088,106.8456&zoom=12&size=800x400&style=feature:all|element:all|saturation:-100|lightness:20&key=YOUR_API_KEY_HERE" 
                   alt="Map Visualization" 
                   className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-[20s]"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg'; 
                     (e.target as HTMLImageElement).classList.add('p-20');
                   }}
                 />
                 
                 {/* Overlay Glass */}
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                 
                 {/* Pin Animation */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                       <div className="w-4 h-4 bg-black rounded-full animate-ping absolute"></div>
                       <div className="w-4 h-4 bg-black rounded-full relative border-2 border-white shadow-xl"></div>
                    </div>
                 </div>

                 {/* Current Location Badge */}
                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-sm border border-gray-200 shadow-sm flex items-center gap-3">
                    <div className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></div>
                    <div>
                       <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Lokasi Terkini</p>
                       <p className="text-xs font-bold text-slate-900">
                          {orderData.status === 'PENDING' ? 'Gudang Pusat' : 
                           orderData.status === 'PROCESS' ? 'Workshop AeroTech' :
                           orderData.status === 'SHIPPED' ? 'Hub Logistik' : 
                           'Alamat Tujuan'}
                       </p>
                    </div>
                 </div>
              </div>

            </div>

            {/* RIGHT: TIMELINE & DETAILS */}
            <div className="space-y-6">
              
              {/* Timeline Vertical Modern */}
              <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                  Riwayat Status
                </h3>
                
                <div className="space-y-0 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-6 w-[1px] bg-gray-200"></div>

                  {[
                    { id: 'PENDING', label: 'Pesanan Diterima', desc: 'Menunggu konfirmasi', icon: Box },
                    { id: 'PROCESS', label: 'Perakitan', desc: 'Unit sedang disiapkan', icon: Settings },
                    { id: 'SHIPPED', label: 'Pengiriman', desc: 'Diserahkan ke kurir', icon: Truck },
                    { id: 'DELIVERED', label: 'Selesai', desc: 'Diterima pelanggan', icon: CheckCircle2 }
                  ].map((step, idx) => {
                    const status = getStepStatus(orderData.status, step.id);
                    const Icon = step.icon;
                    
                    return (
                      <div key={idx} className={`relative flex gap-4 pb-8 last:pb-0 group ${status === 'upcoming' ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                        {/* Dot / Icon */}
                        <div className={`relative z-10 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 ${
                          status === 'completed' ? 'bg-black border-black text-white' : 
                          status === 'current' ? 'bg-white border-black text-black ring-4 ring-gray-100' : 
                          'bg-white border-gray-300 text-gray-300'
                        }`}>
                          {status === 'completed' ? <CheckCircle2 size={12}/> : <Icon size={12} />}
                        </div>
                        
                        {/* Text */}
                        <div className="pt-0.5">
                          <p className={`text-sm font-bold transition-colors ${status === 'current' ? 'text-black' : 'text-slate-700'}`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Details Compact */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-sm">
                 <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Detail Paket</h3>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                       <span className="text-slate-500">Customer</span>
                       <span className="font-medium">{orderData.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Item</span>
                       <span className="font-medium text-right max-w-[150px] truncate">{orderData.items}</span>
                    </div>
                    {orderData.address && (
                      <div className="pt-3 border-t border-gray-200 mt-3">
                         <span className="text-xs text-slate-400 block mb-1">Alamat Tujuan</span>
                         <span className="text-slate-700 leading-relaxed text-xs">{orderData.address}</span>
                      </div>
                    )}
                 </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tracking;