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
  Award
} from 'lucide-react';

export default function StatsBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { playerName, age, stats, personality, currentWorldId, chapter, worldVisits, flags, inventory, equippedWeapon, traits, getTotalStats } = useGameStore();
  
  const totalStats = getTotalStats();
  const hpPercent = (stats.hp / totalStats.maxHp) * 100;
  const mpPercent = (stats.mp / totalStats.maxMp) * 100;
  const xpPercent = (stats.xp / (stats.level * 100)) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-white/10 text-white p-2 safe-area-bottom">
      <div className="max-w-4xl mx-auto">
        {/* Collapsed HUD */}
        <div className="flex items-center justify-between gap-4 h-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center border border-white/20 relative">
              <User size={20} />
              {traits && traits.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] font-bold border border-black">
                  {traits.length}
                </div>
              )}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 leading-none">Cấp {stats.level}</div>
              <div className="text-xs sm:text-sm font-bold truncate max-w-[80px] sm:max-w-none leading-tight">{playerName} <span className="text-[10px] opacity-50">({age})</span></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1 max-w-xs">
            <div className="flex justify-between text-[10px] uppercase font-bold px-1">
              <span>HP</span>
              <span>{stats.hp}/{totalStats.maxHp}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-red-500" 
                initial={{ width: 0 }}
                animate={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1 max-w-xs hidden sm:flex">
            <div className="flex justify-between text-[10px] uppercase font-bold px-1">
              <span>MP</span>
              <span>{stats.mp}/{totalStats.maxMp}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500" 
                initial={{ width: 0 }}
                animate={{ width: `${mpPercent}%` }}
              />
            </div>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-white/5 mt-2 max-h-[70vh] overflow-y-auto custom-scrollbar px-2">
                {/* Column 1: Core Stats */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 border-b border-indigo-400/20 pb-1">Chỉ Số Cơ Bản</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <StatItem icon={<Sword size={14}/>} label="Sức Mạnh" value={totalStats.str} />
                    <StatItem icon={<Zap size={14}/>} label="Trí Tuệ" value={totalStats.int} />
                    <StatItem icon={<Wind size={14}/>} label="Tốc Độ" value={totalStats.agi} />
                    <StatItem icon={<Shield size={14}/>} label="Phòng Thủ" value={totalStats.def} />
                    <StatItem icon={<Activity size={14}/>} label="Kháng Tính" value={totalStats.res} />
                    <StatItem icon={<Star size={14}/>} label="May Mắn" value={totalStats.lck} />
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-[10px] uppercase font-bold opacity-50 mb-2">Chỉ Số Khác</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex justify-between"><span className="opacity-50">Khéo Léo:</span> <span>{totalStats.dex}</span></div>
                      <div className="flex justify-between"><span className="opacity-50">Sức Hút:</span> <span>{totalStats.cha}</span></div>
                      <div className="flex justify-between"><span className="opacity-50">Thể Lực:</span> <span>{totalStats.con}</span></div>
                      <div className="flex justify-between"><span className="opacity-50">Giáp:</span> <span>{totalStats.armor}</span></div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-[10px] uppercase font-bold opacity-50 mb-1">Kinh Nghiệm</div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: `${xpPercent}%` }} />
                    </div>
                    <div className="text-[10px] text-right mt-1 opacity-50">{stats.xp} / {stats.level * 100} XP</div>
                  </div>
                </div>

                {/* Column 2: Equipment & Traits */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400 border-b border-emerald-400/20 pb-1">Trang Bị & Thiên Phú</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm p-2 bg-white/5 rounded border border-white/5">
                      <span className="opacity-60 text-xs">Vũ Khí:</span>
                      <span className="font-medium text-indigo-300">{equippedWeapon?.name || 'Tay không'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm p-2 bg-white/5 rounded border border-white/5">
                      <span className="opacity-60 text-xs">Tính Cách:</span>
                      <span className="font-medium text-emerald-300 capitalize">{personality}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="text-[10px] uppercase font-bold opacity-50 mb-2 flex items-center gap-1">
                      <Award size={10} /> Thiên Phú (Traits)
                    </div>
                    <div className="space-y-1">
                      {traits && traits.length > 0 ? (
                        traits.map((t, i) => (
                          <div key={i} className="text-[11px] p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded flex flex-col">
                            <span className="font-bold text-emerald-400">{t.name}</span>
                            <span className="text-[9px] opacity-70 leading-tight">{t.lore}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[10px] opacity-30 italic">Chưa có thiên phú nào</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 3: Progression & Flags */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 border-b border-amber-400/20 pb-1">Tiến Trình</h3>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-white/5 rounded">
                      <div className="text-[10px] uppercase opacity-50">Chương</div>
                      <div className="text-lg font-bold">{chapter}</div>
                    </div>
                    <div className="p-2 bg-white/5 rounded">
                      <div className="text-[10px] uppercase opacity-50">Thế Giới</div>
                      <div className="text-lg font-bold">{worldVisits}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {flags.slice(0, 6).map(f => (
                      <span key={f} className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-indigo-300 uppercase">
                        {f.replace('visited_', '').replace('completed_', '')}
                      </span>
                    ))}
                    {flags.length > 6 && <span className="text-[9px] opacity-50">+{flags.length - 6} khác</span>}
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5">
                    <button 
                      onClick={() => {
                        if(window.confirm('Bạn có chắc chắn muốn bắt đầu lại hành trình? Mọi tiến trình sẽ bị xóa.')) {
                          useGameStore.getState().setPlayerName('');
                          window.location.reload();
                        }
                      }}
                      className="w-full py-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded text-[10px] uppercase font-bold tracking-widest text-red-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings size={12} /> Thiết Lập Lại Hành Trình
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

function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-white/40">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[9px] uppercase opacity-40 font-bold leading-none mb-0.5">{label}</span>
        <span className="text-sm font-bold leading-none">{value}</span>
      </div>
    </div>
  );
}
