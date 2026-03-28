import React, { useState } from 'react';
import { useGameStore } from '../engine/useGameStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Shield, 
  Sword, 
  Zap, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Backpack,
  Settings,
  Wind,
  Activity,
  Award,
  Sparkles,
  Users
} from 'lucide-react';

function StatItem({ icon, label, value, statKey }) {
  const { stats, equippedWeapon, traits, conditionalTraits } = useGameStore();
  const baseValue = stats[statKey] || 0;
  
  const eqBonus = equippedWeapon?.stats?.[statKey] || equippedWeapon?.stat_effects?.[statKey] || 0;
  const traitBonus = [...(traits || []), ...(conditionalTraits || [])].reduce((sum, t) => {
    return sum + (t.stat_effects?.[statKey] || 0);
  }, 0);

  return (
    <div className="stat-row">
      <div className="flex items-center gap-2">
        <div className="text-white/40">{icon}</div>
        <span className="stat-label uppercase font-bold text-[9px] opacity-40">{label}</span>
      </div>
      <div className="stat-value text-sm font-bold">
        <span className="stat-base">{baseValue}</span>
        {eqBonus > 0 && (
          <>
            <span className="stat-operator"> + </span>
            <span className="stat-bonus equipment-bonus">{eqBonus}</span>
          </>
        )}
        {traitBonus !== 0 && (
          <>
            <span className="stat-operator"> + </span>
            <span className="stat-bonus trait-bonus">{traitBonus}</span>
          </>
        )}
        {(eqBonus !== 0 || traitBonus !== 0) && (
          <span className="stat-total"> = {value}</span>
        )}
      </div>
    </div>
  );
}

export default function StatsBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { playerName, age, stats, personality, currentWorldId, chapter, worldVisits, flags, inventory, equippedWeapon, traits, getTotalStats } = useGameStore();
  
  const totalStats = getTotalStats();
  const hpPercent = (stats.hp / (totalStats.maxHp || 1)) * 100;
  const mpPercent = (stats.mp / (totalStats.maxMp || 1)) * 100;
  const sanityPercent = (stats.sanity / (totalStats.maxSanity || 1)) * 100;
  const xpPercent = (stats.xp / (stats.level * 100 || 1)) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/10 text-white p-2 safe-area-bottom">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 flex items-center justify-center border border-white/20 relative">
              <User size={16} className="sm:size-5" />
              {traits && traits.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[7px] sm:text-[8px] font-bold border border-black">
                  {traits.length}
                </div>
              )}
            </div>
            <div className="hidden xs:block">
              <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-60 leading-none">Cấp {stats.level}</div>
              <div className="text-[11px] sm:text-sm font-bold truncate max-w-[60px] sm:max-w-none leading-tight">{playerName}</div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-1 sm:gap-2 max-w-md">
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-[8px] sm:text-[9px] uppercase font-bold px-0.5 opacity-70">
                <span>HP</span>
                <span className="hidden xs:inline">{stats.hp}/{totalStats.maxHp}</span>
              </div>
              <div className="h-1 sm:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-red-500" initial={{ width: 0 }} animate={{ width: `${hpPercent}%` }} />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-[8px] sm:text-[9px] uppercase font-bold px-0.5 opacity-70">
                <span>MP</span>
                <span className="hidden xs:inline">{stats.mp}/{totalStats.maxMp}</span>
              </div>
              <div className="h-1 sm:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${mpPercent}%` }} />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex justify-between text-[8px] sm:text-[9px] uppercase font-bold px-0.5 opacity-70">
                <span>SAN</span>
                <span className="hidden xs:inline">{stats.sanity}/{totalStats.maxSanity}</span>
              </div>
              <div className="h-1 sm:h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-purple-500" initial={{ width: 0 }} animate={{ width: `${sanityPercent}%` }} />
              </div>
            </div>
          </div>

          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-white/5 mt-2 max-h-[70vh] overflow-y-auto custom-scrollbar px-2">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-indigo-400/20 pb-1">Thuộc Tính Cốt Lõi</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatItem icon={<Sword size={14}/>} label="Sức Mạnh" value={totalStats.str} statKey="str" />
                    <StatItem icon={<Zap size={14}/>} label="Trí Tuệ" value={totalStats.int} statKey="int" />
                    <StatItem icon={<Wind size={14}/>} label="Khéo Léo" value={totalStats.dex} statKey="dex" />
                    <StatItem icon={<Shield size={14}/>} label="Thể Chất" value={totalStats.con} statKey="con" />
                    <StatItem icon={<Activity size={14}/>} label="Minh Mẫn" value={totalStats.wis} statKey="wis" />
                    <StatItem icon={<Award size={14}/>} label="Sức Hút" value={totalStats.cha} statKey="cha" />
                    <StatItem icon={<Sparkles size={14}/>} label="May Mắn" value={totalStats.lck} statKey="lck" />
                    <StatItem icon={<Users size={14}/>} label="Uy Tín" value={totalStats.rep} statKey="rep" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 border-b border-emerald-400/20 pb-1">Trang Bị & Thiên Phú</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm p-2 bg-white/5 rounded border border-white/5">
                      <span className="opacity-60 text-xs">Vũ Khí:</span>
                      <span className="font-bold text-indigo-300">{equippedWeapon?.name || 'Tay không'}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-amber-400/20 pb-1">Tiến Trình</h3>
                  <div className="pt-4 mt-4 border-t border-white/5">
                    <button onClick={() => { useGameStore.getState().setPlayerName(''); window.location.reload(); }} className="w-full py-2 bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 rounded text-[10px] uppercase font-bold text-red-400 transition-colors flex items-center justify-center gap-2">
                      <Settings size={12} /> Reset dữ liệu
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
