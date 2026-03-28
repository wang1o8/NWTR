import { create } from 'zustand';
import { RandomEngine } from './RandomEngine';
import commonEventsData from '../data/base/common_events.json';
import specialEventsData from '../data/base/special_events.json';
import traitsInnateData from '../data/base/traits_innate.json';
import traitsConditionalData from '../data/base/traits_conditional.json';
import config from '../data/base/config_global.json';
const { stats: statsConfig } = config;
import armorSetsData from '../data/armor_sets.json';
import craftingRecipesData from '../data/crafting_recipes.json';
import achievementsData from '../data/achievements.json';
import openingsData from '../data/openings.json';
import npcData from '../data/npcs.json';
import endingsData from '../data/endings.json';
import { SocialEngine } from './SocialEngine';

export const useGameStore = create((set, get) => ({
  currentEnding: null,
  isGameOver: false,
  totalPlayTime: 0,
  endingsReached: [],
  setPlayerName: (name) => set({ playerName: name || 'Lữ Khách' }),
  initializeGame: (name) => set((state) => {
    // Roll 6 core attributes (1-20)
    const str = 1 + Math.floor(Math.random() * 20);
    const dex = 1 + Math.floor(Math.random() * 20);
    const con = 1 + Math.floor(Math.random() * 20);
    const int = 1 + Math.floor(Math.random() * 20);
    const wis = 1 + Math.floor(Math.random() * 20);
    const cha = 1 + Math.floor(Math.random() * 20);
    
    const randomWorld = 'tutorial';
    
    const startingWeapon = RandomEngine.generateWeapon(randomWorld, 5); // Base luck 5
    
    // Shuffled traits
    const shuffledInnate = [...traitsInnateData].sort(() => 0.5 - Math.random());
    const startingTraits = shuffledInnate.slice(0, 1);
    
    const personalities = ['Dũng Cảm', 'Thận Trọng', 'Cuốn Hút', 'Khắc Kỷ', 'Liều Lĩnh', 'Phân Tích'];
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];

    const lck = 5;
    const seed = name + '_' + Math.floor(Math.random() * 99999);
    let numericSeed = 0;
    for (let i = 0; i < seed.length; i++) {
        numericSeed = (numericSeed << 5) - numericSeed + seed.charCodeAt(i);
        numericSeed |= 0;
    }
    const seedMod = Math.abs(numericSeed) % 100; // 0 to 99
    const seedModifiers = {
         specialEventBonus: (seedMod - 50) * 0.005,
         rareDropBonus: (seedMod - 50) * 0.005,
         enemyStatMultiplier: 1 + ((seedMod - 50) * 0.01),
         commonEventRate: Math.max(0.1, 0.3 - ((seedMod - 50) * 0.005))
    };

    const initialStats = {
      rep: 0,
      soul: 5,
      level: 1,
      xp: 0,
      skillSlots: 1,
      skills: [],
      equippedSkills: [],
      memoryFragments: 0,
      gold: 50,
      hp: Math.max(20, (con || 5) * 5 + 20),
      maxHp: Math.max(20, (con || 5) * 5 + 20),
      mp: int * 3 + 10,
      sanity: wis * 2 + 10,
      lives: 3,
      maxLives: 3
    };

    return {
      playerName: name || '',
      personality: randomPersonality,
      currentWorldId: randomWorld,
      currentSceneId: 'intro_001',
      weather: 'Nắng ráo',
      timeOfDay: 'Ban ngày',
      worldSeed: seed,
      seedModifiers: seedModifiers,
      inventory: [startingWeapon],
      equippedWeapon: startingWeapon,
      equipment: {
        weapon: startingWeapon,
        head: null, chest: null, legs: null,
        ring1: null, ring2: null,
        amulet: null, belt: null, trinket: null
      },
      traits: startingTraits, // Innate traits
      conditionalTraits: [], // Active conditional traits (max 5)
      flags: [`visited_${randomWorld}`],
      worldVisits: 1,
      chapter: 1,
      scenesPassedSinceLastSpecialEvent: 0,
      triggered_events: {},
      last_triggered_at: {},
      difficulty: 'normal',
      toastQueue: [],
      newItemsCount: 0,
      sceneCount: 0,
      age: 18,
      stats: initialStats,
      affection: {
        elara: 0,
        kael: 0,
        mira: 0,
        vahn: 0
      },
      ngPlusLevel: 0,
      onboardingComplete: false
    };
  }),

  selectOpening: (openingId) => set((state) => {
    const opening = openingsData[openingId];
    if (!opening) return state;

    // Use current stats and merge opening bonus
    const startingWeapon = RandomEngine.generateWeapon(state.currentWorldId || 'tutorial', 5);
    
    // Instead of completely replacing stats, we just apply the opening's predefined distribution
    const initialStats = {
      ...state.stats,
      ...opening.stats,
      gold: opening.gold,
      hp: Math.max(20, (opening.stats.con || 10) * 5 + 20),
      maxHp: Math.max(20, (opening.stats.con || 10) * 5 + 20),
      mp: (opening.stats.int || 10) * 3 + 10,
      sanity: (opening.stats.wis || 10) * 2 + 10
    };

    return {
      currentSceneId: opening.startScene || 'tutorial_001',
      stats: initialStats,
      inventory: [startingWeapon],
      equippedWeapon: startingWeapon,
      equipment: { ...state.equipment, weapon: startingWeapon },
      traits: opening.traits.map(id => ({ id, name: id, source: 'opening' })),
      playerName: state.playerName || 'Lữ Khách',
      onboardingComplete: true
    };
  }),

  setDifficulty: (mode) => set({ difficultyMode: mode }),

  // Senior Architect Legacy/Resource Preservation
  legacy: {
    oldReputation: 0,
    deprecatedActions: {}
  },

  // Consolidated state and actions below...
  flags: [],
  activeTraits: [],
  inventory: [],
  stats: {
    str: 10,
    dex: 10,
    int: 10,
    con: 10,
    wis: 10,
    cha: 10,
    lck: 5,
    rep: 0,
    soul: 5,
    hp: 100,
    maxHp: 100,
    mp: 50,
    sanity: 30,
    level: 1,
    xp: 0,
    skillSlots: 1,
    skills: [],
    equippedSkills: [],
    memoryFragments: 0,
    gold: 50,
    lives: 3,
    maxLives: 3
  },
  worldStats: {
    tutorial: { sanity: 100 },
    fantasy: { mana: 50, day: 1, loop_count: 0 },
    scifi: { battery: 100 },
    eastern: { karma: 0 },
    postapoc: { radiation: 0 }
  },
  currentSceneId: 'intro_001',
  intendedSceneId: null,
  currentWorldId: 'tutorial',
  weather: 'sunny',
  timeOfDay: 'day',
  inBattle: false,
  currentMonster: null,
  triggered_events: {},
  last_triggered_at: {},
  toastQueue: [],
  newItemsCount: 0,
  sceneCount: 0,
  ngPlusLevel: 0,
  unlockedAchievements: [],
  isGameOver: false,
  globalReputation: 0,
  npcs: npcData,

  updateAffection: (worldIdOrChanges, npcId, delta) => set((state) => {
    const updatedNpcs = { ...state.npcs };
    
    // Support for Bulk Update: updateAffection({ elara: 5, kael: -2 })
    if (typeof worldIdOrChanges === 'object' && !npcId) {
      const changes = worldIdOrChanges;
      const currentWorldNpcs = updatedNpcs[state.currentWorldId] || [];
      
      Object.entries(changes).forEach(([id, change]) => {
        const idx = currentWorldNpcs.findIndex(n => n.id === id);
        if (idx !== -1) {
          const npc = { ...currentWorldNpcs[idx] };
          npc.affection = Math.min(100, Math.max(-100, (npc.affection || 0) + (parseInt(change) || 0)));
          currentWorldNpcs[idx] = npc;
        }
      });
      updatedNpcs[state.currentWorldId] = [...currentWorldNpcs];
    } 
    // Support for Single Update: updateAffection('fantasy', 'elara', 5, { lastGiftSceneCount: 10 })
    else {
      const worldId = worldIdOrChanges;
      const extraData = arguments[3] || {}; // delta is arguments[2], worldId is arguments[0]
      if (!updatedNpcs[worldId]) return state;
      
      const npcIdx = updatedNpcs[worldId].findIndex(n => n.id === npcId);
      if (npcIdx === -1) return state;

      const npc = { ...updatedNpcs[worldId][npcIdx], ...extraData };
      npc.affection = Math.min(100, Math.max(-100, (npc.affection || 0) + delta));
      
      updatedNpcs[worldId] = [...updatedNpcs[worldId]];
      updatedNpcs[worldId][npcIdx] = npc;
    }
    
    const totalAffectionForWorld = (updatedNpcs[state.currentWorldId] || []).reduce((acc, n) => acc + (n.affection || 0), 0);
    const calculatedRep = Math.floor(totalAffectionForWorld / 5);

    return { 
      npcs: updatedNpcs,
      globalReputation: Math.min(100, Math.max(-100, calculatedRep))
    };
  }),

  triggerEnding: (id) => {
    const ending = endingsData.endings.find(e => e.id === id);
    if (!ending) return;
    
    set((state) => ({ 
      currentEnding: ending, 
      isGameOver: true,
      endingsReached: [...(state.endingsReached || []), id]
    }));
  },

  startNGPlus: () => set((state) => {
    // Keep: totalPlayTime, endingsReached, ngPlusLevel, unlockedAchievements
    // New: soul, wisdom (carry over 20%), traits
    const nextNgPlus = state.ngPlusLevel + 1;
    const carryStats = {
      ...state.stats,
      hp: state.stats.maxHp,
      mp: state.stats.maxMp,
      soul: state.stats.soul + 2, // Bonus soul per loop
      level: 1,
      xp: 0,
      gold: 100 // Starting gold boost
    };

    return {
      ngPlusLevel: nextNgPlus,
      currentWorldId: 'tutorial',
      currentSceneId: 'intro_001',
      isGameOver: false,
      currentEnding: null,
      stats: carryStats,
      inventory: [], // Inventory reset
      flags: [], // Global flags reset
      sceneCount: 0,
      globalReputation: 0, // Diplomacy reset
      npcs: npcData // NPC state reset
    };
  }),

  unlockAchievement: (id) => set((state) => {
    if (state.unlockedAchievements?.includes(id)) return state;
    
    const ach = achievementsData.achievements.find(a => a.id === id);
    if (!ach) return state;

    get().addToast({
      type: 'achievement',
      message: `🏆 Thành tựu: ${ach.name}!`,
      icon: '🏆'
    });

    if (ach.reward?.gold) {
      setTimeout(() => get().updateStats({ gold: state.stats.gold + ach.reward.gold }), 100);
    }
    if (ach.reward?.item) {
      setTimeout(() => get().addItem(ach.reward.item), 100);
    }

    return { unlockedAchievements: [...(state.unlockedAchievements || []), id] };
  }),
  
  enterNewGamePlus: () => set((state) => {
    // 1. Keep all non-consumable, non-material, non-quest inventory items
    // Unequip all gear to put back into inventory
    let keptInventory = [];
    state.inventory.forEach(item => {
      if (item && item.type !== 'consumable' && item.type !== 'material' 
          && item.type !== 'quest' && item.type !== 'story' 
          && item.type !== 'collection' && item.type !== 'proof' && item.type !== 'delivery') {
        keptInventory.push(item);
      }
    });

    // Extract equipped gear to inventory
    const eq = state.equipment;
    Object.keys(eq).forEach(slot => {
      if (eq[slot]) keptInventory.push(eq[slot]);
    });

    // 2. Keep knowledge flags
    const keptFlags = state.flags.filter(f => f.startsWith('know_') || f.startsWith('unlocked_'));

    // 3. Reset stats to base (but keep skills)
    const resetStats = { ...state.stats };
    resetStats.str = 10; resetStats.dex = 10; resetStats.int = 10;
    resetStats.con = 10; resetStats.wis = 10; resetStats.cha = 10;
    resetStats.lck = 5; resetStats.rep = 0; resetStats.soul = 5;
    resetStats.level = 1; resetStats.xp = 0; resetStats.gold = 100;
    resetStats.hp = 70; resetStats.maxHp = 70;
    resetStats.mp = 40; resetStats.sanity = 30;
    resetStats.lives = 3; resetStats.skillSlots = 1;

    get().addToast({
      type: 'info',
      message: `Bắt đầu New Game+ ${state.ngPlusLevel + 1}!`,
      icon: '🌌'
    });

    return {
      ngPlusLevel: state.ngPlusLevel + 1,
      inventory: keptInventory,
      equipment: { weapon: null, head: null, chest: null, legs: null, ring1: null, ring2: null, amulet: null, belt: null, trinket: null },
      equippedWeapon: null,
      flags: keptFlags,
      stats: resetStats,
      chapter: 1,
      worldVisits: 1,
      currentWorldId: 'tutorial',
      currentSceneId: 'intro_001',
      intendedSceneId: null,
      triggered_events: {},
      last_triggered_at: {},
      affection: { elara: 0, kael: 0, mira: 0, vahn: 0 }
    };
  }),
  
  addToast: (toast) => set((state) => ({ 
    toastQueue: [...state.toastQueue, { ...toast, id: Date.now() + Math.random() }] 
  })),
  removeToast: (id) => set((state) => ({ 
    toastQueue: state.toastQueue.filter(t => t.id !== id) 
  })),
  clearNewItemsCount: () => set({ newItemsCount: 0 }),
  
  equippedWeapon: null,
  equipment: {
    weapon: null, head: null, chest: null, legs: null,
    ring1: null, ring2: null, amulet: null, belt: null, trinket: null
  },

  equipWeapon: (weapon) => set((state) => ({
    equippedWeapon: weapon,
    equipment: { ...state.equipment, weapon }
  })),

  equipItem: (item, slot) => set((state) => {
    if (state.inBattle) {
      get().addToast({ type: 'error', message: "Không thể thay đổi trang bị khi đang chiến đấu!", icon: '🚫' });
      return state;
    }
    // Unequip current item in that slot first
    const currentItem = state.equipment[slot];
    let newInventory = [...state.inventory];
    if (currentItem) {
      newInventory.push(currentItem);
    }
    // Remove the new item from inventory
    const idx = newInventory.findIndex(i => i.id === item.id);
    if (idx !== -1) newInventory.splice(idx, 1);
    
    const newEquipment = { ...state.equipment, [slot]: item };
    return {
      inventory: newInventory,
      equipment: newEquipment,
      equippedWeapon: slot === 'weapon' ? item : state.equippedWeapon
    };
  }),

  unequipItem: (slot) => set((state) => {
    if (state.inBattle) {
      get().addToast({ type: 'error', message: "Không thể tháo trang bị khi đang chiến đấu!", icon: '🚫' });
      return state;
    }
    const item = state.equipment[slot];
    if (!item) return {};
    return {
      inventory: [...state.inventory, item],
      equipment: { ...state.equipment, [slot]: null },
      equippedWeapon: slot === 'weapon' ? null : state.equippedWeapon
    };
  }),

  craftItem: (recipeId) => set((state) => {
    const recipe = craftingRecipesData.recipes.find(r => r.id === recipeId);
    if (!recipe) return {};
    
    // Check stat requirements
    const totalStats = state.getTotalStats();
    for (const [stat, minVal] of Object.entries(recipe.statReq || {})) {
      if ((totalStats[stat] || 0) < minVal) return {};
    }

    // Check gold
    if ((state.stats.gold || 0) < (recipe.gold || 0)) return {};

    // Check materials
    const materialCounts = {};
    state.inventory.forEach(item => {
      if (item.type === 'material') materialCounts[item.id] = (materialCounts[item.id] || 0) + 1;
    });
    for (const [matId, qty] of Object.entries(recipe.materials || {})) {
      if ((materialCounts[matId] || 0) < qty) return {};
    }

    // Consume materials
    let newInventory = [...state.inventory];
    for (const [matId, qty] of Object.entries(recipe.materials || {})) {
      let removed = 0;
      newInventory = newInventory.filter(item => {
        if (item.id === matId && item.type === 'material' && removed < qty) { removed++; return false; }
        return true;
      });
    }

    // Create output item (simplified: add a placeholder item with recipe output ID)
    const outputItem = {
      id: `${recipe.outputId}_${Date.now()}`,
      baseId: recipe.outputId,
      name: recipe.name.replace(/^(Rèn|Chế|May|Pha) /, ''),
      type: recipe.outputType === 'consumable' ? 'consumable' : 'equipment',
      icon: '🔨',
      rarity: recipe.tier >= 3 ? 'EPIC' : recipe.tier >= 2 ? 'RARE' : 'UNCOMMON',
      craftedFrom: recipeId
    };

    newInventory.push(outputItem);
    return {
      inventory: newInventory,
      stats: { ...state.stats, gold: state.stats.gold - (recipe.gold || 0) }
    };
  }),

  disassembleItem: (itemId) => set((state) => {
    const item = state.inventory.find(i => i.id === itemId);
    if (!item) return {};
    // Return 30% sell value as gold
    const goldBack = Math.floor((item.price || 50) * 0.3);
    // Give back 1 random material
    const materials = ['iron_ore', 'scrap_metal', 'bamboo', 'bone_fragment', 'rusty_parts'];
    const matItem = {
      id: materials[Math.floor(Math.random() * materials.length)],
      name: 'Nguyên liệu',
      type: 'material',
      icon: '🪨'
    };
    return {
      inventory: [...state.inventory.filter(i => i.id !== itemId), matItem],
      stats: { ...state.stats, gold: state.stats.gold + goldBack }
    };
  }),
  sellItem: (item) => set((state) => {
    const itemData = typeof item === 'string' ? require('../data/items.json')[item] : item;
    let price = itemData?.price || (itemData?.rarity === 'Legendary' ? 1000 : 50);
    
    // Apply Merchant Discount if talking to a merchant
    const currentNpc = state.npcs[state.currentWorldId]?.find(n => n.type === 'merchant' && n.unlocked);
    if (currentNpc) {
      const mult = SocialEngine.getPriceMultiplier(currentNpc);
      price = Math.floor(price * mult);
    }

    return {
      inventory: state.inventory.filter((i) => (typeof i === 'string' ? i !== item : i.id !== item.id)),
      stats: { ...state.stats, gold: state.stats.gold + price }
    };
  }),
  
  getTotalStats: () => {
    const state = get();
    const base = state.stats;
    const equip = state.equipment || {};
    const equipped = state.equippedWeapon;
    const allTraits = [...(state.traits || []), ...(state.conditionalTraits || [])];
    
    const MIN_STAT = 0;
    const MAX_BASE_STAT = 999;
    const MAX_EQUIPMENT_BONUS = 30;
    const SOFT_CAP_TOTAL = 80;

    // 1. Base Stats
    let final = {};
    ['str', 'dex', 'int', 'con', 'wis', 'cha', 'lck', 'rep', 'soul'].forEach(s => {
      final[s] = Math.max(MIN_STAT, Math.min(base[s] || 0, MAX_BASE_STAT));
    });

    // 2. Collect Flat Bonuses from ALL equipment slots
    const equipmentBonuses = {};
    const traitBonuses = {};
    let totalArmorDef = 0;

    const addBonus = (bonusObj, target) => {
      if (!bonusObj) return;
      for (const [stat, val] of Object.entries(bonusObj)) {
        const key = stat.toLowerCase();
        target[key] = (target[key] || 0) + val;
      }
    };

    // Weapon bonus (from old system or new equipment slot)
    const activeWeapon = equip.weapon || equipped;
    if (activeWeapon) {
      // Support both old format (stat_effects/stats) and new format (bonus)
      if (activeWeapon.bonus) addBonus(activeWeapon.bonus, equipmentBonuses);
      else if (activeWeapon.stat_effects || activeWeapon.stats) {
        const stats = activeWeapon.stat_effects || activeWeapon.stats;
        for (const [stat, val] of Object.entries(stats)) {
          if (!stat.endsWith('_mult') && !stat.endsWith('_flat')) {
            equipmentBonuses[stat.toLowerCase()] = (equipmentBonuses[stat.toLowerCase()] || 0) + val;
          }
        }
      }
      // Apply penalty from cursed weapons
      if (activeWeapon.penalty) addBonus(activeWeapon.penalty, equipmentBonuses);
    }

    // Armor slots (head, chest, legs)
    ['head', 'chest', 'legs'].forEach(slot => {
      const piece = equip[slot];
      if (piece) {
        totalArmorDef += (piece.def || 0);
        if (piece.bonus) addBonus(piece.bonus, equipmentBonuses);
      }
    });

    // Accessory slots (ring1, ring2, amulet, belt, trinket)
    ['ring1', 'ring2', 'amulet', 'belt', 'trinket'].forEach(slot => {
      const acc = equip[slot];
      if (acc) {
        if (acc.bonus) addBonus(acc.bonus, equipmentBonuses);
        if (acc.penalty) addBonus(acc.penalty, equipmentBonuses);
      }
    });

    // Detect Armor Set Bonus
    const equippedSetIds = {};
    ['head', 'chest', 'legs'].forEach(slot => {
      const piece = equip[slot];
      if (piece && piece.setId) {
        equippedSetIds[piece.setId] = (equippedSetIds[piece.setId] || 0) + 1;
      }
    });
    for (const [setId, count] of Object.entries(equippedSetIds)) {
      if (count >= 3) {
        const setDef = armorSetsData.sets.find(s => s.id === setId);
        if (setDef && setDef.setBonus) {
          addBonus(setDef.setBonus, equipmentBonuses);
          if (setDef.penalty) addBonus(setDef.penalty, equipmentBonuses);
        }
      }
    }

    // Clamp equipment bonuses per stat
    for (const stat in equipmentBonuses) {
      equipmentBonuses[stat] = Math.max(-MAX_EQUIPMENT_BONUS, Math.min(equipmentBonuses[stat], MAX_EQUIPMENT_BONUS));
    }

    // Traits
    allTraits.forEach(trait => {
      if (trait.stat_effects || trait.stats) {
        const stats = trait.stat_effects || trait.stats;
        for (const [stat, val] of Object.entries(stats)) {
          if (!stat.endsWith('_mult') && !stat.endsWith('_flat')) {
            traitBonuses[stat.toLowerCase()] = (traitBonuses[stat.toLowerCase()] || 0) + val;
          }
        }
      }
    });

    // Combine into final
    ['str', 'dex', 'int', 'con', 'wis', 'cha', 'lck'].forEach(s => {
      let total = final[s] + (equipmentBonuses[s] || 0) + (traitBonuses[s] || 0);
      if (total > SOFT_CAP_TOTAL) total = SOFT_CAP_TOTAL; // Hard cap as per Edge Case 1
      final[s] = Math.max(MIN_STAT, total);
    });

    // 3. Derived Stats
    final.maxHp = final.con * 5 + 20;
    final.maxMp = final.int * 3 + 10;
    final.maxSanity = final.wis * 2 + 10;
    final.initiative = final.dex / 2;
    final.carryWeight = final.str * 3 + 10;
    final.critChance = final.dex / 100;
    final.dodge = final.dex / 200;
    final.magicResist = final.wis / 3;
    final.physicalResist = final.con / 4 + totalArmorDef; // Armor DEF added here
    final.physAtk = final.str / 2;
    final.magAtk = final.int / 2;
    final.totalArmorDef = totalArmorDef;

    // World affinity bonus: +20% physAtk/magAtk if weapon world matches
    if (activeWeapon && activeWeapon.world === state.currentWorldId) {
      final.physAtk *= 1.2;
      final.magAtk *= 1.2;
    }

    // 4. Multipliers
    const multipliers = {
      phys_dmg: 1, mag_dmg: 1, crit_dmg: 1.5, crit_chance: 1,
      dodge: 1, mag_resist: 1, phys_resist: 1, drop_rate: 1,
      exp_gain: 1, sanity_loss: 1, affection_gain: 1
    };

    const applyMult = (source) => {
      if (!source || !source.stat_effects) return;
      for (const [stat, val] of Object.entries(source.stat_effects)) {
        if (stat.endsWith('_mult')) {
          const key = stat.replace('_mult', '');
          multipliers[key] = (multipliers[key] || 1) + val;
        }
      }
    };

    if (activeWeapon && (activeWeapon.stats || activeWeapon.stat_effects)) {
      const stats = activeWeapon.stats || activeWeapon.stat_effects;
      for (const [stat, val] of Object.entries(stats)) {
        if (stat.endsWith('_mult')) {
          multipliers[stat.replace('_mult', '')] = (multipliers[stat.replace('_mult', '')] || 1) + val;
        }
      }
    }
    allTraits.forEach(applyMult);

    final.physAtk *= multipliers.phys_dmg;
    final.magAtk *= multipliers.mag_dmg;
    final.dodge *= multipliers.dodge;
    final.magicResist *= multipliers.mag_resist;
    final.physicalResist *= multipliers.phys_resist;
    final.critChance *= multipliers.crit_chance;
    
    final.multipliers = multipliers;
    final.equipmentBonuses = equipmentBonuses;
    return final;
  },

  checkConditionalTraits: () => {
    const state = get();
    const totalStats = state.getTotalStats();
    const activeFlags = state.flags;
    const currentAffection = state.affection;
    const equipped = state.equippedWeapon;

    // Track previously active traits
    const previousTraitIds = (state.conditionalTraits || []).map(t => t.id);

    const newlyActive = traitsConditionalData.filter(trait => {
      if (trait.method === 'stat') {
        for (const [stat, minVal] of Object.entries(trait.requires)) {
          if ((totalStats[stat.toLowerCase()] || 0) < minVal) return false;
        }
        return true;
      }
      if (trait.method === 'event') {
        return trait.requires.flags.every(f => activeFlags.includes(f));
      }
      if (trait.method === 'affection') {
        return (currentAffection[trait.requires.character_id] || 0) >= trait.requires.affection;
      }
      if (trait.method === 'equipment' && equipped) {
        if (trait.requires.weapon_type && equipped.type === trait.requires.weapon_type) return true;
        if (trait.requires.item_rarity && equipped.rarity === trait.requires.item_rarity) return true;
        if (trait.requires.item_id && equipped.id === trait.requires.item_id) return true;
      }
      return false;
    });

    const nonEquipActive = newlyActive.filter(t => t.method !== 'equipment').slice(0, 5);
    const equipActive = newlyActive.filter(t => t.method === 'equipment');

    const newTraitIds = [...nonEquipActive, ...equipActive].map(t => t.id);
    
    // Notify about newly unlocked traits
    const newlyUnlocked = newTraitIds.filter(id => !previousTraitIds.includes(id));
    newlyUnlocked.forEach(traitId => {
      const trait = traitsConditionalData.find(t => t.id === traitId);
      if (trait) {
        get().addToast({
          type: 'trait_unlock',
          message: `✨ Trait Unlock: ${trait.name}`,
          icon: '🔓'
        });
      }
    });

    set({ conditionalTraits: [...nonEquipActive, ...equipActive] });
  },

  setFlag: (flag) => set((state) => ({ flags: [...new Set([...state.flags, flag])] })),
  removeFlag: (flag) => set((state) => ({ flags: state.flags.filter(f => f !== flag) })),
  hasFlag: (flag) => get().flags.includes(flag),
  
  getInventoryWeight: () => {
    const inv = get().inventory;
    return inv.reduce((total, item) => total + ((item.weight || 0) * (item.quantity || 1)), 0);
  },

  addItem: (item) => set((state) => {
    const itemName = typeof item === 'string' ? item : (item.name || 'Vật phẩm');
    const itemIcon = typeof item === 'string' ? '🎒' : (item.icon || '🎒');
    
    // Check carrying capacity if it has weight
    if (typeof item === 'object' && item.weight) {
      const currentWeight = get().getInventoryWeight();
      const maxWeight = state.getTotalStats().carryWeight;
      if (currentWeight + item.weight > maxWeight) {
        get().addToast({
          type: 'error',
          message: `Quá tải! Không thể nhặt ${itemName}.`,
          icon: '⚠️'
        });
        return state;
      }
    }

    let newInventory = [...state.inventory];
    if (typeof item === 'object' && (item.type === 'consumable' || item.type === 'material' || item.type === 'quest')) {
      // Find existing stack
      const existingIdx = newInventory.findIndex(i => i.id === item.id);
      if (existingIdx > -1) {
        if ((newInventory[existingIdx].quantity || 1) < 99) {
          newInventory[existingIdx] = { ...newInventory[existingIdx], quantity: (newInventory[existingIdx].quantity || 1) + 1 };
          get().addToast({ type: 'item', message: `Nhận được: ${itemName} (${newInventory[existingIdx].quantity})`, icon: itemIcon });
          return { inventory: newInventory, newItemsCount: state.newItemsCount + 1 };
        } else {
          // Max stack reached for this ID, could create a new stack but let's just reject for simplicity
          get().addToast({ type: 'error', message: `Túi đã đầy ${itemName} (Max 99)!`, icon: '🛑' });
          return state;
        }
      } else {
        newInventory.push({ ...item, quantity: 1 });
      }
    } else {
      newInventory.push(item);
    }
    
    get().addToast({
      type: 'item',
      message: `Nhận được: ${itemName}`,
      icon: itemIcon
    });

    return { 
      inventory: newInventory,
      newItemsCount: state.newItemsCount + 1
    };
  }),
  removeItem: (itemId) => set((state) => {
    // Check id matching
    const objIndex = state.inventory.findIndex(item => (item.id && item.id === itemId) || item === itemId);
    if (objIndex > -1) {
      const newInv = [...state.inventory];
      const targetItem = newInv[objIndex];
      if (targetItem.quantity && targetItem.quantity > 1) {
        newInv[objIndex] = { ...targetItem, quantity: targetItem.quantity - 1 };
      } else {
        newInv.splice(objIndex, 1);
      }
      return { inventory: newInv };
    }
    return state;
  }),
  
  sellItem: (item) => {
    const state = get();
    if (!item) return;

    // Selling Items: 30% of buy price
    // If item doesn't have a specific price, fallback to rarity logic
    let finalValue = 0;
    if (item.price) {
      finalValue = Math.floor(item.price * 0.3);
    } else {
      const rarityValues = { 'COMMON': 10, 'UNCOMMON': 25, 'RARE': 100, 'EPIC': 500, 'LEGENDARY': 2000, 'MYTHIC': 5000 };
      const baseValue = rarityValues[item.rarity] || 10;
      finalValue = Math.floor(baseValue * 0.3); // Apply 30% flat instead of luck multiplier
    }
    
    // Disallow selling quest items
    if (item.type === 'quest' || item.type === 'story' || item.type === 'delivery' || item.type === 'proof' || item.type === 'collection') {
       get().addToast({ type: 'error', message: `Không thể bán vật phẩm nhiệm vụ!`, icon: '🛑' });
       return;
    }

    get().removeItem(item.id || item);
    get().updateStats({ gold: state.stats.gold + finalValue });
    
    get().addToast({
      type: 'gold',
      message: `Đã bán ${item.name || 'Vật phẩm'} nhận ${finalValue} 💰`,
      icon: '💰'
    });
  },
  
  sanitizeStats: (stats) => {
    const s = { ...stats };
    if (s.hp !== undefined) s.hp = Math.max(0, Math.min(s.hp, 999));
    if (s.mp !== undefined) s.mp = Math.max(0, Math.min(s.mp, 999));
    if (s.sanity !== undefined) s.sanity = Math.max(0, Math.min(s.sanity, 999));
    if (s.soul !== undefined) s.soul = Math.max(0, Math.min(s.soul, 999));
    if (s.gold !== undefined) s.gold = Math.max(0, Math.min(s.gold, 999999));
    if (s.xp !== undefined) s.xp = Math.max(0, s.xp);
    if (s.lives !== undefined) s.lives = Math.max(1, Math.min(s.lives, 10));
    if (s.level !== undefined) s.level = Math.max(1, Math.min(s.level, 100));
    if (s.rep !== undefined) s.rep = Math.max(-999, Math.min(s.rep, 999));
    return s;
  },

  updateStats: (statChanges) => set((state) => {
    const sanitizedChanges = get().sanitizeStats(statChanges);
    let newStats = { ...state.stats, ...sanitizedChanges };
    
    // Trigger toasts for significant stat changes
    Object.entries(sanitizedChanges).forEach(([stat, change]) => {
      if (typeof change === 'number' && change !== 0 && ['hp', 'mp', 'gold', 'xp', 'sanity', 'soul', 'rep'].includes(stat)) {
        const sign = change > 0 ? '+' : '';
        const statNames = {
          hp: 'HP', mp: 'MP', gold: 'Vàng', xp: 'EXP', sanity: 'Tâm trí', soul: 'Linh hồn', rep: 'Danh tiếng'
        };
        get().addToast({
          type: 'stat',
          message: `${statNames[stat] || stat}: ${sign}${change}`,
          icon: change > 0 ? '📈' : '📉'
        });
      }
    });

    // Level up logic
    while (newStats.xp >= newStats.level * 100) {
      newStats.xp -= newStats.level * 100;
      newStats.level += 1;
      
      // Gain 3 random attribute points
      const attrs = ['str', 'dex', 'int', 'con', 'wis', 'cha'];
      for (let i = 0; i < 3; i++) {
        const randomAttr = attrs[Math.floor(Math.random() * attrs.length)];
        newStats[randomAttr] += 1;
      }
      
      // Skill slots increase: every 5 levels unlock 1 new slot (max 8)
      newStats.skillSlots = Math.min(8, 1 + Math.floor(newStats.level / 5));
    }
    
    const totalStats = get().getTotalStats();
    let effectiveMaxHp = totalStats.maxHp;
    
    if (state.flags.includes('curse_of_27')) {
      effectiveMaxHp = Math.max(1, Math.floor(effectiveMaxHp * 0.73));
    }
    
    // Handle HP reaching 0
    if (newStats.hp <= 0) {
      const mode = state.difficultyMode || 'normal';
      
      if (mode === 'ironman') {
        get().addToast({
          type: 'error',
          message: 'HÀNH TRÌNH KẾT THÚC. CHẾT VĨNH VIỄN (IRONMAN).',
          icon: '💀'
        });
        // In a real app, we might redirect to a game-over screen or reset completely
        setTimeout(() => window.location.reload(), 3000);
        return { stats: newStats };
      }

      newStats.lives = (newStats.lives || 3) - 1;
      
      // Apply Penalty
      if (mode === 'casual') {
        newStats.gold = Math.max(0, newStats.gold - 10);
      } else if (mode === 'normal') {
        newStats.gold = Math.floor(newStats.gold * 0.5);
      } else if (mode === 'hard') {
        newStats.gold = 0;
        // Logic to lose a random item from inventory
        if (state.inventory.length > 0) {
           const idx = Math.floor(Math.random() * state.inventory.length);
           const lostItem = state.inventory[idx];
           get().removeItem(lostItem.id || lostItem);
           get().addToast({ type: 'error', message: `Mất vật phẩm: ${lostItem.name}`, icon: '💸' });
        }
      }

      if (newStats.lives > 0) {
        newStats.hp = effectiveMaxHp;
        get().addToast({ type: 'warning', message: `Bạn đã gục ngã! Còn ${newStats.lives} mạng.`, icon: '💔' });
      } else {
        newStats.hp = 0;
        get().addToast({ type: 'error', message: `HẾT MẠNG! TRÒ CHƠI KẾT THÚC.`, icon: '⚰️' });
      }
    }
    
    // Cap HP, MP and Sanity
    if (newStats.hp > effectiveMaxHp) newStats.hp = effectiveMaxHp;
    if (newStats.mp > totalStats.maxMp) newStats.mp = totalStats.maxMp;
    if (newStats.sanity > totalStats.maxSanity) newStats.sanity = totalStats.maxSanity;
    if (newStats.lives > newStats.maxLives) newStats.lives = newStats.maxLives;
    if (newStats.hp < 0) newStats.hp = 0;
    if (newStats.mp < 0) newStats.mp = 0;
    if (newStats.sanity < 0) newStats.sanity = 0;
    
    // Check for conditional traits after stat update
    setTimeout(() => get().checkConditionalTraits(), 0);
    
    return { stats: get().sanitizeStats(newStats) }; // Final sanizitation check
  }),

  // World Stats update logic
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

    // Special Transition Handlers
    if (sceneId === 'random_world_jump') {
      setTimeout(() => get().transferToRandomWorld(), 0);
      return state;
    }
    if (sceneId === 'game_over') {
      setTimeout(() => set({ isGameOver: true }), 0);
      return state;
    }
    if (sceneId === 'true_ending') {
      setTimeout(() => get().triggerEnding('true_valedictory'), 0);
      return state;
    }

    let nextState = { 
      currentSceneId: sceneId,
      sceneCount: (state.sceneCount || 0) + 1
    };
    
    // Track event occurrence
    const triggeredEvents = { ...state.triggered_events };
    const lastTriggeredAt = { ...state.last_triggered_at };
    
    if (sceneId.startsWith('ce_') || sceneId.startsWith('se_')) {
      triggeredEvents[sceneId] = (triggeredEvents[sceneId] || 0) + 1;
      lastTriggeredAt[sceneId] = nextState.sceneCount;
      nextState.triggered_events = triggeredEvents;
      nextState.last_triggered_at = lastTriggeredAt;
    }
    
    if (sceneId === "RESUME_JOURNEY" || sceneId === "resume") {
      sceneId = state.intendedSceneId;
      nextState.currentSceneId = sceneId;
      nextState.intendedSceneId = null;
    }
    
    // Support for scene-level effects (like sets_flags)
    // We need to look up the scene object to see if it has entry effects
    const worldScenes = get().getWorldScenes(state.currentWorldId);
    const sceneObj = worldScenes[sceneId];
    if (sceneObj) {
      if (sceneObj.sets_flags) {
        const currentFlags = nextState.flags || state.flags;
        const newFlags = [...new Set([...currentFlags, ...sceneObj.sets_flags])];
        nextState.flags = newFlags;
      }
      
      // Track triggered events
      const triggeredEvents = { ...(nextState.triggered_events || state.triggered_events || {}) };
      triggeredEvents[sceneId] = (triggeredEvents[sceneId] || 0) + 1;
      nextState.triggered_events = triggeredEvents;
      if (sceneObj.addItem) {
        // use get().addItem to trigger side effects (toasts, etc) and update inventory
        setTimeout(() => get().addItem(sceneObj.addItem), 0);
      }
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
      
      // 1. Check for Special Events (10% + seed bonus chance if conditions met)
      const specialChance = 0.1 + (state.seedModifiers?.specialEventBonus || 0);
      if (Math.random() < specialChance) {
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

      // 2. Check for Common Events (base 30% or seed modified)
      const commonChance = state.seedModifiers?.commonEventRate || 0.3;
      if (Math.random() < commonChance) {
        const weathers = ['Nắng ráo', 'Mưa phùn', 'Bão tố', 'Sương mù', 'Nhiều mây', 'Tuyết rơi'];
        const times = ['Ban ngày', 'Ban đêm', 'Bình minh', 'Hoàng hôn'];
        const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
        const newTime = times[Math.floor(Math.random() * times.length)];
        
        const availableEvents = commonEventsData.filter(e => {
          if (!e.weight) return false;
          if (e.min_age && nextState.age < e.min_age) return false;
          
          // Frequency and Cooldown checks
          const count = state.triggered_events[e.id] || 0;
          const lastAt = state.last_triggered_at[e.id] || -999;
          
          if (e.max_occurrences !== null && e.max_occurrences !== undefined && count >= e.max_occurrences) return false;
          if (e.cooldown_scenes && (nextState.sceneCount - lastAt) < e.cooldown_scenes) return false;
          if (e.repeatable === false && count > 0) return false;

          // One-time event check
          if (e.repeatable === false && state.triggered_events && state.triggered_events[e.id]) return false;

          // World agnostic check: no world field or world set to 'all'
          if (e.world && e.world !== 'all' && e.world !== state.currentWorldId) return false;
          return true;
        });
        
        if (availableEvents.length > 0) {
          // Sort by sequence_priority (higher priority first)
          availableEvents.sort((a, b) => (b.sequence_priority || 0) - (a.sequence_priority || 0));
          
          // If there are high priority events, we might want to pick them exclusively
          // or just use them to weight the selection.
          // Let's pick from the top priority tier if they exist.
          const topPriority = availableEvents[0].sequence_priority || 0;
          const priorityPool = availableEvents.filter(e => (e.sequence_priority || 0) === topPriority);

          let totalWeight = 0;
          priorityPool.forEach(e => totalWeight += e.weight);
          
          let randomVal = Math.random() * totalWeight;
          let selectedEventId = priorityPool[0].id;
          
          for (const event of priorityPool) {
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
      monster = RandomEngine.generateMonster(state.currentWorldId, state.stats.lck, null, state.sceneCount);
    } else if (monsterIdOrObj && monsterIdOrObj.fixed_stats) {
      // It's a template
      monster = RandomEngine.generateMonster(state.currentWorldId, state.stats.lck, monsterIdOrObj, state.sceneCount);
    }
    return { inBattle: true, currentMonster: monster };
  }),
  endBattle: () => set({ inBattle: false, currentMonster: null }),
  
  setDifficulty: (level) => set({ difficulty: level }),
  
  addSkill: (skillId) => set((state) => {
    if (state.stats.skills.includes(skillId)) {
      get().addToast({ type: 'info', message: "Bạn đã biết kỹ năng này rồi.", icon: '📚' });
      return state;
    }
    const newSkills = [...state.stats.skills, skillId];
    get().addToast({ type: 'skill', message: `Đã học kỹ năng mới!`, icon: '✨' });
    return { stats: { ...state.stats, skills: newSkills } };
  }),

  buyItem: (item, cost) => set((state) => {
    if (state.stats.gold < cost) {
      get().addToast({ type: 'error', message: "Không đủ vàng!", icon: '💰' });
      return state;
    }
    get().addItem(item);
    return { stats: { ...state.stats, gold: state.stats.gold - cost } };
  }),

  // Persistence Actions
  saveGame: () => {
    const state = get();
    const saveData = {
      playerName: state.playerName,
      personality: state.personality,
      currentWorldId: state.currentWorldId,
      currentSceneId: state.currentSceneId,
      intendedSceneId: state.intendedSceneId,
      stats: state.stats,
      inventory: state.inventory,
      equipment: state.equipment,
      traits: state.traits,
      flags: state.flags,
      triggered_events: state.triggered_events,
      worldVisits: state.worldVisits,
      chapter: state.chapter,
      worldSeed: state.worldSeed,
      seedModifiers: state.seedModifiers,
      sceneCount: state.sceneCount,
      ngPlusLevel: state.ngPlusLevel,
      totalPlayTime: state.totalPlayTime,
      endingsReached: state.endingsReached,
      difficulty: state.difficulty
    };
    localStorage.setItem('wandered_save', JSON.stringify(saveData));
    get().addToast({ type: 'info', message: "Đã lưu trò chơi!", icon: '💾' });
  },

  loadGame: () => {
    const saved = localStorage.getItem('wandered_save');
    if (!saved) {
      get().addToast({ type: 'error', message: "Không tìm thấy dữ liệu lưu trữ.", icon: '⚠️' });
      return;
    }
    const saveData = JSON.parse(saved);
    set(saveData);
    get().addToast({ type: 'info', message: "Đã tải trò chơi!", icon: '📂' });
  },

  resetGame: () => {
    localStorage.removeItem('wandered_save');
    window.location.reload();
  },
  
  transferToRandomWorld: () => {
    const worlds = ['fantasy', 'scifi', 'eastern', 'postapoc'];
    const randomWorld = worlds[Math.floor(Math.random() * worlds.length)];
    const setWorld = get().setWorld;
    const setScene = get().setScene;
    
    setWorld(randomWorld);
    setScene('start');
  },
  loadSave: (saveData) => set({ ...saveData })
}));
