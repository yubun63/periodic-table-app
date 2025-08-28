const fs = require('fs');
const path = require('path');

// 電子排布數據
const electronConfigurations = {
  1: { config: "1s¹", shells: [1], orbitals: { "1s": 1 } },
  2: { config: "1s²", shells: [2], orbitals: { "1s": 2 } },
  3: { config: "[He] 2s¹", shells: [2, 1], orbitals: { "1s": 2, "2s": 1 } },
  4: { config: "[He] 2s²", shells: [2, 2], orbitals: { "1s": 2, "2s": 2 } },
  5: { config: "[He] 2s² 2p¹", shells: [2, 3], orbitals: { "1s": 2, "2s": 2, "2p": 1 } },
  6: { config: "[He] 2s² 2p²", shells: [2, 4], orbitals: { "1s": 2, "2s": 2, "2p": 2 } },
  7: { config: "[He] 2s² 2p³", shells: [2, 5], orbitals: { "1s": 2, "2s": 2, "2p": 3 } },
  8: { config: "[He] 2s² 2p⁴", shells: [2, 6], orbitals: { "1s": 2, "2s": 2, "2p": 4 } },
  9: { config: "[He] 2s² 2p⁵", shells: [2, 7], orbitals: { "1s": 2, "2s": 2, "2p": 5 } },
  10: { config: "[He] 2s² 2p⁶", shells: [2, 8], orbitals: { "1s": 2, "2s": 2, "2p": 6 } },
  11: { config: "[Ne] 3s¹", shells: [2, 8, 1], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 1 } },
  12: { config: "[Ne] 3s²", shells: [2, 8, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2 } },
  13: { config: "[Ne] 3s² 3p¹", shells: [2, 8, 3], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 1 } },
  14: { config: "[Ne] 3s² 3p²", shells: [2, 8, 4], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 2 } },
  15: { config: "[Ne] 3s² 3p³", shells: [2, 8, 5], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 3 } },
  16: { config: "[Ne] 3s² 3p⁴", shells: [2, 8, 6], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 4 } },
  17: { config: "[Ne] 3s² 3p⁵", shells: [2, 8, 7], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 5 } },
  18: { config: "[Ne] 3s² 3p⁶", shells: [2, 8, 8], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6 } },
  19: { config: "[Ar] 4s¹", shells: [2, 8, 8, 1], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "4s": 1 } },
  20: { config: "[Ar] 4s²", shells: [2, 8, 8, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "4s": 2 } },
  // 繼續添加更多元素...這裡只顯示前20個作為示例
  21: { config: "[Ar] 3d¹ 4s²", shells: [2, 8, 9, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 1, "4s": 2 } },
  22: { config: "[Ar] 3d² 4s²", shells: [2, 8, 10, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 2, "4s": 2 } },
  23: { config: "[Ar] 3d³ 4s²", shells: [2, 8, 11, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 3, "4s": 2 } },
  24: { config: "[Ar] 3d⁵ 4s¹", shells: [2, 8, 13, 1], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 5, "4s": 1 } },
  25: { config: "[Ar] 3d⁵ 4s²", shells: [2, 8, 13, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 5, "4s": 2 } },
  26: { config: "[Ar] 3d⁶ 4s²", shells: [2, 8, 14, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 6, "4s": 2 } },
  27: { config: "[Ar] 3d⁷ 4s²", shells: [2, 8, 15, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 7, "4s": 2 } },
  28: { config: "[Ar] 3d⁸ 4s²", shells: [2, 8, 16, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 8, "4s": 2 } },
  29: { config: "[Ar] 3d¹⁰ 4s¹", shells: [2, 8, 18, 1], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 10, "4s": 1 } },
  30: { config: "[Ar] 3d¹⁰ 4s²", shells: [2, 8, 18, 2], orbitals: { "1s": 2, "2s": 2, "2p": 6, "3s": 2, "3p": 6, "3d": 10, "4s": 2 } }
  // 可以繼續添加更多元素...
};

// 簡化版本：為剩餘元素生成基本的電子排布
function generateElectronConfig(atomicNumber) {
  if (electronConfigurations[atomicNumber]) {
    return electronConfigurations[atomicNumber];
  }
  
  // 簡化的電子填充規則
  const shells = [];
  let remainingElectrons = atomicNumber;
  
  // K殼層 (最多2個電子)
  shells.push(Math.min(2, remainingElectrons));
  remainingElectrons -= shells[0];
  
  // L殼層 (最多8個電子)
  if (remainingElectrons > 0) {
    shells.push(Math.min(8, remainingElectrons));
    remainingElectrons -= shells[1];
  }
  
  // M殼層 (最多18個電子)
  if (remainingElectrons > 0) {
    shells.push(Math.min(18, remainingElectrons));
    remainingElectrons -= shells[2];
  }
  
  // N殼層 (最多32個電子)
  if (remainingElectrons > 0) {
    shells.push(Math.min(32, remainingElectrons));
    remainingElectrons -= shells[3];
  }
  
  // 剩餘殼層
  while (remainingElectrons > 0) {
    shells.push(Math.min(32, remainingElectrons));
    remainingElectrons -= shells[shells.length - 1];
  }
  
  return {
    config: `簡化配置 (${atomicNumber}個電子)`,
    shells: shells,
    orbitals: { "simplified": atomicNumber }
  };
}

// 讀取並更新 JSON 文件
const jsonPath = path.join(__dirname, '..', 'public', 'api', 'mocks', 'periodic-table.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// 為每個元素添加電子排布數據
data.elements.forEach(element => {
  const electronData = generateElectronConfig(element.number);
  element.electron_configuration = electronData.config;
  element.electron_shells = electronData.shells;
  element.orbitals = electronData.orbitals;
});

// 寫回文件
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('成功為所有元素添加了電子排布數據！');
console.log(`已更新 ${data.elements.length} 個元素。`);