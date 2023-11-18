import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Loader } from '@/ui/components';
import Overview from './pages/overview';
import Tranches from './pages/tranches';
import Staking from './pages/staking';
import Markets from './pages/markets';
import Construction from './pages/construction';
import TrancheDetails from './pages/tranche-details';
import Portfolio from './pages/portfolio';
import MyTranches from './pages/my-tranches';
import { ProtectedRoute, useGlobalContext } from '@/store';

function Router() {
    const [showLoading, setShowLoading] = useState(true);
    const { setFirstLoad } = useGlobalContext();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoading(false);
            setFirstLoad(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Loader type="full-page" loading={showLoading} onlyHome>
            <Routes>
                <Route index element={<Navigate to="/overview" />} />
                <Route
                    path="/overview"
                    element={
                        <ProtectedRoute>
                            <Overview />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tranches"
                    element={
                        <ProtectedRoute>
                            <Tranches />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/markets"
                    element={
                        <ProtectedRoute>
                            <Markets />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staking"
                    element={
                        <ProtectedRoute>
                            <Staking />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/governance"
                    element={
                        <ProtectedRoute>
                            <Construction />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/develop"
                    element={
                        <ProtectedRoute>
                            <Construction />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/portfolio"
                    element={
                        <ProtectedRoute>
                            <Portfolio />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-tranches"
                    element={
                        <ProtectedRoute>
                            <MyTranches />
                        </ProtectedRoute>
                    }
                />

                {/* Dynamic Tranche Routes */}
                <Route
                    path="/tranches/:name"
                    element={
                        <ProtectedRoute>
                            <TrancheDetails />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Loader>
    );
}

export default Router;
