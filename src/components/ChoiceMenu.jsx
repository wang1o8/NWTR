import React, { useState, useEffect } from 'react';
import { useGameStore } from '../engine/useGameStore';
import { evaluateRequires, applySets } from '../engine/SceneManager';
import DiceRollModal from './DiceRollModal';

import uiConfig from '../data/base/ui_config.json';

export default function ChoiceMenu({ choices = [] }) {
  const { playerName, flags, stats, worldStats, setFlag, updateStats, addItem, setScene, updateWorldStats, currentWorldId } = useGameStore();
  const [pendingRoll, setPendingRoll] = useState(null);
  const [visibleChoices, setVisibleChoices] = useState([]);

  useEffect(() => {
    const { max_visible, sort_priority, icons } = uiConfig.choices;

    // Filter available choices
    const available = choices.filter(choice => 
      evaluateRequires(choice.requires, flags, stats, worldStats, currentWorldId)
    );
    
    // Sort by priority
    const sorted = [...available].sort((a, b) => {
      const aType = a.type || 'story';
      const bType = b.type || 'story';
      const aIndex = sort_priority.indexOf(aType);
      const bIndex = sort_priority.indexOf(bType);
      
      if (aIndex !== bIndex) {
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      }
      return choices.indexOf(a) - choices.indexOf(b);
    });
    
    // Pick up to max_visible
    setVisibleChoices(sorted.slice(0, max_visible));
  }, [choices, flags, stats, worldStats, currentWorldId]);

  const getIcon = (type) => {
    return uiConfig.choices.icons[type] || '🔹';
  };

  const handleChoice = (choice) => {
    if (choice.roll) {
      setPendingRoll(choice);
    } else {
      applySets(choice.sets, setFlag, updateStats, addItem, stats, updateWorldStats, currentWorldId);
      const currentHp = useGameStore.getState().stats.hp;
      if (currentHp <= 0) {
        setScene('game_over');
      } else if (choice.next) {
        setScene(choice.next);
      }
    }
  };

  if (pendingRoll) {
    return <DiceRollModal 
      rollConfig={pendingRoll.roll} 
      choiceSets={pendingRoll.sets}
      onComplete={(nextScene) => {
        setPendingRoll(null);
        setScene(nextScene);
      }} 
    />;
  }

  return (
    <div className="choice-menu">
      {visibleChoices.map((choice, idx) => (
        <button 
          key={idx} 
          className="choice-btn group"
          onClick={() => handleChoice(choice)}
        >
          <span className="mr-2 opacity-70 group-hover:opacity-100">{getIcon(choice.type)}</span>
          {choice.text.replace(/{playerName}/g, playerName)}
          {choice.roll && <span className="roll-hint"> (Kiểm tra {choice.roll.stat.toUpperCase()})</span>}
        </button>
      ))}
    </div>
  );
}
