import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Router from './router';
import ReactGA from 'react-ga';
import ReduxProvider from './store/redux';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SelectedTrancheStore, TransactionsStore, ThemeProvider, GlobalStore } from '@/store';
import { WagmiConfig } from 'wagmi';
import { chains, RainbowKitProvider, wagmiClient, walletTheme } from '@/config';

ReactGA.initialize('G-SHL33W6WWC');

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});

const root = (ReactDOM as any).createRoot(document.getElementById('root'));
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
                                        <Router />
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
