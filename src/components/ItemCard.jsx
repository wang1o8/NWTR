import React from 'react';
import visualConfig from '../data/base/visual_config.json';
import rarities from '../data/base/rarities.json';

const statNames = {
  str: 'Sức mạnh',
  int: 'Trí tuệ',
  agi: 'Nhanh nhẹn',
  def: 'Phòng thủ',
  res: 'Kháng phép',
  lck: 'May mắn',
  hp: 'HP',
  maxHp: 'HP Tối đa',
  mp: 'MP',
  maxMp: 'MP Tối đa',
  weaponDice: 'Xúc xắc vũ khí',
  armor: 'Giáp',
  con: 'Thể chất',
  cha: 'Sức hút',
  dex: 'Khéo léo'
};

export default function ItemCard({ item }) {
  if (!item || !item.rarityData) return null;

  const { rarityData, name, stats, effect, icon, specialEffect } = item;
  
  const getStatIcon = (statName) => visualConfig.icons.stats[statName] || '✨';
  
  return (
    <div className={`rounded-[2.5rem] p-8 bg-gradient-to-br ${rarityData.bg} border border-white/10 text-white shadow-lg`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <span>{icon}</span> {name}
        </h3>
        <div className="flex flex-col items-end">
          <span className="text-[9px] px-3 py-1 rounded-full bg-white/5 font-bold tracking-wider">
            {rarityData.name}
          </span>
          <span className="text-xs mt-1 opacity-50 tracking-widest">
            {rarityData.dots}
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-6">
        {Object.entries(stats || effect || {}).map(([statName, value]) => {
          const isNegative = value < 0;
          const isSpecial27 = Math.abs(value) === 27;
          
          let statClass = "text-white";
          let rowClass = "bg-white/[0.03]";
          let displayValue = value > 0 ? `+${value}` : value;
          let suffix = "";

          if (isNegative) {
            statClass = "text-red-400";
            rowClass = "bg-red-500/5 border border-red-500/10";
          }
          
          if (isSpecial27) {
            statClass = "text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]";
            suffix = " ✦";
          }

          return (
            <div key={statName} className={`flex justify-between p-3 rounded-2xl ${rowClass}`}>
              <span className="font-medium flex items-center gap-2 opacity-80">
                {getStatIcon(statName)} {statNames[statName] || statName.toUpperCase()}
              </span>
              <span className={`font-bold font-mono ${statClass}`}>
                {displayValue}{suffix}
              </span>
            </div>
          );
        })}
      </div>

      {specialEffect && (
        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm font-medium text-purple-300 flex items-center gap-2">
            <span className="text-lg">✨</span> Hiệu ứng đặc biệt:
          </p>
          <p className="text-xs opacity-80 mt-1 font-mono">{specialEffect}</p>
        </div>
      )}

      {item.lore && (
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs italic opacity-60">"{item.lore}"</p>
        </div>
      )}

      {Object.values(stats || effect || {}).some(v => Math.abs(v) === 27) && (
        <div className="mt-4 p-3 rounded-xl bg-purple-900/30 border border-purple-500/30">
          <p className="text-xs italic text-purple-300 font-bold text-center">"Nó đang theo dõi."</p>
        </div>
      )}
    </div>
  );
}
