import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Overview from './pages/overview';
import Tranches from './pages/tranches';
import Staking from './pages/staking';
import Markets from './pages/markets';
import Construction from './pages/construction';
import TrancheDetails from './pages/tranche-details';
import TrancheOverview from './pages/tranche-overview';
import { useGeneralTokenData } from './hooks/user-data';

function App() {
    useGeneralTokenData();
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Navigate to="/overview" />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/tranches" element={<Tranches />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/staking" element={<Staking />} />
                <Route path="/governance" element={<Construction />} />
                <Route path="/develop" element={<Construction />} />

                {/* Dynamic Tranche Routes */}
                <Route path="/tranche/details" element={<TrancheDetails />} />
                <Route path="/tranche" element={<TrancheOverview />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
