import React, { useState } from 'react';
import { useGameStore } from '../engine/useGameStore';
import worldsData from '../data/worlds.json';
import locationData from '../data/world_locations.json';

export default function WorldMap({ onClose }) {
  const { currentWorldId, setScene } = useGameStore();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const world = worldsData[currentWorldId] || worldsData['tutorial'];
  const locations = locationData[currentWorldId] || [];

  const handleTravel = (loc) => {
    if (loc.scene) {
      setScene(loc.scene);
      onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'town': return '🏠';
      case 'boss': return '💀';
      case 'dungeon': return '🚪';
      case 'treasure': return '📦';
      default: return '📍';
    }
  };

  return (
    <div className="world-map-container">
      {/* 1. Map Area (70%) */}
      <div className="world-map-visual" style={{ backgroundImage: `url(${world.image})` }}>
        <div className="map-overlay"></div>
        <div className="map-content">
          {locations.map(loc => (
            <button
              key={loc.id}
              className={`map-node ${loc.type} ${selectedLocation?.id === loc.id ? 'active' : ''}`}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              onClick={() => setSelectedLocation(loc)}
              aria-label={loc.name}
            >
              <span className="node-icon">{getIcon(loc.type)}</span>
              <span className="node-label">{loc.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Side Action Panel (30%) */}
      <div className="world-map-side-panel glass">
        <div className="side-panel-header">
          <h3>{world.name}</h3>
          <p className="world-desc">{world.description}</p>
        </div>

        <div className="location-details-section">
          {selectedLocation ? (
            <div className="selected-info slideUp">
              <h4>{getIcon(selectedLocation.type)} {selectedLocation.name}</h4>
              <p>{selectedLocation.description}</p>
              <div className="loc-stats">
                <span>Cấp độ đề nghị: {selectedLocation.level}</span>
                <span className={`danger-tag ${selectedLocation.level > 10 ? 'high' : 'low'}`}>
                  {selectedLocation.level > 10 ? 'NGUY HIỂM' : 'AN TOÀN'}
                </span>
              </div>
              <button 
                className="btn-travel-action" 
                onClick={() => handleTravel(selectedLocation)}
              >
                DI CHUYỂN ĐẾN ĐÂY
              </button>
            </div>
          ) : (
            <div className="no-selection">
              <p>Chọn một địa điểm trên bản đồ để xem chi tiết.</p>
            </div>
          )}
        </div>

        <div className="panel-footer-actions">
           <button onClick={onClose} className="btn-secondary-outline">ĐÓNG </button>
        </div>
      </div>
    </div>
  );
}
