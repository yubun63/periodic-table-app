const fs = require('fs');
const path = require('path');

// 讀取元素數據
const jsonPath = path.join(__dirname, '..', 'public', 'api', 'mocks', 'periodic-table.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'elements');

// 確保目錄存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 元素實物外觀描述
const elementAppearances = {
  // 非金屬
  'H': { type: 'gas', color: '#ffffff', texture: 'transparent', description: '無色透明氣體' },
  'He': { type: 'gas', color: '#d9ffff', texture: 'transparent', description: '無色透明氣體' },
  'C': { type: 'solid', color: '#2d2d2d', texture: 'graphite', description: '黑色石墨或透明鑽石' },
  'N': { type: 'gas', color: '#3050f8', texture: 'transparent', description: '無色透明氣體' },
  'O': { type: 'gas', color: '#ff0d0d', texture: 'transparent', description: '無色透明氣體' },
  'F': { type: 'gas', color: '#90e050', texture: 'transparent', description: '淡黃綠色氣體' },
  'Ne': { type: 'gas', color: '#b3e3f5', texture: 'glow', description: '無色氣體（通電發橙紅光）' },
  'Cl': { type: 'gas', color: '#1ff01f', texture: 'transparent', description: '黃綠色氣體' },
  'Ar': { type: 'gas', color: '#80d1e3', texture: 'glow', description: '無色氣體（通電發藍光）' },
  'Br': { type: 'liquid', color: '#a62929', texture: 'liquid', description: '深紅棕色液體' },
  'I': { type: 'solid', color: '#940094', texture: 'crystal', description: '紫黑色晶體' },
  
  // 金屬
  'Li': { type: 'solid', color: '#cc80ff', texture: 'metal', description: '銀白色軟金屬' },
  'Na': { type: 'solid', color: '#ab5cf2', texture: 'metal', description: '銀白色軟金屬' },
  'Mg': { type: 'solid', color: '#8aff00', texture: 'metal', description: '銀白色金屬' },
  'Al': { type: 'solid', color: '#bfa6a6', texture: 'metal', description: '銀白色輕金屬' },
  'K': { type: 'solid', color: '#8f40d4', texture: 'metal', description: '銀白色軟金屬' },
  'Ca': { type: 'solid', color: '#3dff00', texture: 'metal', description: '銀白色金屬' },
  'Fe': { type: 'solid', color: '#e06633', texture: 'metal', description: '銀灰色金屬' },
  'Cu': { type: 'solid', color: '#c88033', texture: 'metal', description: '紅銅色金屬' },
  'Zn': { type: 'solid', color: '#7d80b0', texture: 'metal', description: '藍白色金屬' },
  'Ag': { type: 'solid', color: '#c0c0c0', texture: 'metal', description: '銀白色金屬' },
  'Au': { type: 'solid', color: '#ffd123', texture: 'metal', description: '金黃色金屬' },
  'Hg': { type: 'liquid', color: '#b8b8d0', texture: 'liquid-metal', description: '銀白色液體金屬' },
  'Pb': { type: 'solid', color: '#575961', texture: 'metal', description: '藍灰色重金屬' },
  
  // 半金屬
  'B': { type: 'solid', color: '#ffb5b5', texture: 'crystal', description: '棕色硬脆固體' },
  'Si': { type: 'solid', color: '#f0c8a0', texture: 'crystal', description: '深灰色晶體' },
  'Ge': { type: 'solid', color: '#668f8f', texture: 'crystal', description: '灰白色晶體' },
  'As': { type: 'solid', color: '#bd80e3', texture: 'crystal', description: '灰色晶體' },
  'Sb': { type: 'solid', color: '#9e63b5', texture: 'crystal', description: '銀白色晶體' },
};

// 創建更真實的元素圖片
function createRealisticElementSVG(element) {
  const appearance = elementAppearances[element.symbol] || { 
    type: 'solid', 
    color: `#${element['cpk-hex']}`, 
    texture: 'metal',
    description: '未知外觀' 
  };

  let mainContent = '';
  let backgroundPattern = '';

  switch (appearance.type) {
    case 'gas':
      // 氣體 - 顯示為充滿氣體的容器
      backgroundPattern = `
        <defs>
          <radialGradient id="gasGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:${appearance.color};stop-opacity:0.3"/>
            <stop offset="70%" style="stop-color:${appearance.color};stop-opacity:0.1"/>
            <stop offset="100%" style="stop-color:${appearance.color};stop-opacity:0.05"/>
          </radialGradient>
          <pattern id="gasParticles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="${appearance.color}" opacity="0.3"/>
            <circle cx="15" cy="10" r="1" fill="${appearance.color}" opacity="0.2"/>
            <circle cx="10" cy="15" r="1" fill="${appearance.color}" opacity="0.25"/>
          </pattern>
        </defs>
      `;
      mainContent = `
        <rect width="100%" height="100%" fill="url(#gasGradient)"/>
        <rect width="100%" height="100%" fill="url(#gasParticles)"/>
        <rect x="20" y="20" width="260" height="160" fill="none" stroke="#666" stroke-width="2" rx="10"/>
        <text x="150" y="110" text-anchor="middle" fill="#333" font-size="14">氣體容器</text>
      `;
      break;

    case 'liquid':
      // 液體 - 顯示為液體容器
      backgroundPattern = `
        <defs>
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${appearance.color};stop-opacity:0.8"/>
            <stop offset="50%" style="stop-color:${appearance.color};stop-opacity:1"/>
            <stop offset="100%" style="stop-color:${appearance.color};stop-opacity:0.9"/>
          </linearGradient>
        </defs>
      `;
      mainContent = `
        <ellipse cx="150" cy="180" rx="80" ry="15" fill="${appearance.color}" opacity="0.3"/>
        <rect x="70" y="80" width="160" height="100" fill="url(#liquidGradient)" rx="5"/>
        <ellipse cx="150" cy="80" rx="80" ry="15" fill="${appearance.color}"/>
        <rect x="50" y="60" width="200" height="130" fill="none" stroke="#666" stroke-width="2" rx="10"/>
      `;
      break;

    case 'solid':
      if (appearance.texture === 'metal') {
        // 金屬 - 有光澤的表面
        backgroundPattern = `
          <defs>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${appearance.color};stop-opacity:1"/>
              <stop offset="30%" style="stop-color:#ffffff;stop-opacity:0.4"/>
              <stop offset="70%" style="stop-color:${appearance.color};stop-opacity:1"/>
              <stop offset="100%" style="stop-color:#000000;stop-opacity:0.3"/>
            </linearGradient>
          </defs>
        `;
        mainContent = `
          <rect x="50" y="50" width="200" height="100" fill="url(#metalGradient)" rx="10"/>
          <rect x="60" y="60" width="180" height="80" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.5" rx="5"/>
        `;
      } else if (appearance.texture === 'crystal') {
        // 晶體 - 幾何形狀
        mainContent = `
          <polygon points="150,40 220,100 150,160 80,100" fill="${appearance.color}" stroke="#333" stroke-width="2"/>
          <polygon points="150,60 200,100 150,140 100,100" fill="${appearance.color}" opacity="0.7"/>
          <line x1="150" y1="40" x2="150" y2="160" stroke="#fff" stroke-width="1" opacity="0.3"/>
          <line x1="80" y1="100" x2="220" y2="100" stroke="#fff" stroke-width="1" opacity="0.3"/>
        `;
      } else {
        // 一般固體
        mainContent = `
          <rect x="75" y="75" width="150" height="75" fill="${appearance.color}" rx="5"/>
          <rect x="85" y="85" width="130" height="55" fill="${appearance.color}" opacity="0.8" rx="3"/>
        `;
      }
      break;
  }

  return `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  ${backgroundPattern}
  <rect width="100%" height="100%" fill="#f8f9fa"/>
  ${mainContent}
  
  <text x="150" y="30" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="#333">${element.symbol}</text>
  <text x="150" y="185" font-family="Arial, sans-serif" font-size="12" 
        text-anchor="middle" fill="#666">${appearance.description}</text>
  
  <rect width="100%" height="100%" fill="none" stroke="#dee2e6" stroke-width="2" rx="8"/>
</svg>`;
}

console.log('開始生成真實元素實物圖片...');

// 為每個元素創建真實的圖片
let generatedCount = 0;
data.elements.forEach((element, index) => {
  const svgContent = createRealisticElementSVG(element);
  const filename = `${element.symbol.toLowerCase()}_real.svg`;
  const filepath = path.join(imagesDir, filename);
  
  fs.writeFileSync(filepath, svgContent, 'utf8');
  generatedCount++;
  
  if ((index + 1) % 20 === 0) {
    console.log(`已生成 ${index + 1}/${data.elements.length} 個真實圖片...`);
  }
});

console.log(`\\n成功生成 ${generatedCount} 個真實元素實物圖片！`);
console.log('文件保存在:', imagesDir);