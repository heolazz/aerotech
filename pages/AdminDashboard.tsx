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
  Filter,
  MoreHorizontal
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

  // --- Helper UI (Clean Badge Style) ---
  const getStatusBadge = (status: string) => {
    const baseClass = "px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-sm border";
    switch (status) {
      case 'PENDING': return <span className={`${baseClass} bg-gray-50 text-gray-600 border-gray-200`}>Pending</span>;
      case 'PROCESS': return <span className={`${baseClass} bg-blue-50 text-blue-600 border-blue-100`}>Processing</span>;
      case 'SHIPPED': return <span className={`${baseClass} bg-indigo-50 text-indigo-600 border-indigo-100`}>Shipped</span>;
      case 'DELIVERED': return <span className={`${baseClass} bg-green-50 text-green-600 border-green-100`}>Completed</span>;
      default: return <span className={`${baseClass} bg-gray-50 text-gray-500`}>{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-slate-900 selection:bg-black selection:text-white">
      
      {/* 1. HEADER (Minimalist) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* 2. STATS (Clean Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Revenue', val: formatRupiah(orders.reduce((acc, c) => acc + c.totalPrice, 0)) },
            { label: 'Total Orders', val: orders.length },
            { label: 'Pending', val: orders.filter(o => o.status === 'PENDING').length },
            { label: 'Completed', val: orders.filter(o => o.status === 'DELIVERED').length }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-4 sm:p-6 border border-gray-100 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">{stat.label}</p>
              <p className="text-lg sm:text-2xl font-bold text-slate-900">{stat.val}</p>
            </div>
          ))}
        </div>

        {/* 3. CONTROLS (Search & Filter) */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search order ID or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:border-black focus:ring-0 transition-all"
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {['ALL', 'PENDING', 'PROCESS', 'SHIPPED', 'DELIVERED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm border transition-all whitespace-nowrap ${
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

        {/* 4. CONTENT (Desktop Table & Mobile Cards) */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden min-h-[400px]">
          
          {loading ? (
             <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading data...</div>
          ) : filteredOrders.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-400">
               <p className="text-sm">No orders found.</p>
             </div>
          ) : (
            <>
              {/* DESKTOP TABLE (Hidden on Mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-[10px] tracking-widest">Order ID</th>
                      <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-[10px] tracking-widest">Customer</th>
                      <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-[10px] tracking-widest">Status</th>
                      <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-[10px] tracking-widest">Total</th>
                      <th className="px-6 py-4 font-semibold text-gray-500 uppercase text-[10px] tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs">{order.orderId}</td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{order.customerName}</div>
                          <div className="text-xs text-gray-400">{order.type === 'CUSTOM' ? 'Custom Build' : 'Catalog Order'}</div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 font-medium">{formatRupiah(order.totalPrice)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"><Eye size={16}/></button>
                            <button onClick={() => handleDelete(order.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16}/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS (Hidden on Desktop) */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                         <span className="text-xs font-mono text-gray-400 block mb-1">{order.orderId}</span>
                         <span className="font-bold text-slate-900">{order.customerName}</span>
                         <span className="text-xs text-gray-400 block">{order.type}</span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-50">
                       <span className="font-bold text-sm">{formatRupiah(order.totalPrice)}</span>
                       <div className="flex gap-3">
                          <button onClick={() => setSelectedOrder(order)} className="text-sm font-medium text-blue-600">Details</button>
                          <button onClick={() => handleDelete(order.id)} className="text-sm font-medium text-red-500">Delete</button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* 5. ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold uppercase tracking-widest text-sm">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)}><X size={20} className="text-gray-400 hover:text-black"/></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
               {/* Status Control */}
               <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Update Status</label>
                  <div className="relative">
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm font-medium focus:border-black focus:ring-0 appearance-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESS">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"/>
                  </div>
               </div>

               {/* Customer Info */}
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1">Customer</label>
                    <p className="font-bold text-sm">{selectedOrder.customerName}</p>
                    <p className="text-xs text-gray-500">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1">Total</label>
                    <p className="font-bold text-sm">{formatRupiah(selectedOrder.totalPrice)}</p>
                  </div>
               </div>

               <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-1">Shipping Address</label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-sm border border-gray-100">{selectedOrder.address || 'No address provided'}</p>
               </div>

               {/* Item Details */}
               <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Item Specification</label>
                  <div className="border border-gray-100 rounded-sm p-3">
                     <p className="font-bold text-sm mb-1">{selectedOrder.items}</p>
                     {selectedOrder.specs && (
                       <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100 font-mono whitespace-pre-wrap">
                         {selectedOrder.specs}
                       </p>
                     )}
                     {selectedOrder.details && (
                       <p className="text-xs text-gray-600 mt-2 italic">Note: {selectedOrder.details}</p>
                     )}
                  </div>
               </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
               <button onClick={() => window.print()} className="flex-1 py-3 bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-black transition-colors flex items-center justify-center gap-2">
                 <Printer size={14}/> Print
               </button>
               <button onClick={() => setSelectedOrder(null)} className="flex-1 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
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