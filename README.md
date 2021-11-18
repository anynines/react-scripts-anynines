# react-scripts-anynines

This a modified fork of react-scripts that allows TypeScript path aliases.
It is built specifically to work with the happy-mobile package but can be 
used for all aliases except those being set automatically (see below).

It expects these to be in a file called tsconfig.paths.json looking e.g. like this: 
```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "src/*": ["src/*"]  
    }
  }
}
```
This file has then to be implemented in the regular tsconfig.json:
```
{
  "extends": "./tsconfig.paths.json",
  "compilerOptions": {
    ...
  }
}
```

The webpack aliases for building are parsed dynamically from this.
Other mappings, like for ESLint or Jest have to be set manually.

## Note: Deprecation

This version of the scripts expects the happy depency to be installed as `"happy-mobile"`, meaning it is installed directly from the GitHub repo. 

In newer versions this is still suported but but imports should be done from `"@avarteqgmbh/happy-mobile"`.

## Automation 

The following alises are reserved and will be overwritten on each run of react-scripts:

`"@root/*"`, `"@rootSrc"`, `"@src"`

Other alias names can be used as needed.

## react-scripts

This package includes scripts and configuration used by [Create React App](https://github.com/facebook/create-react-app).<br>
Please refer to its documentation:

- [Getting Started](https://facebook.github.io/create-react-app/docs/getting-started) – How to create a new app.
- [User Guide](https://facebook.github.io/create-react-app/) – How to develop apps bootstrapped with Create React App.
