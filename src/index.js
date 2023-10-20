import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import App from './App';
import ReactGA from 'react-ga';
import ReduxProvider from './store/redux';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SelectedTrancheStore, TransactionsStore, ThemeProvider, GlobalStore } from './store';
import { WagmiConfig } from 'wagmi';
import { chains, RainbowKitProvider, wagmiClient, walletTheme } from './utils';

ReactGA.initialize('G-SHL33W6WWC');

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <WagmiConfig client={wagmiClient}>
        <HashRouter>
            <GlobalStore>
                <ThemeProvider>
                    <QueryClientProvider client={queryClient}>
                        <ReactQueryDevtools />
                        <TransactionsStore>
                            <SelectedTrancheStore>
                                <ReduxProvider>
                                    <RainbowKitProvider chains={chains} theme={walletTheme}>
                                        <App />
                                    </RainbowKitProvider>
                                </ReduxProvider>
                            </SelectedTrancheStore>
                        </TransactionsStore>
                    </QueryClientProvider>
                </ThemeProvider>
            </GlobalStore>
        </HashRouter>
    </WagmiConfig>,
);
