const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(findHtmlFiles(file));
      }
    } else {
      if (file.endsWith('.html')) {
        results.push(file);
      }
    }
  });
  return results;
}

const htmlFiles = findHtmlFiles('.');
let changedFiles = 0;

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('favicon.png"')) {
    const updated = content.replace(/favicon\.png"/g, 'favicon.png?v=2"');
    fs.writeFileSync(file, updated);
    changedFiles++;
  }
});

console.log('Updated favicon in ' + changedFiles + ' HTML files.');
