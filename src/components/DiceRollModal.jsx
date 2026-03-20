import React, { useState, useEffect } from 'react';
import { useGameStore } from '../engine/useGameStore';
import { applySets } from '../engine/SceneManager';

export default function DiceRollModal({ rollConfig, onComplete, choiceSets }) {
  const { stats, setFlag, updateStats, addItem, updateWorldStats, currentWorldId } = useGameStore();
  const [rollResult, setRollResult] = useState(null);
  const [isRolling, setIsRolling] = useState(true);

  useEffect(() => {
    // Simulate dice roll animation
    const timer = setTimeout(() => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const statVal = stats[rollConfig.stat] || 10;
      
      // Base modifier from the stat
      const statModifier = Math.floor((statVal - 10) / 2);
      
      // LCK modifier: every 5 LCK = +1
      const lckVal = stats.lck || 1;
      const lckModifier = Math.floor(lckVal / 5);
      
      const totalModifier = statModifier + lckModifier;
      const total = d20 + totalModifier;
      
      const target = rollConfig.target || 11;
      
      let outcome = '';
      let success = false;
      
      if (d20 === 1) {
        outcome = 'THẤT BẠI THẢM HẠI';
        success = false;
      } else if (d20 === 20) {
        outcome = 'THÀNH CÔNG RỰC RỠ';
        success = true;
      } else if (total >= target) {
        if (total >= target + 5) {
          outcome = 'THÀNH CÔNG MỸ MÃN';
        } else {
          outcome = 'THÀNH CÔNG';
        }
        success = true;
      } else {
        if (total <= target - 5) {
          outcome = 'THẤT BẠI NẶNG NỀ';
        } else {
          outcome = 'THẤT BẠI';
        }
        success = false;
      }
      
      setRollResult({ d20, statModifier, lckModifier, totalModifier, total, success, outcome });
      setIsRolling(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [rollConfig, stats]);

  const handleContinue = () => {
    if (rollResult.success && choiceSets) {
      applySets(choiceSets, setFlag, updateStats, addItem, stats, updateWorldStats, currentWorldId);
    }
    const currentHp = useGameStore.getState().stats.hp;
    if (currentHp <= 0) {
      onComplete('game_over');
    } else {
      onComplete(rollResult.success ? rollConfig.successScene : rollConfig.failScene);
    }
  };

  useEffect(() => {
    if (!isRolling && rollResult) {
      // 10 second auto-resolve fallback
      const timeout = setTimeout(() => {
        handleContinue();
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isRolling, rollResult]);

  return (
    <div className="inventory-modal">
      <div className="inventory-content" style={{ height: 'auto', padding: '2rem', textAlign: 'center' }}>
        <h2>Kiểm tra {rollConfig.stat.toUpperCase()}</h2>
        <p>Mục tiêu: {rollConfig.target || 11}</p>
        
        <div className="dice-container">
          {isRolling ? (
            <div className="dice rolling">🎲</div>
          ) : (
            <div className={`dice-result ${rollResult.success ? 'success' : 'fail'}`}>
              <div className="dice-number">{rollResult.d20}</div>
              <p>Điểm cộng (Chỉ số): {rollResult.statModifier >= 0 ? '+' : ''}{rollResult.statModifier}</p>
              <p>Điểm cộng (May mắn): +{rollResult.lckModifier}</p>
              <h3>Tổng cộng: {rollResult.total}</h3>
              <h2 className={rollResult.success ? 'text-green-500' : 'text-red-500'}>
                {rollResult.outcome}
              </h2>
            </div>
          )}
        </div>
        
        {!isRolling && (
          <button className="choice-btn mt-4" onClick={handleContinue}>Tiếp tục</button>
        )}
      </div>
    </div>
  );
}
