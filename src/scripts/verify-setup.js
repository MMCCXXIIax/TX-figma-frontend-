#!/usr/bin/env node

/**
 * TX Predictive Intelligence - Setup Verification Script
 * 
 * This script verifies that all requirements are met for running the application.
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🔍 TX Predictive Intelligence - Setup Verification\n');

let hasErrors = false;

// Check Node.js version
console.log('1. Checking Node.js version...');
const nodeVersion = process.version;
const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
if (nodeMajor >= 18) {
  console.log(`   ✅ Node.js ${nodeVersion} (OK)\n`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (Requires 18+)\n`);
  hasErrors = true;
}

// Check for required files
console.log('2. Checking required files...');
const requiredFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'App.tsx',
  'lib/api-client.ts',
  'lib/socket.ts',
  'lib/config.ts',
  'styles/globals.css'
];

requiredFiles.forEach(file => {
  const filePath = join(projectRoot, file);
  if (existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} (Missing)`);
    hasErrors = true;
  }
});

// Check environment file
console.log('\n3. Checking environment configuration...');
const envFile = join(projectRoot, '.env');
const envExampleFile = join(projectRoot, '.env.example');

if (existsSync(envFile)) {
  console.log('   ✅ .env file exists');
  
  try {
    const envContent = readFileSync(envFile, 'utf8');
    if (envContent.includes('VITE_API_BASE')) {
      console.log('   ✅ VITE_API_BASE configured');
    } else {
      console.log('   ⚠️  VITE_API_BASE not found in .env');
    }
    
    if (envContent.includes('VITE_SOCKET_BASE')) {
      console.log('   ✅ VITE_SOCKET_BASE configured');
    } else {
      console.log('   ⚠️  VITE_SOCKET_BASE not found in .env');
    }
  } catch (error) {
    console.log('   ❌ Error reading .env file');
    hasErrors = true;
  }
} else if (existsSync(envExampleFile)) {
  console.log('   ⚠️  .env file missing, but .env.example exists');
  console.log('   💡 Run: cp .env.example .env');
} else {
  console.log('   ❌ No environment files found');
  hasErrors = true;
}

// Check package.json dependencies
console.log('\n4. Checking package.json...');
try {
  const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
  
  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    'axios',
    'socket.io-client',
    'recharts',
    'lucide-react',
    'tailwindcss'
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
  );
  
  if (missingDeps.length === 0) {
    console.log('   ✅ All required dependencies listed');
  } else {
    console.log(`   ❌ Missing dependencies: ${missingDeps.join(', ')}`);
    hasErrors = true;
  }
} catch (error) {
  console.log('   ❌ Error reading package.json');
  hasErrors = true;
}

// Check if node_modules exists
console.log('\n5. Checking installation...');
if (existsSync(join(projectRoot, 'node_modules'))) {
  console.log('   ✅ node_modules directory exists');
} else {
  console.log('   ❌ node_modules not found');
  console.log('   💡 Run: npm install');
  hasErrors = true;
}

// Backend connectivity check (optional)
console.log('\n6. Backend connectivity check...');
try {
  const envContent = existsSync(envFile) ? readFileSync(envFile, 'utf8') : '';
  const apiBase = envContent.match(/VITE_API_BASE=(.+)/)?.[1] || 'http://localhost:5000';
  
  console.log(`   🔍 Testing connection to: ${apiBase}`);
  console.log('   💡 Make sure your Flask backend is running');
  console.log(`   💡 Test manually: curl ${apiBase}/api/market-scan?type=trending`);
} catch (error) {
  console.log('   ⚠️  Could not determine API base URL');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup verification FAILED');
  console.log('\nPlease fix the issues above before running the application.');
  console.log('Check TROUBLESHOOTING.md for detailed solutions.');
  process.exit(1);
} else {
  console.log('✅ Setup verification PASSED');
  console.log('\nYour environment is ready! You can now run:');
  console.log('   npm run dev');
  console.log('\nThen open: http://localhost:5173');
}
console.log('='.repeat(50));