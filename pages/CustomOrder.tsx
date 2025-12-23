import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Box, Settings, Fan, Layers, Zap, ChevronRight, Check, Plus, AlertCircle } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import * as THREE from 'three';

// --- Types & Constants ---
type DroneType = 'STANDARD' | 'RACING' | 'CINEWHOOP' | 'AGRICULTURE' | 'HEAVY_LIFT';

const PRICING = {
  STANDARD: 15000000,
  RACING: 5000000,
  CINEWHOOP: 8000000,
  AGRICULTURE: 150000000,
  HEAVY_LIFT: 250000000
};

const COMPONENTS = [
  { id: 'gps', label: 'Modul GPS RTK', price: 2500000, desc: 'Akurasi pemetaan sentimeter.' },
  { id: 'battery', label: 'Extra Battery (High Cap)', price: 1500000, desc: '+15 menit waktu terbang.' },
  { id: 'goggles', label: 'FPV Goggles V2', price: 5000000, desc: 'Tampilan HD latensi rendah.' },
  { id: 'thermal', label: 'Kamera Thermal', price: 12000000, desc: 'Untuk inspeksi malam/panas.' },
  { id: 'case', label: 'Hard Case Waterproof', price: 1000000, desc: 'Perlindungan maksimal.' },
  { id: 'controller', label: 'Smart Controller', price: 3500000, desc: 'Layar built-in 5.5 inci.' },
];

interface DroneModelProps {
  colors: { body: string; arm: string; prop: string };
  type: DroneType;
}

// --- 3D Components ---

