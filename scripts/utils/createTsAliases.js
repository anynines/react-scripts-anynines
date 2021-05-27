const fs = require('fs');
const paths = require('react-scripts/config/paths');

function create() {

  const tsPaths = {
    compilerOptions: {
      baseUrl: `${paths.appPath}`,
      paths: {
        '@root/*': [`${paths.appPath}/*`],
        '@rootSrc/*': [`${paths.appPath}/src/*`],
        '@src/*': [`${paths.appNodeModules}/happy-mobile/src/*`],
        "@happy/*": ["happy-mobile/src/*"]
      }
    }
  };

  const config = JSON.stringify(tsPaths, null, 2)
  console.log('Created path aliases: ', config);
  const configPath = `${paths.appPath}/tsconfig.paths.json`;
  fs.writeFileSync(configPath, config)
}

function rewrite() {
  const configPath = `${paths.appPath}/tsconfig.paths.json`;
  let config = fs.readFileSync(configPath, { encoding: 'utf-8' });

  try {
    const root = `"@root/*": ["${paths.appPath}/*"],`;
    config = config.replace(/"@root\/\*.+/, root);

    const rootSrc = `"@rootSrc/*": ["${paths.appPath}/src/*"],`;
    config = config.replace(/"@rootSrc\/\*.+/, rootSrc);

    const happySrc = `"@src/*": ["${paths.appNodeModules}/happy-mobile/src/*"],`;
    config = config.replace(/"@src\/\*.+/, happySrc);

    console.log(config);
    fs.writeFileSync(configPath, config);

  } catch (error) {
    console.error('Error: Could not parse TypeScript aliases')
  }
}

create()

module.exports = {
  create: create,
  rewrite: rewrite
}