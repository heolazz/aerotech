import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Box, Settings, Fan, Layers, Zap, ChevronRight, Check, AlertCircle, Power } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
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
  selectedComponents: string[];
  engineOn: boolean;
}

// --- 3D Components ---

const DroneModel: React.FC<DroneModelProps> = ({ colors, type, selectedComponents, engineOn }) => {
  const propRefs = useRef<THREE.Group[]>([]);
  
  useEffect(() => {
    propRefs.current = [];
  }, [type]);

  useFrame((state, delta) => {
    if (engineOn) {
      propRefs.current.forEach((prop) => {
        if (prop) prop.rotation.y += delta * 40; 
      });
    }
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
      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          {type === 'AGRICULTURE' ? (
             <cylinderGeometry args={[0.5, 0.6, 0.6, 6]} />
          ) : type === 'HEAVY_LIFT' ? (
             <cylinderGeometry args={[0.6, 0.6, 0.5, 8]} />
          ) : (
             <boxGeometry args={[config.bodyScale[0], config.bodyScale[1], config.bodyScale[2]] as [number, number, number]} />
          )}
          <meshStandardMaterial color={colors.body} roughness={0.1} metalness={0.8} envMapIntensity={1.5} />
        </mesh>
        
        <mesh position={[0, 0, 0]}>
           <boxGeometry args={[config.bodyScale[0] + 0.02, 0.05, config.bodyScale[2] + 0.02]} />
           <meshStandardMaterial color="#111" />
        </mesh>

        <mesh position={[0, config.bodyScale[1]/2 + 0.05, 0]}>
           <cylinderGeometry args={[0.2, 0.25, 0.1, 16]} />
           <meshStandardMaterial color="#111" roughness={0} metalness={1} />
        </mesh>

        {config.hasTank && (
          <mesh position={[0, -0.6, 0]} castShadow>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.7} roughness={0} metalness={0.2} />
          </mesh>
        )}
      </group>

      {/* --- ADD-ONS VISUALIZATION --- */}
      {selectedComponents.includes('gps') && (
        <group position={[0, config.bodyScale[1]/2 + 0.1, -0.25]}>
          <mesh castShadow><cylinderGeometry args={[0.02, 0.02, 0.4, 8]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0, 0.2, 0]} castShadow><cylinderGeometry args={[0.12, 0.12, 0.05, 16]} /><meshStandardMaterial color="#fff" /></mesh>
        </group>
      )}

      {selectedComponents.includes('thermal') && (
        <group position={[0, -0.35, config.bodyScale[2]/2 + 0.15]}>
          <mesh castShadow><boxGeometry args={[0.18, 0.18, 0.2]} /><meshStandardMaterial color="#222" metalness={0.9} /></mesh>
          <mesh position={[0, 0, 0.1]} rotation={[Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff4400" emissiveIntensity={5} />
          </mesh>
        </group>
      )}

      {selectedComponents.includes('battery') && (
        <mesh position={[0, -config.bodyScale[1]/2 - 0.12, 0]} castShadow>
          <boxGeometry args={[config.bodyScale[0] * 0.75, 0.22, config.bodyScale[2] * 0.65]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      )}

      {selectedComponents.includes('controller') && (
        <group position={[2.5, 0.5, 1]} rotation={[-Math.PI/8, -Math.PI/4, 0]}>
          <mesh castShadow><boxGeometry args={[0.7, 0.45, 0.08]} /><meshStandardMaterial color="#111" metalness={0.5} /></mesh>
          <mesh position={[0, 0, 0.045]}><planeGeometry args={[0.6, 0.38]} /><meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.8} /></mesh>
        </group>
      )}

      {/* Main Camera */}
      <group position={[0, type === 'AGRICULTURE' ? -0.4 : -0.1, type === 'AGRICULTURE' ? 0.6 : (config.bodyScale[2]/2 + 0.1)]}>
         <mesh castShadow><boxGeometry args={[0.25, 0.22, 0.18]} /><meshStandardMaterial color="#000" metalness={0.9} /></mesh>
         <mesh position={[0, 0, 0.095]}><circleGeometry args={[0.07, 20]} /><meshStandardMaterial color="#111" emissive="#0ea5e9" emissiveIntensity={0.2} /></mesh>
      </group>

      {/* Arms & Propulsion */}
      {getArmData().map((pos, i) => (
        <group key={i}>
          <mesh castShadow position={[pos.x * (config.armLength/2), 0, pos.z * (config.armLength/2)]} rotation={[0, pos.angle + Math.PI/2, 0]}>
            <boxGeometry args={[config.armLength, 0.06, 0.06]} />
            <meshStandardMaterial color={colors.arm} roughness={0.2} metalness={0.9} />
          </mesh>

          <group position={[pos.x * config.armLength, 0.05, pos.z * config.armLength]}>
            <mesh castShadow position={[0, 0.05, 0]}><cylinderGeometry args={[0.14, 0.14, 0.18, 16]} /><meshStandardMaterial color="#111" metalness={1} /></mesh>
            {config.isDucted && (
               <mesh position={[0, 0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
                 <torusGeometry args={[0.95, 0.06, 16, 32]} />
                 <meshStandardMaterial color="#222" />
               </mesh>
            )}
            <group ref={el => propRefs.current[i] = el!} position={[0, 0.18, 0]}>
              <mesh castShadow><boxGeometry args={[1.9, 0.01, 0.15]} /><meshStandardMaterial color={colors.prop} transparent opacity={0.8} /></mesh>
              <mesh castShadow rotation={[0, Math.PI/2, 0]}><boxGeometry args={[1.9, 0.01, 0.15]} /><meshStandardMaterial color={colors.prop} transparent opacity={0.8} /></mesh>
            </group>
          </group>
          
          {(type === 'STANDARD' || type === 'AGRICULTURE' || type === 'HEAVY_LIFT') && (
             <group position={[pos.x * (config.armLength - 0.3), -0.4, pos.z * (config.armLength - 0.3)]}>
                <mesh castShadow><cylinderGeometry args={[0.02, 0.02, 0.8]} /><meshStandardMaterial color={colors.arm} /></mesh>
                <mesh position={[0, -0.4, 0]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.1]} /><meshStandardMaterial color="#111" /></mesh>
             </group>
          )}
        </group>
      ))}
    </group>
  );
};

const CustomOrder: React.FC = () => {
  const [droneType, setDroneType] = useState<DroneType>('STANDARD');
  const [droneColors, setDroneColors] = useState({ body: '#0ea5e9', arm: '#334155', prop: '#cbd5e1' });
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', details: '' });
  const [currentStep, setCurrentStep] = useState(1);
  const [engineOn, setEngineOn] = useState(false);

  const basePrice = PRICING[droneType];
  const componentsPrice = selectedComponents.reduce((acc, id) => {
    const comp = COMPONENTS.find(c => c.id === id);
    return acc + (comp ? comp.price : 0);
  }, 0);
  const totalPrice = basePrice + componentsPrice;

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const toggleComponent = (id: string) => {
    setSelectedComponents(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Konfigurasi Terkirim!\nTotal: ${formatRupiah(totalPrice)}`);
    setCurrentStep(1);
    setSelectedComponents([]);
  };

  const colors = [
    { name: 'Aero Blue', hex: '#0ea5e9' }, { name: 'Midnight', hex: '#1e293b' },
    { name: 'Red', hex: '#ef4444' }, { name: 'Forest', hex: '#166534' },
    { name: 'Amber', hex: '#d97706' }, { name: 'Pearl', hex: '#ffffff' },
    { name: 'Carbon', hex: '#334155' }, { name: 'Royal', hex: '#4338ca' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] bg-white overflow-hidden relative">
      
      {/* 1. Visual Studio */}
      <div className="w-full h-[40%] lg:h-full lg:flex-1 relative bg-slate-50">
        <div className="absolute top-20 lg:top-24 left-6 lg:left-8 z-10 pointer-events-none pr-6">
          <h1 className="text-xl lg:text-5xl font-bold text-slate-900 tracking-tighter leading-none">Design Studio</h1>
          <p className="text-slate-500 text-[8px] lg:text-sm mt-1 uppercase tracking-widest font-semibold">Configurator v2.1</p>
        </div>

        {/* Engine Toggle Button */}
        <button 
          onClick={() => setEngineOn(!engineOn)}
          className={`absolute top-20 lg:top-24 right-6 lg:right-8 z-20 p-3 lg:p-4 rounded-full shadow-xl transition-all flex items-center gap-2 font-bold text-[10px] lg:text-xs uppercase tracking-widest ${engineOn ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-900'}`}
        >
          <Power size={16} />
          <span className="hidden sm:inline">{engineOn ? 'Engine On' : 'Start Engine'}</span>
        </button>

        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[5, 4, 5]} fov={40} />
            <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.4, blur: 2 }}>
              <DroneModel colors={droneColors} type={droneType} selectedComponents={selectedComponents} engineOn={engineOn} />
            </Stage>
            <OrbitControls minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} enableZoom={true} autoRotate={!engineOn} autoRotateSpeed={0.4} />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-4 lg:bottom-6 right-6 lg:right-8 bg-white p-3 lg:p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-[8px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Price Estimate</div>
          <div className="text-base lg:text-4xl font-bold text-slate-900 tracking-tight">{formatRupiah(totalPrice)}</div>
        </div>
      </div>

      {/* 2. Control Panel */}
      <div className="w-full h-[60%] lg:h-full lg:w-[500px] bg-white flex flex-col z-20 border-t lg:border-t-0 lg:border-l border-slate-100 shadow-[-20px_0_50px_rgba(0,0,0,0.05)]">
        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-8 lg:py-12 lg:pt-32">
          
          {currentStep === 1 ? (
            <div className="space-y-8 lg:space-y-10 animate-in fade-in duration-500">
              <section>
                <div className="flex justify-between items-end mb-4 lg:mb-6">
                  <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-[0.2em]">01. Pilih Chassis</h3>
                </div>
                <div className="grid grid-cols-1 gap-2 lg:gap-3">
                  {(['STANDARD', 'RACING', 'CINEWHOOP', 'AGRICULTURE', 'HEAVY_LIFT'] as DroneType[]).map((id) => (
                    <button key={id} onClick={() => setDroneType(id)} className={`flex items-center p-3 lg:p-4 rounded-xl border-2 transition-all ${droneType === id ? 'border-slate-900 bg-slate-50' : 'border-slate-50 hover:border-slate-200'}`}>
                      <div className={`p-2 lg:p-3 rounded-lg mr-3 lg:mr-4 ${droneType === id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Box size={18}/>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center"><span className="text-xs lg:text-sm font-bold text-slate-900">{id}</span><span className="text-[10px] lg:text-xs font-bold text-slate-500">{formatRupiah(PRICING[id])}</span></div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-4 lg:mb-6">02. Visual Custom</h3>
                <div className="bg-slate-50 p-4 lg:p-6 rounded-2xl flex flex-wrap gap-2 lg:gap-3">
                  {colors.map(c => (
                    <button key={c.hex} onClick={() => setDroneColors(p => ({...p, body: c.hex}))} className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full transition-transform ${droneColors.body === c.hex ? 'scale-110 ring-2 lg:ring-4 ring-slate-900 ring-offset-2' : 'hover:scale-105'}`} style={{backgroundColor: c.hex}} />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-4 lg:mb-6">03. Performance Add-ons</h3>
                <div className="space-y-2 lg:space-y-3">
                  {COMPONENTS.map((comp) => (
                    <div key={comp.id} onClick={() => toggleComponent(comp.id)} className={`cursor-pointer border-2 rounded-xl p-3 lg:p-4 flex items-start space-x-3 lg:space-x-4 transition-all ${selectedComponents.includes(comp.id) ? 'border-slate-900 bg-slate-50 shadow-sm' : 'border-slate-50 hover:border-slate-100'}`}>
                      <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-md border-2 flex items-center justify-center mt-0.5 ${selectedComponents.includes(comp.id) ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200'}`}>
                        {selectedComponents.includes(comp.id) && <Check size={14} strokeWidth={3} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1"><span className="text-xs lg:text-sm font-bold text-slate-900">{comp.label}</span><span className="text-[10px] lg:text-xs font-black text-slate-600">{formatRupiah(comp.price)}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="pb-24 lg:pb-0">
                <div className="bg-gray-50 p-4 lg:p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={16} className="text-blue-600" />
                    <h3 className="text-[10px] lg:text-xs font-black text-slate-900 uppercase tracking-widest">Permintaan Khusus</h3>
                  </div>
                  <textarea 
                    rows={3} 
                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs outline-none transition-all placeholder:text-slate-300"
                    placeholder="Contoh: Butuh mounting kamera khusus..."
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                  />
                </div>
              </section>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right duration-500">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 border-b pb-4">04. Final Confirmation</h3>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <input required placeholder="Nama Lengkap" className="w-full border-b py-3 outline-none text-xs font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required type="email" placeholder="Email" className="w-full border-b py-3 outline-none text-xs font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input required type="tel" placeholder="Nomor WA" className="w-full border-b py-3 outline-none text-xs font-bold" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em]">Kirim Penawaran</button>
                  <button type="button" onClick={() => setCurrentStep(1)} className="w-full text-slate-400 text-[10px] uppercase font-bold tracking-widest py-2">Edit</button>
               </form>
            </div>
          )}
        </div>

        {currentStep === 1 && (
          <div className="p-4 lg:p-8 border-t border-slate-50 bg-white fixed lg:relative bottom-0 left-0 w-full z-30">
            <button onClick={() => setCurrentStep(2)} className="w-full bg-slate-900 text-white py-4 lg:py-5  font-black uppercase text-[10px] lg:text-xs tracking-[0.3em] flex justify-between px-6 lg:px-10 items-center group transition-all active:scale-95 shadow-2xl">
              <span>Checkout</span>
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomOrder;