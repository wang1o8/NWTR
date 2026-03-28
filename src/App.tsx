/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from './engine/useGameStore';
import { getScene } from './engine/SceneManager';
import DialogBox from './components/DialogBox';
import ChoiceMenu from './components/ChoiceMenu';
import BattleScreen from './components/BattleScreen';
import ChatBot from './components/ChatBot';
import InventoryView from './components/InventoryView';
import SidebarLeft from './components/SidebarLeft';
import WorldMap from './components/WorldMap';
import StatsBar from './components/StatsBar';
import SocialStatus from './components/SocialStatus';
import EndingScreen from './components/EndingScreen';
import HallOfLegends from './components/HallOfLegends';
import SettingsModal from './components/SettingsModal';
import { ToastNotification } from './components/ToastNotification';
import { Settings } from 'lucide-react';
import worldsData from './data/worlds.json';
import openingsData from './data/openings.json';

function NameInput({ onNext }) {
  const { setPlayerName } = useGameStore();
  const [name, setName] = useState('');
  
  const handleConfirm = () => {
    const finalName = name.trim() || 'Lữ Khách';
    setPlayerName(finalName);
    onNext();
  };

  return (
    <div className="name-input-screen">
      <div className="name-input-box card-premium">
        <h2 className="title-fantasy">Nhập tên của bạn, Kẻ Lữ Hành</h2>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Tên của bạn..."
          maxLength={20}
          className="input-premium"
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
        />
        <button className="btn-primary" onClick={handleConfirm}>Tiếp tục</button>
      </div>
    </div>
  );
}

