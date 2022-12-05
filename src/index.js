import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReduxProvider from './store/redux';
import { wagmiClient, chains, WagmiConfig, RainbowKitProvider } from './store/rainbow';
import { darkTheme, midnightTheme } from '@rainbow-me/rainbowkit';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ReduxProvider>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains}>
                    <Router>
                        <App />
                    </Router>
                </RainbowKitProvider>
            </WagmiConfig>
        </ReduxProvider>
    </React.StrictMode>,
);
