# VMEX app

This is the frontend application for the VMEX Finance Protocol.

## Installation

```bash
yarn
```

Make sure to set your local enviornment variables, like REACT_APP_ALCHEMY_KEY to query the alchemy api for gas price.
## Development

To start local development, first clone the [VMEX SDK/contracts repo](https://github.com/VMEX-finance/vmex) and then [link](https://classic.yarnpkg.com/lang/en/docs/cli/link/) the SDK package to the VMEX App Repo.

Then, inside the VMEX monorepo, run:

1. `yarn contracts compile`
2. `yarn sdk build`
3. `yarn contracts start:dev`

Then, in the VMEX App repo, run:

```bash
yarn start:<network>
```

*Note: Look in package.json scripts for which networks are available. Make sure your Metamask network is set to localhost:8545 with a chain ID 31337 and reset your MetaMask account if needed*

When adding new features, create a new branch based on `origin/develop`. Upon completing new features, create pull requests to `origin/develop`.

## Testing using Hillfire deployment

In this repo, run `yarn start:mainnetfork`

In metamask, change the chain to:

RPC url: https://hillfire.dns.army:8443/
Chain id: 31337
Currency: ETH

## Directory

```
src
├── api                     # sdk imports and exports as well as formatting
│   ├── protocol            # Querying protocol data including tranches, markets, and overview
│   ├── user                # Querying user data
│   ├── models.ts           # Api data models/interfaces
│   └── index.ts
├── hooks                   # Hooks for ui, stores, and more
│   ├── dialogs             # Managing dialog state
│   ├── ui                  # Strictly hooks for UI components
│   └── redux.ts
├── pages                   # Page Components that are passed to React DOM
├── store                   # Redux and context stores
│   ├── contexts            # Global contexts
│   ├── modals.ts           # Managing dialog state
│   ├── rainbow.ts          # Managing rainbow wallet
│   └── redux.ts            # Redux state management
├── ui                      # All user interface components
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
