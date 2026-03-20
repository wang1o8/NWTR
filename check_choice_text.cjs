const fs = require('fs');
const path = require('path');

const scenesDir = path.join(__dirname, 'src/data/scenes');
const files = fs.readdirSync(scenesDir);

files.forEach(file => {
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(scenesDir, file), 'utf8'));
    for (const [sceneId, scene] of Object.entries(data)) {
      if (scene.choices) {
        scene.choices.forEach((choice, idx) => {
          if (typeof choice.text !== 'string') {
            console.log(`Missing/non-string text in choice ${idx} of scene: ${sceneId} in file: ${file}`);
          }
        });
      }
    }
  }
});
