import React, { useState, useEffect } from 'react';
import { useGameStore } from '../engine/useGameStore';
import { calculateDamage } from '../engine/BattleEngine';
import { RandomEngine } from '../engine/RandomEngine';
import monstersData from '../data/monsters.json';
import combatConfig from '../data/combat_config.json';
import rarities from '../data/base/rarities.json';
import ItemCard from './ItemCard';

const statusNames = {
  acid: 'Axit',
  poison: 'Trúng Độc',
  burn: 'Bỏng',
  disease: 'Bệnh Tật',
  curse: 'Nguyền Rủa'
};

export default function BattleScreen({ battleConfig }) {
  const { stats, updateStats, endBattle, setScene, playerName, currentMonster, equippedWeapon, traits, getTotalStats } = useGameStore();
  
  const isGenerated = typeof currentMonster === 'object' && currentMonster !== null;
  const monsterTemplate = isGenerated ? {
    ...currentMonster,
    hp: currentMonster.stats?.maxHp || 100,
    image: null,
    effect: null
  } : (monstersData[battleConfig.monsterId] || monstersData['slime']);
  
  // Calculate total player stats including weapon and traits
  const totalStats = getTotalStats();

  const [monsterHp, setMonsterHp] = useState(monsterTemplate.hp);
  const [log, setLog] = useState([`Một con ${monsterTemplate.name} hoang dã xuất hiện!`]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerStatus, setPlayerStatus] = useState([]);
  const [showSkills, setShowSkills] = useState(false);
  
  const addLog = (msg) => setLog(prev => [...prev, msg]);

  const handlePlayerAction = (type = 'physical', skill = null) => {
    if (!isPlayerTurn) return;
    
    if (skill) {
      if (stats.mp < skill.mpCost) {
        addLog("Không đủ MP!");
        return;
      }
      updateStats({ mp: stats.mp - skill.mpCost });
    }

    setIsPlayerTurn(false);
    setShowSkills(false);

    // Player Attack
    const result = calculateDamage(totalStats, monsterTemplate, type, skill?.element);
    
    if (result.isDodge) {
      addLog(`${monsterTemplate.name} đã né được đòn tấn công!`);
    } else {
      const newMonsterHp = Math.max(0, monsterHp - result.damage);
      setMonsterHp(newMonsterHp);
      let msg = `Bạn ${skill ? `dùng ${skill.name}` : 'tấn công'}! `;
      if (result.isCrit) msg += "CHÍ MẠNG! ";
      msg += `Gây ${result.damage} sát thương.`;
      addLog(msg);
      
      if (newMonsterHp <= 0) {
        addLog(`Bạn đã đánh bại ${monsterTemplate.name}!`);
        
        // Handle drops
        if (isGenerated && monsterTemplate.dropTable) {
          let roll = Math.random();
          let cumulative = 0;
          let droppedRarityId = null;
          
          for (const [rId, chance] of Object.entries(monsterTemplate.dropTable)) {
            cumulative += chance;
            if (roll <= cumulative) {
              droppedRarityId = rId;
              break;
            }
          }
          
          if (droppedRarityId && droppedRarityId !== 'nothing') {
            const forcedRarity = rarities.find(r => r.id.toLowerCase() === droppedRarityId.toLowerCase());
            const weapon = RandomEngine.generateWeapon(useGameStore.getState().currentWorldId, stats.lck, forcedRarity);
            useGameStore.getState().addItem(weapon);
            addLog(`Nhận được: ${weapon.name} (${weapon.rarity})!`);
          }
        }
        return;
      }
    }
    
    // Monster Turn
    setTimeout(() => {
      let currentHp = stats.hp;
      
      // Apply status effects
      if (playerStatus.includes('acid')) {
        currentHp -= 2;
        addLog(`Axit ăn mòn bạn, mất 2 máu.`);
      }
      if (playerStatus.includes('poison')) {
        currentHp -= 3;
        addLog(`Chất độc ngấm vào máu, mất 3 máu.`);
      }
      if (playerStatus.includes('burn')) {
        currentHp -= 4;
        addLog(`Bạn bị bỏng, mất 4 máu.`);
      }
      if (playerStatus.includes('disease')) {
        currentHp -= 1;
        addLog(`Bệnh tật làm bạn suy yếu, mất 1 máu.`);
      }
      if (playerStatus.includes('curse')) {
        currentHp -= 5;
        addLog(`Lời nguyền rút cạn sinh lực, mất 5 máu.`);
      }

      if (playerStatus.length > 0) {
        updateStats({ hp: currentHp });
        const updatedStats = useGameStore.getState().stats;
        if (updatedStats.hp <= 0) {
          handleDefeat();
          return;
        }
      }

      const mAtk = calculateDamage(monsterTemplate, totalStats, 'physical');
      
      if (mAtk.isDodge) {
        addLog(`Bạn đã né được đòn tấn công của ${monsterTemplate.name}!`);
      } else {
        const damageTaken = mAtk.damage;
        addLog(`${monsterTemplate.name} tấn công! ${mAtk.isCrit ? 'CHÍ MẠNG! ' : ''}Gây ${damageTaken} sát thương lên bạn.`);
        updateStats({ hp: stats.hp - damageTaken });
        
        const updatedStats = useGameStore.getState().stats;
        if (updatedStats.hp <= 0) {
          handleDefeat();
          return;
        }
      }
      
      if (monsterTemplate.effect && !playerStatus.includes(monsterTemplate.effect)) {
        if (Math.random() > 0.5) {
           setPlayerStatus(prev => [...prev, monsterTemplate.effect]);
           addLog(`Bạn bị nhiễm trạng thái: ${statusNames[monsterTemplate.effect] || monsterTemplate.effect}!`);
        }
      }
      
      setIsPlayerTurn(true);
    }, 1000);
  };

  const handleDefeat = () => {
    addLog(`Bạn đã bị đánh bại...`);
  };

  const handleEndBattle = () => {
    endBattle();
    const currentHp = useGameStore.getState().stats.hp;
    if (currentHp <= 0) {
      setScene('game_over');
    } else if (monsterHp <= 0) {
      setScene(battleConfig.winScene);
    } else {
      setScene(battleConfig.loseScene);
    }
  };

  const availableSkills = (combatConfig.skills?.player || []).filter(s => {
    return (stats.skills || []).includes(s.id);
  });

  return (
    <div className="battle-screen bg-neutral-900 text-white min-h-screen p-4 flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        {/* Monster Side */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/10">
          {isGenerated ? (
            <div className="mb-4 transform scale-75 origin-center">
              <ItemCard item={monsterTemplate} />
            </div>
          ) : (
            <img src={monsterTemplate.image} alt={monsterTemplate.name} className="w-32 h-32 md:w-64 md:h-64 object-contain mb-4 drop-shadow-2xl" referrerPolicy="no-referrer" />
          )}
          {!isGenerated && <h3 className="text-xl md:text-2xl font-bold text-red-400">{monsterTemplate.name}</h3>}
          <div className="w-full max-w-xs mt-2">
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-white/20">
              <div 
                className="h-full bg-red-600 transition-all duration-500" 
                style={{ width: `${(monsterHp / monsterTemplate.hp) * 100}%` }}
              />
            </div>
            <p className="text-center text-sm mt-1">{monsterHp} / {monsterTemplate.hp}</p>
          </div>
        </div>

        {/* Player Side */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/10">
          <div className="w-32 h-32 md:w-64 md:h-64 flex items-center justify-center bg-indigo-900/20 rounded-full border-4 border-indigo-500/30 mb-4">
             <span className="text-4xl md:text-6xl text-indigo-400 font-bold">{playerName?.[0] || 'P'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-indigo-400">{playerName || 'Bạn'}</h3>
          
          <div className="w-full max-w-xs mt-2 space-y-2">
            {/* HP Bar */}
            <div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-white/20">
                <div 
                  className="h-full bg-emerald-600 transition-all duration-500" 
                  style={{ width: `${(stats.hp / totalStats.maxHp) * 100}%` }}
                />
              </div>
              <p className="text-center text-sm mt-1">HP: {stats.hp} / {totalStats.maxHp}</p>
            </div>
            
            {/* MP Bar */}
            <div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-white/20">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500" 
                  style={{ width: `${(stats.mp / totalStats.maxMp) * 100}%` }}
                />
              </div>
              <p className="text-center text-sm mt-1">MP: {stats.mp} / {totalStats.maxMp}</p>
            </div>

            {playerStatus.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {playerStatus.map(s => (
                  <span key={s} className="px-2 py-0.5 bg-red-900/50 text-red-200 text-xs rounded border border-red-500/30 uppercase">
                    {statusNames[s] || s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Battle Log */}
      <div className="h-32 bg-black/60 rounded-xl border border-white/10 p-3 my-4 overflow-y-auto font-mono text-sm">
        {log.map((msg, i) => (
          <p key={i} className={msg.includes('Bạn') ? 'text-indigo-300' : msg.includes(monsterTemplate.name) ? 'text-red-300' : 'text-gray-400'}>
            {`> ${msg}`}
          </p>
        ))}
      </div>
      
      {/* Actions */}
      <div className="min-h-24 py-4 flex items-center justify-center gap-4">
        {monsterHp <= 0 || stats.hp <= 0 ? (
          <button 
            onClick={handleEndBattle} 
            className="px-8 md:px-12 py-3 md:py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-lg md:text-xl transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Tiếp tục
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
            {!showSkills ? (
              <>
                <button 
                  onClick={() => handlePlayerAction('physical')} 
                  disabled={!isPlayerTurn}
                  className="flex-1 px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
                >
                  Tấn công
                </button>
                <button 
                  onClick={() => setShowSkills(true)} 
                  disabled={!isPlayerTurn || availableSkills.length === 0}
                  className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all"
                >
                  Kỹ năng
                </button>
              </>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center w-full">
                {availableSkills.map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => handlePlayerAction(skill.type, skill)}
                    className="px-3 py-2 bg-indigo-800 hover:bg-indigo-700 text-white text-xs md:text-sm font-bold rounded-lg border border-indigo-500/30"
                    title={`${skill.description} (MP: ${skill.mpCost})`}
                  >
                    {skill.name} ({skill.mpCost})
                  </button>
                ))}
                <button 
                  onClick={() => setShowSkills(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded-lg w-full sm:w-auto"
                >
                  Quay lại
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

