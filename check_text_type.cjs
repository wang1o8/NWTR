const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, 'src/data/scenes');
const files = fs.readdirSync(scenesDir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(scenesDir, file), 'utf8'));
    for (const [sceneId, scene] of Object.entries(data)) {
      if (typeof scene.text !== 'string') {
        console.log(`Non-string text in scene: ${sceneId} in file: ${file}, type: ${typeof scene.text}`);
      }
    }
  }
});
