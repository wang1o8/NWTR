import React from 'react';
import { useGameStore } from '../engine/useGameStore';
import { Award, Star, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function TraitList() {
  const { traits, conditionalTraits } = useGameStore();

  const allTraits = [
    ...(traits || []).map(t => ({ ...t, type: 'innate' })),
    ...(conditionalTraits || []).map(t => ({ ...t, type: 'conditional' }))
  ];

  if (allTraits.length === 0) {
    return (
      <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
        <p className="text-sm text-gray-500 italic">Chưa phát hiện được thiên phú nào trong linh hồn bạn.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {allTraits.map((trait, idx) => (
        <motion.div 
          key={trait.id || idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`p-4 rounded-2xl border transition-all ${
            trait.type === 'innate' 
            ? 'bg-amber-500/5 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
            : 'bg-indigo-500/5 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-black text-white flex items-center gap-2 text-sm uppercase italic tracking-tight">
              {trait.type === 'innate' ? <Star size={14} className="text-amber-500" /> : <Award size={14} className="text-indigo-400" />}
              {trait.name}
            </h4>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
              trait.type === 'innate' ? 'bg-amber-500/20 text-amber-500' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {trait.type === 'innate' ? 'Bẩm sinh' : 'Cộng hưởng'}
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">{trait.description}</p>
          
          {trait.stat_effects && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(trait.stat_effects).map(([stat, val]) => (
                <span key={stat} className="text-[10px] font-bold text-emerald-400">
                  {val > 0 ? '+' : ''}{val} {stat.toUpperCase()}
                </span>
              ))}
            </div>
          )}
          
          {trait.special_rule && (
            <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-amber-200/60 italic">
               ✧ {trait.special_rule}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
