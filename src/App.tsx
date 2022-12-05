import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { FullPageLoader } from './ui/components/loaders';
import Overview from './pages/overview';
import Tranches from './pages/tranches';
import Staking from './pages/staking';
import Markets from './pages/markets';
import Construction from './pages/construction';
import TrancheDetails from './pages/tranche-details';
import Portfolio from './pages/portfolio';

import { SelectedTrancheStore, TransactionsStore, MyTranchesStore } from './store/contexts';

const queryClient = new QueryClient();

function App() {
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setShowLoading(false), 4000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <FullPageLoader loading={showLoading} />
            <MyTranchesStore>
                <TransactionsStore>
                    <SelectedTrancheStore>
                        <BrowserRouter>
                            <Routes>
                                <Route index element={<Navigate to="/overview" />} />
                                <Route path="/overview" element={<Overview />} />
                                <Route path="/tranches" element={<Tranches />} />
                                <Route path="/markets" element={<Markets />} />
                                <Route path="/staking" element={<Staking />} />
                                <Route path="/governance" element={<Construction />} />
                                <Route path="/develop" element={<Construction />} />
                                <Route path="/portfolio" element={<Portfolio />} />

                                {/* Dynamic Tranche Routes */}
                                <Route path="/tranches/:name" element={<TrancheDetails />} />
                            </Routes>
                        </BrowserRouter>
                    </SelectedTrancheStore>
                </TransactionsStore>
            </MyTranchesStore>
        </QueryClientProvider>
    );
}

export default App;
