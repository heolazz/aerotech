import React, { useState } from 'react';
import { Search, Package, CheckCircle, Truck, Clock, MapPin, Box, Calendar, ArrowRight } from 'lucide-react';
import { OrderStatus } from '../types';

const Tracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError('');
    setStatus(null);

    // Mock API call simulation
    setTimeout(() => {
      setLoading(false);
      if (orderId === 'ERROR') {
        setError('ID Pesanan tidak ditemukan. Silakan periksa kembali.');
      } else if (orderId === '12345') {
        setStatus(OrderStatus.SHIPPED);
      } else {
        setStatus(OrderStatus.PROCESSING); // Default mock status
      }
    }, 1500);
  };

  const timelineEvents = [
    { status: 'Paket Diterima', time: '10:00 WIB', date: '25 Okt 2023', location: 'Jakarta, ID', active: true },
    { status: 'Dalam Perjalanan', time: '14:30 WIB', date: '25 Okt 2023', location: 'Transit Hub Cikampek', active: true },
    { status: 'Tiba di Fasilitas Kota Tujuan', time: '08:15 WIB', date: '26 Okt 2023', location: 'Bandung, ID', active: status === OrderStatus.SHIPPED || status === OrderStatus.DELIVERED },
    { status: 'Kurir Membawa Paket', time: '-', date: '-', location: '-', active: status === OrderStatus.DELIVERED },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Lacak Pesanan</h1>
          <p className="text-slate-500">Pantau pergerakan drone Anda secara real-time.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-full shadow-soft max-w-xl mx-auto mb-12 flex items-center border border-gray-100">
          <div className="pl-4 text-slate-400">
             <Package size={20} />
          </div>
          <form onSubmit={handleTrack} className="flex-1 flex">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Masukkan Nomor Resi / Order ID (Contoh: 12345)"
              className="w-full bg-transparent border-none py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-black text-white px-8 rounded-full font-medium transition-all disabled:bg-slate-300"
            >
              {loading ? 'Mencari...' : 'Lacak'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-center mb-8 max-w-xl mx-auto text-sm animate-in fade-in">
            {error}
          </div>
        )}

        {/* Tracking Result Card */}
        {status && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Top Status Bar */}
            <div className="bg-slate-900 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-white">
               <div>
                  <div className="text-slate-400 text-xs uppercase tracking-widest mb-1">Status Pengiriman</div>
                  <div className="text-xl font-bold flex items-center gap-2">
                     {status} 
                     {status === OrderStatus.DELIVERED && <CheckCircle className="text-green-400" size={20} />}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Resi: <span className="text-white font-mono">{orderId}</span></div>
               </div>
               <div className="mt-4 sm:mt-0 text-right">
                  <div className="text-slate-400 text-xs uppercase tracking-widest mb-1">Estimasi Tiba</div>
                  <div className="text-lg font-bold">27 Oktober 2023</div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row">
               
               {/* Left: Timeline */}
               <div className="p-8 md:w-2/3 border-r border-gray-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Riwayat Perjalanan</h3>
                  
                  <div className="relative pl-4 space-y-8">
                     {/* Vertical Line */}
                     <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                     {timelineEvents.map((event, idx) => (
                        <div key={idx} className={`relative flex items-start pl-8 group ${event.active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                           {/* Dot */}
                           <div className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 z-10 bg-white ${event.active ? 'border-slate-900 ring-4 ring-slate-50' : 'border-gray-300'}`}></div>
                           
                           <div className="flex-1">
                              <div className="font-bold text-slate-900 text-sm mb-1">{event.status}</div>
                              <div className="text-xs text-slate-500 flex items-center gap-4">
                                 <span className="flex items-center gap-1"><Clock size={12}/> {event.time}</span>
                                 <span className="flex items-center gap-1"><Calendar size={12}/> {event.date}</span>
                              </div>
                              <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                 <MapPin size={12}/> {event.location}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right: Details & Map Mockup */}
               <div className="md:w-1/3 bg-gray-50 p-8 flex flex-col">
                  
                  {/* Map Placeholder */}
                  <div className="w-full aspect-video bg-gray-200 rounded-lg mb-6 relative overflow-hidden border border-gray-300 group">
                     <div className="absolute inset-0 bg-[url('https://picsum.photos/id/10/400/300')] bg-cover opacity-50 grayscale"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg animate-pulse">
                           <Truck size={20} className="text-slate-900" />
                        </div>
                     </div>
                     <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 text-[10px] font-bold rounded text-slate-600">
                        Live Tracking
                     </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Detail Paket</h3>
                  
                  <div className="space-y-4 text-sm">
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-slate-500">Layanan</span>
                        <span className="font-medium text-slate-900">Aero Express</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-slate-500">Berat</span>
                        <span className="font-medium text-slate-900">3.5 Kg</span>
                     </div>
                     <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-slate-500">Asuransi</span>
                        <span className="font-medium text-green-600 flex items-center gap-1"><CheckCircle size={12}/> Aktif</span>
                     </div>
                     
                     <div className="pt-4">
                        <div className="text-xs text-slate-400 mb-1">Penerima</div>
                        <div className="font-bold text-slate-900">Bapak Susanto</div>
                        <div className="text-xs text-slate-500 mt-1">Jl. Merdeka No. 45, Bandung</div>
                     </div>
                  </div>

               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;