import React from 'react';
import characters from '../data/characters.json';
import { useGameStore } from '../engine/useGameStore';

export default function DialogBox({ speakerId, text }) {
  const { playerName } = useGameStore();
  
  let speaker = null;
  if (speakerId === 'player') {
    speaker = {
      name: playerName,
      color: '#4ade80', // A distinct color for the player
      image: null // Or a default player portrait
    };
  } else if (speakerId) {
    speaker = characters[speakerId];
  }
  
  return (
    <div className="dialog-box-container">
      {speaker && speaker.image && (
        <img src={speaker.image} alt={speaker.name} className="speaker-portrait" referrerPolicy="no-referrer" />
      )}
      <div className="dialog-box">
        {speaker && (
          <div className="speaker-name" style={{ color: speaker.color || '#fff' }}>
            {speaker.name}
          </div>
        )}
        <div className="dialog-text">
          {text}
        </div>
      </div>
    </div>
  );
}
