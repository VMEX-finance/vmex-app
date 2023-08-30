import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { FullPageLoader } from './ui/components/loaders';
import Overview from './pages/overview';
import Tranches from './pages/tranches';
import Staking from './pages/staking';
import Markets from './pages/markets';
import Construction from './pages/construction';
import TrancheDetails from './pages/tranche-details';
import Portfolio from './pages/portfolio';
import MyTranches from './pages/my-tranches';
import { useDialogController } from './hooks';
import BetaLogin from './pages/beta-login';
import { ProtectedRoute } from './store';

function App() {
    const [showLoading, setShowLoading] = useState(true);
    const { openDialog } = useDialogController();

    useEffect(() => {
        const timeout = setTimeout(() => setShowLoading(false), 2000);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <FullPageLoader loading={showLoading} onlyHome>
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

                {/* For BETA */}
                <Route path="/beta-auth" element={<BetaLogin />} />

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

            {/* <button
                onClick={() => openDialog('feedback-dialog')}
                className="fixed bottom-2 right-3 bg-brand-purple text-neutral-100 hover:opacity-95 transition duration-100 rounded-lg py-2 px-4 shadow-lg"
            >
                Send Feedback
            </button> */}
        </FullPageLoader>
    );
}

export default App;
