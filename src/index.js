import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReduxProvider from './store/redux';
import { wagmiClient, chains, WagmiConfig, RainbowKitProvider } from './store/rainbow';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    MyTranchesStore,
    SelectedTrancheStore,
    TransactionsStore,
    ThemeProvider,
    PricesStore,
} from './store/contexts';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <PricesStore>
                    <MyTranchesStore>
                        <TransactionsStore>
                            <SelectedTrancheStore>
                                <ReduxProvider>
                                    <WagmiConfig client={wagmiClient}>
                                        <RainbowKitProvider chains={chains}>
                                            <Router>
                                                <App />
                                            </Router>
                                        </RainbowKitProvider>
                                    </WagmiConfig>
                                </ReduxProvider>
                            </SelectedTrancheStore>
                        </TransactionsStore>
                    </MyTranchesStore>
                </PricesStore>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>,
);
