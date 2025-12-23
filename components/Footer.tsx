import React from 'react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-white text-slate-900 py-16 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Top Grid Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16 text-xs tracking-wide">
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-slate-900 uppercase mb-2">AeroTech</h4>
            <button onClick={() => handleNav('portfolio')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">Tentang Kami</button>
            <button onClick={() => handleNav('portfolio')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">Portofolio</button>
          </div>

          <div className="flex flex-col space-y-4">
             <h4 className="font-bold text-slate-900 uppercase mb-2">Produk</h4>
            <button onClick={() => handleNav('catalog')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">SkyMaster Pro (Photo)</button>
            <button onClick={() => handleNav('catalog')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">AgriSpray X1 (Agri)</button>
            <button onClick={() => handleNav('catalog')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">InspectoVision (Ind)</button>
            <button onClick={() => handleNav('catalog')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">SpeedDemon 5 (Race)</button>
          </div>

          <div className="flex flex-col space-y-4">
             <h4 className="font-bold text-slate-900 uppercase mb-2">Layanan</h4>
            <button onClick={() => handleNav('support')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">Pusat Bantuan</button>
            <button onClick={() => handleNav('support')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">Hubungi Kami</button>
            <button onClick={() => handleNav('custom')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">Custom Order</button>
          </div>

          <div className="flex flex-col space-y-4">
             <h4 className="font-bold text-slate-900 uppercase mb-2">Pesanan</h4>
            <button onClick={() => handleNav('tracking')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">Lacak Paket</button>
            <button onClick={() => handleNav('tracking')} className="text-slate-500 hover:text-slate-900 transition-colors text-left">Cek Resi</button>
          </div>

          <div className="flex flex-col space-y-4 col-span-2 lg:col-span-1">
             <h4 className="font-bold text-slate-900 uppercase mb-2">Kontak</h4>
            <span className="text-slate-500">Jakarta Selatan, ID</span>
            <span className="text-slate-500">+62 21 5555 8888</span>
            <span className="text-slate-500">hello@aerotech.id</span>
            <div className="pt-2 flex space-x-4">
               {/* Social placeholders */}
               <div className="w-2 h-2 bg-slate-400 rounded-full hover:bg-slate-900 transition-colors cursor-pointer"></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full hover:bg-slate-900 transition-colors cursor-pointer"></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full hover:bg-slate-900 transition-colors cursor-pointer"></div>
            </div>
          </div>
        </div>

        {/* Bottom Legal */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center md:justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} PT. AeroTech Indonesia.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => handleNav('support')} className="hover:text-slate-900 transition-colors">Bantuan</button>
            <button onClick={() => handleNav('portfolio')} className="hover:text-slate-900 transition-colors">Lokasi</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;