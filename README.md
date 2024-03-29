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

Happy Mobile can be installed either from GiitHub packages as `"@avarteqgmbh/happy-mobile"`
or from the repository as `"happy-mobile@git+https://github.com/<path-to-repository.git[#<commit-ish>]>"`.

## Automation 

The following alises are reserved and will be overwritten on each run of react-scripts:

`"@root/*"`, `"@rootSrc"`, `"@src"`

Other alias names can be used as needed.

## react-scripts

This package includes scripts and configuration used by [Create React App](https://github.com/facebook/create-react-app).<br>
Please refer to its documentation:

- [Getting Started](https://facebook.github.io/create-react-app/docs/getting-started) – How to create a new app.
- [User Guide](https://facebook.github.io/create-react-app/) – How to develop apps bootstrapped with Create React App.
