const fs = require('fs');
const paths = require('react-scripts/config/paths');
const appPackage = require(`${paths.appPackageJson}`)

const CORE = 'core';
const IMPLEMENTATION = 'implementation';

/**
 * Checks if happy-mobile is present as a package dependency,
 * otherwise assumes to be running happy-mobile itself.
 * 
 * @returns {String}
 */
function evaluateHappyMode() {
  if (
    appPackage.dependencies
    && typeof appPackage.dependencies['happy-mobile'] === 'string'
  ) {
    return IMPLEMENTATION;
  } else {
    return CORE
  }
}

const isImplemetation = (evaluateHappyMode() === IMPLEMENTATION)

const tsPaths = {
  '@src/*': isImplemetation ? [`${paths.appNodeModules}/happy-mobile/src/*`] : ['./src/*'],
  '@rootSrc/*': isImplemetation ? [`${paths.appPath}/src/*`] : ['./src/*'],
  '@root/*': isImplemetation ? [`${paths.appPath}/*`] : ['./*']
}

/**
 * Creates a new tsconfig.paths.json
 */
function create() {
  const tsOptions = {
    compilerOptions: {
      baseUrl: isImplemetation ? `${paths.appPath}`: '.',
      paths: tsPaths
    }
  };

  const config = JSON.stringify(tsOptions, null, 2)
  console.log('Created path aliases: ', config);
  const configPath = `${paths.appPath}/tsconfig.paths.json`;
  fs.writeFileSync(configPath, config)
}

/**
 * Writes the current happy-mobile aias parameters into tsconfig.paths.json 
 * or creates a new file in case of an error.
 */
function rewrite() {
  const configPath = `${paths.appPath}/tsconfig.paths.json`;
  
  try {
    let configFileContent = fs.readFileSync(configPath, { encoding: 'utf-8' });
    const config = JSON.parse(configFileContent)
    console.log()

    config.compilerOptions.baseUrl = isImplemetation ? `${paths.appPath}`: '.';

    config.compilerOptions.paths = {
      ...config.compilerOptions.paths,
      ...tsPaths
    }

    console.log(config);
    configFileContent = JSON.stringify(config, null, 2)
    fs.writeFileSync(configPath, configFileContent);

  } catch (error) {
    console.log('ERROR: Could not parse TypeScript aliases: ', error);
    console.log('Creating new tsconfig.paths.json...');
    create();
  }
}

module.exports = {
  create: create,
  rewrite: rewrite
}
