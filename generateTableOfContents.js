const { readdir, Fs } = require('fs/promises');
const fs = require('fs');
const path = require('path');
const HOME_FILENAME = 'Home.md';

(async () => {
    try {
        const tableOfContents = await buildTableOfContents('.')
        const fileContents = buildMdFromTableOfContents(tableOfContents);

        fs.writeFileSync(
            path.join(__dirname, HOME_FILENAME), fileContents
        );
    } catch (e) {
        console.error(e)
    }
})();

async function buildTableOfContents(path, currentTOC = {children: []}) {      
    const fileNameIgnorePatterns = ['.git', HOME_FILENAME];
    const files = await readdir(path, {withFileTypes: true});
    const {children} = currentTOC;

    for (const file of files){ 
        const {name: fileName} = file
        let isValidPath = true;

        for (const fileNameIgnorePattern of fileNameIgnorePatterns) {
            if (fileName.includes(fileNameIgnorePattern)) {
                isValidPath = false;
            }
        } 

        if (isValidPath) {
            if (isMarkDownFile(fileName)) {
                children.push({
                    type: 'file', 
                    path: fileName.replace('.md', ''), 
                    title: convertMdFileNameToTitle(fileName)
                });
            }

            if (file.isDirectory()) { 
                const newTOC = await buildTableOfContents(
                    `${path}/${fileName}`, 
                    {
                        type: 'title', 
                        title: convertMdFileNameToTitle(fileName), 
                        children: []
                    }
                );
                
                children.push(newTOC)
            }
        }
    }
    
    return currentTOC;
}

function buildMdFromTableOfContents(toc, indentLevel = 0) {
    const {children} = toc;
    let doc = '';

    children?.forEach((child)=>{
        if (child.type === 'title') {
            const indent = repeatChar('\t', indentLevel-1);
            const bullet = indentLevel > 0 ? '-' : '';
            const headingLevel = repeatChar('#', indentLevel);
            doc += `${indent}${bullet} ${headingLevel}## ${child.title} \n`;
        }

        if (child.type === 'file') {
            const indent = repeatChar('\t', indentLevel-1);
            doc += `${indent}- [${child.title}](${child.path}) \n`;
        }
        
        doc += buildMdFromTableOfContents(child, indentLevel + 1);
        doc += '\n';
    });

    return doc;
}

function isMarkDownFile(fileName) {
    const extension = fileName.substring(fileName.length - 3);
    return extension === '.md';
}

function convertMdFileNameToTitle(fileName) {
    return fileName.replace(/\-/g, ' ').replace('.md', '')
}

function repeatChar(char, times) {
    return Array.from({length: times}).reduce(accumlator => accumlator + char, '');
}
