import React from 'react';
import { ArrowRight, PenTool, Wrench, PackageSearch, ShieldCheck, ChevronRight, ChevronDown } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-slate-900">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-slate-900">
        
        {/* Background Layer with Sophisticated Overlays */}
        <div className="absolute inset-0 z-0">
          {/* Multi-layered Gradient for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-slate-900 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10"></div>
          
          <img 
            src="images/drone.jpg" 
            alt="Cinematic Drone View" 
            className="w-full h-full object-cover animate-slow-zoom opacity-80"
          />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Futuristic Badge */}
          <div className="animate-fade-in-up mb-6 md:mb-8">
            <span className="inline-flex items-center gap-2 py-2 px-5 border border-white/10 rounded-full bg-white/5 backdrop-blur-xl text-white/90 text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Teknologi Generasi Baru
            </span>
          </div>

          {/* Main Headline - Adaptive Sizes */}
          <h1 className="animate-fade-in-up delay-100 text-6xl sm:text-7xl md:text-9xl font-bold text-white mb-6 tracking-tighter leading-[0.95]">
            Pandangan <br className="hidden sm:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">Baru.</span>
          </h1>
          
          {/* Subheadline - Better Max Width */}
          <p className="animate-fade-in-up delay-200 text-base md:text-xl text-slate-300 mb-10 md:mb-14 font-light tracking-wide max-w-xl md:max-w-2xl mx-auto leading-relaxed">
            Mendefinisikan ulang batas angkasa dengan teknologi otonom yang <span className="text-white font-normal">presisi, cerdas,</span> dan siap untuk masa depan.
          </p>
          
          {/* Action Buttons - Improved Mobile Layout */}
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            <button 
              onClick={() => onNavigate('catalog')}
              className="group px-8 md:px-10 py-4 bg-white text-slate-900 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all hover:bg-blue-50 hover:ring-4 hover:ring-white/20 active:scale-95 flex items-center justify-center gap-2"
            >
              Lihat Katalog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onNavigate('custom')}
              className="px-8 md:px-10 py-4 bg-white/5 border border-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all hover:bg-white/10 hover:border-white active:scale-95"
            >
              Custom Order
            </button>
          </div>
        </div>

        {/* Bottom Scroll Indicator - More Minimal */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold rotate-0 mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* 2. PRODUCT SHOWCASE (Grid Style) */}
      <div className="max-w-[1400px] mx-auto px-6 py-20 md:py-32">
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4">Didesain untuk Performa</h2>
          <p className="text-slate-500 text-lg max-w-2xl font-light">
            Presisi teknik yang memberikan pengalaman terbang tak tertandingi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="group cursor-pointer">
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-sm mb-8 overflow-hidden relative">
              <img src="https://picsum.photos/id/1/800/600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt="Camera" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">Sinematografi 8K</h3>
            <p className="text-sm text-slate-500 leading-relaxed pr-8">Sensor gambar terbesar di kelasnya untuk tangkapan visual yang memukau dalam segala kondisi cahaya.</p>
          </div>

          {/* Feature 2 */}
          <div className="group cursor-pointer">
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-sm mb-8 overflow-hidden relative">
               <img src="https://picsum.photos/id/119/800/600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt="Efficiency" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">Efisiensi Aerodinamis</h3>
            <p className="text-sm text-slate-500 leading-relaxed pr-8">Desain bodi yang membelah angin, memberikan waktu terbang hingga 45 menit dalam sekali pengisian.</p>
          </div>

          {/* Feature 3 */}
          <div className="group cursor-pointer">
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-sm mb-8 overflow-hidden relative">
               <img src="https://picsum.photos/id/192/800/600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt="Safety" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 mb-2">Keamanan Otonom</h3>
            <p className="text-sm text-slate-500 leading-relaxed pr-8">Sistem penghindar rintangan 360 derajat untuk penerbangan bebas rasa khawatir.</p>
          </div>
        </div>
      </div>

      {/* 3. WHY AEROTECH (Clean Layout) */}
      <div className="bg-gray-50 py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Heading */}
            <div className="lg:col-span-4">
              <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-6 leading-tight">
                Mengapa AeroTech?
              </h2>
              <p className="text-xl text-slate-600 font-light leading-relaxed mb-8">
                Kami tidak menjual drone massal. <br className="hidden lg:block"/>
                Kami membangun solusi udara yang dirancang khusus untuk kebutuhan Anda.
              </p>
              <div className="w-16 h-1 bg-slate-900 mb-8"></div>
            </div>

            {/* Right: Points Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              
              <div className="flex flex-col items-start">
                <PenTool className="w-8 h-8 text-slate-900 mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Desain Kustom & Presisi</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Setiap drone dirancang berdasarkan tujuan penggunaan dan spesifikasi teknis klien untuk performa maksimal.
                </p>
              </div>

              <div className="flex flex-col items-start">
                <Wrench className="w-8 h-8 text-slate-900 mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Engineer Lokal Berpengalaman</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Dikembangkan, dirakit, dan diuji langsung oleh tim R&D profesional di Indonesia.
                </p>
              </div>

              <div className="flex flex-col items-start">
                <PackageSearch className="w-8 h-8 text-slate-900 mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Tracking Pesanan Transparan</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Pantau status produksi dan perakitan drone Anda secara real-time kapan saja menggunakan kode pesanan.
                </p>
              </div>

              <div className="flex flex-col items-start">
                <ShieldCheck className="w-8 h-8 text-slate-900 mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Dukungan & Maintenance</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Layanan purna jual prioritas dan dukungan teknis berkelanjutan untuk menjaga armada Anda tetap mengudara.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 4. LARGE IMAGE BREAK */}
      <div className="relative h-[700px] overflow-hidden">
         <img src="https://picsum.photos/id/250/1920/1080" alt="Industrial Drone" className="w-full h-full object-cover grayscale" />
         <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
            <h2 className="text-4xl md:text-5xl font-medium text-white mb-6">Solusi Industri</h2>
            <p className="text-lg text-white/80 max-w-2xl mb-10 font-light">
              Dari pertanian presisi hingga inspeksi infrastruktur. Tingkatkan produktivitas bisnis Anda dengan data udara yang akurat.
            </p>
            <button onClick={() => onNavigate('catalog')} className="border border-white text-white px-10 py-3 rounded-[4px] hover:bg-white hover:text-black transition-all font-medium uppercase tracking-wide text-xs">
              Jelajahi Industri
            </button>
         </div>
      </div>

      {/* 5. HOW TO ORDER (Timeline Style) */}
      <div className="bg-white py-20 md:py-32 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4">Cara Pemesanan</h2>
            <p className="text-slate-500 text-lg font-light">
              Proses pemesanan yang sederhana, efisien, dan transparan.
            </p>
          </div>

          <div className="relative">
            {/* Line connector */}
            <div className="hidden md:block absolute top-0 left-0 w-full h-[1px] bg-gray-200 mt-3"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              
              {/* Step 1 */}
              <div className="relative pt-0 md:pt-12">
                <div className="hidden md:block absolute top-0 left-0 w-3 h-3 bg-slate-900 rounded-full -mt-1 ring-4 ring-white"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Langkah 01</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Pilih atau Custom</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Pilih drone dari katalog kami atau ajukan custom order melalui form spesifikasi yang tersedia.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pt-0 md:pt-12">
                <div className="hidden md:block absolute top-0 left-0 w-3 h-3 bg-gray-300 rounded-full -mt-1 ring-4 ring-white"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Langkah 02</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Estimasi & Konfirmasi</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Tim kami akan meninjau kebutuhan Anda dan memberikan estimasi harga serta waktu produksi terbaik.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pt-0 md:pt-12">
                 <div className="hidden md:block absolute top-0 left-0 w-3 h-3 bg-gray-300 rounded-full -mt-1 ring-4 ring-white"></div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Langkah 03</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Pembayaran</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Lakukan pembayaran melalui metode yang aman. Produksi dimulai segera setelah konfirmasi.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative pt-0 md:pt-12">
                 <div className="hidden md:block absolute top-0 left-0 w-3 h-3 bg-gray-300 rounded-full -mt-1 ring-4 ring-white"></div>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Langkah 04</span>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Pantau & Terima</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Cek status pesanan Anda menggunakan kode pesanan hingga unit sampai di tangan Anda.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 6. EMOTIONAL CTA */}
      <div className="bg-white py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-medium text-slate-900 mb-6 leading-tight">
              Siap Membangun Drone <br/> Sesuai Kebutuhan Anda?
            </h2>
            <p className="text-xl text-slate-500 font-light mb-12">
                Konsultasikan kebutuhan Anda tanpa komitmen.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                    onClick={() => onNavigate('custom')}
                    className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white font-medium rounded-[4px] hover:bg-black transition-all flex items-center justify-center"
                >
                    Mulai Proyek Sekarang
                </button>
                 <button 
                    onClick={() => onNavigate('support')}
                    className="w-full sm:w-auto px-10 py-4 bg-transparent text-slate-900 font-medium rounded-[4px] hover:bg-gray-50 transition-all flex items-center justify-center group"
                >
                    Hubungi Tim Sales <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Home;