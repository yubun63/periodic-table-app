const fs = require('fs');
const path = require('path');

// 读取元素数据
const jsonPath = path.join(__dirname, '..', 'public', 'api', 'mocks', 'periodic-table.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'elements');

// 确保目录存在
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 创建SVG占位符函数
function createElementSVG(element) {
  const bgColor = `#${element['cpk-hex']}`;
  const textColor = isDarkColor(bgColor) ? '#ffffff' : '#000000';
  
  return `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text x="150" y="60" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
        text-anchor="middle" fill="${textColor}">${element.symbol}</text>
  <text x="150" y="90" font-family="Arial, sans-serif" font-size="16" 
        text-anchor="middle" fill="${textColor}">${element.name}</text>
  <text x="150" y="120" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" fill="${textColor}">原子序: ${element.number}</text>
  <text x="150" y="140" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" fill="${textColor}">原子量: ${element.atomic_mass}</text>
  <text x="150" y="160" font-family="Arial, sans-serif" font-size="12" 
        text-anchor="middle" fill="${textColor}">${element.category}</text>
  <text x="150" y="180" font-family="Arial, sans-serif" font-size="12" 
        text-anchor="middle" fill="${textColor}">${element.phase}</text>
</svg>`;
}

// 判断颜色是否为深色
function isDarkColor(hex) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

console.log('开始生成元素占位符图片...');

// 为每个元素创建SVG文件
data.elements.forEach((element, index) => {
  const svgContent = createElementSVG(element);
  const filename = `${element.symbol.toLowerCase()}.svg`;
  const filepath = path.join(imagesDir, filename);
  
  fs.writeFileSync(filepath, svgContent, 'utf8');
  
  if ((index + 1) % 20 === 0) {
    console.log(`已生成 ${index + 1}/${data.elements.length} 个图片...`);
  }
});

console.log(`\\n成功生成 ${data.elements.length} 个元素占位符图片！`);
console.log('文件保存在:', imagesDir);