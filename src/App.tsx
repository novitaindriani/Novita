/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PHARMACISTS } from './constants';
import { Pharmacist } from './types';
import PharmacistCard from './components/PharmacistCard';
import ChatWindow from './components/ChatWindow';
import RoleSelector from './components/RoleSelector';
import { Pill, Search, History, Heart, ShieldCheck, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null);
  const [userRole, setUserRole] = useState<'patient' | 'pharmacist'>('patient');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]); // List of pharmacist IDs

  // Mock user for demo
  const user = {
    id: userRole === 'patient' ? 'user-123' : 'ph-4', // If pharmacist, use Novita's ID
    name: userRole === 'patient' ? 'Pasien Umum' : 'Apt. Novita Indriani',
    role: userRole
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem('potline_history');
    if (savedHistory) setChatHistory(JSON.parse(savedHistory));
  }, []);

  const handleSelectPharmacist = (p: Pharmacist) => {
    setSelectedPharmacist(p);
    if (!chatHistory.includes(p.id)) {
      const newHistory = [p.id, ...chatHistory];
      setChatHistory(newHistory);
      localStorage.setItem('potline_history', JSON.stringify(newHistory));
    }
  };

  const filteredPharmacists = PHARMACISTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl medical-gradient flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Pill className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent medical-gradient">
              POTline
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <RoleSelector role={userRole} onRoleChange={setUserRole} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: List & History */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Cari Apoteker
                </h2>
                <div className="relative group">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Nama atau spesialisasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                {filteredPharmacists.map(p => (
                  <PharmacistCard 
                    key={p.id} 
                    pharmacist={p} 
                    onSelect={handleSelectPharmacist}
                    isSelected={selectedPharmacist?.id === p.id}
                  />
                ))}
              </div>
            </section>

            {chatHistory.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <History className="w-4 h-4" />
                  <h2 className="text-sm font-bold uppercase tracking-widest">Riwayat Konsultasi</h2>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-2 space-y-1 shadow-sm">
                  {chatHistory.map(id => {
                    const p = PHARMACISTS.find(p => p.id === id);
                    if (!p) return null;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPharmacist(p)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                          selectedPharmacist?.id === p.id 
                            ? "bg-slate-50" 
                            : "hover:bg-slate-50/50"
                        )}
                      >
                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{p.specialization}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Welcome Stats */}
            <div className="p-6 rounded-3xl medical-gradient text-white shadow-2xl shadow-teal-500/20 relative overflow-hidden group">
               <div className="relative z-10 space-y-4">
                  <div className="p-2 bg-white/20 rounded-lg w-fit">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold leading-tight">Konsultasi Gratis & Terpercaya</h3>
                  <p className="text-sm text-teal-50">Layanan konsultasi obat langsung dengan apoteker berlisensi untuk keamanan Anda.</p>
               </div>
               <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Pill className="w-32 h-32" />
               </div>
            </div>
          </div>

          {/* Main Content: Chat View */}
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="wait">
              {selectedPharmacist ? (
                <motion.div
                  key={selectedPharmacist.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChatWindow 
                    currentUser={user} 
                    selectedPharmacist={selectedPharmacist} 
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[600px] flex flex-col items-center justify-center text-center p-8 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200"
                >
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-6">
                    <Mail className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Pilih Apoteker</h3>
                  <p className="text-slate-500 max-w-sm">
                    Silakan pilih apoteker berlisensi dari daftar di sebelah kiri untuk memulai konsultasi obat gratis secara real-time.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md medical-gradient flex items-center justify-center">
              <Pill className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">POTline</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <p>By: <span className="font-bold text-primary">Novita Indriani</span></p>
            <span className="text-slate-200">|</span>
            <p>© 2024 Potterline Apoteker Online</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-primary transition-colors cursor-pointer">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
