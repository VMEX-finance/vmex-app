# VMEX Finance | Web App

This is the frontend application for the VMEX Finance Protocol. This app uses [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) to ensure all dependencies are appropriately handled. For web3 functionality, an older version of wagmi is used so that `viem` does not collide with `ethers`, which is used in the SDK.

## Installation

```bash
yarn
```

*Make sure to set your local enviornment variables, as the provided example in `.env.example`*

## Development

To start local development, first clone the [VMEX SDK/contracts repo](https://github.com/VMEX-finance/vmex) and then [link](https://classic.yarnpkg.com/lang/en/docs/cli/link/) the SDK package to the VMEX App Repo.

Then, inside the VMEX monorepo, run:

1. `yarn contracts compile`
2. `yarn sdk build`
3. `yarn contracts start:dev`

Then, in the VMEX App repo, run:

```bash
yarn dev
```

## Contributions

When adding new features:
1. Create a new branch based on `origin/develop` with the appriopriate schema: `[username]/[feature-or-bug]` (Recommended Usage: `git checkout -b [username]/[feature-or-bug] origin/develop`)
2. Pull `origin/develop` to ensure your branch is up to date
3. Create a pull request to `origin/develop`
4. Request a contributor to review


## Directory

```
src
├── api
├── config
├── hooks
├── pages
├── store
├── ui
│   ├── base                # Includes navbar, footer, and base layout
│   ├── charts              # Includes chart UI components
│   ├── components          # Includes subcomponents to be used in larger UI components
│   ├── features            # Includes larger components to be injected into templates
│   ├── modals              # Includes all modals and their subcomponents
│   ├── tables              # Includes all tables, some made with MUIDataTable
│   └── templates           # Includes templates for app, dashboard, generic grid, etc.
├── utils                   # Tools and utilities
├── index.css
├── index.tsx               # App injection and all global contexts
└── router.tsx              # Pages router using hash router
```

## Pipeline

Production: 
- Branch: `main`
- Link: https://app.vmex.finance

Development Branch: 
- Branch: `develop`
- Link: https://dev-app.vmex.finance


## Credits

Volatile Labs, LLC

## License

MIT License