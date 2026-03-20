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
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import StatsBar from './components/StatsBar';
import worldsData from './data/worlds.json';

function NameInput() {
  const { initializeGame } = useGameStore();
  const [name, setName] = useState('');
  
  return (
    <div className="name-input-screen">
      <div className="name-input-box">
        <h2>Nhập tên của bạn, Kẻ Lữ Hành</h2>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Tên của bạn (Kẻ Lữ Hành)"
          maxLength={20}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && initializeGame(name.trim())}
        />
        <button onClick={() => name.trim() && initializeGame(name.trim())}>Bắt đầu hành trình</button>
      </div>
    </div>
  );
}

export default function App() {
  const { playerName, currentSceneId, currentWorldId, inBattle, setScene, setWorld, startBattle } = useGameStore();
  const [showChatBot, setShowChatBot] = useState(false);
  const [showSidebars, setShowSidebars] = useState(false);
  
  const scene = getScene(currentSceneId);
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
        setScene(scene.autoNext);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [scene, currentWorldId, setWorld, setScene, inBattle, startBattle]);

  if (!playerName) {
    return <NameInput />;
  }

  if (!scene) {
    return <div className="game-container">Đang tải hoặc không tìm thấy cảnh...</div>;
  }

  const bgStyle = {
    backgroundImage: `url(${world.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  // Replace {playerName} in text
  const parsedText = scene.text.replace(/{playerName}/g, playerName);

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
        <SidebarLeft />
        
        <div className="main-area">
          <div className="top-bar">
            <span>{world.name}</span>
            <div className="top-bar-actions">
              <button onClick={() => setShowSidebars(!showSidebars)} className="lg:hidden">Menu</button>
              <button onClick={() => setShowChatBot(true)}>Hướng dẫn AI</button>
            </div>
          </div>

          <div className="scene-content">
            {inBattle && scene.battle ? (
              <BattleScreen battleConfig={scene.battle} />
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
        
        <SidebarRight />
      </div>

      {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}
      <StatsBar />
    </div>
  );
}
