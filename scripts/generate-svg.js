const fs = require('fs');
const path = require('path');

// Read the author name from config/content.json
const configPath = path.join(__dirname, '../config/content.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const authorName = config.meta.author;

// Use dynamic import for svg-text-to-path
import('svg-text-to-path').then((module) => {
  console.log('Module:', module);
  const { getPath } = module;
  if (typeof getPath !== 'function') {
    throw new Error('getPath is not a function');
  }
  // Generate SVG content using svg-text-to-path
  getPath(authorName, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#C4C4C4'
  }).then(svgContent => {
    // Define the output SVG file path
    const outputPath = path.join(__dirname, '../public/svg/author-logo.svg');

    // Write the SVG content to the file
    fs.writeFileSync(outputPath, svgContent);

    console.log(`SVG logo generated for author: ${authorName} at ${outputPath}`);
  }).catch(err => {
    console.error('Error generating SVG content:', err);
  });
}).catch(err => {
  console.error('Error importing module:', err);
}); 