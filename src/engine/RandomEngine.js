import config from '../data/base/config_global.json';
const { rarities, specialRules, visual: visualConfig } = config;
import { useGameStore } from './useGameStore';

import weaponsBase from '../data/weapons/weapons_base.json';
import weaponsDarkFantasy from '../data/weapons/weapons_dark_fantasy.json';
import weaponsScifi from '../data/weapons/weapons_scifi.json';
import weaponsEastern from '../data/weapons/weapons_eastern.json';
import weaponsPostapoc from '../data/weapons/weapons_postapoc.json';

import traitsBase from '../data/traits/traits_base.json';
import traitsDarkFantasy from '../data/traits/traits_dark_fantasy.json';
import traitsScifi from '../data/traits/traits_scifi.json';
import traitsEastern from '../data/traits/traits_eastern.json';
import traitsPostapoc from '../data/traits/traits_postapoc.json';

import monstersBase from '../data/monsters/monsters_base.json';
import monstersDarkFantasy from '../data/monsters/monsters_dark_fantasy.json';
import monstersScifi from '../data/monsters/monsters_scifi.json';
import monstersEastern from '../data/monsters/monsters_eastern.json';
import monstersPostapoc from '../data/monsters/monsters_postapoc.json';

const worldData = {
  dark_fantasy: { weapons: weaponsDarkFantasy, traits: traitsDarkFantasy, monsters: monstersDarkFantasy },
  scifi: { weapons: weaponsScifi, traits: traitsScifi, monsters: monstersScifi },
  eastern: { weapons: weaponsEastern, traits: traitsEastern, monsters: monstersEastern },
  postapoc: { weapons: weaponsPostapoc, traits: traitsPostapoc, monsters: monstersPostapoc }
};

export class RandomEngine {
  static getDifficultyMults() {
    const mode = useGameStore.getState().difficultyMode || 'normal';
    switch (mode) {
      case 'casual': return { stats: 0.8, loot: 1.5, gold: 1.5 };
      case 'hard': return { stats: 1.3, loot: 0.8, gold: 0.8 };
      case 'ironman': return { stats: 1.5, loot: 0.5, gold: 0.5 };
      default: return { stats: 1.0, loot: 1.0, gold: 1.0 };
    }
  }

  static rollRarity(luck = 0) {
    const luckBonus = Math.floor(luck / specialRules.luck_scaling.points_per_tier_up) * specialRules.luck_scaling.chance_increase_per_point;
    
    let roll = Math.random();
    let cumulativeChance = 0;
    
    // Adjust chances based on luck (simplified: add luck bonus to higher tiers, subtract from common)
    // A more robust system would recalculate weights. For now, we just do a basic roll.
    // Let's do a simple weight system.
    let weights = rarities.map(r => r.chance);
    
    // Apply luck bonus (shift weight from common to higher tiers)
    if (luckBonus > 0) {
        weights[0] = Math.max(0, weights[0] - luckBonus * 5); // Reduce common
        for(let i=1; i<weights.length; i++) {
            weights[i] += luckBonus;
        }
    }
    
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    roll = roll * totalWeight;
    
    for (let i = 0; i < rarities.length; i++) {
      cumulativeChance += weights[i];
      if (roll <= cumulativeChance) {
        return rarities[i];
      }
    }
    return rarities[0];
  }

  static rollStatValue(rarity, isNegativeChance = specialRules.negative_chance) {
    const isNegative = Math.random() < isNegativeChance;
    const isSpecial27 = Math.random() < specialRules.number_27.chance;
    
    if (isSpecial27) return isNegative ? -27 : 27;
    
    // Base stat range based on rarity maxStats (just as a multiplier for now)
    const baseVal = Math.floor(Math.random() * 10) + (rarity.maxStats * 2);
    return isNegative ? -baseVal : baseVal;
  }

