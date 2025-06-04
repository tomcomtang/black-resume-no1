const fs = require('fs');
const path = require('path');
const TextToSVG = require('text-to-svg');
const config = require('../config/content.json');

const WIDTH = 36;
const HEIGHT = 28;
const FONT_PATH = path.join(__dirname, '../public/fonts/Montserrat-Regular.ttf');
const PADDING = 2; // 减小padding以留出更多空间给文字

// 计算字体大小
function calculateFontSize(firstLine, secondLine) {
  const maxChars = Math.max(firstLine.length, secondLine.length);
  // 根据宽度计算字体大小：总宽度减去padding，除以字符数，再除以字符宽度系数
  const widthBasedSize = (WIDTH - PADDING * 2) / maxChars / 0.4; // 调整为0.4，使文字更宽
  
  // 根据高度计算字体大小：总高度减去padding，除以行数，再除以行高系数
  const heightBasedSize = (HEIGHT - PADDING * 2) / 2 / 1.2; // 1.2是行高系数
  
  // 取两者中的较小值，确保文字不会超出边界
  return Math.min(widthBasedSize, heightBasedSize);
}

const author = (config.meta.author || 'Author').toUpperCase(); // 转换为大写

function splitName(name) {
  const len = name.length;
  const firstLineLen = Math.ceil(len / 2);
  return [name.slice(0, firstLineLen), name.slice(firstLineLen)];
}

const [firstLine, secondLine] = splitName(author);
const fontSize = calculateFontSize(firstLine, secondLine);
const textToSVG = TextToSVG.loadSync(FONT_PATH);

const firstLineMetrics = textToSVG.getMetrics(firstLine, { fontSize });
const secondLineMetrics = textToSVG.getMetrics(secondLine, { fontSize });
const firstLineWidth = firstLineMetrics.width;
const secondLineWidth = secondLineMetrics.width;

// 精确上下居中：用两行实际高度总和
const totalTextHeight = firstLineMetrics.height + secondLineMetrics.height;
const startY = (HEIGHT - totalTextHeight) / 2 + firstLineMetrics.ascender;

let svgContent = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">\n`;

// 第一行
const firstLineX = (WIDTH - firstLineWidth) / 2;
const firstLinePath = textToSVG.getD(firstLine, { 
  x: firstLineX, 
  y: startY, 
  fontSize: fontSize, 
  anchor: 'left' 
});
svgContent += `<path d="${firstLinePath}" fill="#C4C4C4" stroke="#C4C4C4" stroke-width="0.5"/>\n`;

// 第二行
const secondLineX = (WIDTH - secondLineWidth) / 2;
const secondLinePath = textToSVG.getD(secondLine, { 
  x: secondLineX, 
  y: startY + firstLineMetrics.height, 
  fontSize: fontSize, 
  anchor: 'left' 
});
svgContent += `<path d="${secondLinePath}" fill="#C4C4C4" stroke="#C4C4C4" stroke-width="0.5"/>\n`;

svgContent += '</svg>';

const outputPath = path.join(__dirname, '../public/svg/author-logo.svg');
fs.writeFileSync(outputPath, svgContent);
console.log('SVG logo generated for author:', author, 'at', outputPath);
console.log('SVG dimensions:', { width: WIDTH, height: HEIGHT, fontSize, firstLineWidth, secondLineWidth, totalTextHeight }); 