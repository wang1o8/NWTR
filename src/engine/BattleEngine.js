export const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

const getStat = (entity, statName) => {
  if (!entity) return 0;
  
  // Prefer direct properties then stats object
  const searchKeys = [statName, statName.toLowerCase()];
  if (statName === 'str') searchKeys.push('physAtk', 'attack');
  if (statName === 'int') searchKeys.push('magAtk', 'magic');
  
  for (const key of searchKeys) {
    if (typeof entity[key] === 'number') return entity[key];
    if (entity.stats && typeof entity.stats[key] === 'number') return entity.stats[key];
  }

  // Deep search in stats
  if (entity.stats) {
    const lowerName = statName.toLowerCase();
    for (const key in entity.stats) {
      if (key.toLowerCase() === lowerName && typeof entity.stats[key] === 'number') {
        return entity.stats[key];
      }
    }
  }
  return 0;
};

export const rollInitiative = (entity) => {
  const dex = getStat(entity, 'dex') || 10;
  return rollDice(20) + Math.floor(dex / 2);
};

export const calculateDamage = (attacker, defender, type = 'physical', options = {}) => {
  const { element = null, isDefending = false, skillMultiplier = 1 } = options;
  
  // 1. Roll for Dodge
  const dodgeChance = (getStat(defender, 'dex') || 10) / 400; // 10 DEX = 2.5% dodge
  if (Math.random() < dodgeChance) {
    return { damage: 0, roll: 0, isDodge: true, isCrit: false, msg: "NÉ TRÁNH!" };
  }

  // 2. Base Damage Components
  let str = getStat(attacker, 'str');
  let int = getStat(attacker, 'int');
  
  // SUPPORT LEGACY MONSTER STATS (minDmg/maxDmg)
  const legacyMin = getStat(attacker, 'minDmg') || getStat(attacker, 'min_dmg');
  const legacyMax = getStat(attacker, 'maxDmg') || getStat(attacker, 'max_dmg');
  
  if (legacyMin > 0 && str === 0) str = legacyMin;
  if (legacyMax > 0 && str === legacyMin) {
      // If we have a range, use it as a base
      // We'll treat str as the average or min, and diceSize as the spread
  }

  const weapon = attacker.equipment?.weapon || attacker.equippedWeapon || null;
  const weaponDmg = weapon?.damage || weapon?.atk || 0;
  let diceSize = weapon?.diceSize || 6;

  // Use legacy spread if available
  if (legacyMax > legacyMin) {
      diceSize = legacyMax - legacyMin + 1;
  }
  
  const baseDamage = type === 'physical' ? (str + weaponDmg) : (int + weaponDmg);
  const roll = rollDice(diceSize);
  
  // 3. Defense Components
  const def = getStat(defender, 'con') || 10; // Use CON for physical defense base
  const res = getStat(defender, 'wis') || 10; // Use WIS for magic defense base
  
  // SUM RELEVANT ARMOR DEFENSE
  let armorDef = 0;
  if (defender.equipment) {
    ['head', 'chest', 'legs'].forEach(slot => {
        if (defender.equipment[slot]) armorDef += (defender.equipment[slot].defense || defender.equipment[slot].def || 0);
    });
  } else if (defender.equippedArmor) {
    armorDef = defender.equippedArmor.defense || 0;
  }

  const totalDef = type === 'physical' ? (def + armorDef) : (res + armorDef);
  
  // 4. Calculate Raw Damage: (Base + Roll) - (DEF / 2)
  let damage = (baseDamage + roll) * skillMultiplier - (totalDef / 2);
  
  // 5. Roll for Critical
  const critChance = (getStat(attacker, 'dex') || 10) / 300; // 10 DEX = 3.3% crit
  const isCrit = Math.random() < critChance;
  const critMult = attacker.multipliers?.crit_dmg || 1.5;
  if (isCrit) damage *= critMult;

  // 6. Apply Defending Modifier
  if (isDefending) damage *= 0.5;

  // 7. Element Modifiers
  if (element && defender.weakness === element) damage *= 1.5;
  if (element && defender.resistance === element) damage *= 0.7;
  if (element && defender.immunity === element) damage = 0;

  const finalDamage = Math.max(1, Math.floor(damage));

  return { 
    damage: finalDamage, 
    roll, 
    diceSize,
    isCrit, 
    isDodge: false,
    msg: isCrit ? "CHÍ MẠNG!" : (isDefending ? "PHÒNG THỦ!" : "")
  };
};
