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
                <Route path="/overview" element={<Overview />} />
                <Route path="/tranches" element={<Tranches />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/staking" element={<Staking />} />
                <Route path="/governance" element={<Construction />} />
                <Route path="/develop" element={<Construction />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/my-tranches" element={<MyTranches />} />

                {/* Dynamic Tranche Routes */}
                <Route path="/tranches/:name" element={<TrancheDetails />} />
            </Routes>

            {/* <button
                onClick={() => openDialog('feedback-dialog')}
                className="fixed bottom-2 right-3 bg-brand-purple text-neutral-100 hover:opacity-95 transition duration-150 rounded-lg py-2 px-4 shadow-lg"
            >
                Send Feedback
            </button> */}
        </FullPageLoader>
    );
}

export default App;
