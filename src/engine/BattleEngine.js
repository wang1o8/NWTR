export const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

const getStat = (entity, statName) => {
  const lower = statName.toLowerCase();
  const upper = statName.toUpperCase();
  return entity[lower] || entity[upper] || entity.stats?.[lower] || entity.stats?.[upper] || 0;
};

export const calculateDamage = (attacker, defender, type = 'physical', element = null) => {
  const attackerLck = getStat(attacker, 'lck') || 10;
  const defenderAgi = getStat(defender, 'agi') || 10;
  
  const isCrit = Math.random() < (attackerLck * 0.005);
  const dodgeChance = defenderAgi * 0.005;
  const isDodge = Math.random() < dodgeChance;

  if (isDodge) return { damage: 0, roll: 0, isDodge: true };

  let baseAtk = type === 'physical' ? (getStat(attacker, 'str') || 10) * 2 : (getStat(attacker, 'int') || 10) * 2;
  const roll = rollDice(attacker.weaponDice || 6);
  
  let damage = baseAtk + roll;
  if (isCrit) damage *= 2;

  if (type === 'physical') {
    const def = getStat(defender, 'def') || 0;
    const armor = getStat(defender, 'armor') || 0;
    damage = Math.max(1, damage - def - armor);
  } else {
    damage = Math.max(1, damage * (1 - ((getStat(defender, 'res') || 0) / 100)));
  }

  // Element multipliers
  if (element && defender.weakness === element) damage *= 1.5;
  if (element && defender.resistance === element) damage *= 0.5;
  if (element && defender.immunity === element) damage = 0;

  return { damage: Math.floor(damage), roll, isCrit, isDodge: false };
};
