#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Module dependencies.
 */

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'fs';

/**
 * Variables.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const CORE_PACKAGE_NAME = '@uphold/enterprise-widget-sdk-core';

/**
 * Get the current version from core package.json.
 */

function getCoreVersion() {
  const corePackageJsonPath = join(__dirname, '..', 'packages', 'core', 'package.json');
  const corePackageJson = JSON.parse(readFileSync(corePackageJsonPath, 'utf-8'));

  return corePackageJson.version;
}

/**
 * Updates all packages that depend on @uphold/enterprise-widget-sdk-core
 * to use the newly released version.
 *
 * Usage: node scripts/update-core-dependents.js [new-version].
 *
 * If no version is provided, it uses the current version from core package.json.
 */

function updateCoreDependents(newVersion) {
  const packagesDir = join(__dirname, '..', 'packages');
  const packages = readdirSync(packagesDir).filter(name => {
    const packagePath = join(packagesDir, name);

    return statSync(packagePath).isDirectory() && name !== 'core';
  });

  const updatedPackages = [];

  for (const packageName of packages) {
    const packageJsonPath = join(packagesDir, packageName, 'package.json');

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      if (packageJson.dependencies?.[CORE_PACKAGE_NAME]) {
        const newVersionRange = `^${newVersion}`;

        packageJson.dependencies[CORE_PACKAGE_NAME] = newVersionRange;
        writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
        updatedPackages.push(packageJson.name);
        console.log(`Updated ${packageJson.name} to use ${CORE_PACKAGE_NAME}@${newVersionRange}`);
      }
    } catch {
      // Skip packages without package.json
    }
  }

  if (updatedPackages.length > 0) {
    console.log(`\nUpdated ${updatedPackages.length} package(s) with new core dependency.`);
  }
}

const newVersion = process.argv[2] || getCoreVersion();

updateCoreDependents(newVersion);
