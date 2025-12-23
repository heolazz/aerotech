import React, { useState } from 'react';
import { Award, Star, MapPin, ArrowUpRight, ShieldCheck, Activity, Users, CheckCircle2, Quote } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const stats = [
    { label: 'Tahun Pengalaman', value: '8+', icon: <Activity className="w-5 h-5" /> },
    { label: 'Proyek Selesai', value: '150+', icon: <CheckCircle2 className="w-5 h-5" /> },
    { label: 'Pilot Bersertifikat', value: '12', icon: <Users className="w-5 h-5" /> },
    { label: 'Penghargaan', value: '5', icon: <Award className="w-5 h-5" /> },
  ];

  const projects = [
    {
      id: 1,
      title: "Pemetaan Perkebunan Sawit",
      location: "Riau, Sumatera",
      category: "Agriculture",
      image: "https://picsum.photos/id/119/800/600",
      description: "Pemetaan lahan seluas 5.000 hektar menggunakan drone Fixed Wing VTOL untuk analisis kesehatan tanaman multispektral.",
      client: "PT Sawit Makmur"
    },
    {
      id: 2,
      title: "Inspeksi Infrastruktur SUTET",
      location: "Jawa Barat",
      category: "Industrial",
      image: "https://picsum.photos/id/250/800/600",
      description: "Inspeksi visual dan thermal otomatis pada 150 tower transmisi listrik PLN tanpa mematikan aliran listrik.",
      client: "PLN Distribusi Jabar"
    },
    {
      id: 3,
      title: "Dokumentasi Mandalika GP",
      location: "Lombok, NTB",
      category: "Media",
      image: "https://picsum.photos/id/452/800/600",
      description: "Penyediaan live feed FPV drone berkecepatan tinggi untuk siaran langsung event balap internasional.",
      client: "Dorna Sports"
    },
    {
      id: 4,
      title: "Monitoring Konstruksi Tol",
      location: "Trans Sumatera",
      category: "Industrial",
      image: "https://picsum.photos/id/192/800/600",
      description: "Pemantauan progress mingguan dan perhitungan volume cut-and-fill otomatis untuk kontraktor utama.",
      client: "Waskita Karya"
    },
    {
      id: 5,
      title: "Penyemprotan Hama Padi",
      location: "Karawang, Jawa Barat",
      category: "Agriculture",
      image: "https://picsum.photos/id/433/800/600",
      description: "Deployment armada swarm drone untuk penyemprotan pestisida presisi di lahan 500 hektar dalam 2 hari.",
      client: "Gapoktan Karawang"
    }
  ];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const categories = ['All', 'Agriculture', 'Industrial', 'Media'];

  return (
    <div className="bg-white text-slate-900">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[60vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://picsum.photos/id/203/1920/1080" 
            alt="Background" 
            className="w-full h-full object-cover grayscale"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
            <ShieldCheck size={14} /> Terpercaya Sejak 2016
          </div>
          <h1 className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight leading-tight">
            Membangun Masa Depan <br/> Dari Udara
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Studi kasus penerapan teknologi drone AeroTech dalam berbagai sektor industri strategis di Indonesia.
          </p>
        </div>
      </div>

      {/* 2. STATS BANNER */}
      <div className="bg-slate-900 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {stats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center md:items-start border-r border-slate-800 last:border-0 pr-4">
                     <div className="text-slate-500 mb-2">{stat.icon}</div>
                     <span className="text-4xl font-bold text-white mb-1">{stat.value}</span>
                     <span className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 3. PROJECT GALLERY */}
      <div className="py-24 max-w-[1400px] mx-auto px-6">
         <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
               <h2 className="text-3xl font-medium text-slate-900 mb-2">Proyek Unggulan</h2>
               <p className="text-slate-500 font-light">Eksplorasi solusi yang telah kami implementasikan.</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
               {categories.map(cat => (
                  <button
                     key={cat}
                     onClick={() => setActiveFilter(cat)}
                     className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                        activeFilter === cat 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900'
                     }`}
                  >
                     {cat}
                  </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((item) => (
               <div key={item.id} className="group cursor-pointer flex flex-col h-full">
                  <div className="relative overflow-hidden rounded-lg aspect-[4/3] mb-6">
                     <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/20 backdrop-blur text-white border border-white/50 px-6 py-2 rounded-full text-sm font-medium flex items-center">
                           Lihat Detail <ArrowUpRight size={16} className="ml-2" />
                        </span>
                     </div>
                     <div className="absolute top-4 left-4">
                        <span className="bg-white text-slate-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-sm">
                           {item.category}
                        </span>
                     </div>
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                     <div className="flex items-center text-xs text-slate-500 mb-2 uppercase tracking-wide">
                        <MapPin size={12} className="mr-1" /> {item.location}
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {item.title}
                     </h3>
                     <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">
                        {item.description}
                     </p>
                     <div className="pt-4 border-t border-gray-100 mt-auto">
                        <span className="text-xs text-slate-400">Klien: <span className="text-slate-900 font-medium">{item.client}</span></span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 4. CLIENTS & TESTIMONIALS */}
      <div className="bg-gray-50 py-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-medium text-slate-900">Dipercaya Industri</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  {
                     text: "AeroTech memberikan data presisi yang kami butuhkan untuk efisiensi pemupukan. ROI kami meningkat 15% dalam setahun.",
                     author: "Ir. Hendra Wijaya",
                     role: "Manager Ops, PT Sawit Makmur"
                  },
                  {
                     text: "Tim yang sangat profesional. Footage FPV yang dihasilkan benar-benar world-class dan memberikan sudut pandang baru.",
                     author: "Sarah Amanda",
                     role: "Director, Creative Indo"
                  },
                  {
                     text: "Solusi pemetaan 3D dari AeroTech sangat membantu kami dalam perencanaan tata ruang kota yang lebih akurat.",
                     author: "Budi Santoso",
                     role: "Kepala Dinas Tata Kota"
                  }
               ].map((testi, i) => (
                  <div key={i} className="bg-white p-8 rounded-lg shadow-soft border border-gray-100">
                     <Quote className="text-slate-200 w-10 h-10 mb-4" />
                     <p className="text-slate-600 italic mb-6 text-sm leading-relaxed">"{testi.text}"</p>
                     <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mr-3">
                           {testi.author.charAt(0)}
                        </div>
                        <div>
                           <div className="text-sm font-bold text-slate-900">{testi.author}</div>
                           <div className="text-xs text-slate-500">{testi.role}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Portfolio;