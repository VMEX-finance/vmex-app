# VMEX app

This is the frontend application for the VMEX Finance Protocol.

## Installation

```bash
yarn
```

## Development

To start local development, first clone the VMEX SDK/contracts repo and, in there, run:

1. `yarn compile`
2. `yarn build`
3. `yarn start:dev`

Then, in the VMEX App repo, run:

```bash
yarn start:dev
```

When adding new features, create a new branch based on `origin/develop`. Upon completing new features, create pull requests to `origin/develop`.

## Directory

```
src
├── api                     # sdk imports and exports as well as formatting
│   ├── protocol            # Pulling protocol data including tranches, markets, and overview
│   └── index.ts            
├── hooks                   # Hooks for ui, stores, and more
│   ├── dialogs             # Managing dialog state
│   ├── ui                  # Strictly hooks for UI components
│   ├── user                # Pulling user data including user activity, tokens, etc.
│   ├── wallet              # Managing web3 wallet state
│   └── redux.ts
├── models                  # Api data models/interfaces
├── pages                   # Page Components that are passed to React DOM
├── store                   # Redux and context stores
│   ├── contexts            # Managing dialog state
│   ├── ...
│   └── wallet.ts           # Redux state management for web3 wallet
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

(Production Site)[https://app.vmex.finance]
(Development Site)[https://royal-snow-5738.on.fleek.co/]
