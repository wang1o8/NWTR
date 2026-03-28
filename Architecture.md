# 🎮 NWTR - Kẻ Lữ Hành Đa Vũ Trụ
## Architecture & System Design

---

## 📋 Tóm Tắt Nhanh
**Loại Project**: Interactive Game/Visual Novel với yếu tố RPG  
**Tech Stack**: React + TypeScript + Zustand + Vite  
**Ngôn Ngữ UI**: Tiếng Việt  
**Công Năng Chính**: Quản lý story flow, chiến đấu, attributes, loot system  

---

## 🏛️ Kiến Trúc Tổng Thể

```
┌─────────────────────────────────────────────────────────────┐
│                      App.tsx (Entry Point)                  │
│                  - Render UI layout chính                   │
│                  - Quản lý scene & dialog                   │
│                  - Detect battle & auto-next                │
└──────────┬───────────────┬────────────────┬─────────────────┘
           │               │                │
    ┌──────▼─┐      ┌──────▼─┐      ┌──────▼──┐
    │ Sidebar │      │  Main  │      │ Sidebar │
    │  Left   │      │ Content│      │ Right   │
    │(Stats)  │      │        │      │(Inv)    │
    └─────────┘      │ Dialog │      └─────────┘
                     │ Choice │
                     │ Battle │
                     └────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
    ┌───▼──────────┐              ┌──────▼─────┐
    │ SceneManager │              │BattleEngine│
    │ (Load scene) │              │(Calculate  │
    │              │              │ damage)    │
    └───┬──────────┘              └────────────┘
        │
    ┌───▼─────────────────────────────────┐
    │      useGameStore (Zustand)         │
    │  - State management tập trung       │
    │  - Player stats, inventory, flags   │
    │  - World state, scene state         │
    └─────────────────────────────────────┘
        │
    ┌───▼─────────────────────────────────┐
    │     Data Files (JSON)               │
    │  - worlds.json (5 worlds)           │
    │  - scenes/ (story branches)         │
    │  - monsters.json (enemies)          │
    │  - weapons.json (loot items)        │
    │  - traits.json (character traits)   │
    └─────────────────────────────────────┘
```

---

## 🎯 Core Components & Their Roles

### **1. App.tsx** (Main Orchestrator)
```
Trách nhiệm:
✓ Render game UI layout
✓ Fetch current scene từ SceneManager
✓ Detect khi có battle → trigger BattleScreen
✓ Detect autoNext scene → tự động chuyển sau 2 giây
✓ Parse {playerName} vào text
✓ Manage sidebars visibility
```

**⚠️ Điểm Cẩn Thận:**
- Line 48-62: useEffect phụ thuộc vào `scene` → nếu scene bị undefined sẽ crash
- Line 73-77: BGStyle phụ thuộc vào `world.image` → cần validate

---

### **2. useGameStore.js** (State Management - ⭐ QUAN TRỌNG)
**File này là "trái tim" của game - mọi state đều qua đây**

#### **Key State Properties:**
```javascript
{
  // Player Info
  playerName: string,
  currentSceneId: string,
  currentWorldId: string,
  
  // Combat
  inBattle: boolean,
  currentMonster: object,
  
  // Stats & Inventory
  stats: {
    hp, maxHp, mp, maxMp, lives, maxLives,
    str, int, agi, def, res, lck,
    level, xp, skillSlots, skills, equippedSkills
  },
  inventory: [weapons],
  equippedWeapon: weapon,
  traits: [trait1, trait2, ...],
  
  // World & Story Progression
  flags: ['visited_fantasy', 'completed_se_001', ...],
  worldStats: { fantasy: {mana, day, loop_count}, ... },
  scenesPassedSinceLastSpecialEvent: number,
  age: number,
  chapter: number
}
```

#### **Critical Functions:**
1. **initializeGame(name)** - Tạo character mới
   - Generate random stats (STR, INT, AGI, DEF, RES, LCK)
   - Pick random world + personality
   - Generate starting weapon & traits
   
2. **setScene(sceneId)** - Chuyển scene + kiểm tra random events
   ```
   FLOW:
   → Kiểm tra đã visited world này chưa?
   → 10% chance: trigger special event
   → 30% chance: trigger common event
   → Nếu không → set scene bình thường
   ```

3. **getTotalStats()** - Tính stats cuối cùng
   - Base stats từ `stats`
   - + bonus từ `equippedWeapon.stats`
   - + bonus từ `traits[].effect`
   - + bonus từ `flags` (ví dụ: curse_of_27)
   
4. **updateStats(changes)** - Update HP/MP/XP
   - Tự động level up khi XP đủ
   - Xử lý HP ≤ 0 → revive hoặc game over
   - Cap HP/MP/Lives vào max

5. **updateWorldStats(worldId, changes)** - Update world-specific state
   - Fantasy: mana, day, loop_count
   - SciFi: battery
   - Eastern: karma
   - PostApoc: radiation

