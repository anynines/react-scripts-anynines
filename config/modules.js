// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');
const chalk = require('react-dev-utils/chalk');
const resolve = require('resolve');

/**
 * Get additional module paths based on the baseUrl of a compilerOptions object.
 *
 * @param {Object} options
 */
function getAdditionalModulePaths(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return '';
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  // We don't need to do anything if `baseUrl` is set to `node_modules`. This is
  // the default behavior.
  if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null;
  }

  // Allow the user set the `baseUrl` to `appSrc`.
  if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc];
  }

  // If the path is equal to the root directory we ignore it here.
  // We don't want to allow importing from the root directly as source files are
  // not transpiled outside of `src`. We do allow importing them with the
  // absolute path (e.g. `src/Components/Button.js`) but we set that up with
  // an alias.
  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return null;
  }

  // Otherwise, throw an error.
  throw new Error(
    chalk.red.bold(
      "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
        ' Create React App does not support other values at this time.'
    )
  );
}

/**
 * Replaces relative webpack alias paths with absolute ones,
 * assuming they reference the package root. 
 * The trailing '/*' coming from TypeScript aleases is removed 
 * oin any case.
 * 
 * @param {String} aliasPath 
 * @returns The converted path
 */
function mapAliasValue(aliasPath) {
  let mappedPath = aliasPath.replace('/*', '');
  if (mappedPath.startsWith('.')) {
    mappedPath = path.join(paths.appPath, mappedPath);
  }

  return mappedPath;
}

/**
 * Reads the paths array from tsconfig.paths.json and converts it to an object
 * suitable to be deconstructed into the webpack aliases
 * 
 * @returns {Object}
 */
function parseTypeScriptAliases() {
  let parsedAliases = {};
  let tsAliases;
  try {
    tsAliases = require(path.resolve(paths.appPath, 'tsconfig.paths.json')).compilerOptions.paths;
    console.log('Using TypeScript aliases: ', tsAliases);
  } catch(error) {
    return parsedAliases;
  }

  const aliasNames = Object.keys(tsAliases);
  aliasNames.forEach((aliasName) => {
    const webpackAliasName = aliasName.replace('/*', '');
    const webpackAliasValue = mapAliasValue(tsAliases[aliasName][0]);
    parsedAliases[webpackAliasName] = webpackAliasValue;
  });

  console.log('Webpack resolve aliases: ', parsedAliases)

  return parsedAliases;
}

/**
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getWebpackAliases(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      src: paths.appSrc,
      ...parseTypeScriptAliases()
    };
  }
}

/**
 * Get jest aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {*} options
 */
function getJestAliases(options = {}) {
  const baseUrl = options.baseUrl;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === '') {
    return {
      '^src/(.*)$': '<rootDir>/src/$1',
    };
  }
}

function getModules() {
  // Check if TypeScript is setup
  const hasTsConfig = fs.existsSync(paths.appTsConfig);
  const hasJsConfig = fs.existsSync(paths.appJsConfig);

  if (hasTsConfig && hasJsConfig) {
    throw new Error(
      'You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.'
    );
  }

  let config;

  // If there's a tsconfig.json we assume it's a
  // TypeScript project and set up the config
  // based on tsconfig.json
  if (hasTsConfig) {
    const ts = require(resolve.sync('typescript', {
      basedir: paths.appNodeModules,
    }));
    config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;
    // Otherwise we'll check if there is jsconfig.json
    // for non TS projects.
  } else if (hasJsConfig) {
    config = require(paths.appJsConfig);
  }

  config = config || {};
  const options = config.compilerOptions || {};

  const additionalModulePaths = getAdditionalModulePaths(options);

  return {
    additionalModulePaths: additionalModulePaths,
    webpackAliases: getWebpackAliases(options),
    jestAliases: getJestAliases(options),
    hasTsConfig,
  };
}

module.exports = getModules();
