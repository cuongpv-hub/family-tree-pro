const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx')) results.push(file);
        }
    });
    return results;
}

const files = walk('d:/Project/family-tree-app/src');
let changedCount = 0;
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const newContent = content.replace(/['"]http:\/\/localhost:5000([^'"]*)['"]/g, '`${import.meta.env.VITE_API_URL}$1`');
    if (content !== newContent) {
        fs.writeFileSync(f, newContent);
        changedCount++;
        console.log(`[Refactored] ${f}`);
    }
});
console.log(`Hoàn tất Refactor ${changedCount} files.`);
