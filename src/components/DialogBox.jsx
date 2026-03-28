import npcData from '../data/npcs.json';

export default function DialogBox({ speakerId, text }) {
  const { playerName, inventory, currentWorldId, npcs, removeItem, addToast } = useGameStore();
  const [showGiftMenu, setShowGiftMenu] = React.useState(false);
  
  let speaker = null;
  if (speakerId === 'player') {
    speaker = {
      name: playerName,
      color: '#4ade80',
      image: null
    };
  } else if (speakerId) {
    // Find speaker in unified NPC data across all worlds
    const allNpcs = Object.values(npcData).flat();
    const foundNpc = allNpcs.find(n => n.id === speakerId);
    
    if (foundNpc) {
      speaker = {
        name: foundNpc.name,
        color: foundNpc.color || '#fff',
        image: foundNpc.image || foundNpc.portrait || null
      };
    } else {
      // Fallback
      speaker = { name: speakerId, color: '#fff', image: null };
    }
  }

  // Check if current speaker is a social NPC
  const socialNPC = (npcs[currentWorldId] || []).find(n => n.id === speakerId);

  const handleGift = (itemId) => {
    const result = SocialEngine.processGift(socialNPC, itemId);
    removeItem(itemId);
    addToast({ 
      type: result.type === 'hated' ? 'error' : 'success', 
      message: `${socialNPC.name}: "${result.reaction}"`,
      icon: result.type === 'loved' ? '❤️' : '🎁'
    });
    setShowGiftMenu(false);
  };
  
  return (
    <div className="dialog-box-container">
      {speaker && speaker.image && (
        <img src={speaker.image} alt={speaker.name} className="speaker-portrait" referrerPolicy="no-referrer" />
      )}
      <div className="dialog-box">
        {speaker && (
          <div className="speaker-name" style={{ color: speaker.color || '#fff' }}>
            {speaker.name}
          </div>
        )}
        <div className="dialog-text">
          {text}
        </div>
        
        {socialNPC && !showGiftMenu && (
          <button 
            className="gift-button-trigger"
            onClick={() => setShowGiftMenu(true)}
          >
            🎁 Tặng quà
          </button>
        )}

        {showGiftMenu && (
          <div className="gift-selection-overlay fadeIn">
            <div className="gift-menu-header">
              <span>Chọn quà cho {socialNPC.name}</span>
              <button onClick={() => setShowGiftMenu(false)}>✕</button>
            </div>
            <div className="gift-list">
              {inventory.length > 0 ? (
                inventory.map((item, idx) => {
                  const itemId = typeof item === 'string' ? item : item.id;
                  const itemName = typeof item === 'string' ? itemsData[item]?.name || item : item.name;
                  return (
                    <button key={idx} onClick={() => handleGift(itemId)} className="gift-item-btn">
                      {itemName}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs opacity-50 p-2">Không có vật phẩm nào để tặng.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