  static generateWeapon(worldId, luck = 0, forcedRarity = null) {
    const rarity = forcedRarity || this.rollRarity(luck);
    const worldMeta = worldData[worldId]?.weapons || worldData.dark_fantasy.weapons;
    
    const baseType = weaponsBase.base_types[Math.floor(Math.random() * weaponsBase.base_types.length)];
    const prefix = weaponsBase.name_prefixes[rarity.id];
    const name = `${prefix} · ${worldMeta.world_prefix} ${baseType.name}`;
    
    const stats = {};
    const numStats = Math.floor(Math.random() * rarity.maxStats) + 1;
    
    // Shuffle stat pool
    const availableStats = [...weaponsBase.stat_pool].sort(() => 0.5 - Math.random());
    
    for(let i=0; i<numStats && i<availableStats.length; i++) {
        stats[availableStats[i]] = this.rollStatValue(rarity);
    }
    
    let specialEffect = null;
    if (Math.random() < rarity.specialEffectChance) {
        specialEffect = weaponsBase.special_effects[Math.floor(Math.random() * weaponsBase.special_effects.length)];
    }
    
    return {
        id: `wep_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        name,
        type: 'weapon',
        baseType: baseType.id,
        icon: baseType.icon,
        rarity: rarity.id,
        rarityData: rarity,
        element: worldMeta.element,
        stats,
        specialEffect,
        price: (rarity.maxStats * 150) + (Math.floor(Math.random() * 50))
    };
  }

  static generateTraits(worldId, count = 3, luck = 0) {
    const traits = [];
    const worldMeta = worldData[worldId]?.traits || { world: [] };
    
    const allPools = [
        ...traitsBase.combat,
        ...traitsBase.magic,
        ...traitsBase.luck,
        ...traitsBase.cursed,
        ...worldMeta.world
    ];
    
    for(let i=0; i<count; i++) {
        const rarity = this.rollRarity(luck);
        let pool = allPools;
        
        // 5% chance for hidden trait
        if (Math.random() < 0.05) {
            pool = traitsBase.hidden;
        }
        
        const baseTrait = pool[Math.floor(Math.random() * pool.length)];
        
        // Clone and apply rarity scaling to effects
        const effect = {};
        for (const [key, val] of Object.entries(baseTrait.effect)) {
            // 15% chance to invert stat if not already negative
            const isNegative = !baseTrait.is_negative && Math.random() < specialRules.negative_chance;
            const isSpecial27 = Math.random() < specialRules.number_27.chance;
            
            let finalVal = isSpecial27 ? 27 : Math.floor(val * (1 + rarity.maxStats * 0.2));
            if (isNegative) finalVal = -finalVal;
            
            effect[key] = finalVal;
        }
        
        traits.push({
            ...baseTrait,
            rarity: rarity.id,
            rarityData: rarity,
            effect
        });
    }
    return traits;
  }

  static generateMonster(worldId, luck = 0, template = null, scenesPassed = 0) {
    if (template && template.fixed_stats) {
        return {
            ...template,
            id: template.id || `mon_${Date.now()}_${Math.floor(Math.random()*1000)}`,
            currentHp: template.stats.maxHp,
            currentMp: template.stats.maxMp || 0
        };
    }

    const rarity = this.rollRarity(luck);
    const worldMeta = worldData[worldId]?.monsters || worldData.dark_fantasy.monsters;
    const baseTypes = worldMeta?.base_types || Object.values(worldMeta).map(m => ({ name: m.name, icon: m.icon || '👾' }));
    const baseType = baseTypes.length > 0 ? baseTypes[Math.floor(Math.random() * baseTypes.length)] : { name: 'Quái vật vô danh', icon: '👾' };
    const prefix = rarity.name || 'Thường';
    const name = `${prefix} · ${worldMeta.world_adjective || 'Hư vô'} ${baseType.name}`;

    // Step 1: Stat count hard cap
    const RARITY_STAT_COUNT = {
        'COMMON': 0,
        'UNCOMMON': 1,
        'RARE': 2,
        'EPIC': 3,
        'LEGENDARY': 4,
        'MYTHIC': 5
    };

    // Step 2: Base values and scaling (5% per level as per progression_spec.md)
    const playerLevel = useGameStore.getState().stats.level || 1;
    const getScale = (level) => 1 + (0.05 * (level - 1));
    const scale = getScale(playerLevel);

    const getBaseStats = (rarityId, scenes) => {
        if (scenes <= 5) {
            if (rarityId === 'COMMON') return { hp: [8, 15], atk: [2, 4] };
            return { hp: [12, 20], atk: [3, 5] };
        } else if (scenes <= 20) {
            if (rarityId === 'COMMON') return { hp: [15, 30], atk: [4, 7] };
            if (rarityId === 'UNCOMMON') return { hp: [25, 40], atk: [6, 10] };
            return { hp: [35, 55], atk: [8, 14] };
        } else if (scenes <= 50) {
            if (rarityId === 'COMMON') return { hp: [30, 50], atk: [7, 12] };
            if (rarityId === 'UNCOMMON') return { hp: [45, 70], atk: [10, 16] };
            if (rarityId === 'RARE') return { hp: [60, 90], atk: [14, 22] };
            return { hp: [80, 120], atk: [20, 30] };
        }
        // Default scaling for 51+
        const baseMult = 1 + (Math.floor((scenes - 50) / 25) * 0.2);
        return { 
            hp: [Math.floor(80 * baseMult), Math.floor(120 * baseMult)], 
            atk: [Math.floor(20 * baseMult), Math.floor(30 * baseMult)] 
        };
    };

    const baseRanges = getBaseStats(rarity.id, scenesPassed);
    const rollInRange = (range) => Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

    // NG+ and Seed Scaling modifiers
    const diffMults = this.getDifficultyMults();
    const ngPlusLevel = useGameStore.getState().ngPlusLevel || 0;
    const seedMult = useGameStore.getState().seedModifiers?.enemyStatMultiplier || 1;
    const isBoss = template?.is_boss || false;
    const bossMult = isBoss ? 1.3 : 1.0; // Bosses are 30% stronger as per logic test 3
    const ngMult = (1 + (0.3 * ngPlusLevel)) * seedMult * diffMults.stats * bossMult; 
    const stats = {
        maxHp: Math.floor(rollInRange(baseRanges.hp) * ngMult),
        str: Math.floor(rollInRange(baseRanges.atk) * ngMult),
        physAtk: Math.floor(rollInRange(baseRanges.atk) * ngMult),
        int: Math.floor(rollInRange(baseRanges.atk) * (ngMult * 0.8)),
        magAtk: Math.floor(rollInRange(baseRanges.atk) * (ngMult * 0.8)),
        dex: 10 + (ngPlusLevel * 2),
        con: 10 + (ngPlusLevel * 1),
        wis: 10 + (ngPlusLevel * 1),
        cha: 5,
        dodge: 5 + (ngPlusLevel * 2),
        physicalResist: 0,
        magicResist: 0,
        critChance: 0 + (ngPlusLevel * 1),
        critDamage: 150 + (ngPlusLevel * 10),
        initiative: 5 + (ngPlusLevel * 2)
    };

    // Step 3: Sub-stats pool
    let subStatPool = [
        { id: 'physicalResist', name: 'DEF', range: [2, 8] },
        { id: 'magicResist', name: 'RES', range: [2, 8] },
        { id: 'initiative', name: 'AGI', range: [2, 6] }
    ];

    if (['RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'].includes(rarity.id)) {
        subStatPool.push({ id: 'hpRegen', name: 'REGEN', range: [1, 5] });
    }
    if (['EPIC', 'LEGENDARY', 'MYTHIC'].includes(rarity.id)) {
        subStatPool.push({ id: 'critChance', name: 'CRIT_RATE', range: [5, 15] });
    }

    const statCount = RARITY_STAT_COUNT[rarity.id] || 0;
    for (let i = 0; i < statCount && subStatPool.length > 0; i++) {
        const idx = Math.floor(Math.random() * subStatPool.length);
        const subStat = subStatPool.splice(idx, 1)[0];
        const val = rollInRange(subStat.range);
        stats[subStat.id] = (stats[subStat.id] || 0) + Math.floor(val * scale);
    }

    // Step 4: Special effect for Mythic
    let specialEffect = null;
    if (rarity.id === 'MYTHIC') {
        const effects = [
            { id: 'revive', name: 'Hồi sinh', description: 'Hồi sinh 1 lần với 30% HP' },
            { id: 'summon', name: 'Triệu hồi', description: 'Triệu hồi thêm quái vật' },
            { id: 'phase_shift', name: 'Chuyển pha', description: 'Thay đổi kháng tính khi thấp máu' }
        ];
        specialEffect = effects[Math.floor(Math.random() * effects.length)];
    }

    const numSkills = rarity.id === 'MYTHIC' ? 3 : (['EPIC', 'LEGENDARY'].includes(rarity.id) ? 2 : 1);
    const skills = [];
    const skillSource = worldMeta.skills || (combatConfig.skills?.enemy || []);
    const availableSkills = [...skillSource].sort(() => 0.5 - Math.random());
    for(let i=0; i<numSkills && i<availableSkills.length; i++) {
        skills.push(availableSkills[i]);
    }

    return {
        id: `mon_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        name,
        icon: baseType.icon,
        rarity: rarity.id,
        rarityData: rarity,
        stats,
        skills,
        specialEffect,
        dropTable: monstersBase.drop_table[rarity.id]
    };
  }

