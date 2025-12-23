import React, { useState } from 'react';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, Send, MessageCircle } from 'lucide-react';

const Support: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const faqs = [
    {
      q: "Berapa lama estimasi pengiriman?",
      a: "Untuk wilayah Jabodetabek, pengiriman memakan waktu 1-2 hari kerja. Untuk luar Jabodetabek, estimasi 3-5 hari kerja tergantung lokasi."
    },
    {
      q: "Apakah ada garansi produk?",
      a: "Ya, semua unit drone AeroTech memiliki garansi resmi 1 tahun yang mencakup cacat pabrik dan kerusakan sistem (bukan akibat kesalahan pilot)."
    },
    {
      q: "Bagaimana cara melakukan pesanan custom?",
      a: "Silakan kunjungi halaman 'Custom', pilih spesifikasi dasar yang Anda inginkan, dan kirimkan permintaan penawaran. Tim teknis kami akan menghubungi Anda dalam 24 jam."
    },
    {
      q: "Apakah tersedia pelatihan penerbangan?",
      a: "Kami menyediakan sesi pelatihan dasar gratis secara online untuk setiap pembelian unit Enterprise, dan pelatihan tatap muka berbayar."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Terima kasih, ${formData.name}. Pesan Anda telah kami terima. Tiket dukungan #SUPPORT-${Math.floor(Math.random() * 10000)} telah dibuat.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">Pusat Bantuan</h1>
          <p className="text-slate-500 text-lg font-light">
            Temukan jawaban atas pertanyaan Anda atau hubungi tim ahli kami secara langsung.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* FAQ Section */}
          <div>
            <div className="flex items-center mb-8">
              <MessageCircle className="w-6 h-6 text-slate-900 mr-3" />
              <h2 className="text-2xl font-semibold text-slate-900">Pertanyaan Umum</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-300">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-slate-900 text-sm md:text-base pr-4">{faq.q}</span>
                    {openFaq === idx ? 
                      <ChevronUp size={20} className="text-slate-400 flex-shrink-0"/> : 
                      <ChevronDown size={20} className="text-slate-400 flex-shrink-0"/>
                    }
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed bg-white">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Contact Info */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                  <Mail className="w-5 h-5 text-slate-900 mb-3"/>
                  <div className="text-sm font-bold text-slate-900 mb-1">Email Support</div>
                  <a href="mailto:support@aerotech.id" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">support@aerotech.id</a>
               </div>
               <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
                  <Phone className="w-5 h-5 text-slate-900 mb-3"/>
                  <div className="text-sm font-bold text-slate-900 mb-1">Telepon</div>
                  <a href="tel:+622155558888" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">+62 21 5555 8888</a>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-8 h-full">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Kirim Pesan</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
                    placeholder="Masukkan nama anda"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all text-sm"
                    placeholder="nama@perusahaan.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Pesan / Keluhan</label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none resize-none transition-all text-sm"
                    placeholder="Jelaskan kendala atau pertanyaan Anda..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-md font-medium transition-all shadow-md active:scale-95 flex items-center justify-center"
                >
                  <Send className="w-4 h-4 mr-2" /> Kirim Pesan
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Support;