#### **⚠️ ĐIỂM XUNG ĐỘT TIỀM ẨN:**
```
🔴 CRITICAL:
- Line 119-122: curse_of_27 flag → reduce maxHp = 73%
  Nếu có nhiều curse → có thể HP = 0 → instant death
  
- Line 146-159: Level up logic tính toán chứa vòng while
  Nếu XP quá cao → có thể crash

- Line 308-314: startBattle gọi RandomEngine.generateMonster
  Nếu currentWorldId không có monster data → undefined

- flags system: Không có versioning
  Nếu xóa flag → game state bị ảnh hưởng toàn cục
```

---

### **3. SceneManager.js** (Story Loader)
```javascript
getScene(sceneId) → Scene Object từ data/scenes/
```
**⚠️ Cẩn Thận:**
- Nếu sceneId không tồn tại → return undefined
- App.tsx không handle case này tốt (line 69-71)

---

### **4. BattleEngine.js** (Combat Calculator)
```javascript
calculateDamage(playerStats, monster, type, element)
→ { damage, isDodge, isCrit, statusApplied }
```

**Combat Logic:**
```
Player Attack:
  → Tính base damage từ stats
  → Roll dodge chance (enemy DEF)
  → Roll crit chance (player LCK)
  → Apply element effects

Monster Attack:
  → Tương tự
  → Apply status effects (poison, burn, etc.)
  → Update player HP

Victory Condition:
  → Monster HP ≤ 0 → Win
  → Loot drop từ dropTable
  → Gain XP
```

---

### **5. RandomEngine.js** (Procedural Generation)
```javascript
generateMonster(worldId, luck) → Monster object
generateWeapon(worldId, luck, rarity?) → Weapon object
generateTraits(worldId, count, luck) → Traits array
```

**Sử dụng:**
- Mỗi lần vào world mới → generate loot
- Mỗi lần chiến đấu → generate enemy

---

## 🔄 Main Game Flow (Flowchart)

```
START
  ↓
[Player Input Name]
  ↓
initializeGame()
  ├─ Generate Stats
  ├─ Pick Random World
  ├─ Create Starting Equipment
  └─ Set currentSceneId = 'start'
  ↓
MAIN LOOP:
  ├─ getScene(currentSceneId)
  ├─ Render DialogBox + ChoiceMenu
  │
  ├─→ IF Player Click Choice:
  │    └─ setScene(nextSceneId)
  │       ├─ Check 10% Special Event trigger
  │       ├─ Check 30% Common Event trigger
  │       └─ Update scenesPassedSinceLastSpecialEvent
  │
  ├─→ IF Scene has battle:
  │    └─ startBattle(monsterId)
  │       ├─ Generate Monster
  │       └─ Render BattleScreen
  │
  ├─→ IF In Battle:
  │    ├─ Player Action:
  │    │  └─ calculateDamage()
  │    │     ├─ Check Dodge
  │    │     ├─ Check Crit
  │    │     └─ Update Monster HP
  │    │
  │    ├─ Monster Action:
  │    │  └─ calculateDamage()
  │    │     └─ Update Player HP
  │    │
  │    └─ IF Monster HP ≤ 0:
  │       ├─ Victory!
  │       ├─ Roll Loot Drop
  │       ├─ Gain XP
  │       ├─ endBattle()
  │       └─ Continue Story
  │
  │    └─ IF Player Lives = 0:
  │       └─ GAME OVER
  │
  └─→ IF Scene has autoNext:
      └─ Auto transition sau 2 giây
         └─ setScene(autoNext)
```

---

## 📁 Data Structure (JSON Files)

### **worlds.json**
```json
{
  "tutorial": { name, image, ... },
  "fantasy": { name, image, ... },
  "scifi": { ... },
  "eastern": { ... },
  "postapoc": { ... }
}
```

### **scenes/** folder
```
scenes/
├─ tutorial.json    (starting scenes)
├─ fantasy.json     (fantasy world scenes)
├─ scifi.json
├─ eastern.json
├─ postapoc.json
├─ random_events.json
└─ special_events.json
```

**Scene Object Structure:**
```json
{
  "id": "scene_001",
  "text": "Bạn {playerName} đi vào...",
  "speaker": "narrator",
  "choices": [
    {
      "text": "Tấn công",
      "nextScene": "scene_002",
      "effects": { "hp": -10 }
    },
    {
      "text": "Chạy trốn",
      "nextScene": "scene_003"
    }
  ],
  "battle": { "monsterId": "goblin" },
  "autoNext": "scene_004",
  "world": "fantasy",
  "flags": ["required_flag"],
  "rewards": { "xp": 100, "gold": 50 }
}
```

### **monsters.json**
```json
{
  "goblin": {
    "name": "Quái vật goblin",
    "hp": 50,
    "stats": { "str": 8, "def": 3 },
    "dropTable": { "common": 0.6, "rare": 0.3, "nothing": 0.1 }
  }
}
```

---

## ⚠️ HIGH RISK AREAS (Dễ Xung Đột)

