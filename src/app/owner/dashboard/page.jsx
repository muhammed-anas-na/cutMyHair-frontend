'use client';

import { Suspense } from 'react';
import DashboardContent from '../../../components/owner/Dashboard/page';

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
