import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReduxProvider from './store/redux';
import { wagmiClient, chains, WagmiConfig, RainbowKitProvider } from './store/rainbow';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ReduxProvider>
            <App />
        </ReduxProvider>
    </React.StrictMode>,
);
