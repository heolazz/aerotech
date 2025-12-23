import React, { useState } from 'react';
import { Drone, DroneCategory } from '../types';
import { X, ArrowRight, Battery, Wifi, Camera as CameraIcon, Info, Scale, Ruler, Cpu, ChevronRight } from 'lucide-react';

const MOCK_DRONES: Drone[] = [
  {
    id: 'd1',
    name: 'SkyMaster Pro',
    category: DroneCategory.PHOTOGRAPHY,
    price: 15000000,
    image: 'https://picsum.photos/id/1/800/600',
    description: 'Drone fotografi profesional dengan sensor 1 inci dan kemampuan rekam 5.4K. Dilengkapi dengan obstacle avoidance 4 arah untuk keamanan maksimal.',
    specs: { 
      range: '12 km', 
      battery: '31 menit', 
      camera: '20MP 1" CMOS',
      weight: '900g',
      dimensions: '322×242×84 mm',
      flightController: 'AeroSense V2'
    }
  },
  {
    id: 'd2',
    name: 'AgriSpray X1',
    category: DroneCategory.AGRICULTURE,
    price: 150000000,
    image: 'https://picsum.photos/id/119/800/600',
    description: 'Solusi penyemprotan otomatis untuk lahan pertanian luas. Presisi tinggi dengan radar RTK untuk pemetaan kontur tanah yang akurat.',
    specs: { 
      range: '5 km', 
      battery: '20 menit', 
      camera: 'FPV HD',
      weight: '24 kg',
      dimensions: '1500×1500×600 mm',
      flightController: 'AgriCore RTK'
    }
  },
  {
    id: 'd3',
    name: 'SpeedDemon 5',
    category: DroneCategory.RACING,
    price: 5000000,
    image: 'https://picsum.photos/id/96/800/600',
    description: 'Drone balap FPV siap terbang. Sasis serat karbon ultra ringan dengan stack flight controller terbaru untuk responsivitas ekstrem.',
    specs: { 
      range: '2 km', 
      battery: '8 menit', 
      camera: 'Caddx Ratel 2',
      weight: '450g',
      dimensions: '210×210×50 mm',
      flightController: 'F7 Dual Gyro'
    }
  },
  {
    id: 'd4',
    name: 'InspectoVision',
    category: DroneCategory.INDUSTRIAL,
    price: 85000000,
    image: 'https://picsum.photos/id/250/800/600',
    description: 'Drone inspeksi industri dengan kamera termal dan zoom optik 50x. Tahan cuaca ekstrem (IP55) dan angin kencang.',
    specs: { 
      range: '15 km', 
      battery: '45 menit', 
      camera: 'Thermal + 48MP',
      weight: '3.2 kg',
      dimensions: '600×600×400 mm',
      flightController: 'IndusPro Pilot'
    }
  },
  {
    id: 'd5',
    name: 'Mini Air 2',
    category: DroneCategory.PHOTOGRAPHY,
    price: 8500000,
    image: 'https://picsum.photos/id/180/800/600',
    description: 'Kecil namun bertenaga. Sempurna untuk travel vlogging. Berat di bawah 249g sehingga bebas registrasi di banyak negara.',
    specs: { 
      range: '10 km', 
      battery: '34 menit', 
      camera: '4K 30fps',
      weight: '249g',
      dimensions: '140×82×57 mm',
      flightController: 'AeroLite OS'
    }
  },
  {
    id: 'd6',
    name: 'HeavyLift 600',
    category: DroneCategory.INDUSTRIAL,
    price: 250000000,
    image: 'https://picsum.photos/id/192/800/600',
    description: 'Drone pengangkut beban berat hingga 10kg untuk logistik jarak dekat. Sistem release otomatis dan winch tersedia opsional.',
    specs: { 
      range: '8 km', 
      battery: '25 menit', 
      camera: 'Sensor Halangan',
      weight: '15 kg',
      dimensions: '1200×1200×800 mm',
      flightController: 'CargoLogic AI'
    }
  }
];

