# VMEX app

This is the frontend application for the VMEX Finance Protocol.

## Installation

``` bash
yarn
```

## Storybook

To start the storybook server, run:
``` bash
yarn storybook
```

Then, navigate to [Localhost, port 6006](localhost:6006).

## Development

To start local development, run:
``` bash
yarn start
```

### Directory

src
├── hooks                   # Hooks for api, ui, stores, and more
│   ├── dialogs             # Managing dialog state
│   ├── protocol            # Pulling protocol data including tranches, markets, and overview
│   ├── ui                  # Strictly hooks for UI components
│   ├── user                # Pulling user data including user activity, tokens, etc.
│   ├── wallet              # Managing web3 wallet state
│   └── redux.ts    
├── middleware              # ??? folder may not be necessary ???
├── models                  # Api data models/interfaces
├── store                   # Redux and context stores
│   ├── contexts            # Managing dialog state
│   ├── ...           
│   └── wallet.ts           # Redux state management for web3 wallet
├── stories                 # Storybook components
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