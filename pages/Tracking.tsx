import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Search, Package, CheckCircle, Truck, Clock, MapPin, AlertCircle, Box } from 'lucide-react';

const Tracking: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fungsi Mencari Data di Firebase
  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      // Cari dokumen di collection 'orders' dimana orderId == input user
      const q = query(collection(db, "orders"), where("orderId", "==", orderId.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Data Ditemukan!
        const data = querySnapshot.docs[0].data();
        setOrderData(data);
      } else {
        // Data Kosong
        setError('ID Pesanan tidak ditemukan. Mohon periksa kembali.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi. Coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk menentukan apakah step timeline aktif
  const isStepActive = (currentStatus: string, stepStatus: string) => {
    const levels = ['PENDING', 'PROCESS', 'SHIPPED', 'DELIVERED'];
    const currentIndex = levels.indexOf(currentStatus);
    const stepIndex = levels.indexOf(stepStatus);
    return currentIndex >= stepIndex;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Lacak Pesanan</h1>
          <p className="text-slate-500">Pantau status pengerjaan drone Anda secara real-time.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-full shadow-lg max-w-xl mx-auto mb-12 flex items-center border border-gray-100 relative z-10">
          <div className="pl-4 text-slate-400">
             <Package size={20} />
          </div>
          <form onSubmit={handleTrack} className="flex-1 flex">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Masukkan Order ID (Contoh: INV-8392)"
              className="w-full bg-transparent border-none py-3 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 font-medium"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-black text-white px-8 rounded-full font-bold transition-all disabled:bg-slate-300 flex items-center gap-2"
            >
              {loading ? 'Mencari...' : <><Search size={16} /> Lacak</>}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-center mb-8 max-w-xl mx-auto text-sm animate-in zoom-in-95">
            <div className="flex justify-center items-center gap-2 font-bold mb-1">
              <AlertCircle size={18} />
              Oops!
            </div>
            {error}
          </div>
        )}

        {/* Result Card */}
        {orderData && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            
            {/* Top Info Bar */}
            <div className="bg-slate-900 p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                 <div className="text-slate-400 text-xs uppercase tracking-widest mb-1 font-bold">Order ID</div>
                 <div className="text-2xl font-mono font-bold tracking-tight">{orderData.orderId}</div>
                 <div className="text-slate-400 text-sm mt-1">Customer: <span className="text-white font-semibold">{orderData.customerName}</span></div>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-right">
                 <div className="text-xs text-slate-300 uppercase tracking-widest mb-1">Item</div>
                 <div className="font-bold">{orderData.items}</div>
               </div>
            </div>

            <div className="p-8 md:p-10">
              {/* Timeline Section */}
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-8 text-center md:text-left">Status Perjalanan</h3>
              
              <div className="relative">
                {/* Garis Penghubung (Desktop: Horizontal, Mobile: Vertical) */}
                <div className="hidden md:block absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full -z-0"></div>
                <div className="md:hidden absolute left-5 top-0 h-full w-1 bg-gray-100 rounded-full -z-0"></div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
                  
                  {/* Step 1: Pending */}
                  <div className={`relative flex md:flex-col items-center md:text-center gap-4 md:gap-2 group transition-all duration-500 ${isStepActive(orderData.status, 'PENDING') ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 z-10 bg-white transition-colors duration-500 ${isStepActive(orderData.status, 'PENDING') ? 'border-blue-500 text-blue-600' : 'border-gray-200 text-gray-300'}`}>
                      <Box size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Pesanan Masuk</div>
                      <div className="text-xs text-slate-500 mt-1">Menunggu konfirmasi admin</div>
                    </div>
                  </div>

                  {/* Step 2: Process */}
                  <div className={`relative flex md:flex-col items-center md:text-center gap-4 md:gap-2 transition-all duration-500 ${isStepActive(orderData.status, 'PROCESS') ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 z-10 bg-white transition-colors duration-500 ${isStepActive(orderData.status, 'PROCESS') ? 'border-blue-500 text-blue-600' : 'border-gray-200 text-gray-300'}`}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Sedang Dikerjakan</div>
                      <div className="text-xs text-slate-500 mt-1">Perakitan & setup drone</div>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className={`relative flex md:flex-col items-center md:text-center gap-4 md:gap-2 transition-all duration-500 ${isStepActive(orderData.status, 'SHIPPED') ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 z-10 bg-white transition-colors duration-500 ${isStepActive(orderData.status, 'SHIPPED') ? 'border-blue-500 text-blue-600' : 'border-gray-200 text-gray-300'}`}>
                      <Truck size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Dalam Pengiriman</div>
                      <div className="text-xs text-slate-500 mt-1">Kurir sedang menuju lokasi</div>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className={`relative flex md:flex-col items-center md:text-center gap-4 md:gap-2 transition-all duration-500 ${isStepActive(orderData.status, 'DELIVERED') ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 z-10 bg-white transition-colors duration-500 ${isStepActive(orderData.status, 'DELIVERED') ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-300'}`}>
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Selesai</div>
                      <div className="text-xs text-slate-500 mt-1">Pesanan telah diterima</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            {/* Live Update Hint */}
            <div className="bg-blue-50 p-4 text-center text-xs text-blue-600 font-medium border-t border-blue-100">
              Status ini diperbarui secara otomatis (Realtime)
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Tracking;