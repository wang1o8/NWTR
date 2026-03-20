import rarities from '../data/base/rarities.json';
import specialRules from '../data/base/special_rules.json';
import visualConfig from '../data/base/visual_config.json';

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
        specialEffect
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

  static generateMonster(worldId, luck = 0) {
    const rarity = this.rollRarity(luck); // Higher luck might spawn rarer monsters? Or maybe player level.
    const worldMeta = worldData[worldId]?.monsters || worldData.dark_fantasy.monsters;
    
    const baseType = worldMeta.base_types[Math.floor(Math.random() * worldMeta.base_types.length)];
    const prefix = weaponsBase.name_prefixes[rarity.id]; // Reuse prefixes or create monster specific ones
    const name = `${prefix} · ${worldMeta.world_adjective} ${baseType.name}`;
    
    const stats = {
        maxHp: 50 * rarity.maxStats,
        STR: 5 * rarity.maxStats
    };
    
    const numExtraStats = Math.max(0, rarity.maxStats - 2);
    const availableStats = [...monstersBase.stat_pool].sort(() => 0.5 - Math.random());
    
    for(let i=0; i<numExtraStats && i<availableStats.length; i++) {
        stats[availableStats[i]] = this.rollStatValue(rarity);
    }
    
    const numSkills = rarity.id === 'MYTHIC' ? 3 : (rarity.id === 'EPIC' || rarity.id === 'LEGENDARY' ? 2 : 1);
    const skills = [];
    const availableSkills = [...worldMeta.skills].sort(() => 0.5 - Math.random());
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
        dropTable: monstersBase.drop_table[rarity.id]
    };
  }
}
