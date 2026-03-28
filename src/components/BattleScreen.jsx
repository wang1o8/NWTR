import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../engine/useGameStore';
import { calculateDamage, rollInitiative, rollDice } from '../engine/BattleEngine';
import { RandomEngine } from '../engine/RandomEngine';
import { getScene } from '../engine/SceneManager';
import monstersData from '../data/monsters.json';
import combatConfig from '../data/combat_config.json';
import { motion, AnimatePresence } from 'motion/react';

const HPBar = ({ current, max, label, type = 'hp' }) => {
  const percent = Math.max(0, Math.min(100, (current / max) * 100));
  let color = type === 'hp' ? 'bg-emerald-500' : 'bg-blue-500';
  if (type === 'hp') {
    if (percent < 30) color = 'bg-red-500';
    else if (percent < 60) color = 'bg-yellow-500';
  }
  return (
    <div className="w-full mb-1">
      <div className="flex justify-between items-end mb-0.5">
        <span className="text-[7px] font-black uppercase text-white/40">{label}</span>
        <span className="text-[9px] font-mono font-bold text-white/80">{Math.ceil(current)}</span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
        <motion.div className={`h-full ${color}`} animate={{ width: `${percent}%` }} transition={{ duration: 0.3 }} />
      </div>
    </div>
  );
};

// Simplified Victory Overlay
const VictoryScreen = ({ exp, gold, items = [], materials = [], onContinue }) => (
  <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-xl pointer-events-auto">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border-2 border-amber-500/50 rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
      <h2 className="text-3xl font-black text-amber-500 mb-2 uppercase italic">CHIẾN THẮNG!</h2>
      <div className="text-gray-400 font-bold mb-6 space-y-1">
        <p className="text-amber-400">+{exp} EXP</p>
        <p className="text-yellow-400">+{gold} Vàng</p>
        {items.length > 0 && items.map((it, i) => (
            <p key={i} className="text-blue-400 text-[10px] break-words">Nhận: {it.name}</p>
        ))}
        {materials.length > 0 && materials.map((m, i) => (
            <p key={i} className="text-emerald-400 text-[10px]">Nhận: {m}</p>
        ))}
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onContinue(); }} 
        className="w-full py-4 bg-amber-500 text-black font-black rounded-xl text-lg uppercase italic active:scale-95 transition-transform"
      >
        Tiếp tục
      </button>
    </motion.div>
  </div>
);

const DefeatScreen = ({ onRetry, onFlee }) => (
  <div className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-6 backdrop-blur-xl pointer-events-auto">
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border-2 border-red-500/50 rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
      <h2 className="text-3xl font-black text-red-500 mb-2 uppercase italic">BẠI TRẬN...</h2>
      <p className="text-red-400 text-[10px] uppercase font-bold mb-6 italic">Mất 50% vàng và 1 vật phẩm!</p>
      <div className="space-y-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onRetry(); }} 
          className="w-full py-3 bg-white/10 text-white font-black rounded-xl text-md uppercase italic border border-white/10 active:scale-95 transition-transform"
        >
          Thử lại
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onFlee(); }} 
          className="w-full py-4 bg-red-600 text-white font-black rounded-xl text-lg uppercase italic active:scale-95 transition-transform"
        >
          Rút lui
        </button>
      </div>
    </motion.div>
  </div>
);


// ... rest of component logic ...

