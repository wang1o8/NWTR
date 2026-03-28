import { useGameStore } from './useGameStore';
import giftsData from '../data/gifts.json';

export class SocialEngine {
  static getAffectionRange(affection) {
    if (affection <= -51) return 'Hostile';
    if (affection <= -11) return 'Unfriendly';
    if (affection <= 10) return 'Neutral';
    if (affection <= 50) return 'Friendly';
    return 'Close';
  }

  static getReputationThreshold(reputation) {
    if (reputation <= -61) return 'Notorious';
    if (reputation <= -31) return 'Criminal';
    if (reputation <= 30) return 'Unknown';
    if (reputation <= 60) return 'Heroic';
    return 'Legendary';
  }

  static performStatCheck(statName, difficulty = 10) {
    const stats = useGameStore.getState().stats;
    const playerStat = stats[statName.toLowerCase()] || 10;
    
    // Simple roll: player stat + 1d20 vs difficulty
    const roll = Math.floor(Math.random() * 20) + 1;
    const result = (playerStat + roll) >= difficulty;
    
    return {
      success: result,
      roll: roll,
      total: playerStat + roll,
      diff: difficulty
    };
  }

  static processGift(npc, itemId) {
    const { updateAffection } = useGameStore.getState();
    const isLoved = npc.preferences.loved.includes(itemId);
    const isHated = npc.preferences.hated.includes(itemId);
    
    let delta = giftsData.gift_values.neutral;
    let reaction = "Cảm ơn bạn, tôi sẽ nhận nó.";
    let type = 'neutral';

    if (isLoved) {
      delta = giftsData.gift_values.loved;
      reaction = "Tuyệt vời! Đây chính là thứ tôi đang tìm kiếm.";
      type = 'loved';
    } else if (isHated) {
      delta = giftsData.gift_values.hated;
      reaction = "Thứ này... thật kinh tởm. Làm ơn mang nó đi chỗ khác.";
      type = 'hated';
    }

    // EDGE CASE 4: Gift cooldown (once per scene)
    const currentSceneCount = useGameStore.getState().sceneCount;
    if (npc.lastGiftSceneCount === currentSceneCount) {
      return { delta: 0, reaction: "Tôi đã nhận đủ quà cho lúc này rồi. Cảm ơn nhé!", type: 'cooldown' };
    }
    
    // Identify worldId of NPC
    const worldId = useGameStore.getState().currentWorldId;
    updateAffection(worldId, npc.id, delta, { lastGiftSceneCount: currentSceneCount });
    
    return { delta, reaction, type, lastGiftSceneCount: currentSceneCount };
  }

  static getPriceMultiplier(npc) {
    const range = this.getAffectionRange(npc.affection);
    switch (range) {
      case 'Hostile': return 999; // Won't sell
      case 'Unfriendly': return 1.5;
      case 'Friendly': return 0.8;
      case 'Close': return 0.6;
      default: return 1.0;
    }
  }
}
