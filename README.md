# school-management-ui
The UI for the School Management render-backend created with Generative AI

## Instructions from the Generative AI assistant

First, let's set up the project structure and necessary dependencies. You'll need to create a new React TypeScript project and install the required dependencies:

```
npx create-react-app school-management --template typescript
cd school-management
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install @tanstack/react-query axios react-hook-form
npm install react-router-dom @types/react-router-dom
```

## Deploy to GitHub Pages

* Install `gh-pages` as dev dependency:

```
npm install gh-pages --save-dev
```

* Update `package.json`
  * Add a `homepage` property at the top level:

```
"homepage": "https://{your-github-username}.github.io/{repo-name}"
```

  * Add `predeploy` and `deploy` scripts to the `scripts` section:

```
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    // ... other scripts
  }
```

* Deploy to GitHub Pages by running the deploy script:

```
npm run deploy
```

* The deployment may be fast, but it takes a few minutes for the page to work properly
