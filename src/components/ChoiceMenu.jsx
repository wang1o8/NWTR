import React, { useState, useMemo } from 'react';
import DiceRollModal from './DiceRollModal';
import { SocialEngine } from '../engine/SocialEngine';
import { useGameStore } from '../engine/useGameStore';
import { AnimatePresence } from 'motion/react';

export default function ChoiceMenu({ choices }) {
  const { 
    setScene, 
    updateStats, 
    setFlag,
    traits, 
    conditionalTraits, 
    affection,
    flags,
    stats,
    getTotalStats,
    addToast,
    updateAffection,
    updateReputation,
    currentWorldId
  } = useGameStore();

  const [activeChoice, setActiveChoice] = useState(null);
  const [showDiceModal, setShowDiceModal] = useState(false);
  const [pendingChance, setPendingChance] = useState(0);

  const totalStats = getTotalStats();
  const lck = totalStats.lck || 0;
  const lckBonus = Math.floor(lck / 5) * 5;

  // Memoize base chances for consistency between re-renders
  const baseChances = useMemo(() => {
    return (choices || []).map(choice => choice.chance || (10 + Math.floor(Math.random() * 11)));
  }, [choices]);

  // Helper: Check if player meets choice requirements
  const meetsRequirements = (choice) => {
    if (!choice.requires) return true;
    
    // 1. Check trait requirements
    if (choice.requires.traits && choice.requires.traits.length > 0) {
      const playerTraits = traits
        .concat(conditionalTraits || [])
        .map(t => t.id);
      
      const hasAllTraits = choice.requires.traits.every(requiredTrait => 
        playerTraits.includes(requiredTrait)
      );
      if (!hasAllTraits) return false;
    }
    
    // 2. Check stat requirements
    if (choice.requires.stats) {
      for (const [stat, condition] of Object.entries(choice.requires.stats)) {
        const playerValue = totalStats[stat.toLowerCase()] || 0;
        let passes = false;
        
        if (typeof condition === 'number') {
          passes = playerValue >= condition;
        } else if (typeof condition === 'string') {
          const val = parseInt(condition.replace(/[>=<]/g, ''));
          if (condition.startsWith('>=')) passes = playerValue >= val;
          else if (condition.startsWith('<=')) passes = playerValue <= val;
          else if (condition.startsWith('>')) passes = playerValue > val;
          else if (condition.startsWith('<')) passes = playerValue < val;
        }
        if (!passes) return false;
      }
    }
    
    // 3. Check affection and flags (existing logic)
    if (choice.requires.affection) {
      for (const [charId, minVal] of Object.entries(choice.requires.affection)) {
        if ((affection[charId] || 0) < minVal) return false;
      }
    }
    if (choice.requires.flags && choice.requires.flags.length > 0) {
      if (!choice.requires.flags.every(f => flags.includes(f))) return false;
    }
    
    return true;
  };

  const handleChoiceClick = (choice, baseChance) => {
    if (!meetsRequirements(choice)) return;
    
    // Only show dice roll if requiresRoll is true in JSON
    if (choice.requiresRoll) {
      setActiveChoice(choice);
      setPendingChance(baseChance);
      setShowDiceModal(true);
    } else {
      // Automatic success for normal choices
      executeSuccess(choice);
    }
  };

  const finalizeChoice = (choice, isAutomaticSuccess = false) => {
    if (isAutomaticSuccess) {
      executeSuccess(choice);
      return;
    }
    
    // Handled by modal callback
  };

  const onDiceConfirm = (finalTotal) => {
    const roll = Math.floor(Math.random() * 100) + 1;
    const isSuccess = roll <= finalTotal;
    
    setShowDiceModal(false);
    
    if (isSuccess) {
      addToast({ type: 'success', message: 'Thành Công!', icon: '✨' });
      executeSuccess(activeChoice);
    } else {
      addToast({ type: 'fail', message: 'Thất Bại...', icon: '💀' });
      executeFailure(activeChoice);
    }
    
    setActiveChoice(null);
  };

  const executeSuccess = (choice) => {
    if (choice.sets?.stats) updateStats(choice.sets.stats);
    
    // Support both choice.sets.flags (legacy) and choice.sets_flags (new top-level)
    const flagsToSet = [...(choice.sets?.flags || []), ...(choice.sets_flags || [])];
    flagsToSet.forEach(f => setFlag(f));
    
    if (choice.sets?.affection) {
      Object.entries(choice.sets.affection).forEach(([npcId, delta]) => {
        updateAffection(currentWorldId, npcId, delta);
      });
    }
    if (choice.sets?.reputation) updateReputation(choice.sets.reputation);
    
    // Support choice.addItem and choice.sets.addItem
    if (choice.addItem) addItem(choice.addItem);
    if (choice.sets?.addItem) addItem(choice.sets.addItem);
    
    setScene(choice.next);
  };

  const executeFailure = (choice) => {
    if (choice.next_fail) {
      setScene(choice.next_fail);
    } else {
      // Fallback: continue but with penalty
      updateStats({ hp: -5 });
      setScene(choice.next);
    }
  };

  return (
    <div className="choice-menu">
      <AnimatePresence>
        {showDiceModal && activeChoice && (
          <DiceRollModal 
            baseChance={pendingChance}
            lck={lck}
            onConfirm={(finalChance) => onDiceConfirm(finalChance)}
            onCancel={() => { setShowDiceModal(false); setActiveChoice(null); }}
          />
        )}
      </AnimatePresence>

      {choices && choices.length > 0 ? (
        choices.map((choice, idx) => {
          const available = meetsRequirements(choice);
          const baseChance = baseChances[idx];
          const totalChancePreview = Math.min(95, baseChance + lckBonus);
          const isCheck = choice.requiresRoll; // Only if requiresRoll: true

          return (
            <button
              key={idx}
              className={`choice-button relative group ${available ? '' : 'disabled'}`}
              onClick={() => handleChoiceClick(choice, baseChance)}
              disabled={!available}
            >
              <div className="flex flex-col items-start w-full">
                <span className="font-bold">{choice.text}</span>
                {!available ? (
                   <span className="text-[9px] opacity-40 uppercase font-black tracking-tight">Cần thiết: {JSON.stringify(choice.requires)}</span>
                ) : isCheck ? (
                   <div className="flex items-center gap-1 mt-1">
                     <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/30 uppercase font-black">
                       Khả năng: {totalChancePreview}%
                     </span>
                     {choice.statLabel && (
                       <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase font-black">
                         {choice.statLabel}
                       </span>
                     )}
                   </div>
                ) : choice.statLabel ? (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase font-black">
                      {choice.statLabel}
                    </span>
                  </div>
                ) : null}
              </div>
            </button>
          );
        })
      ) : (
        <div className="no-choices">Không có lựa chọn nào.</div>
      )}
    </div>
  );
}
