import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReactGA from 'react-ga';
import ReduxProvider from './store/redux';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SelectedTrancheStore, TransactionsStore, ThemeProvider } from './store';
import { WagmiConfig } from 'wagmi';
import { chains, RainbowKitProvider, wagmiClient } from './utils';

const queryClient = new QueryClient();
ReactGA.initialize('G-SHL33W6WWC');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools />
                <TransactionsStore>
                    <SelectedTrancheStore>
                        <ReduxProvider>
                            <WagmiConfig client={wagmiClient}>
                                <RainbowKitProvider chains={chains}>
                                    <HashRouter>
                                        <App />
                                    </HashRouter>
                                </RainbowKitProvider>
                            </WagmiConfig>
                        </ReduxProvider>
                    </SelectedTrancheStore>
                </TransactionsStore>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
