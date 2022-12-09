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

function App() {
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setShowLoading(false), 5000);
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

                {/* Dynamic Tranche Routes */}
                <Route path="/tranches/:name" element={<TrancheDetails />} />
            </Routes>
        </FullPageLoader>
    );
}

export default App;
