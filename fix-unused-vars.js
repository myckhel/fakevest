#!/usr/bin/env node

/**
 * Improved script to fix unused variables by prefixing them with underscore
 * Usage: node fix-unused-vars.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Track errors
let errorCount = 0;

try {
  console.log('Running ESLint to identify unused variables...');
  // Run ESLint to get list of unused variables
  const output = execSync('npx eslint resources/js/ --format json', { 
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  const results = JSON.parse(output);
  console.log(`ESLint processed ${results.length} files.`);

  // Track files to modify
  let modifiedFiles = new Set();
  let fixedVars = 0;

  results.forEach(result => {
    if (!result.messages || result.messages.length === 0) return;
    
    const unusedVars = result.messages.filter(
      msg => (msg.ruleId === '@typescript-eslint/no-unused-vars' || msg.ruleId === 'no-unused-vars') && 
             (msg.message.includes('is defined but never used') || 
              msg.message.includes('is assigned a value but never used'))
    );
    
    if (unusedVars.length === 0) return;
    
    try {
      // Read the file
      const filePath = result.filePath;
      console.log(`Processing ${filePath} with ${unusedVars.length} unused variables`);
      
      let content = fs.readFileSync(filePath, 'utf-8');
      let lines = content.split('\n');
      
      // Process unused variables in reverse line order to avoid offsets changing
      unusedVars.sort((a, b) => b.line - a.line || b.column - a.column);
      
      unusedVars.forEach(unusedVar => {
        const line = lines[unusedVar.line - 1];
        let match = unusedVar.message.match(/'([^']+)' is (?:defined|assigned a value) but never used/);
        
        if (!match) {
          console.error(`  ⚠️ Couldn't parse message: ${unusedVar.message}`);
          return;
        }
        
        const varName = match[1];
        
        // Skip if already prefixed with underscore
        if (varName.startsWith('_')) {
          console.log(`  • ${varName} already has underscore prefix`);
          return;
        }
        
        console.log(`  • Fixing ${unusedVar.line}:${unusedVar.column} - ${varName} → _${varName}`);
        
        // Identify the exact position in the line where the var appears
        let linePos = unusedVar.column - 1;
        
        // Create new line with the variable renamed to have underscore prefix
        // This approach is more precise than using regex replacement
        const newLine = line.substring(0, linePos) + '_' + line.substring(linePos);
        lines[unusedVar.line - 1] = newLine;
        
        fixedVars++;
        modifiedFiles.add(filePath);
      });
      
      // Write the modified file back
      if (modifiedFiles.has(filePath)) {
        fs.writeFileSync(filePath, lines.join('\n'));
        console.log(`✅ Updated ${filePath}`);
      }
    } catch (err) {
      console.error(`❌ Error processing file ${result.filePath}:`, err);
      errorCount++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`• Modified ${modifiedFiles.size} files`);
  console.log(`• Fixed ${fixedVars} unused variables`);
  console.log(`• Encountered ${errorCount} errors`);
  
  if (modifiedFiles.size > 0) {
    console.log('\n⚠️ Run ESLint again to verify changes');
    console.log('  yarn lint');
  }
} catch (err) {
  console.error('❌ Fatal error:', err);
  process.exit(1);
}
