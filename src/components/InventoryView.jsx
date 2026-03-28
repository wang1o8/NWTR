import React, { useEffect } from 'react';
import { useGameStore } from '../engine/useGameStore';
import ItemCard from './ItemCard';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, Sword, Backpack, ShieldCheck, Award, Heart, Zap, Brain, Shield, LucideZap } from 'lucide-react';
import TraitList from './TraitList';

export default function InventoryView({ onClose }) {
  const { 
    inventory, stats, equippedWeapon, 
    equipWeapon, sellItem, getTotalStats,
    updateStats, removeItem, clearNewItemsCount
  } = useGameStore();
  
  const [selectedItem, setSelectedItem] = React.useState(null);
  const totalStats = getTotalStats();

  useEffect(() => {
    if (clearNewItemsCount) clearNewItemsCount();
  }, [clearNewItemsCount]);

  const handleEquip = (item) => {
    equipWeapon(item);
    setSelectedItem(null);
  };

  const handleUse = (item) => {
    if (item.effect) {
      updateStats(item.effect);
      removeItem(item.id);
      setSelectedItem(null);
    }
  };

  const handleSell = (item) => {
    sellItem(item);
    setSelectedItem(null);
  };

  const statIcons = {
    str: <LucideZap size={14} className="text-red-400" />,
    dex: <Zap size={14} className="text-yellow-400" />,
    int: <Brain size={14} className="text-blue-400" />,
    con: <Shield size={14} className="text-emerald-400" />,
    wis: <Award size={14} className="text-purple-400" />,
    cha: <Heart size={14} className="text-pink-400" />,
    lck: <Coins size={14} className="text-amber-400" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
              <Backpack className="text-amber-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Hành Trang</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-yellow-400 font-bold bg-yellow-400/10 px-2 py-0.5 rounded-lg text-sm border border-yellow-400/20">
                  <Coins size={14} /> {stats.gold.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Sức chứa: {inventory.length} / {totalStats.carryWeight || 20}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-black/20 custom-scrollbar">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {inventory.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedItem(item)}
                  className={`relative aspect-square rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all group ${
                    equippedWeapon?.id === item.id 
                    ? 'bg-indigo-500/20 border-indigo-500/50 ring-2 ring-indigo-500/20' 
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  {equippedWeapon?.id === item.id && (
                    <div className="absolute -top-2 -right-2 bg-indigo-500 text-white p-1.5 rounded-lg shadow-lg">
                      <ShieldCheck size={14} />
                    </div>
                  )}
                  <span className="text-4xl mb-2 filter drop-shadow-lg group-hover:scale-110 transition-transform">
                    {item.icon || '🎒'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 text-gray-400 mb-1">
                    {item.rarity || 'Thường'}
                  </span>
                  <span className="text-xs font-bold text-gray-200 text-center px-2 line-clamp-1">{item.name}</span>
                </motion.div>
              ))}
            </div>

            {/* Trait Section at bottom */}
            <div className="mt-12">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                < Award size={14} /> Thiên Phú Hiện Tại
              </h3>
              <TraitList />
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="w-80 border-l border-white/5 bg-slate-900/50 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
            {/* Stats Overview */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Chỉ số nhân vật</h3>
              <div className="grid grid-cols-2 gap-2">
                {['str', 'dex', 'int', 'con', 'wis', 'cha', 'lck'].map(s => (
                  <div key={s} className="bg-white/5 p-2 rounded-xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-2">
                      {statIcons[s]}
                      <span className="text-[9px] text-gray-400 uppercase font-black">{s}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{totalStats[s] || stats[s]}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-white/5" />

            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Chi tiết vật phẩm</h3>
            
            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <ItemCard item={selectedItem} />
                  
                  <div className="flex flex-col gap-3">
                    {selectedItem.type === 'weapon' && (
                      <button 
                        onClick={() => handleEquip(selectedItem)}
                        disabled={equippedWeapon?.id === selectedItem.id}
                        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                          equippedWeapon?.id === selectedItem.id
                          ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 active:scale-95'
                        }`}
                      >
                        <Sword size={18} />
                        {equippedWeapon?.id === selectedItem.id ? 'Đã trang bị' : 'Trang bị'}
                      </button>
                    )}

                    {selectedItem.type === 'consumable' && (
                      <button 
                        onClick={() => handleUse(selectedItem)}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 active:scale-95 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        <Heart size={18} /> Sử dụng
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleSell(selectedItem)}
                      className="w-full py-4 bg-white/5 hover:bg-red-500/10 text-white/50 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Coins size={18} /> Bán vật phẩm ({selectedItem.price || 5})
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-10">
                  <div className="bg-white/5 p-6 rounded-full mb-4">
                    <Backpack size={48} />
                  </div>
                  <p className="text-sm italic">Chọn một vật phẩm để xem chi tiết</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
