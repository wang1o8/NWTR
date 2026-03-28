import tutorialScenes from '../data/scenes/tutorial.json';
import randomEvents from '../data/scenes/random_events.json';
import fantasyScenes from '../data/scenes/fantasy.json';
import scifiScenes from '../data/scenes/scifi.json';
import easternScenes from '../data/scenes/eastern.json';
import postapocScenes from '../data/scenes/postapoc.json';
import commonEventsData from '../data/base/common_events.json';
import specialEventsData from '../data/base/special_events.json';
import { RandomEngine } from './RandomEngine';

const commonEvents = {};
commonEventsData.forEach(event => {
  commonEvents[event.id] = event;
});

const specialEvents = {};
specialEventsData.forEach(event => {
  specialEvents[event.id] = event;
});

const allScenes = {
  ...tutorialScenes,
  ...randomEvents,
  ...fantasyScenes,
  ...scifiScenes,
  ...easternScenes,
  ...postapocScenes,
  ...commonEvents,
  ...specialEvents
};

export const getScene = (sceneId, worldId = 'tutorial') => {
  console.log(`[SceneManager] REQUESTING SCENE: "${sceneId}" (World: ${worldId})`);
  
  if (allScenes[sceneId]) return allScenes[sceneId];

  console.warn(`[SceneManager] Scene "${sceneId}" not found. Falling back...`);
  
  // Extract and filter for scenes belonging to the current world
  const worldScenes = Object.keys(allScenes).filter(id => id.startsWith(worldId));
  if (worldScenes.length > 0) {
    console.log(`[SceneManager] Fallback to world first scene: "${worldScenes[0]}"`);
    return allScenes[worldScenes[0]];
  }

  // Final fallback to the global first scene if world scenes are empty
  const firstAvailableId = Object.keys(allScenes)[0];
  console.error(`[SceneManager] CRITICAL: No world scenes found. Defaulting to: "${firstAvailableId}"`);
  return allScenes[firstAvailableId];
};

export const evaluateRequires = (requires, flags, stats, traits, conditionalTraits, affection) => {
  if (!requires) return true;
  
  if (requires.flags) {
    for (const flag of requires.flags) {
      if (flag.startsWith('!')) {
        if (flags.includes(flag.substring(1))) return false;
      } else {
        if (!flags.includes(flag)) return false;
      }
    }
  }

  // Check item requirements from inventory
  if (requires.item) {
    const hasItem = (inventory || []).some(item => 
      (typeof item === 'string' ? item === requires.item : (item.id === requires.item || item.baseId === requires.item))
    );
    if (!hasItem) return false;
  }
  
  // Check trait requirements
  if (requires.traits) {
    const playerTraits = [...(traits || []), ...(conditionalTraits || [])].map(t => t.id);
    const hasAllTraits = requires.traits.every(t => 
      playerTraits.includes(t)
    );
    if (!hasAllTraits) return false;
  }
  
  if (requires.stats) {
    for (const [stat, condition] of Object.entries(requires.stats)) {
      const val = stats[stat.toLowerCase()] || 0;
      if (typeof condition === 'number') {
        if (val < condition) return false;
      } else if (typeof condition === 'string') {
        if (condition.startsWith('>=')) {
          if (val < parseInt(condition.substring(2))) return false;
        } else if (condition.startsWith('<=')) {
          if (val > parseInt(condition.substring(2))) return false;
        } else if (condition.startsWith('>')) {
          if (val <= parseInt(condition.substring(1))) return false;
        } else if (condition.startsWith('<')) {
          if (val >= parseInt(condition.substring(1))) return false;
        } else if (condition.startsWith('=')) {
          if (val !== parseInt(condition.substring(1))) return false;
        }
      }
    }
  }

  // Check affection and reputation requirements
  if (requires.affection || requires.stats?.reputation || Object.keys(requires).some(k => k.startsWith('affection_'))) {
    const checkValue = (val, condition) => {
      if (typeof condition === 'number') return val >= condition;
      if (typeof condition === 'string') {
        const num = parseInt(condition.replace(/[>=<]/g, ''));
        if (condition.startsWith('>=')) return val >= num;
        if (condition.startsWith('<=')) return val <= num;
        if (condition.startsWith('>')) return val > num;
        if (condition.startsWith('<')) return val < num;
        if (condition.startsWith('=')) return val === num;
      }
      return val >= (parseInt(condition) || 0);
    };

    // Standard affection object: { "elara": 10 }
    if (requires.affection) {
      for (const [char, condition] of Object.entries(requires.affection)) {
        if (!checkValue(affection[char] || 0, condition)) return false;
      }
    }

    // Individual affection keys: { "affection_fox": ">=2" }
    for (const [key, condition] of Object.entries(requires)) {
      if (key.startsWith('affection_')) {
        const charId = key.replace('affection_', '');
        if (!checkValue(affection[charId] || 0, condition)) return false;
      }
    }
  }
  
  return true;
};

export const applySets = (sets, setFlag, updateStats, addItem, currentStats, updateWorldStats, currentWorldId, updateAffection) => {
  if (!sets) return;
  
  if (sets.flags) {
    sets.flags.forEach(flag => setFlag(flag));
  }
  
  if (sets.stats) {
    const newStats = {};
    for (const [key, val] of Object.entries(sets.stats)) {
      if (val === 'max' || val === 'full') {
        // Handle 'max' keyword: sets hp: 'max'
        const totalStats = currentStats.maxHp ? currentStats : {}; // Simplified for now
        if (key === 'hp') newStats.hp = (totalStats.maxHp || 100);
        else if (key === 'mp') newStats.mp = (totalStats.maxMp || 50);
        else if (key === 'sanity') newStats.sanity = (totalStats.maxSanity || 30);
      } else if (typeof val === 'string' && (val.startsWith('+') || val.startsWith('-'))) {
        newStats[key] = (currentStats[key] || 0) + parseInt(val);
      } else {
        newStats[key] = val;
      }
    }
    updateStats(newStats);
  }
  
  if (sets.affection && updateAffection) {
    updateAffection(sets.affection);
  }
  
  if (sets.worldStats && currentWorldId) {
    updateWorldStats(currentWorldId, sets.worldStats);
  }
  
  if (sets.addItem) {
    addItem(sets.addItem);
  }

  if (sets.addSkill) {
    const { addSkill } = useGameStore.getState();
    addSkill(sets.addSkill);
  }

  if (sets.buyItem && sets.cost) {
    const { buyItem } = useGameStore.getState();
    buyItem(sets.buyItem, sets.cost);
  }

  if (sets.generateWeapon) {
    const weapon = RandomEngine.generateWeapon(currentWorldId, currentStats.lck || 10);
    addItem(weapon);
  }
};
