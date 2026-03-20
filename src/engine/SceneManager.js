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

export const getScene = (sceneId) => {
  return allScenes[sceneId] || null;
};

export const evaluateRequires = (requires, flags, stats) => {
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
  
  if (requires.stats) {
    for (const [stat, condition] of Object.entries(requires.stats)) {
      const val = stats[stat] || 0;
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
  
  return true;
};

export const applySets = (sets, setFlag, updateStats, addItem, currentStats, updateWorldStats, currentWorldId) => {
  if (!sets) return;
  
  if (sets.flags) {
    sets.flags.forEach(flag => setFlag(flag));
  }
  
  if (sets.stats) {
    const newStats = {};
    for (const [key, val] of Object.entries(sets.stats)) {
      if (typeof val === 'string' && (val.startsWith('+') || val.startsWith('-'))) {
        newStats[key] = (currentStats[key] || 0) + parseInt(val);
      } else {
        newStats[key] = val;
      }
    }
    updateStats(newStats);
  }
  
  if (sets.worldStats && currentWorldId) {
    updateWorldStats(currentWorldId, sets.worldStats);
  }
  
  if (sets.addItem) {
    addItem(sets.addItem);
  }

  if (sets.generateWeapon) {
    const weapon = RandomEngine.generateWeapon(currentWorldId, currentStats.lck || 10);
    addItem(weapon);
  }
};
