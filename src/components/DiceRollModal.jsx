import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dice6, Sparkles, Wand2, ArrowRight } from 'lucide-react';

export default function DiceRollModal({ baseChance, lck, onConfirm, onCancel }) {
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [extraChance, setExtraChance] = useState(0);
  
  const lckBonus = Math.floor(lck / 5) * 5;
  const currentTotal = baseChance + lckBonus + extraChance;

  const handleRoll = () => {
    if (isRolling || diceResult !== null) return;
    setIsRolling(true);
    
    // Animate for 1 second
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      let bonus = 0;
      if (roll >= 3 && roll <= 4) bonus = 10;
      else if (roll === 5) bonus = 20;
      else if (roll === 6) bonus = 30;
      
      setDiceResult(roll);
      setExtraChance(bonus);
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onCancel}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-slate-900 border-2 border-indigo-500/30 rounded-3xl p-6 w-full max-w-sm shadow-2xl pointer-events-auto overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        
        <h3 className="text-xl font-black text-white mb-2 uppercase italic flex items-center gap-2">
          <Dice6 className="text-indigo-400" /> Thử Thách Vận May
        </h3>
        
        <div className="bg-black/40 rounded-2xl p-4 mb-6 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Khả năng thành công</span>
            <span className="text-2xl font-black text-indigo-400 font-mono">{currentTotal}%</span>
          </div>
          
          <div className="space-y-2 text-[10px] font-bold uppercase tracking-tight">
            <div className="flex justify-between text-white/40">
              <span>Cơ bản</span>
              <span>{baseChance}%</span>
            </div>
            <div className="flex justify-between text-emerald-400/60">
              <span>Thấu thị (LCK)</span>
              <span>+{lckBonus}%</span>
            </div>
            {diceResult !== null && (
              <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex justify-between text-amber-400">
                <span>Xúc xắc (d6: {diceResult})</span>
                <span>+{extraChance}%</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button 
            onClick={onConfirm}
            disabled={isRolling}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black uppercase text-white transition-all active:scale-95 disabled:opacity-50"
          >
            {diceResult === null ? 'Giữ Nguyên' : 'Dấn Bước'}
          </button>
          
          {diceResult === null && (
            <button 
              onClick={handleRoll}
              disabled={isRolling}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isRolling ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.5 }}>
                  <Dice6 size={14} />
                </motion.div>
              ) : (
                <><Wand2 size={14} /> Tung Xúc Xắc</>
              )}
            </button>
          )}
        </div>

        <p className="text-[9px] text-gray-500 text-center italic">
          {diceResult === null 
            ? "Tung d6 để tăng cơ hội thành công (+0% đến +30%)" 
            : "Kết quả đã được ấn định. Bước tiếp thôi."}
        </p>
      </motion.div>
    </div>
  );
}
