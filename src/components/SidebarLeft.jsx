import React, { useState, useEffect } from 'react';
import { useGameStore } from '../engine/useGameStore';
import { Award } from 'lucide-react';
import TraitList from './TraitList';
import itemsData from '../data/items.json';
import ItemCard from './ItemCard';

const weatherTranslations = {
  sunny: 'Nắng',
  rainy: 'Mưa',
  cloudy: 'Nhiều mây',
  stormy: 'Bão',
  snowy: 'Tuyết',
  foggy: 'Sương mù'
};

const timeTranslations = {
  day: 'Ban ngày',
  night: 'Ban đêm',
  dusk: 'Hoàng hôn',
  dawn: 'Bình minh'
};

const personalityTranslations = {
  brave: 'Dũng cảm',
  cautious: 'Cẩn trọng',
  charismatic: 'Cuốn hút',
  stoic: 'Lạnh lùng',
  reckless: 'Liều lĩnh',
  analytical: 'Phân tích'
};

export default function SidebarLeft() {
  const { playerName, inventory, traits, conditionalTraits, stats, worldStats, currentWorldId, updateStats, removeItem, personality, weather, timeOfDay, setFlag, hasFlag, equippedWeapon, equipWeapon, getTotalStats, age, globalReputation } = useGameStore();
  const [selectedItem, setSelectedItem] = useState(null);
  
  useEffect(() => {
    // Check for 27 curse
    let count27 = 0;
    
    // Check traits
    if (traits) {
      traits.forEach(t => {
        if (t.effect && Object.values(t.effect).some(v => v === 27 || v === -27)) {
          count27++;
        }
      });
    }
    
    // Check inventory
    if (inventory) {
      inventory.forEach(item => {
        if (typeof item === 'object' && item.stats) {
          if (Object.values(item.stats).some(v => v === 27 || v === -27)) {
            count27++;
          }
        }
      });
    }
    
    if (count27 >= 3 && !hasFlag('curse_of_27')) {
      setFlag('curse_of_27');
    }
  }, [traits, inventory, setFlag, hasFlag]);

  const handleUseItem = (itemId) => {
    const item = itemsData[itemId];
    if (item && item.type === 'consumable' && item.effect) {
      if (item.effect.hp) {
        updateStats({ hp: Math.min(stats.maxHp, stats.hp + item.effect.hp) });
      }
      if (item.effect.mp) {
        updateStats({ mp: Math.min(stats.maxMp, stats.mp + item.effect.mp) });
      }
      removeItem(itemId);
    }
  };

  const currentWorldStat = worldStats[currentWorldId];

  // Calculate total player stats including weapon and traits
  const totalStats = getTotalStats();

  return (
    <div className="sidebar-panel left-sidebar overflow-y-auto">
      <h2 className="text-xl font-serif font-bold mb-2">Trạng thái của {playerName}</h2>
      {personality && <p className="text-sm italic text-gray-400 mb-4 capitalize">Tính cách: {personalityTranslations[personality] || personality}</p>}
      
      {hasFlag('curse_of_27') && (
        <div className="mb-4 p-3 rounded-lg bg-purple-900/50 border border-purple-500/50 flex items-center gap-3 animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.4)]">
          <span className="text-2xl drop-shadow-[0_0_5px_rgba(216,180,254,0.8)]">👁️</span>
          <div>
            <span className="block text-sm font-bold text-purple-300">Lời nguyền 27</span>
            <span className="block text-xs text-purple-200/70 italic">Nó đang theo dõi bạn...</span>
          </div>
        </div>
      )}
      
      <div className="stats-section">
        <h3 className="text-indigo-400">Thuộc tính cốt lõi</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div className="flex justify-between"><span>Sức Mạnh (STR):</span> <span className="font-bold">{totalStats.str}</span></div>
          <div className="flex justify-between"><span>Khéo Léo (DEX):</span> <span className="font-bold">{totalStats.dex}</span></div>
          <div className="flex justify-between"><span>Thể Chất (CON):</span> <span className="font-bold">{totalStats.con}</span></div>
          <div className="flex justify-between"><span>Trí Tuệ (INT):</span> <span className="font-bold">{totalStats.int}</span></div>
          <div className="flex justify-between"><span>Minh Mẫn (WIS):</span> <span className="font-bold">{totalStats.wis}</span></div>
          <div className="flex justify-between"><span>Sức Hút (CHA):</span> <span className="font-bold">{totalStats.cha}</span></div>
        </div>
      </div>

      <div className="stats-section">
        <h3 className="text-emerald-400">Chỉ số chiến đấu</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs opacity-90">
          <div className="flex justify-between"><span>Sát thương vật lý:</span> <span>{totalStats.physAtk.toFixed(1)}</span></div>
          <div className="flex justify-between"><span>Sát thương ma pháp:</span> <span>{totalStats.magAtk.toFixed(1)}</span></div>
          <div className="flex justify-between"><span>Tỉ lệ chí mạng:</span> <span>{totalStats.critChance.toFixed(1)}%</span></div>
          <div className="flex justify-between"><span>Sát thương chí mạng:</span> <span>{(totalStats.multipliers.crit_dmg * 100).toFixed(0)}%</span></div>
          <div className="flex justify-between"><span>Né tránh:</span> <span>{totalStats.dodge.toFixed(1)}%</span></div>
          <div className="flex justify-between"><span>Kháng vật lý:</span> <span>{totalStats.physicalResist.toFixed(1)}%</span></div>
          <div className="flex justify-between"><span>Kháng ma pháp:</span> <span>{totalStats.magicResist.toFixed(1)}%</span></div>
          <div className="flex justify-between"><span>Tốc độ (Initiative):</span> <span>{totalStats.initiative.toFixed(1)}</span></div>
        </div>
      </div>

      <div className="stats-section">
        <h3 className="text-amber-400">Chỉ số phụ</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div className="flex justify-between"><span>Vận May (LCK):</span> <span className="text-amber-300">{totalStats.lck}</span></div>
          <div className="flex justify-between"><span>Linh Hồn (SOUL):</span> <span className="text-purple-300">{totalStats.soul}/10</span></div>
          <div className="flex justify-between"><span>Danh Tiếng:</span> <span className={globalReputation >= 0 ? 'text-green-400' : 'text-red-400'}>{globalReputation}</span></div>
          <div className="flex justify-between"><span>Sức chứa:</span> <span>{totalStats.carryWeight}</span></div>
        </div>
      </div>

      <div className="stats-section">
        <h3 className="text-red-400">Trạng thái sinh tồn</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Máu (HP):</span> <span>{stats.hp}/{totalStats.maxHp}</span></div>
          <div className="flex justify-between"><span>Năng lượng (MP):</span> <span>{stats.mp}/{totalStats.maxMp}</span></div>
          <div className="flex justify-between">
            <span>Tâm trí (Sanity):</span> 
            <span className={stats.sanity < 20 ? 'text-red-500 animate-pulse' : stats.sanity < 40 ? 'text-orange-400' : 'text-blue-300'}>
              {stats.sanity}/{totalStats.maxSanity}
            </span>
          </div>
        </div>
      </div>

      {((traits && traits.length > 0) || (conditionalTraits && conditionalTraits.length > 0)) && (
        <div className="stats-section">
          <h3 className="text-purple-400 flex items-center gap-2"><Award size={16} /> Thiên Phú</h3>
          <TraitList />
        </div>
      )}
      
      {currentWorldStat && (
        <div className="stats-section">
          <h3>Đặc thù Thế giới</h3>
          {Object.entries(currentWorldStat).map(([key, val]) => (
            <p key={key}>{key.toUpperCase()}: {val}</p>
          ))}
        </div>
      )}

      <div className="stats-section">
        <h3>Kỹ năng ({stats.skills?.length || 0}/{stats.skillSlots || 1})</h3>
        {stats.skills?.length > 0 ? (
          <p className="text-sm">{stats.skills.join(', ')}</p>
        ) : (
          <p className="text-sm opacity-70">Chưa có kỹ năng</p>
        )}
      </div>
      
      {equippedWeapon && (
        <div className="stats-section">
          <h3>Trang bị hiện tại</h3>
          <div className="p-2 bg-indigo-900/30 rounded border border-indigo-500/30 cursor-pointer hover:bg-indigo-800/40" onClick={() => setSelectedItem(equippedWeapon)}>
            <p className="font-bold text-sm text-indigo-300">{equippedWeapon.icon} {equippedWeapon.name}</p>
            <p className="text-xs opacity-70">Độ hiếm: {equippedWeapon.rarityData?.name || equippedWeapon.rarity}</p>
          </div>
        </div>
      )}

      <div className="inventory-section">
        <h3>Túi đồ</h3>
        {inventory.length === 0 ? <p className="text-sm opacity-70">Trống</p> : null}
        <div className="inventory-list">
          {inventory.map((itemObj, idx) => {
            const isGenerated = typeof itemObj === 'object';
            const item = isGenerated ? itemObj : (itemsData[itemObj] || { name: itemObj, type: 'unknown' });
            
            return (
              <div key={idx} className="inv-item cursor-pointer hover:bg-white/10" onClick={() => isGenerated && setSelectedItem(item)}>
                <span>{isGenerated ? `${item.icon || ''} ${item.name}` : item.name}</span>
                {!isGenerated && item.type === 'consumable' && (
                  <button onClick={(e) => { e.stopPropagation(); handleUseItem(itemObj); }}>Dùng</button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedItem(null)}>
          <div onClick={e => e.stopPropagation()} className="max-w-md w-full">
            <ItemCard item={selectedItem} />
            <div className="flex gap-2 mt-4">
              {selectedItem.type === 'weapon' && equippedWeapon?.id !== selectedItem.id && (
                <button 
                  className="flex-1 p-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-bold"
                  onClick={() => {
                    equipWeapon(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  Trang bị
                </button>
              )}
              <button className="flex-1 p-2 bg-white/10 rounded hover:bg-white/20 text-white" onClick={() => setSelectedItem(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="mt-8 pt-4 border-t border-white/10 space-y-2">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-2">Hệ Thống</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => useGameStore.getState().saveGame()}
            className="flex-1 p-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 rounded text-xs text-emerald-200 font-bold transition-all"
          >
            💾 Lưu Game
          </button>
          <button 
            onClick={() => useGameStore.getState().loadGame()}
            className="flex-1 p-2 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-500/30 rounded text-xs text-amber-200 font-bold transition-all"
          >
            📂 Tải Game
          </button>
        </div>
        <button 
          onClick={() => {
            if (window.confirm("Bạn có chắc chắn muốn xóa dữ liệu và bắt đầu lại từ đầu?")) {
              useGameStore.getState().resetGame();
            }
          }}
          className="w-full p-2 bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 rounded text-xs text-red-200 font-bold transition-all"
        >
          🔄 Đặt Lại Trò Chơi
        </button>
      </div>
    </div>
  );
}
