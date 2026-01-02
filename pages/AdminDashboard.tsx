import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  LogOut, 
  Search, 
  Eye, 
  Trash2, 
  Printer, 
  X,
  ChevronDown,
  Calendar,
  User,
  Package
} from 'lucide-react';

// --- Tipe Data ---
interface Order {
  id: string;
  orderId: string;
  customerName: string;
  email?: string;
  phone?: string;
  address?: string;
  status: string;
  items: string; 
  specs?: string;
  details?: string;
  totalPrice: number;
  type: 'CATALOG' | 'CUSTOM';
  createdAt: any;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // --- Fetch Data ---
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Actions ---
  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleStatusChange = async (docId: string, newStatus: string) => {
    const orderRef = doc(db, "orders", docId);
    await updateDoc(orderRef, { status: newStatus });
  };

  const handleDelete = async (docId: string) => {
    if(confirm("Hapus pesanan ini permanen?")) {
       await deleteDoc(doc(db, "orders", docId));
       if (selectedOrder?.id === docId) setSelectedOrder(null);
    }
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  // --- Filtering ---
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // --- Helper UI ---
  const getStatusBadge = (status: string) => {
    const baseClass = "px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm border";
    switch (status) {
      case 'PENDING': return <span className={`${baseClass} bg-amber-50 text-amber-600 border-amber-200`}>Pending</span>;
      case 'PROCESS': return <span className={`${baseClass} bg-blue-50 text-blue-600 border-blue-200`}>Processing</span>;
      case 'SHIPPED': return <span className={`${baseClass} bg-indigo-50 text-indigo-600 border-indigo-200`}>Shipped</span>;
      case 'DELIVERED': return <span className={`${baseClass} bg-emerald-50 text-emerald-600 border-emerald-200`}>Completed</span>;
      default: return <span className={`${baseClass} bg-gray-50 text-gray-500`}>{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-slate-900 selection:bg-black selection:text-white pb-20 md:pb-0">
      
      {/* 1. HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm md:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="font-bold text-lg tracking-widest uppercase">Gdrone<span className="text-gray-400">/Admin</span></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs font-medium text-gray-500">Administrator</span>
            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Logout">
              <LogOut size={18} className="text-slate-900"/>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        
        {/* 2. STATS (Responsive Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { label: 'Revenue', val: formatRupiah(orders.reduce((acc, c) => acc + c.totalPrice, 0)) },
            { label: 'Orders', val: orders.length },
            { label: 'Pending', val: orders.filter(o => o.status === 'PENDING').length },
            { label: 'Done', val: orders.filter(o => o.status === 'DELIVERED').length }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">{stat.label}</p>
              <p className="text-lg md:text-2xl font-bold text-slate-900">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* 3. CONTROLS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sticky md:static top-16 z-20 bg-[#F5F5F5] md:bg-transparent py-2 md:py-0">
          <div className="relative w-full md:w-96 shadow-sm md:shadow-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari ID atau Nama Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black focus:ring-0 transition-all"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['ALL', 'PENDING', 'PROCESS', 'SHIPPED', 'DELIVERED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all whitespace-nowrap shadow-sm ${
                  filterStatus === status 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CONTENT AREA */}
        <div className="min-h-[400px]">
          
          {loading ? (
             <div className="flex items-center justify-center h-64 text-gray-400 text-xs uppercase tracking-widest">Loading data...</div>
          ) : filteredOrders.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm">
               <Package size={32} className="mb-2 opacity-50"/>
               <p>Tidak ada pesanan ditemukan.</p>
             </div>
          ) : (
            <>
              {/* --- DESKTOP TABLE VIEW (Hidden on Mobile) --- */}
              <div className="hidden md:block bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Order ID</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Customer</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Status</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest">Total</th>
                        <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4 font-mono text-xs text-gray-600">{order.orderId}</td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{order.customerName}</div>
                            <div className="text-xs text-gray-400">{order.type === 'CUSTOM' ? 'Custom Build' : 'Catalog Order'}</div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                          <td className="px-6 py-4 font-medium">{formatRupiah(order.totalPrice)}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors" title="Lihat Detail"><Eye size={16}/></button>
                              <button onClick={() => handleDelete(order.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus"><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* --- MOBILE CARD VIEW (Visible on Mobile) --- */}
              {/* Menggunakan grid gap agar kartu terpisah */}
              <div className="md:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white p-5 border border-gray-200 rounded-sm shadow-sm relative overflow-hidden">
                    
                    {/* Header Kartu: ID & Status */}
                    <div className="flex justify-between items-start mb-3">
                       <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">#{order.orderId}</span>
                             {order.type === 'CUSTOM' && <span className="text-[9px] bg-purple-50 text-purple-600 px-1 rounded border border-purple-100 font-bold uppercase">Custom</span>}
                          </div>
                          <span className="font-bold text-slate-900 text-lg leading-tight">{order.customerName}</span>
                       </div>
                       {getStatusBadge(order.status)}
                    </div>

                    {/* Info Tengah: Tanggal & Total */}
                    <div className="flex justify-between items-end mb-5 pb-4 border-b border-dashed border-gray-200">
                       <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar size={12}/>
                          <span>{order.createdAt?.toDate().toLocaleDateString('id-ID')}</span>
                       </div>
                       <div className="text-right">
                          <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-0.5">Total</span>
                          <span className="font-bold text-slate-900 text-base">{formatRupiah(order.totalPrice)}</span>
                       </div>
                    </div>

                    {/* Action Buttons: Grid 2 Kolom Besar */}
                    <div className="grid grid-cols-2 gap-3">
                       <button
                         onClick={() => setSelectedOrder(order)}
                         className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-sm text-xs font-bold uppercase tracking-widest text-slate-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                       >
                         <Eye size={16} /> Detail
                       </button>
                       <button
                         onClick={() => handleDelete(order.id)}
                         className="flex items-center justify-center gap-2 px-4 py-3 border border-red-100 rounded-sm text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50/50 hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
                       >
                         <Trash2 size={16} /> Hapus
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* 5. ORDER DETAIL MODAL (Responsive) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg md:rounded-lg rounded-t-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] md:h-auto md:max-h-[90vh] animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                 <h3 className="font-bold uppercase tracking-widest text-sm text-slate-900">Order Details</h3>
                 <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedOrder.orderId}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-slate-900"/></button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-white">
               
               {/* Status Selector */}
               <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Update Status</label>
                  <div className="relative">
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      className="w-full p-3 bg-white border border-gray-200 rounded-sm text-sm font-bold text-slate-900 focus:border-black focus:ring-0 appearance-none outline-none"
                    >
                      <option value="PENDING">Pending (Masuk)</option>
                      <option value="PROCESS">Processing (Dikerjakan)</option>
                      <option value="SHIPPED">Shipped (Dikirim)</option>
                      <option value="DELIVERED">Delivered (Selesai)</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                  </div>
               </div>

               {/* Customer Info Grid */}
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-gray-400">
                       <User size={14} />
                       <label className="text-[10px] uppercase font-bold tracking-widest">Customer</label>
                    </div>
                    <p className="font-bold text-sm text-slate-900">{selectedOrder.customerName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.phone || '-'}</p>
                    <p className="text-xs text-gray-500">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-gray-400">
                       <Package size={14} />
                       <label className="text-[10px] uppercase font-bold tracking-widest">Summary</label>
                    </div>
                    <p className="font-bold text-sm text-slate-900">{formatRupiah(selectedOrder.totalPrice)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedOrder.type}</p>
                  </div>
               </div>

               {/* Address */}
               <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Shipping Address</label>
                  <p className="text-sm text-slate-700 bg-gray-50 p-3 rounded-sm border border-gray-100 leading-relaxed">
                    {selectedOrder.address || 'Alamat tidak tersedia'}
                  </p>
               </div>

               {/* Item Specs */}
               <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Item Specification</label>
                  <div className="border border-gray-100 rounded-sm">
                     <div className="p-3 bg-gray-50 border-b border-gray-100 font-bold text-sm text-slate-900">
                        {selectedOrder.items}
                     </div>
                     {selectedOrder.specs && (
                       <div className="p-3 text-xs text-slate-600 font-mono whitespace-pre-wrap leading-relaxed">
                         {selectedOrder.specs}
                       </div>
                     )}
                     {selectedOrder.details && (
                       <div className="p-3 bg-yellow-50 text-xs text-yellow-800 border-t border-yellow-100 italic">
                         Note: "{selectedOrder.details}"
                       </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-gray-200 flex gap-3 sticky bottom-0 z-10 pb-6 md:pb-4">
               <button onClick={() => window.print()} className="flex-1 py-3.5 bg-white border border-gray-300 text-xs font-bold uppercase tracking-widest text-slate-700 hover:border-slate-900 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 rounded-sm">
                 <Printer size={16}/> Print
               </button>
               <button onClick={() => setSelectedOrder(null)} className="flex-1 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors rounded-sm">
                 Close
               </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;