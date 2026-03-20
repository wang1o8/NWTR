import React, { useState, useEffect } from 'react';
import { useGameStore } from '../engine/useGameStore';
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
  const { playerName, inventory, traits, stats, worldStats, currentWorldId, updateStats, removeItem, personality, weather, timeOfDay, setFlag, hasFlag, equippedWeapon, equipWeapon, getTotalStats, age } = useGameStore();
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
        <h3>Cơ bản</h3>
        <p>Máu: {stats.hp}/{totalStats.maxHp} {totalStats.maxHp !== stats.maxHp && <span className="text-xs text-red-400">({totalStats.maxHp - stats.maxHp})</span>}</p>
        <p>Năng lượng: {stats.mp}/{totalStats.maxMp}</p>
        <p>Mạng: {stats.lives}/{stats.maxLives}</p>
        <p>Cấp độ: {stats.level || 1} (XP: {stats.xp || 0})</p>
        <p>Tuổi: {age || 18}</p>
        <p>Thời tiết: <span className="capitalize">{weatherTranslations[weather] || weather}</span></p>
        <p>Thời gian: <span className="capitalize">{timeTranslations[timeOfDay] || timeOfDay}</span></p>
      </div>
      
      <div className="stats-section">
        <h3>Chỉ số</h3>
        <div className="attr-grid">
          <span>STR: {totalStats.str} {totalStats.str !== stats.str && <span className={`text-xs ${totalStats.str > stats.str ? 'text-green-400' : 'text-red-400'}`}>({totalStats.str > stats.str ? '+' : ''}{totalStats.str - stats.str})</span>}</span>
          <span>INT: {totalStats.int} {totalStats.int !== stats.int && <span className={`text-xs ${totalStats.int > stats.int ? 'text-green-400' : 'text-red-400'}`}>({totalStats.int > stats.int ? '+' : ''}{totalStats.int - stats.int})</span>}</span>
          <span>AGI: {totalStats.agi} {totalStats.agi !== stats.agi && <span className={`text-xs ${totalStats.agi > stats.agi ? 'text-green-400' : 'text-red-400'}`}>({totalStats.agi > stats.agi ? '+' : ''}{totalStats.agi - stats.agi})</span>}</span>
          <span>DEF: {totalStats.def} {totalStats.def !== stats.def && <span className={`text-xs ${totalStats.def > stats.def ? 'text-green-400' : 'text-red-400'}`}>({totalStats.def > stats.def ? '+' : ''}{totalStats.def - stats.def})</span>}</span>
          <span>RES: {totalStats.res} {totalStats.res !== stats.res && <span className={`text-xs ${totalStats.res > stats.res ? 'text-green-400' : 'text-red-400'}`}>({totalStats.res > stats.res ? '+' : ''}{totalStats.res - stats.res})</span>}</span>
          <span>LCK: {totalStats.lck} {totalStats.lck !== stats.lck && <span className={`text-xs ${totalStats.lck > stats.lck ? 'text-green-400' : 'text-red-400'}`}>({totalStats.lck > stats.lck ? '+' : ''}{totalStats.lck - stats.lck})</span>}</span>
          <span>DEX: {totalStats.dex}</span>
          <span>CHA: {totalStats.cha}</span>
          <span>CON: {totalStats.con}</span>
          <span>ARM: {totalStats.armor}</span>
          <span>WPN: {totalStats.weaponDice}</span>
        </div>
      </div>

      {traits && traits.length > 0 && (
        <div className="stats-section">
          <h3>Đặc điểm (Traits)</h3>
          <div className="flex flex-col gap-2">
            {traits.map((trait, idx) => (
              <div key={idx} className="p-2 bg-white/5 rounded border border-white/10 cursor-pointer hover:bg-white/10" onClick={() => setSelectedItem(trait)}>
                <p className="font-bold text-sm text-purple-300">{trait.name}</p>
                <p className="text-xs opacity-70 truncate">{trait.lore}</p>
              </div>
            ))}
          </div>
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
    </div>
  );
}
