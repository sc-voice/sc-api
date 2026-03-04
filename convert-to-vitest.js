#!/usr/bin/env node

/**
 * Convert mocha/should test file to vitest/expect syntax
 * Handles:
 * - should() assertions -> expect()
 * - require -> import
 * - __dirname -> import.meta.url
 * - typeof describe wrapper removal
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'test/sc-api.js');
const outputFile = inputFile; // Will overwrite

console.log(`Converting ${inputFile}...`);

let content = fs.readFileSync(inputFile, 'utf8');

// Step 1: Extract imports from inside describe block
const importLines = [];

// Extract and collect all require statements
const requirePatterns = [
  { pattern: /const should = require\("should"\);?\n?/g, extract: false },
  { pattern: /const fs = require\('fs'\);/g, replacement: "import fs from 'fs';" },
  { pattern: /const path = require\('path'\);/g, replacement: "import path from 'path';" },
  { pattern: /const \{ logger \} = require\('log-instance'\);/g, replacement: "import { logger } from 'log-instance';" },
  {
    pattern: /const \{[\s\S]*?\} = require\('\.\.\/index'\);/g,
    replacement: (match) => {
      const destructured = match.match(/const (\{[\s\S]*?\})/)[1];
      return `import ${destructured} from '../index.js';`;
    }
  }
];

// Remove require statements from content and collect their replacements
requirePatterns.forEach(({ pattern, replacement, extract }) => {
  if (extract === false) {
    // Just remove it (like should)
    content = content.replace(pattern, '');
  } else {
    content = content.replace(pattern, (match) => {
      const importStatement = typeof replacement === 'function' ? replacement(match) : replacement;
      importLines.push(importStatement);
      return ''; // Remove from original location
    });
  }
});

// Step 2: Remove the outer describe wrapper
content = content.replace(
  /^\(typeof describe === 'function'\) && describe\((.*?), function\(\) \{/,
  'describe($1, () => {'
);

// Remove the closing brace and semicolon at the end
content = content.replace(/\}\)$/m, '}');

// Step 3: Replace __dirname with import.meta.url equivalent
content = content.replace(
  /const APP_DIR = path\.join\(__dirname, '\.\.'\);/g,
  "const APP_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');"
);

// Step 4: Build imports at the top
const allImports = [
  "import { describe, it, expect } from '@sc-voice/vitest';",
  "import { fileURLToPath } from 'url';",
  ...importLines,
];

// Remove logger.logLevel line from inside describe
let logLevelLine = '';
content = content.replace(/\n\s*logger\.logLevel = "warn";?\n?/, (match) => {
  logLevelLine = match.trim();
  return '\n';
});

// Add all imports at the top, then the content
content = allImports.join('\n') + '\n' + (logLevelLine ? logLevelLine + '\n\n' : '\n') + content;

// Step 5: Convert should() assertions to expect()
// NOTE: Order matters! More specific patterns first to avoid incorrect matches

// Helper function to handle nested parentheses in should() expressions
function convertShould(text) {
  let result = text;
  let iterations = 0;
  const maxIterations = 10;

  // Keep converting until no more should() patterns found
  while (iterations < maxIterations) {
    let changed = false;
    const before = result;

    // should.deepEqual(actual, expected) -> expect(actual).toEqual(expected)
    result = result.replace(
      /should\.deepEqual\(([^,]+),\s*([^)]+)\)/g,
      (match, p1, p2) => {
        changed = true;
        return `expect(${p1}).toEqual(${p2})`;
      }
    );

    // should(value).properties(obj) -> expect(value).toMatchObject(obj)
    result = result.replace(
      /should\(([^)]+(?:\([^)]*\))?[^)]*)\)\.properties\(([^)]+)\)/g,
      (match, p1, p2) => {
        changed = true;
        return `expect(${p1}).toMatchObject(${p2})`;
      }
    );

    // should(value).instanceOf(Class) -> expect(value).toBeInstanceOf(Class)
    result = result.replace(
      /should\(([^)]+(?:\([^)]*\))?[^)]*)\)\.instanceOf\(([^)]+)\)/g,
      (match, p1, p2) => {
        changed = true;
        return `expect(${p1}).toBeInstanceOf(${p2})`;
      }
    );

    // should(value).match(regex) -> expect(value).toMatch(regex)
    result = result.replace(
      /should\(([^)]+(?:\([^)]*\))?[^)]*)\)\.match\(([^)]+)\)/g,
      (match, p1, p2) => {
        changed = true;
        return `expect(${p1}).toMatch(${p2})`;
      }
    );

    // should(value).equal(expected) -> expect(value).toBe(expected)
    result = result.replace(
      /should\(([^)]+(?:\([^)]*\))?[^)]*)\)\.equal\(([^)]+)\)/g,
      (match, p1, p2) => {
        changed = true;
        return `expect(${p1}).toBe(${p2})`;
      }
    );

    // should(value).above(num) -> expect(value).toBeGreaterThan(num)
    result = result.replace(
      /should\(([^)]+(?:\([^)]*\))?[^)]*)\)\.above\(([^)]+)\)/g,
      (match, p1, p2) => {
        changed = true;
        return `expect(${p1}).toBeGreaterThan(${p2})`;
      }
    );

    // should(value).below(num) -> expect(value).toBeLessThan(num)
    result = result.replace(
      /should\(([^)]+(?:\([^)]*\))?[^)]*)\)\.below\(([^)]+)\)/g,
      (match, p1, p2) => {
        changed = true;
        return `expect(${p1}).toBeLessThan(${p2})`;
      }
    );

    if (!changed) break;
    iterations++;
  }

  return result;
}

content = convertShould(content);

// Step 6: Replace this.timeout() with vitest equivalent
// Note: vitest doesn't use this.timeout() the same way - it's handled differently
// For now, just remove or comment it out
content = content.replace(
  /this\.timeout\(\d+\*\d+\);/g,
  '// timeout handled by vitest config'
);

// Step 7: Clean up any remaining issues
// Remove trailing semicolons after closing braces if needed
// (JavaScript is fine with them, but more modern to not have them)

console.log('Conversion complete. Writing to file...');
fs.writeFileSync(outputFile, content, 'utf8');
console.log(`Converted file written to ${outputFile}`);

// Verify the conversion by checking for common patterns
console.log('\nVerification:');
console.log('- vitest imports:', content.includes("from '@sc-voice/vitest'") ? '✓' : '✗');
console.log('- ES modules:', content.includes('import') && !content.includes('require(') ? '✓' : '✗');
console.log('- expect() usage:', content.includes('expect(') ? '✓' : '✗');
console.log('- No should():', !content.match(/should\([^)]+\)\./) ? '✓' : '✗');
console.log('- fileURLToPath:', content.includes('fileURLToPath') ? '✓' : '✗');
