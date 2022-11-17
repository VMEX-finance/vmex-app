# VMEX app

This is the frontend application for the VMEX Finance Protocol.

## Installation

```bash
yarn
```

Go to VMEX contracts repo and run `yarn link` in the sdk folder.
Then, in this folder, run `yarn link @vmex/sdk`

## Development

To start local development, run:

```bash
yarn start
```

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
