# VMEX app

This is the frontend application for the VMEX Finance Protocol.

## Installation

```bash
yarn
```

Make sure to set your local enviornment variables, like REACT_APP_ALCHEMY_KEY to query the alchemy api for gas price.
REACT_APP_ALCHEMY_KEY = optimism alchemy key
REACT_APP_SEPOLIA_ALCHEMY_KEY = sepolia alchemy key

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

_Note: Make sure your Metamask network is set to localhost:8545 with a chain ID 31337 and reset your MetaMask account for using the hardhat network_

When adding new features, create a new branch based on `origin/develop`. Upon completing new features, create pull requests to `origin/develop`.

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
│   ├── components          # Includes subcomponents to be used in larger UI components
│   ├── features            # Includes larger components to be injected into templates
│   ├── modals              # Includes all modals and their subcomponents
│   ├── tables              # Includes all tables, some made with MUIDataTable
│   └── templates           # Includes templates for app, dashboard, generic grid, etc.
├── utils                   # Tools and utilities
├── App.tsx
├── index.css
└── index.js
```

### Site Links

- [Production Site](https://app.vmex.finance)
- [Development Site](https://vmex-app-develop.on.fleek.co/)
