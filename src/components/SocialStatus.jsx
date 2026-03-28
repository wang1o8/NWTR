import React from 'react';
import { useGameStore } from '../engine/useGameStore';
import { SocialEngine } from '../engine/SocialEngine';

export default function SocialStatus({ onClose }) {
  const { npcs, globalReputation, currentWorldId } = useGameStore();
  
  const worldNpcs = npcs[currentWorldId] || [];
  const repStatus = SocialEngine.getReputationThreshold(globalReputation);

  return (
    <div className="social-modal glass p-6 max-w-2xl w-full mx-auto mt-20 rounded-xl border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h2 className="text-2xl font-serif text-white flex items-center gap-2">
          🤝 Mối Quan Hệ & Danh Tiếng
        </h2>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">✕</button>
      </div>

      <div className="space-y-8">
        {/* Global Reputation Section */}
        <section className="bg-white/5 p-4 rounded-lg">
          <h3 className="text-sm uppercase tracking-widest text-white/40 mb-3 font-black">Danh Tiếng Thế Giới</h3>
          <div className="flex items-center gap-4">
            <div className={`text-3xl font-bold ${globalReputation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {globalReputation}
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-white mb-1">{repStatus}</div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${globalReputation >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.abs(globalReputation)}%`, marginLeft: globalReputation < 0 ? 'auto' : '0' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* NPCs Section */}
        <section>
          <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4 font-black">Nhân Vật Trong Khu Vực</h3>
          <div className="grid gap-3">
            {worldNpcs.map(npc => {
              const range = SocialEngine.getAffectionRange(npc.affection);
              const colorClass = 
                range === 'Hostile' ? 'text-red-500' :
                range === 'Unfriendly' ? 'text-orange-400' :
                range === 'Friendly' ? 'text-green-400' :
                range === 'Close' ? 'text-pink-400' : 'text-blue-200';

              return (
                <div key={npc.id} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-white text-lg">{npc.name}</h4>
                      <p className="text-xs text-white/30 italic">{npc.role}</p>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${colorClass} bg-white/5`}>
                      {range} ({npc.affection})
                    </div>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${colorClass.replace('text', 'bg')}`}
                      style={{ width: `${(npc.affection + 100) / 2}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
