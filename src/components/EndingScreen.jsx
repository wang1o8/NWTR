import React from 'react';
import { useGameStore } from '../engine/useGameStore';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home } from 'lucide-react';

export default function EndingScreen() {
  const { currentEnding, startNGPlus, playerName, stats, ngPlusLevel } = useGameStore();

  if (!currentEnding) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full bg-slate-900 border-2 border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]"
        style={{ borderColor: `${currentEnding.color}33` }}
      >
        {/* Banner Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={currentEnding.image} 
            alt={currentEnding.title} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter" style={{ color: currentEnding.color }}>
              {currentEnding.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-8">
          <p className="text-xl md:text-2xl text-gray-300 font-serif leading-relaxed italic">
            "{currentEnding.description}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Lữ Khách</span>
              <span className="text-xl font-bold text-white">{playerName}</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Cấp Độ Đạt Được</span>
              <span className="text-xl font-bold text-white">Lv. {stats.level}</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <span className="block text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">Vòng Lặp (NG+)</span>
              <span className="text-xl font-bold text-white">#{ngPlusLevel}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-8">
            <button 
              onClick={startNGPlus}
              className="flex-1 py-5 bg-white text-black font-black rounded-2xl text-xl uppercase italic shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <RotateCcw size={24} /> Bắt đầu vòng lặp mới (NG+)
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="py-5 px-8 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl text-xl uppercase italic border border-white/10 transition-all flex items-center justify-center gap-3"
            >
              <Home size={24} /> Thoát ra menu
            </button>
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="bg-black/40 p-4 text-center">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <Trophy size={12} className="text-amber-500" /> Bản lưu truyền vĩnh hằng • Wandered Engine v2.0
          </p>
        </div>
      </motion.div>
    </div>
  );
}