function OpeningSelection({ onNext }) {
  const { selectOpening } = useGameStore();
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleConfirm = () => {
    if (selected) {
      selectOpening(selected);
      onNext();
    }
  };

  return (
    <div className="opening-selection-screen">
      <h2 className="title-fantasy text-center mb-8">Chọn Xuất Thân Của Bạn</h2>
      <div className="opening-grid">
        {Object.values(openingsData).map(op => (
          <div 
            key={op.id} 
            className={`opening-card glass ${selected === op.id ? 'active' : ''}`}
            onClick={() => handleSelect(op.id)}
          >
            <h3>{op.name}</h3>
            <p>{op.description}</p>
            <div className="opening-stats">
              {Object.entries(op.stats).map(([s, v]) => (
                <span key={s}>{s.toUpperCase()}: {v}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button className="btn-primary" onClick={handleConfirm} disabled={!selected}>Xác nhận xuất thân</button>
      </div>
    </div>
  );
}

function DifficultySelection({ onComplete }) {
  const { setDifficulty } = useGameStore();
  const [selected, setSelected] = useState('normal');

  const modes = [
    { id: 'casual', name: 'Dễ (Casual)', desc: 'Kẻ địch yếu hơn, nhiều tài nguyên hơn. Dành cho người muốn thưởng thức câu chuyện.' },
    { id: 'normal', name: 'Bình thường (Normal)', desc: 'Trải nghiệm cân bằng nhất.' },
    { id: 'hard', name: 'Khó (Hard)', desc: 'Kẻ địch mạnh hơn, tài nguyên khan hiếm. Thử thách thực sự.' },
    { id: 'ironman', name: 'Sắt đá (Ironman)', desc: 'Chỉ một mạng duy nhất. Chết là hết.' }
  ];

  const handleConfirm = () => {
    setDifficulty(selected);
    onComplete();
  };

  return (
    <div className="difficulty-selection-screen">
      <h2 className="title-fantasy text-center mb-8">Chọn Độ Khó</h2>
      <div className="difficulty-list">
        {modes.map(m => (
          <div 
            key={m.id} 
            className={`difficulty-item glass ${selected === m.id ? 'active' : ''}`}
            onClick={() => setSelected(m.id)}
          >
            <h4>{m.name}</h4>
            <p>{m.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button className="btn-primary" onClick={handleConfirm}>Bắt đầu hành trình</button>
      </div>
    </div>
  );
}

export default function App() {
  const { 
    playerName, 
    currentSceneId, 
    currentWorldId, 
    inBattle, 
    setScene, 
    setWorld, 
    startBattle, 
    initializeGame,
    transferToRandomWorld,
    sceneCount,
    isGameOver, // Added isGameOver
    currentEnding // Added currentEnding
  } = useGameStore();
  const [showChatBot, setShowChatBot] = useState(false);
  const [showSidebars, setShowSidebars] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showSocialStatus, setShowSocialStatus] = useState(false);
  const [showHallOfLegends, setShowHallOfLegends] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0); 
  
  useEffect(() => {
    if (sceneCount === 0) {
      initializeGame();
    }
  }, [sceneCount, initializeGame]);

  const scene = getScene(currentSceneId, currentWorldId);
  const world = worldsData[currentWorldId] || worldsData['tutorial'];

  useEffect(() => {
    if (scene && scene.world && scene.world !== currentWorldId) {
      setWorld(scene.world);
    }
    
    if (scene && scene.battle && !inBattle) {
      startBattle(scene.battle.monsterId);
    }

    if (scene && scene.autoNext && !inBattle) {
      const timer = setTimeout(() => {
        if (scene.autoNext === 'RANDOM_WORLD_TRIGGER') {
          transferToRandomWorld();
        } else {
          setScene(scene.autoNext);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scene, currentWorldId, setWorld, setScene, inBattle, startBattle, transferToRandomWorld]);

  if (!scene) {
    return <div className="game-container">Đang tải hoặc không tìm thấy cảnh...</div>;
  }

  const bgStyle = {
    backgroundImage: `url(${world.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  // Replace {playerName} in text
    console.log(`[Flow] Rendering Scene: "${currentSceneId}"`);
    const parsedText = scene.text.replace(/{playerName}/g, playerName || 'Kẻ Lữ Hành');

  const isTutorial = currentWorldId === 'tutorial';

  return (
    <div className="game-container" style={bgStyle}>
      <div className="overlay"></div>
      
      {showSidebars && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setShowSidebars(false)}
        />
      )}
      <div className={`game-layout ${showSidebars ? 'show-sidebars' : 'hide-sidebars'}`}>
        {!inBattle && <SidebarLeft />}
        
        <div className="main-area">
          <div className="top-bar">
            <span>{world.name}</span>
            <div className="top-bar-actions">
              <button onClick={() => setShowSidebars(!showSidebars)} className="lg:hidden">Menu</button>
              <button onClick={() => setShowInventory(true)} className="flex items-center gap-1">🎒 Balo</button>
              <button onClick={() => setShowWorldMap(true)} className="flex items-center gap-1">🗺️ Bản đồ</button>
              <button onClick={() => setShowSocialStatus(true)} className="flex items-center gap-1">🤝 Quan hệ</button>
              <button onClick={() => setShowHallOfLegends(true)} className="flex items-center gap-1">🏆 Huyền thoại</button>
              <button onClick={() => setShowSettings(true)} className="flex items-center gap-1 p-2 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-white" title="Cài đặt">
                <Settings size={18} />
              </button>
              <button onClick={() => setShowChatBot(true)}>Hướng dẫn AI</button>
            </div>
          </div>

          <div className="scene-content fadeIn" key={currentSceneId}>
            {inBattle ? (
              <BattleScreen />
            ) : currentSceneId === 'tutorial_003' ? (
              <div className="onboarding-overlay fadeIn">
                {onboardingStep === 0 && <NameInput onNext={() => setOnboardingStep(1)} />}
                {onboardingStep === 1 && <OpeningSelection onNext={() => setOnboardingStep(2)} />}
                {onboardingStep === 2 && <DifficultySelection onComplete={() => setScene('tutorial_004')} />}
              </div>
            ) : (
              <div className="vn-layout">
                <div className="visual-area">
                  {/* Additional visual elements can go here */}
                </div>
                
                <div className="dialog-area">
                  <DialogBox speakerId={scene.speaker} text={parsedText} />
                  {scene.choices && scene.choices.length > 0 && (
                    <ChoiceMenu choices={scene.choices} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* World Map Modal */}
      {showWorldMap && (
        <div className="map-modal-overlay" onClick={() => setShowWorldMap(false)}>
          <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="map-modal-header">
              <h2>Bản Đồ Thế Giới</h2>
              <button onClick={() => setShowWorldMap(false)}>✕</button>
            </div>
            <WorldMap onClose={() => setShowWorldMap(false)} />
          </div>
        </div>
      )}

      {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
      {showInventory && <InventoryView onClose={() => setShowInventory(false)} />}
      
      {showSocialStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSocialStatus(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full">
            <SocialStatus onClose={() => setShowSocialStatus(false)} />
          </div>
        </div>
      )}

      {isGameOver && <EndingScreen />}
      
      {showHallOfLegends && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowHallOfLegends(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full">
            <HallOfLegends onClose={() => setShowHallOfLegends(false)} />
          </div>
        </div>
      )}

      <StatsBar />
      <ToastNotification />

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {/* Mobile Floating Action Button */}
      <div className="mobile-fab lg:hidden">
        <button onClick={() => setShowWorldMap(true)} aria-label="Open Map">
          🗺️
        </button>
      </div>
    </div>
  );
}
