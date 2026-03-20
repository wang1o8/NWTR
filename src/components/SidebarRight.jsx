import React, { useState } from 'react';
import { useGameStore } from '../engine/useGameStore';
import worldsData from '../data/worlds.json';
import uiConfig from '../data/base/ui_config.json';
import { Backpack, Shield, Sword, Map as MapIcon, Info } from 'lucide-react';

export default function SidebarRight() {
  const { currentWorldId, flags, player, inventory, equippedWeapon } = useGameStore();
  const [activeTab, setActiveTab] = useState('inventory');

  const unlockedWorlds = Object.values(worldsData).filter(w => 
    w.id === 'tutorial' || flags.includes(`visited_${w.id}`)
  );

  const equipmentSlots = uiConfig.inventory.slots;
  const bagColumns = uiConfig.inventory.bag_columns;

  return (
    <div className="sidebar-panel right-sidebar flex flex-col h-full bg-zinc-900 border-l border-white/10">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'inventory' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          <Backpack size={14} /> Hành Trang
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'map' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}
        >
          <MapIcon size={14} /> Bản Đồ
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'inventory' ? (
          <div className="space-y-6">
            {/* Equipment Slots */}
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                <Shield size={12} /> Trang Bị
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {equipmentSlots.map(slot => (
                  <div key={slot} className="aspect-square bg-black/40 border border-white/5 rounded-lg flex flex-col items-center justify-center p-2 relative group hover:border-white/20 transition-all">
                    <div className="text-[8px] uppercase font-bold opacity-30 absolute top-1 left-2">{slot.replace('_', ' ')}</div>
                    {/* Placeholder for equipped item */}
                    <div className="text-white/10 group-hover:text-white/20 transition-colors">
                      {slot.includes('hand') ? <Sword size={24} /> : <Shield size={24} />}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bag / Inventory */}
            <section>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                <Backpack size={12} /> Túi Đồ
              </h3>
              <div className={`grid grid-cols-${bagColumns} gap-2`}>
                {/* Fill empty slots to show the grid */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const item = inventory[i];
                  return (
                    <div key={i} className="aspect-square bg-black/20 border border-white/5 rounded-md flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                      {item ? (
                        <div className="w-full h-full p-1 flex items-center justify-center">
                          <div className="w-full h-full bg-indigo-500/20 rounded border border-indigo-500/30" />
                        </div>
                      ) : (
                        <div className="w-1 h-1 bg-white/5 rounded-full" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-serif font-bold mb-4">Bản đồ Thế giới</h2>
            <div className="map-list space-y-3">
              {unlockedWorlds.map(w => (
                <div key={w.id} className={`map-node p-3 rounded-xl border transition-all ${w.id === currentWorldId ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${w.image})` }} />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold">{w.name}</h4>
                      {w.id === currentWorldId && <span className="text-[10px] uppercase font-bold text-indigo-400">Vị trí hiện tại</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
