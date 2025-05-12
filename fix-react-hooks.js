#!/usr/bin/env node

/**
 * Script to help identify React Hook dependency warnings
 * Usage: node fix-react-hooks.js
 */

import fs from 'fs';
import { execSync } from 'child_process';

console.log('Running ESLint to identify React Hook dependency issues...');

try {
  // First run eslint and find any hooks exhaustive-deps warnings
  const output = execSync('npx eslint resources/js/ --format json', { encoding: 'utf-8' });
  const results = JSON.parse(output);
  
  let hookFiles = [];
  
  results.forEach(result => {
    const hookIssues = result.messages.filter(msg => msg.ruleId === 'react-hooks/exhaustive-deps');
    if (hookIssues.length > 0) {
      hookFiles.push({
        filePath: result.filePath,
        issues: hookIssues
      });
    }
  });
  
  console.log(`\nFound ${hookFiles.length} files with React Hook dependency issues:\n`);
  
  hookFiles.forEach(file => {
    console.log(`\n🔍 ${file.filePath}`);
    file.issues.forEach(issue => {
      console.log(`  Line ${issue.line}:${issue.column} - ${issue.message}`);
    });
  });
  
  console.log('\nTo fix these issues, you should:');
  console.log('1. Add missing dependencies to the dependency array, or');
  console.log('2. Move the function inside the useEffect if it only needs to be defined once, or');
  console.log('3. Use useCallback for function dependencies');
  console.log('\nExample fix for a missing dependency:');
  console.log('  Before: useEffect(() => { fetchData(id); }, [])');
  console.log('  After:  useEffect(() => { fetchData(id); }, [id])');
  
} catch (error) {
  console.error('Error:', error);
}
