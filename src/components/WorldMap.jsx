import React from 'react';

export default function WorldMap({ onClose }) {
  return (
    <div className="inventory-modal">
      <div className="inventory-content">
        <div className="modal-header">
          <h2>Bản đồ Thế giới</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="item-list">
          <p>Bản đồ hiện không khả dụng trong cõi này.</p>
        </div>
      </div>
    </div>
  );
}
