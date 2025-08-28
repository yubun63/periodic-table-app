const fs = require('fs');
const path = require('path');

// Read the periodic table JSON file
const jsonPath = path.join(__dirname, '..', 'public', 'api', 'mocks', 'periodic-table.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Add image field to each element
data.elements.forEach(element => {
  // Create image path based on element symbol
  element.image = `/images/elements/${element.symbol.toLowerCase()}.svg`;
});

// Write the updated JSON back to file
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('Successfully added image paths to all elements!');
console.log(`Updated ${data.elements.length} elements.`);