### **1. Scene Transitions Bug 🔴**
```javascript
// File: App.tsx line 48-62
useEffect(() => {
  if (scene && scene.battle && !inBattle) {
    startBattle(scene.battle.monsterId);  // ❌ Có thể trigger multiple times
  }
  
  if (scene && scene.autoNext && !inBattle) {
    // ❌ Timer không cancel khi scene change → multiple setScene calls
  }
}, [scene, ...]);
```
**Fix**: Thêm flag để track đã trigger battle chưa

---

### **2. Random Event Spawn Loop 🔴**
```javascript
// File: useGameStore.js line 224-293
setScene(sceneId) → {
  if (Math.random() < 0.1) {
    // Trigger special event
    nextState.currentSceneId = selectedEvent.id
    nextState.intendedSceneId = sceneId  // ⚠️ Resume point
  }
}
```
**Risk**: Nếu intendedSceneId cũng có battle → infinite battle loop

---

### **3. Stat Overflow on Level Up 🔴**
```javascript
// File: useGameStore.js line 146-159
while (newStats.xp >= newStats.level * 100) {
  // ❌ Nếu xp = 1 triệu → vòng lặp 1000+ lần
  newStats.level += 1;
  newStats.maxHp += 10;
  // Có thể crash UI
}
```
**Fix**: Set max level cap

---

### **4. Curse of 27 Exploit 🔴**
```javascript
// File: useGameStore.js line 119-122
if (flags.includes('curse_of_27')) {
  totalStats.lck = (totalStats.lck || 0) + 27;  // ✅ Tốt
  totalStats.maxHp = Math.max(1, Math.floor(...) * 0.73);  // ❌ Nếu HP < 1 → game over
}
```
**Risk**: Player có thể bị instant death từ curse

---

### **5. Monster Generation Null Safety 🔴**
```javascript
// File: BattleScreen.jsx line 86
const weapon = RandomEngine.generateWeapon(
  useGameStore.getState().currentWorldId,  // ❌ Direct store access
  stats.lck
);
```
**Risk**: Race condition nếu world change trước khi weapon generate

---

### **6. World Stats Race Condition 🔴**
```javascript
// File: useGameStore.js line 190-208
updateWorldStats(worldId, changes) {
  // ❌ Không kiểm tra nếu worldId không tồn tại trong worldStats
  const currentWorldStats = state.worldStats[worldId] || {};
  // Có thể tạo world state mới tự động
}
```
**Risk**: Dữ liệu worldStats bị pollute

---

## 🛠️ Maintenance Checklist

### **Khi Thêm World Mới:**
- [ ] Thêm entry vào `worlds.json`
- [ ] Tạo `scenes/{worldName}.json`
- [ ] Tạo `monsters/monsters_{worldName}.json`
- [ ] Tạo `traits/traits_{worldName}.json`
- [ ] Tạo `weapons/weapons_{worldName}.json`
- [ ] Update `worldStats` trong useGameStore (line 79-85)
- [ ] Test monster generation không crash
- [ ] Test scene transition không loop

### **Khi Thêm Scene Mới:**
- [ ] Validate scene ID unique
- [ ] Kiểm tra tất cả `nextScene` reference đều tồn tại
- [ ] Nếu có battle → verify monsterId tồn tại
- [ ] Nếu có autoNext → set timer properly
- [ ] Test {playerName} placeholder

### **Khi Sửa Stat System:**
- [ ] Update level up formula → test overflow
- [ ] Cập nhật getTotalStats() nếu thêm bonus source mới
- [ ] Test curse_of_27 không crush HP

---

## 📊 Component Dependency Map

```
App.tsx
├─ useGameStore (Get state)
├─ SceneManager (Load scenes)
├─ DialogBox
│  └─ No deps
├─ ChoiceMenu
│  └─ useGameStore (setScene on click)
├─ BattleScreen
│  ├─ useGameStore
│  ├─ BattleEngine (calculateDamage)
│  ├─ RandomEngine (generateWeapon on loot)
│  └─ ItemCard
├─ ChatBot
│  └─ useGameStore
├─ SidebarLeft
│  └─ useGameStore (stats, inventory)
├─ SidebarRight
│  └─ useGameStore (world info)
└─ StatsBar
   └─ useGameStore (HP, MP bars)
```

---

## 🎯 Quick Reference for Devs

| Cần Làm Gì | Tìm File Nào | Function Nào |
|---|---|---|
| Thêm scene mới | `src/data/scenes/` | Tạo JSON |
| Thay đổi stats | `useGameStore.js` | `updateStats()` |
| Sửa combat logic | `BattleEngine.js` | `calculateDamage()` |
| Add world | `worlds.json` | + data files |
| Debug scene transition | `App.tsx` | `useEffect` line 48-62 |
| Check player equipment | `useGameStore.js` | `getTotalStats()` |
| Generate loot | `RandomEngine.js` | `generateWeapon()` |
| Check random events | `useGameStore.js` | `setScene()` line 234-292 |

---

## 📞 Questions?

- **Crash on scene load?** → Check `getScene()` return null
- **Battle trigger multiple times?** → Check `inBattle` flag
- **Stats overflow?** → Check level up while loop
- **Random event stuck?** → Check `intendedSceneId` loop
- **Can't load world?** → Check `worlds.json` entry