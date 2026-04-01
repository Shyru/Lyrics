const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'public', 'index.html');
const templatePath = path.join(rootDir, 'lyrics.template.html');
const outputPath = path.join(rootDir, 'lyrics.html');

const source = fs.readFileSync(sourcePath, 'utf8');
const template = fs.readFileSync(templatePath, 'utf8');

const titleMatch = source.match(/<title>([\s\S]*?)<\/title>/i);
const headingMatch = source.match(/<div class="toc">\s*<h1>([\s\S]*?)<\/h1>/i);
const songsMatch = source.match(/<!-- SONGS:START -->([\s\S]*?)<!-- SONGS:END -->/);

if (!titleMatch) {
    throw new Error('Could not find <title> in public/index.html');
}

if (!headingMatch) {
    throw new Error('Could not find TOC heading in public/index.html');
}

if (!songsMatch) {
    throw new Error('Could not find SONGS markers in public/index.html');
}

const result = template
    .replace('{{PAGE_TITLE}}', titleMatch[1].trim())
    .replace('{{PAGE_HEADING}}', headingMatch[1].trim())
    .replace('<!-- SONGS:INJECT -->', songsMatch[1].trim());

fs.writeFileSync(outputPath, `${result}\n`, 'utf8');

console.log(`Generated ${path.basename(outputPath)} from ${path.basename(sourcePath)}`);