const DroneModel: React.FC<DroneModelProps> = ({ colors, type }) => {
  const propRefs = useRef<THREE.Group[]>([]);
  
  useEffect(() => {
    propRefs.current = [];
  }, [type]);

  useFrame((state, delta) => {
    propRefs.current.forEach((prop) => {
      if (prop) prop.rotation.y += delta * 20; 
    });
  });

  const getConfig = () => {
    switch (type) {
      case 'HEAVY_LIFT':
        return { armCount: 8, armLength: 1.8, bodyScale: [1.0, 0.8, 1.0], lift: 0.6, hasTank: false, isDucted: false };
      case 'AGRICULTURE':
        return { armCount: 6, armLength: 1.6, bodyScale: [1.2, 0.6, 1.2], lift: 0.5, hasTank: true, isDucted: false };
      case 'CINEWHOOP':
        return { armCount: 4, armLength: 0.7, bodyScale: [0.6, 0.25, 0.6], lift: 0.1, hasTank: false, isDucted: true };
      case 'RACING':
        return { armCount: 4, armLength: 0.9, bodyScale: [0.5, 0.2, 1.0], lift: 0, hasTank: false, isDucted: false };
      case 'STANDARD':
      default:
        return { armCount: 4, armLength: 1.2, bodyScale: [0.8, 0.3, 0.8], lift: 0.2, hasTank: false, isDucted: false };
    }
  };

  const config = getConfig();

  const getArmData = () => {
    const arms = [];
    const angleStep = (Math.PI * 2) / config.armCount;
    const startAngle = (type === 'AGRICULTURE' || type === 'HEAVY_LIFT') ? 0 : Math.PI / 4; 

    for (let i = 0; i < config.armCount; i++) {
      const angle = startAngle + (i * angleStep);
      const x = Math.sin(angle);
      const z = Math.cos(angle);
      arms.push({ x, z, angle });
    }
    return arms;
  };

  return (
    <group>
      {/* Body Chassis */}
      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          {type === 'AGRICULTURE' ? (
             <cylinderGeometry args={[0.5, 0.6, 0.6, 6]} />
          ) : type === 'HEAVY_LIFT' ? (
             <cylinderGeometry args={[0.6, 0.6, 0.5, 8]} />
          ) : (
             <boxGeometry args={[config.bodyScale[0], config.bodyScale[1], config.bodyScale[2]] as [number, number, number]} />
          )}
          <meshStandardMaterial color={colors.body} roughness={0.3} metalness={0.7} envMapIntensity={1.2} />
        </mesh>

        {/* Top Feature */}
        {type === 'RACING' ? (
          <mesh position={[0, 0.15, -0.2]}>
             <boxGeometry args={[0.2, 0.2, 0.4]} />
             <meshStandardMaterial color="#111" />
          </mesh>
        ) : (
          <mesh position={[0, config.bodyScale[1]/2 + 0.05, 0]}>
             <cylinderGeometry args={[0.2, 0.25, 0.1, 16]} />
             <meshStandardMaterial color="#111" roughness={0.1} metalness={0.9} />
          </mesh>
        )}

        {/* Agriculture Tank */}
        {config.hasTank && (
          <mesh position={[0, -0.6, 0]} castShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#fff" transparent opacity={0.6} roughness={0.1} />
          </mesh>
        )}
      </group>

      {/* Camera Module */}
      <group position={[0, type === 'AGRICULTURE' ? -0.4 : -0.1, type === 'AGRICULTURE' ? 0.6 : (config.bodyScale[2]/2 + 0.1)]}>
         <mesh castShadow>
            <boxGeometry args={[0.25, 0.2, 0.15]} />
            <meshStandardMaterial color="#000" />
         </mesh>
         <mesh position={[0, 0, 0.08]}>
            <circleGeometry args={[0.08]} />
            <meshStandardMaterial color="#111" />
         </mesh>
      </group>

      {/* Arms & Propulsion */}
      {getArmData().map((pos, i) => (
        <group key={i}>
          <mesh 
            castShadow 
            position={[pos.x * (config.armLength/2), 0, pos.z * (config.armLength/2)]} 
            rotation={[0, pos.angle + Math.PI/2, 0]}
          >
            <boxGeometry args={[config.armLength, 0.08, 0.08]} />
            <meshStandardMaterial color={colors.arm} roughness={0.5} metalness={0.5} />
          </mesh>

          <group position={[pos.x * config.armLength, 0.05, pos.z * config.armLength]}>
            <mesh castShadow position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
              <meshStandardMaterial color="#222" />
            </mesh>

            {config.isDucted && (
               <mesh position={[0, 0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
                 <torusGeometry args={[0.95, 0.05, 16, 32]} />
                 <meshStandardMaterial color="#333" />
               </mesh>
            )}

            <group ref={el => propRefs.current[i] = el!} position={[0, 0.16, 0]}>
              <mesh castShadow>
                 <boxGeometry args={[1.8, 0.015, 0.12]} />
                 <meshStandardMaterial color={colors.prop} transparent opacity={0.9} />
              </mesh>
               <mesh castShadow rotation={[0, Math.PI/2, 0]}>
                 <boxGeometry args={[1.8, 0.015, 0.12]} />
                 <meshStandardMaterial color={colors.prop} transparent opacity={0.9} />
              </mesh>
            </group>
          </group>
          
          {(type === 'STANDARD' || type === 'AGRICULTURE' || type === 'HEAVY_LIFT') && (
             <mesh position={[pos.x * (config.armLength - 0.4), -0.4, pos.z * (config.armLength - 0.4)]}>
                <cylinderGeometry args={[0.02, 0.02, 0.8]} />
                <meshStandardMaterial color={colors.arm} />
             </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

const CustomOrder: React.FC = () => {
  const [droneType, setDroneType] = useState<DroneType>('STANDARD');
  const [droneColors, setDroneColors] = useState({
    body: '#0ea5e9',
    arm: '#334155',
    prop: '#cbd5e1'
  });
  
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    details: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Calculate Total Price
  const basePrice = PRICING[droneType];
  const componentsPrice = selectedComponents.reduce((acc, id) => {
    const comp = COMPONENTS.find(c => c.id === id);
    return acc + (comp ? comp.price : 0);
  }, 0);
  const totalPrice = basePrice + componentsPrice;

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const toggleComponent = (id: string) => {
    setSelectedComponents(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const componentNames = selectedComponents.map(id => COMPONENTS.find(c => c.id === id)?.label).join(', ');
    const configSummary = `Tipe: ${droneType}\nKomponen: ${componentNames || 'Standar'}\nWarna: ${droneColors.body}\nCatatan: ${formData.details}`;
    
    alert(`Permintaan Penawaran Terkirim!\n\n${configSummary}\n\nEstimasi Total: ${formatRupiah(totalPrice)}\n\nKami akan menghubungi WhatsApp Anda.`);
    setFormData({ name: '', email: '', phone: '', details: '' });
    setSelectedComponents([]);
    setCurrentStep(1);
  };

  const colors = [
    { name: 'Aero Blue', hex: '#0ea5e9' },
    { name: 'Midnight', hex: '#1e293b' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Forest', hex: '#166534' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Pearl', hex: '#ffffff' },
    { name: 'Carbon', hex: '#334155' },
    { name: 'Royal', hex: '#4338ca' },
  ];

  const droneTypes = [
    { id: 'STANDARD', label: 'Standard', desc: 'Aerial Photography', icon: <Box size={24} /> },
    { id: 'RACING', label: 'FPV Sport', desc: 'High Speed', icon: <Zap size={24}/> },
    { id: 'CINEWHOOP', label: 'Cinewhoop', desc: 'Indoor Safety', icon: <Fan size={24}/> },
    { id: 'AGRICULTURE', label: 'Agritech', desc: 'Crop Spraying', icon: <Settings size={24}/> },
    { id: 'HEAVY_LIFT', label: 'Heavy Lift', desc: 'Logistics', icon: <Layers size={24}/> },
  ];

  return (
    // Use 100dvh for better mobile browser support
    <div className="flex flex-col lg:flex-row h-[100dvh] pt-0 bg-white overflow-hidden relative">
      
      {/* 1. TOP/LEFT SIDE: 3D Visualization */}
      <div className="w-full h-[40%] lg:h-full lg:flex-1 relative bg-[#F5F5F5]">
        
        {/* Header Overlay */}
        <div className="absolute top-24 left-6 z-10 pointer-events-none">
          <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">Design Studio</h1>
          <p className="text-slate-500 mt-2 font-light text-sm lg:text-base">Konfigurasi {droneType.toLowerCase().replace('_', ' ')} drone anda.</p>
        </div>

        <Canvas shadows camera={{ position: [4, 3, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              <DroneModel colors={droneColors} type={droneType} />
            </Stage>
            <OrbitControls 
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 1.9} 
              enableZoom={false} 
              autoRotate 
              autoRotateSpeed={0.5} 
            />
          </Suspense>
        </Canvas>

        {/* Dynamic Price Estimate (Floating) */}
        <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 bg-white/90 backdrop-blur px-4 py-2 lg:px-6 lg:py-4 rounded-lg shadow-soft text-right z-10 border border-white/50">
            <div className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Estimasi Harga</div>
            <div className="text-xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                {formatRupiah(totalPrice)}
            </div>
            {selectedComponents.length > 0 && (
              <div className="text-[10px] text-slate-500 mt-1">+ {selectedComponents.length} tambahan</div>
            )}
        </div>
      </div>

      {/* 2. BOTTOM/RIGHT SIDE: Configurator Panel */}
      <div className="w-full h-[60%] lg:h-full lg:w-[480px] bg-white flex flex-col z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-2xl border-l border-gray-100">
        
        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto pt-6 px-6 lg:px-8 pb-8 lg:pt-28">
          
          {currentStep === 1 && (
            <div className="space-y-8 lg:space-y-10 animate-in fade-in duration-500">
                {/* Type Selection */}
                <div>
                    <h3 className="text-xs lg:text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 lg:mb-6 border-b border-gray-100 pb-2">1. Pilih Chassis</h3>
                    <div className="grid grid-cols-1 gap-3">
                    {droneTypes.map((t) => (
                        <button 
                        key={t.id}
                        onClick={() => setDroneType(t.id as DroneType)}
                        className={`group flex items-center p-3 rounded border transition-all duration-200 text-left ${
                            droneType === t.id 
                            ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50' 
                            : 'border-gray-200 hover:border-slate-400'
                        }`}
                        >
                        <div className={`p-2 rounded mr-4 transition-colors ${droneType === t.id ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-500 group-hover:bg-slate-200'}`}>
                            {t.icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-900">{t.label}</span>
                              <span className="text-xs font-medium text-slate-500">{formatRupiah(PRICING[t.id as DroneType])}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                        </div>
                        </button>
                    ))}
                    </div>
                </div>

                {/* Color Selection */}
                <div>
                    <h3 className="text-xs lg:text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 lg:mb-6 border-b border-gray-100 pb-2">2. Visual</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-medium text-slate-500 mb-3 block">Warna Body Utama</span>
                            <div className="flex flex-wrap gap-2">
                                {colors.map(c => (
                                    <button
                                    key={`body-${c.hex}`}
                                    onClick={() => setDroneColors(prev => ({ ...prev, body: c.hex }))}
                                    className={`w-8 h-8 rounded-full shadow-sm transition-all relative ${droneColors.body === c.hex ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : 'hover:scale-105 border border-gray-100'}`}
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex gap-8">
                           <div>
                              <span className="text-xs font-medium text-slate-500 mb-2 block">Lengan</span>
                              <div className="flex gap-2">
                                {colors.slice(0, 4).map(c => (
                                    <button key={`arm-${c.hex}`} onClick={() => setDroneColors(p => ({...p, arm: c.hex}))} className={`w-6 h-6 rounded-full border ${droneColors.arm === c.hex ? 'ring-1 ring-slate-900 scale-110' : ''}`} style={{backgroundColor: c.hex}} />
                                ))}
                              </div>
                           </div>
                           <div>
                              <span className="text-xs font-medium text-slate-500 mb-2 block">Propeller</span>
                              <div className="flex gap-2">
                                {[{hex: '#cbd5e1'}, {hex: '#1e293b'}, {hex: '#f97316'}].map(c => (
                                    <button key={`prop-${c.hex}`} onClick={() => setDroneColors(p => ({...p, prop: c.hex}))} className={`w-6 h-6 rounded-full border ${droneColors.prop === c.hex ? 'ring-1 ring-slate-900 scale-110' : ''}`} style={{backgroundColor: c.hex}} />
                                ))}
                              </div>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Add-ons Selection */}
                <div>
                  <h3 className="text-xs lg:text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">3. Komponen Tambahan</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {COMPONENTS.map((comp) => (
                      <div 
                        key={comp.id}
                        onClick={() => toggleComponent(comp.id)}
                        className={`cursor-pointer border rounded p-3 flex items-start space-x-3 transition-all ${
                          selectedComponents.includes(comp.id) ? 'border-slate-900 bg-slate-50' : 'border-gray-200 hover:border-slate-300'
                        }`}
                      >
                         <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 ${
                           selectedComponents.includes(comp.id) ? 'bg-slate-900 border-slate-900' : 'border-gray-300 bg-white'
                         }`}>
                           {selectedComponents.includes(comp.id) && <Check size={14} className="text-white" />}
                         </div>
                         <div className="flex-1">
                           <div className="flex justify-between">
                              <span className="text-sm font-medium text-slate-900">{comp.label}</span>
                              <span className="text-xs font-bold text-slate-600">{formatRupiah(comp.price)}</span>
                           </div>
                           <p className="text-xs text-slate-500 mt-0.5">{comp.desc}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Note */}
                <div className="bg-blue-50 p-4 rounded border border-blue-100">
                    <div className="flex items-start gap-2 mb-2">
                        <AlertCircle size={16} className="text-blue-600 mt-0.5" />
                        <label className="text-xs font-bold text-blue-800 uppercase tracking-wide">Permintaan Khusus</label>
                    </div>
                    <p className="text-[10px] text-blue-600 mb-2">
                        Ada komponen yang tidak tersedia di daftar atas? Tuliskan di sini. Tim engineering kami akan mengecek ketersediaannya.
                    </p>
                    <textarea 
                        rows={2}
                        className="w-full border border-blue-200 rounded p-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                        placeholder="Contoh: Saya butuh mounting kamera DSLR khusus..."
                        value={formData.details}
                        onChange={e => setFormData({...formData, details: e.target.value})}
                    ></textarea>
                </div>
            </div>
          )}

          {currentStep === 2 && (
             <div className="animate-in slide-in-from-right duration-500">
                <h3 className="text-xs lg:text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">4. Konfirmasi & Kirim</h3>
                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
                    <div className="bg-gray-50 p-4 rounded mb-6 border border-gray-100">
                        <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Ringkasan Konfigurasi</div>
                        <div className="text-sm font-bold text-slate-900">{droneType} Chassis</div>
                        <div className="text-xs text-slate-500 mb-2">Warna: {colors.find(c => c.hex === droneColors.body)?.name || 'Custom'}</div>
                        
                        {selectedComponents.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Ekstra</div>
                            <ul className="text-xs text-slate-700 list-disc list-inside">
                              {selectedComponents.map(id => (
                                <li key={id}>{COMPONENTS.find(c => c.id === id)?.label}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                           <span className="font-bold text-slate-900">Total Estimasi</span>
                           <span className="font-bold text-slate-900 text-lg">{formatRupiah(totalPrice)}</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nama Lengkap</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border-b border-gray-300 py-2 focus:border-slate-900 outline-none transition-colors bg-transparent font-medium text-sm lg:text-base"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
                        <input 
                            required
                            type="email" 
                            className="w-full border-b border-gray-300 py-2 focus:border-slate-900 outline-none transition-colors bg-transparent font-medium text-sm lg:text-base"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nomor WhatsApp</label>
                        <input 
                            required
                            type="tel" 
                            className="w-full border-b border-gray-300 py-2 focus:border-slate-900 outline-none transition-colors bg-transparent font-medium text-sm lg:text-base"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-black text-white py-4 mt-4 font-bold uppercase tracking-widest text-xs transition-all"
                    >
                        Kirim Penawaran
                    </button>
                    <button 
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full text-slate-500 hover:text-slate-900 py-2 text-xs font-bold uppercase tracking-widest"
                    >
                        Ubah Konfigurasi
                    </button>
                </form>
             </div>
          )}

        </div>

        {/* Footer Actions */}
        {currentStep === 1 && (
            <div className="bg-white border-t border-gray-100 p-4 lg:p-6 pb-6 lg:pb-6 safe-area-bottom flex-none z-30">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs lg:text-sm font-medium text-slate-500">Estimasi Total</span>
                    <span className="text-sm lg:text-lg font-bold text-slate-900">{formatRupiah(totalPrice)}</span>
                </div>
                <button 
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-slate-900 hover:bg-black text-white py-3 lg:py-4 font-bold uppercase tracking-widest text-xs transition-all flex justify-between px-6 items-center group"
                >
                    <span>Lanjutkan</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CustomOrder;