const Catalog: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedDrone, setSelectedDrone] = useState<Drone | null>(null);

  const categories = ['All', ...Object.values(DroneCategory)];

  const filteredDrones = filter === 'All' 
    ? MOCK_DRONES 
    : MOCK_DRONES.filter(d => d.category === filter);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const handleOrder = (drone: Drone) => {
    alert(`Pesanan untuk ${drone.name} telah ditambahkan ke keranjang!`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-20">
      
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
        <h1 className="text-3xl md:text-5xl font-medium mb-4 tracking-tight">Armada Kami</h1>
        <p className="text-slate-500 text-sm md:text-xl font-light max-w-2xl">
          Eksplorasi jajaran drone canggih yang dirancang untuk setiap misi, mulai dari sinematografi hingga inspeksi industri berat.
        </p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[60px] z-30 bg-white/90 backdrop-blur border-b border-gray-100 mb-8 md:mb-16">
        <div className="max-w-[1400px] mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex space-x-6 md:space-x-8 py-4 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs md:text-sm font-bold uppercase tracking-widest transition-all relative pb-2 ${
                  filter === cat 
                    ? 'text-slate-900' 
                    : 'text-slate-400 hover:text-slate-800'
                }`}
              >
                {cat}
                {filter === cat && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-900"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid - Gallery Style */}
      <div className="max-w-[1400px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filteredDrones.map(drone => (
            <div key={drone.id} className="group flex flex-col">
              {/* Image Container */}
              <div 
                className="w-full aspect-[4/3] bg-gray-100 rounded-sm mb-6 overflow-hidden relative cursor-pointer"
                onClick={() => setSelectedDrone(drone)}
              >
                <img 
                  src={drone.image} 
                  alt={drone.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    className="text-lg md:text-xl font-medium text-slate-900 cursor-pointer group-hover:underline decoration-1 underline-offset-4"
                    onClick={() => setSelectedDrone(drone)}
                  >
                    {drone.name}
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-gray-50 px-2 py-1 rounded text-[10px] uppercase tracking-wide border border-gray-100">
                    {drone.category}
                  </span>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                  {drone.description}
                </p>

                {/* Quick Specs - Horizontal */}
                <div className="flex items-center space-x-6 text-xs text-slate-500 mb-8 border-t border-gray-100 pt-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm mb-0.5">{drone.specs.range}</span>
                    <span>Jarak</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm mb-0.5">{drone.specs.battery}</span>
                    <span>Waktu</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm mb-0.5 truncate max-w-[80px]">{drone.specs.camera.split(' ')[0]}</span>
                    <span>Kamera</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleOrder(drone)}
                    className="flex-1 py-3 bg-white border border-slate-900 text-slate-900 rounded-[4px] font-bold uppercase tracking-widest text-xs transition-all hover:bg-slate-900 hover:text-white"
                  >
                    Pesan
                  </button>
                  <button 
                     onClick={() => setSelectedDrone(drone)}
                     className="flex-1 py-3 bg-gray-100 text-slate-900 rounded-[4px] font-bold uppercase tracking-widest text-xs transition-colors hover:bg-gray-200"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDrone && (
        <div 
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setSelectedDrone(null)}
        >
          <div 
            className="bg-white rounded-t-2xl md:rounded-lg w-full max-w-6xl h-[90vh] md:h-auto max-h-[95vh] md:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedDrone(null)} 
              className="absolute top-4 right-4 z-50 p-2 bg-white/50 backdrop-blur-md rounded-full text-slate-900 hover:bg-white transition-all shadow-sm"
            >
              <X size={24} />
            </button>

            {/* Left: Image (Scrollable on mobile, sticky on desktop) */}
            <div className="w-full md:w-3/5 bg-gray-100 relative h-64 md:h-auto flex-shrink-0">
              <img 
                src={selectedDrone.image} 
                alt={selectedDrone.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Right: Details (Scrollable) */}
            <div className="w-full md:w-2/5 p-6 md:p-12 overflow-y-auto bg-white flex flex-col h-full">
              <div className="mb-6 md:mb-8">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 block">{selectedDrone.category}</span>
                <h2 className="text-2xl md:text-4xl font-medium text-slate-900 mb-2 tracking-tight">{selectedDrone.name}</h2>
                <p className="text-lg md:text-2xl text-slate-900 font-normal mt-2">{formatRupiah(selectedDrone.price)}</p>
              </div>
              
              <div className="mb-8 md:mb-10">
                <p className="text-slate-600 leading-relaxed text-sm md:text-base font-light">
                  {selectedDrone.description}
                </p>
              </div>

              {/* Specs List */}
              <div className="space-y-6 mb-12">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-gray-100 pb-2">Spesifikasi Teknis</h3>
                 
                 <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                       <div className="flex items-center text-slate-500 mb-1 text-xs md:text-sm"><Wifi size={14} className="mr-2"/> Jarak</div>
                       <div className="text-slate-900 font-medium text-sm md:text-base">{selectedDrone.specs.range}</div>
                    </div>
                    <div>
                       <div className="flex items-center text-slate-500 mb-1 text-xs md:text-sm"><Battery size={14} className="mr-2"/> Baterai</div>
                       <div className="text-slate-900 font-medium text-sm md:text-base">{selectedDrone.specs.battery}</div>
                    </div>
                    <div>
                       <div className="flex items-center text-slate-500 mb-1 text-xs md:text-sm"><CameraIcon size={14} className="mr-2"/> Kamera</div>
                       <div className="text-slate-900 font-medium text-sm md:text-base">{selectedDrone.specs.camera}</div>
                    </div>
                    <div>
                       <div className="flex items-center text-slate-500 mb-1 text-xs md:text-sm"><Scale size={14} className="mr-2"/> Berat</div>
                       <div className="text-slate-900 font-medium text-sm md:text-base">{selectedDrone.specs.weight || '-'}</div>
                    </div>
                    <div className="col-span-2">
                       <div className="flex items-center text-slate-500 mb-1 text-xs md:text-sm"><Cpu size={14} className="mr-2"/> Flight Controller</div>
                       <div className="text-slate-900 font-medium text-sm md:text-base">{selectedDrone.specs.flightController || '-'}</div>
                    </div>
                 </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                 <button 
                    onClick={() => {
                      handleOrder(selectedDrone);
                      setSelectedDrone(null);
                    }}
                    className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-[4px] font-bold uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center"
                 >
                   Konfigurasi & Pesan
                 </button>
                 <p className="text-[10px] text-center text-slate-400 mt-4">
                   Estimasi pengiriman 3-5 hari kerja. Garansi resmi 1 tahun.
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;