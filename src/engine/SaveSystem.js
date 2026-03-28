export const saveGame = (state) => {
  const saveData = {
    flags: state.flags,
    inventory: state.inventory,
    stats: state.stats,
    currentSceneId: state.currentSceneId,
    currentWorldId: state.currentWorldId
  };
  localStorage.setItem('vn_rpg_save', JSON.stringify(saveData));
};

export const loadGame = () => {
  const saveStr = localStorage.getItem('vn_rpg_save');
  if (saveStr) {
    try {
      return JSON.parse(saveStr);
    } catch (e) {
      console.error("Failed to parse save file", e);
      return null;
    }
  }
  return null;
};
