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
import { useGlobalContext } from '@/store';

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
        <Loader type="full-page" loading={showLoading}>
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
        </Loader>
    );
}

export default Router;
