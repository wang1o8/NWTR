import React, { useState } from 'react';
import { useGameStore } from '../engine/useGameStore';
import itemsData from '../data/items.json';
import { motion, AnimatePresence } from 'motion/react';

export default function Inventory({ onClose }) {
  const { 
    playerName, inventory, stats, worldStats, currentWorldId, 
    updateStats, removeItem, equippedWeapon, traits, conditionalTraits,
    getTotalStats, clearNewItemsCount
  } = useGameStore();
  
  const [activeTab, setActiveTab] = useState('equipment'); // 'equipment', 'traits', 'items'
  const [selectedItem, setSelectedItem] = useState(null);

  React.useEffect(() => {
    clearNewItemsCount();
  }, [clearNewItemsCount]);

  const totalStats = getTotalStats();

  const statIcons = {
    str: '💪', dex: '🏃', int: '🧠', con: '🛡️', wis: '📜', cha: '✨',
    lck: '🍀', rep: '🎖️', soul: '👻', hp: '❤️', mp: '💧', sanity: '🌀',
    atk: '⚔️', def: '🛡️', initiative: '⚡', dodge: '💨', critchance: '🎯'
  };

  const statNames = {
    str: 'Sức mạnh', dex: 'Khéo léo', int: 'Trí tuệ', con: 'Thể chất', wis: 'Sáng suốt', cha: 'Cuốn hút',
    lck: 'May mắn', rep: 'Danh tiếng', soul: 'Linh hồn', hp: 'Máu', mp: 'Năng lượng', sanity: 'Tâm trí',
    physatk: 'Công vật lý', magatk: 'Công phép', physicalresist: 'Giáp', magicresist: 'Kháng phép',
    initiative: 'Sáng kiến', dodge: 'Né tránh', critchance: 'Chí mạng'
  };

  const handleUseItem = (item) => {
    if (item && item.type === 'consumable' && item.effect) {
      updateStats(item.effect);
      removeItem(item.id || item);
      setSelectedItem(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Hành Trang</h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest">{playerName} • Cấp {stats.level}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-black/20">
          {[
            { id: 'equipment', label: 'Trang bị', icon: '⚔️' },
            { id: 'traits', label: 'Thiên phú', icon: '⭐' },
            { id: 'items', label: 'Vật phẩm', icon: '🎒' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id ? 'text-amber-400 bg-white/5 border-b-2 border-amber-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Equipped Weapon */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Đang trang bị</h3>
                  {equippedWeapon ? (
                    <div 
                      onClick={() => setSelectedItem(equippedWeapon)}
                      className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-5 rounded-2xl border border-indigo-500/30 cursor-pointer hover:border-indigo-400 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{equippedWeapon.rarity}</span>
                          <h4 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{equippedWeapon.name}</h4>
                        </div>
                        <span className="text-3xl">{equippedWeapon.icon || '⚔️'}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {Object.entries(equippedWeapon.stats || equippedWeapon.stat_effects || {}).map(([stat, val]) => (
                          <div key={stat} className="flex items-center gap-2 text-sm">
                            <span>{statIcons[stat.toLowerCase()] || '•'}</span>
                            <span className="text-gray-400">{statNames[stat.toLowerCase()] || stat}:</span>
                            <span className={val >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                              {val > 0 ? '+' : ''}{val}{stat.endsWith('_mult') ? '%' : ''}
                            </span>
                          </div>
                        ))}
                      </div>

                      {equippedWeapon.effects && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-xs text-indigo-300 italic">{equippedWeapon.effects}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-32 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-gray-600 italic text-sm">
                      Chưa trang bị vũ khí
                    </div>
                  )}
                </div>

                {/* All Stats Summary */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Chỉ số tổng hợp</h3>
                  <div className="bg-black/40 rounded-2xl p-5 border border-white/5 grid grid-cols-2 gap-4">
                    {['str', 'dex', 'int', 'con', 'wis', 'cha', 'lck'].map(s => (
                      <div key={s} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{statIcons[s]}</span>
                          <span className="text-xs text-gray-400 uppercase font-bold">{s}</span>
                        </div>
                        <span className="text-sm font-bold text-white">{totalStats[s]}</span>
                      </div>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-white/5 mt-2 grid grid-cols-2 gap-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Công vật lý</span>
                          <span className="text-sm font-bold text-red-400">{Math.floor(totalStats.physAtk)}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">Công phép</span>
                          <span className="text-sm font-bold text-blue-400">{Math.floor(totalStats.magAtk)}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'traits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...traits, ...conditionalTraits].map((trait, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border bg-black/40 transition-all ${
                    trait.method === 'innate' ? 'border-amber-500/30' : 'border-indigo-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      {trait.name}
                      {trait.method === 'innate' && <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded uppercase font-black">⭐ Bẩm Sinh</span>}
                    </h4>
                    <span className={`text-[10px] font-bold uppercase ${trait.active !== false ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {trait.active !== false ? 'Đang kích hoạt' : 'Chưa mở khóa'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">{trait.description}</p>
                  {trait.requires && (
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider bg-white/5 p-2 rounded-lg">
                      Điều kiện: {JSON.stringify(trait.requires).replace(/[{}"]/g, '').replace(/:/g, ' ')}
                    </div>
                  )}
                </div>
              ))}
              {traits.length === 0 && conditionalTraits.length === 0 && (
                <div className="col-span-2 py-20 text-center text-gray-600 italic">Chưa có thiên phú nào</div>
              )}
            </div>
          )}

          {activeTab === 'items' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {inventory.map((item, idx) => {
                const itemData = typeof item === 'string' ? itemsData[item] : item;
                if (!itemData) return null;
                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedItem(itemData)}
                    className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 cursor-pointer transition-all text-center group"
                  >
                    <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">{itemData.icon || '🎒'}</span>
                    <span className="text-sm font-bold text-gray-300 block truncate">{itemData.name}</span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">{itemData.type === 'consumable' ? 'Tiêu thụ' : 'Trang bị'}</span>
                  </div>
                );
              })}
              {inventory.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-600 italic">Hành trang trống rỗng</div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedItem(null)}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-slate-900 border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <span className="text-6xl block mb-4">{selectedItem.icon || '🎒'}</span>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-1 block">{selectedItem.rarity || 'Thường'}</span>
                <h3 className="text-3xl font-black text-white uppercase italic">{selectedItem.name}</h3>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-gray-400 text-sm leading-relaxed italic text-center">"{selectedItem.description || selectedItem.lore || 'Một vật phẩm bí ẩn được tìm thấy trong hành trình.'}"</p>
                
                {(selectedItem.stats || selectedItem.stat_effects) && (
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 grid grid-cols-2 gap-2">
                    {Object.entries(selectedItem.stats || selectedItem.stat_effects).map(([stat, val]) => (
                      <div key={stat} className="flex justify-between text-xs">
                        <span className="text-gray-500 uppercase font-bold">{statNames[stat.toLowerCase()] || stat}</span>
                        <span className={val >= 0 ? 'text-emerald-400' : 'text-red-400 font-bold'}>{val > 0 ? '+' : ''}{val}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {selectedItem.type === 'consumable' && (
                  <button 
                    onClick={() => handleUseItem(selectedItem)}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-emerald-600/20"
                  >
                    Sử dụng
                  </button>
                )}
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