export default function BattleScreen() {
  const { 
    stats, updateStats, endBattle, setScene, playerName, currentMonster, 
    getTotalStats, currentSceneId, currentWorldId, inventory, npcs 
  } = useGameStore();

  const totalStats = getTotalStats();
  console.log("PLAYER HP", stats.hp, totalStats.maxHp);
  const scene = getScene(currentSceneId, currentWorldId);
  const battleConfig = scene?.battle;
  const isGenerated = typeof currentMonster === 'object' && currentMonster !== null;
  const monsterTemplate = isGenerated ? {
    ...currentMonster,
    hp: currentMonster.stats?.maxHp || 100,
    maxHp: currentMonster.stats?.maxHp || 100,
  } : (monstersData[battleConfig?.monsterId] || monstersData['slime']);

  const [monsterHp, setMonsterHp] = useState(monsterTemplate.hp || 100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [enemyIsDefending, setEnemyIsDefending] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [victoryData, setVictoryData] = useState({ exp: 0, gold: 0, items: [], materials: [] });
  const [showSkills, setShowSkills] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showEnemyStats, setShowEnemyStats] = useState(false);
  const [activeCompanion, setActiveCompanion] = useState(null);
  const [companionShake, setCompanionShake] = useState(0);
  const [enemyShake, setEnemyShake] = useState(0);
  const [playerShake, setPlayerShake] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const logEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    
    // Init Initiative
    const playerInit = rollInitiative(totalStats);
    const monsterInit = rollInitiative(monsterTemplate);
    const playerFirst = playerInit >= monsterInit;
    
    setBattleLog([
      `Đụng độ: ${monsterTemplate.name}!`,
      `Sáng kiến: Bạn(${playerInit}) vs ${monsterTemplate.name}(${monsterInit})`,
      playerFirst ? "Bạn ra đòn trước!" : `${monsterTemplate.name} ra đòn trước!`
    ]);
    
    setIsPlayerTurn(playerFirst);
    
    // Check for active companion
    const companions = (npcs[currentWorldId] || []).filter(n => n.type === 'companion' && (n.isRecruited || n.affection > 60));
    if (companions.length > 0) {
      setActiveCompanion(companions[0]);
    }

    if (!playerFirst) {
        setTimeout(() => executeMonsterTurn(), 1000);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const addLog = (msg) => {
    setBattleLog(prev => [...prev, msg].slice(-20));
  };

  const executeMonsterTurn = () => {
    if (monsterHp <= 0) return;
    setIsAnimating(true);
    
    // Simple Enemy AI
    const actionRoll = Math.random();
    let action = 'attack';
    if (monsterHp < monsterTemplate.maxHp * 0.3 && actionRoll < 0.3) action = 'defend';
    
    setTimeout(() => {
      if (action === 'defend') {
        setEnemyIsDefending(true);
        addLog(`${monsterTemplate.name} đang ở tư thế phòng thủ!`);
        setIsPlayerTurn(true);
      } else {
        const result = calculateDamage(monsterTemplate, totalStats, 'physical', { isDefending });
        setPlayerShake(prev => prev + 1);
        let damage = result.damage;
        
        // Tutorial safety
        const currentHp = stats.hp || 0;
        if (currentWorldId === 'tutorial' && currentHp - damage < 1) damage = Math.max(0, currentHp - 1);
        
        updateStats({ hp: currentHp - damage });
        addLog(`${monsterTemplate.name} tấn công! (Đổ 1d${result.diceSize}: ${result.roll}) Gây ${damage} sát thương. ${result.msg}`);
        
        setIsDefending(false); // Reset player defense
        if (useGameStore.getState().stats.hp <= 0) {
          handleDefeat();
        } else {
          setIsPlayerTurn(true);
        }
      }
      setIsAnimating(false);
    }, 700);
  };

  const executeCompanionTurn = (currentMhp) => {
    if (!activeCompanion || currentMhp <= 0) return currentMhp;
    
    const baseAtk = activeCompanion.combatStats?.baseAtk || 15;
    const affectionBonus = Math.floor(activeCompanion.affection / 10);
    const damage = baseAtk + affectionBonus;
    
    addLog(`${activeCompanion.name} hỗ trợ! Dùng ${activeCompanion.combatStats?.skill || 'Tấn Công'} gây ${damage} sát thương.`);
    setCompanionShake(prev => prev + 1);
    setEnemyShake(prev => prev + 1);
    
    return Math.max(0, currentMhp - damage);
  };

  const handleAttack = () => {
    if (!isPlayerTurn || isAnimating) return;
    setIsPlayerTurn(false);
    setIsAnimating(true);
    
    const result = calculateDamage(totalStats, monsterTemplate, 'physical', { isDefending: enemyIsDefending });
    
    if (result.isDodge) {
      addLog(`${monsterTemplate.name} đã né đòn!`);
    } else {
      setEnemyShake(prev => prev + 1);
      let newMonsterHp = Math.max(0, monsterHp - result.damage);
      
      // Companion Follow-up
      if (activeCompanion && newMonsterHp > 0) {
        newMonsterHp = executeCompanionTurn(newMonsterHp);
      }
      
      setMonsterHp(newMonsterHp);
      addLog(`Bạn tấn công! (Đổ 1d${result.diceSize}: ${result.roll}) Gây ${result.damage} sát thương. ${result.msg}`);
      
      setEnemyIsDefending(false); // Reset enemy defense
      if (newMonsterHp <= 0) {
        handleVictory();
        setIsAnimating(false);
        return;
      }
    }
    setIsAnimating(false);
    setTimeout(() => executeMonsterTurn(), 700);
  };

  const handleDefend = () => {
    if (!isPlayerTurn || isAnimating) return;
    setIsDefending(true);
    setIsPlayerTurn(false);
    addLog("Bạn vào tư thế phòng thủ! Giảm 50% sát thương lượt tới.");
    setTimeout(() => executeMonsterTurn(), 700);
  };

  const handleSkillAction = (skill) => {
    if (stats.mp < (skill.mpCost || 0)) { addLog("Không đủ MP!"); setShowSkills(false); return; }
    setShowSkills(false); setIsPlayerTurn(false); setIsAnimating(true);
    updateStats({ mp: stats.mp - (skill.mpCost || 0) });
    
    const result = calculateDamage(totalStats, monsterTemplate, skill.type || 'magic', { 
        element: skill.element, 
        isDefending: enemyIsDefending,
        skillMultiplier: skill.multiplier || 1.5
    });
    
    if (result.isDodge) {
      addLog(`${monsterTemplate.name} né được ${skill.name}!`);
    } else {
      setEnemyShake(prev => prev + 1);
      const newMonsterHp = Math.max(0, monsterHp - result.damage);
      setMonsterHp(newMonsterHp);
      addLog(`Bạn dùng ${skill.name}! (Đổ 1d${result.diceSize}: ${result.roll}) Gây ${result.damage} sát thương.`);
      
      setEnemyIsDefending(false);
      if (newMonsterHp <= 0) { handleVictory(); setIsAnimating(false); return; }
    }
    setIsAnimating(false);
    setTimeout(() => executeMonsterTurn(), 700);
  };

  const handleItemUse = (item) => {
    setShowItems(false); setIsPlayerTurn(false); setIsAnimating(true);
    const healed = Math.min(totalStats.maxHp - stats.hp, item.healing || 50);
    updateStats({ hp: stats.hp + healed });
    addLog(`Dùng ${item.name}! Hồi ${healed} HP.`);
    useGameStore.getState().removeItem(item.id || item);
    setIsAnimating(false);
    setTimeout(() => executeMonsterTurn(), 700);
  };

  const handleRun = () => {
    if (monsterTemplate.is_boss) { addLog("Boss không cho chạy!"); return; }
    setIsPlayerTurn(false); setIsAnimating(true);
    
    const fleeRoll = rollDice(20);
    const playerBonus = Math.floor((totalStats.dex || 10) / 4);
    const monsterBonus = Math.floor((monsterTemplate.stats?.dex || 10) / 4);
    
    addLog(`Bạn cố chạy thoát! (Đổ 1d20: ${fleeRoll} + ${playerBonus}) vs ${monsterTemplate.name}(${monsterBonus})`);
    
    if (fleeRoll + playerBonus >= 10 + monsterBonus) {
      addLog("Chạy thoát thành công!");
      setTimeout(() => { endBattle(); setScene(battleConfig?.loseScene || 'start'); }, 800);
    } else {
      addLog("Bỏ chạy thất bại!");
      setIsAnimating(false);
      setTimeout(() => executeMonsterTurn(), 700);
    }
  };

  const handleVictory = () => {
    const exp = monsterTemplate.xp || 50;
    const loot = RandomEngine.rollLoot(monsterTemplate, totalStats.lck || 5);
    
    updateStats({ xp: stats.xp + exp, gold: stats.gold + loot.gold });
    
    // Add items to inventory
    loot.items.forEach(item => useGameStore.getState().addItem(item));
    
    setVictoryData({ 
        exp, 
        gold: loot.gold, 
        items: loot.items, 
        materials: loot.materials 
    });
    setBattleResult('win');
  };

  const handleDefeat = () => {
    // Penalties: -50% gold, lose 1 item, -10 sanity, -5 rep
    const goldLoss = Math.floor(stats.gold * 0.5);
    const sanityLoss = 10;
    const repLoss = 5;
    
    // Lose random item
    let lostItemName = "Không";
    if (inventory.length > 0) {
        const idx = Math.floor(Math.random() * inventory.length);
        const item = inventory[idx];
        lostItemName = item.name || "Vật phẩm lạ";
        useGameStore.getState().removeItem(item.id || item);
    }

    updateStats({ 
        gold: stats.gold - goldLoss, 
        sanity: stats.sanity - sanityLoss,
        rep: stats.rep - repLoss,
        hp: 1 // Survive with 1 HP
    });

    addLog(`BẠI TRẬN! Mất ${goldLoss} vàng, ${lostItemName}, ${sanityLoss} Sanity.`);
    setBattleResult('lose');
  };

  // ROBUST CONTINUE LOGIC
  const handleContinue = () => {
    const targetScene = battleConfig?.winScene || 'start';
    console.log(`[Battle] VICTORY! Navigating to: "${targetScene}"`);
    endBattle(); 
    setScene(targetScene); 
  };

  const handleRetry = () => { 
    console.log("[Battle] Retrying battle...");
    setMonsterHp(monsterTemplate.maxHp); 
    updateStats({ hp: totalStats.maxHp }); 
    setBattleResult(null); 
    setIsPlayerTurn(true); 
    setBattleLog([`Thử lại! Một con ${monsterTemplate.name} chặn đường!`, "Đến lượt của bạn!"]);
  };

  const handleFleeAfterDefeat = () => { 
    const targetScene = battleConfig?.loseScene || 'start';
    console.log(`[Battle] DEFEAT! Navigating to: "${targetScene}"`);
    endBattle(); 
    updateStats({ hp: 1 }); // Set HP to 1 as requested
    setScene(targetScene); 
  };

  const availableSkills = (combatConfig.skills?.player || []).filter(s => (stats.skills || []).includes(s.id));
  const consumables = inventory.filter(i => i.type === 'consumable' || i.type === 'potion');

  const btnClass = "w-full h-[40px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[10px] font-black uppercase italic tracking-tighter transition-all active:scale-95 disabled:opacity-20 px-2 text-center leading-none pointer-events-auto z-10";

  return (
    <div className="battle-container fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-[40] p-4 pointer-events-none">
      <div className="battle-box relative bg-neutral-900 border-2 border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto max-w-fit animate-in zoom-in-95 duration-200">
        
        {/* Battle Content Area */}
        <div className="flex bg-gradient-to-b from-black to-slate-900/50">
          
          {/* Left Column (Entities) */}
          <div className="w-[110px] border-r border-white/10 flex flex-col p-2 space-y-2 items-center justify-center">
            
            {/* Enemy Card */}
            <div 
              onClick={() => setShowEnemyStats(!showEnemyStats)}
              className="w-full h-[120px] max-h-[150px] flex flex-col items-center justify-center p-2 rounded-xl bg-red-950/10 border border-red-500/10 relative overflow-visible cursor-help"
            >
              <AnimatePresence>
                {showEnemyStats && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute -top-10 left-0 right-0 bg-black/95 border border-red-500/40 rounded-lg p-1 z-[110] shadow-xl">
                    <div className="grid grid-cols-3 gap-0.5 text-[6px] font-mono text-gray-400 text-center uppercase leading-none">
                      <div>A:{monsterTemplate.stats?.attack || 10}</div>
                      <div>D:{monsterTemplate.stats?.defense || 5}</div>
                      <div>S:{monsterTemplate.stats?.speed || 10}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div key={enemyShake} animate={enemyShake ? { x: [-2, 2, -2, 0] } : {}} className="text-3xl mb-1 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
                {monsterTemplate.icon || '👻'}
              </motion.div>
              <div className="w-full text-center">
                <div className="text-[8px] font-black uppercase text-red-500 truncate mb-1">{monsterTemplate.name}</div>
                <HPBar current={monsterHp} max={monsterTemplate.maxHp} label="HP" type="hp" />
              </div>
            </div>

            {/* Player Card */}
            <div className="w-full h-[120px] max-h-[150px] flex flex-col items-center justify-center p-2 rounded-xl bg-blue-950/10 border border-blue-500/10 relative overflow-hidden">
              <div className="text-xl mb-1 opacity-40 font-black text-blue-400 italic tracking-tighter">HERO</div>
              <div className="w-full text-center">
                <div className="text-[8px] font-black uppercase text-blue-400 truncate mb-1">{playerName || 'Hero'}</div>
                <HPBar current={stats.hp} max={totalStats.maxHp} label="HP" type="hp" />
                <HPBar current={stats.mp} max={totalStats.maxMp} label="MP" type="mp" />
              </div>
            </div>

            {/* Companion Card */}
            {activeCompanion && (
              <div className="w-full h-[80px] flex flex-col items-center justify-center p-2 rounded-xl bg-pink-950/10 border border-pink-500/10 animate-in slide-in-from-left duration-500">
                <motion.div animate={companionShake ? { y: [-2, 2, -2, 0] } : {}} className="text-xl mb-1">
                  {activeCompanion.icon || '🧙‍♀️'}
                </motion.div>
                <div className="text-[7px] font-black uppercase text-pink-400 truncate">{activeCompanion.name}</div>
                <div className="text-[6px] text-pink-300/50 uppercase font-bold">Trình độ: {SocialEngine.getAffectionRange(activeCompanion.affection)}</div>
              </div>
            )}

          </div>

          {/* Right Column (Actions) */}
          <div className="p-4 bg-black/20 flex items-center justify-center min-w-[180px]">
            <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full max-w-[200px]">
              <button onClick={handleAttack} disabled={!isPlayerTurn || isAnimating} className={`${btnClass} text-red-500 border-red-500/20 bg-red-500/5`}>⚔️ TẤN CÔNG</button>
              <button onClick={() => setShowSkills(true)} disabled={!isPlayerTurn || isAnimating} className={`${btnClass} text-blue-400 border-blue-400/20 bg-blue-400/5`}>✨ KỸ NĂNG</button>
              <button onClick={() => setShowItems(true)} disabled={!isPlayerTurn || isAnimating} className={`${btnClass} text-emerald-400 border-emerald-400/20 bg-emerald-400/5`}>🎒 VẬT PHẨM</button>
              <button onClick={handleRun} disabled={!isPlayerTurn || isAnimating} className={`${btnClass} text-slate-400 border-slate-400/20 bg-slate-400/5`}>🏃 BỎ CHẠY</button>
            </div>
          </div>

        </div>

        {/* Bottom Log Bar */}
        <div className="h-16 bg-black border-t border-white/5 p-2 flex flex-col justify-end">
          <div className="space-y-0.5 overflow-hidden">
            {battleLog.slice(-2).map((log, i) => (
              <p key={i} className={`text-[9px] font-bold leading-tight truncate ${i === 1 ? 'text-white' : 'text-white/20'}`}>
                <span className="text-white/10 mr-1 italic">»</span> {log}
              </p>
            ))}
          </div>
          <div ref={logEndRef} />
        </div>

      </div>

      {/* Responsive Panels */}
      <AnimatePresence>
        {(showSkills || showItems) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowSkills(false); setShowItems(false); }} className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto" />
            <motion.div 
              initial={isDesktop ? { scale: 0.9, opacity: 0 } : { y: "100%" }}
              animate={isDesktop ? { scale: 1, opacity: 1 } : { y: 0 }}
              exit={isDesktop ? { scale: 0.9, opacity: 0 } : { y: "100%" }}
              className={`bg-slate-900 border-white/10 pointer-events-auto ${isDesktop ? 'w-full max-w-sm rounded-3xl border-2 p-6' : 'absolute bottom-0 left-0 w-full rounded-t-3xl border-t-4 p-5'}`}
            >
              <h3 className="text-lg font-black text-amber-500 mb-3 uppercase italic text-center">{showSkills ? 'Kỹ Năng' : 'Vật Phẩm'}</h3>
              <div className="max-h-[40vh] overflow-y-auto space-y-1.5 pb-4">
                {showSkills && availableSkills.map(s => (
                  <button key={s.id} onClick={() => handleSkillAction(s)} disabled={stats.mp < s.mpCost} className="w-full flex justify-between px-4 py-3 bg-white/5 rounded-xl text-[10px] font-bold border border-white/5">
                    <span>{s.name}</span> <span className="text-blue-400">{s.mpCost} MP</span>
                  </button>
                ))}
                {showItems && consumables.map((it, idx) => (
                  <button key={idx} onClick={() => handleItemUse(it)} className="w-full flex justify-between px-4 py-3 bg-white/5 rounded-xl text-[10px] font-bold border border-white/5">
                    <span>{it.name}</span> <span className="text-emerald-400">Dùng</span>
                  </button>
                ))}
                {((showSkills && !availableSkills.length) || (showItems && !consumables.length)) && <div className="text-center py-4 text-gray-500 text-[10px] italic">Trống</div>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {battleResult === 'win' && <VictoryScreen 
        exp={victoryData.exp} 
        gold={victoryData.gold} 
        items={victoryData.items} 
        materials={victoryData.materials} 
        onContinue={handleContinue} 
      />}
      {battleResult === 'lose' && <DefeatScreen onRetry={handleRetry} onFlee={handleFleeAfterDefeat} />}
      
    </div>
  );
}
