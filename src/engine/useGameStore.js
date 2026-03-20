import { create } from 'zustand';
import { RandomEngine } from './RandomEngine';
import commonEventsData from '../data/base/common_events.json';
import specialEventsData from '../data/base/special_events.json';

export const useGameStore = create((set, get) => ({
  playerName: '',
  setPlayerName: (name) => set({ playerName: name }),
  initializeGame: (name) => set((state) => {
    const str = 5 + Math.floor(Math.random() * 11);
    const int = 5 + Math.floor(Math.random() * 11);
    const agi = 5 + Math.floor(Math.random() * 11);
    const def = 3 + Math.floor(Math.random() * 8);
    const res = 3 + Math.floor(Math.random() * 8);
    const lck = 1 + Math.floor(Math.random() * 10);
    
    const startingWorlds = ['tutorial', 'fantasy', 'scifi', 'eastern', 'postapoc'];
    const randomWorld = startingWorlds[Math.floor(Math.random() * startingWorlds.length)];
    
    const startingWeapon = RandomEngine.generateWeapon(randomWorld, lck);
    const startingTraits = RandomEngine.generateTraits(randomWorld, 3, lck);
    
    const personalities = ['Dũng Cảm', 'Thận Trọng', 'Cuốn Hút', 'Khắc Kỷ', 'Liều Lĩnh', 'Phân Tích'];
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];

    return {
      playerName: name || 'Lữ Khách',
      personality: randomPersonality,
      currentWorldId: randomWorld,
      currentSceneId: 'start',
      weather: 'Nắng ráo',
      timeOfDay: 'Ban ngày',
      inventory: [startingWeapon], 
      equippedWeapon: startingWeapon,
      traits: startingTraits, 
      flags: [`visited_${randomWorld}`],
      worldVisits: 1,
      chapter: 1,
      scenesPassedSinceLastSpecialEvent: 0,
      age: 18,
      stats: {
        ...state.stats,
        str, int, agi, def, res, lck,
        hp: 100, maxHp: 100, mp: 50, maxMp: 50, lives: 3, maxLives: 5,
        level: 1, xp: 0, skillSlots: 1, skills: [], equippedSkills: []
      }
    };
  }),
  flags: [],
  inventory: [],
  stats: {
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    lives: 3,
    maxLives: 5,
    memoryFragments: 0,
    affection_mage: 0,
    affection_fox: 0,
    gold: 0,
    str: 10,
    dex: 10,
    int: 10,
    cha: 10,
    con: 10,
    agi: 10,
    lck: 10,
    def: 5,
    res: 10,
    weaponDice: 10,
    armor: 5,
    level: 1,
    xp: 0,
    skillSlots: 1,
    skills: [],
    equippedSkills: []
  },
  worldStats: {
    tutorial: { sanity: 100 },
    fantasy: { mana: 50, day: 1, loop_count: 0 },
    scifi: { battery: 100 },
    eastern: { karma: 0 },
    postapoc: { radiation: 0 }
  },
  currentSceneId: 'start',
  intendedSceneId: null,
  currentWorldId: 'tutorial',
  weather: 'sunny',
  timeOfDay: 'day',
  inBattle: false,
  currentMonster: null,
  
  equippedWeapon: null,
  equipWeapon: (weapon) => set({ equippedWeapon: weapon }),
  
  getTotalStats: () => {
    const state = get();
    const totalStats = { ...state.stats };
    
    if (state.equippedWeapon && state.equippedWeapon.stats) {
      for (const [key, val] of Object.entries(state.equippedWeapon.stats)) {
        const lowerKey = key.toLowerCase();
        totalStats[lowerKey] = (totalStats[lowerKey] || 0) + val;
      }
    }
    
    if (state.traits) {
      state.traits.forEach(t => {
        if (t.effect) {
          for (const [key, val] of Object.entries(t.effect)) {
            const lowerKey = key.toLowerCase();
            totalStats[lowerKey] = (totalStats[lowerKey] || 0) + val;
          }
        }
      });
    }

    if (state.flags.includes('curse_of_27')) {
      totalStats.lck = (totalStats.lck || 0) + 27;
      totalStats.maxHp = Math.max(1, Math.floor((totalStats.maxHp || 100) * 0.73));
    }

    return totalStats;
  },

  setFlag: (flag) => set((state) => ({ flags: [...new Set([...state.flags, flag])] })),
  removeFlag: (flag) => set((state) => ({ flags: state.flags.filter(f => f !== flag) })),
  hasFlag: (flag) => get().flags.includes(flag),
  
  addItem: (itemId) => set((state) => ({ inventory: [...state.inventory, itemId] })),
  removeItem: (itemId) => set((state) => {
    const index = state.inventory.indexOf(itemId);
    if (index > -1) {
      const newInv = [...state.inventory];
      newInv.splice(index, 1);
      return { inventory: newInv };
    }
    return state;
  }),
  
  updateStats: (statChanges) => set((state) => {
    let newStats = { ...state.stats, ...statChanges };
    
    // Level up logic
    while (newStats.xp >= newStats.level * 100) {
      newStats.xp -= newStats.level * 100;
      newStats.level += 1;
      newStats.maxHp += 10;
      newStats.hp = newStats.maxHp;
      newStats.maxMp += 5;
      newStats.mp = newStats.maxMp;
      newStats.str += 1;
      newStats.int += 1;
      newStats.agi += 1;
      
      // Skill slots increase: every 5 levels unlock 1 new slot (max 8)
      newStats.skillSlots = Math.min(8, 1 + Math.floor(newStats.level / 5));
    }
    
    // We need to calculate totalStats to get the effective maxHp/maxMp
    // However, we are inside a set() function, so we can't easily call get().getTotalStats()
    // Let's just use the current state to calculate effective maxes
    let effectiveMaxHp = newStats.maxHp;
    let effectiveMaxMp = newStats.maxMp;
    
    if (state.flags.includes('curse_of_27')) {
      effectiveMaxHp = Math.max(1, Math.floor(effectiveMaxHp * 0.73));
    }
    
    // Handle HP reaching 0
    if (newStats.hp <= 0) {
      newStats.lives -= 1;
      if (newStats.lives > 0) {
        newStats.hp = effectiveMaxHp; // Revive with full effective HP
      } else {
        newStats.hp = 0; // Game Over state
      }
    }
    
    // Cap HP, MP and Lives
    if (newStats.hp > effectiveMaxHp) newStats.hp = effectiveMaxHp;
    if (newStats.mp > effectiveMaxMp) newStats.mp = effectiveMaxMp;
    if (newStats.lives > newStats.maxLives) newStats.lives = newStats.maxLives;
    if (newStats.hp < 0) newStats.hp = 0;
    if (newStats.mp < 0) newStats.mp = 0;
    
    return { stats: newStats };
  }),
  updateWorldStats: (worldId, changes) => set((state) => {
    const currentWorldStats = state.worldStats[worldId] || {};
    const newWorldStats = { ...currentWorldStats };
    
    for (const [key, val] of Object.entries(changes)) {
      if (typeof val === 'string' && (val.startsWith('+') || val.startsWith('-'))) {
        newWorldStats[key] = (currentWorldStats[key] || 0) + parseInt(val);
      } else {
        newWorldStats[key] = val;
      }
    }
    
    return {
      worldStats: {
        ...state.worldStats,
        [worldId]: newWorldStats
      }
    };
  }),
  
  setScene: (sceneId) => set((state) => {
    if (!sceneId) return state;
    
    let nextState = { currentSceneId: sceneId };
    
    if (sceneId === "RESUME_JOURNEY" || sceneId === "resume") {
      sceneId = state.intendedSceneId;
      nextState.currentSceneId = sceneId;
      nextState.intendedSceneId = null;
    }
    
    const isCommonEvent = sceneId.startsWith('ce_') || state.currentSceneId.startsWith('ce_');
    const isSpecialEvent = sceneId.startsWith('se_') || state.currentSceneId.startsWith('se_');
    
    // Check for random event chance
    if (
      sceneId !== 'start' && 
      !isCommonEvent && 
      !isSpecialEvent &&
      state.currentWorldId !== 'tutorial'
    ) {
      nextState.scenesPassedSinceLastSpecialEvent = (state.scenesPassedSinceLastSpecialEvent || 0) + 1;
      nextState.age = (state.age || 18) + (Math.random() < 0.1 ? 1 : 0); // Age increases slowly
      
      // 1. Check for Special Events (10% chance if conditions met)
      if (Math.random() < 0.1) {
        const availableSpecialEvents = specialEventsData.filter(e => {
          if (state.flags.includes(`completed_${e.id}`)) return false; 
          if (e.min_world_visits && (state.worldVisits || 1) < e.min_world_visits) return false;
          if (e.min_chapter && (state.chapter || 1) < e.min_chapter) return false;
          if (e.cooldown_scenes && nextState.scenesPassedSinceLastSpecialEvent < e.cooldown_scenes) return false;
          if (e.min_flags) {
            for (const flag of e.min_flags) {
              if (!state.flags.includes(flag)) return false;
            }
          }
          return true;
        });

        if (availableSpecialEvents.length > 0) {
          const selectedEvent = availableSpecialEvents[Math.floor(Math.random() * availableSpecialEvents.length)];
          nextState.currentSceneId = selectedEvent.id;
          nextState.intendedSceneId = sceneId;
          nextState.scenesPassedSinceLastSpecialEvent = 0;
          nextState.flags = [...state.flags, `completed_${selectedEvent.id}`];
          return nextState;
        }
      }

      // 2. Check for Common Events (30% chance)
      if (Math.random() < 0.3) {
        const weathers = ['Nắng ráo', 'Mưa phùn', 'Bão tố', 'Sương mù', 'Nhiều mây', 'Tuyết rơi'];
        const times = ['Ban ngày', 'Ban đêm', 'Bình minh', 'Hoàng hôn'];
        const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
        const newTime = times[Math.floor(Math.random() * times.length)];
        
        const availableEvents = commonEventsData.filter(e => {
          if (!e.weight) return false;
          if (e.min_age && nextState.age < e.min_age) return false;
          return true;
        });
        
        if (availableEvents.length > 0) {
          let totalWeight = 0;
          availableEvents.forEach(e => totalWeight += e.weight);
          
          let randomVal = Math.random() * totalWeight;
          let selectedEventId = availableEvents[0].id;
          
          for (const event of availableEvents) {
            randomVal -= event.weight;
            if (randomVal <= 0) {
              selectedEventId = event.id;
              break;
            }
          }
          
          nextState.currentSceneId = selectedEventId;
          nextState.intendedSceneId = sceneId;
          nextState.weather = newWeather;
          nextState.timeOfDay = newTime;
        }
      }
    }
    
    return nextState;
  }),
  setWorld: (worldId) => set((state) => {
    const isNewWorld = !state.flags.includes(`visited_${worldId}`);
    return { 
      currentWorldId: worldId,
      flags: [...new Set([...state.flags, `visited_${worldId}`])],
      worldVisits: isNewWorld ? (state.worldVisits || 1) + 1 : (state.worldVisits || 1),
      chapter: isNewWorld ? (state.chapter || 1) + 1 : (state.chapter || 1)
    };
  }),
  
  startBattle: (monsterIdOrObj) => set((state) => {
    let monster = monsterIdOrObj;
    if (typeof monsterIdOrObj === 'string') {
      // Generate a random monster based on current world
      monster = RandomEngine.generateMonster(state.currentWorldId, state.stats.lck);
    }
    return { inBattle: true, currentMonster: monster };
  }),
  endBattle: () => set({ inBattle: false, currentMonster: null }),
  
  loadSave: (saveData) => set({ ...saveData })
}));