  static rollLoot(monster, luck = 0) {
    const loot = { gold: 0, items: [], materials: [] };
    
    // 1. Gold Reward (based on monster rarity)
    const diffMults = this.getDifficultyMults();
    const goldMultiplier = {
        'COMMON': 1.0, 'UNCOMMON': 1.5, 'RARE': 2.5,
        'EPIC': 5.0, 'LEGENDARY': 10.0, 'MYTHIC': 25.0
    };
    const baseGold = 30 + Math.floor(Math.random() * 40);
    loot.gold = Math.floor(baseGold * (goldMultiplier[monster.rarity] || 1) * diffMults.gold);

    // 2. Item Drop (LCK scaling + Seed)
    const baseDropChance = 0.3; // 30% base
    const seedBonus = useGameStore.getState().seedModifiers?.rareDropBonus || 0;
    const finalDropChance = Math.min(0.95, (baseDropChance + (luck * 0.01) + seedBonus) * diffMults.loot);

    if (Math.random() < finalDropChance) {
        // Drop an item based on monster rarity or world
        const worldId = monster.world || 'fantasy';
        const item = this.generateWeapon(worldId, luck);
        loot.items.push(item);
    }

    // 3. Material Drop (50% chance)
    if (Math.random() < 0.5) {
        const materials = ['Thép Rỉ', 'Linh Hồn Thạch', 'Mảnh Chip', 'Vảy Rồng'];
        loot.materials.push(materials[Math.floor(Math.random() * materials.length)]);
    }

    return loot;
  }
}
