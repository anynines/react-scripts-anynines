# react-scripts-anynines

This a modified fork of react-scripts that allows TypeScript path aliases.

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

## react-scripts

This package includes scripts and configuration used by [Create React App](https://github.com/facebook/create-react-app).<br>
Please refer to its documentation:

- [Getting Started](https://facebook.github.io/create-react-app/docs/getting-started) – How to create a new app.
- [User Guide](https://facebook.github.io/create-react-app/) – How to develop apps bootstrapped with Create React App.
