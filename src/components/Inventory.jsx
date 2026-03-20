import React from 'react';
import { useGameStore } from '../engine/useGameStore';
import itemsData from '../data/items.json';

export default function Inventory({ onClose }) {
  const { playerName, inventory, stats, worldStats, currentWorldId, updateStats, removeItem } = useGameStore();
  
  const handleUseItem = (itemId) => {
    const item = typeof itemId === 'string' ? itemsData[itemId] : itemId;
    if (item && item.type === 'consumable' && item.effect) {
      if (item.effect.hp) {
        updateStats({ hp: Math.min(stats.maxHp, stats.hp + item.effect.hp) });
      }
      removeItem(itemId);
    }
  };

  const currentWorldStat = worldStats[currentWorldId];

  return (
    <div className="inventory-modal">
      <div className="inventory-content">
        <div className="modal-header">
          <h2>Trạng thái của {playerName}</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        
        <div className="stats-grid">
          <div className="stat-box">
            <h3>Cơ bản</h3>
            <p>HP: {stats.hp}/{stats.maxHp}</p>
            <p>Vàng: {stats.gold}</p>
            <p>Giáp: {stats.armor}</p>
            <p>Vũ khí: d{stats.weaponDice}</p>
          </div>
          <div className="stat-box">
            <h3>Chỉ số</h3>
            <p>Sức mạnh (STR): {stats.str}</p>
            <p>Nhanh nhẹn (AGI): {stats.agi}</p>
            <p>Trí tuệ (INT): {stats.int}</p>
            <p>Thể chất (CON): {stats.con}</p>
            <p>May mắn (LCK): {stats.lck}</p>
            <p>Phòng thủ (DEF): {stats.def}</p>
            <p>Kháng phép (RES): {stats.res}</p>
          </div>
          {currentWorldStat && (
            <div className="stat-box">
              <h3>Thế giới hiện tại</h3>
              {Object.entries(currentWorldStat).map(([key, val]) => (
                <p key={key}>{key.toUpperCase()}: {val}</p>
              ))}
            </div>
          )}
        </div>
        
        <div className="item-list">
          <h3>Hành trang</h3>
          {inventory.length === 0 ? <p>Hành trang trống.</p> : null}
          {inventory.map((itemId, idx) => {
            const item = typeof itemId === 'string' ? itemsData[itemId] : itemId;
            return (
              <div key={idx} className="item-row">
                <span>{item ? item.name : itemId}</span>
                {item && item.type === 'consumable' && (
                  <button onClick={() => handleUseItem(itemId)}>Dùng</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
