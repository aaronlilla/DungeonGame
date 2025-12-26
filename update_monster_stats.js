const fs = require('fs');

// Read the JSON file
const data = JSON.parse(fs.readFileSync('src/data/default_monster_stats.json', 'utf8'));

// Update each level's stats
Object.keys(data).forEach(level => {
  // Reduce life by 25% (multiply by 0.75)
  data[level].life = Math.floor(data[level].life * 0.75);
  
  // Increase physical_damage by 25% (multiply by 1.25)
  data[level].physical_damage = data[level].physical_damage * 1.25;
});

// Write back to file
fs.writeFileSync('src/data/default_monster_stats.json', JSON.stringify(data, null, 2));

console.log('Monster stats updated successfully!');
console.log('- Life reduced by 25%');
console.log('- Physical damage increased by 25%');



