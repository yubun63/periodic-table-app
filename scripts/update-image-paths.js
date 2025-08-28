const fs = require('fs');
const path = require('path');

// 讀取JSON文件
const jsonPath = path.join(__dirname, '..', 'public', 'api', 'mocks', 'periodic-table.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('開始更新圖片路徑...');

// 更新每個元素的圖片路徑
data.elements.forEach((element, index) => {
  const oldPath = element.image;
  // 將 /images/elements/{symbol}.svg 更改為 /images/elements/{symbol}_real.svg
  const newPath = oldPath.replace(/\/([^\/]+)\.svg$/, '/$1_real.svg');
  element.image = newPath;
  
  if ((index + 1) % 20 === 0) {
    console.log(`已更新 ${index + 1}/${data.elements.length} 個元素的圖片路徑...`);
  }
});

// 寫回文件
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`成功更新 ${data.elements.length} 個元素的圖片路徑！`);
console.log('所有元素圖片現在指向真實的元素實物圖片。');